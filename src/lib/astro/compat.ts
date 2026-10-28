import "server-only";
/**
 * Compatibility: Sun-sign pairings (free), Venus love signs (free) and full
 * birth-chart synastry (the paid report).
 */
import * as Astronomy from "astronomy-engine";
import { bodyLongitude } from "./engine";
import { SIGNS, signOf, type BodyName, type ChartResult, type Sign } from "./types";
import { ukTime } from "./sky";
import { SUN_PAIRS_1 } from "./text/stars/compat-1";
import { SUN_PAIRS_2 } from "./text/stars/compat-2";
import { VENUS_LOVE_STYLE, VENUS_PAIRS } from "./text/stars/venus-pairs";
import { SYNASTRY_1 } from "./text/stars/synastry-1";
import { SYNASTRY_2 } from "./text/stars/synastry-2";
import { OVERLAY, SCORE_NOTE, SYNASTRY_3 } from "./text/stars/synastry-3";

const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);

/* ---------------- Sun signs ---------------- */

export function pairKey(a: Sign, b: Sign): [Sign, Sign] {
  return SIGNS.indexOf(a) <= SIGNS.indexOf(b) ? [a, b] : [b, a];
}
export const pairSlug = (a: Sign, b: Sign) => { const [x, y] = pairKey(a, b); return `${x.toLowerCase()}-and-${y.toLowerCase()}`; };
export function parsePairSlug(slug: string): [Sign, Sign] | null {
  const m = /^([a-z]+)-and-([a-z]+)$/.exec(slug.toLowerCase());
  const find = (s: string) => SIGNS.find((x) => x.toLowerCase() === s);
  const a = m && find(m[1]), b = m && find(m[2]);
  return a && b ? [a, b] : null;
}

const RELATION = ["same sign", "neighbours", "sextile", "square", "trine", "quincunx", "opposites"] as const;
const SCORES: Record<number, { overall: number; love: number; friendship: number; communication: number; trust: number }> = {
  0: { overall: 8, love: 8, friendship: 9, communication: 9, trust: 8 },
  1: { overall: 6, love: 6, friendship: 7, communication: 6, trust: 6 },
  2: { overall: 8, love: 8, friendship: 9, communication: 9, trust: 7 },
  3: { overall: 5, love: 6, friendship: 5, communication: 5, trust: 5 },
  4: { overall: 9, love: 9, friendship: 9, communication: 8, trust: 9 },
  5: { overall: 5, love: 5, friendship: 6, communication: 5, trust: 6 },
  6: { overall: 7, love: 8, friendship: 6, communication: 6, trust: 6 },
};
const RELATION_NOTE: Record<number, string> = {
  0: "Two of the same sign: instant recognition, and the same blind spots.",
  1: "Neighbouring signs: different temperaments that teach each other a great deal.",
  2: "A sextile: friendly elements that spark easy conversation and shared plans.",
  3: "A square: different rhythms that create chemistry and friction in equal measure.",
  4: "A trine: the same element — a natural, flowing understanding.",
  5: "A quincunx: little in common at first, so this bond grows through curiosity and adjustment.",
  6: "Opposites: a magnetic pull between two halves of the same axis.",
};

export function sunCompatibility(a: Sign, b: Sign) {
  const [x, y] = pairKey(a, b);
  const key = `${x}|${y}`;
  const t = SUN_PAIRS_1[key] ?? SUN_PAIRS_2[key];
  const d = Math.min(Math.abs(SIGNS.indexOf(x) - SIGNS.indexOf(y)), 12 - Math.abs(SIGNS.indexOf(x) - SIGNS.indexOf(y)));
  return { a: x, b: y, relation: RELATION[d], relationNote: RELATION_NOTE[d], scores: SCORES[d], text: { summary: paras(t.summary), love: paras(t.love), friendship: paras(t.friendship), challenge: paras(t.challenge), advice: paras(t.advice) } };
}

/* ---------------- Venus (love signs) ---------------- */

/** Venus's sign on a date (UK). `uncertain` if Venus changed sign that day. */
export function venusOn(day: string) {
  const at = (h: string) => signOf(bodyLongitude("Venus", Astronomy.MakeTime(ukTime(day, h)))).sign;
  const s0 = at("00:00"), s1 = at("23:59"), noon = at("12:00");
  const sunSign = signOf(bodyLongitude("Sun", Astronomy.MakeTime(ukTime(day, "12:00")))).sign;
  return { venus: noon, possible: s0 !== s1 ? [s0, s1] : null, sun: sunSign };
}

export function venusCompatibility(a: Sign, b: Sign) {
  const [x, y] = pairKey(a, b);
  return { a: x, b: y, text: paras(VENUS_PAIRS[`${x}|${y}`] ?? ""), styleA: VENUS_LOVE_STYLE[a], styleB: VENUS_LOVE_STYLE[b] };
}

/* ---------------- Birth chart synastry ---------------- */

type Factor = BodyName | "Ascendant";
type SynText = { conjunction: string; harmonious: string; square: string; opposition: string };
const SYN: Record<string, SynText> = { ...SYNASTRY_1, ...SYNASTRY_2, ...SYNASTRY_3 };
const PERSONAL: Factor[] = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Ascendant"];
const ASPECTS = [
  { type: "conjunction", angle: 0, orb: 8 },
  { type: "sextile", angle: 60, orb: 5 },
  { type: "square", angle: 90, orb: 7 },
  { type: "trine", angle: 120, orb: 7 },
  { type: "opposition", angle: 180, orb: 8 },
] as const;
type AspectType = (typeof ASPECTS)[number]["type"];

export interface SynAspect { a: Factor; b: Factor; type: AspectType; orb: number; strength: number; heading: string; paragraphs: string[]; weight: number }
export interface SynOverlay { planet: string; house: number; owner: "A" | "B"; heading: string; paragraphs: string[] }
export interface SynastryReport {
  names: { a: string; b: string };
  scores: { area: "love" | "communication" | "passion" | "stability" | "growth"; score: number; note: string }[];
  overall: number;
  bigThree: { a: { sun: Sign; moon: Sign; venus: Sign; asc: Sign | null }; b: { sun: Sign; moon: Sign; venus: Sign; asc: Sign | null } };
  aspects: SynAspect[];
  overlays: SynOverlay[];
  notes: string[];
}

const fill = (t: string, A: string, B: string) => t.replaceAll("{A}", A).replaceAll("{B}", B);
const word = { conjunction: "conjunct", sextile: "sextile", square: "square", trine: "trine", opposition: "opposite" } as const;

// How much each pair contributes to each area of the relationship
const AREAS: Record<SynastryReport["scores"][number]["area"], [Factor, Factor][]> = {
  love: [["Sun", "Moon"], ["Moon", "Venus"], ["Venus", "Venus"], ["Sun", "Venus"], ["Moon", "Moon"], ["Venus", "Ascendant"], ["Moon", "Ascendant"]],
  communication: [["Mercury", "Mercury"], ["Sun", "Mercury"], ["Moon", "Mercury"], ["Mercury", "Venus"], ["Mercury", "Ascendant"], ["Mercury", "Jupiter"]],
  passion: [["Venus", "Mars"], ["Mars", "Mars"], ["Sun", "Mars"], ["Moon", "Mars"], ["Pluto", "Venus"], ["Pluto", "Mars"], ["Mars", "Ascendant"]],
  stability: [["Sun", "Saturn"], ["Moon", "Saturn"], ["Venus", "Saturn"], ["Saturn", "Saturn"], ["Saturn", "Ascendant"], ["Sun", "Sun"]],
  growth: [["Sun", "Jupiter"], ["Moon", "Jupiter"], ["Venus", "Jupiter"], ["Jupiter", "Jupiter"], ["Jupiter", "Ascendant"], ["Uranus", "Sun"]],
};
const same = (p: [Factor, Factor], x: Factor, y: Factor) => (p[0] === x && p[1] === y) || (p[0] === y && p[1] === x);

export function synastry(A: ChartResult, B: ChartResult, nameA = "You", nameB = "Them"): SynastryReport {
  const factorsOf = (c: ChartResult) => {
    const list: { f: Factor; lon: number }[] = c.placements.filter((p) => (PERSONAL as string[]).includes(p.body) && !p.signUncertain).map((p) => ({ f: p.body as Factor, lon: p.longitude }));
    const asc = c.angles.find((x) => x.name === "Ascendant");
    if (asc) list.push({ f: "Ascendant", lon: asc.longitude });
    return list;
  };
  const fa = factorsOf(A), fb = factorsOf(B);
  const aspects: SynAspect[] = [];
  for (const x of fa) for (const y of fb) {
    let sep = Math.abs(x.lon - y.lon);
    if (sep > 180) sep = 360 - sep;
    for (const asp of ASPECTS) {
      const orb = Math.abs(sep - asp.angle);
      if (orb > asp.orb) continue;
      // Find the text: key "X|Y" means {A} is the X person
      let text: SynText | undefined, first = nameA, second = nameB, k1 = x.f, k2 = y.f;
      if (SYN[`${x.f}|${y.f}`]) text = SYN[`${x.f}|${y.f}`];
      else if (SYN[`${y.f}|${x.f}`]) { text = SYN[`${y.f}|${x.f}`]; first = nameB; second = nameA; k1 = y.f; k2 = x.f; }
      if (!text) continue;
      const kind = asp.type === "trine" || asp.type === "sextile" ? "harmonious" : asp.type;
      const strength = Math.round((1 - orb / asp.orb) * 100);
      const nature = asp.type === "conjunction" ? 0.6 : kind === "harmonious" ? 1 : -0.7;
      aspects.push({
        a: x.f, b: y.f, type: asp.type, orb: Math.round(orb * 100) / 100, strength,
        heading: `${first}'s ${k1} ${word[asp.type]} ${second}'s ${k2}`,
        paragraphs: paras(fill(text[kind], first, second)),
        weight: nature * (0.4 + strength / 100),
      });
    }
  }
  aspects.sort((p, q) => q.strength - p.strength);

  const overlays: SynOverlay[] = [];
  const addOverlays = (from: ChartResult, to: ChartResult, owner: "A" | "B") => {
    if (!to.houseCusps) return;
    const [nf, nt] = owner === "A" ? [nameA, nameB] : [nameB, nameA];
    for (const p of from.placements) {
      if (!(p.body in OVERLAY) || p.signUncertain) continue;
      const house = houseOf(p.longitude, to.houseCusps);
      const t = OVERLAY[p.body as keyof typeof OVERLAY][String(house) as keyof (typeof OVERLAY)["Sun"]];
      overlays.push({ planet: p.body, house, owner, heading: `${nf}'s ${p.body} in ${nt}'s ${ordinal(house)} house`, paragraphs: paras(fill(t, nf, nt)) });
    }
  };
  addOverlays(A, B, "A");
  addOverlays(B, A, "B");

  const scores = (Object.keys(AREAS) as (keyof typeof AREAS)[]).map((area) => {
    let s = 55;
    for (const a of aspects) if (AREAS[area].some((p) => same(p, a.a, a.b))) s += a.weight * 14;
    // Element harmony between Sun, Moon and Venus signs adds a little
    const score = Math.max(20, Math.min(97, Math.round(s)));
    const band = score >= 72 ? "high" : score >= 50 ? "mid" : "low";
    return { area, score, note: SCORE_NOTE[area][band] };
  });
  const overall = Math.round(scores.reduce((n, s) => n + s.score, 0) / scores.length);

  const signOfBody = (c: ChartResult, b: BodyName) => c.placements.find((p) => p.body === b)!.sign;
  const notes: string[] = [];
  if (!A.timeKnown || !B.timeKnown) notes.push("Without both birth times, rising signs and house overlays are left out for the person whose time is unknown, and a Moon that changed sign that day isn't used.");
  return {
    names: { a: nameA, b: nameB },
    scores,
    overall,
    bigThree: {
      a: { sun: signOfBody(A, "Sun"), moon: signOfBody(A, "Moon"), venus: signOfBody(A, "Venus"), asc: A.angles.find((x) => x.name === "Ascendant")?.sign ?? null },
      b: { sun: signOfBody(B, "Sun"), moon: signOfBody(B, "Moon"), venus: signOfBody(B, "Venus"), asc: B.angles.find((x) => x.name === "Ascendant")?.sign ?? null },
    },
    aspects,
    overlays,
    notes,
  };
}

function houseOf(longitude: number, cusps: number[]) {
  const norm = (x: number) => ((x % 360) + 360) % 360;
  for (let i = 0; i < 12; i++) if (norm(longitude - cusps[i]) < norm(cusps[(i + 1) % 12] - cusps[i])) return i + 1;
  return 1;
}
const ordinal = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

export const SYNASTRY_PRICE = { amount: 1499, currency: "GBP", label: "£14.99" };
