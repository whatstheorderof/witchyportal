"use client";

import { useEffect, useRef, useState } from "react";
import Link, { useI18n } from "@/i18n/client";
import { msg } from "@/i18n/config";
import { PlaceCombobox, type Place } from "@/components/birth-chart/BirthChart";
import { NewsletterForm } from "@/components/forms";
import type { SynAspect, SynOverlay, SynastryReport } from "@/lib/astro/compat";

type Person = { name: string; date: string; time: string; unknown: boolean; place: Place | null };
type Response = {
  preview: Pick<SynastryReport, "names" | "scores" | "overall" | "bigThree" | "notes"> & { highlights: SynAspect[]; locked: { aspects: { heading: string; type: string }[]; overlays: number } };
  full: SynastryReport | null;
  price: { label: string };
  purchasing: boolean;
  purchased: boolean;
  adminPreview: boolean;
};
type Saved = { a: Person; b: Person };
const PENDING_KEY = "witchy:synastry-pending";
const PAID_KEY = "witchy:synastry-paid";
const load = <T,>(k: string, fallback: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; } };
const store = (k: string, v: unknown) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } };
const sameInputs = (x: Saved, y: Saved) => (["a", "b"] as const).every((k) => x[k].date === y[k].date && x[k].time === y[k].time && x[k].place?.id === y[k].place?.id);
const blank = (): Person => ({ name: "", date: "", time: "", unknown: false, place: null });
const AREA_LABEL = { love: msg("Love"), communication: msg("Communication"), passion: msg("Passion"), stability: msg("Stability"), growth: msg("Growth") } as const;

function AspectBlock({ a }: { a: SynAspect }) {
  const { t, rlang } = useI18n();
  return (
    <div className="rounded-2xl bg-ivory-deep/60 p-5">
      <p className="flex flex-wrap items-baseline gap-x-3"><span className="font-display text-xl text-plum">{a.heading}</span><span className="text-xs text-muted">{t("strength {n}%", { n: a.strength })}</span></p>
      <div lang={rlang} className="mt-2 grid gap-2 leading-relaxed text-ink/85">{a.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
    </div>
  );
}
function OverlayBlock({ o }: { o: SynOverlay }) {
  const { rlang } = useI18n();
  return (
    <div className="rounded-2xl bg-ivory-deep/60 p-5">
      <p className="font-display text-xl text-plum">{o.heading}</p>
      <div lang={rlang} className="mt-2 grid gap-2 leading-relaxed text-ink/85">{o.paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
    </div>
  );
}

export function SynastryTool() {
  const { t, api } = useI18n();
  const [people, setPeople] = useState<{ a: Person; b: Person }>({ a: blank(), b: blank() });
  const [res, setRes] = useState<Response | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [buying, setBuying] = useState(false);
  const [mail, setMail] = useState<{ state: "idle" | "busy" | "done" | "error"; text?: string }>({ state: "idle" });
  const [notice, setNotice] = useState("");
  const [paidList, setPaidList] = useState<Saved[]>([]);
  const out = useRef<HTMLDivElement>(null);
  const set = (k: "a" | "b", patch: Partial<Person>) => setPeople((p) => ({ ...p, [k]: { ...p[k], ...patch } }));
  const bodyOf = (pp: Saved, extra: Record<string, unknown> = {}) => ({ ...Object.fromEntries((["a", "b"] as const).map((k) => [k, { name: pp[k].name, date: pp[k].date, time: pp[k].unknown ? null : pp[k].time, placeId: pp[k].place!.id }])), ...extra });

  async function run(pp: Saved, extra: Record<string, unknown> = {}) {
    setBusy(true); setError(""); setMail({ state: "idle" });
    try {
      const r = await fetch(api("/api/synastry"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyOf(pp, extra)) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setRes(d);
      if (d.purchased) {
        // Keep purchased reports on this device so they can be reopened
        const list = load<Saved[]>(PAID_KEY, []).filter((x) => !sameInputs(x, pp));
        const next = [pp, ...list].slice(0, 10);
        store(PAID_KEY, next); setPaidList(next);
      }
      setTimeout(() => out.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      return d as Response;
    } catch (err) { setError(err instanceof Error ? err.message : t("Something went wrong")); return null; } finally { setBusy(false); }
  }

  // Coming back from Stripe (?paid=cs_…) or a cancelled payment (?cancelled=1)
  useEffect(() => {
    const timer = setTimeout(() => {
    const q = new URLSearchParams(window.location.search);
    const paid = q.get("paid"), cancelled = q.get("cancelled");
    const pending = load<Saved | null>(PENDING_KEY, null);
    setPaidList(load<Saved[]>(PAID_KEY, []));
    if ((paid || cancelled) && pending) {
      setPeople(pending);
      window.history.replaceState(null, "", window.location.pathname);
      if (cancelled) setNotice(t("Payment cancelled — nothing has been charged. Your free preview is below."));
      void run(pending, paid ? { session: paid } : {}).then((d) => {
        if (paid && d && !d.purchased) setNotice(t("We're still waiting for Stripe to confirm your payment. Give it a minute, then press “Compare our charts” again — you won't be charged twice."));
        if (paid && d?.purchased) { store(PENDING_KEY, null); setNotice(t("Thank you — your full report is unlocked. It's saved on this device: enter the same details again any time to reopen it.")); }
      });
    }
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    for (const k of ["a", "b"] as const) {
      const p = people[k];
      if (!p.date || (!p.unknown && !p.time) || !p.place) { setError(t(k === "a" ? "Please complete the birth date, time (or tick “unknown”) and place for the first person." : "Please complete the birth date, time (or tick “unknown”) and place for the second person.")); return; }
    }
    setNotice("");
    await run(people);
  }

  async function buy() {
    setBuying(true); setError("");
    try {
      store(PENDING_KEY, people); // the details stay in this browser, so the report can be shown after payment
      const r = await fetch(api("/api/synastry/checkout"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyOf(people)) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.alreadyPaid) { await run(people); return; }
      window.location.assign(d.url);
    } catch (err) { setError(err instanceof Error ? err.message : t("Something went wrong")); setBuying(false); }
  }

  async function emailCopy() {
    setMail({ state: "busy" });
    try {
      const r = await fetch(api("/api/synastry/email"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bodyOf(people)) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMail({ state: "done", text: t("Sent to {to}.", { to: d.to }) });
    } catch (err) { setMail({ state: "error", text: err instanceof Error ? err.message : t("Couldn't send") }); }
  }

  const personFields = (k: "a" | "b", label: string) => {
    const p = people[k];
    return (
      <fieldset className="grid content-start gap-4">
        <legend className="font-display text-2xl text-plum">{label}</legend>
        <div><label htmlFor={`sy-${k}-name`} className="field-label">{t("Name")} <span className="font-normal text-muted">({t("optional")})</span></label><input id={`sy-${k}-name`} className="input" maxLength={30} value={p.name} onChange={(e) => set(k, { name: e.target.value })} /></div>
        <div><label htmlFor={`sy-${k}-date`} className="field-label">{t("Date of birth")}</label><input id={`sy-${k}-date`} type="date" min="1800-01-01" max="2100-12-31" className="input" value={p.date} onChange={(e) => set(k, { date: e.target.value })} /></div>
        <div>
          <label htmlFor={`sy-${k}-time`} className="field-label">{t("Time of birth")}</label>
          <input id={`sy-${k}-time`} type="time" className="input" disabled={p.unknown} value={p.time} onChange={(e) => set(k, { time: e.target.value })} />
          <label className="mt-2 flex items-center gap-3 text-[0.95rem]"><input type="checkbox" className="h-5 w-5 accent-plum" checked={p.unknown} onChange={(e) => set(k, { unknown: e.target.checked, time: "" })} />{t("Time unknown")}</label>
        </div>
        <PlaceCombobox value={p.place} onChange={(pl) => set(k, { place: pl })} />
      </fieldset>
    );
  };

  const view = res?.full;
  const pv = res?.preview;
  return (
    <div className="grid gap-12">
      {paidList.length > 0 && (
        <section aria-labelledby="mine-h" className="rounded-2xl bg-blush/40 p-5">
          <h2 id="mine-h" className="font-medium text-plum">{t("Your reports on this device")}</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {paidList.map((p, i) => <li key={i}><button type="button" className="chip min-h-9" onClick={() => { setPeople(p); void run(p); }}>{p.a.name || t("Person one")} &amp; {p.b.name || t("Person two")}</button></li>)}
          </ul>
          <button type="button" className="mt-3 text-sm link-underline" onClick={() => { store(PAID_KEY, null); setPaidList([]); }}>{t("Forget these on this device")}</button>
        </section>
      )}
      {notice && <p role="status" className="rounded-2xl bg-lavender/40 p-4 text-plum">{notice}</p>}
      <form onSubmit={submit} noValidate className="card grid gap-8 p-6 sm:p-10">
        <div className="grid gap-10 md:grid-cols-2">{personFields("a", t("You"))}{personFields("b", t("Them"))}</div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="btn-primary" disabled={busy}>{busy ? t("Comparing your charts…") : t("Compare our charts")}</button>
          <p className="text-sm text-muted">{t("Free preview. Birth details are used once and never stored.")}</p>
        </div>
        {error && <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-danger">{error}</p>}
      </form>

      {res && pv && (
        <div ref={out} aria-live="polite" className="grid scroll-mt-28 gap-10">
          {view && res.purchased && (
            <div className="flex flex-col gap-3 rounded-2xl bg-ivory p-4 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between print:hidden">
              <p className="text-sm text-ink/80">{t("Your full report. It’s saved on this device — enter the same details any time to reopen it.")}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-outline min-h-10 text-sm" onClick={() => window.print()}>{t("Print or save as PDF")}</button>
                <button type="button" className="btn-outline min-h-10 text-sm" disabled={mail.state === "busy" || mail.state === "done"} onClick={emailCopy}>{mail.state === "busy" ? t("Sending…") : t("Email me a copy")}</button>
              </div>
              {mail.text && <p role="status" className={`text-sm ${mail.state === "error" ? "text-danger" : "text-plum"}`}>{mail.text}</p>}
            </div>
          )}
          {res.adminPreview && <p className="rounded-2xl border-2 border-dashed border-warning bg-warning/10 p-4 text-sm text-warning">{t("Admin preview: you’re signed in, so the full paid report is shown. Visitors see the free preview until payment is switched on.")}</p>}
          <section className="rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10" aria-labelledby="syn-h">
            <p className="eyebrow text-blush">{t("Birth chart compatibility")}</p>
            <h2 id="syn-h" className="mt-2 font-display text-3xl text-ivory sm:text-4xl">{pv.names.a} &amp; {pv.names.b}</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="grid h-36 w-36 place-items-center rounded-full border-4 border-blush/70 text-center"><span><span className="block font-display text-5xl leading-none">{pv.overall}</span><span className="text-sm text-ivory/75">{t("out of 100")}</span></span></div>
              <ul className="grid gap-4">
                {pv.scores.map((s) => (
                  <li key={s.area}>
                    <div className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3 text-sm">
                      <span>{t(AREA_LABEL[s.area])}</span>
                      <span className="h-2.5 overflow-hidden rounded-full bg-ivory/15" aria-hidden><span className="block h-full rounded-full bg-blush" style={{ width: `${s.score}%` }} /></span>
                      <span className="text-end tabular-nums" aria-label={t("{area}: {n} out of 100", { area: t(AREA_LABEL[s.area]), n: s.score })}>{s.score}</span>
                    </div>
                    <p className="mt-1 text-sm text-ivory/75">{s.note}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {(["a", "b"] as const).map((k) => {
                const b = pv.bigThree[k];
                return <p key={k} className="rounded-2xl bg-ivory/10 p-4 text-sm"><span className="font-medium">{pv.names[k]}:</span> {t(b.asc ? "Sun in {sun}, Moon in {moon}, Venus in {venus}, {asc} rising" : "Sun in {sun}, Moon in {moon}, Venus in {venus}", { sun: t(b.sun), moon: t(b.moon), venus: t(b.venus), asc: b.asc ? t(b.asc) : "" })}</p>;
              })}
            </div>
          </section>

          <section aria-labelledby="hl-h">
            <h2 id="hl-h" className="display-md">{view ? t("Every connection between you") : t("Your three strongest connections")}</h2>
            <div className="mt-6 grid gap-4">{(view ? view.aspects : pv.highlights).map((a) => <AspectBlock key={a.heading} a={a} />)}</div>
          </section>

          {view ? (
            view.overlays.length > 0 && (
              <section aria-labelledby="ov-h">
                <h2 id="ov-h" className="display-md">{t("Where you light up each other’s lives")}</h2>
                <p className="mt-2 text-ink/80">{t("Each person’s planets fall into areas (houses) of the other’s chart.")}</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">{view.overlays.map((o) => <OverlayBlock key={o.heading} o={o} />)}</div>
              </section>
            )
          ) : (
            <section aria-labelledby="lock-h" className="overflow-hidden rounded-[2rem] ring-1 ring-line">
              <div className="bg-white/70 p-6 sm:p-10">
                <p className="eyebrow">{t("Full report · {price}", { price: res.price.label })}</p>
                <h2 id="lock-h" className="mt-2 font-display text-3xl text-plum">{t("There’s much more in your charts")}</h2>
                <p className="mt-2 text-ink/80">{pv.locked.overlays ? t("The full report reads all {n} connections between your charts and {m} house overlays — where each of you lights up the other's life, in Yulia’s words.", { n: pv.locked.aspects.length + pv.highlights.length, m: pv.locked.overlays }) : t("The full report reads all {n} connections between your charts, in Yulia’s words.", { n: pv.locked.aspects.length + pv.highlights.length })}</p>
                <ul className="mt-5 grid gap-1.5 text-[0.95rem] text-ink/70 sm:grid-cols-2" aria-label={t("Also in the full report")}>
                  {pv.locked.aspects.slice(0, 12).map((a) => <li key={a.heading} className="flex gap-2"><span aria-hidden className="text-plum">✦</span>{a.heading}</li>)}
                  {pv.locked.aspects.length > 12 && <li className="text-muted">{t("…and {n} more", { n: pv.locked.aspects.length - 12 })}</li>}
                </ul>
              </div>
              {res.purchasing ? (
              <div className="bg-plum-deep p-6 text-ivory sm:p-10">
                <p className="font-display text-2xl">{t("Unlock your full report")}</p>
                <p className="mt-2 text-ivory/80">{t("Every connection between your charts and where you light up each other’s lives, in Yulia’s words — {price}, paid securely with Stripe. You can print it, save it as a PDF or have a copy emailed to you.", { price: res.price.label })}</p>
                <button type="button" onClick={buy} disabled={buying} className="btn-primary mt-5 bg-ivory text-plum hover:bg-blush">{buying ? t("Opening secure payment…") : t("Unlock the full report — {price}", { price: res.price.label })}</button>
                <p className="mt-3 text-xs text-ivory/65">{t("We don’t store your birth details: they stay in this browser, and we keep only a one-way code to recognise your purchase.")}</p>
              </div>
              ) : (
              <div className="bg-plum-deep p-6 text-ivory sm:p-10">
                <p className="font-display text-2xl">{t("The full report is launching soon")}</p>
                <p className="mt-2 text-ivory/80">{t("Leave your email and we’ll tell you the moment it’s available. Or, for a personal reading of your two charts,")} <Link href="/contact" className="underline">{t("ask Yulia directly")}</Link>.</p>
                <div className="mt-5 max-w-xl"><NewsletterForm source="synastry-report" dark /></div>
              </div>
              )}
            </section>
          )}
          {pv.notes.length > 0 && <p className="text-sm text-muted">{pv.notes.join(" ")}</p>}
        </div>
      )}
    </div>
  );
}
