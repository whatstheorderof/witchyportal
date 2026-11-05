import "server-only";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { LOCALES, LOCALE_INFO, isTranslatedPath, localePath } from "./config";
import { getI18n } from "./server";

type Input = Parameters<typeof pageMeta>[0];

/**
 * pageMeta for a translated page: canonical URL in the visitor's language and
 * hreflang alternates for every language (x-default = English).
 */
export async function localeMeta(input: Input): Promise<Metadata> {
  const { locale, info } = await getI18n();
  const base = pageMeta(input);
  if (!isTranslatedPath(input.path, locale)) return base;
  const langs = LOCALES.filter((l) => l === "en" || isTranslatedPath(input.path, l));
  const languages: Record<string, string> = Object.fromEntries(langs.map((l) => [LOCALE_INFO[l].hreflang, localePath(l, input.path)]));
  languages["x-default"] = input.path;
  const url = localePath(locale, input.path);
  return {
    ...base,
    alternates: { canonical: url, languages },
    openGraph: { ...base.openGraph, url, locale: info.og, alternateLocale: langs.filter((l) => l !== locale).map((l) => LOCALE_INFO[l].og) },
  };
}
