import { describe, it, expect, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { SIGNS } from "../src/lib/astro/types";
import { calculateChart } from "../src/lib/astro/engine";
import { calculate, saturnReturns } from "../src/lib/astro/calc";
import { CALC_KINDS } from "../src/lib/astro/calc-meta";
import { retrogradePeriods, eclipsesIn, retroStatus } from "../src/lib/astro/retro";
import { yearlyHoroscope } from "../src/lib/astro/yearly";
import { personalDay } from "../src/lib/astro/personal";
import { ANIMALS, chineseYearFor, elementOfYear, lunarNewYear, lunarNewYearTable, relation, animalOfYear } from "../src/lib/astro/chinese";
import { CHINESE_ANIMALS } from "../src/lib/astro/text/stars/chinese-animals";
import { CHINESE_YEAR_2027 } from "../src/lib/astro/text/stars/chinese-year";
import { addDays } from "../src/lib/astro/sky";

const london = { latitude: 51.5074, longitude: -0.1278, timeZone: "Europe/London", placeLabel: "London" };
const ukDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(d);

describe("calculators", () => {
  const c = calculateChart({ date: "1990-06-15", time: "08:20", ...london });
  it("every calculator returns text", () => {
    for (const k of CALC_KINDS) {
      const r = calculate(k, c);
      expect(r.cards.length).toBeGreaterThan(0);
      for (const card of r.cards) { expect(card.sign).toBeTruthy(); expect(card.short.length).toBeGreaterThan(40); }
    }
  });
  it("big three without a birth time explains the missing rising sign", () => {
    const r = calculate("big-three", calculateChart({ date: "1990-06-15", time: null, ...london }));
    expect(r.cards[2].sign).toBeNull();
    expect(r.cards[2].note).toMatch(/birth time/);
  });
  it("Saturn return dates (Saturn in Capricorn, 1990)", () => {
    const sat = c.placements.find((p) => p.body === "Saturn")!;
    const r = saturnReturns(sat.longitude, new Date(c.utc), new Date("2026-01-01"));
    expect(r[0].age).toBeGreaterThanOrEqual(27);
    expect(r[0].age).toBeLessThanOrEqual(30);
    expect(r[0].hits[0].startsWith("2020")).toBe(true);
    expect(r[0].status).toBe("past");
    expect(r[1].age).toBeGreaterThanOrEqual(56);
  });
});

describe("retrogrades and eclipses", () => {
  it("Mercury retrograde 2026 matches published dates", () => {
    const p = retrogradePeriods("Mercury", new Date("2026-01-01"), new Date("2027-01-01"));
    expect(p.map((x) => ukDay(x.stationRetrograde))).toEqual(["2026-02-26", "2026-06-29", "2026-10-24"]);
    expect(p.map((x) => ukDay(x.stationDirect))).toEqual(["2026-03-20", "2026-07-23", "2026-11-13"]);
    expect(p.map((x) => x.sign)).toEqual(["Pisces", "Cancer", "Scorpio"]);
    for (const x of p) { expect(+x.preShadow).toBeLessThan(+x.stationRetrograde); expect(+x.postShadow).toBeGreaterThan(+x.stationDirect); }
  });
  it("Mars retrograde 2027 and status", () => {
    const m = retrogradePeriods("Mars", new Date("2027-01-01"), new Date("2028-01-01"));
    expect(m.length).toBe(1);
    expect(ukDay(m[0].stationRetrograde)).toBe("2027-01-10");
    expect(retroStatus("Mercury", new Date("2026-11-01T12:00:00Z")).state).toBe("retrograde");
    expect(retroStatus("Mercury", new Date("2026-11-20T12:00:00Z")).state).toBe("post-shadow");
  });
  it("2026 eclipses, including the 12 August total solar eclipse seen from the UK", () => {
    const e = eclipsesIn(2026);
    expect(e.length).toBe(4);
    const aug = e.find((x) => ukDay(x.time) === "2026-08-12")!;
    expect(aug.type).toBe("solar");
    expect(aug.sign).toBe("Leo");
    expect(aug.visibleUk).toBe(true);
  });
});

describe("yearly horoscopes", () => {
  it("every sign has Jupiter, Saturn, eclipses, retrogrades and 12 months", { timeout: 120000 }, () => {
    for (const s of SIGNS) {
      const h = yearlyHoroscope(s, 2027);
      const ids = h.sections.map((x) => x.id);
      expect(ids.some((i) => i.startsWith("jupiter"))).toBe(true);
      expect(ids.some((i) => i.startsWith("saturn"))).toBe(true);
      expect(ids).toContain("eclipses");
      expect(ids).toContain("mercury-retro");
      expect(ids).toContain("mars-retro");
      expect(h.months.length).toBe(12);
      expect(h.months.reduce((n, m) => n + m.items.length, 0)).toBeGreaterThanOrEqual(24);
      for (const sec of h.sections) expect(sec.paragraphs.every((p) => p.length > 40)).toBe(true);
    }
  });
});

describe("personal day", () => {
  it("reads natal houses and transits", { timeout: 60000 }, () => {
    const c = calculateChart({ date: "1993-09-25", time: "11:00", ...london });
    for (let i = 0; i < 30; i++) {
      const d = personalDay(c, addDays("2026-11-01", i));
      expect(d.personal.houseKind).toBe("natal");
      expect(d.paragraphs[0].length).toBeGreaterThan(40);
      expect(d.personal.transits.length).toBeLessThanOrEqual(4);
      for (const t of d.personal.transits) expect(t.text.length).toBeGreaterThan(40);
    }
    const noTime = personalDay(calculateChart({ date: "1993-09-25", time: null, ...london }), "2026-11-03");
    expect(noTime.personal.houseKind).toBe("solar");
    expect(noTime.personal.transits.every((t) => t.natal !== "Ascendant" && t.natal !== "Midheaven")).toBe(true);
  });
});

describe("Chinese zodiac", () => {
  it("Lunar New Year matches published dates", () => {
    const known: Record<number, string> = { 1985: "1985-02-20", 1990: "1990-01-27", 2000: "2000-02-05", 2012: "2012-01-23", 2020: "2020-01-25", 2023: "2023-01-22", 2024: "2024-02-10", 2025: "2025-01-29", 2026: "2026-02-17", 2027: "2027-02-06", 2028: "2028-01-26", 2033: "2033-01-31" };
    for (const [y, d] of Object.entries(known)) expect(lunarNewYear(Number(y))).toBe(d);
  });
  it("animals, elements and the year boundary", () => {
    expect(animalOfYear(2027)).toBe("Goat");
    expect(elementOfYear(2027)).toBe("Fire");
    expect(elementOfYear(2024)).toBe("Wood");
    const t = lunarNewYearTable(1990, 2030);
    expect(chineseYearFor("2027-02-05", t)!.animal).toBe("Horse");
    expect(chineseYearFor("2027-02-06", t)!.animal).toBe("Goat");
    expect(chineseYearFor("1990-01-20", t)!.animal).toBe("Snake");
  });
  it("relations follow tradition and every animal has text", () => {
    expect(relation("Rat", "Ox")).toBe("secret-friend");
    expect(relation("Tiger", "Dog")).toBe("trine");
    expect(relation("Snake", "Pig")).toBe("clash");
    expect(relation("Rooster", "Dog")).toBe("harm");
    expect(relation("Rat", "Rat")).toBe("same");
    for (const a of ANIMALS) { expect(CHINESE_ANIMALS[a].overview.length).toBeGreaterThan(200); expect(CHINESE_YEAR_2027.animals[a].length).toBeGreaterThan(200); }
  });
});
