/**
 * Stripe payments, end to end against the local database with a fake Stripe
 * client (no network). Real webhook signatures are generated and verified.
 * Skipped when DATABASE_URL isn't set.
 */
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
vi.mock("server-only", () => ({}));
import Stripe from "stripe";

const DB = process.env.DATABASE_URL;
process.env.STRIPE_SECRET_KEY = "sk_test_fake_for_tests";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret_for_witchy_tests";
process.env.AUTH_SECRET ||= "x".repeat(40);
process.env.PAYMENT_MODE = "test";

describe("Stripe configuration", async () => {
  const { stripeProblem } = await import("../src/lib/stripe");
  const { reportHash } = await import("../src/lib/report-purchase");
  it("refuses a live key on a test deployment", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_abc";
    expect(stripeProblem()).toMatch(/LIVE/);
    process.env.STRIPE_SECRET_KEY = "sk_test_fake_for_tests";
    expect(stripeProblem()).toBeNull();
  });
  it("report hash ignores names and the order of the two people", () => {
    const a = { date: "1990-06-15", time: "08:20", placeId: 1 }, b = { date: "1993-09-25", time: null, placeId: 2 };
    expect(reportHash(a, b)).toBe(reportHash(b, a));
    expect(reportHash(a, b)).not.toBe(reportHash(a, { ...b, time: "11:00" }));
    expect(reportHash(a, b)).not.toContain("1990");
  });
});

describe.skipIf(!DB)("retreat booking with Stripe Checkout", () => {
  let ids: { retreat: string; departure: string; option: string };
  let created: Stripe.Checkout.SessionCreateParams[] = [];
  const real = new Stripe("sk_test_fake_for_tests");

  beforeAll(async () => {
    const { db } = await import("../src/db");
    const s = await import("../src/db/schema");
    const { __setStripeForTests } = await import("../src/lib/stripe");
    let n = 0;
    __setStripeForTests({
      checkout: { sessions: {
        create: async (p: Stripe.Checkout.SessionCreateParams) => { created.push(p); n++; return { id: `cs_test_fake${n}${Date.now()}`, url: `https://checkout.stripe.com/c/pay/fake${n}` }; },
        retrieve: async (id: string) => ({ id, payment_status: "unpaid" }),
      } },
      webhooks: real.webhooks,
    } as unknown as Stripe);
    const [r] = await db.insert(s.retreats).values({ slug: `stripe-test-${Date.now()}`, title: "Stripe Test Retreat", status: "published" }).returning();
    const [d] = await db.insert(s.departures).values({ retreatId: r.id, startDate: "2027-05-20", endDate: "2027-05-24" }).returning();
    const [o] = await db.insert(s.bookingOptions).values({ departureId: d.id, label: "Shared room", amount: 25000, currency: "GBP", checkoutMethod: "stripe", capacity: 1 }).returning();
    ids = { retreat: r.id, departure: d.id, option: o.id };
    created = [];
  });
  afterAll(async () => {
    if (!ids) return;
    const { db } = await import("../src/db");
    const s = await import("../src/db/schema");
    const { eq } = await import("drizzle-orm");
    await db.delete(s.orders).where(eq(s.orders.optionId, ids.option));
    await db.delete(s.retreats).where(eq(s.retreats.id, ids.retreat));
  });

  it("holds the last place, refuses a second buyer, confirms via a signed webhook and sells out", async () => {
    const { db } = await import("../src/db");
    const s = await import("../src/db/schema");
    const { eq } = await import("drizzle-orm");
    const { startRetreatCheckout } = await import("../src/lib/orders");
    const sel = async () => {
      const [option] = await db.select().from(s.bookingOptions).where(eq(s.bookingOptions.id, ids.option));
      const [departure] = await db.select().from(s.departures).where(eq(s.departures.id, ids.departure));
      const [retreat] = await db.select().from(s.retreats).where(eq(s.retreats.id, ids.retreat));
      return { option, departure, retreat };
    };

    const first = await startRetreatCheckout(await sel());
    expect("url" in first).toBe(true);
    expect(created[0].line_items![0].price_data!.unit_amount).toBe(25000);
    expect(created[0].line_items![0].price_data!.currency).toBe("gbp");

    // Two at once for the last place: both refused while the hold is live
    const [x, y] = await Promise.all([startRetreatCheckout(await sel()), startRetreatCheckout(await sel())]);
    expect(x).toEqual({ error: "full" });
    expect(y).toEqual({ error: "full" });

    const [order] = await db.select().from(s.orders).where(eq(s.orders.optionId, ids.option));
    expect(order.status).toBe("pending");

    // Stripe calls the webhook
    const { POST } = await import("../src/app/api/stripe/webhook/route");
    const event = {
      id: `evt_test_${Date.now()}`, object: "event", type: "checkout.session.completed",
      data: { object: { id: order.stripeSessionId, object: "checkout.session", payment_status: "paid", amount_total: 25000, currency: "gbp", client_reference_id: order.id, metadata: { orderId: order.id }, payment_intent: "pi_test_1", customer_details: { name: "Test Guest", email: "guest@example.com", phone: "+447000000000" } } },
    };
    const payload = JSON.stringify(event);
    const header = real.webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET! });
    const call = (sig: string) => POST(new Request("http://localhost/api/stripe/webhook", { method: "POST", body: payload, headers: { "stripe-signature": sig } }) as never);

    expect((await call("t=1,v1=bad")).status).toBe(400);
    expect((await call(header)).status).toBe(200);
    const dup = await (await call(header)).json();
    expect(dup.duplicate).toBe(true);

    const [paid] = await db.select().from(s.orders).where(eq(s.orders.id, order.id));
    expect(paid.status).toBe("paid");
    expect(paid.email).toBe("guest@example.com");
    const [opt] = await db.select().from(s.bookingOptions).where(eq(s.bookingOptions.id, ids.option));
    expect(opt.availability).toBe("sold_out");

    expect(await startRetreatCheckout(await sel())).toEqual({ error: "unavailable" });
  });

  it("flags a payment whose amount doesn't match", async () => {
    const { db } = await import("../src/db");
    const s = await import("../src/db/schema");
    const { eq } = await import("drizzle-orm");
    const { markPaid } = await import("../src/lib/orders");
    const [o] = await db.insert(s.orders).values({ kind: "synastry", mode: "test", amount: 1499, currency: "GBP", description: "report", stripeSessionId: `cs_test_amt${Date.now()}`, inputHash: "h" }).returning();
    const r = await markPaid({ id: o.stripeSessionId!, payment_status: "paid", amount_total: 100, currency: "gbp", metadata: { orderId: o.id }, customer_details: null, payment_intent: null } as unknown as Stripe.Checkout.Session);
    expect(r?.status).toBe("needs_attention");
    await db.delete(s.orders).where(eq(s.orders.id, o.id));
  });
});
