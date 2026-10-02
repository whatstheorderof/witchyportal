import type { RetreatCard } from "./queries";
import { formatDateRange, nightsBetween } from "./dates";
import { formatMoney } from "./money";

/** The key facts a visitor needs to assess a retreat at a glance. */
export function retreatFacts(r: Omit<RetreatCard, "gallery">) {
  const d = r.nextDeparture;
  const nights = d ? nightsBetween(d.startDate, d.endDate) : null;
  const more = Math.max(0, r.departures.length - 1);
  const destination = [r.location, r.country].filter(Boolean).join(", ") || "To be announced";
  return {
    destination,
    destinationKnown: Boolean(r.location) && !/to be announced|tbc/i.test(r.location),
    dates: d ? formatDateRange(d.startDate, d.endDate) + (more ? ` (+${more} more)` : "") : "Dates to be announced",
    datesKnown: Boolean(d),
    duration: nights != null ? `${nights + 1} days · ${nights} nights` : r.duration || "To be announced",
    price: r.fromPrice ? `from ${formatMoney(r.fromPrice.amount, r.fromPrice.currency)}` : "Price to be announced",
    priceKnown: Boolean(r.fromPrice),
    availability: r.overallAvailability,
    bookable: r.departures.some((x) => (x.availability === "available" || x.availability === "limited") && x.options.some((o) => o.availability === "available" || o.availability === "limited")),
  };
}
