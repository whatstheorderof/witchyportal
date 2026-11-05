"use client";

import { useEffect, useState } from "react";
import { LOCALES, LOCALE_COOKIE, LOCALE_INFO, localePath, type Locale } from "@/i18n/config";
import { useBarePath, useI18n } from "@/i18n/client";
import { rememberLocale } from "./LanguagePicker";

/**
 * A one-time, dismissible suggestion when the browser prefers one of our
 * other languages. We never redirect automatically (that confuses search
 * engines and people who want the English site).
 */
export function LanguageSuggest() {
  const { locale } = useI18n();
  const path = useBarePath();
  const [target, setTarget] = useState<Locale | null>(null);

  useEffect(() => {
    if (document.cookie.split("; ").some((c) => c.startsWith(`${LOCALE_COOKIE}=`))) return;
    const want = (navigator.languages ?? [navigator.language]).map((l) => l.toLowerCase().split("-")[0]);
    const first = want.find((l) => (LOCALES as readonly string[]).includes(l)) as Locale | undefined;
    const id = setTimeout(() => { if (first && first !== locale) setTarget(first); }, 0);
    return () => clearTimeout(id);
  }, [locale]);

  if (!target) return null;
  const [yes, no] = LOCALE_INFO[target].suggest;
  return (
    <div role="region" aria-label={LOCALE_INFO[target].name} lang={LOCALE_INFO[target].hreflang} dir={LOCALE_INFO[target].dir}
      className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-md flex-wrap items-center justify-between gap-3 rounded-2xl bg-plum-deep p-4 text-ivory shadow-2xl lg:bottom-6 print:hidden">
      <a href={localePath(target, path)} onClick={() => rememberLocale(target)} className="btn-primary min-h-10 bg-ivory px-4 text-sm text-plum hover:bg-blush">{yes}</a>
      <button type="button" onClick={() => { rememberLocale(locale); setTarget(null); }} className="text-sm text-ivory/80 underline underline-offset-4">{no}</button>
    </div>
  );
}
