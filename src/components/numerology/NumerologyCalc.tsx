"use client";

import { useState } from "react";
import Link, { useI18n } from "@/i18n/client";
import { birthdayNumber, latinLetters, lifePath, nameNumbers, numSlug, personalYear, type NumKey } from "@/lib/numerology";
import { ukToday } from "@/lib/daily-ritual";
import type { CoreKey } from "@/lib/astro/text/stars/numerology";

type Props = {
  numbers: Record<NumKey, { title: string; summary: string }>;
  core: Record<CoreKey, { label: string; text: string }>;
  years: Record<number, string>;
};
type Result = { date: string; lp: NumKey; bd: NumKey; names: ReturnType<typeof nameNumbers>; nameIgnored: boolean; year: number; py: number };

/** Life path, birthday, name and personal-year numbers. Everything is calculated here in the browser and nothing is stored. */
export function NumerologyCalc({ numbers, core, years }: Props) {
  const { t, rlang } = useI18n();
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [r, setR] = useState<Result | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lp = lifePath(date);
    if (!lp) { setError(t("Please enter your date of birth")); setR(null); return; }
    setError("");
    const year = Number(ukToday().slice(0, 4));
    const names = name.trim() ? nameNumbers(name) : null;
    setR({ date, lp, bd: birthdayNumber(date)!, names, nameIgnored: !!name.trim() && !names && latinLetters(name).length < 2, year, py: personalYear(date, year)! });
  }

  const row = (k: CoreKey, n: NumKey | null) =>
    n ? (
      <li key={k} className="grid grid-cols-[3.5rem_1fr] gap-4 rounded-2xl bg-ivory p-4 text-ink">
        <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full bg-plum font-display text-2xl text-ivory">{n}</span>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-plum-soft">{core[k].label}</p>
          <p lang={rlang} className="font-display text-xl text-plum"><span className="sr-only">{n} · </span>{numbers[n].title}</p>
          <p lang={rlang} className="mt-1 text-sm text-ink/75">{core[k].text}</p>
          <Link href={`/numerology/${numSlug(n)}`} className="mt-1 inline-block text-sm text-plum link-underline">{t("Read number {n}", { n })}</Link>
        </div>
      </li>
    ) : null;

  return (
    <div className="card p-6 sm:p-8">
      <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="nm-date" className="field-label">{t("Your date of birth")}</label>
          <input id="nm-date" type="date" className="input" min="1800-01-01" max="2100-12-31" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "nm-err" : undefined} />
        </div>
        <div>
          <label htmlFor="nm-name" className="field-label">{t("Full birth name (optional)")}</label>
          <input id="nm-name" type="text" className="input" autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn-primary">{t("Find my numbers")}</button>
      </form>
      {error && <p id="nm-err" role="alert" className="field-error mt-2">{error}</p>}
      <div aria-live="polite">
        {r && (
          <div className="mt-6 rounded-2xl bg-plum-deep p-6 text-ivory sm:p-8">
            <p className="eyebrow text-blush">{core.lifePath.label}</p>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-4 font-display text-ivory">
              <span className="text-6xl">{r.lp}</span>
              <span lang={rlang} className="text-3xl">{numbers[r.lp].title}</span>
            </p>
            <p lang={rlang} className="mt-3 text-ivory/85">{numbers[r.lp].summary}</p>
            <Link href={`/numerology/${numSlug(r.lp)}`} className="btn-primary mt-5 inline-flex bg-ivory text-plum hover:bg-blush">{t("Read your life path")}</Link>
            <ul className="mt-6 grid gap-3">
              {row("birthday", r.bd)}
              {r.names && [row("expression", r.names.expression), row("soul", r.names.soul), row("personality", r.names.personality)]}
            </ul>
            {r.nameIgnored && <p className="mt-3 rounded-xl bg-ivory/10 px-4 py-3 text-sm">{t("Name numbers use the Latin alphabet. Write your name in Latin letters to see them.")}</p>}
            <div className="mt-6 rounded-2xl bg-ivory/10 p-5">
              <p className="eyebrow text-blush">{t("Your personal year {year}", { year: r.year })}</p>
              <p className="mt-1 font-display text-3xl">{r.py}</p>
              <p lang={rlang} className="mt-2 text-ivory/85">{years[r.py]}</p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-muted">{t("Use the full name on your birth certificate. Your name and date stay in your browser and are never stored.")}</p>
    </div>
  );
}
