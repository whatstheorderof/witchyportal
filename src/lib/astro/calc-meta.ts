import { msg, prose } from "@/i18n/config";

/** The single-purpose sign calculators (shared by pages, API and client). */
export type CalcKind = "rising" | "moon" | "big-three" | "venus" | "mars" | "saturn-return";

export const CALCS: Record<CalcKind, { path: string; title: string; h1: string; blurb: string; time: "required" | "helpful" | "optional"; metaTitle: string; metaDescription: string }> = {
  rising: {
    path: "/rising-sign-calculator", title: msg("Rising sign"), h1: msg("Rising sign calculator"),
    blurb: prose("Your ascendant: first impressions, style and how you meet the world."), time: "required",
    metaTitle: prose("Rising Sign Calculator — Find Your Ascendant Free"),
    metaDescription: prose("Free rising sign calculator: enter your birth date, time and place to find your ascendant, with Yulia Moon's reading of what your rising sign means for you."),
  },
  moon: {
    path: "/moon-sign-calculator", title: msg("Moon sign"), h1: msg("Moon sign calculator"),
    blurb: prose("Your emotional nature: what soothes you and what you need to feel safe."), time: "helpful",
    metaTitle: prose("Moon Sign Calculator — What Is My Moon Sign?"),
    metaDescription: prose("Free moon sign calculator: find your Moon sign from your birth date and place (birth time helps), with a reading of your emotional nature from Yulia Moon."),
  },
  "big-three": {
    path: "/big-three-calculator", title: msg("Big three"), h1: msg("Big three calculator: Sun, Moon and rising"),
    blurb: prose("Your Sun, Moon and rising sign together — the core of your chart."), time: "required",
    metaTitle: prose("Big Three Calculator — Sun, Moon and Rising Sign"),
    metaDescription: prose("Find your big three — Sun, Moon and rising sign — free from your birth date, time and place, with a short reading of each from Yulia Moon."),
  },
  venus: {
    path: "/venus-sign-calculator", title: msg("Venus sign"), h1: msg("Venus sign calculator"),
    blurb: prose("How you love, what you find beautiful and what makes you feel valued."), time: "optional",
    metaTitle: prose("Venus Sign Calculator — Your Love Sign"),
    metaDescription: prose("Free Venus sign calculator: find your Venus sign from your birth date and discover how you love, attract and show affection, in Yulia Moon's words."),
  },
  mars: {
    path: "/mars-sign-calculator", title: msg("Mars sign"), h1: msg("Mars sign calculator"),
    blurb: prose("Your drive and desire: how you act, compete and go after what you want."), time: "optional",
    metaTitle: prose("Mars Sign Calculator — Your Drive and Desire"),
    metaDescription: prose("Free Mars sign calculator: find your Mars sign from your birth date and learn how you take action, handle anger and pursue desire, with Yulia Moon."),
  },
  "saturn-return": {
    path: "/saturn-return-calculator", title: msg("Saturn return"), h1: msg("Saturn return calculator"),
    blurb: prose("When Saturn comes home: the dates of your Saturn returns, and what they ask."), time: "optional",
    metaTitle: prose("Saturn Return Calculator — When Is My Saturn Return?"),
    metaDescription: prose("Free Saturn return calculator: find the exact dates of your first, second and third Saturn return from your birth date, and what each one means."),
  },
};

export const CALC_KINDS = Object.keys(CALCS) as CalcKind[];

export interface CalcCard {
  label: string;
  sign: string | null;
  degree: number | null;
  /** Shown when the sign can't be known, or might be one of two */
  possibleSigns?: string[];
  short: string;
  paragraphs: string[];
  note?: string;
}
export interface SaturnReturn {
  n: number;
  /** UK dates (YYYY-MM-DD) of each exact return */
  hits: string[];
  /** UK dates when Saturn is within 3° of its birth position */
  from: string;
  to: string;
  age: number;
  status: "past" | "now" | "future";
}
export interface CalcResult {
  kind: CalcKind;
  cards: CalcCard[];
  notes: string[];
  returns?: SaturnReturn[];
  returnText?: string[];
}
