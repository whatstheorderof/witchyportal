/**
 * Languages. English is the default and lives at unprefixed URLs; every other
 * language lives under its own prefix (witchyportal.org/es/…), which proxy.ts
 * rewrites to the same pages with the language in a request header.
 * Safe to import anywhere (no server-only code).
 */
export const LOCALES = ["en", "es", "zh", "hi", "fr", "ar", "pt"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const PREFIXED = LOCALES.filter((l) => l !== "en");

export const LOCALE_INFO: Record<Locale, { name: string; english: string; hreflang: string; intl: string; og: string; dir: "ltr" | "rtl"; suggest: [string, string] }> = {
  en: { name: "English", english: "English", hreflang: "en", intl: "en-GB", og: "en_GB", dir: "ltr", suggest: ["View Witchy Portal in English", "No thanks"] },
  es: { name: "Español", english: "Spanish", hreflang: "es", intl: "es-ES", og: "es_ES", dir: "ltr", suggest: ["Ver Witchy Portal en español", "No, gracias"] },
  zh: { name: "简体中文", english: "Chinese (Simplified)", hreflang: "zh-Hans", intl: "zh-CN", og: "zh_CN", dir: "ltr", suggest: ["以简体中文浏览 Witchy Portal", "不用了"] },
  hi: { name: "हिन्दी", english: "Hindi", hreflang: "hi", intl: "hi-IN", og: "hi_IN", dir: "ltr", suggest: ["Witchy Portal हिन्दी में देखें", "नहीं, धन्यवाद"] },
  fr: { name: "Français", english: "French", hreflang: "fr", intl: "fr-FR", og: "fr_FR", dir: "ltr", suggest: ["Voir Witchy Portal en français", "Non merci"] },
  ar: { name: "العربية", english: "Arabic", hreflang: "ar", intl: "ar", og: "ar_AR", dir: "rtl", suggest: ["تصفّح Witchy Portal بالعربية", "لا، شكرًا"] },
  pt: { name: "Português", english: "Portuguese", hreflang: "pt", intl: "pt-BR", og: "pt_BR", dir: "ltr", suggest: ["Ver o Witchy Portal em português", "Não, obrigado"] },
};

export const LOCALE_HEADER = "x-witchy-locale";
export const LOCALE_COOKIE = "witchy_lang";
export const PATH_HEADER = "x-witchy-path";

/** Marks an English interface string for translation where t() can't be called (lists, constants). */
export const msg = <S extends string>(s: S) => s;
/** Marks long-form text kept in a constant, so scripts/readings.ts finds it (translated with rx()). */
export const prose = <S extends string>(s: S) => s;

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);

/** Paths that are never translated or prefixed */
const UNPREFIXED = /^\/(api|admin|_next)(\/|$)|\.[a-z0-9]{2,5}$/i;

/** "/about" in a language → "/es/about" (English stays unprefixed) */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en" || !path.startsWith("/") || path.startsWith("//") || UNPREFIXED.test(path.split(/[?#]/)[0])) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** "/es/about?x=1" → { locale: "es", path: "/about?x=1" } */
export function splitLocale(full: string): { locale: Locale; path: string } {
  const i = full.search(/[?#]/);
  const p = i < 0 ? full : full.slice(0, i), rest = i < 0 ? "" : full.slice(i);
  const m = p.match(/^\/([a-z]{2})(\/.*)?$/);
  if (m && isLocale(m[1]) && m[1] !== "en") return { locale: m[1], path: (m[2] || "/") + rest };
  return { locale: "en", path: full };
}

/**
 * Pages translated in full. Elsewhere, other languages see translated menus
 * around English content, the page's canonical URL is the English one, and
 * no hreflang alternates are published (so search engines don't index
 * half-translated pages).
 */
/** Pages whose content is long-form readings (Phase 2): translated once a language is in READINGS_DONE. */
export const READINGS_PATHS = [/^\/(horoscope|zodiac|moon|tarot|today|this-week-in-astrology|mercury-retrograde|eclipses|chinese-zodiac|compatibility|birth-chart|calculators|astrology|articles|tips|[a-z-]+-calculator)(\/.*)?$/];
export const TRANSLATED_PATHS = [/^\/$/, /^\/retreats(\/[^/]+)?$/, /^\/retreats\/[^/]+\/book$/, /^\/booking\/return$/, /^\/about$/, /^\/contact$/, /^\/services$/, /^\/testimonials$/, /^\/discover$/, /^\/policies\/[^/]+$/, /^\/socials$/, /^\/favourites$/, /^\/watch$/, /^\/ask-a-witch$/];
/** Languages whose long-form readings (Phase 2) are complete. */
export const READINGS_DONE: readonly Locale[] = ["es"];
/** The language readings are shown in for a visitor's language. */
export const readingsLang = (l: Locale): Locale => (l === "en" || READINGS_DONE.includes(l) ? l : "en");

export const isTranslatedPath = (p: string, locale?: Locale) => {
  const bare = p.split(/[?#]/)[0];
  return TRANSLATED_PATHS.some((r) => r.test(bare)) || (locale != null && READINGS_DONE.includes(locale) && READINGS_PATHS.some((r) => r.test(bare)));
};

type Vars = Record<string, string | number>;
/** Look up an English string in a dictionary, falling back to English; fills {placeholders}. */
export function translate(dict: Record<string, string> | undefined, text: string, vars?: Vars): string {
  const out = (dict && dict[text]) || text;
  return vars ? out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : out;
}
