import type { RetreatCard } from "./queries";
import { formatDateRange, nightsBetween } from "./dates";
import { formatMoney } from "./money";

/** The key facts a visitor needs to assess a retreat at a glance. */
type Tr = (s: string, v?: Record<string, string | number>) => string;
const same: Tr = (s, v) => (v ? s.replace(/\{(\w+)\}/g, (_, k) => String(v[k])) : s);

export function retreatFacts(r: Omit<RetreatCard, "gallery">, t: Tr = same, intl = "en-GB", tc: (s: string) => string = (s) => s) {
  const d = r.nextDeparture;
  const nights = d ? nightsBetween(d.startDate, d.endDate) : null;
  const more = Math.max(0, r.departures.length - 1);
  const destination = [tc(r.location), tc(r.country)].filter(Boolean).join(", ") || t("To be announced");
  return {
    destination,
    destinationKnown: Boolean(r.location) && !/to be announced|tbc/i.test(r.location),
    dates: d ? formatDateRange(d.startDate, d.endDate, intl) + (more ? ` ${t("(+{n} more)", { n: more })}` : "") : t("Dates to be announced"),
    datesKnown: Boolean(d),
    duration: nights != null ? t("{days} days · {nights} nights", { days: nights + 1, nights }) : tc(r.duration) || t("To be announced"),
    price: r.fromPrice ? t("from {price}", { price: formatMoney(r.fromPrice.amount, r.fromPrice.currency) }) : t("Price to be announced"),
    priceKnown: Boolean(r.fromPrice),
    availability: r.overallAvailability,
    bookable: r.departures.some((x) => (x.availability === "available" || x.availability === "limited") && x.options.some((o) => o.availability === "available" || o.availability === "limited")),
  };
}
