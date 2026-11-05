"use client";

import { useRef, useState } from "react";
import Link, { useI18n } from "@/i18n/client";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import type { Sign } from "@/lib/astro/types";

type Result = {
  a: { venus: Sign; possible: Sign[] | null; sun: Sign };
  b: { venus: Sign; possible: Sign[] | null; sun: Sign };
  venus: { a: Sign; b: Sign; text: string[]; styleA: string; styleB: string };
  sun: { a: Sign; b: Sign; scores: { overall: number }; text: { summary: string[] } };
};

export function LoveCompat() {
  const { t, api } = useI18n();
  const [names, setNames] = useState({ a: "", b: "" });
  const [dates, setDates] = useState({ a: "", b: "" });
  const [res, setRes] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const out = useRef<HTMLDivElement>(null);
  const nA = names.a.trim() || t("You"), nB = names.b.trim() || t("Them");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dates.a || !dates.b) { setError(t("Please enter both birth dates.")); return; }
    setBusy(true); setError("");
    try {
      const r = await fetch(api("/api/love"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dates) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setRes(d);
      setTimeout(() => out.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (err) { setError(err instanceof Error ? err.message : t("Something went wrong")); } finally { setBusy(false); }
  }

  const person = (k: "a" | "b", label: string) => (
    <fieldset className="grid gap-3">
      <legend className="font-display text-xl text-plum">{label}</legend>
      <div><label htmlFor={`lc-${k}-name`} className="field-label">{t("Name")} <span className="font-normal text-muted">({t("optional")})</span></label><input id={`lc-${k}-name`} className="input" maxLength={30} value={names[k]} onChange={(e) => setNames({ ...names, [k]: e.target.value })} /></div>
      <div><label htmlFor={`lc-${k}-date`} className="field-label">{t("Date of birth")}</label><input id={`lc-${k}-date`} type="date" min="1800-01-01" max="2100-12-31" className="input" required value={dates[k]} onChange={(e) => setDates({ ...dates, [k]: e.target.value })} /></div>
    </fieldset>
  );

  return (
    <div className="grid gap-12">
      <form onSubmit={submit} className="card grid gap-6 p-6 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2">{person("a", t("You"))}{person("b", t("Them"))}</div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="btn-primary" disabled={busy}>{busy ? t("Reading your love signs…") : t("Compare our love signs")}</button>
          <p className="text-sm text-muted">{t("Only dates are needed. Nothing is stored.")}</p>
        </div>
        {error && <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-danger">{error}</p>}
      </form>

      {res && (
        <div ref={out} aria-live="polite" className="grid scroll-mt-28 gap-8">
          <div className="rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10">
            <p className="eyebrow text-blush">{t("Your love signs")}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">{res.venus.a === res.venus.b ? t("Venus in {sign} twice", { sign: t(res.venus.a) }) : t("Venus in {a} & Venus in {b}", { a: t(res.venus.a), b: t(res.venus.b) })}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(["a", "b"] as const).map((k) => (
                <div key={k} className="rounded-2xl bg-ivory/10 p-5">
                  <p className="font-display text-2xl"><span aria-hidden className="me-2">♀︎</span>{t("{name}: Venus in {sign}", { name: k === "a" ? nA : nB, sign: t(res[k].venus) })}</p>
                  <p className="text-sm text-ivory/70">{t("Sun in {sign}", { sign: t(res[k].sun) })}{res[k].possible ? t(" · Venus changed sign that day ({signs})", { signs: res[k].possible!.map((x) => t(x)).join(t(" or ")) }) : ""}</p>
                  <p className="mt-3 text-ivory/90">{k === "a" ? res.venus.styleA : res.venus.styleB}</p>
                </div>
              ))}
            </div>
          </div>
          <section className="card p-6 sm:p-10">
            <h2 className="font-display text-3xl text-plum">{t("How your love styles meet")}</h2>
            <div className="mt-4 grid gap-3 leading-relaxed text-ink/85">{res.venus.text.map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>
          <section className="card p-6 sm:p-10">
            <p className="eyebrow">{t("Your Sun signs")}</p>
            <h2 className="mt-1 font-display text-2xl text-plum">{t(res.sun.a)} &amp; {t(res.sun.b)}: {res.sun.scores.overall}/10</h2>
            <p className="mt-2 text-ink/85">{res.sun.text.summary.join(" ")}</p>
            <Link href={`/compatibility/${res.sun.a.toLowerCase()}-and-${res.sun.b.toLowerCase()}`} className="mt-4 inline-block link-underline text-plum">{t("Read the full {a} and {b} reading", { a: t(res.sun.a), b: t(res.sun.b) })}</Link>
          </section>
          <Link href="/compatibility/birth-chart" className="rounded-[2rem] bg-blush/60 p-6 sm:p-8">
            <p className="font-display text-2xl text-plum">{t("Want the whole story?")} <span className="underline">{t("Compare your full birth charts")}</span></p>
            <p className="mt-1 text-ink/80">{t("Moon, Mars, rising signs and every connection between {a} and {b}.", { a: nA, b: nB })}</p>
          </Link>
          <p className="text-xs text-muted"><span aria-hidden>{SIGN_INFO[res.venus.a].glyph} {SIGN_INFO[res.venus.b].glyph}</span> {t("Venus signs calculated for midday UK time on each birth date.")}</p>
        </div>
      )}
    </div>
  );
}
