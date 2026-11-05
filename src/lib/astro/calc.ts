import "server-only";
/**
 * The single-purpose calculators: rising, Moon, big three, Venus, Mars and
 * Saturn return. Reads a calculated natal chart; never invents positions.
 */
import * as Astronomy from "astronomy-engine";
import { bodyLongitude } from "./engine";
import { ukDayKey } from "./sky";
import type { BodyName, ChartResult, Sign } from "./types";
import type { CalcCard, CalcKind, CalcResult, SaturnReturn } from "./calc-meta";
import type { SignTextWithShort } from "./text/types";
import { msg } from "@/i18n/config";
import { RX_EN, type Rx } from "@/i18n/readings";
import { SUN_IN_SIGN } from "./text/sun";
import { MOON_IN_SIGN } from "./text/moon";
import { VENUS_IN_SIGN } from "./text/venus";
import { MARS_IN_SIGN } from "./text/mars";
import { SATURN_IN_SIGN } from "./text/saturn";
import { ASCENDANT_IN_SIGN } from "./text/angles";
import { TRANSIT_3 } from "./text/stars/transits-3";

const DAY = 86400000;
/** Card labels (translated in bodyCard). */
export const CALC_LABELS = [msg("Moon sign"), msg("Sun sign"), msg("Venus sign"), msg("Mars sign"), msg("Saturn sign")];
const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
const wrap = (x: number) => ((x + 540) % 360) - 180;

function bodyCard(rx: Rx, chart: ChartResult, body: BodyName, label: string, texts: SignTextWithShort, short = false): CalcCard {
  const t = rx.t;
  const p = chart.placements.find((x) => x.body === body)!;
  if (p.signUncertain && p.possibleSigns && p.possibleSigns.length > 1) {
    const [a, b] = p.possibleSigns;
    return {
      label: t(label), sign: null, degree: null, possibleSigns: p.possibleSigns,
      short: t("Your {body} was in {a} or {b} on the day you were born — it changed sign during the day, so your birth time decides which.", { body: t(body), a: t(a), b: t(b) }),
      paragraphs: p.possibleSigns.map((s) => t("{body} in {sign}: {text}", { body: t(body), sign: t(s), text: rx(texts[s].short) })),
      note: t("Add your birth time to know for sure."),
    };
  }
  return { label: t(label), sign: p.sign, degree: p.degree, short: texts[p.sign].short, paragraphs: short ? [] : paras(texts[p.sign].text) };
}

function risingCard(rx: Rx, chart: ChartResult, short = false): CalcCard {
  const t = rx.t;
  const asc = chart.angles.find((a) => a.name === "Ascendant");
  if (!asc || !chart.timeKnown) {
    return { label: t("Rising sign"), sign: null, degree: null, short: t("Your rising sign needs your birth time: it changes about every two hours."), paragraphs: [], note: t("Add your birth time to find your rising sign.") };
  }
  return { label: t("Rising sign"), sign: asc.sign, degree: asc.degree, short: ASCENDANT_IN_SIGN[asc.sign].short, paragraphs: short ? [] : paras(ASCENDANT_IN_SIGN[asc.sign].text) };
}

/** Every exact return of transiting Saturn to its birth longitude, grouped into returns. */
export function saturnReturns(natalLon: number, birth: Date, now = new Date()): SaturnReturn[] {
  const f = (t: number) => wrap(bodyLongitude("Saturn", Astronomy.MakeTime(new Date(t))) - natalLon);
  const start = +birth + 20 * 365.25 * DAY, end = +birth + 95 * 365.25 * DAY, step = 2 * DAY;
  const groups: { hits: number[]; from: number; to: number }[] = [];
  let prevT = start, prevV = f(start), inside = Math.abs(prevV) <= 3;
  let cur: { hits: number[]; from: number; to: number } | null = inside ? { hits: [], from: start, to: start } : null;
  for (let t = start + step; t <= end; t += step) {
    const v = f(t);
    if (Math.sign(v) !== Math.sign(prevV) && Math.abs(v - prevV) < 30) {
      let lo = prevT, hi = t;
      const sLo = Math.sign(prevV);
      while (hi - lo > 3600000) { const mid = (lo + hi) / 2; if (Math.sign(f(mid)) === sLo) lo = mid; else hi = mid; }
      (cur ??= { hits: [], from: t, to: t }).hits.push((lo + hi) / 2);
    }
    const nowInside = Math.abs(v) <= 3;
    if (nowInside && !inside) cur ??= { hits: [], from: t, to: t };
    if (cur && nowInside) cur.to = t;
    if (!nowInside && inside && cur) { groups.push(cur); cur = null; }
    inside = nowInside; prevT = t; prevV = v;
  }
  if (cur) groups.push(cur);
  // Merge windows that belong to the same return (retrograde loops can leave the 3° band briefly)
  const merged: typeof groups = [];
  for (const g of groups.filter((x) => x.hits.length)) {
    const last = merged.at(-1);
    if (last && g.from - last.to < 400 * DAY) { last.hits.push(...g.hits); last.to = g.to; } else merged.push({ ...g, hits: [...g.hits] });
  }
  return merged.map((g, i) => ({
    n: i + 1,
    hits: g.hits.map((h) => ukDayKey(new Date(h))),
    from: ukDayKey(new Date(g.from)),
    to: ukDayKey(new Date(g.to)),
    age: Math.floor((g.hits[0] - +birth) / (365.25 * DAY)),
    status: +now < g.from ? "future" : +now > g.to ? "past" : "now",
  }));
}

export function calculate(kind: CalcKind, chart: ChartResult, rx: Rx = RX_EN): CalcResult {
  return rx.deep(calculateEn(kind, chart, rx));
}

function calculateEn(kind: CalcKind, chart: ChartResult, rx: Rx): CalcResult {
  const notes: string[] = [];
  if (!chart.timeKnown) notes.push(rx("Without a birth time we use the middle of the day. Planets' signs are still reliable unless one changed sign that day (we'll say so), but the rising sign and houses can't be known."));
  if (chart.isFixture) notes.push(rx.t("These are sample positions, not your real chart."));
  switch (kind) {
    case "rising":
      return { kind, cards: [risingCard(rx, chart)], notes };
    case "moon":
      return { kind, cards: [bodyCard(rx, chart, "Moon", "Moon sign", MOON_IN_SIGN)], notes };
    case "big-three":
      return { kind, cards: [bodyCard(rx, chart, "Sun", "Sun sign", SUN_IN_SIGN, true), bodyCard(rx, chart, "Moon", "Moon sign", MOON_IN_SIGN, true), risingCard(rx, chart, true)], notes };
    case "venus":
      return { kind, cards: [bodyCard(rx, chart, "Venus", "Venus sign", VENUS_IN_SIGN)], notes };
    case "mars":
      return { kind, cards: [bodyCard(rx, chart, "Mars", "Mars sign", MARS_IN_SIGN)], notes };
    case "saturn-return": {
      const sat = chart.placements.find((p) => p.body === "Saturn")!;
      const card = bodyCard(rx, chart, "Saturn", "Saturn sign", SATURN_IN_SIGN, true);
      const returns = saturnReturns(sat.longitude, new Date(chart.utc));
      return { kind, cards: [card], notes, returns, returnText: paras(TRANSIT_3["Saturn>Saturn"].conjunction) };
    }
  }
}

export type { Sign };
