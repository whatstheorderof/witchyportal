/**
 * Chinese New Year pages: one entry per year that has its text written.
 * To add a year: write `text/stars/chinese-YYYY.ts` (same shape), add it here,
 * and add `src/app/(site)/chinese-zodiac/YYYY/page.tsx` (two lines, copy 2028).
 * tests/new-tools.test.ts fails from September if next year is missing.
 */
import { CHINESE_YEAR_2027 } from "./text/stars/chinese-year";
import { CHINESE_YEAR_2028 } from "./text/stars/chinese-2028";
import type { Animal, CElement } from "./chinese-rules";

export interface ChineseYearInfo { year: number; animal: Animal; element: CElement; hanzi: string; pinyin: string; text: { intro: string; animals: Record<Animal, string> } }

export const CHINESE_YEARS: Record<number, ChineseYearInfo> = {
  2027: { year: 2027, animal: "Goat", element: "Fire", hanzi: "丁未", pinyin: "Dīng Wèi", text: CHINESE_YEAR_2027 },
  2028: { year: 2028, animal: "Monkey", element: "Earth", hanzi: "戊申", pinyin: "Wù Shēn", text: CHINESE_YEAR_2028 },
};

/** The year to feature: the latest written year that has started or starts within the next ~5 months. */
export function featuredChineseYear(now = new Date()): ChineseYearInfo {
  const years = Object.keys(CHINESE_YEARS).map(Number).sort();
  const y = now.getUTCFullYear(), m = now.getUTCMonth();
  const want = m >= 8 ? y + 1 : y; // from September, look ahead to next Lunar New Year
  return CHINESE_YEARS[want] ?? CHINESE_YEARS[years.filter((x) => x <= want).at(-1) ?? years[0]];
}
