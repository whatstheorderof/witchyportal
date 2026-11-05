/**
 * Retrograde periods with their shadows, and the year's eclipses — from
 * Astronomy Engine, in UK time.
 *
 *  - Pre-shadow: from the moment the planet first reaches the degree where it
 *    will later turn direct, until it stations retrograde.
 *  - Post-shadow: from the direct station until the planet is back at the
 *    degree where it turned retrograde.
 */
import { msg } from "@/i18n/config";
import * as Astronomy from "astronomy-engine";
import { longitudeAt, stations, wrap180, type SkyBody } from "./sky";
import { SIGNS, signOf, type Sign } from "./types";

const DAY = 86400000;

export interface RetroPeriod {
  body: SkyBody;
  preShadow: Date;
  stationRetrograde: Date;
  stationDirect: Date;
  postShadow: Date;
  /** Sign at the retrograde station, where its themes are strongest */
  sign: Sign;
  /** Every sign the retrograde stretch touches (from the direct degree up to the retrograde degree) */
  signs: Sign[];
  retroDegree: { sign: Sign; degree: number };
  directDegree: { sign: Sign; degree: number };
}

/** Find when `body` crosses longitude `target` between two moments (moving forwards). */
function crossing(body: SkyBody, target: number, from: number, to: number, step: number, forwards: boolean) {
  const f = (t: number) => wrap180(longitudeAt(body, new Date(t)) - target);
  if (forwards) {
    let prev = from, vp = f(prev);
    for (let t = from + step; t <= to; t += step) {
      const v = f(t);
      if (vp < 0 && v >= 0 && Math.abs(v - vp) < 30) return bisect(f, prev, t);
      prev = t; vp = v;
    }
  } else {
    let next = to, vn = f(next);
    for (let t = to - step; t >= from; t -= step) {
      const v = f(t);
      if (v < 0 && vn >= 0 && Math.abs(vn - v) < 30) return bisect(f, t, next);
      next = t; vn = v;
    }
  }
  return null;
}
function bisect(f: (t: number) => number, lo: number, hi: number) {
  while (hi - lo > 60000) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid; else hi = mid;
  }
  return new Date((lo + hi) / 2);
}

/** Sharpen a station time: where the central-difference motion changes sign. */
function sharpen(body: SkyBody, t: Date) {
  const m = (x: number) => wrap180(longitudeAt(body, new Date(x + 1800000)) - longitudeAt(body, new Date(x - 1800000)));
  let lo = +t - DAY, hi = +t + DAY;
  const sLo = Math.sign(m(lo));
  if (sLo === Math.sign(m(hi))) return t;
  while (hi - lo > 60000) {
    const mid = (lo + hi) / 2;
    if (Math.sign(m(mid)) === sLo) lo = mid; else hi = mid;
  }
  return new Date(Math.round((lo + hi) / 2 / 60000) * 60000);
}

const SHADOW_SEARCH: Partial<Record<SkyBody, number>> = { Mercury: 45, Venus: 90, Mars: 120 };

/** Retrograde periods whose retrograde stretch overlaps [from, to]. */
export function retrogradePeriods(body: SkyBody, from: Date, to: Date): RetroPeriod[] {
  const span = (SHADOW_SEARCH[body] ?? 200) * DAY;
  const list = stations(body, new Date(+from - span), new Date(+to + span));
  const out: RetroPeriod[] = [];
  for (let i = 0; i < list.length; i++) {
    const r0 = list[i], d0 = list[i + 1];
    if (r0.turns !== "retrograde" || !d0 || d0.turns !== "direct") continue;
    const r = { ...r0, time: sharpen(body, r0.time) }, d = { ...d0, time: sharpen(body, d0.time) };
    if (+d.time < +from || +r.time > +to) continue;
    const rl = longitudeAt(body, r.time), dl = longitudeAt(body, d.time);
    const pre = crossing(body, dl, +r.time - span, +r.time, DAY / 2, false) ?? r.time;
    const post = crossing(body, rl, +d.time, +d.time + span, DAY / 2, true) ?? d.time;
    const signs: Sign[] = [];
    const a = Math.floor(dl / 30), b = Math.floor(rl / 30);
    for (let k = a; ; k = (k + 1) % 12) { signs.push(SIGNS[k]); if (k === b || signs.length > 3) break; }
    out.push({ body, preShadow: pre, stationRetrograde: r.time, stationDirect: d.time, postShadow: post, sign: r.sign, signs, retroDegree: signOf(rl), directDegree: signOf(dl) });
  }
  return out;
}

/** Is `body` retrograde (or in shadow) at a moment? */
export function retroStatus(body: SkyBody, at: Date) {
  const periods = retrogradePeriods(body, new Date(+at - 120 * DAY), new Date(+at + 400 * DAY));
  for (const p of periods) {
    if (+at >= +p.stationRetrograde && +at < +p.stationDirect) return { state: "retrograde" as const, period: p };
    if (+at >= +p.preShadow && +at < +p.stationRetrograde) return { state: "pre-shadow" as const, period: p };
    if (+at >= +p.stationDirect && +at < +p.postShadow) return { state: "post-shadow" as const, period: p };
  }
  return { state: "direct" as const, period: periods.find((p) => +p.preShadow > +at) ?? null };
}

/* ---------------- Eclipses ---------------- */

const LONDON = new Astronomy.Observer(51.5074, -0.1278, 11);
const LUNAR_KIND: Record<string, string> = { penumbral: msg("Penumbral"), partial: msg("Partial"), total: msg("Total") };
const SOLAR_KIND: Record<string, string> = { partial: msg("Partial"), annular: msg("Annular"), total: msg("Total"), hybrid: msg("Hybrid") };

export interface Eclipse {
  type: "solar" | "lunar";
  kind: string;
  time: Date;
  sign: Sign;
  degree: number;
  /** UK visibility in plain words: an interface template, fill {pct} with ukPct */
  uk: string;
  ukPct?: number;
  visibleUk: boolean;
}

/** All eclipses whose peak falls in the UK calendar year. */
export function eclipsesIn(year: number): Eclipse[] {
  const y0 = new Date(Date.UTC(year, 0, 1) - DAY), y1 = new Date(Date.UTC(year + 1, 0, 1) + DAY);
  const inYear = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(d).startsWith(String(year));
  const out: Eclipse[] = [];
  for (let e = Astronomy.SearchLunarEclipse(Astronomy.MakeTime(y0)); e.peak.date < y1; e = Astronomy.NextLunarEclipse(e.peak)) {
    if (!inYear(e.peak.date)) continue;
    const eq = Astronomy.Equator(Astronomy.Body.Moon, e.peak, LONDON, true, true);
    const alt = Astronomy.Horizon(e.peak, LONDON, eq.ra, eq.dec, "normal").altitude;
    const p = signOf(Astronomy.EclipticGeoMoon(e.peak).lon);
    out.push({ type: "lunar", kind: LUNAR_KIND[e.kind] ?? "Lunar", time: e.peak.date, ...p, visibleUk: alt > 0, uk: alt > 0 ? msg("Visible from the UK — the Moon is above the horizon at the peak.") : msg("Not visible from the UK — the Moon is below the horizon at the peak.") });
  }
  for (let e = Astronomy.SearchGlobalSolarEclipse(Astronomy.MakeTime(y0)); e.peak.date < y1; e = Astronomy.NextGlobalSolarEclipse(e.peak)) {
    if (!inYear(e.peak.date)) continue;
    let uk = "", vis = false, ukPct: number | undefined;
    try {
      const local = Astronomy.SearchLocalSolarEclipse(Astronomy.MakeTime(new Date(+e.peak.date - 2 * DAY)), LONDON);
      if (Math.abs(+local.peak.time.date - +e.peak.date) < DAY && local.peak.altitude > 0 && local.obscuration > 0) {
        vis = true;
        uk = msg("Visible from the UK — about {pct}% of the Sun is covered from London at the peak. Never look at the Sun directly.");
        ukPct = Math.max(1, Math.round(local.obscuration * 100));
      }
    } catch { /* not visible */ }
    const p = signOf(Astronomy.EclipticGeoMoon(e.peak).lon);
    out.push({ type: "solar", kind: SOLAR_KIND[e.kind] ?? "Solar", time: e.peak.date, ...p, visibleUk: vis, uk: uk || msg("Not visible from the UK."), ukPct });
  }
  return out.sort((a, b) => +a.time - +b.time);
}
