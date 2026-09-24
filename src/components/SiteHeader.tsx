"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import { primaryNav } from "./nav";

export function SiteHeader() {
  const pathname = usePathname();
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
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        transparent
          ? "bg-transparent"
          : "border-b border-line/70 bg-ivory/85 backdrop-blur-md supports-[backdrop-filter]:bg-ivory/75"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href="/" aria-label="Witchy Portal home" className="rounded-lg">
          <Wordmark light={transparent} />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
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
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <Link
          href="/retreats"
          className={`${transparent ? "btn-light" : "btn-primary"} min-h-10 px-5 text-sm lg:min-h-11`}
        >
          Book a retreat
        </Link>
      </div>
    </header>
  );
}
