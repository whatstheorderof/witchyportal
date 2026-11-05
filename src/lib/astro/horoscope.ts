import "server-only";
/**
 * Automatic horoscopes from the real sky, in Yulia's voice.
 *  - Daily (per sign): today's Moon through your solar houses, the Moon's
 *    phase, its exact aspects today, retrogrades and a small ritual.
 *  - Monthly (per sign): the Sun, Mercury, Venus, Mars, Jupiter and Saturn
 *    through your solar houses, the month's New and Full Moon, retrogrades.
 *  - This week in astrology (everyone): the week's real events.
 * Text variants are chosen deterministically from the date and sign, so a
 * page reads the same all day and changes the next day.
 */
import type { Sign } from "./types";
import { msg } from "@/i18n/config";
import { RX_EN, type Rx } from "@/i18n/readings";
import { SIGNS } from "./types";
import { addDays, lunations, moonAspectsOnDay, moonIngresses, moonPhaseAt, positionsAt, skyEvents, solarHouse, stations, ukDayKey, ukTime, type SkyBody, type SkyEvent } from "./sky";
import { DAY_HEADLINE, MOON_HOUSE_DAY, MOON_SIGN_RITUAL, PHASE_DAY } from "./text/stars/daily-moon";
import { ENERGY_NOTE, MOON_ASPECT_DAY, SKY_RETROGRADE_NOTE } from "./text/stars/daily-aspects";
import { FULL_MOON_HOUSE, JUPITER_HOUSE, MARS_HOUSE, MERCURY_HOUSE, NEW_MOON_HOUSE, RETRO_HOUSE, SATURN_HOUSE, SUN_HOUSE, VENUS_HOUSE } from "./text/stars/transits";
import { ECLIPSE, FULL_MOON_IN_SIGN, INGRESS, NEW_MOON_IN_SIGN, STATION } from "./text/stars/sky-events";
import { SKY_ASPECT } from "./text/stars/sky-aspects";
import { MOON_IN_SIGN_DAY } from "./text/stars/moon-guide";

type HouseKey = keyof typeof MOON_HOUSE_DAY;
const hk = (n: number) => String(n) as HouseKey;
const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);

/** Small stable hash, so the same day + sign always picks the same variant */
function pick<T>(list: readonly T[], ...seed: string[]): T {
  let h = 2166136261;
  for (const ch of seed.join("|")) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return list[Math.abs(h) % list.length];
}

export const HOUSE_AREA = [msg("you"), msg("money & values"), msg("conversations"), msg("home"), msg("love & creativity"), msg("work & routines"), msg("partners"), msg("intimacy & change"), msg("adventure & learning"), msg("career"), msg("friends & hopes"), msg("rest & dreams")];

export const signSlug = (s: Sign) => s.toLowerCase();
export const signFromSlug = (slug: string) => SIGNS.find((s) => s.toLowerCase() === slug.toLowerCase());

/* ---------------- Daily ---------------- */

export interface DailyHoroscope {
  sign: Sign;
  day: string;
  headline: string;
  focus: string;
  moon: { sign: Sign; house: number; phase: string; illumination: number; angle: number; entersSign?: { sign: Sign; time: string } };
  paragraphs: string[];
  aspect: { planet: SkyBody; aspect: string; time: string } | null;
  retrograde: { planet: string; text: string } | null;
  ritual: string;
  energyNote: string;
  ratings: { love: number; work: number; energy: number };
}

const LOVE_HOUSES = new Set([1, 5, 7, 8, 11]);
const WORK_HOUSES = new Set([2, 3, 6, 10]);
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

export function dailyHoroscope(sign: Sign, day: string, rx: Rx = RX_EN): DailyHoroscope {
  const noon = ukTime(day, "12:00");
  const pos = positionsAt(noon);
  const moon = pos.find((p) => p.body === "Moon")!;
  const house = solarHouse(sign, moon.sign);
  const phase = moonPhaseAt(noon);
  const seed = [day, sign];

  // The Moon's most significant exact aspect today
  const PRIORITY: SkyBody[] = ["Venus", "Sun", "Mars", "Jupiter", "Saturn", "Mercury", "Neptune", "Uranus", "Pluto"];
  const aspects = moonAspectsOnDay(day);
  const main = aspects.sort((x, y) => PRIORITY.indexOf(x.b) - PRIORITY.indexOf(y.b))[0] ?? null;
  const kind = main ? (main.aspect === "conjunction" ? "conjunction" : main.aspect === "trine" || main.aspect === "sextile" ? "harmonious" : "challenging") : null;

  // Moon changing sign during the day
  const changes = moonIngresses(ukTime(day, "00:00"), ukTime(addDays(day, 1), "00:00"));
  const late = changes.find((c) => c.sign !== moon.sign);

  const retroPlanet = (["Mercury", "Venus", "Mars"] as const).find((p) => pos.find((x) => x.body === p)?.retrograde);

  const paragraphs = [pick(MOON_HOUSE_DAY[hk(house)], ...seed), pick(PHASE_DAY[phase.name], ...seed, "phase")];
  if (main && kind) paragraphs.push(pick(MOON_ASPECT_DAY[main.b as keyof typeof MOON_ASPECT_DAY][kind], ...seed, "asp"));

  let energy = (phase.waxing ? 3.4 : 2.8) + (phase.name === "Full Moon" ? 0.8 : phase.name === "New Moon" || phase.name === "Balsamic Moon" ? -0.8 : 0);
  if (kind === "harmonious") energy += 0.6;
  if (kind === "challenging") energy += main?.b === "Mars" ? 0.6 : -0.4;
  if ([1, 5, 10].includes(house)) energy += 0.5;
  if ([12, 8].includes(house)) energy -= 0.6;
  let love = 3 + (LOVE_HOUSES.has(house) ? 1.2 : 0) + (main?.b === "Venus" ? (kind === "challenging" ? -0.5 : 1) : 0) + (retroPlanet === "Venus" ? -0.5 : 0);
  let work = 3 + (WORK_HOUSES.has(house) ? 1.2 : 0) + (main?.b === "Saturn" || main?.b === "Mercury" ? (kind === "challenging" ? -0.6 : 0.7) : 0) + (retroPlanet === "Mercury" ? -0.4 : 0);
  if (house === 12) { love -= 0.3; work -= 0.5; }
  const ratings = { love: clamp(love), work: clamp(work), energy: clamp(energy) };

  const fmt = (d: Date) => rx.date(d, { hour: "2-digit", minute: "2-digit" });
  return rx.deep({
    sign,
    day,
    headline: pick(DAY_HEADLINE[hk(house)], ...seed, "h"),
    focus: rx.t(HOUSE_AREA[house - 1]),
    moon: { sign: moon.sign, house, phase: phase.name, illumination: phase.illumination, angle: phase.angle, ...(late ? { entersSign: { sign: late.sign, time: fmt(late.time) } } : {}) },
    paragraphs,
    aspect: main ? { planet: main.b, aspect: main.aspect, time: fmt(main.time) } : null,
    retrograde: retroPlanet ? { planet: retroPlanet, text: SKY_RETROGRADE_NOTE[retroPlanet] } : null,
    ritual: pick(MOON_SIGN_RITUAL[moon.sign], day, "ritual"),
    energyNote: pick(ENERGY_NOTE[ratings.energy >= 4 ? "high" : ratings.energy <= 2 ? "low" : "steady"], ...seed, "e"),
    ratings,
  });
}

/** Today in the UK, as YYYY-MM-DD */
export const todayKey = () => ukDayKey(new Date());

/* ---------------- Monthly ---------------- */

export interface MonthlySection { title: string; when?: string; paragraphs: string[] }
export interface MonthlyHoroscope { sign: Sign; year: number; month: number; label: string; intro: string; sections: MonthlySection[]; keyDates: { when: string; text: string }[] }

export function monthlyHoroscope(sign: Sign, year: number, month: number, rx: Rx = RX_EN): MonthlyHoroscope {
  const dateLabel = (d: Date) => rx.date(d, { day: "numeric", month: "long" });
  const t = rx.t, S = (x: string) => rx.t(x);
  const mm = String(month).padStart(2, "0");
  const start = ukTime(`${year}-${mm}-01`);
  const next = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const end = ukTime(next);
  const mid = new Date((+start + +end) / 2);
  const posStart = positionsAt(new Date(+start + 43200000));
  const posMid = positionsAt(mid);
  const label = rx.date(new Date(Date.UTC(year, month - 1, 15)), { month: "long", year: "numeric", timeZone: "UTC" }).replace(/^./, (c) => c.toUpperCase());
  const h = (body: SkyBody, at = posMid) => solarHouse(sign, at.find((p) => p.body === body)!.sign);
  const events = skyEvents(start, end);
  const sections: MonthlySection[] = [];

  // The Sun: the month's main theme (and the new chapter when it changes sign)
  const sunIngress = events.find((e) => e.kind === "ingress" && e.body === "Sun") as Extract<SkyEvent, { kind: "ingress" }> | undefined;
  const sunStart = h("Sun", posStart);
  sections.push({ title: t("Your month's theme: the {ord} house of {area}", { ord: rx.ord(sunStart), n: sunStart, area: t(HOUSE_AREA[sunStart - 1]) }), when: sunIngress ? t("Until {date}", { date: dateLabel(sunIngress.time) }) : undefined, paragraphs: paras(rx(SUN_HOUSE[hk(sunStart)])) });
  if (sunIngress) {
    const hn = solarHouse(sign, sunIngress.sign);
    sections.push({ title: t("From {date}: the Sun moves into {sign}, your {ord} house", { date: dateLabel(sunIngress.time), sign: S(sunIngress.sign), ord: rx.ord(hn), n: hn }), paragraphs: paras(rx(SUN_HOUSE[hk(hn)])) });
  }

  // Lunations
  for (const l of lunations(start, end)) {
    if (l.phase !== "new" && l.phase !== "full") continue;
    const hn = solarHouse(sign, l.sign);
    const text = l.phase === "new" ? NEW_MOON_HOUSE[hk(hn)] : FULL_MOON_HOUSE[hk(hn)];
    const lt = t(l.phase === "new" ? "New Moon in {sign}" : "Full Moon in {sign}", { sign: S(l.sign) });
    sections.push({ title: l.eclipse ? t(l.eclipse === "solar" ? "{title} — solar eclipse" : "{title} — lunar eclipse", { title: lt }) : lt, when: dateLabel(l.time), paragraphs: [...paras(rx(text)), ...(l.eclipse ? paras(rx(ECLIPSE[l.eclipse])) : [])] });
  }

  // Personal planets
  const personal: [SkyBody, Record<HouseKey, string>, string][] = [["Mercury", MERCURY_HOUSE, msg("Mind & messages")], ["Venus", VENUS_HOUSE, msg("Love & pleasure")], ["Mars", MARS_HOUSE, msg("Drive & desire")]];
  for (const [body, texts, area] of personal) {
    const p = posMid.find((x) => x.body === body)!;
    const hn = solarHouse(sign, p.sign);
    const retroText = (body === "Mercury" || body === "Venus" || body === "Mars") && p.retrograde ? RETRO_HOUSE[body][hk(hn)] : null;
    sections.push({ title: t(p.retrograde ? "{area}: {body} in {sign} (retrograde), your {ord} house" : "{area}: {body} in {sign}, your {ord} house", { area: t(area), body: S(body), sign: S(p.sign), ord: rx.ord(hn), n: hn }), paragraphs: [...paras(rx(texts[hk(hn)])), ...(retroText ? paras(rx(retroText)) : [])] });
  }

  // The bigger picture
  for (const [body, texts] of [["Jupiter", JUPITER_HOUSE], ["Saturn", SATURN_HOUSE]] as const) {
    const p = posMid.find((x) => x.body === body)!;
    const hn = solarHouse(sign, p.sign);
    sections.push({ title: t("The bigger picture: {body} in {sign}, your {ord} house", { body: S(body), sign: S(p.sign), ord: rx.ord(hn), n: hn }), paragraphs: paras(rx(texts[hk(hn)])) });
  }

  const keyDates = events.filter((e) => e.kind !== "aspect" || ["Sun", "Venus", "Mars"].includes(e.a)).map((e) => ({ when: dateLabel(e.time), text: eventTitle(e, rx) }));
  const intro = rx.fill("{month} for {sign}: the planets moving through your chart this month, read from your Sun sign. Read your Rising sign too if you know it — it often fits even better.", { month: label, sign: S(sign) });
  return { sign, year, month, label, intro, sections, keyDates };
}

/* ---------------- This week in astrology ---------------- */

const ASPECT_SYMBOL: Record<string, string> = { conjunction: "conjunct", sextile: "sextile", square: "square", trine: "trine", opposition: "opposite" };

export function eventTitle(e: SkyEvent, rx: Rx = RX_EN) {
  const t = rx.t, S = (x: string) => rx.t(x);
  switch (e.kind) {
    case "ingress": return t("{body} enters {sign}", { body: S(e.body), sign: S(e.sign) });
    case "station": return t(e.turns === "retrograde" ? "{body} turns retrograde in {sign}" : "{body} turns direct in {sign}", { body: S(e.body), sign: S(e.sign) });
    case "aspect": return t(`{a} ${ASPECT_SYMBOL[e.aspect]} {b}`, { a: S(e.a), b: S(e.b) });
    case "lunation": {
      const title = t(`${{ new: "New Moon", first: "First Quarter Moon", full: "Full Moon", last: "Last Quarter Moon" }[e.phase]} in {sign}`, { sign: S(e.sign) });
      return e.eclipse ? t(e.eclipse === "solar" ? "{title} (solar eclipse)" : "{title} (lunar eclipse)", { title }) : title;
    }
  }
}
/** Title templates built above, listed so the extractor finds them. */
export const EVENT_TEMPLATES = [msg("{a} conjunct {b}"), msg("{a} sextile {b}"), msg("{a} square {b}"), msg("{a} trine {b}"), msg("{a} opposite {b}"),
  msg("New Moon in {sign}"), msg("First Quarter Moon in {sign}"), msg("Full Moon in {sign}"), msg("Last Quarter Moon in {sign}")];

function eventText(e: SkyEvent): string[] {
  switch (e.kind) {
    case "ingress": return INGRESS[e.body as keyof typeof INGRESS] ? paras(INGRESS[e.body as keyof typeof INGRESS][e.sign]) : [];
    case "station": return STATION[e.body as keyof typeof STATION] ? paras(STATION[e.body as keyof typeof STATION][e.turns]) : [];
    case "aspect": {
      const t = SKY_ASPECT[`${e.a}|${e.b}`];
      if (!t) return [];
      return paras(e.aspect === "conjunction" ? t.conjunction : e.aspect === "trine" || e.aspect === "sextile" ? t.harmonious : t.challenging);
    }
    case "lunation":
      if (e.phase === "new") return [...paras(NEW_MOON_IN_SIGN[e.sign]), ...(e.eclipse ? paras(ECLIPSE.solar) : [])];
      if (e.phase === "full") return [...paras(FULL_MOON_IN_SIGN[e.sign]), ...(e.eclipse ? paras(ECLIPSE.lunar) : [])];
      return [];
  }
}

export interface WeekInAstrology {
  start: string;
  end: string;
  label: string;
  events: { id: string; day: string; time: string; when: string; kind: SkyEvent["kind"]; title: string; paragraphs: string[] }[];
  moonDays: { sign: Sign; from: string; text: string }[];
  retrogrades: { planet: string; sign: Sign }[];
  /** One entry per day, Monday to Sunday, for the calendar view */
  days: {
    day: string;
    weekday: string;
    date: string;
    moon: { sign: Sign; phase: string; angle: number; illumination: number; entersSign?: { sign: Sign; time: string } };
    events: { id: string; time: string; kind: SkyEvent["kind"]; title: string }[];
  }[];
}


/** Monday of the UK week containing `day` */
export function weekStart(day: string) {
  const d = new Date(`${day}T12:00:00Z`);
  return addDays(day, -((d.getUTCDay() + 6) % 7));
}

export function weekInAstrology(monday: string, rx: Rx = RX_EN): WeekInAstrology {
  const from = ukTime(monday), to = ukTime(addDays(monday, 7));
  const hhmm = (d: Date) => rx.date(d, { hour: "2-digit", minute: "2-digit" });
  const when = (d: Date) => rx.date(d, { weekday: "long", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const events = skyEvents(from, to)
    .filter((e) => !(e.kind === "lunation" && (e.phase === "first" || e.phase === "last")) || true)
    .map((e, i) => ({ id: `event-${i + 1}`, day: ukDayKey(e.time), time: hhmm(e.time), when: when(e.time), kind: e.kind, title: eventTitle(e, rx), paragraphs: eventText(e) }));
  const ingressList = moonIngresses(from, to);
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i);
    const noon = ukTime(day, "12:00");
    // The sign the Moon starts the day in, and where it moves during the day
    const moon = positionsAt(ukTime(day, "00:00")).find((p) => p.body === "Moon")!;
    const phase = moonPhaseAt(noon);
    const enters = ingressList.find((m) => ukDayKey(m.time) === day);
    const d = new Date(`${day}T12:00:00Z`);
    return {
      day,
      weekday: rx.date(d, { weekday: "short", timeZone: "UTC" }),
      date: rx.date(d, { day: "numeric", month: "short", timeZone: "UTC" }),
      moon: { sign: moon.sign, phase: phase.name, angle: phase.angle, illumination: phase.illumination, ...(enters ? { entersSign: { sign: enters.sign, time: hhmm(enters.time) } } : {}) },
      events: events.filter((e) => e.day === day).map(({ id, time, kind, title }) => ({ id, time, kind, title })),
    };
  });
  const startPos = positionsAt(from);
  const startMoon = startPos.find((p) => p.body === "Moon")!;
  const moonDays = [{ sign: startMoon.sign, from: rx.date(new Date(`${monday}T12:00:00Z`), { weekday: "long", timeZone: "UTC" }), text: MOON_IN_SIGN_DAY[startMoon.sign] }, ...ingressList.map((m) => ({ sign: m.sign, from: when(m.time), text: MOON_IN_SIGN_DAY[m.sign] }))];
  const mid = new Date((+from + +to) / 2);
  const retrogrades = positionsAt(mid).filter((p) => p.retrograde).map((p) => ({ planet: p.body, sign: p.sign }));
  const fmt = (k: string) => rx.date(new Date(`${k}T12:00:00Z`), { day: "numeric", month: "long", timeZone: "UTC" });
  return rx.deep({ start: monday, end: addDays(monday, 6), label: `${fmt(monday)} – ${fmt(addDays(monday, 6))}`, events, moonDays, retrogrades, days });
}

/** Upcoming stations are useful on the hub page */
export function nextStations(days = 60) {
  const from = new Date(), to = new Date(Date.now() + days * 86400000);
  return (["Mercury", "Venus", "Mars"] as SkyBody[]).flatMap((b) => stations(b, from, to).map((s) => ({ body: b, ...s }))).sort((a, b) => +a.time - +b.time);
}
