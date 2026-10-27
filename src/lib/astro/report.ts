import "server-only";
/**
 * Builds the written natal report for a calculated chart. Runs on the server
 * so only the paragraphs for this chart are sent to the browser.
 */
import type { AspectFactor, BodyName, ChartResult, Element, Modality, Sign } from "./types";
import type { AspectReading, FactorSection, HouseSection, NatalReport, Reading } from "./report-types";
import { formatDegree } from "./types";
import { pairKey, type Factor, type HouseText, type SignText, type SignTextWithShort } from "./text/types";
import { SUN_IN_SIGN } from "./text/sun";
import { MOON_IN_SIGN } from "./text/moon";
import { MERCURY_IN_SIGN } from "./text/mercury";
import { VENUS_IN_SIGN } from "./text/venus";
import { MARS_IN_SIGN } from "./text/mars";
import { JUPITER_IN_SIGN } from "./text/jupiter";
import { SATURN_IN_SIGN } from "./text/saturn";
import { NEPTUNE_IN_SIGN, PLUTO_IN_SIGN, URANUS_IN_SIGN } from "./text/outer";
import { LILITH_IN_SIGN } from "./text/lilith";
import { FORTUNE_IN_SIGN, NORTH_NODE_IN_SIGN } from "./text/node";
import { MOON_PHASE } from "./text/moon-phase";
import { JUPITER_IN_HOUSE, MARS_IN_HOUSE, MERCURY_IN_HOUSE, MOON_IN_HOUSE, SUN_IN_HOUSE, VENUS_IN_HOUSE } from "./text/houses-personal";
import { FORTUNE_IN_HOUSE, LILITH_IN_HOUSE, NEPTUNE_IN_HOUSE, NORTH_NODE_IN_HOUSE, PLUTO_IN_HOUSE, SATURN_IN_HOUSE, URANUS_IN_HOUSE } from "./text/houses-outer";
import { ASPECTS_1 } from "./text/aspects-1";
import { ASPECTS_2 } from "./text/aspects-2";
import { ASPECTS_3 } from "./text/aspects-3";
import { ELEMENT_BALANCE, MODALITY_BALANCE, POINT_ASPECTS } from "./text/points";
import { ASCENDANT_IN_SIGN, HOUSE_INTRO, MIDHEAVEN_IN_SIGN } from "./text/angles";
import { SIGN_ON_CUSP } from "./text/cusps";

const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
const ordinal = (n: number) => `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

/** What each planet or point represents — the opening line of its section. */
export const FACTOR_INTRO: Record<BodyName, string> = {
  Sun: "The Sun is your core self: your vitality, purpose and the light you are here to grow into. It is the sign most people know as their star sign.",
  Moon: "The Moon is your emotional body: your instincts, moods and needs, what comforts you and how you look after yourself and others.",
  Mercury: "Mercury is your mind and voice: how you think, learn, speak, listen and make sense of the world.",
  Venus: "Venus is love, pleasure and value: how you attract and relate, what you find beautiful, and what you treasure.",
  Mars: "Mars is your drive: desire, courage, anger and the way you go after what you want.",
  Jupiter: "Jupiter is expansion and grace: where you grow, find meaning and faith, and where life tends to open doors.",
  Saturn: "Saturn is structure and time: your lessons, responsibilities and fears, and the mastery you build slowly over a lifetime.",
  Uranus: "Uranus is awakening: freedom, originality and sudden change. Because it stays in a sign for about seven years, its sign is shared by your generation; its house shows where it touches you personally.",
  Neptune: "Neptune is the dream: imagination, compassion, spirituality and the longing for something beyond the everyday. Its sign is generational; its house is personal.",
  Pluto: "Pluto is depth and transformation: power, what must be released, and how you are reborn through change. Its sign is generational; its house is personal.",
  "North Node": "The Moon's Nodes are the axis of your soul's journey. The South Node is the familiar, well-worn path you come in with; the North Node, directly opposite, is the direction of growth that feels new and stretching.",
  Lilith: "Black Moon Lilith (the Moon's mean apogee) is your wild, unapologetic side: what you were told was \"too much\", where you refuse to be tamed, and the power that comes from reclaiming it.",
};

const IN_SIGN: Partial<Record<BodyName, SignTextWithShort | SignText>> = {
  Sun: SUN_IN_SIGN, Moon: MOON_IN_SIGN, Mercury: MERCURY_IN_SIGN, Venus: VENUS_IN_SIGN, Mars: MARS_IN_SIGN,
  Jupiter: JUPITER_IN_SIGN, Saturn: SATURN_IN_SIGN, Uranus: URANUS_IN_SIGN, Neptune: NEPTUNE_IN_SIGN, Pluto: PLUTO_IN_SIGN,
  "North Node": NORTH_NODE_IN_SIGN, Lilith: LILITH_IN_SIGN,
};
const IN_HOUSE: Partial<Record<BodyName, HouseText>> = {
  Sun: SUN_IN_HOUSE, Moon: MOON_IN_HOUSE, Mercury: MERCURY_IN_HOUSE, Venus: VENUS_IN_HOUSE, Mars: MARS_IN_HOUSE, Jupiter: JUPITER_IN_HOUSE,
  Saturn: SATURN_IN_HOUSE, Uranus: URANUS_IN_HOUSE, Neptune: NEPTUNE_IN_HOUSE, Pluto: PLUTO_IN_HOUSE, "North Node": NORTH_NODE_IN_HOUSE, Lilith: LILITH_IN_HOUSE,
};
const ASPECT_TEXT = { ...ASPECTS_1, ...ASPECTS_2, ...ASPECTS_3, ...POINT_ASPECTS };
const ASPECT_WORD = { conjunction: "conjunct", sextile: "sextile", square: "square", trine: "trine", opposition: "opposite" } as const;

function signReading(body: BodyName, sign: Sign, headingName = body): Reading | null {
  const entry = IN_SIGN[body]?.[sign];
  if (!entry) return null;
  const heading = `${headingName} in ${sign}`;
  return typeof entry === "string" ? { heading, paragraphs: paras(entry) } : { heading, paragraphs: paras(entry.text), short: entry.short };
}

function aspectReading(a: AspectFactor, b: AspectFactor, type: keyof typeof ASPECT_WORD, orb: number, strength: number): AspectReading | null {
  const pair = ASPECT_TEXT[pairKey(a as Factor, b as Factor)];
  if (!pair) return null;
  const text = type === "conjunction" ? pair.conjunction : type === "square" ? pair.square : type === "opposition" ? pair.opposition : pair.harmonious;
  const [first, second] = pairKey(a as Factor, b as Factor).split("|");
  return { a, b, type, orb, strength, heading: `${first} ${ASPECT_WORD[type]} ${second}`, paragraphs: paras(text) };
}

export function buildReport(chart: ChartResult): NatalReport {
  const get = (b: BodyName) => chart.placements.find((p) => p.body === b)!;
  const asc = chart.angles.find((a) => a.name === "Ascendant");
  const mc = chart.angles.find((a) => a.name === "Midheaven");

  // Each aspect is read once, under whichever factor comes first (Sun before Moon … planets before points and angles).
  const aspectsFor = (factor: AspectFactor) =>
    chart.aspects
      .filter((x) => pairKey(x.a as Factor, x.b as Factor).split("|")[0] === factor)
      .map((x) => aspectReading(x.a, x.b, x.type, x.orb, x.strength))
      .filter(Boolean) as AspectReading[];

  const section = (body: BodyName, id: string): FactorSection => {
    const p = get(body);
    const signs = p.signUncertain && p.possibleSigns ? p.possibleSigns : [p.sign];
    const sign = signs.map((s) => signReading(body, s)).filter(Boolean) as Reading[];
    const houseText = p.house ? IN_HOUSE[body]?.[p.house - 1] : null;
    return {
      id,
      factor: body,
      intro: FACTOR_INTRO[body],
      sign,
      house: houseText && p.house ? { heading: `${body} in the ${ordinal(p.house)} house`, paragraphs: paras(houseText) } : null,
      aspects: aspectsFor(body),
    };
  };

  const planets = (["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"] as BodyName[]).map((b) => section(b, b.toLowerCase()));
  const node = section("North Node", "nodes");
  node.sign = node.sign.map((r) => ({ ...r, heading: `${r.heading} · South Node in ${chart.points.find((x) => x.name === "South Node")?.sign ?? ""}` }));
  const points = [node, section("Lilith", "lilith")];

  const pof = chart.points.find((x) => x.name === "Part of Fortune");
  const fortune = pof
    ? {
        sign: { heading: `Part of Fortune in ${pof.sign}`, paragraphs: paras(FORTUNE_IN_SIGN[pof.sign]) },
        house: pof.house ? { heading: `Part of Fortune in the ${ordinal(pof.house)} house`, paragraphs: paras(FORTUNE_IN_HOUSE[pof.house - 1]) } : null,
      }
    : null;

  const sun = get("Sun"), moon = get("Moon");
  const bigThree: NatalReport["bigThree"] = [
    { factor: "Sun", sign: sun.sign, short: SUN_IN_SIGN[sun.sign].short },
    { factor: "Moon", sign: moon.signUncertain && moon.possibleSigns ? moon.possibleSigns.join(" or ") : moon.sign, short: moon.signUncertain ? "The Moon changed sign on your birth day, so it depends on your birth time." : MOON_IN_SIGN[moon.sign].short },
  ];
  if (asc) bigThree.push({ factor: "Ascendant", sign: asc.sign, short: ASCENDANT_IN_SIGN[asc.sign].short });

  const houses: HouseSection[] = chart.houseCusps
    ? chart.houseCusps.map((cusp, i) => {
        const n = i + 1;
        const sign = (["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"] as Sign[])[Math.floor(cusp / 30)];
        const key = String(n) as keyof (typeof SIGN_ON_CUSP)["Aries"];
        const text = n === 1 || n === 10 ? null : SIGN_ON_CUSP[sign][key];
        return {
          house: n,
          cuspSign: sign,
          cuspDegree: cusp % 30,
          intro: paras(HOUSE_INTRO[i]).join(" "),
          cusp: text ? { heading: `${sign} on the ${ordinal(n)} house cusp`, paragraphs: paras(text) } : null,
          planets: [...chart.placements.filter((p) => p.house === n).map((p) => p.body as string), ...(pof?.house === n ? ["Part of Fortune"] : [])],
        };
      })
    : [];

  const strongWeak = (count: number, strongAt: number) => (count >= strongAt ? "strong" : count === 0 ? "weak" : null);
  const els = chart.balance.elements, mods = chart.balance.modalities;

  return {
    bigThree,
    planets,
    points,
    fortune,
    moonPhase: chart.moonPhase
      ? { heading: `Born under a ${chart.moonPhase.name}${chart.moonPhase.name.endsWith("Moon") ? "" : " Moon"}`, paragraphs: paras(MOON_PHASE[chart.moonPhase.name]), short: `${Math.round(chart.moonPhase.illumination * 100)}% of the Moon was lit, ${Math.round(chart.moonPhase.elongation)}° ahead of the Sun.` }
      : null,
    ascendant: asc ? { heading: `Ascendant in ${asc.sign} (${formatDegree(asc.degree)})`, paragraphs: paras(ASCENDANT_IN_SIGN[asc.sign].text), short: ASCENDANT_IN_SIGN[asc.sign].short } : null,
    midheaven: mc ? { heading: `Midheaven in ${mc.sign} (${formatDegree(mc.degree)})`, paragraphs: paras(MIDHEAVEN_IN_SIGN[mc.sign]) } : null,
    houses,
    balance: {
      elements: (Object.keys(els) as Element[]).map((name) => {
        const note = strongWeak(els[name], 4);
        return { name, count: els[name], note, text: note ? ELEMENT_BALANCE[name][note] : null };
      }),
      modalities: (Object.keys(mods) as Modality[]).map((name) => {
        const note = strongWeak(mods[name], 5);
        return { name, count: mods[name], note, text: note ? MODALITY_BALANCE[name][note] : null };
      }),
    },
  };
}
