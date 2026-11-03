/** The single-purpose sign calculators (shared by pages, API and client). */
export type CalcKind = "rising" | "moon" | "big-three" | "venus" | "mars" | "saturn-return";

export const CALCS: Record<CalcKind, { path: string; title: string; h1: string; blurb: string; time: "required" | "helpful" | "optional"; metaTitle: string; metaDescription: string }> = {
  rising: {
    path: "/rising-sign-calculator", title: "Rising sign", h1: "Rising sign calculator",
    blurb: "Your ascendant: first impressions, style and how you meet the world.", time: "required",
    metaTitle: "Rising Sign Calculator — Find Your Ascendant Free",
    metaDescription: "Free rising sign calculator: enter your birth date, time and place to find your ascendant, with Yulia Moon's reading of what your rising sign means for you.",
  },
  moon: {
    path: "/moon-sign-calculator", title: "Moon sign", h1: "Moon sign calculator",
    blurb: "Your emotional nature: what soothes you and what you need to feel safe.", time: "helpful",
    metaTitle: "Moon Sign Calculator — What Is My Moon Sign?",
    metaDescription: "Free moon sign calculator: find your Moon sign from your birth date and place (birth time helps), with a reading of your emotional nature from Yulia Moon.",
  },
  "big-three": {
    path: "/big-three-calculator", title: "Big three", h1: "Big three calculator: Sun, Moon and rising",
    blurb: "Your Sun, Moon and rising sign together — the core of your chart.", time: "required",
    metaTitle: "Big Three Calculator — Sun, Moon and Rising Sign",
    metaDescription: "Find your big three — Sun, Moon and rising sign — free from your birth date, time and place, with a short reading of each from Yulia Moon.",
  },
  venus: {
    path: "/venus-sign-calculator", title: "Venus sign", h1: "Venus sign calculator",
    blurb: "How you love, what you find beautiful and what makes you feel valued.", time: "optional",
    metaTitle: "Venus Sign Calculator — Your Love Sign",
    metaDescription: "Free Venus sign calculator: find your Venus sign from your birth date and discover how you love, attract and show affection, in Yulia Moon's words.",
  },
  mars: {
    path: "/mars-sign-calculator", title: "Mars sign", h1: "Mars sign calculator",
    blurb: "Your drive and desire: how you act, compete and go after what you want.", time: "optional",
    metaTitle: "Mars Sign Calculator — Your Drive and Desire",
    metaDescription: "Free Mars sign calculator: find your Mars sign from your birth date and learn how you take action, handle anger and pursue desire, with Yulia Moon.",
  },
  "saturn-return": {
    path: "/saturn-return-calculator", title: "Saturn return", h1: "Saturn return calculator",
    blurb: "When Saturn comes home: the dates of your Saturn returns, and what they ask.", time: "optional",
    metaTitle: "Saturn Return Calculator — When Is My Saturn Return?",
    metaDescription: "Free Saturn return calculator: find the exact dates of your first, second and third Saturn return from your birth date, and what each one means.",
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
