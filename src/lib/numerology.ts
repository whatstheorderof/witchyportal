/**
 * Pythagorean numerology. Pure functions, run in the visitor's browser —
 * names and birth dates are never sent to the server or stored.
 */

export type NumKey = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "11" | "22" | "33";
export const NUM_KEYS: NumKey[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "22", "33"];
const MASTER = new Set([11, 22, 33]);

const digitSum = (n: number) => String(n).split("").reduce((a, d) => a + Number(d), 0);

/** Reduce to a single digit, stopping at 11, 22 or 33 when `keepMaster`. */
export function reduce(n: number, keepMaster = true): number {
  while (n > 9 && !(keepMaster && MASTER.has(n))) n = digitSum(n);
  return n;
}

function parts(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return { y, mo, d };
}

/** Life path: month, day and year are reduced separately, then added and reduced (master numbers kept). */
export function lifePath(date: string): NumKey | null {
  const p = parts(date);
  if (!p) return null;
  return String(reduce(reduce(p.mo) + reduce(p.d) + reduce(p.y))) as NumKey;
}

export function birthdayNumber(date: string): NumKey | null {
  const p = parts(date);
  return p ? (String(reduce(p.d)) as NumKey) : null;
}

/** Personal year (1–9) for a calendar year: birth month + birth day + that year. */
export function personalYear(date: string, year: number): number | null {
  const p = parts(date);
  return p ? reduce(reduce(p.mo) + reduce(p.d) + reduce(year), false) : null;
}

const VOWELS = new Set(["A", "E", "I", "O", "U"]);
const letterValue = (c: string) => ((c.charCodeAt(0) - 65) % 9) + 1;

/** Latin letters of a name, accents removed (é → E, ß → SS). Empty when the name uses another script. */
export function latinLetters(name: string): string[] {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[æÆ]/g, "ae")
    .replace(/[øØ]/g, "o")
    .toUpperCase()
    .split("")
    .filter((c) => c >= "A" && c <= "Z");
}

/** Expression (all letters), soul urge (vowels) and personality (consonants). Y counts as a consonant. */
export function nameNumbers(name: string): { expression: NumKey; soul: NumKey | null; personality: NumKey | null } | null {
  const letters = latinLetters(name);
  if (letters.length < 2) return null;
  const sum = (ls: string[]) => ls.reduce((a, c) => a + letterValue(c), 0);
  const v = letters.filter((c) => VOWELS.has(c));
  const c = letters.filter((x) => !VOWELS.has(x));
  return {
    expression: String(reduce(sum(letters))) as NumKey,
    soul: v.length ? (String(reduce(sum(v))) as NumKey) : null,
    personality: c.length ? (String(reduce(sum(c))) as NumKey) : null,
  };
}

export const numSlug = (n: NumKey) => `life-path-${n}`;
export const slugNum = (slug: string): NumKey | null => {
  const n = slug.replace(/^life-path-/, "");
  return (NUM_KEYS as string[]).includes(n) && slug.startsWith("life-path-") ? (n as NumKey) : null;
};
