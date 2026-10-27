import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { calculateChart } from "../src/lib/astro/engine";
import { buildReport } from "../src/lib/astro/report";

const london = { latitude: 51.5085, longitude: -0.12574, timeZone: "Europe/London", placeLabel: "London" };

describe("matches a published Cafe Astrology natal report (25 Sep 1993, 11:00, London)", () => {
  const c = calculateChart({ date: "1993-09-25", time: "11:00", ...london });
  const lon = (b: string) => c.placements.find((p) => p.body === b)!.longitude;
  // Cafe Astrology values (Swiss Ephemeris), to the arcminute
  const ref: [string, number][] = [
    ["Sun", 182 + 21 / 60], ["Moon", 302 + 56 / 60], ["Mercury", 202], ["Venus", 154 + 40 / 60], ["Mars", 208 + 53 / 60],
    ["Jupiter", 200 + 6 / 60], ["Saturn", 324 + 30 / 60], ["Uranus", 288 + 13 / 60], ["Neptune", 288 + 23 / 60], ["Pluto", 233 + 32 / 60],
    ["Lilith", 8 + 20 / 60],
  ];
  for (const [b, v] of ref) it(`${b} within 3′`, () => expect(Math.abs(lon(b) - v)).toBeLessThan(0.05));
  it("Part of Fortune 15°31′ Pisces", () => expect(Math.abs(c.points.find((p) => p.name === "Part of Fortune")!.longitude - (345 + 31 / 60))).toBeLessThan(0.1));
  it("element and modality counts", () => {
    expect(c.balance.elements).toEqual({ Fire: 0, Earth: 3, Air: 6, Water: 1 });
    expect(c.balance.modalities).toEqual({ Cardinal: 6, Fixed: 3, Mutable: 1 });
  });
  it("finds the same aspects", () => {
    const got = new Set(c.aspects.map((a) => `${a.a}|${a.type}|${a.b}`));
    const expected = [
      "Sun|trine|Moon", "Sun|opposition|Lilith", "Moon|square|Mars", "Moon|sextile|North Node", "Mercury|conjunction|Mars",
      "Mercury|conjunction|Jupiter", "Mercury|trine|Saturn", "Mercury|square|Uranus", "Mercury|square|Neptune", "Venus|square|North Node",
      "Venus|conjunction|Midheaven", "Mars|conjunction|Jupiter", "Mars|trine|Saturn", "Mars|sextile|Midheaven", "Jupiter|trine|Saturn",
      "Jupiter|square|Uranus", "Jupiter|square|Neptune", "Saturn|square|Pluto", "Saturn|opposition|Midheaven", "Uranus|conjunction|Neptune",
      "Uranus|sextile|Ascendant", "Neptune|sextile|Ascendant", "Pluto|conjunction|Ascendant",
    ];
    for (const e of expected) expect(got.has(e), e).toBe(true);
    expect(c.aspects.length).toBe(expected.length);
  });
});

describe("the written report is complete for any chart", () => {
  it("every placement, house and aspect has text (200 random charts)", () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 200; i++) {
      const y = 1930 + Math.floor(rnd() * 90), m = 1 + Math.floor(rnd() * 12), d = 1 + Math.floor(rnd() * 28);
      const timeKnown = rnd() > 0.15;
      const time = timeKnown ? `${String(Math.floor(rnd() * 24)).padStart(2, "0")}:${String(Math.floor(rnd() * 60)).padStart(2, "0")}` : null;
      const lat = -60 + rnd() * 120;
      const c = calculateChart({ date: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, time, latitude: lat, longitude: -180 + rnd() * 360, timeZone: "UTC", placeLabel: "Test" });
      const r = buildReport(c);
      for (const s of [...r.planets, ...r.points]) {
        expect(s.sign.length).toBeGreaterThan(0);
        expect(s.sign.every((x) => x.paragraphs.length > 0)).toBe(true);
        if (timeKnown) expect(s.house?.paragraphs.length).toBeGreaterThan(0);
      }
      const read = [...r.planets, ...r.points].reduce((n, s) => n + s.aspects.length, 0);
      expect(read, "every aspect has a reading").toBe(c.aspects.length);
      if (timeKnown) {
        expect(r.ascendant && r.midheaven && r.fortune && r.moonPhase).toBeTruthy();
        expect(r.houses.filter((h) => h.cusp).length).toBe(10);
      }
    }
  });
});
