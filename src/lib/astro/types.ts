/**
 * Birth chart provider boundary.
 *
 * Calculated data (this file's `ChartResult`) is kept strictly separate from
 * interpretation text (see `interpretations.ts`). A provider only ever returns
 * numbers derived from an ephemeris; it never returns prose.
 */

export const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;
export type Sign = (typeof SIGNS)[number];

export const BODIES = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
  "North Node",
  "Lilith",
] as const;
export type BodyName = (typeof BODIES)[number];

export type HouseSystem = "placidus" | "whole-sign";

export interface BirthInput {
  /** Local calendar date at the birthplace, YYYY-MM-DD */
  date: string;
  /** Local wall-clock time at the birthplace, HH:mm — null when unknown */
  time: string | null;
  latitude: number;
  longitude: number;
  /** IANA time zone, e.g. "Europe/London" */
  timeZone: string;
  placeLabel: string;
}

export interface Placement {
  body: BodyName;
  /** Ecliptic longitude 0–360°, tropical, true ecliptic of date */
  longitude: number;
  sign: Sign;
  /** Degrees within sign, 0–30 */
  degree: number;
  retrograde: boolean;
  /** 1–12, only when birth time is known */
  house: number | null;
  /**
   * When birth time is unknown the Moon (and fast bodies near a sign
   * boundary) may be in one of two signs during the day.
   */
  signUncertain: boolean;
  possibleSigns?: Sign[];
}

export interface Angle {
  name: "Ascendant" | "Midheaven" | "Descendant" | "Imum Coeli";
  longitude: number;
  sign: Sign;
  degree: number;
}

/** Anything that can form an aspect: a body or one of the two main angles. */
export type AspectFactor = BodyName | "Ascendant" | "Midheaven";
export type AspectType = "conjunction" | "sextile" | "square" | "trine" | "opposition";

export interface Aspect {
  a: AspectFactor;
  b: AspectFactor;
  type: AspectType;
  /** Distance from exact, in degrees */
  orb: number;
  /** The widest orb allowed for this pair and aspect */
  maxOrb: number;
  /** 0–100: how close to exact (100 = exact) */
  strength: number;
  /** Whether the faster factor is moving towards exactness */
  applying: boolean | null;
}

export type Element = "Fire" | "Earth" | "Air" | "Water";
export type Modality = "Cardinal" | "Fixed" | "Mutable";

export interface Point {
  name: "Part of Fortune" | "South Node";
  longitude: number;
  sign: Sign;
  degree: number;
  house: number | null;
}

export interface MoonPhaseInfo {
  name: "New Moon" | "Waxing Crescent" | "First Quarter" | "Waxing Gibbous" | "Full Moon" | "Waning Gibbous" | "Last Quarter" | "Balsamic Moon";
  /** Moon's distance ahead of the Sun, 0–360° */
  elongation: number;
  /** Fraction of the Moon lit, 0–1 */
  illumination: number;
}

export interface Balance {
  /** Counts over the ten planets (Sun to Pluto), as in a traditional chart summary */
  elements: Record<Element, number>;
  modalities: Record<Modality, number>;
  polarity: { masculine: number; feminine: number };
}

export interface ChartResult {
  provider: { id: string; name: string; version: string };
  isFixture: boolean;
  input: BirthInput;
  utc: string;
  /** UTC offset applied, in minutes, and the zone abbreviation if known */
  utcOffsetMinutes: number | null;
  timeKnown: boolean;
  /** Warnings about DST gaps/overlaps, polar latitudes etc. */
  notes: string[];
  zodiac: "tropical";
  houseSystem: HouseSystem | null;
  placements: Placement[];
  angles: Angle[];
  /** 12 house cusp longitudes (1..12), only when time is known */
  houseCusps: number[] | null;
  aspects: Aspect[];
  /** Part of Fortune (only with a birth time) and South Node */
  points: Point[];
  moonPhase: MoonPhaseInfo | null;
  balance: Balance;
  technical: {
    /** Julian Day (UT) */
    julianDay: number;
    /** Local apparent sidereal time, hours */
    localSiderealTime: number | null;
    nodeType: "true" | "mean";
  };
}

export interface ChartProvider {
  id: string;
  calculate(input: BirthInput): Promise<ChartResult>;
}

export function signOf(longitude: number): { sign: Sign; degree: number } {
  const l = ((longitude % 360) + 360) % 360;
  const idx = Math.floor(l / 30);
  return { sign: SIGNS[idx], degree: l - idx * 30 };
}

export function formatDegree(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′`;
}
