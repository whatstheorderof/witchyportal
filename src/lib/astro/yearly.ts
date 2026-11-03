import "server-only";
/**
 * Yearly horoscopes from the real sky: Jupiter and Saturn through your solar
 * houses, the year's eclipse axis, the retrogrades, and every New and Full
 * Moon, month by month. Read from the Sun sign with whole-sign houses.
 */
import { ingresses, longitudeAt, lunations, solarHouse, ukTime, type SkyBody } from "./sky";
import { eclipsesIn, retrogradePeriods } from "./retro";
import { mainAxis } from "./eclipse-axis";
import { ordinal, ukDateShort } from "./format";
import { signOf, type Sign } from "./types";
import { ECLIPSE_AXIS, JUPITER_YEAR, SATURN_YEAR, YEAR_INTRO, YEAR_RITUAL, type HouseKey } from "./text/stars/yearly";
import { FULL_MOON_HOUSE, NEW_MOON_HOUSE, RETRO_HOUSE } from "./text/stars/transits";

const DAY = 86400000;
const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
const hk = (n: number) => String(n) as HouseKey;
const firstSentences = (t: string, n = 2) => (t.replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) ?? [t]).slice(0, n).map((x) => x.trim()).join(" ");
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ukMonth = (d: Date) => Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", month: "numeric" }).format(d)) - 1;

export interface YearSection { id: string; eyebrow?: string; title: string; when?: string; paragraphs: string[] }
export interface YearMonth { month: string; items: { when: string; title: string; text: string; eclipse?: boolean }[] }
export interface YearlyHoroscope { sign: Sign; year: number; intro: string; sections: YearSection[]; months: YearMonth[]; ritual: string }

/** The signs a slow planet is in during [from, to), as stretches. */
function stretches(body: SkyBody, from: Date, to: Date) {
  const out: { sign: Sign; from: Date; to: Date }[] = [];
  let cur = { sign: signOf(longitudeAt(body, from)).sign, from };
  for (const i of ingresses(body, from, to, DAY)) { out.push({ ...cur, to: i.time }); cur = { sign: i.sign, from: i.time }; }
  out.push({ ...cur, to });
  return out;
}

function planetSections(body: "Jupiter" | "Saturn", reader: Sign, from: Date, to: Date, texts: Record<HouseKey, string>): YearSection[] {
  const parts = stretches(body, from, to);
  const order: Sign[] = [];
  for (const p of parts) if (!order.includes(p.sign)) order.push(p.sign);
  const lead = body === "Jupiter" ? "Your year's blessing" : "Your year's lesson";
  return order.map((sign, i) => {
    const h = solarHouse(reader, sign);
    const mine = parts.filter((p) => p.sign === sign);
    const whole = parts.length === 1;
    const when = whole ? "All year" : mine.map((p) => `${+p.from === +from ? "1 Jan" : ukDateShort(p.from)} – ${+p.to === +to ? "31 Dec" : ukDateShort(p.to)}`).join(" and ");
    return { id: `${body.toLowerCase()}-${i}`, eyebrow: lead, title: `${body} in ${sign}: your ${ordinal(h)} house`, when, paragraphs: paras(texts[hk(h)]) };
  });
}

const cache = new Map<string, YearlyHoroscope>();

export function yearlyHoroscope(sign: Sign, year: number): YearlyHoroscope {
  const key = `${sign}${year}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const from = ukTime(`${year}-01-01`), to = ukTime(`${year + 1}-01-01`);
  const sections: YearSection[] = [];

  sections.push(...planetSections("Jupiter", sign, from, to, JUPITER_YEAR));
  sections.push(...planetSections("Saturn", sign, from, to, SATURN_YEAR));

  const eclipses = eclipsesIn(year);
  const axis = mainAxis(sign, eclipses.map((e) => e.sign));
  if (axis) {
    sections.push({
      id: "eclipses", eyebrow: "Turning points", title: "The year's eclipses",
      when: eclipses.map((e) => `${ukDateShort(e.time)} ${e.type} in ${e.sign}`).join(" · "),
      paragraphs: paras(ECLIPSE_AXIS[axis]),
    });
  }

  for (const body of ["Mercury", "Venus", "Mars"] as const) {
    const periods = retrogradePeriods(body, from, to);
    if (!periods.length) continue;
    sections.push({
      id: `${body.toLowerCase()}-retro`, eyebrow: "Slow down and review",
      title: `${body} retrograde${periods.length > 1 ? "s" : ""}`,
      when: periods.map((p) => `${ukDateShort(p.stationRetrograde)} – ${ukDateShort(p.stationDirect)} in ${p.sign} (${ordinal(solarHouse(sign, p.sign))} house)`).join(" · "),
      paragraphs: periods.map((p) => `${ukDateShort(p.stationRetrograde)} – ${ukDateShort(p.stationDirect)} · ${p.sign}: ${RETRO_HOUSE[body][hk(solarHouse(sign, p.sign))]}`),
    });
  }

  const months: YearMonth[] = MONTHS.map((month) => ({ month, items: [] }));
  const ecl = new Set(eclipses.map((e) => `${e.type}${new Date(e.time).toISOString().slice(0, 10)}`));
  for (const l of lunations(from, to)) {
    if (l.phase !== "new" && l.phase !== "full") continue;
    const h = solarHouse(sign, l.sign);
    const isNew = l.phase === "new";
    const eclipse = Boolean(l.eclipse) || ecl.has(`${isNew ? "solar" : "lunar"}${l.time.toISOString().slice(0, 10)}`);
    months[ukMonth(l.time)].items.push({
      when: ukDateShort(l.time),
      title: `${isNew ? "New Moon" : "Full Moon"}${eclipse ? (isNew ? " · solar eclipse" : " · lunar eclipse") : ""} in ${l.sign} · ${ordinal(h)} house`,
      text: firstSentences((isNew ? NEW_MOON_HOUSE : FULL_MOON_HOUSE)[hk(h)]),
      eclipse,
    });
  }

  const out: YearlyHoroscope = { sign, year, intro: YEAR_INTRO[sign], sections, months, ritual: YEAR_RITUAL[sign] };
  cache.set(key, out);
  return out;
}

/** The years we publish a yearly horoscope for, given today (UK). */
export function yearlyYears(now = new Date()) {
  const y = Number(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric" }).format(now));
  return [y, y + 1];
}
/** The year to feature: next year from October onwards. */
export function featuredYear(now = new Date()) {
  const [y] = yearlyYears(now);
  return ukMonth(now) >= 9 ? y + 1 : y;
}
