import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/db";
import { stripeEvents } from "@/db/schema";
import { stripe, webhookSecret } from "@/lib/stripe";
import { markExpired, markFailed, markPaid, markRefunded } from "@/lib/orders";

/**
 * Stripe webhook: https://witchyportal.org/api/stripe/webhook
 * Events: checkout.session.completed, checkout.session.async_payment_succeeded,
 * checkout.session.async_payment_failed, checkout.session.expired, charge.refunded.
 * Every event is verified with STRIPE_WEBHOOK_SECRET and handled once.
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = webhookSecret();
  if (!sig || !secret) return NextResponse.json({ error: "Not configured" }, { status: 400 });
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("stripe webhook signature failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  // Handle each event once (Stripe retries and may resend)
  const inserted = await db.insert(stripeEvents).values({ id: event.id, type: event.type }).onConflictDoNothing().returning();
  if (!inserted.length) return NextResponse.json({ received: true, duplicate: true });

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await markPaid(event.data.object);
        break;
      case "checkout.session.async_payment_failed":
        await markFailed(event.data.object);
        break;
      case "checkout.session.expired":
        await markExpired(event.data.object);
        break;
      case "charge.refunded":
        await markRefunded(event.data.object);
        break;
    }
  } catch (e) {
    // Let Stripe retry: forget the event so the retry is processed
    console.error("stripe webhook handling failed", event.type, e instanceof Error ? e.message : e);
    await db.delete(stripeEvents).where(eq(stripeEvents.id, event.id));
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
