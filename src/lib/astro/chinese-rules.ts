/** Pure Chinese zodiac rules — safe to use in the browser. */
export const ANIMALS = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"] as const;
export type Animal = (typeof ANIMALS)[number];
export type CElement = "Wood" | "Fire" | "Earth" | "Metal" | "Water";
export type Relation = "same" | "trine" | "secret-friend" | "clash" | "harm" | "neutral";

/** The animal's fixed element in tradition */
export const FIXED_ELEMENT: Record<Animal, CElement> = { Rat: "Water", Ox: "Earth", Tiger: "Wood", Rabbit: "Wood", Dragon: "Earth", Snake: "Fire", Horse: "Fire", Goat: "Earth", Monkey: "Metal", Rooster: "Metal", Dog: "Earth", Pig: "Water" };

const mod = (n: number, m: number) => ((n % m) + m) % m;
/** The animal of a Chinese (lunar) year that starts in Gregorian `year` */
export const animalOfYear = (year: number): Animal => ANIMALS[mod(year - 4, 12)];
/** The year's element, from its heavenly stem: years ending 4–5 Wood, 6–7 Fire, 8–9 Earth, 0–1 Metal, 2–3 Water */
export const elementOfYear = (year: number): CElement => (["Wood", "Fire", "Earth", "Metal", "Water"] as const)[Math.floor(mod(year - 4, 10) / 2)];
export const yinYangOfYear = (year: number) => (mod(year, 2) === 0 ? "Yang" : "Yin");
export const animalSlug = (a: Animal) => a.toLowerCase();
export const animalFromSlug = (s: string) => ANIMALS.find((a) => a.toLowerCase() === s.toLowerCase());

/** The Chinese year a birth date belongs to, given a table of Lunar New Year dates. */
export function chineseYearFor(date: string, lny: Record<number, string>) {
  const y = Number(date.slice(0, 4));
  const start = lny[y];
  if (!start) return null;
  const year = date < start ? y - 1 : y;
  const near = Math.abs(+new Date(`${date}T00:00:00Z`) - +new Date(`${start}T00:00:00Z`)) <= 86400000;
  return { year, animal: animalOfYear(year), element: elementOfYear(year), yinYang: yinYangOfYear(year), newYear: lny[year] ?? null, nearNewYear: near };
}

const SECRET: [Animal, Animal][] = [["Rat", "Ox"], ["Tiger", "Pig"], ["Rabbit", "Dog"], ["Dragon", "Rooster"], ["Snake", "Monkey"], ["Horse", "Goat"]];
const HARM: [Animal, Animal][] = [["Rat", "Goat"], ["Ox", "Horse"], ["Tiger", "Snake"], ["Rabbit", "Dragon"], ["Monkey", "Pig"], ["Rooster", "Dog"]];
const pairIn = (list: [Animal, Animal][], a: Animal, b: Animal) => list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

export function relation(a: Animal, b: Animal): Relation {
  const i = ANIMALS.indexOf(a), j = ANIMALS.indexOf(b);
  if (i === j) return "same";
  if (i % 4 === j % 4) return "trine";
  if (pairIn(SECRET, a, b)) return "secret-friend";
  if (Math.abs(i - j) === 6) return "clash";
  if (pairIn(HARM, a, b)) return "harm";
  return "neutral";
}
export const RELATION_LABEL: Record<Relation, string> = { same: "Same animal", trine: "Trine allies", "secret-friend": "Secret friends", clash: "Clash", harm: "Harm pair", neutral: "Neutral" };
export const RELATION_SCORE: Record<Relation, number> = { "secret-friend": 5, trine: 5, same: 4, neutral: 3, harm: 2, clash: 2 };

/** Recent Gregorian years in which an animal's Chinese year began */
export const yearsOf = (a: Animal, from = 1924, to = 2031) => {
  const out: number[] = [];
  for (let y = from; y <= to; y++) if (animalOfYear(y) === a) out.push(y);
  return out;
};
