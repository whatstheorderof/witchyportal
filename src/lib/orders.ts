import "server-only";
/**
 * Orders paid through Stripe Checkout: retreat places (with a capacity, so
 * the last place can't be sold twice) and paid reports.
 *
 *  1. Before the visitor goes to Stripe, a "pending" order is created inside
 *     a database transaction that locks the booking option, so two people
 *     can't both take the last place. The hold lasts 30 minutes — the same
 *     time the Stripe Checkout page stays open.
 *  2. The order becomes "paid" only when Stripe says so: the signed webhook
 *     (checkout.session.completed / async_payment_succeeded), or a server-side
 *     check with Stripe's API on the return page. A redirect alone proves
 *     nothing.
 *  3. When an option's places are all paid, it is marked sold out.
 */
import { and, eq, gt, inArray, or, sql } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db";
import * as s from "@/db/schema";
import { absolute, stripe, stripeCurrency, stripeMode } from "./stripe";
import { sendEmail } from "./email";
import { getSetting } from "./settings";
import { retreatEmailOf } from "./contact-links";
import { formatMoney } from "./money";
import { formatDateRange } from "./dates";

const HOLD_MS = 30 * 60 * 1000; // Stripe's minimum Checkout lifetime is 30 minutes
const ok = (a: string) => a === "available" || a === "limited";

/** Places taken for an option: paid, plus unexpired holds. */
export async function placesTaken(optionId: string, tx: Pick<typeof db, "select"> = db) {
  const [row] = await tx
    .select({ n: sql<number>`coalesce(sum(${s.orders.quantity}), 0)::int` })
    .from(s.orders)
    .where(and(eq(s.orders.optionId, optionId), or(inArray(s.orders.status, ["paid", "needs_attention"]), and(eq(s.orders.status, "pending"), gt(s.orders.expiresAt, new Date())))));
  return row?.n ?? 0;
}
export async function placesPaid(optionIds: string[]) {
  if (!optionIds.length) return new Map<string, number>();
  const rows = await db
    .select({ id: s.orders.optionId, n: sql<number>`coalesce(sum(${s.orders.quantity}), 0)::int` })
    .from(s.orders)
    .where(and(inArray(s.orders.optionId, optionIds), eq(s.orders.status, "paid")))
    .groupBy(s.orders.optionId);
  return new Map(rows.map((r) => [r.id!, r.n]));
}

type Selection = { option: s.BookingOption; departure: typeof s.departures.$inferSelect; retreat: typeof s.retreats.$inferSelect };

/** Hold a place and open a Stripe Checkout page. Returns the Stripe URL or a reason it can't. */
export async function startRetreatCheckout(sel: Selection): Promise<{ url: string } | { error: "unavailable" | "full" | "stripe" }> {
  const { option, departure, retreat } = sel;
  const description = `${retreat.title} · ${formatDateRange(departure.startDate, departure.endDate)} · ${option.label}`;
  const mode = stripeMode();
  const held = await db.transaction(async (tx) => {
    const [o] = await tx.select().from(s.bookingOptions).where(eq(s.bookingOptions.id, option.id)).for("update");
    if (!o || !ok(o.availability)) return { error: "unavailable" as const };
    if (o.capacity != null && (await placesTaken(o.id, tx)) >= o.capacity) return { error: "full" as const };
    const [order] = await tx.insert(s.orders).values({
      kind: "retreat", mode, amount: o.amount, currency: o.currency, description, optionId: o.id, expiresAt: new Date(Date.now() + HOLD_MS + 60000),
    }).returning();
    return { order };
  });
  if (!("order" in held) || !held.order) return { error: held.error ?? "unavailable" };
  const order = held.order;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: stripeCurrency(option.currency),
          unit_amount: option.amount,
          product_data: { name: `${retreat.title} — ${option.label}`, description: `${formatDateRange(departure.startDate, departure.endDate)}${option.paymentType === "deposit" ? ` · deposit${option.totalPrice ? ` towards ${formatMoney(option.totalPrice, option.currency)}` : ""}` : ""}` },
        },
      }],
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      expires_at: Math.floor((Date.now() + HOLD_MS) / 1000),
      client_reference_id: order.id,
      metadata: { orderId: order.id, kind: "retreat", optionId: option.id },
      payment_intent_data: { description, metadata: { orderId: order.id, kind: "retreat" } },
      success_url: absolute(`/booking/return?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absolute(`/retreats/${retreat.slug}/book?option=${option.id}&cancelled=1`),
    }, { idempotencyKey: `order-${order.id}` });
    await db.update(s.orders).set({ stripeSessionId: session.id, updatedAt: new Date() }).where(eq(s.orders.id, order.id));
    return { url: session.url! };
  } catch (e) {
    console.error("stripe checkout create failed", e instanceof Error ? e.message : e);
    await db.update(s.orders).set({ status: "cancelled", note: "Stripe Checkout could not be created", updatedAt: new Date() }).where(eq(s.orders.id, order.id));
    return { error: "stripe" };
  }
}

/** Open a Stripe Checkout page for a paid report (no birth details leave the server; only the HMAC is stored). */
export async function startReportCheckout(o: { inputHash: string; amount: number; currency: string; title: string; returnPath: string }): Promise<{ url: string } | { error: "stripe" }> {
  const [order] = await db.insert(s.orders).values({ kind: "synastry", mode: stripeMode(), amount: o.amount, currency: o.currency, description: o.title, inputHash: o.inputHash }).returning();
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ quantity: 1, price_data: { currency: stripeCurrency(o.currency), unit_amount: o.amount, product_data: { name: o.title } } }],
      customer_creation: "if_required",
      client_reference_id: order.id,
      metadata: { orderId: order.id, kind: "synastry" },
      payment_intent_data: { description: o.title, metadata: { orderId: order.id, kind: "synastry" } },
      success_url: absolute(`${o.returnPath}?paid={CHECKOUT_SESSION_ID}`),
      cancel_url: absolute(`${o.returnPath}?cancelled=1`),
    }, { idempotencyKey: `order-${order.id}` });
    await db.update(s.orders).set({ stripeSessionId: session.id, updatedAt: new Date() }).where(eq(s.orders.id, order.id));
    return { url: session.url! };
  } catch (e) {
    console.error("stripe report checkout failed", e instanceof Error ? e.message : e);
    await db.update(s.orders).set({ status: "cancelled", note: "Stripe Checkout could not be created", updatedAt: new Date() }).where(eq(s.orders.id, order.id));
    return { error: "stripe" };
  }
}

/** The order for a Checkout Session, found by the session id or the order id in its metadata. */
async function orderFor(session: Stripe.Checkout.Session) {
  const id = session.metadata?.orderId ?? session.client_reference_id ?? null;
  const [o] = await db.select().from(s.orders).where(id && /^[0-9a-f-]{36}$/i.test(id) ? or(eq(s.orders.stripeSessionId, session.id), eq(s.orders.id, id)) : eq(s.orders.stripeSessionId, session.id)).limit(1);
  return o ?? null;
}

/** Record a paid Checkout Session. Safe to call more than once. */
export async function markPaid(session: Stripe.Checkout.Session): Promise<s.Order | null> {
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return null;
  const found = await orderFor(session);
  if (!found) { console.error("stripe: paid session with no order", session.id); return null; }
  if (found.status === "paid" || found.status === "needs_attention" || found.status === "refunded") return found;
  // Never trust an amount we didn't ask for
  const amountOk = session.amount_total === found.amount && session.currency === stripeCurrency(found.currency);
  const details = session.customer_details;
  const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const result = await db.transaction(async (tx) => {
    let status: "paid" | "needs_attention" = amountOk ? "paid" : "needs_attention";
    let note: string | null = amountOk ? null : `Amount paid (${session.amount_total} ${session.currency}) differs from the order — check in Stripe.`;
    if (found.optionId && status === "paid") {
      const [o] = await tx.select().from(s.bookingOptions).where(eq(s.bookingOptions.id, found.optionId)).for("update");
      if (o?.capacity != null) {
        // Paid after the hold expired? Make sure the place wasn't sold to someone else meanwhile.
        const [row] = await tx.select({ n: sql<number>`coalesce(sum(${s.orders.quantity}), 0)::int` }).from(s.orders)
          .where(and(eq(s.orders.optionId, o.id), inArray(s.orders.status, ["paid", "needs_attention"])));
        if ((row?.n ?? 0) + found.quantity > o.capacity) { status = "needs_attention"; note = "Paid after the place was released and the option is now full — offer another date or refund in Stripe."; }
      }
    }
    const [updated] = await tx.update(s.orders).set({
      status, note, paidAt: new Date(), stripeSessionId: session.id, stripePaymentIntent: pi,
      name: details?.name ?? null, email: details?.email ?? null, phone: details?.phone ?? null, updatedAt: new Date(),
    }).where(and(eq(s.orders.id, found.id), inArray(s.orders.status, ["pending", "expired", "cancelled"]))).returning();
    if (updated?.optionId) await syncAvailability(updated.optionId, tx);
    return updated ?? null;
  });
  if (result) await notifyPaid(result).catch((e) => console.error("paid email failed", e));
  return result;
}

/** Sold out when all places are paid; back to available/limited is left to Yulia. */
export async function syncAvailability(optionId: string, tx: Pick<typeof db, "select" | "update"> = db) {
  const [o] = await tx.select().from(s.bookingOptions).where(eq(s.bookingOptions.id, optionId));
  if (!o || o.capacity == null) return;
  const [row] = await tx.select({ n: sql<number>`coalesce(sum(${s.orders.quantity}), 0)::int` }).from(s.orders).where(and(eq(s.orders.optionId, optionId), eq(s.orders.status, "paid")));
  const paid = row?.n ?? 0;
  const next = paid >= o.capacity ? "sold_out" : o.capacity - paid <= 2 && o.availability === "available" ? "limited" : o.availability;
  if (next !== o.availability) await tx.update(s.bookingOptions).set({ availability: next, updatedAt: new Date() }).where(eq(s.bookingOptions.id, optionId));
}

export async function markExpired(session: Stripe.Checkout.Session) {
  await db.update(s.orders).set({ status: "expired", updatedAt: new Date() }).where(and(eq(s.orders.stripeSessionId, session.id), eq(s.orders.status, "pending")));
}
export async function markFailed(session: Stripe.Checkout.Session) {
  await db.update(s.orders).set({ status: "cancelled", note: "The payment failed (bank transfer or delayed method).", updatedAt: new Date() }).where(and(eq(s.orders.stripeSessionId, session.id), eq(s.orders.status, "pending")));
}
export async function markRefunded(charge: Stripe.Charge) {
  const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!pi || !charge.refunded) return; // partial refunds stay "paid"; see the note in Stripe
  await db.update(s.orders).set({ status: "refunded", updatedAt: new Date() }).where(eq(s.orders.stripePaymentIntent, pi));
}

/** Check a session directly with Stripe (used on return pages, in case the webhook is still on its way). */
export async function confirmWithStripe(sessionId: string): Promise<s.Order | null> {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  const [o] = await db.select().from(s.orders).where(eq(s.orders.stripeSessionId, sessionId)).limit(1);
  if (!o) return null;
  if (o.status !== "pending") return o;
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    return (await markPaid(session)) ?? o;
  } catch (e) {
    console.error("stripe retrieve failed", e instanceof Error ? e.message : e);
    return o;
  }
}

async function notifyPaid(o: s.Order) {
  const contact = await getSetting("contact");
  const yulia = retreatEmailOf(contact);
  const money = formatMoney(o.amount, o.currency);
  const first = (o.name ?? "").split(/\s+/)[0] || "there";
  const test = o.mode === "test" ? " [TEST]" : "";
  if (o.kind === "retreat") {
    if (o.email && o.status === "paid") {
      await sendEmail({
        to: o.email, toName: o.name ?? undefined, replyTo: yulia || undefined,
        subject: `Your place is booked${test}: ${o.description}`,
        heading: `Your place is booked, ${first}`,
        paragraphs: [
          `Thank you — your payment of ${money} has been received and your place is confirmed:`,
          o.description,
          "Stripe will send your receipt separately. Yulia will be in touch personally with everything you need to know before the retreat.",
          "If you have any questions, just reply to this email.",
          "With love and magic,\nYulia Moon",
        ],
      });
    }
    if (yulia) {
      await sendEmail({
        to: yulia, replyTo: o.email ?? undefined,
        subject: `${o.status === "paid" ? "New booking" : "Booking needs attention"}${test}: ${o.name ?? "a guest"} — ${o.description}`,
        heading: o.status === "paid" ? "A retreat place has been paid" : "A payment needs your attention",
        paragraphs: [
          `${o.name ?? "A guest"}${o.email ? ` <${o.email}>` : ""}${o.phone ? `, ${o.phone}` : ""} paid ${money}.`,
          o.description,
          ...(o.note ? [o.note] : []),
          "All bookings are in Admin → Orders. Reply to this email to write to the guest.",
        ],
      });
    }
  } else if (yulia && o.status !== "paid") {
    await sendEmail({ to: yulia, subject: `Report payment needs attention${test}`, heading: "A report payment needs attention", paragraphs: [`${o.email ?? "A customer"} paid ${money} for ${o.description}.`, o.note ?? ""] });
  }
}
