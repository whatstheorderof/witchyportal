import Link from "next/link";
import type { RetreatCard as R } from "@/lib/queries";
import { formatMoney } from "@/lib/money";
import { formatDateRange } from "@/lib/dates";
import { MediaImage } from "./MediaImage";
import { retreatFacts } from "@/lib/retreat-facts";
import { AvailabilityBadge } from "./Availability";
import { CalendarIcon, PinIcon } from "./Icons";

export function RetreatCard({ retreat, priority, size = "md" }: { retreat: R; priority?: boolean; size?: "md" | "lg" }) {
  const more = retreat.departures.length - 1;
  const f = retreatFacts(retreat);
  return (
    <article className="group relative flex flex-col">
      <div className={`relative overflow-hidden rounded-(--radius-card) bg-sand ${size === "lg" ? "aspect-[4/5] sm:aspect-[16/11]" : "aspect-[4/5]"}`}>
        <MediaImage media={retreat.hero} fallback="horns" priority={priority} sizes="(min-width:1024px) 40vw, 92vw" className="transition duration-[1.2s] ease-(--ease-veil) group-hover:scale-[1.04]" />
        <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-4">
          {retreat.overallAvailability && <AvailabilityBadge value={retreat.overallAvailability} solid />}
          {retreat.isPlaceholder && <span className="placeholder-flag">Sample retreat</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <p className="flex items-center gap-1.5 text-sm text-muted"><PinIcon />{f.destination} · {f.duration}</p>
        <h3 className="mt-2 font-display text-[1.9rem] leading-tight text-plum">
          <Link href={`/retreats/${retreat.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {retreat.title}
          </Link>
        </h3>
        {retreat.tagline && <p className="mt-1.5 text-muted">{retreat.tagline}</p>}
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
          <p className="flex items-center gap-1.5 text-sm">
            <CalendarIcon />
            {retreat.nextDeparture ? (
              <span>
                {formatDateRange(retreat.nextDeparture.startDate, retreat.nextDeparture.endDate)}
                {more > 0 && <span className="text-muted"> + {more} more date{more > 1 ? "s" : ""}</span>}
              </span>
            ) : (
              <span className="text-muted">Dates to be announced</span>
            )}
          </p>
          {retreat.fromPrice ? (
            <p className="text-sm text-muted">
              from <span className="font-display text-2xl text-plum">{formatMoney(retreat.fromPrice.amount, retreat.fromPrice.currency)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted">Price to be announced</p>
          )}
        </div>
      </div>
    </article>
  );
}
