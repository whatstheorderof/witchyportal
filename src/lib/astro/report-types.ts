/** The written natal report returned with a chart (built on the server by report.ts). */
import type { AspectFactor, AspectType, BodyName, Element, Modality, Sign } from "./types";

export interface Reading {
  heading: string;
  paragraphs: string[];
  /** One-sentence summary, when available */
  short?: string;
}

export interface AspectReading {
  a: AspectFactor;
  b: AspectFactor;
  type: AspectType;
  orb: number;
  strength: number;
  heading: string;
  paragraphs: string[];
}

export interface FactorSection {
  id: string;
  factor: BodyName;
  /** What this planet or point represents */
  intro: string;
  sign: Reading[];
  house: Reading | null;
  aspects: AspectReading[];
}

export interface HouseSection {
  house: number;
  cuspSign: Sign;
  cuspDegree: number;
  /** What the house governs */
  intro: string;
  /** How the sign on the cusp colours it (houses 2–9, 11, 12; the 1st and 10th use the Ascendant and Midheaven readings) */
  cusp: Reading | null;
  planets: string[];
}

export interface NatalReport {
  bigThree: { factor: "Sun" | "Moon" | "Ascendant"; sign: string; short: string }[];
  planets: FactorSection[];
  /** North Node (with the South Node), Lilith and the Part of Fortune */
  points: FactorSection[];
  fortune: { sign: Reading; house: Reading | null } | null;
  moonPhase: Reading | null;
  ascendant: Reading | null;
  midheaven: Reading | null;
  houses: HouseSection[];
  balance: {
    elements: { name: Element; count: number; note: "strong" | "weak" | null; text: string | null }[];
    modalities: { name: Modality; count: number; note: "strong" | "weak" | null; text: string | null }[];
  };
}
