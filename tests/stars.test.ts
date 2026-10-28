import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { SIGNS } from "../src/lib/astro/types";
import { dailyHoroscope, monthlyHoroscope, weekInAstrology } from "../src/lib/astro/horoscope";
import { sunCompatibility, venusCompatibility, synastry } from "../src/lib/astro/compat";
import { addDays } from "../src/lib/astro/sky";
import { calculateChart } from "../src/lib/astro/engine";

describe("horoscopes always have text", () => {
  it("daily: every sign, every 5th day for a year", { timeout: 120000 }, () => {
    for (let i = 0; i < 365; i += 5) {
      const day = addDays("2026-01-01", i);
      for (const s of SIGNS) {
        const h = dailyHoroscope(s, day);
        expect(h.headline.length).toBeGreaterThan(5);
        expect(h.paragraphs.length).toBeGreaterThanOrEqual(2);
        expect(h.paragraphs.every((p) => p.length > 40)).toBe(true);
        expect(h.ritual.length).toBeGreaterThan(20);
        for (const r of Object.values(h.ratings)) expect(r).toBeGreaterThanOrEqual(1);
      }
    }
  });
  it("monthly: every sign, twelve months", () => {
    for (let m = 1; m <= 12; m++) for (const s of SIGNS) {
      const h = monthlyHoroscope(s, 2027, m);
      expect(h.sections.length).toBeGreaterThanOrEqual(7);
      expect(h.sections.every((x) => x.paragraphs.length > 0)).toBe(true);
    }
  }, 120000);
  it("weekly: every event has a reading (except quarter moons)", { timeout: 120000 }, () => {
    for (let w = 0; w < 52; w += 3) {
      const wk = weekInAstrology(addDays("2026-01-05", w * 7));
      for (const e of wk.events) if (!/Quarter/.test(e.title)) expect(e.paragraphs.length, e.title).toBeGreaterThan(0);
      expect(wk.moonDays.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("compatibility texts are complete", () => {
  it("all 78 Sun-sign and Venus pairings, both orders", () => {
    for (const a of SIGNS) for (const b of SIGNS) {
      const c = sunCompatibility(a, b);
      expect(c.text.love.length, `${a}|${b}`).toBeGreaterThan(0);
      expect(venusCompatibility(a, b).text.length, `Venus ${a}|${b}`).toBeGreaterThan(0);
    }
  });
  it("synastry fills names and finds aspects and overlays", () => {
    const A = calculateChart({ date: "1993-09-25", time: "11:00", latitude: 51.5, longitude: -0.12, timeZone: "Europe/London", placeLabel: "London" });
    const B = calculateChart({ date: "1990-03-02", time: "08:30", latitude: 50.45, longitude: 30.52, timeZone: "Europe/Kyiv", placeLabel: "Kyiv" });
    const r = synastry(A, B, "Ana", "Ben");
    expect(r.aspects.length).toBeGreaterThan(10);
    expect(r.overlays.length).toBe(14);
    const all = [...r.aspects, ...r.overlays].flatMap((x) => x.paragraphs).join(" ");
    expect(all).not.toMatch(/\{A\}|\{B\}/);
    expect(all).toMatch(/Ana/);
    expect(r.scores.every((s) => s.score >= 20 && s.score <= 97)).toBe(true);
  });
});
