"use client";

import Link from "@/i18n/client";
import { useBarePath, useI18n } from "@/i18n/client";
import { msg } from "@/i18n/config";
import { LanguagePicker } from "./i18n/LanguagePicker";
import { useEffect, useRef } from "react";
import { CloseIcon, HomeIcon, MenuIcon, MoonIcon, SparkIcon, WaveIcon } from "./Icons";
import { discoverNav } from "./nav";

const tabs = [
  { href: "/", label: msg("Home"), Icon: HomeIcon, match: (p: string) => p === "/" },
  { href: "/today", label: msg("Today"), Icon: MoonIcon, match: (p: string) => p.startsWith("/today") || p.startsWith("/horoscope") },
  { href: "/discover", label: msg("Discover"), Icon: SparkIcon, match: (p: string) => ["/discover", "/tips", "/articles", "/astrology", "/ask-a-witch", "/tarot", "/moon", "/compatibility", "/this-week", "/zodiac"].some((x) => p.startsWith(x)) },
  { href: "/retreats", label: msg("Retreats"), Icon: WaveIcon, match: (p: string) => p.startsWith("/retreats") },
];

const MORE_ITEMS = [
  { href: "/services", label: msg("Work with Yulia"), blurb: msg("Spells, readings, astrology and party hire.") },
  { href: "/testimonials", label: msg("Testimonials"), blurb: msg("Kind words from clients.") },
  { href: "/birth-chart", label: msg("Birth Chart"), blurb: msg("Your full natal chart and written report, free.") },
  ...discoverNav,
  { href: "/watch", label: msg("Watch"), blurb: msg("Witchy TV: all of Yulia's videos.") },
  { href: "/about", label: msg("About Yulia"), blurb: msg("Her story and why she hosts retreats.") },
  { href: "/socials", label: msg("Socials"), blurb: msg("Yulia on Instagram, YouTube and Etsy.") },
  { href: "/favourites", label: msg("Your favourites"), blurb: msg("Tips, articles and videos you've saved.") },
  { href: "/contact", label: msg("Contact"), blurb: msg("Questions, enquiries and collaborations.") },
];

export function MobileTabBar() {
  const pathname = useBarePath();
  const { t } = useI18n();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  return (
    <>
      <nav
        aria-label={t("App")}
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-ivory/92 backdrop-blur-md lg:hidden print:hidden"
      >
        <ul className="mx-auto grid h-16 max-w-md grid-cols-5">
          {tabs.map(({ href, label, Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="flex h-full flex-col items-center justify-center gap-0.5 text-[0.7rem] tracking-wide text-muted transition aria-[current=page]:text-plum"
                >
                  <Icon className={`h-6 w-6 ${active ? "stroke-[1.8]" : ""}`} />
                  <span>{t(label)}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => dialog.current?.showModal()}
              className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-[0.7rem] tracking-wide text-muted"
              aria-haspopup="dialog"
            >
              <MenuIcon />
              <span>{t("More")}</span>
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={dialog}
        aria-label={t("More")}
        className="safe-bottom m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-[1.75rem] bg-ivory p-0 text-ink backdrop:bg-plum-deep/50 backdrop:backdrop-blur-sm open:animate-[reveal_.35s_var(--ease-veil)] lg:hidden"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="px-5 pt-3 pb-8">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden />
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">{t("Explore")}</p>
            <button type="button" onClick={() => dialog.current?.close()} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand/60" aria-label={t("Close menu")}>
              <CloseIcon />
            </button>
          </div>
          <ul className="grid gap-1">
            {MORE_ITEMS.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="flex min-h-14 flex-col justify-center rounded-2xl px-4 py-2 hover:bg-sand/50">
                  <span className="font-display text-xl text-plum">{t(i.label)}</span>
                  <span className="text-sm text-muted">{t(i.blurb)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-line pt-4">
            <p className="eyebrow mb-2">{t("Language")}</p>
            <LanguagePicker variant="sheet" />
          </div>
        </div>
      </dialog>
    </>
  );
}
