import * as Astronomy from "astronomy-engine";
import { signOf, type Sign } from "./types";

export interface MoonNow {
  phaseName: string;
  phaseKey: "new" | "waxing-crescent" | "first-quarter" | "waxing-gibbous" | "full" | "waning-gibbous" | "last-quarter" | "waning-crescent";
  illumination: number; // 0..1
  angle: number; // 0..360, 0 = new, 180 = full
  sign: Sign;
  waxing: boolean;
}

export interface MoonEvent {
  kind: "new" | "full";
  date: Date;
  sign: Sign;
}

const NAMES: [number, MoonNow["phaseKey"], string][] = [
  [11.25, "new", "New Moon"],
  [78.75, "waxing-crescent", "Waxing Crescent"],
  [101.25, "first-quarter", "First Quarter"],
  [168.75, "waxing-gibbous", "Waxing Gibbous"],
  [191.25, "full", "Full Moon"],
  [258.75, "waning-gibbous", "Waning Gibbous"],
  [281.25, "last-quarter", "Last Quarter"],
  [348.75, "waning-crescent", "Waning Crescent"],
  [360, "new", "New Moon"],
];

export function moonNow(at = new Date()): MoonNow {
  const t = Astronomy.MakeTime(at);
  const angle = Astronomy.MoonPhase(t);
  const [, phaseKey, phaseName] = NAMES.find(([max]) => angle < max)!;
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, t);
  return {
    phaseName,
    phaseKey,
    illumination: illum.phase_fraction,
    angle,
    sign: signOf(Astronomy.EclipticGeoMoon(t).lon).sign,
    waxing: angle < 180,
  };
}

export function upcomingMoons(count = 12, from = new Date()): MoonEvent[] {
  const out: MoonEvent[] = [];
  let q = Astronomy.SearchMoonQuarter(Astronomy.MakeTime(from));
  while (out.length < count) {
    if (q.quarter === 0 || q.quarter === 2) {
      out.push({ kind: q.quarter === 0 ? "new" : "full", date: q.time.date, sign: signOf(Astronomy.EclipticGeoMoon(q.time).lon).sign });
    }
    q = Astronomy.NextMoonQuarter(q);
  }
  return out;
}

/** Traditional names for the full moon by month (Northern Hemisphere folk names). */
export const FULL_MOON_NAMES: Record<number, string> = {
  0: "Wolf Moon", 1: "Snow Moon", 2: "Worm Moon", 3: "Pink Moon", 4: "Flower Moon", 5: "Strawberry Moon",
  6: "Buck Moon", 7: "Sturgeon Moon", 8: "Harvest Moon", 9: "Hunter's Moon", 10: "Beaver Moon", 11: "Cold Moon",
};

export const PHASE_GUIDANCE: Record<MoonNow["phaseKey"], { theme: string; ritual: string }> = {
  "new": { theme: "Beginnings and intentions", ritual: "Write your intentions for the month in the present tense and light a candle for them." },
  "waxing-crescent": { theme: "Taking the first steps", ritual: "Choose one intention and take a small, real action towards it today." },
  "first-quarter": { theme: "Courage and commitment", ritual: "Notice what's in your way. Write it down, then write one way around it." },
  "waxing-gibbous": { theme: "Refining and trusting", ritual: "Tweak your plans, tidy your space and trust the timing." },
  "full": { theme: "Release and gratitude", ritual: "Give thanks for what has grown, release what no longer serves you, and make moon water." },
  "waning-gibbous": { theme: "Sharing and receiving", ritual: "Share what you've learned with someone you love, and rest more than usual." },
  "last-quarter": { theme: "Letting go", ritual: "Declutter one drawer, one habit or one worry. Make room." },
  "waning-crescent": { theme: "Rest and reflection", ritual: "Slow down, journal and sleep early. The new cycle is almost here." },
};
