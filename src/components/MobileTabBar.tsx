"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChartIcon, CloseIcon, HomeIcon, MenuIcon, SparkIcon, WaveIcon } from "./Icons";
import { discoverNav } from "./nav";

const tabs = [
  { href: "/", label: "Home", Icon: HomeIcon, match: (p: string) => p === "/" },
  { href: "/retreats", label: "Retreats", Icon: WaveIcon, match: (p: string) => p.startsWith("/retreats") },
  { href: "/discover", label: "Discover", Icon: SparkIcon, match: (p: string) => ["/discover", "/tips", "/articles", "/astrology", "/ask-a-witch", "/tarot", "/moon"].some((x) => p.startsWith(x)) },
  { href: "/birth-chart", label: "Chart", Icon: ChartIcon, match: (p: string) => p.startsWith("/birth-chart") },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  return (
    <>
      <nav
        aria-label="App"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-ivory/92 backdrop-blur-md lg:hidden"
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
                  <span>{label}</span>
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
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={dialog}
        aria-label="More"
        className="safe-bottom m-0 mt-auto max-h-[85dvh] w-full max-w-none rounded-t-[1.75rem] bg-ivory p-0 text-ink backdrop:bg-plum-deep/50 backdrop:backdrop-blur-sm open:animate-[reveal_.35s_var(--ease-veil)] lg:hidden"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="px-5 pt-3 pb-8">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" aria-hidden />
          <div className="mb-4 flex items-center justify-between">
            <p className="eyebrow">Explore</p>
            <button type="button" onClick={() => dialog.current?.close()} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand/60" aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <ul className="grid gap-1">
            {[...discoverNav, { href: "/about", label: "About Yulia", blurb: "Her story and why she hosts retreats." }, { href: "/socials", label: "Socials", blurb: "Yulia on Instagram, YouTube and Etsy." }, { href: "/contact", label: "Contact", blurb: "Questions, enquiries and collaborations." }].map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="flex min-h-14 flex-col justify-center rounded-2xl px-4 py-2 hover:bg-sand/50">
                  <span className="font-display text-xl text-plum">{i.label}</span>
                  <span className="text-sm text-muted">{i.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
