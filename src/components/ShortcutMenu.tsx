"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Wordmark } from "./Logo";
import { ArrowRight, CloseIcon } from "./Icons";
import { shortcutGroups } from "./nav";

/**
 * The Witchy Portal logo opens a shortcut menu to every key page.
 * Esc or a click outside closes it; focus returns to the logo.
 */
export function ShortcutMenu({ light }: { light: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close when the page changes
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = [...panel.current.querySelectorAll<HTMLElement>("a, button")];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !button.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label="Witchy Portal — open shortcuts menu"
        className="flex items-center gap-1.5 rounded-lg"
      >
        <Wordmark light={light && !open} />
        <svg viewBox="0 0 12 8" aria-hidden className={`mt-1 h-2 w-3 transition ${open ? "rotate-180" : ""} ${light && !open ? "text-ivory" : "text-plum"}`}>
          <path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 top-16 z-40 bg-plum-deep/40 backdrop-blur-[2px] lg:top-20" />
          <div
            ref={panel}
            id={`${id}-menu`}
            role="dialog"
            aria-label="Shortcuts"
            className="reveal fixed inset-x-3 top-[4.5rem] z-50 max-h-[calc(100dvh-10.5rem-env(safe-area-inset-bottom))] lg:max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-[1.75rem] bg-ivory p-5 text-ink shadow-(--shadow-lift) ring-1 ring-line sm:inset-x-auto sm:left-5 sm:w-[min(92vw,760px)] sm:p-7 lg:left-12 lg:top-[5.25rem]"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="eyebrow">Shortcuts</p>
              <button type="button" onClick={() => { setOpen(false); button.current?.focus(); }} className="grid h-10 w-10 place-items-center rounded-full hover:bg-sand/60" aria-label="Close shortcuts">
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              {shortcutGroups.map((g) => (
                <nav key={g.title} aria-label={g.title}>
                  <p className="mb-2 text-[0.7rem] uppercase tracking-[0.2em] text-muted">{g.title}</p>
                  <ul className="grid grid-cols-2 gap-1 sm:grid-cols-1">
                    {g.items.map((i) => {
                      const active = i.href === "/" ? pathname === "/" : pathname.startsWith(i.href);
                      return (
                        <li key={i.href}>
                          <Link
                            href={i.href}
                            aria-current={active ? "page" : undefined}
                            onClick={() => setOpen(false)}
                            className="block rounded-xl px-3 py-2 transition hover:bg-sand/50 focus-visible:bg-sand/50 aria-[current=page]:bg-lavender/40"
                          >
                            <span className="block font-display text-xl leading-tight text-plum">{i.label}</span>
                            <span className="hidden text-xs text-muted sm:block">{i.blurb}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              ))}
            </div>
            <Link href="/retreats" onClick={() => setOpen(false)} className="btn-primary mt-6 w-full sm:w-auto">
              Book a retreat <ArrowRight />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
