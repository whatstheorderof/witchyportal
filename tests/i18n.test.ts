import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { LOCALES, isTranslatedPath, localePath, splitLocale, translate } from "@/i18n/config";

describe("locale paths", () => {
  it("prefixes non-English paths and leaves English alone", () => {
    expect(localePath("en", "/about")).toBe("/about");
    expect(localePath("es", "/")).toBe("/es");
    expect(localePath("ar", "/retreats/x?y=1")).toBe("/ar/retreats/x?y=1");
    expect(localePath("fr", "https://example.com")).toBe("https://example.com");
    expect(localePath("fr", "//cdn.example.com/a")).toBe("//cdn.example.com/a");
  });
  it("never prefixes admin or api routes", () => {
    expect(localePath("es", "/admin")).toBe("/admin");
    expect(localePath("es", "/api/checkout")).toBe("/api/checkout");
  });
  it("splits a prefixed path back apart", () => {
    expect(splitLocale("/es/about?x=1")).toEqual({ locale: "es", path: "/about?x=1" });
    expect(splitLocale("/zh")).toEqual({ locale: "zh", path: "/" });
    expect(splitLocale("/en/about")).toEqual({ locale: "en", path: "/en/about" });
    expect(splitLocale("/about")).toEqual({ locale: "en", path: "/about" });
    expect(splitLocale("/xx/about")).toEqual({ locale: "en", path: "/xx/about" });
  });
  it("knows which pages are fully translated", () => {
    expect(isTranslatedPath("/retreats/awaken-the-wild-goddess/book")).toBe(true);
    expect(isTranslatedPath("/horoscope/aries")).toBe(false);
  });
});

describe("translate", () => {
  it("falls back to English and fills placeholders", () => {
    expect(translate({ "Hi {name}": "Hola {name}" }, "Hi {name}", { name: "Ana" })).toBe("Hola Ana");
    expect(translate({}, "Missing {n}", { n: 2 })).toBe("Missing 2");
    expect(translate(undefined, "Plain")).toBe("Plain");
  });
});

describe("dictionaries", () => {
  const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
  for (const kind of ["ui", "content"]) {
    for (const l of LOCALES.filter((x) => x !== "en")) {
      it(`${kind}/${l} keeps every {placeholder}`, () => {
        const dict: Record<string, string> = JSON.parse(readFileSync(path.join(process.cwd(), `src/i18n/${kind}/${l}.json`), "utf8"));
        const bad = Object.entries(dict).filter(([k, v]) => !v.trim() || vars(k) !== vars(v)).map(([k]) => k);
        expect(bad).toEqual([]);
      });
    }
  }
});
