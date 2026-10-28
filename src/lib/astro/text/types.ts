/**
 * Shapes for the birth-chart interpretation text in this folder.
 *
 * Text is original Witchy Portal copy. Paragraphs are separated by a blank
 * line ("\n\n"). Write in the second person ("you"), British English.
 */
import type { Sign } from "../types";

/** One text per zodiac sign. */
export type SignText = Record<Sign, string>;

/** A full reading plus a one-sentence summary ("In short: …"). */
export type SignTextWithShort = Record<Sign, { text: string; short: string }>;

/** Twelve texts, index 0 = 1st house … index 11 = 12th house. */
export type HouseText = readonly [string, string, string, string, string, string, string, string, string, string, string, string];

/** Interpretations of one pair of chart factors. */
export interface PairText {
  /** Conjunction (0°) */
  conjunction: string;
  /** Trine (120°) or sextile (60°) — flowing, supportive */
  harmonious: string;
  /** Square (90°) — friction that pushes you to act */
  square: string;
  /** Opposition (180°) — a see-saw between two needs, often met through other people */
  opposition: string;
}

/**
 * Chart factors used in aspect keys, in canonical order. An aspect key is
 * "A|B" with A earlier in this list than B, e.g. "Sun|Moon", "Venus|Ascendant".
 */
export const FACTOR_ORDER = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
  "North Node", "Lilith", "Ascendant", "Midheaven",
] as const;
export type Factor = (typeof FACTOR_ORDER)[number];

export type AspectTexts = Partial<Record<string, PairText>>;

export function pairKey(a: Factor, b: Factor) {
  return FACTOR_ORDER.indexOf(a) < FACTOR_ORDER.indexOf(b) ? `${a}|${b}` : `${b}|${a}`;
}

/** Houses 2–9, 11 and 12 (the 1st and 10th cusps are the Ascendant and Midheaven). */
export type CuspHouse = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "11" | "12";
export type CuspText = Record<Sign, Record<CuspHouse, string>>;

export type MoonPhaseName = "New Moon" | "Waxing Crescent" | "First Quarter" | "Waxing Gibbous" | "Full Moon" | "Waning Gibbous" | "Last Quarter" | "Balsamic Moon";

/** Reference entry for the zodiac sign pages (/zodiac/aries …). */
export interface ZodiacEntry {
  /** e.g. "The Ram" */
  symbol: string;
  /** Usual Sun-sign dates, e.g. "21 March – 19 April" */
  dates: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  /** Modern and traditional ruler, e.g. "Mars" or "Pluto (traditionally Mars)" */
  ruler: string;
  polarity: "Yang (masculine, outward)" | "Yin (feminine, receptive)";
  /** Six single words or short phrases */
  keywords: string[];
  /** 250–320 words */
  overview: string;
  /** 90–130 words */
  strengths: string;
  /** 90–130 words */
  challenges: string;
  /** 120–160 words */
  love: string;
  /** 100–140 words */
  work: string;
  /** 70–100 words — gentle self-care and rituals that suit the sign (no health claims) */
  selfCare: string;
  /** 80–110 words — how the sign tends to get on with the other elements/signs */
  compatibility: string;
}

/* ---------------- Horoscopes, moon guide & compatibility ---------------- */

/** "1" … "12": houses counted from the reader's Sun sign (solar houses). */
export type SolarHouse = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";

/** Several interchangeable versions of a text, so daily horoscopes don't repeat. */
export type Variants = string[];

/** Pairs of the ten planets (Sun … Pluto), canonical order, e.g. "Venus|Mars". */
export interface SkyPairText {
  conjunction: string;
  harmonious: string;
  square: string;
  opposition: string;
}

/** Sun-sign compatibility, key "Aries|Taurus" in zodiac order (same-sign pairs e.g. "Leo|Leo"). */
export interface SignCompat {
  /** 1–10 */
  overall: number;
  love: number;
  friendship: number;
  communication: number;
  /** A short evocative title, 3–7 words */
  headline: string;
  /** The reading */
  text: string;
}

export interface PhaseGuide {
  /** What this phase is and what it means (120–160 words) */
  meaning: string;
  /** The energy of these days and how to work with it (60–90 words) */
  energy: string;
  /** Moon magic: rituals and spellwork suited to the phase (90–120 words) */
  magic: string;
  /** What to avoid or go gently with (40–60 words) */
  avoid: string;
  /** One journal prompt, a single question */
  prompt: string;
}
