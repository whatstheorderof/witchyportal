/**
 * Interpretation text — kept separate from calculated data.
 * [Placeholder copy written as a neutral starting point; Yulia may rewrite
 * these in her own voice. Moving them into the CMS is a possible next step.]
 */
import type { BodyName, Sign } from "./types";

export const SIGN_INFO: Record<Sign, { glyph: string; element: "Fire" | "Earth" | "Air" | "Water"; modality: "Cardinal" | "Fixed" | "Mutable"; keywords: string }> = {
  Aries: { glyph: "♈︎", element: "Fire", modality: "Cardinal", keywords: "courage, beginnings, directness" },
  Taurus: { glyph: "♉︎", element: "Earth", modality: "Fixed", keywords: "steadiness, pleasure, the senses" },
  Gemini: { glyph: "♊︎", element: "Air", modality: "Mutable", keywords: "curiosity, conversation, lightness" },
  Cancer: { glyph: "♋︎", element: "Water", modality: "Cardinal", keywords: "nurture, memory, belonging" },
  Leo: { glyph: "♌︎", element: "Fire", modality: "Fixed", keywords: "warmth, creativity, being seen" },
  Virgo: { glyph: "♍︎", element: "Earth", modality: "Mutable", keywords: "care, craft, discernment" },
  Libra: { glyph: "♎︎", element: "Air", modality: "Cardinal", keywords: "harmony, beauty, partnership" },
  Scorpio: { glyph: "♏︎", element: "Water", modality: "Fixed", keywords: "depth, intensity, transformation" },
  Sagittarius: { glyph: "♐︎", element: "Fire", modality: "Mutable", keywords: "adventure, meaning, freedom" },
  Capricorn: { glyph: "♑︎", element: "Earth", modality: "Cardinal", keywords: "ambition, structure, patience" },
  Aquarius: { glyph: "♒︎", element: "Air", modality: "Fixed", keywords: "originality, community, vision" },
  Pisces: { glyph: "♓︎", element: "Water", modality: "Mutable", keywords: "imagination, empathy, the dreamlike" },
};

export const BODY_INFO: Record<BodyName, { glyph: string; meaning: string }> = {
  Sun: { glyph: "☉︎", meaning: "your core self and vitality" },
  Moon: { glyph: "☽︎", meaning: "your emotions, needs and inner world" },
  Mercury: { glyph: "☿︎", meaning: "how you think and communicate" },
  Venus: { glyph: "♀︎", meaning: "love, beauty and what you value" },
  Mars: { glyph: "♂︎", meaning: "drive, desire and how you act" },
  Jupiter: { glyph: "♃︎", meaning: "growth, luck and faith" },
  Saturn: { glyph: "♄︎", meaning: "discipline, limits and lessons" },
  Uranus: { glyph: "♅︎", meaning: "change, rebellion and awakening" },
  Neptune: { glyph: "♆︎", meaning: "dreams, intuition and the mystical" },
  Pluto: { glyph: "♇︎", meaning: "power, depth and rebirth" },
  "North Node": { glyph: "☊︎", meaning: "the direction of growth" },
};

export const HOUSE_MEANING = [
  "self, body and first impressions",
  "resources, money and self-worth",
  "communication, siblings and the local world",
  "home, family and roots",
  "creativity, pleasure and romance",
  "work, health and daily rituals",
  "partnership and close relationships",
  "intimacy, shared resources and transformation",
  "travel, study and philosophy",
  "vocation, reputation and public life",
  "friendship, community and hopes",
  "rest, solitude and the unseen",
];

export const BIG_THREE = {
  Sun: "Your Sun sign describes your core identity — the energy you're here to grow into.",
  Moon: "Your Moon sign speaks to your emotional nature and what helps you feel safe.",
  Ascendant: "Your Ascendant (rising sign) is the lens you meet the world through and how others first experience you.",
};

export const ASPECT_INFO = {
  conjunction: { symbol: "☌︎", label: "conjunct", note: "energies blend" },
  sextile: { symbol: "⚹︎", label: "sextile", note: "easy opportunity" },
  square: { symbol: "□", label: "square", note: "creative tension" },
  trine: { symbol: "△", label: "trine", note: "natural flow" },
  opposition: { symbol: "☍︎", label: "opposite", note: "balance between two poles" },
};
