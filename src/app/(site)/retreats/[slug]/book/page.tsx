import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingSelection } from "@/lib/queries";
import { formatDateRange, nightsBetween } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { paymentMode } from "@/lib/env";
import { isBookable, AVAILABILITY_LABEL } from "@/components/Availability";
import { ArrowLeft, CalendarIcon, LockIcon, PinIcon } from "@/components/Icons";
import { ConfirmAndPay } from "@/components/ConfirmAndPay";

export const metadata: Metadata = { title: "Review your booking", robots: { index: false } };

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ option?: string; error?: string }> };

const ERRORS: Record<string, string> = {
  terms: "Please confirm you've read the booking terms before continuing.",
  unavailable: "Sorry — that option is no longer available. Please choose another.",
  nolink: "Online payment isn't set up for this option yet. Please contact us to book.",
};

export default async function BookPage(props: Props) {
  const { slug } = await props.params;
  const { option: optionId, error } = await props.searchParams;
  if (!optionId || !/^[0-9a-f-]{36}$/i.test(optionId)) notFound();
  const sel = await getBookingSelection(optionId);
  if (!sel || sel.retreat.slug !== slug) notFound();
  const { option, departure, retreat } = sel;
  const bookable = isBookable(option.availability) && isBookable(departure.availability);
  const mode = paymentMode();
  const link = mode === "live" ? option.paymentUrl : option.testPaymentUrl;
  const nights = nightsBetween(departure.startDate, departure.endDate);
  const balance = option.paymentType === "deposit" && option.totalPrice ? option.totalPrice - option.amount : null;

  return (
    <div className="container-prose pt-24 pb-24 lg:pt-32">
      <Link href={`/retreats/${retreat.slug}#book`} className="inline-flex items-center gap-2 text-sm text-plum link-underline"><ArrowLeft />Change selection</Link>
      <p className="eyebrow mt-8">Review your booking</p>
      <h1 className="display-md mt-3">You&rsquo;re about to reserve</h1>

      {error && ERRORS[error] && <p role="alert" className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-danger">{ERRORS[error]}</p>}

      <section className="card mt-8 overflow-hidden" aria-label="Booking summary">
        <div className="bg-plum-deep px-6 py-5 text-ivory">
          <p className="font-display text-3xl">{retreat.title}</p>
          <p className="mt-1 flex items-center gap-1.5 text-ivory/80"><PinIcon />{retreat.location}{retreat.country ? `, ${retreat.country}` : ""}</p>
        </div>
        <dl className="divide-y divide-line px-6">
          <div className="flex flex-wrap justify-between gap-2 py-4">
            <dt className="text-muted">Dates</dt>
            <dd className="flex items-center gap-2 font-medium"><CalendarIcon />{formatDateRange(departure.startDate, departure.endDate)} · {nights} night{nights === 1 ? "" : "s"}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 py-4">
            <dt className="text-muted">Option</dt>
            <dd className="text-right font-medium">{option.label}{option.description && <span className="block text-sm font-normal text-muted">{option.description}</span>}</dd>
          </div>
          {option.totalPrice && (
            <div className="flex flex-wrap justify-between gap-2 py-4">
              <dt className="text-muted">Total price</dt>
              <dd className="font-medium">{formatMoney(option.totalPrice, option.currency)}</dd>
            </div>
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-2 py-5">
            <dt className="font-medium">{option.paymentType === "deposit" ? "Deposit payable now" : "Full payment now"}</dt>
            <dd className="font-display text-4xl text-plum">{formatMoney(option.amount, option.currency)}</dd>
          </div>
          {option.paymentType === "deposit" && (
            <div className="py-4 text-sm text-ink/80">
              <p>
                This is a <strong>deposit</strong>, not the full price.
                {balance !== null && balance > 0 && <> The remaining balance of <strong>{formatMoney(balance, option.currency)}</strong> is payable later.</>}
                {option.balanceNote && <> {option.balanceNote}.</>}
              </p>
            </div>
          )}
        </dl>
      </section>

      {!bookable ? (
        <div className="mt-8 rounded-2xl bg-lavender/40 p-5">
          <p>This option is currently <strong>{AVAILABILITY_LABEL[option.availability === "available" ? departure.availability : option.availability].toLowerCase()}</strong>.</p>
          <Link href={`/retreats/${retreat.slug}#waitlist`} className="btn-outline mt-4">Join the waitlist</Link>
        </div>
      ) : !link ? (
        <div className="mt-8 rounded-2xl bg-sand/60 p-5">
          <p>Online payment isn&rsquo;t available for this option yet{mode === "test" ? " in this preview (no test payment link has been added)" : ""}. Please get in touch and Yulia will help you reserve your place.</p>
          <Link href={`/contact?retreat=${retreat.id}`} className="btn-primary mt-4">Contact Yulia</Link>
        </div>
      ) : (
        <ConfirmAndPay optionId={option.id} testMode={mode === "test"} />
      )}

      <div className="mt-10 grid gap-3 text-sm text-muted">
        <p className="flex gap-2"><LockIcon className="mt-0.5 h-4 w-4 shrink-0" />Payment is taken securely by our payment provider on their own page. We never see your card details.</p>
        <p>Your place is confirmed once Yulia has received your payment and emailed you. Returning to this website after paying does not by itself confirm a booking.</p>
      </div>
    </div>
  );
}
