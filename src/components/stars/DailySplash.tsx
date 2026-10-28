"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DailyHoroscope } from "@/lib/astro/horoscope";
import { getMySign, markSplashSeen, splashEnabled, splashSeenOn } from "@/lib/my-sign";
import { DayCard } from "./DayCard";

const ukToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());

/**
 * Once a day, visitors who have chosen their sign are greeted with their
 * astrological day — a splash screen they can close straight away or switch off.
 */
export function DailySplash() {
  const [h, setH] = useState<DailyHoroscope | null>(null);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sign = getMySign();
    const today = ukToday();
    if (!sign || !splashEnabled() || splashSeenOn() === today) return;
    if (pathname.startsWith("/today") || pathname.startsWith("/horoscope") || pathname.startsWith("/admin")) return;
    if (window.matchMedia("print").matches) return;
    fetch(`/api/today?sign=${sign.toLowerCase()}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.horoscope) { setH(d.horoscope); markSplashSeen(today); } })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (!h) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setH(null);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [h]);

  if (!h) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={`Your day, ${h.sign}`} className="fixed inset-0 z-[60] flex items-end justify-center bg-plum-deep/70 p-0 backdrop-blur-sm sm:items-center sm:p-6 print:hidden">
      <div className="reveal relative max-h-[100dvh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-plum-deep p-6 pb-10 text-ivory shadow-2xl sm:rounded-[2rem] sm:p-10">
        <button ref={closeRef} type="button" onClick={() => setH(null)} aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-2xl text-ivory/80 hover:bg-ivory/10">×</button>
        <DayCard h={h} light compact link={false} />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/horoscope/${h.sign.toLowerCase()}`} onClick={() => setH(null)} className="btn-primary bg-ivory text-plum hover:bg-blush">My full horoscope</Link>
          <button type="button" onClick={() => setH(null)} className="btn-outline border-ivory/40 text-ivory hover:bg-ivory/10">Enter Witchy Portal</button>
        </div>
        <p className="mt-4 text-xs text-ivory/60">You can switch this greeting off on your <Link href="/today" onClick={() => setH(null)} className="underline">Today</Link> page.</p>
      </div>
    </div>
  );
}
