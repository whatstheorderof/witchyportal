import Link from "next/link";
import type { RetreatCard } from "@/lib/queries";
import { retreatFacts } from "@/lib/retreat-facts";
import { MediaImage } from "./MediaImage";
import { AvailabilityBadge } from "./Availability";
import { ArrowRight } from "./Icons";

function Fact({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd className={`mt-0.5 font-medium leading-snug ${muted ? "text-muted" : "text-ink"}`}>{value}</dd>
    </div>
  );
}

/**
 * Everything needed to assess the next retreat in one place:
 * destination, dates, duration, starting price and availability.
 */
export function RetreatBookingCard({ retreat, layout = "wide", showImage = true }: { retreat: Omit<RetreatCard, "gallery">; layout?: "wide" | "stacked"; showImage?: boolean }) {
  const f = retreatFacts(retreat);
  const stacked = layout === "stacked";
  return (
    <article className={`card overflow-hidden bg-white ${stacked ? "" : "sm:grid sm:grid-cols-[minmax(0,240px)_1fr]"}`} aria-label={`${retreat.title} — booking summary`}>
      {showImage && (
        <div className={`relative bg-sand ${stacked ? "aspect-[16/9]" : "aspect-[16/9] sm:aspect-auto"}`}>
          <MediaImage media={retreat.hero} fallback="horns" sizes="(min-width:640px) 240px, 92vw" />
          {f.availability && <AvailabilityBadge value={f.availability} solid className="absolute left-3 top-3" />}
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="eyebrow">{f.datesKnown ? "Next retreat" : "Upcoming retreat"}</p>
        <h3 className="mt-1 font-display text-[1.7rem] leading-tight text-plum">
          <Link href={`/retreats/${retreat.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">{retreat.title}</Link>
        </h3>
        <dl className={`mt-4 grid gap-x-6 gap-y-3 ${stacked ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"}`}>
          <Fact label="Destination" value={f.destination} muted={!f.destinationKnown} />
          <Fact label="Dates" value={f.dates} muted={!f.datesKnown} />
          <Fact label="Duration" value={f.duration} />
          <Fact label="Price" value={f.price} muted={!f.priceKnown} />
        </dl>
        {!showImage && f.availability && <div className="mt-4"><AvailabilityBadge value={f.availability} /></div>}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/retreats/${retreat.slug}#book`} className="btn-primary min-h-11">
            {f.bookable ? "Choose dates & book" : "Join the waitlist"} <ArrowRight />
          </Link>
          <Link href={`/retreats/${retreat.slug}`} className="btn-outline min-h-11">See the retreat</Link>
        </div>
        {!f.datesKnown && <p className="mt-3 text-sm text-muted">Dates and prices are coming soon — waitlist members hear first.</p>}
      </div>
    </article>
  );
}

