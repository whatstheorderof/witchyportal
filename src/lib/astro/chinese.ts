/**
 * Chinese zodiac: animals, elements, Lunar New Year and traditional
 * compatibility. The pure helpers (no Astronomy Engine) are in
 * chinese-rules.ts so the browser can use them.
 */
import * as Astronomy from "astronomy-engine";
export * from "./chinese-rules";

const CHINA_OFFSET = 8 * 3600000;
const chinaDay = (d: Date) => new Date(+d + CHINA_OFFSET).toISOString().slice(0, 10);

/**
 * Lunar New Year for a Gregorian year, as YYYY-MM-DD (China Standard Time):
 * the day of the second New Moon after the December solstice. This rule
 * matches the published dates we test against (tests/chinese.test.ts); the
 * official calendar can very rarely differ when a leap month is involved.
 */
export function lunarNewYear(year: number): string {
  const solstice = Astronomy.Seasons(year - 1).dec_solstice;
  // Day boundaries are in China time. A New Moon on the solstice day itself
  // begins the eleventh month (the one holding the solstice), so start counting
  // from the next day.
  const solDay = chinaDay(solstice.date);
  let t = Astronomy.SearchMoonPhase(0, Astronomy.MakeTime(new Date(+new Date(`${solDay}T00:00:00+08:00`) + 86400000)), 40)!;
  t = Astronomy.SearchMoonPhase(0, t.AddDays(1), 40)!;
  return chinaDay(t.date);
}

const lnyCache = new Map<number, string>();
export function lunarNewYearCached(year: number) {
  let v = lnyCache.get(year);
  if (!v) { v = lunarNewYear(year); lnyCache.set(year, v); }
  return v;
}

/** Lunar New Year dates for a span of years (sent to the browser for the finder). */
export function lunarNewYearTable(from = 1900, to = 2100): Record<number, string> {
  const out: Record<number, string> = {};
  for (let y = from; y <= to; y++) out[y] = lunarNewYearCached(y);
  return out;
}
