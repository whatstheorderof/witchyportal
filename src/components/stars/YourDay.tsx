"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { DailyHoroscope } from "@/lib/astro/horoscope";
import { markSplashSeen, setMySign, setSplashEnabled, useMySign, useSplashEnabled } from "@/lib/my-sign";
import { DayCard } from "./DayCard";
import { SignPicker } from "./SignPicker";

/** "Your day in the stars": pick a sign once, then see today at a glance. */
export function YourDay({ light = true, full = false }: { light?: boolean; full?: boolean }) {
  const sign = useMySign();
  const [h, setH] = useState<DailyHoroscope | null>(null);
  const [failed, setFailed] = useState(false);
  const [changing, setChanging] = useState(false);
  const splash = useSplashEnabled();

  useEffect(() => {
    if (!sign) return;
    let live = true;
    fetch(`/api/today?sign=${sign.toLowerCase()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (live) { setH(d.horoscope); setFailed(false); markSplashSeen(d.horoscope.day); } })
      .catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [sign]);

  const box = light ? "rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10" : "rounded-[2rem] bg-ivory p-6 shadow-(--shadow-soft) ring-1 ring-line sm:p-10";
  if (sign === undefined) return <div className={`${box} min-h-[22rem]`} aria-busy="true" />;

  if (!sign || changing) {
    return (
      <div className={box}>
        <p className={`eyebrow ${light ? "text-blush" : ""}`}>Your day in the stars</p>
        <h2 className={`mt-2 font-display text-3xl sm:text-4xl ${light ? "text-ivory" : "text-plum"}`}>What&rsquo;s in store for you today?</h2>
        <p className={`mt-2 ${light ? "text-ivory/80" : "text-ink/80"}`}>Choose your star sign — we&rsquo;ll remember it on this device, so your day is here whenever you come back.</p>
        <div className="mt-6"><SignPicker light={light} selected={sign} onPick={(s) => { setMySign(s); setChanging(false); }} /></div>
      </div>
    );
  }

  return (
    <div className={box} aria-live="polite">
      {h && h.sign === sign ? <DayCard h={h} light={light} compact={!full} /> : failed ? <p>Today&rsquo;s stars couldn&rsquo;t be loaded. Please try again.</p> : <div className="min-h-[18rem]" aria-busy="true"><p className={light ? "text-ivory/70" : "text-muted"}>Reading the sky for {sign}…</p></div>}
      <div className={`mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-sm ${light ? "border-ivory/15 text-ivory/80" : "border-line text-muted"}`}>
        <button type="button" onClick={() => setChanging(true)} className="link-underline">Not {sign}? Change sign</button>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 accent-blush" checked={splash} onChange={(e) => setSplashEnabled(e.target.checked)} />
          Greet me with my day when I open Witchy Portal
        </label>
        {!full && <Link href="/today" className="link-underline">Open full screen</Link>}
      </div>
    </div>
  );
}
