import Link from "next/link";
import { listRetreats } from "@/lib/queries";
import { getSetting } from "@/lib/settings";
import { formatDateRange } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { MediaImage } from "./MediaImage";
import { AvailabilityBadge } from "./Availability";
import { ArrowRight } from "./Icons";

/**
 * Invitation to the featured retreat, placed on content pages so visitors who
 * come for tips, astrology or videos are gently led towards booking.
 */
export async function RetreatPromo({ eyebrow = "Ready to go deeper?", title }: { eyebrow?: string; title?: string }) {
  const [retreats, home] = await Promise.all([listRetreats(), getSetting("home")]);
  const r = retreats.find((x) => x.id === home.featuredRetreatId) ?? retreats[0];
  if (!r) return null;
  return (
    <section aria-label="Retreat invitation" className="container-page py-14 lg:py-20">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-plum-deep text-ivory">
        <div className="absolute inset-0 -z-10">
          <MediaImage media={r.hero} fallback="veil" sizes="100vw" className="opacity-55" />
          <div className="absolute inset-0 bg-gradient-to-r from-plum-deep via-plum-deep/80 to-plum-deep/20" />
        </div>
        <div className="grid gap-6 p-7 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:p-14">
          <div>
            <p className="eyebrow text-blush">{eyebrow}</p>
            <h2 className="display-md mt-3 text-ivory">{title ?? `Join Yulia at the ${r.title}`}</h2>
            {r.summary && <p className="mt-4 max-w-xl text-ivory/85 line-clamp-3">{r.summary}</p>}
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              {r.nextDeparture && <span className="rounded-full bg-ivory/15 px-3 py-1.5 backdrop-blur">{formatDateRange(r.nextDeparture.startDate, r.nextDeparture.endDate)}</span>}
              {r.overallAvailability && <AvailabilityBadge value={r.overallAvailability} solid />}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            {r.fromPrice && <p className="text-ivory/80">from <span className="font-display text-3xl text-ivory">{formatMoney(r.fromPrice.amount, r.fromPrice.currency)}</span></p>}
            <Link href={`/retreats/${r.slug}#book`} className="btn-light">See dates &amp; book <ArrowRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
