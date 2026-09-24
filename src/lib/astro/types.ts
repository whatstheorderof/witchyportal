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

export interface Aspect {
  a: BodyName;
  b: BodyName;
  type: "conjunction" | "sextile" | "square" | "trine" | "opposition";
  orb: number;
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
