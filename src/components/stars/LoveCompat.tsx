"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import type { Sign } from "@/lib/astro/types";

type Result = {
  a: { venus: Sign; possible: Sign[] | null; sun: Sign };
  b: { venus: Sign; possible: Sign[] | null; sun: Sign };
  venus: { a: Sign; b: Sign; text: string[]; styleA: string; styleB: string };
  sun: { a: Sign; b: Sign; scores: { overall: number }; text: { summary: string[] } };
};

export function LoveCompat() {
  const [names, setNames] = useState({ a: "", b: "" });
  const [dates, setDates] = useState({ a: "", b: "" });
  const [res, setRes] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const out = useRef<HTMLDivElement>(null);
  const nA = names.a.trim() || "You", nB = names.b.trim() || "Them";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dates.a || !dates.b) { setError("Please enter both birth dates."); return; }
    setBusy(true); setError("");
    try {
      const r = await fetch("/api/love", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dates) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setRes(d);
      setTimeout(() => out.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); } finally { setBusy(false); }
  }

  const person = (k: "a" | "b", label: string) => (
    <fieldset className="grid gap-3">
      <legend className="font-display text-xl text-plum">{label}</legend>
      <div><label htmlFor={`lc-${k}-name`} className="field-label">Name <span className="font-normal text-muted">(optional)</span></label><input id={`lc-${k}-name`} className="input" maxLength={30} value={names[k]} onChange={(e) => setNames({ ...names, [k]: e.target.value })} /></div>
      <div><label htmlFor={`lc-${k}-date`} className="field-label">Date of birth</label><input id={`lc-${k}-date`} type="date" min="1800-01-01" max="2100-12-31" className="input" required value={dates[k]} onChange={(e) => setDates({ ...dates, [k]: e.target.value })} /></div>
    </fieldset>
  );

  return (
    <div className="grid gap-12">
      <form onSubmit={submit} className="card grid gap-6 p-6 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2">{person("a", "You")}{person("b", "Them")}</div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="btn-primary" disabled={busy}>{busy ? "Reading your love signs…" : "Compare our love signs"}</button>
          <p className="text-sm text-muted">Only dates are needed. Nothing is stored.</p>
        </div>
        {error && <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-danger">{error}</p>}
      </form>

      {res && (
        <div ref={out} aria-live="polite" className="grid scroll-mt-28 gap-8">
          <div className="rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10">
            <p className="eyebrow text-blush">Your love signs</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Venus in {res.venus.a} {res.venus.a === res.venus.b ? "twice" : `& Venus in ${res.venus.b}`}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(["a", "b"] as const).map((k) => (
                <div key={k} className="rounded-2xl bg-ivory/10 p-5">
                  <p className="font-display text-2xl"><span aria-hidden className="mr-2">♀︎</span>{k === "a" ? nA : nB}: Venus in {res[k].venus}</p>
                  <p className="text-sm text-ivory/70">Sun in {res[k].sun}{res[k].possible ? ` · Venus changed sign that day (${res[k].possible!.join(" or ")})` : ""}</p>
                  <p className="mt-3 text-ivory/90">{k === "a" ? res.venus.styleA : res.venus.styleB}</p>
                </div>
              ))}
            </div>
          </div>
          <section className="card p-6 sm:p-10">
            <h2 className="font-display text-3xl text-plum">How your love styles meet</h2>
            <div className="mt-4 grid gap-3 leading-relaxed text-ink/85">{res.venus.text.map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>
          <section className="card p-6 sm:p-10">
            <p className="eyebrow">Your Sun signs</p>
            <h2 className="mt-1 font-display text-2xl text-plum">{res.sun.a} &amp; {res.sun.b}: {res.sun.scores.overall}/10</h2>
            <p className="mt-2 text-ink/85">{res.sun.text.summary.join(" ")}</p>
            <Link href={`/compatibility/${res.sun.a.toLowerCase()}-and-${res.sun.b.toLowerCase()}`} className="mt-4 inline-block link-underline text-plum">Read the full {res.sun.a} and {res.sun.b} reading</Link>
          </section>
          <Link href="/compatibility/birth-chart" className="rounded-[2rem] bg-blush/60 p-6 sm:p-8">
            <p className="font-display text-2xl text-plum">Want the whole story? <span className="underline">Compare your full birth charts</span></p>
            <p className="mt-1 text-ink/80">Moon, Mars, rising signs and every connection between {nA} and {nB}.</p>
          </Link>
          <p className="text-xs text-muted"><span aria-hidden>{SIGN_INFO[res.venus.a].glyph} {SIGN_INFO[res.venus.b].glyph}</span> Venus signs calculated for midday UK time on each birth date.</p>
        </div>
      )}
    </div>
  );
}
