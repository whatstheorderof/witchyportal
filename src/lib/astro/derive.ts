/**
 * Chart features derived from placements and angles — shared by every
 * provider so the rules are identical whatever calculates the positions.
 */
import type { Angle, Aspect, AspectFactor, AspectType, Balance, BodyName, Element, Modality, MoonPhaseInfo, Placement, Point, Sign } from "./types";
import { SIGNS, signOf } from "./types";

const norm = (x: number) => ((x % 360) + 360) % 360;

export const SIGN_ELEMENT: Record<Sign, Element> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};
export const SIGN_MODALITY: Record<Sign, Modality> = Object.fromEntries(
  SIGNS.map((s, i) => [s, (["Cardinal", "Fixed", "Mutable"] as const)[i % 3]]),
) as Record<Sign, Modality>;

export function houseOf(longitude: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const span = norm(cusps[(i + 1) % 12] - cusps[i]);
    if (norm(longitude - cusps[i]) < span) return i + 1;
  }
  return 1;
}

/* ---------------- Aspects ---------------- */

const ASPECT_ANGLES: { type: AspectType; angle: number }[] = [
  { type: "conjunction", angle: 0 },
  { type: "sextile", angle: 60 },
  { type: "square", angle: 90 },
  { type: "trine", angle: 120 },
  { type: "opposition", angle: 180 },
];

const OUTER = new Set<AspectFactor>(["Uranus", "Neptune", "Pluto"]);
const POINTS = new Set<AspectFactor>(["North Node", "Lilith"]);
const ANGLES = new Set<AspectFactor>(["Ascendant", "Midheaven"]);

/**
 * Orbs (documented in docs/BIRTH_CHART.md):
 *  - planets and angles: conjunction/opposition 10°, square/trine 8°, sextile 5°;
 *  - between two outer planets (shared by a whole generation): 60% of that;
 *  - the North Node and Lilith: conjunction/opposition 6°, square/trine 4°, sextile 3°,
 *    and only to planets (not to the Ascendant or Midheaven).
 */
export function maxOrb(a: AspectFactor, b: AspectFactor, type: AspectType): number {
  if (POINTS.has(a) || POINTS.has(b)) return { conjunction: 6, opposition: 6, square: 4, trine: 4, sextile: 3 }[type];
  const base = { conjunction: 10, opposition: 10, square: 8, trine: 8, sextile: 5 }[type];
  return OUTER.has(a) && OUTER.has(b) ? base * 0.6 : base;
}

type Positioned = { factor: AspectFactor; longitude: number; speed?: number };

export function findAspects(placements: Placement[], angles: Angle[], speeds?: Partial<Record<BodyName, number>>): Aspect[] {
  const list: Positioned[] = [
    ...placements.filter((p) => !p.signUncertain).map((p) => ({ factor: p.body as AspectFactor, longitude: p.longitude, speed: speeds?.[p.body] })),
    ...angles.filter((a) => a.name === "Ascendant" || a.name === "Midheaven").map((a) => ({ factor: a.name as AspectFactor, longitude: a.longitude, speed: 0 })),
  ];
  const out: Aspect[] = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const A = list[i], B = list[j];
      if (ANGLES.has(A.factor) && ANGLES.has(B.factor)) continue;
      if (POINTS.has(A.factor) && (POINTS.has(B.factor) || ANGLES.has(B.factor))) continue;
      if (POINTS.has(B.factor) && ANGLES.has(A.factor)) continue;
      let sep = Math.abs(A.longitude - B.longitude);
      if (sep > 180) sep = 360 - sep;
      for (const asp of ASPECT_ANGLES) {
        const orb = Math.abs(sep - asp.angle);
        const limit = maxOrb(A.factor, B.factor, asp.type);
        if (orb > limit) continue;
        // Applying: will the separation move towards the exact angle in the next moment?
        let applying: boolean | null = null;
        if (A.speed != null && B.speed != null) {
          const step = 0.01;
          let sep2 = Math.abs(A.longitude + A.speed * step - (B.longitude + B.speed * step));
          sep2 = sep2 % 360;
          if (sep2 > 180) sep2 = 360 - sep2;
          applying = Math.abs(sep2 - asp.angle) < orb;
        }
        out.push({ a: A.factor, b: B.factor, type: asp.type, orb: Math.round(orb * 100) / 100, maxOrb: limit, strength: Math.max(1, Math.round((1 - orb / limit) * 100)), applying });
      }
    }
  }
  return out.sort((x, y) => x.orb / x.maxOrb - y.orb / y.maxOrb);
}

/* ---------------- Points, phase, balance ---------------- */

export function derivePoints(placements: Placement[], angles: Angle[], cusps: number[] | null): Point[] {
  const get = (b: BodyName) => placements.find((p) => p.body === b);
  const sun = get("Sun"), moon = get("Moon"), node = get("North Node");
  const asc = angles.find((a) => a.name === "Ascendant");
  const out: Point[] = [];
  const mk = (name: Point["name"], l: number): Point => ({ name, longitude: norm(l), ...signOf(l), house: cusps ? houseOf(norm(l), cusps) : null });
  // Part of Fortune, classic formula (same by day and night): Ascendant + Moon − Sun
  if (asc && sun && moon && !moon.signUncertain) out.push(mk("Part of Fortune", asc.longitude + moon.longitude - sun.longitude));
  if (node) out.push(mk("South Node", node.longitude + 180));
  return out;
}

export function moonPhase(placements: Placement[]): MoonPhaseInfo | null {
  const sun = placements.find((p) => p.body === "Sun");
  const moon = placements.find((p) => p.body === "Moon");
  if (!sun || !moon || moon.signUncertain) return null;
  const e = norm(moon.longitude - sun.longitude);
  const names: MoonPhaseInfo["name"][] = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Balsamic Moon"];
  return { name: names[Math.floor(e / 45) % 8], elongation: e, illumination: (1 - Math.cos((e * Math.PI) / 180)) / 2 };
}

const TEN: BodyName[] = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

export function balanceOf(placements: Placement[]): Balance {
  const elements: Record<Element, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalities: Record<Modality, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  let yang = 0, yin = 0;
  for (const p of placements) {
    if (!TEN.includes(p.body) || p.signUncertain) continue;
    const el = SIGN_ELEMENT[p.sign];
    elements[el]++;
    modalities[SIGN_MODALITY[p.sign]]++;
    if (el === "Fire" || el === "Air") yang++; else yin++;
  }
  return { elements, modalities, polarity: { yang, yin } };
}
