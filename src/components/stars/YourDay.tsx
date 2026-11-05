"use client";

import { useEffect, useState } from "react";
import Link, { useI18n } from "@/i18n/client";
import type { DailyHoroscope } from "@/lib/astro/horoscope";
import type { PersonalDay } from "@/lib/astro/personal";
import { markSplashSeen, setMySign, setSplashEnabled, useMySign, useSplashEnabled } from "@/lib/my-sign";
import { saveMyChart, useMyChart } from "@/lib/my-chart";
import { DayCard } from "./DayCard";
import { SignPicker } from "./SignPicker";

const ASPECT_WORD: Record<string, string> = { conjunction: "meets", sextile: "sextiles", square: "squares", trine: "trines", opposition: "opposes" };

/** Today's transits to the visitor's own chart. */
export function PersonalTransits({ h, light }: { h: PersonalDay; light: boolean }) {
  const list = h.personal.transits;
  const { t: tr } = useI18n();
  if (!list.length) return null;
  return (
    <div className="mt-6">
      <p className={`text-xs font-medium uppercase tracking-[0.18em] ${light ? "text-blush" : "text-plum-soft"}`}>{tr("Your transits today")}</p>
      <ul className="mt-2 grid gap-3">
        {list.map((x) => (
          <li key={`${x.transit}${x.natal}${x.aspect}`} lang="en" className={`rounded-2xl p-4 ${light ? "bg-ivory/10" : "bg-white/70 ring-1 ring-line"}`}>
            <p className={`font-medium ${light ? "text-ivory" : "text-plum"}`}>
              {x.transit} {ASPECT_WORD[x.aspect]} your {x.natal === "Ascendant" || x.natal === "Midheaven" ? x.natal : `natal ${x.natal}`}
              <span className={`ml-2 text-xs font-normal ${light ? "text-ivory/70" : "text-muted"}`}>{x.slow ? `${x.applying ? "building" : "easing"} · active for weeks` : x.transit === "Moon" ? "today" : `${x.applying ? "building" : "easing"} · this week`}</span>
            </p>
            <p className={`mt-1 text-[0.95rem] leading-relaxed ${light ? "text-ivory/90" : "text-ink/85"}`}>{x.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Your day in the stars": pick a sign once (or save your chart), then see today at a glance. */
export function YourDay({ light = true, full = false }: { light?: boolean; full?: boolean }) {
  const sign = useMySign();
  const chart = useMyChart();
  const [h, setH] = useState<DailyHoroscope | PersonalDay | null>(null);
  const [failed, setFailed] = useState(false);
  const [changing, setChanging] = useState(false);
  const splash = useSplashEnabled();
  const { t } = useI18n();

  useEffect(() => {
    if (chart === undefined) return;
    if (!chart && !sign) return;
    let live = true;
    const req = chart
      ? fetch("/api/today/personal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: chart.date, time: chart.time, placeId: chart.placeId }) })
      : fetch(`/api/today?sign=${sign!.toLowerCase()}`);
    req
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (live) { setH(d.horoscope); setFailed(false); markSplashSeen(d.horoscope.day); } })
      .catch(() => live && setFailed(true));
    return () => { live = false; };
  }, [sign, chart]);

  const box = light ? "rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10" : "rounded-[2rem] bg-ivory p-6 shadow-(--shadow-soft) ring-1 ring-line sm:p-10";
  if (sign === undefined || chart === undefined) return <div className={`${box} min-h-[22rem]`} aria-busy="true" />;

  if (!chart && (!sign || changing)) {
    return (
      <div className={box}>
        <p className={`eyebrow ${light ? "text-blush" : ""}`}>{t("Your day in the stars")}</p>
        <h2 className={`mt-2 font-display text-3xl sm:text-4xl ${light ? "text-ivory" : "text-plum"}`}>{t("What’s in store for you today?")}</h2>
        <p className={`mt-2 ${light ? "text-ivory/80" : "text-ink/80"}`}>{t("Choose your star sign — we’ll remember it on this device, so your day is here whenever you come back.")}</p>
        <div className="mt-6"><SignPicker light={light} selected={sign} onPick={(s) => { setMySign(s); setChanging(false); }} /></div>
        <p className={`mt-6 text-sm ${light ? "text-ivory/75" : "text-muted"}`}>{t("Want it truly personal?")} <Link href="/birth-chart#save-chart" className="link-underline">{t("Save your birth chart on this device and your day is read from your whole chart.")}</Link></p>
      </div>
    );
  }

  const personal = h && "personal" in h ? h : null;
  const ready = h && (chart ? personal : h.sign === sign);
  return (
    <div className={box} aria-live="polite">
      {chart && <p className={`mb-4 text-xs font-medium uppercase tracking-[0.18em] ${light ? "text-blush" : "text-plum-soft"}`}>{chart.name ? t("Personal · read from {name}’s birth chart", { name: chart.name }) : t("Personal · read from your birth chart")}</p>}
      {ready ? (
        <>
          <DayCard h={h!} light={light} compact={!full} />
          {personal && (full || personal.personal.transits.length > 0) && <PersonalTransits h={personal} light={light} />}
          {personal && full && personal.personal.houseKind === "solar" && <p lang="en" className={`mt-4 text-sm ${light ? "text-ivory/70" : "text-muted"}`}>Without a birth time your houses are counted from your Sun sign, and transits to your rising sign and Midheaven aren&rsquo;t shown.</p>}
        </>
      ) : failed ? <p>{t("Today’s stars couldn’t be loaded. Please try again.")}</p> : <div className="min-h-[18rem]" aria-busy="true"><p className={light ? "text-ivory/70" : "text-muted"}>{chart ? t("Reading the sky for your chart…") : t("Reading the sky for {sign}…", { sign: t(sign ?? "") })}</p></div>}
      <div className={`mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-4 text-sm ${light ? "border-ivory/15 text-ivory/80" : "border-line text-muted"}`}>
        {chart ? (
          <button type="button" onClick={() => { saveMyChart(null); setH(null); }} className="link-underline">{t("Forget my chart on this device")}</button>
        ) : (
          <button type="button" onClick={() => setChanging(true)} className="link-underline">{t("Not {sign}? Change sign", { sign: t(sign ?? "") })}</button>
        )}
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4 accent-blush" checked={splash} onChange={(e) => setSplashEnabled(e.target.checked)} />
          {t("Greet me with my day when I open Witchy Portal")}
        </label>
        {!full && <Link href="/today" className="link-underline">{t("Open full screen")}</Link>}
        {!chart && <Link href="/birth-chart#save-chart" className="link-underline">{t("Make it personal")}</Link>}
      </div>
    </div>
  );
}
