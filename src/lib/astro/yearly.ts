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
import { RX_EN, type Rx } from "@/i18n/readings";
import { ECLIPSE_AXIS, JUPITER_YEAR, SATURN_YEAR, YEAR_INTRO, YEAR_RITUAL, type HouseKey } from "./text/stars/yearly";
import { FULL_MOON_HOUSE, NEW_MOON_HOUSE, RETRO_HOUSE } from "./text/stars/transits";

const DAY = 86400000;
const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
const hk = (n: number) => String(n) as HouseKey;
const firstSentences = (t: string, n = 2) => (t.replace(/\s+/g, " ").match(/[^.!?。！？]+[.!?。！？]+/g) ?? [t]).slice(0, n).map((x) => x.trim()).join(" ");
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

function planetSections(rx: Rx, body: "Jupiter" | "Saturn", reader: Sign, from: Date, to: Date, texts: Record<HouseKey, string>): YearSection[] {
  const t = rx.t, short = (d: Date) => ukDateShort(d, rx.intl);
  const parts = stretches(body, from, to);
  const order: Sign[] = [];
  for (const p of parts) if (!order.includes(p.sign)) order.push(p.sign);
  const lead = t(body === "Jupiter" ? "Your year's blessing" : "Your year's lesson");
  return order.map((sign, i) => {
    const h = solarHouse(reader, sign);
    const mine = parts.filter((p) => p.sign === sign);
    const whole = parts.length === 1;
    const when = whole ? t("All year") : mine.map((p) => `${short(+p.from === +from ? from : p.from)} – ${short(+p.to === +to ? new Date(+to - DAY) : p.to)}`).join(t(" and "));
    return { id: `${body.toLowerCase()}-${i}`, eyebrow: lead, title: t("{body} in {sign}: your {ord} house", { body: t(body), sign: t(sign), ord: rx.locale === "en" ? ordinal(h) : String(h), n: h }), when, paragraphs: paras(texts[hk(h)]) };
  });
}

const cache = new Map<string, YearlyHoroscope>();

export function yearlyHoroscope(sign: Sign, year: number, rx: Rx = RX_EN): YearlyHoroscope {
  const key = `${sign}${year}${rx.locale}`;
  const t = rx.t, S = (x: string) => rx.t(x), short = (d: Date) => ukDateShort(d, rx.intl), ord = (n: number) => (rx.locale === "en" ? ordinal(n) : String(n));
  const hit = cache.get(key);
  if (hit) return hit;
  const from = ukTime(`${year}-01-01`), to = ukTime(`${year + 1}-01-01`);
  const sections: YearSection[] = [];

  sections.push(...planetSections(rx, "Jupiter", sign, from, to, JUPITER_YEAR));
  sections.push(...planetSections(rx, "Saturn", sign, from, to, SATURN_YEAR));

  const eclipses = eclipsesIn(year);
  const axis = mainAxis(sign, eclipses.map((e) => e.sign));
  if (axis) {
    sections.push({
      id: "eclipses", eyebrow: t("Turning points"), title: t("The year's eclipses"),
      when: eclipses.map((e) => t(e.type === "solar" ? "{date} solar eclipse in {sign}" : "{date} lunar eclipse in {sign}", { date: short(e.time), sign: S(e.sign) })).join(" · "),
      paragraphs: paras(ECLIPSE_AXIS[axis]),
    });
  }

  for (const body of ["Mercury", "Venus", "Mars"] as const) {
    const periods = retrogradePeriods(body, from, to);
    if (!periods.length) continue;
    sections.push({
      id: `${body.toLowerCase()}-retro`, eyebrow: t("Slow down and review"),
      title: t(periods.length > 1 ? "{body} retrogrades" : "{body} retrograde", { body: S(body) }),
      when: periods.map((p) => t("{from} – {to} in {sign} ({ord} house)", { from: short(p.stationRetrograde), to: short(p.stationDirect), sign: S(p.sign), ord: ord(solarHouse(sign, p.sign)), n: solarHouse(sign, p.sign) })).join(" · "),
      paragraphs: periods.map((p) => `${short(p.stationRetrograde)} – ${short(p.stationDirect)} · ${S(p.sign)}: ${rx(RETRO_HOUSE[body][hk(solarHouse(sign, p.sign))])}`),
    });
  }

  const months: YearMonth[] = Array.from({ length: 12 }, (_, i) => ({ month: rx.date(new Date(Date.UTC(year, i, 15)), { month: "long", timeZone: "UTC" }).replace(/^./, (c) => c.toUpperCase()), items: [] }));
  const ecl = new Set(eclipses.map((e) => `${e.type}${new Date(e.time).toISOString().slice(0, 10)}`));
  for (const l of lunations(from, to)) {
    if (l.phase !== "new" && l.phase !== "full") continue;
    const h = solarHouse(sign, l.sign);
    const isNew = l.phase === "new";
    const eclipse = Boolean(l.eclipse) || ecl.has(`${isNew ? "solar" : "lunar"}${l.time.toISOString().slice(0, 10)}`);
    months[ukMonth(l.time)].items.push({
      when: short(l.time),
      title: t(isNew ? (eclipse ? "New Moon · solar eclipse in {sign} · {ord} house" : "New Moon in {sign} · {ord} house") : (eclipse ? "Full Moon · lunar eclipse in {sign} · {ord} house" : "Full Moon in {sign} · {ord} house"), { sign: S(l.sign), ord: ord(h), n: h }),
      text: firstSentences(rx((isNew ? NEW_MOON_HOUSE : FULL_MOON_HOUSE)[hk(h)])),
      eclipse,
    });
  }

  const out: YearlyHoroscope = rx.deep({ sign, year, intro: YEAR_INTRO[sign], sections, months, ritual: YEAR_RITUAL[sign] });
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
