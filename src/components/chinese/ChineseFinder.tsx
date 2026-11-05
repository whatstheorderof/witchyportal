"use client";

import { useState } from "react";
import Link, { useI18n } from "@/i18n/client";
import { animalSlug, chineseYearFor, type CElement } from "@/lib/astro/chinese-rules";

const longDate = (d: string, intl: string) => new Intl.DateTimeFormat(intl, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

/** Find your Chinese zodiac animal and element from your birth date. */
export function ChineseFinder({ lny, elements }: { lny: Record<number, string>; elements: Record<CElement, string> }) {
  const { t, intl, rlang } = useI18n();
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [r, setR] = useState<ReturnType<typeof chineseYearFor>>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { setError(t("Please enter your date of birth")); setR(null); return; }
    const res = chineseYearFor(date, lny);
    if (!res) { setError(t("Please enter a date between 1901 and 2100.")); setR(null); return; }
    setError("");
    setR(res);
  }

  return (
    <div className="card p-6 sm:p-8">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="cz-date" className="field-label">{t("Your date of birth")}</label>
          <input id="cz-date" type="date" className="input" min="1901-01-01" max="2100-12-31" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "cz-err" : undefined} />
        </div>
        <button className="btn-primary">{t("Find my animal")}</button>
      </form>
      {error && <p id="cz-err" role="alert" className="field-error mt-2">{error}</p>}
      <div aria-live="polite">
        {r && (
          <div className="mt-6 rounded-2xl bg-plum-deep p-6 text-ivory">
            <p className="eyebrow text-blush">{t("Your Chinese zodiac sign")}</p>
            <p className="mt-2 font-display text-4xl text-ivory">{t("{element} {animal}", { element: t(r.element), animal: t(r.animal) })}</p>
            <p className="mt-2 text-ivory/85">{t("You were born in the {yinyang} {name} year, which began on {date}.", { yinyang: t(r.yinYang).toLowerCase(), name: t("{element} {animal}", { element: t(r.element), animal: t(r.animal) }), date: r.newYear ? longDate(r.newYear, intl) : t("Lunar New Year") })}</p>
            {r.nearNewYear && <p className="mt-2 rounded-xl bg-ivory/10 px-4 py-3 text-sm">{t("You were born within a day of Lunar New Year. The new year begins at midnight in China, so depending on your birth time and place you may belong to the year next door — read both animals and see which feels like you.")}</p>}
            <p lang={rlang} className="mt-4 text-ivory/90">{elements[r.element]}</p>
            <Link href={`/chinese-zodiac/${animalSlug(r.animal)}`} className="btn-primary mt-5 inline-flex bg-ivory text-plum hover:bg-blush">{t("Read about the {animal}", { animal: t(r.animal) })}</Link>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-muted">{t("The Chinese year starts at Lunar New Year (late January to mid February), not on 1 January — so if you were born early in the year, your animal may be the previous one. Your date stays in your browser.")}</p>
    </div>
  );
}
