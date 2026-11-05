"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_COOKIE, LOCALE_INFO, localePath, type Locale } from "@/i18n/config";
import { useBarePath, useI18n } from "@/i18n/client";

export const rememberLocale = (l: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
};

function GlobeIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
    </svg>
  );
}

/**
 * Language choice. Plain links (search engines can follow them); choosing one
 * also remembers it on this device, so English addresses open in that language.
 */
export function LanguagePicker({ variant = "menu", light = false }: { variant?: "menu" | "list" | "sheet"; light?: boolean }) {
  const { locale, t } = useI18n();
  const path = useBarePath();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  const links = LOCALES.map((l) => (
    <li key={l}>
      <a
        href={localePath(l, path)}
        hrefLang={LOCALE_INFO[l].hreflang}
        lang={LOCALE_INFO[l].hreflang}
        aria-current={l === locale ? "true" : undefined}
        onClick={() => rememberLocale(l)}
        className={variant === "list"
          ? `inline-flex min-h-10 items-center rounded-full px-3 py-1.5 ${l === locale ? "bg-ivory/15 text-ivory" : "text-ivory/75 hover:text-ivory"}`
          : variant === "sheet"
          ? `inline-flex min-h-11 items-center rounded-full px-4 py-2 ring-1 ${l === locale ? "bg-plum text-ivory ring-plum" : "text-ink ring-line hover:bg-sand/60"}`
          : `flex min-h-11 items-center justify-between gap-4 rounded-xl px-4 py-2 text-ink hover:bg-sand/60 ${l === locale ? "font-medium text-plum" : ""}`}
      >
        <span>{LOCALE_INFO[l].name}</span>
        {variant === "menu" && l === locale && <span aria-hidden className="text-plum">✓</span>}
      </a>
    </li>
  ));

  if (variant !== "menu") {
    return (
      <nav aria-label={t("Language")}>
        <ul className={`flex flex-wrap items-center text-sm ${variant === "sheet" ? "gap-2" : "gap-1"}`}>{links}</ul>
      </nav>
    );
  }
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${t("Language")}: ${LOCALE_INFO[locale].name}`}
        className={`flex min-h-10 items-center gap-1.5 rounded-full px-2.5 text-sm transition sm:px-3 ${light ? "text-ivory/90 hover:bg-ivory/10" : "text-ink/80 hover:bg-sand/60"}`}
      >
        <GlobeIcon />
        <span className="hidden uppercase tracking-wide sm:inline">{locale}</span>
      </button>
      {open && (
        <ul className="absolute end-0 top-full z-50 mt-2 w-52 rounded-2xl bg-ivory p-2 shadow-(--shadow-lift) ring-1 ring-line">{links}</ul>
      )}
    </div>
  );
}
