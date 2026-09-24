import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

/**
 * Set this page as the "after payment" redirect in your payment provider:
 *   https://YOUR-DOMAIN/booking/return
 * It deliberately does NOT confirm a booking — a redirect is not proof of payment.
 */
export default function BookingReturnPage() {
  return (
    <div className="container-prose flex min-h-[70vh] flex-col justify-center pt-28 pb-20">
      <span aria-hidden className="font-display text-6xl text-blush-deep">☾</span>
      <h1 className="display-md mt-4">Thank you for choosing to join us</h1>
      <div className="prose-witchy mt-6">
        <p>If you completed payment, your payment provider will email you a receipt shortly.</p>
        <p><strong>Your place is confirmed once Yulia has checked your payment and emailed you personally</strong> — usually within a couple of working days. This page on its own isn&rsquo;t a booking confirmation.</p>
        <p>If you didn&rsquo;t finish paying, nothing has been charged and you can return to the retreat to try again.</p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/retreats" className="btn-primary">Back to retreats</Link>
        <Link href="/contact" className="btn-outline">Contact Yulia</Link>
      </div>
    </div>
  );
}
