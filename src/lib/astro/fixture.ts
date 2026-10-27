import type { BirthInput, ChartProvider, ChartResult } from "./types";
import { signOf } from "./types";
import { balanceOf, derivePoints, findAspects, moonPhase } from "./derive";

/**
 * DEVELOPMENT FIXTURE — fixed, fake placements used only for building the
 * interface. Enabled with BIRTH_CHART_PROVIDER=fixture. Never shown as real.
 */
export const fixtureProvider: ChartProvider = {
  id: "fixture",
  async calculate(input: BirthInput): Promise<ChartResult> {
    const longs: [ChartResult["placements"][number]["body"], number][] = [
      ["Sun", 15], ["Moon", 128], ["Mercury", 2], ["Venus", 48], ["Mars", 200], ["Jupiter", 270],
      ["Saturn", 330], ["Uranus", 75], ["Neptune", 355], ["Pluto", 300], ["North Node", 180], ["Lilith", 60],
    ];
    const asc = 100;
    const cusps = Array.from({ length: 12 }, (_, i) => (asc + i * 30) % 360);
    const placements: ChartResult["placements"] = longs.map(([body, l]) => ({ body, longitude: l, ...signOf(l), retrograde: false, house: input.time ? Math.floor((((l - asc) % 360) + 360) % 360 / 30) + 1 : null, signUncertain: false }));
    const angles: ChartResult["angles"] = input.time ? [
      { name: "Ascendant", longitude: asc, ...signOf(asc) },
      { name: "Midheaven", longitude: 10, ...signOf(10) },
      { name: "Descendant", longitude: 280, ...signOf(280) },
      { name: "Imum Coeli", longitude: 190, ...signOf(190) },
    ] : [];
    const houseCusps = input.time ? cusps : null;
    return {
      provider: { id: "fixture", name: "Development fixture (NOT real data)", version: "0" },
      isFixture: true,
      input,
      utc: new Date().toISOString(),
      utcOffsetMinutes: null,
      timeKnown: Boolean(input.time),
      notes: ["These placements are SAMPLE DATA for interface development only. They are not calculated from your birth details."],
      zodiac: "tropical",
      houseSystem: input.time ? "whole-sign" : null,
      placements,
      angles,
      houseCusps,
      aspects: findAspects(placements, angles),
      points: derivePoints(placements, angles, houseCusps),
      moonPhase: moonPhase(placements),
      balance: balanceOf(placements),
      technical: { julianDay: 0, localSiderealTime: null, nodeType: "true" },
    };
  },
};
