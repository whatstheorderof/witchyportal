"use client";

import Link from "@/i18n/client";
import { useBarePath, useI18n } from "@/i18n/client";
import { LanguagePicker } from "./i18n/LanguagePicker";
import { useEffect, useState } from "react";
import { ShortcutMenu } from "./ShortcutMenu";
import { primaryNav } from "./nav";

export function SiteHeader() {
  const pathname = useBarePath();
  const { t } = useI18n();
  const overlay = pathname === "/" || pathname === "/about";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overlay && !scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 print:hidden ${
        transparent
          ? "bg-transparent"
          : "border-b border-line/70 bg-ivory/85 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/75"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <ShortcutMenu light={transparent} />
        <nav aria-label={t("Main")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-4 py-2 text-[0.95rem] transition ${
                      transparent ? "text-ivory/90 hover:text-ivory" : "text-ink/80 hover:text-plum"
                    } aria-[current=page]:underline aria-[current=page]:decoration-blush-deep aria-[current=page]:underline-offset-8`}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguagePicker light={transparent} />
          <Link
            href="/retreats"
            className={`${transparent ? "btn-light" : "btn-primary"} min-h-10 whitespace-nowrap px-3.5 text-sm sm:px-5 lg:min-h-11`}
          >
            {t("Book a retreat")}
          </Link>
        </div>
      </div>
    </header>
  );
}
