"use client";

import { createContext, useContext, useMemo } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_INFO, localePath, readingsLang, splitLocale, translate, type Locale } from "./config";

type Ctx = { locale: Locale; dict: Record<string, string> };
const I18nContext = createContext<Ctx>({ locale: "en", dict: {} });

export function LocaleProvider({ locale, dict, children }: Ctx & { children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, dict }), [locale, dict]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** The visitor's language in client components: t() for interface text, href() for links. */
export function useI18n() {
  const { locale, dict } = useContext(I18nContext);
  return useMemo(() => ({
    locale,
    dir: LOCALE_INFO[locale].dir,
    /** The language readings (horoscopes, chart texts) are in: use as lang={rlang}. */
    rlang: readingsLang(locale),
    intl: LOCALE_INFO[locale].intl,
    t: (text: string, vars?: Record<string, string | number>) => translate(dict, text, vars),
    href: (p: string) => localePath(locale, p),
    /** An API path with the visitor's language (?lang=xx) so readings come back translated. */
    api: (p: string) => (locale === "en" ? p : `${p}${p.includes("?") ? "&" : "?"}lang=${locale}`),
  }), [locale, dict]);
}

/** next/link that keeps the visitor in their language. */
export function Link(props: React.ComponentProps<typeof NextLink>) {
  const { locale } = useContext(I18nContext);
  const { href, ...rest } = props;
  const h = typeof href === "string" ? localePath(locale, href) : href;
  return <NextLink href={h} {...rest} />;
}
export default Link;

/** The current path without its language prefix ("/es/about" → "/about"). */
export function useBarePath() {
  return splitLocale(usePathname() ?? "/").path;
}
