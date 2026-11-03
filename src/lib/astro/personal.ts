import "server-only";
/**
 * A personal day, read from a whole natal chart: the Moon through your natal
 * houses (or solar houses without a birth time) and today's transits to your
 * natal planets and angles. Built on the Sun-sign day so ratings, phase and
 * ritual stay consistent with the rest of the site.
 */
import { dailyHoroscope, type DailyHoroscope } from "./horoscope";
import { longitudeAt, positionsAt, ukTime, wrap180, type SkyBody } from "./sky";
import { houseOf } from "./derive";
import type { ChartResult, Sign } from "./types";
import { DAY_HEADLINE, MOON_HOUSE_DAY } from "./text/stars/daily-moon";
import { TRANSIT_1 } from "./text/stars/transits-1";
import { TRANSIT_2 } from "./text/stars/transits-2";
import { TRANSIT_3 } from "./text/stars/transits-3";

const TEXT = { ...TRANSIT_1, ...TRANSIT_2, ...TRANSIT_3 };
type HouseKey = keyof typeof MOON_HOUSE_DAY;
const HOUSE_AREA = ["you", "money & values", "conversations", "home", "love & creativity", "work & routines", "partners", "intimacy & change", "adventure & learning", "career", "friends & hopes", "rest & dreams"];

const FAST: SkyBody[] = ["Moon", "Sun", "Mercury", "Venus", "Mars"];
const SLOW: SkyBody[] = ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const NATAL = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Ascendant", "Midheaven"] as const;
type Natal = (typeof NATAL)[number];
const ANGLES: [string, number, "conjunction" | "harmonious" | "challenging"][] = [
  ["conjunction", 0, "conjunction"], ["sextile", 60, "harmonious"], ["square", 90, "challenging"], ["trine", 120, "harmonious"], ["opposition", 180, "challenging"],
];
/** Orbs: the Moon covers the whole day (~6°), other fast planets 1.5°, slow planets 1.5° (active for weeks or months). */
const ORB: Partial<Record<SkyBody, number>> = { Moon: 6, Sun: 1.5, Mercury: 1.5, Venus: 1.5, Mars: 1.5 };
const SLOW_ORB = 1.5;

function hash(...seed: string[]) {
  let h = 2166136261;
  for (const ch of seed.join("|")) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return Math.abs(h);
}
const pick = <T,>(list: readonly T[], ...seed: string[]) => list[hash(...seed) % list.length];

export interface PersonalTransit {
  transit: SkyBody;
  natal: Natal;
  aspect: string;
  kind: "conjunction" | "harmonious" | "challenging";
  orb: number;
  slow: boolean;
  applying: boolean;
  text: string;
}
export interface PersonalDay extends DailyHoroscope {
  personal: {
    sun: Sign;
    moonSign: Sign | null;
    rising: Sign | null;
    houseKind: "natal" | "solar";
    transits: PersonalTransit[];
    timeKnown: boolean;
  };
}

export function personalDay(chart: ChartResult, day: string): PersonalDay {
  const sun = chart.placements.find((p) => p.body === "Sun")!.sign;
  const base = dailyHoroscope(sun, day);
  const noon = ukTime(day, "12:00"), later = new Date(+noon + 3600000);
  const sky = positionsAt(noon);
  const moonLon = sky.find((p) => p.body === "Moon")!.longitude;

  const cusps = chart.timeKnown ? chart.houseCusps : null;
  const house = cusps ? houseOf(moonLon, cusps) : base.moon.house;

  const natal: { name: Natal; lon: number }[] = [];
  for (const n of NATAL) {
    if (n === "Ascendant" || n === "Midheaven") {
      const a = chart.timeKnown ? chart.angles.find((x) => x.name === n) : undefined;
      if (a) natal.push({ name: n, lon: a.longitude });
    } else {
      const p = chart.placements.find((x) => x.body === n);
      if (p && !p.signUncertain) natal.push({ name: n, lon: p.longitude });
    }
  }

  const found: (PersonalTransit & { score: number })[] = [];
  for (const t of [...FAST, ...SLOW]) {
    const slow = SLOW.includes(t);
    const limit = slow ? SLOW_ORB : ORB[t]!;
    const lon = longitudeAt(t, noon), lon2 = longitudeAt(t, later);
    for (const n of natal) {
      for (const [aspect, angle, kind] of ANGLES) {
        const sep = Math.abs(wrap180(lon - n.lon)), sep2 = Math.abs(wrap180(lon2 - n.lon));
        const orb = Math.abs(sep - angle);
        if (orb > limit) continue;
        const text = TEXT[`${t}>${n.name}`]?.[kind];
        if (!text) continue;
        // Weight: tighter is stronger; personal points (Sun, Moon, Ascendant) count a little more.
        const weight = (1 - orb / limit) + (["Sun", "Moon", "Ascendant"].includes(n.name) ? 0.2 : 0) + (slow ? 0.3 : 0);
        found.push({ transit: t, natal: n.name, aspect, kind, orb: Math.round(orb * 10) / 10, slow, applying: Math.abs(sep2 - angle) < orb, text, score: weight });
      }
    }
  }
  const fast = found.filter((f) => !f.slow).sort((a, b) => b.score - a.score);
  // Prefer one Moon transit (today's mood) and one from the other fast planets
  const fastPick = [fast.find((f) => f.transit !== "Moon"), fast.find((f) => f.transit === "Moon")].filter(Boolean) as typeof fast;
  const slowPick = found.filter((f) => f.slow).sort((a, b) => b.score - a.score).slice(0, 2);
  const transits: PersonalTransit[] = [...fastPick, ...slowPick].map((f) => ({ transit: f.transit, natal: f.natal, aspect: f.aspect, kind: f.kind, orb: f.orb, slow: f.slow, applying: f.applying, text: f.text }));

  // Gentle rating shifts from the strongest transits
  const r = { ...base.ratings };
  const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
  for (const t of transits) {
    const sign = t.kind === "challenging" ? -1 : 1;
    if (t.transit === "Venus" || t.natal === "Venus") r.love = clamp(r.love + 0.6 * sign);
    if (t.transit === "Jupiter" && t.kind !== "challenging") { r.love = clamp(r.love + 0.4); r.work = clamp(r.work + 0.4); }
    if (t.transit === "Saturn" || t.natal === "Midheaven" || t.transit === "Mercury") r.work = clamp(r.work + 0.5 * sign);
    if (t.transit === "Mars" || t.natal === "Mars" || t.transit === "Sun") r.energy = clamp(r.energy + 0.6 * (t.kind === "challenging" && t.transit !== "Mars" ? -1 : 1));
  }

  const hk = String(house) as HouseKey;
  const seed = [day, sun, String(house), "p"];
  return {
    ...base,
    headline: pick(DAY_HEADLINE[hk], ...seed, "h"),
    focus: HOUSE_AREA[house - 1],
    moon: { ...base.moon, house },
    paragraphs: [pick(MOON_HOUSE_DAY[hk], ...seed), base.paragraphs[1]].filter(Boolean),
    ratings: r,
    personal: {
      sun,
      moonSign: chart.placements.find((p) => p.body === "Moon" && !p.signUncertain)?.sign ?? null,
      rising: chart.timeKnown ? chart.angles.find((a) => a.name === "Ascendant")?.sign ?? null : null,
      houseKind: cusps ? "natal" : "solar",
      transits,
      timeKnown: chart.timeKnown,
    },
  };
}
