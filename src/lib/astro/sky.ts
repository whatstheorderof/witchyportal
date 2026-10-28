/**
 * The sky as it is — for daily, weekly and monthly horoscopes. Everything is
 * calculated from Astronomy Engine and expressed in UK time.
 */
import * as Astronomy from "astronomy-engine";
import { bodyLongitude } from "./engine";
import { localToUtc } from "./timezone";
import { SIGNS, signOf, type BodyName, type Sign } from "./types";
import type { MoonPhaseName } from "./text/types";

export const SKY_TZ = "Europe/London";
export type SkyBody = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto";
export const PLANETS: SkyBody[] = ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
export type AspectName = "conjunction" | "sextile" | "square" | "trine" | "opposition";

const HOUR = 3600000, DAY = 24 * HOUR;
// Longitudes are memoised: event searches sample the same moments many times.
const cache = new Map<string, number>();
const lon = (b: SkyBody, d: Date) => {
  const k = `${b}${+d}`;
  let v = cache.get(k);
  if (v === undefined) {
    if (cache.size > 300000) cache.clear();
    v = bodyLongitude(b as BodyName, Astronomy.MakeTime(d));
    cache.set(k, v);
  }
  return v;
};
const wrap = (x: number) => ((x + 540) % 360) - 180; // to (-180, 180]

/** YYYY-MM-DD in UK time */
export const ukDayKey = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: SKY_TZ }).format(d);
/** The UTC instant of a UK wall-clock time on a UK date */
export const ukTime = (dayKey: string, hhmm = "00:00") => localToUtc(dayKey, hhmm, SKY_TZ).utc;
export const addDays = (dayKey: string, n: number) => {
  const d = new Date(`${dayKey}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
export const signIndex = (s: Sign) => SIGNS.indexOf(s);

/** House counted from the reader's Sun sign (whole-sign solar houses), 1–12 */
export function solarHouse(reader: Sign, planetSign: Sign) {
  return ((signIndex(planetSign) - signIndex(reader) + 12) % 12) + 1;
}

/* ---------------- Moon ---------------- */

export function moonPhaseAt(d: Date): { name: MoonPhaseName; angle: number; illumination: number; waxing: boolean } {
  const t = Astronomy.MakeTime(d);
  const angle = Astronomy.MoonPhase(t);
  const names: [number, MoonPhaseName][] = [
    [11.25, "New Moon"], [78.75, "Waxing Crescent"], [101.25, "First Quarter"], [168.75, "Waxing Gibbous"],
    [191.25, "Full Moon"], [258.75, "Waning Gibbous"], [281.25, "Last Quarter"], [348.75, "Balsamic Moon"], [360, "New Moon"],
  ];
  return { name: names.find(([max]) => angle < max)![1], angle, illumination: Astronomy.Illumination(Astronomy.Body.Moon, t).phase_fraction, waxing: angle < 180 };
}

export interface SkyPosition { body: SkyBody; longitude: number; sign: Sign; degree: number; retrograde: boolean }

export function positionsAt(d: Date): SkyPosition[] {
  return (["Sun", "Moon", ...PLANETS.slice(1)] as SkyBody[]).map((body) => {
    const l = lon(body, d);
    const retro = body !== "Sun" && body !== "Moon" && wrap(lon(body, new Date(+d + DAY / 2)) - lon(body, new Date(+d - DAY / 2))) < 0;
    return { body, longitude: l, ...signOf(l), retrograde: retro };
  });
}

/* ---------------- Exact events ---------------- */

function refine(f: (t: number) => number, lo: number, hi: number, precision = 60000) {
  const sLo = Math.sign(f(lo));
  while (hi - lo > precision) {
    const mid = (lo + hi) / 2;
    if (Math.sign(f(mid)) === sLo) lo = mid; else hi = mid;
  }
  return new Date((lo + hi) / 2);
}

const ASPECT_TARGETS: [AspectName, number][] = [
  ["conjunction", 0], ["sextile", 60], ["sextile", -60], ["square", 90], ["square", -90], ["trine", 120], ["trine", -120], ["opposition", 180],
];

/** Times when two bodies form an exact major aspect between `from` and `to`. */
export function exactAspects(a: SkyBody, b: SkyBody, from: Date, to: Date, stepMs: number) {
  const out: { a: SkyBody; b: SkyBody; aspect: AspectName; time: Date }[] = [];
  for (const [aspect, target] of ASPECT_TARGETS) {
    const f = (t: number) => wrap(wrap(lon(b, new Date(t)) - lon(a, new Date(t))) - target);
    let tPrev = +from, vPrev = f(tPrev);
    for (let t = +from + stepMs; t <= +to + stepMs; t += stepMs) {
      const tt = Math.min(t, +to), v = f(tt);
      if (Math.sign(v) !== Math.sign(vPrev) && Math.abs(v) < 30 && Math.abs(vPrev) < 30) out.push({ a, b, aspect, time: refine(f, tPrev, tt) });
      tPrev = tt; vPrev = v;
      if (tt === +to) break;
    }
  }
  return out;
}

export type SkyEvent =
  | { kind: "ingress"; time: Date; body: SkyBody; sign: Sign }
  | { kind: "station"; time: Date; body: SkyBody; turns: "retrograde" | "direct"; sign: Sign }
  | { kind: "aspect"; time: Date; a: SkyBody; b: SkyBody; aspect: AspectName }
  | { kind: "lunation"; time: Date; phase: "new" | "first" | "full" | "last"; sign: Sign; eclipse?: "solar" | "lunar" };

/** Sign changes of a body (not the Moon) between two moments */
export function ingresses(body: SkyBody, from: Date, to: Date, stepMs = 6 * HOUR) {
  const out: { time: Date; sign: Sign }[] = [];
  const idx = (t: number) => Math.floor(lon(body, new Date(t)) / 30);
  let prev = idx(+from);
  for (let t = +from + stepMs; t <= +to; t += stepMs) {
    const cur = idx(t);
    if (cur !== prev) {
      const before = prev;
      const time = refine((x) => (idx(x) === before ? -1 : 1), t - stepMs, t);
      out.push({ time, sign: SIGNS[cur] });
    }
    prev = cur;
  }
  return out;
}

export function stations(body: SkyBody, from: Date, to: Date) {
  const motion = (t: number) => wrap(lon(body, new Date(t + DAY / 4)) - lon(body, new Date(t)));
  const out: { time: Date; turns: "retrograde" | "direct"; sign: Sign }[] = [];
  let prev = motion(+from - DAY);
  for (let t = +from; t <= +to; t += DAY) {
    const m = motion(t);
    if (Math.sign(m) !== Math.sign(prev)) {
      const time = refine(motion, t - DAY, t, HOUR);
      out.push({ time, turns: m < 0 ? "retrograde" : "direct", sign: signOf(lon(body, time)).sign });
    }
    prev = m;
  }
  return out;
}

export function lunations(from: Date, to: Date) {
  const kinds = ["new", "first", "full", "last"] as const;
  const out: Extract<SkyEvent, { kind: "lunation" }>[] = [];
  let q = Astronomy.SearchMoonQuarter(Astronomy.MakeTime(from));
  while (q.time.date < to) {
    const ev: Extract<SkyEvent, { kind: "lunation" }> = { kind: "lunation", time: q.time.date, phase: kinds[q.quarter], sign: signOf(lon("Moon", q.time.date)).sign };
    if (q.quarter === 0) {
      const e = Astronomy.SearchGlobalSolarEclipse(Astronomy.MakeTime(new Date(+q.time.date - 2 * DAY)));
      if (Math.abs(+e.peak.date - +q.time.date) < DAY) ev.eclipse = "solar";
    }
    if (q.quarter === 2) {
      const e = Astronomy.SearchLunarEclipse(Astronomy.MakeTime(new Date(+q.time.date - 2 * DAY)));
      if (Math.abs(+e.peak.date - +q.time.date) < DAY) ev.eclipse = "lunar";
    }
    out.push(ev);
    q = Astronomy.NextMoonQuarter(q);
  }
  return out;
}

/** Every notable event between two moments, in time order. */
export function skyEvents(from: Date, to: Date): SkyEvent[] {
  const out: SkyEvent[] = [];
  for (const body of ["Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"] as SkyBody[])
    for (const i of ingresses(body, from, to)) out.push({ kind: "ingress", body, ...i });
  for (const body of PLANETS.slice(1)) for (const s of stations(body, from, to)) out.push({ kind: "station", body, ...s });
  for (let i = 0; i < PLANETS.length; i++)
    for (let j = i + 1; j < PLANETS.length; j++) {
      // Two slow outer planets rarely perfect an aspect; skip pairs that cannot move enough to matter.
      for (const x of exactAspects(PLANETS[i], PLANETS[j], from, to, 6 * HOUR)) out.push({ kind: "aspect", ...x });
    }
  out.push(...lunations(from, to));
  return out.sort((x, y) => +x.time - +y.time);
}

/** When the Moon enters each sign between two moments. */
export function moonIngresses(from: Date, to: Date) {
  return ingresses("Moon", from, to, 2 * HOUR);
}

/** The Moon's exact aspects to the planets during one UK day. */
export function moonAspectsOnDay(dayKey: string) {
  const from = ukTime(dayKey), to = ukTime(addDays(dayKey, 1));
  return PLANETS.flatMap((p) => exactAspects("Moon", p, from, to, HOUR)).sort((x, y) => +x.time - +y.time);
}

export function signTimeLabel(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: SKY_TZ, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(d);
}
