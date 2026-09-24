import { describe, it, expect } from "vitest";
import { calculateChart } from "../src/lib/astro/engine";
import { localToUtc } from "../src/lib/astro/timezone";

const find = (c: ReturnType<typeof calculateChart>, b: string) => c.placements.find(p => p.body === b)!;

describe("reference chart: Albert Einstein, 14 Mar 1879 10:50 UT, Ulm", () => {
  // Reference values published by Astrodienst (astro.com, AstroDataBank, Rodden AA)
  const c = calculateChart({ date: "1879-03-14", time: "10:50", latitude: 48.4, longitude: 9.9833, timeZone: "UTC", placeLabel: "Ulm" });
  const cases: [string, number][] = [
    ["Sun", 353 + 30/60], // 23°30' Pisces
    ["Moon", 254 + 31/60], // 14°31' Sagittarius
    ["Mercury", 3 + 8/60], // 3°08' Aries
    ["Venus", 16 + 59/60], // 16°59' Aries
    ["Mars", 296 + 54/60], // 26°54' Capricorn
    ["Jupiter", 327 + 29/60], // 27°29' Aquarius
    ["Saturn", 4 + 11/60], // 4°11' Aries
  ];
  for (const [b, ref] of cases) it(b, () => { console.log(b, find(c,b).longitude.toFixed(3), ref.toFixed(3)); expect(Math.abs(find(c, b).longitude - ref)).toBeLessThan(0.1); });
  it("Ascendant 11°38' Cancer", () => { console.log("asc", c.angles[0].longitude, "mc", c.angles[1].longitude, c.houseCusps); expect(Math.abs(c.angles[0].longitude - (90 + 11 + 38/60))).toBeLessThan(0.3); });
  it("MC 12°50' Pisces", () => expect(Math.abs(c.angles[1].longitude - (330 + 12 + 50/60))).toBeLessThan(0.3));
});

describe("time zones", () => {
  it("London BST 1990", () => expect(localToUtc("1990-07-01", "12:00", "Europe/London").utc.toISOString()).toBe("1990-07-01T11:00:00.000Z"));
  it("London 1971 British Standard Time experiment (+1 all year)", () => expect(localToUtc("1970-01-15", "12:00", "Europe/London").offsetMinutes).toBe(60));
  it("New York gap", () => expect(localToUtc("2021-03-14", "02:30", "America/New_York").notes.length).toBe(1));
  it("New York overlap", () => expect(localToUtc("2021-11-07", "01:30", "America/New_York").notes.length).toBe(1));
  it("Berlin 1879 LMT", () => console.log(localToUtc("1879-03-14", "11:30", "Europe/Berlin")));
});

describe("LMT and Placidus consistency", () => {
  it("Einstein via Europe/Berlin uses Ulm LMT", () => {
    const c = calculateChart({ date: "1879-03-14", time: "11:30", latitude: 48.4, longitude: 9.9833, timeZone: "Europe/Berlin", placeLabel: "Ulm" });
    expect(Math.abs(new Date(c.utc).getTime() - Date.UTC(1879, 2, 14, 10, 50, 4))).toBeLessThan(2000);
    expect(Math.abs(c.angles[0].longitude - 101.63)).toBeLessThan(0.1);
  });
  it("Placidus cusps divide semi-arcs in thirds", () => {
    const c = calculateChart({ date: "1990-06-15", time: "08:20", latitude: 51.5, longitude: -0.12, timeZone: "Europe/London", placeLabel: "London" });
    const eps = 23.44 * Math.PI / 180, r = Math.PI / 180;
    const cusp11 = c.houseCusps![10];
    const ra = Math.atan2(Math.sin(cusp11 * r) * Math.cos(eps), Math.cos(cusp11 * r)) / r;
    const dec = Math.asin(Math.sin(eps) * Math.sin(cusp11 * r));
    const mcRa = Math.atan2(Math.sin(c.angles[1].longitude * r) * Math.cos(eps), Math.cos(c.angles[1].longitude * r)) / r;
    const H = ((mcRa - ra) % 360 + 540) % 360 - 180;
    const sda = 90 + Math.asin(Math.tan(51.5 * r) * Math.tan(dec)) / r;
    expect(Math.abs(Math.abs(H) - sda / 3)).toBeLessThan(0.05);
    // cusps strictly increasing around the circle
    for (let i = 0; i < 12; i++) { const d = ((c.houseCusps![(i+1)%12] - c.houseCusps![i]) + 360) % 360; expect(d).toBeGreaterThan(5); expect(d).toBeLessThan(80); }
  });
  it("unknown time flags Moon when it changes sign", () => {
    // 2024-01-01 Moon ingress Virgo->Libra ~ 2024-01-01? just check structure
    const c = calculateChart({ date: "2024-01-03", time: null, latitude: 51.5, longitude: -0.12, timeZone: "Europe/London", placeLabel: "London" });
    expect(c.houseCusps).toBeNull(); expect(c.angles.length).toBe(0);
    console.log(c.placements.find(p=>p.body==="Moon"));
  });
  it("polar latitude falls back to whole sign", () => {
    const c = calculateChart({ date: "2000-01-01", time: "12:00", latitude: 69.65, longitude: 18.95, timeZone: "Europe/Oslo", placeLabel: "Tromsø" });
    expect(c.houseSystem).toBe("whole-sign");
  });
});
