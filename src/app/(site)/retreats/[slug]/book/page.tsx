import type { Metadata } from "next";
import Link from "@/i18n/client";
import { notFound } from "next/navigation";
import { getBookingSelection } from "@/lib/queries";
import { formatDateRange, nightsBetween } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { paymentMode } from "@/lib/env";
import { isBookable, AVAILABILITY_LABEL } from "@/components/Availability";
import { ArrowLeft, CalendarIcon, LockIcon, PinIcon } from "@/components/Icons";
import { ConfirmAndPay } from "@/components/ConfirmAndPay";
import { TrackView } from "@/components/Track";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Review your booking"), robots: { index: false } };
}

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ option?: string; error?: string; cancelled?: string }> };

const ERRORS: Record<string, string> = {
  terms: msg("Please confirm you've read the booking terms before continuing."),
  unavailable: msg("Sorry — that option is no longer available. Please choose another."),
  nolink: msg("Online payment isn't set up for this option yet. Please contact us to book."),
  full: msg("Sorry — every place for this option is taken or being paid for right now. Places held for unfinished payments are released after 30 minutes, so you can try again then or join the waitlist."),
  stripe: msg("We couldn't open the payment page just now. Nothing has been charged — please try again in a moment."),
};

import { getSetting } from "@/lib/settings";
import { getI18n } from "@/i18n/server";
import { translateRetreat } from "@/i18n/content";
import { msg } from "@/i18n/config";
import { stripeEnabled, stripeMode } from "@/lib/stripe";
import { placesTaken } from "@/lib/orders";
import { retreatEmailOf } from "@/lib/contact-links";
import { RetreatEmailNote } from "@/components/RetreatEmail";

export default async function BookPage(props: Props) {
  const { slug } = await props.params;
  const { option: optionId, error, cancelled } = await props.searchParams;
  if (!optionId || !/^[0-9a-f-]{36}$/i.test(optionId)) notFound();
  const sel = await getBookingSelection(optionId);
  if (!sel || sel.retreat.slug !== slug) notFound();
  const { t, tc, info } = await getI18n();
  const option = { ...sel.option, label: tc(sel.option.label), description: tc(sel.option.description), balanceNote: tc(sel.option.balanceNote) };
  const departure = sel.departure;
  const retreat = translateRetreat(sel.retreat, tc);
  const bookable = isBookable(option.availability) && isBookable(departure.availability);
  const mode = paymentMode();
  const useStripe = option.checkoutMethod === "stripe" && stripeEnabled();
  const link = useStripe ? "stripe" : mode === "live" ? option.paymentUrl : option.testPaymentUrl;
  const testMode = useStripe ? stripeMode() === "test" : mode === "test";
  const left = useStripe && option.capacity != null ? Math.max(0, option.capacity - (await placesTaken(option.id))) : null;
  const nights = nightsBetween(departure.startDate, departure.endDate);
  const email = retreatEmailOf(await getSetting("contact"));
  const balance = option.paymentType === "deposit" && option.totalPrice ? option.totalPrice - option.amount : null;

  return (
    <div className="container-prose pt-24 pb-24 lg:pt-32">
      <TrackView name="review_view" props={{ retreat: retreat.slug }} />
      <Link href={`/retreats/${retreat.slug}#book`} className="inline-flex items-center gap-2 text-sm text-plum link-underline"><ArrowLeft />{t("Change selection")}</Link>
      <p className="eyebrow mt-8">{t("Review your booking")}</p>
      <h1 className="display-md mt-3">{t("You’re about to reserve")}</h1>

      {error && ERRORS[error] && <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-danger">{t(ERRORS[error])}</p>}
      {cancelled && !error && <p role="status" className="mt-6 rounded-xl bg-lavender/40 px-4 py-3 text-plum">{t("Payment cancelled — nothing has been charged. Your selection is below if you’d like to try again.")}</p>}

      <section className="card mt-8 overflow-hidden" aria-label={t("Booking summary")}>
        <div className="bg-plum-deep px-6 py-5 text-ivory">
          <p className="font-display text-3xl">{retreat.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-ivory/80"><PinIcon />{retreat.location}{retreat.country ? `, ${retreat.country}` : ""}</p>
        </div>
        <dl className="divide-y divide-line px-6">
          <div className="flex flex-wrap justify-between gap-2 py-4">
            <dt className="text-muted">{t("Dates")}</dt>
            <dd className="flex items-center gap-2 font-medium"><CalendarIcon />{formatDateRange(departure.startDate, departure.endDate, info.intl)} · {nights === 1 ? t("1 night") : t("{n} nights", { n: nights })}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 py-4">
            <dt className="text-muted">{t("Option")}</dt>
            <dd className="text-right font-medium">{option.label}{option.description && <span className="block text-sm font-normal text-muted">{option.description}</span>}</dd>
          </div>
          {option.totalPrice && (
            <div className="flex flex-wrap justify-between gap-2 py-4">
              <dt className="text-muted">{t("Total price")}</dt>
              <dd className="font-medium">{formatMoney(option.totalPrice, option.currency)}</dd>
            </div>
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-2 py-5">
            <dt className="font-medium">{option.paymentType === "deposit" ? t("Deposit payable now") : t("Full payment now")}</dt>
            <dd className="font-display text-4xl text-plum">{formatMoney(option.amount, option.currency)}</dd>
          </div>
          {option.paymentType === "deposit" && balance !== null && balance > 0 && (
            <div className="flex flex-wrap justify-between gap-2 py-4">
              <dt className="text-muted">{t("Remaining balance")}</dt>
              <dd className="text-right font-medium">{formatMoney(balance, option.currency)}{option.balanceNote && <span className="block text-sm font-normal text-muted">{option.balanceNote}</span>}</dd>
            </div>
          )}
          {option.paymentType === "deposit" && (
            <div className="py-4 text-sm text-ink/80">
              <p>
                {t("This is a deposit, not the full price.")}
                {balance !== null && balance > 0 && <> {t("The remaining balance of {price} is payable later.", { price: formatMoney(balance, option.currency) })}</>}
                {option.balanceNote && <> {option.balanceNote}.</>}
              </p>
            </div>
          )}
        </dl>
      </section>

      {!bookable ? (
        <div className="mt-8 rounded-2xl bg-lavender/40 p-5">
          <p>{t("This option is currently: {status}", { status: t(AVAILABILITY_LABEL[option.availability === "available" ? departure.availability : option.availability]) })}</p>
          <Link href={`/retreats/${retreat.slug}#waitlist`} className="btn-outline mt-4">{t("Join the waitlist")}</Link>
        </div>
      ) : !link ? (
        <div className="mt-8 rounded-2xl bg-sand/60 p-5">
          <p>{t("Online payment isn’t available for this option yet. Please get in touch and Yulia will help you reserve your place.")}{mode === "test" ? " (preview: no test payment link)" : ""}</p>
          <Link href={`/contact?retreat=${retreat.id}`} className="btn-primary mt-4">{t("Contact Yulia")}</Link>
        </div>
      ) : (
        <>
          {left !== null && left <= 3 && <p className="mt-8 text-sm font-medium text-plum">{left === 0 ? t("All places are currently held — places from unfinished payments are released after 30 minutes.") : left === 1 ? t("1 place left for this option.") : t("{n} places left for this option.", { n: left })}</p>}
          <ConfirmAndPay optionId={option.id} testMode={testMode} />
          {useStripe && <p className="mt-3 text-sm text-muted">{t("You’ll pay on Stripe’s secure page. Your place is held for 30 minutes while you pay, and you’ll get an email confirming your booking as soon as the payment goes through.")}</p>}
        </>
      )}

      <div className="mt-10 grid gap-3 text-sm text-muted">
        <p className="flex gap-2"><LockIcon className="mt-0.5 h-4 w-4 shrink-0" />{t("Payment is taken securely by our payment provider on their own page. We never see your card details.")}</p>
        <p>{useStripe ? t("Your place is confirmed by email as soon as Stripe confirms your payment.") : t("Your place is confirmed once Yulia has received your payment and emailed you. Returning to this website after paying does not by itself confirm a booking.")}</p>
        <RetreatEmailNote email={email} subject={`${retreat.title} — booking question`} lead={t("Questions before you pay?")} className="text-sm" />
      </div>
    </div>
  );
}
