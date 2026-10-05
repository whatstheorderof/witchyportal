/**
 * Moon calendar and key dates for a year — everything calculated with
 * Astronomy Engine (no hand-entered dates). UK time, Northern Hemisphere.
 */
import * as Astronomy from "astronomy-engine";
import { signOf, type Sign } from "./types";
import { FULL_MOON_NAMES } from "./moon";

export const CAL_TZ = "Europe/London";
const LONDON = new Astronomy.Observer(51.5074, -0.1278, 11);

/** YYYY-MM-DD for a moment, in UK time */
export const ukDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: CAL_TZ }).format(d);

export type QuarterKind = "new" | "first" | "full" | "last";
export interface DayMoon {
  day: number;
  key: string; // YYYY-MM-DD
  angle: number; // phase angle at midday
  quarter?: { kind: QuarterKind; time: string; sign: Sign };
}
export interface MonthMoons {
  month: number; // 0-11
  firstWeekday: number; // 0 = Monday
  days: DayMoon[];
}

export type KeyKind = "new-moon" | "full-moon" | "lunar-eclipse" | "solar-eclipse" | "season" | "sabbat" | "retrograde";
export interface KeyDate {
  id: string;
  kind: KeyKind;
  start: string; // ISO moment
  end?: string; // ISO moment (retrogrades)
  title: string;
  detail: string;
  tags: string[];
}

const moonSign = (t: Astronomy.AstroTime) => signOf(Astronomy.EclipticGeoMoon(t).lon).sign;
const QUARTERS: QuarterKind[] = ["new", "first", "full", "last"];

function quartersBetween(from: Date, to: Date) {
  const out: { kind: QuarterKind; time: Date; sign: Sign }[] = [];
  let q = Astronomy.SearchMoonQuarter(Astronomy.MakeTime(from));
  while (q.time.date < to) {
    out.push({ kind: QUARTERS[q.quarter], time: q.time.date, sign: moonSign(q.time) });
    q = Astronomy.NextMoonQuarter(q);
  }
  return out;
}

export function yearMoons(year: number): MonthMoons[] {
  const quarters = quartersBetween(new Date(Date.UTC(year, 0, 1) - 86400000), new Date(Date.UTC(year + 1, 0, 2)));
  const byDay = new Map(quarters.map((q) => [ukDay(q.time), q]));
  return Array.from({ length: 12 }, (_, month) => {
    const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const days: DayMoon[] = [];
    for (let day = 1; day <= count; day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const q = byDay.get(key);
      days.push({
        day,
        key,
        angle: Math.round(Astronomy.MoonPhase(Astronomy.MakeTime(new Date(Date.UTC(year, month, day, 12))))),
        ...(q ? { quarter: { kind: q.kind, time: q.time.toISOString(), sign: q.sign } } : {}),
      });
    }
    return { month, firstWeekday: (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7, days };
  });
}

/* ------------------------------------------------------------------ */

const SIGN_THEMES: Record<Sign, string> = {
  Aries: "courage and fresh starts", Taurus: "comfort, money and the body", Gemini: "words, learning and connection",
  Cancer: "home, family and feelings", Leo: "joy, confidence and creativity", Virgo: "health, routine and order",
  Libra: "love, balance and beauty", Scorpio: "depth, desire and transformation", Sagittarius: "adventure, faith and freedom",
  Capricorn: "ambition, structure and commitment", Aquarius: "friendship, ideas and change", Pisces: "dreams, intuition and healing",
};

const LUNAR_KIND: Record<string, string> = { penumbral: "Penumbral", partial: "Partial", total: "Total" };
const SOLAR_KIND: Record<string, string> = { partial: "Partial", annular: "Annular", total: "Total", hybrid: "Hybrid" };

/** Planet's apparent geocentric ecliptic longitude */
function elon(body: Astronomy.Body, d: Date) {
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, Astronomy.MakeTime(d), true)).elon;
}
const delta = (a: number, b: number) => ((b - a + 540) % 360) - 180;

/** Retrograde periods overlapping the year, with stations refined to the hour */
function retrogrades(body: Astronomy.Body, year: number) {
  const start = Date.UTC(year - 1, 9, 1), end = Date.UTC(year + 1, 3, 1), DAY = 86400000;
  const motion = (t: number) => delta(elon(body, new Date(t)), elon(body, new Date(t + DAY / 4)));
  const refine = (lo: number, hi: number) => {
    const sLo = Math.sign(motion(lo));
    while (hi - lo > 3600000) {
      const mid = (lo + hi) / 2;
      if (Math.sign(motion(mid)) === sLo) lo = mid; else hi = mid;
    }
    return new Date((lo + hi) / 2);
  };
  const stations: { time: Date; turnsRetro: boolean }[] = [];
  let prev = motion(start);
  for (let t = start + DAY; t < end; t += DAY) {
    const m = motion(t);
    if (Math.sign(m) !== Math.sign(prev)) stations.push({ time: refine(t - DAY, t), turnsRetro: m < 0 });
    prev = m;
  }
  const periods: { from: Date; to: Date }[] = [];
  for (let i = 0; i < stations.length; i++) {
    if (stations[i].turnsRetro && stations[i + 1] && !stations[i + 1].turnsRetro) periods.push({ from: stations[i].time, to: stations[i + 1].time });
  }
  const y0 = Date.UTC(year, 0, 1), y1 = Date.UTC(year + 1, 0, 1);
  return periods.filter((p) => +p.to >= y0 && +p.from < y1);
}

const RETRO_NOTES: Partial<Record<Astronomy.Body, string>> = {
  [Astronomy.Body.Mercury]: "Slow down with contracts, travel and tech. A beautiful time to review, rewrite and reconnect with old friends.",
  [Astronomy.Body.Venus]: "Love and money ask to be re-examined. Old flames may resurface — reflect before you leap into anything new.",
  [Astronomy.Body.Mars]: "Energy turns inward. Rest rather than push, and revisit goals before charging ahead.",
};

export function keyDates(year: number): KeyDate[] {
  const y0 = new Date(Date.UTC(year, 0, 1)), y1 = new Date(Date.UTC(year + 1, 0, 1));
  const inYear = (d: Date) => ukDay(d).startsWith(String(year));
  const out: KeyDate[] = [];

  // Eclipses first, so the matching new/full moon can be tagged
  const eclipseDays = new Map<string, string>();
  for (let e = Astronomy.SearchLunarEclipse(Astronomy.MakeTime(new Date(+y0 - 20 * 86400000))); e.peak.date < y1; e = Astronomy.NextLunarEclipse(e.peak)) {
    if (!inYear(e.peak.date)) continue;
    const eq = Astronomy.Equator(Astronomy.Body.Moon, e.peak, LONDON, true, true);
    const alt = Astronomy.Horizon(e.peak, LONDON, eq.ra, eq.dec, "normal").altitude;
    const kind = LUNAR_KIND[e.kind] ?? "Lunar";
    eclipseDays.set(ukDay(e.peak.date), `${kind} lunar eclipse`);
    out.push({
      id: `lunar-${ukDay(e.peak.date)}`, kind: "lunar-eclipse", start: e.peak.date.toISOString(),
      title: `${kind} lunar eclipse in ${moonSign(e.peak)}`,
      detail: `A full moon eclipse — powerful for endings and emotional release. Skip big manifesting; let go instead. ${alt > 0 ? "The Moon is above the horizon in the UK at its peak." : "Not visible from the UK — the Moon is below the horizon at its peak."}`,
      tags: [alt > 0 ? "Visible from the UK" : "Not visible from the UK"],
    });
  }
  for (let e = Astronomy.SearchGlobalSolarEclipse(Astronomy.MakeTime(new Date(+y0 - 20 * 86400000))); e.peak.date < y1; e = Astronomy.NextGlobalSolarEclipse(e.peak)) {
    if (!inYear(e.peak.date)) continue;
    const kind = SOLAR_KIND[e.kind] ?? "Solar";
    let uk = "";
    try {
      const local = Astronomy.SearchLocalSolarEclipse(Astronomy.MakeTime(new Date(+e.peak.date - 2 * 86400000)), LONDON);
      if (Math.abs(+local.peak.time.date - +e.peak.date) < 86400000 && local.peak.altitude > 0) uk = `About ${Math.round(local.obscuration * 100)}% of the Sun is covered from London.`;
    } catch { /* not visible */ }
    eclipseDays.set(ukDay(e.peak.date), `${kind} solar eclipse`);
    out.push({
      id: `solar-${ukDay(e.peak.date)}`, kind: "solar-eclipse", start: e.peak.date.toISOString(),
      title: `${kind} solar eclipse in ${signOf(Astronomy.EclipticGeoMoon(e.peak).lon).sign}`,
      detail: `A supercharged new moon — doors open suddenly. Notice what begins now rather than forcing it. ${uk || "Not visible from the UK."} Never look at the Sun directly.`,
      tags: [uk ? "Visible from the UK" : "Not visible from the UK"],
    });
  }

  // New and full moons
  const fullsPerMonth = new Map<string, number>();
  for (const q of quartersBetween(new Date(+y0 - 86400000), new Date(+y1 + 86400000))) {
    if (!inYear(q.time) || (q.kind !== "new" && q.kind !== "full")) continue;
    const day = ukDay(q.time);
    const tags: string[] = [];
    // An eclipse on the same day already stands for this new/full moon — merge into it.
    const eclipse = eclipseDays.has(day) ? out.find((e) => e.kind.endsWith("eclipse") && ukDay(new Date(e.start)) === day) : undefined;
    if (q.kind === "new") {
      if (eclipse) { eclipse.title += ` · New Moon`; continue; }
      out.push({ id: `new-${day}`, kind: "new-moon", start: q.time.toISOString(), title: `New Moon in ${q.sign}`, detail: `Plant intentions around ${SIGN_THEMES[q.sign]}.`, tags });
    } else {
      const month = day.slice(0, 7);
      const nth = (fullsPerMonth.get(month) ?? 0) + 1;
      fullsPerMonth.set(month, nth);
      const km = Astronomy.GeoMoon(Astronomy.MakeTime(q.time)).Length() * Astronomy.KM_PER_AU;
      if (km < 362000) tags.push("Supermoon");
      if (nth === 2) tags.push("Blue Moon");
      const name = nth === 2 ? "Blue Moon" : FULL_MOON_NAMES[Number(day.slice(5, 7)) - 1];
      if (eclipse) { eclipse.title += ` · ${name}`; eclipse.tags.push(...tags); continue; }
      out.push({ id: `full-${day}`, kind: "full-moon", start: q.time.toISOString(), title: `Full ${name.replace(/ Moon$/, "")} Moon in ${q.sign}`, detail: `Release and give thanks — a peak for ${SIGN_THEMES[q.sign]}. Leave water out to charge overnight.`, tags });
    }
  }

  // Equinoxes, solstices and the Wheel of the Year
  const s = Astronomy.Seasons(year);
  const seasons: [Astronomy.AstroTime, string, string][] = [
    [s.mar_equinox, "Ostara · Spring equinox", "Day and night in balance. Plant seeds — literally or in your journal — and welcome new growth."],
    [s.jun_solstice, "Litha · Summer solstice", "The longest day. Celebrate your light, gather herbs and dance in the sun."],
    [s.sep_equinox, "Mabon · Autumn equinox", "The second harvest. Give thanks, share abundance and find balance before the dark half of the year."],
    [s.dec_solstice, "Yule · Winter solstice", "The longest night and the return of the light. Rest, light candles and dream up the year ahead."],
  ];
  for (const [t, title, detail] of seasons) out.push({ id: `season-${ukDay(t.date)}`, kind: "season", start: t.date.toISOString(), title, detail, tags: ["Wheel of the Year"] });
  const sabbats: [number, number, string, string][] = [
    [1, 1, "Imbolc", "First stirrings of spring. Cleanse your space, light a candle and honour new beginnings."],
    [4, 1, "Beltane", "Fire, passion and fertility. Celebrate life, love and creativity — flowers and bonfires welcome."],
    [7, 1, "Lammas · Lughnasadh", "The first harvest. Bake bread, give thanks and notice what you've grown this year."],
    [9, 31, "Samhain", "The witches' new year, when the veil is thin. Honour your ancestors and reflect on what's ending."],
  ];
  for (const [m, d, title, detail] of sabbats) out.push({ id: `sabbat-${m}-${d}`, kind: "sabbat", start: new Date(Date.UTC(year, m, d, 12)).toISOString(), title, detail, tags: ["Wheel of the Year", "Traditional date"] });

  // Retrogrades
  for (const [body, name] of [[Astronomy.Body.Mercury, "Mercury"], [Astronomy.Body.Venus, "Venus"], [Astronomy.Body.Mars, "Mars"]] as const) {
    for (const p of retrogrades(body, year)) {
      const from = signOf(elon(body, p.from)).sign, to = signOf(elon(body, p.to)).sign;
      out.push({
        id: `retro-${name}-${ukDay(p.from)}`, kind: "retrograde", start: p.from.toISOString(), end: p.to.toISOString(),
        title: `${name} retrograde in ${from === to ? from : `${from} → ${to}`}`, detail: RETRO_NOTES[body] ?? "", tags: [],
      });
    }
  }

  return out.sort((a, b) => a.start.localeCompare(b.start));
}
