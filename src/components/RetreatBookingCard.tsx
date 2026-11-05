import Link from "@/i18n/client";
import type { RetreatCard } from "@/lib/queries";
import { retreatFacts } from "@/lib/retreat-facts";
import { MediaImage } from "./MediaImage";
import { AvailabilityBadge } from "./Availability";
import { ArrowRight } from "./Icons";
import { getI18n } from "@/i18n/server";

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
export async function RetreatBookingCard({ retreat, layout = "wide", showImage = true }: { retreat: Omit<RetreatCard, "gallery">; layout?: "wide" | "stacked"; showImage?: boolean }) {
  const { t, tc, info } = await getI18n();
  const f = retreatFacts(retreat, t, info.intl, tc);
  const stacked = layout === "stacked";
  return (
    <article className={`card overflow-hidden bg-white ${stacked ? "" : "sm:grid sm:grid-cols-[minmax(0,240px)_1fr]"}`} aria-label={t("{title} — booking summary", { title: tc(retreat.title) })}>
      {showImage && (
        <div className={`relative bg-sand ${stacked ? "aspect-[16/9]" : "aspect-[16/9] sm:aspect-auto"}`}>
          <MediaImage media={retreat.hero} fallback="horns" sizes="(min-width:640px) 240px, 92vw" />
          {f.availability && <AvailabilityBadge value={f.availability} solid className="absolute start-3 top-3" />}
        </div>
      )}
      <div className="p-5 sm:p-6">
        <p className="eyebrow">{f.datesKnown ? t("Next retreat") : t("Upcoming retreat")}</p>
        <h3 className="mt-1 font-display text-[1.7rem] leading-tight text-plum">
          <Link href={`/retreats/${retreat.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">{tc(retreat.title)}</Link>
        </h3>
        <dl className={`mt-4 grid gap-x-6 gap-y-3 ${stacked ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"}`}>
          <Fact label={t("Destination")} value={f.destination} muted={!f.destinationKnown} />
          <Fact label={t("Dates")} value={f.dates} muted={!f.datesKnown} />
          <Fact label={t("Duration")} value={f.duration} />
          <Fact label={t("Price")} value={f.price} muted={!f.priceKnown} />
        </dl>
        {!showImage && f.availability && <div className="mt-4"><AvailabilityBadge value={f.availability} /></div>}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/retreats/${retreat.slug}#book`} className="btn-primary min-h-11">
            {f.bookable ? t("Choose dates & book") : t("Join the waitlist")} <ArrowRight />
          </Link>
          <Link href={`/retreats/${retreat.slug}`} className="btn-outline min-h-11">{t("See the retreat")}</Link>
        </div>
        {!f.datesKnown && <p className="mt-3 text-sm text-muted">{t("Dates and prices are coming soon — waitlist members hear first.")}</p>}
      </div>
    </article>
  );
}

