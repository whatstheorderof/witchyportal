import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { LOCALE_HEADER, PATH_HEADER, LOCALE_INFO, isLocale, localePath, translate, type Locale } from "./config";
import uiEs from "./ui/es.json";
import uiZh from "./ui/zh.json";
import uiHi from "./ui/hi.json";
import uiFr from "./ui/fr.json";
import uiAr from "./ui/ar.json";
import uiPt from "./ui/pt.json";
import cEs from "./content/es.json";
import cZh from "./content/zh.json";
import cHi from "./content/hi.json";
import cFr from "./content/fr.json";
import cAr from "./content/ar.json";
import cPt from "./content/pt.json";

type Dict = Record<string, string>;
const UI: Partial<Record<Locale, Dict>> = { es: uiEs, zh: uiZh, hi: uiHi, fr: uiFr, ar: uiAr, pt: uiPt };
const CONTENT: Partial<Record<Locale, Dict>> = { es: cEs, zh: cZh, hi: cHi, fr: cFr, ar: cAr, pt: cPt };

export const uiDict = (l: Locale): Dict => UI[l] ?? {};

/** Normalise content text for lookup: the same words with different spacing match. */
export const contentKey = (s: string) => s.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();

/** The visitor's language for this request (set by proxy.ts from the URL). */
export const getLocale = cache(async (): Promise<Locale> => {
  const v = (await headers()).get(LOCALE_HEADER);
  return isLocale(v) ? v : "en";
});

export type T = (text: string, vars?: Record<string, string | number>) => string;

export function i18nFor(locale: Locale) {
  const ui = uiDict(locale), content = CONTENT[locale] ?? {};
  const t: T = (text, vars) => translate(ui, text, vars);
  /** Translate site content (from the database or /content); falls back to the English original. */
  const tc = <S extends string | null | undefined>(text: S): S => (text && locale !== "en" ? ((content[contentKey(text)] ?? text) as S) : text);
  const href = (p: string) => localePath(locale, p);
  const info = LOCALE_INFO[locale];
  const date = (d: Date | string, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) =>
    new Intl.DateTimeFormat(info.intl, { timeZone: "Europe/London", ...o }).format(typeof d === "string" ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T12:00:00Z` : d) : d);
  return { locale, info, dir: info.dir, t, tc, href, date };
}

export const getI18n = cache(async () => i18nFor(await getLocale()));

/** The page path without the language prefix (from proxy.ts). */
export const getBarePath = cache(async () => (await headers()).get(PATH_HEADER) ?? "/");
