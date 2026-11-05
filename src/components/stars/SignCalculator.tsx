"use client";

import { useRef, useState } from "react";
import Link, { useI18n } from "@/i18n/client";
import { PlaceCombobox, type Place } from "@/components/birth-chart/BirthChart";
import { CALCS, type CalcKind, type CalcResult } from "@/lib/astro/calc-meta";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import type { Sign } from "@/lib/astro/types";
import { msg } from "@/i18n/config";

const ORDINAL = [msg("Your first Saturn return · around age {age}"), msg("Your second Saturn return · around age {age}"), msg("Your third Saturn return · around age {age}"), msg("Your fourth Saturn return · around age {age}")];

/** A small birth-details form that answers one question: "what is my … sign?" */
export function SignCalculator({ kind }: { kind: CalcKind }) {
  const meta = CALCS[kind];
  const { t, api, intl } = useI18n();
  const title = t(meta.title), lower = intl.startsWith("de") ? title : title.toLowerCase();
  const longDate = (d: string) => new Intl.DateTimeFormat(intl, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<CalcResult | null>(null);
  const out = useRef<HTMLDivElement>(null);
  const timeRequired = meta.time === "required";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!date) errs.date = t("Please enter your date of birth");
    if (timeRequired && !time) errs.time = t("This needs your birth time — as exact as you can find it");
    if (!timeRequired && !unknownTime && !time && meta.time === "helpful") errs.time = t("Enter your birth time, or tick “I don't know my birth time”");
    if (!place) errs.place = t("Please choose your birthplace from the list");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    try {
      const res = await fetch(api("/api/calc"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, date, time: unknownTime || !time ? null : time, placeId: place!.id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("Something went wrong"));
      setResult(data.result);
      setStatus("done");
      setTimeout(() => { document.getElementById(`calc-result-${kind}`)?.focus(); out.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : t("Something went wrong"));
    }
  }

  const id = (s: string) => `${kind}-${s}`;
  return (
    <div className="grid min-w-0 gap-10">
      <form onSubmit={submit} noValidate className="card grid gap-6 p-6 sm:p-8" aria-describedby={id("privacy")}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={id("date")} className="field-label">{t("Date of birth")} <span aria-hidden className="text-blush-deep">*</span></label>
            <input id={id("date")} type="date" className="input" min="1800-01-01" max="2100-12-31" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={errors.date ? true : undefined} aria-describedby={errors.date ? id("date-err") : undefined} />
            {errors.date && <p id={id("date-err")} className="field-error">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor={id("time")} className="field-label">{t("Time of birth")} {timeRequired ? <span aria-hidden className="text-blush-deep">*</span> : <span className="font-normal text-muted">({meta.time === "helpful" ? t("helps accuracy") : t("optional")})</span>}</label>
            <input id={id("time")} type="time" className="input" value={time} disabled={unknownTime} onChange={(e) => setTime(e.target.value)} aria-invalid={errors.time ? true : undefined} aria-describedby={`${id("time-hint")}${errors.time ? ` ${id("time-err")}` : ""}`} />
            <p id={id("time-hint")} className="field-hint">{t("Local clock time, as on your birth certificate.")}</p>
            {errors.time && <p id={id("time-err")} className="field-error">{errors.time}</p>}
            {meta.time === "helpful" && (
              <label className="mt-3 flex items-center gap-3 text-[0.95rem]">
                <input type="checkbox" className="h-5 w-5 accent-plum" checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTime(""); }} />
                {t("I don’t know my birth time")}
              </label>
            )}
          </div>
        </div>
        <PlaceCombobox value={place} onChange={setPlace} error={errors.place} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button className="btn-primary" disabled={status === "loading"}>{status === "loading" ? t("Reading the sky…") : t("Find my {title}", { title: lower })}</button>
          <p id={id("privacy")} className="text-sm text-muted">{t("Your birth details are used only for this calculation and are never stored.")}</p>
        </div>
        <div aria-live="polite">{status === "error" && <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-danger">{message}</p>}</div>
      </form>

      {result && status === "done" && (
        <div ref={out} className="grid scroll-mt-28 gap-6">
          <h2 id={`calc-result-${kind}`} tabIndex={-1} className="font-display text-3xl text-plum outline-none">{t("Your {title}", { title: lower })}</h2>
          <div className={`grid gap-6 ${result.cards.length > 1 ? "md:grid-cols-3" : ""}`}>
            {result.cards.map((c) => (
              <section key={c.label} className="card p-6 sm:p-8">
                <p className="eyebrow">{c.label}</p>
                <p className="mt-2 font-display text-4xl text-plum">
                  {c.sign ? <><span aria-hidden className="me-2">{SIGN_INFO[c.sign as Sign].glyph}</span>{t(c.sign)}</> : c.possibleSigns ? c.possibleSigns.map((x) => t(x)).join(t(" or ")) : t("Unknown")}
                </p>
                {c.sign && c.degree != null && <p className="mt-1 text-sm text-muted">{Math.floor(c.degree)}° {t(c.sign)}</p>}
                <p className="mt-4 text-lg leading-relaxed text-ink/90">{c.short}</p>
                {c.paragraphs.length > 0 && <div className="mt-4 grid gap-3 leading-relaxed text-ink/85">{c.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>}
                {c.note && <p className="mt-4 rounded-xl bg-lavender/40 px-4 py-3 text-sm text-plum">{c.note}</p>}
                {c.sign && <Link href={`/zodiac/${c.sign.toLowerCase()}`} className="mt-4 inline-block text-sm link-underline">{t("More about {sign}", { sign: t(c.sign) })}</Link>}
              </section>
            ))}
          </div>
          {result.returns && (
            <section className="card p-6 sm:p-8" aria-labelledby={id("returns")}>
              <h3 id={id("returns")} className="font-display text-2xl text-plum">{t("Your Saturn returns")}</h3>
              <ol className="mt-4 grid gap-4">
                {result.returns.map((r) => (
                  <li key={r.n} className={`rounded-2xl p-4 ${r.status === "now" ? "bg-blush/50" : "bg-ivory ring-1 ring-line"}`}>
                    <p className="font-medium text-plum">{t(ORDINAL[r.n - 1] ?? ORDINAL[3], { age: r.age })}{r.status === "now" ? t(" · happening now") : r.status === "past" ? t(" · behind you") : ""}</p>
                    <p className="mt-1 text-[0.95rem]">{t(r.hits.length > 1 ? "Exact {n} times: {dates}." : "Exact once: {dates}.", { n: r.hits.length, dates: r.hits.map(longDate).join(", ") })}</p>
                    <p className="mt-1 text-sm text-muted">{t("Saturn is within 3° of where it was when you were born from {from} to {to}.", { from: longDate(r.from), to: longDate(r.to) })}</p>
                  </li>
                ))}
              </ol>
              {result.returnText && <div className="mt-6 grid gap-3 leading-relaxed text-ink/85">{result.returnText.map((p, i) => <p key={i}>{p}</p>)}</div>}
            </section>
          )}
          {result.notes.map((n) => <p key={n} className="text-sm text-muted">{n}</p>)}
          <p className="rounded-2xl bg-plum-deep p-6 text-ivory">
            {t("Want the whole picture?")} <Link href="/birth-chart" className="link-underline text-ivory">{t("Get your free full birth chart")}</Link> {t("— every planet, house and aspect, written in Yulia’s words.")}
          </p>
        </div>
      )}
    </div>
  );
}
