import "server-only";
/**
 * Translations of the long-form readings (Phase 2): horoscopes, birth chart,
 * compatibility, transits, Chinese zodiac, moon and tarot guides, posts and
 * the prose on astrology pages.
 *
 * Keyed by the English paragraph (whitespace collapsed), so editing the
 * English text makes that paragraph fall back to English until it is
 * translated again. Each language is a separate chunk loaded on the server
 * only when a visitor uses it — none of this text is sent to the browser
 * except the paragraphs on the page.
 *
 * Files: src/i18n/readings/{lang}/*.json, merged by readings/{lang}/index.ts.
 * Workflow: scripts/readings.ts (see docs/I18N.md).
 */
import { cache } from "react";
import { getLocale, uiDict } from "./server";
import { LOCALE_INFO, readingsLang, translate, type Locale } from "./config";

type Dict = Record<string, string>;

const LOADERS: Partial<Record<Locale, () => Promise<{ default: Dict }>>> = {
  es: () => import("./readings/es"),
};


/** Lookup key for one paragraph. */
export const readingKey = (p: string) => p.replace(/\s+/g, " ").trim();

const loaded = new Map<Locale, Promise<Dict>>();
function load(locale: Locale): Promise<Dict> {
  const loader = LOADERS[locale];
  if (!loader) return Promise.resolve({});
  let p = loaded.get(locale);
  if (!p) {
    p = loader().then((m) => m.default).catch((e) => { loaded.delete(locale); throw e; });
    loaded.set(locale, p);
  }
  return p;
}

export interface Rx {
  /** Translate a reading paragraph by paragraph (untranslated paragraphs stay in English). */
  (text: string): string;
  /** Translate every reading string inside an object or array (other values untouched). */
  deep<V>(value: V): V;
  /** A post with its title, excerpt, period, body and SEO description translated. */
  post<P extends { title: string; excerpt?: string | null; body?: string | null; period?: string | null; seoDescription?: string | null }>(p: P): P;
  /** Fill {placeholders} after translating, like t(). */
  fill(text: string, vars: Record<string, string | number>): string;
  /** Interface text: sign and planet names, short labels and title templates (src/i18n/ui). */
  t(text: string, vars?: Record<string, string | number>): string;
  /** Format a date in the visitor's language (UK time unless timeZone is given). */
  date(d: Date, opts: Intl.DateTimeFormatOptions): string;
  /** "1st", "2nd"… in English; just the number elsewhere (templates place it). */
  ord(n: number): string;
  locale: Locale;
  intl: string;
  /** The language most of the readings are in: the visitor's when that language is complete. */
  lang: Locale;
}

export function makeRx(locale: Locale, dict: Dict, ui: Dict = {}): Rx {
  const on = locale !== "en" && Object.keys(dict).length > 0;
  const one = (text: string): string => {
    if (!on || !text) return text;
    const whole = dict[readingKey(text)];
    if (whole) return whole;
    if (!/\n\s*\n/.test(text)) return text;
    return text.split(/(\n\s*\n)/).map((part, i) => (i % 2 ? part : dict[readingKey(part)] ?? part)).join("");
  };
  const deep = <V,>(value: V): V => {
    if (!on) return value;
    if (typeof value === "string") return one(value) as V;
    if (Array.isArray(value)) return value.map(deep) as V;
    if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deep(v)])) as V;
    }
    return value;
  };
  const rx = one as Rx;
  rx.deep = deep;
  rx.post = (p) => (on ? { ...p, title: one(p.title), excerpt: p.excerpt && one(p.excerpt), body: p.body && one(p.body), period: p.period && one(p.period), seoDescription: p.seoDescription && one(p.seoDescription) } : p);
  rx.fill = (text, vars) => one(text).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
  rx.t = (text, vars) => translate(ui, text, vars);
  const intl = locale === "en" ? "en-GB" : LOCALE_INFO[locale].intl;
  rx.date = (d, opts) => new Intl.DateTimeFormat(intl, { timeZone: "Europe/London", ...opts }).format(d);
  rx.ord = (n) => (locale === "en" ? `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}` : String(n));
  rx.locale = locale;
  rx.intl = intl;
  rx.lang = readingsLang(locale);
  return rx;
}

/** Readings translator for a language. */
export async function readingsFor(locale: Locale): Promise<Rx> {
  return makeRx(locale, locale === "en" ? {} : await load(locale), uiDict(locale));
}

/** English (no translation): the default for code that doesn't pass a language. */
export const RX_EN: Rx = makeRx("en", {});

/** The language an API request asked for (?lang=xx), English otherwise. */
export function apiLocale(req: { nextUrl: URL }): Locale {
  const l = req.nextUrl.searchParams.get("lang");
  return l && l in LOCALE_INFO ? (l as Locale) : "en";
}

/** Readings translator for this request's language (pages). */
export const getReadings = cache(async () => readingsFor(await getLocale()));
