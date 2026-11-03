import type { Metadata } from "next";
import Link from "next/link";
import { getSetting } from "@/lib/settings";
import { retreatEmailOf } from "@/lib/contact-links";
import { RetreatEmailNote } from "@/components/RetreatEmail";
import { confirmWithStripe } from "@/lib/orders";
import { stripeEnabled } from "@/lib/stripe";
import { formatMoney } from "@/lib/money";
import { AutoRefresh } from "@/components/AutoRefresh";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

/**
 * After payment.
 *  - Stripe Checkout bookings arrive with ?session_id=…; the booking is shown as
 *    confirmed only when our records (updated by Stripe's signed webhook, or a
 *    server-side check with Stripe) say it's paid — never because of the redirect.
 *  - Payment-link bookings: set https://YOUR-DOMAIN/booking/return as the
 *    "after payment" page in your provider. That can't confirm anything.
 */
export default async function BookingReturnPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const email = retreatEmailOf(await getSetting("contact"));
  const { session_id } = await searchParams;
  const order = session_id && stripeEnabled() ? await confirmWithStripe(session_id) : null;
  const paid = order?.status === "paid";
  const pending = order?.status === "pending";
  const attention = order?.status === "needs_attention";

  return (
    <div className="container-prose flex min-h-[70vh] flex-col justify-center pt-28 pb-20">
      <span aria-hidden className="font-display text-6xl text-blush-deep">☽︎</span>
      {paid ? (
        <>
          <h1 className="display-md mt-4">Your place is booked</h1>
          <div className="prose-witchy mt-6">
            <p><strong>{order.description}</strong></p>
            <p>We&rsquo;ve received your payment of {formatMoney(order.amount, order.currency)}{order.email ? <> and sent a confirmation to <strong>{order.email}</strong></> : null}. Stripe will email your receipt separately.</p>
            <p>Yulia will be in touch personally with everything you need before the retreat.</p>
            {order.mode === "test" && <p><em>This was a test payment — no real money was taken.</em></p>}
          </div>
        </>
      ) : pending ? (
        <>
          <AutoRefresh seconds={5} />
          <h1 className="display-md mt-4">Confirming your payment…</h1>
          <div className="prose-witchy mt-6">
            <p>Stripe hasn&rsquo;t confirmed the payment yet. This page checks again every few seconds. Some payment methods take longer — if so, you&rsquo;ll get an email as soon as it&rsquo;s confirmed.</p>
            <p>If you closed the payment page without paying, nothing has been charged.</p>
          </div>
        </>
      ) : attention ? (
        <>
          <h1 className="display-md mt-4">Thank you — Yulia will be in touch</h1>
          <div className="prose-witchy mt-6"><p>Your payment arrived, but something about the booking needs Yulia to check it personally (for example, the last place was taken while you were paying). She has been told and will email you soon to sort it out.</p></div>
        </>
      ) : (
        <>
          <h1 className="display-md mt-4">Thank you for choosing to join us</h1>
          <div className="prose-witchy mt-6">
            <p>If you completed payment, your payment provider will email you a receipt shortly.</p>
            <p><strong>Your place is confirmed once Yulia has checked your payment and emailed you personally</strong> — usually within a couple of working days. This page on its own isn&rsquo;t a booking confirmation.</p>
            <p>If you didn&rsquo;t finish paying, nothing has been charged and you can return to the retreat to try again.</p>
          </div>
        </>
      )}
      <RetreatEmailNote email={email} subject="Retreat booking" lead="Haven't heard back, or have a question about your booking?" className="mt-6" />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/retreats" className="btn-primary">Back to retreats</Link>
        <Link href="/contact" className="btn-outline">Contact Yulia</Link>
      </div>
    </div>
  );
}
