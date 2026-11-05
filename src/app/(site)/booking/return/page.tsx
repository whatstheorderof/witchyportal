import type { Metadata } from "next";
import Link from "@/i18n/client";
import { getSetting } from "@/lib/settings";
import { retreatEmailOf } from "@/lib/contact-links";
import { RetreatEmailNote } from "@/components/RetreatEmail";
import { confirmWithStripe } from "@/lib/orders";
import { stripeEnabled } from "@/lib/stripe";
import { formatMoney } from "@/lib/money";
import { AutoRefresh } from "@/components/AutoRefresh";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Thank you"), robots: { index: false } };
}

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
  const { t, tc } = await getI18n();
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
          <h1 className="display-md mt-4">{t("Your place is booked")}</h1>
          <div className="prose-witchy mt-6">
            <p><strong>{tc(order.description)}</strong></p>
            <p>{order.email ? t("We’ve received your payment of {price} and sent a confirmation to {email}. Stripe will email your receipt separately.", { price: formatMoney(order.amount, order.currency), email: order.email }) : t("We’ve received your payment of {price}. Stripe will email your receipt separately.", { price: formatMoney(order.amount, order.currency) })}</p>
            <p>{t("Yulia will be in touch personally with everything you need before the retreat.")}</p>
            {order.mode === "test" && <p><em>{t("This was a test payment — no real money was taken.")}</em></p>}
          </div>
        </>
      ) : pending ? (
        <>
          <AutoRefresh seconds={5} />
          <h1 className="display-md mt-4">{t("Confirming your payment…")}</h1>
          <div className="prose-witchy mt-6">
            <p>{t("Stripe hasn’t confirmed the payment yet. This page checks again every few seconds. Some payment methods take longer — if so, you’ll get an email as soon as it’s confirmed.")}</p>
            <p>{t("If you closed the payment page without paying, nothing has been charged.")}</p>
          </div>
        </>
      ) : attention ? (
        <>
          <h1 className="display-md mt-4">{t("Thank you — Yulia will be in touch")}</h1>
          <div className="prose-witchy mt-6"><p>{t("Your payment arrived, but something about the booking needs Yulia to check it personally (for example, the last place was taken while you were paying). She has been told and will email you soon to sort it out.")}</p></div>
        </>
      ) : (
        <>
          <h1 className="display-md mt-4">{t("Thank you for choosing to join us")}</h1>
          <div className="prose-witchy mt-6">
            <p>{t("If you completed payment, your payment provider will email you a receipt shortly.")}</p>
            <p><strong>{t("Your place is confirmed once Yulia has checked your payment and emailed you personally")}</strong> — {t("usually within a couple of working days. This page on its own isn’t a booking confirmation.")}</p>
            <p>{t("If you didn’t finish paying, nothing has been charged and you can return to the retreat to try again.")}</p>
          </div>
        </>
      )}
      <RetreatEmailNote email={email} subject="Retreat booking" lead={t("Haven't heard back, or have a question about your booking?")} className="mt-6" />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/retreats" className="btn-primary">{t("Back to retreats")}</Link>
        <Link href="/contact" className="btn-outline">{t("Contact Yulia")}</Link>
      </div>
    </div>
  );
}
