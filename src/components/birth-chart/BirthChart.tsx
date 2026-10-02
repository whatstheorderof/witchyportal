"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChartResult } from "@/lib/astro/types";
import { formatDegree } from "@/lib/astro/types";
import { ASPECT_INFO, BIG_THREE, BODY_INFO, HOUSE_MEANING, SIGN_INFO } from "@/lib/astro/interpretations";
import { ChartWheel } from "./ChartWheel";

interface Place {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

function PlaceCombobox({ value, onChange, error }: { value: Place | null; onChange: (p: Place | null) => void; error?: string }) {
  const id = useId();
  const [query, setQuery] = useState(value?.label ?? "");
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (value && query === value.label) return;
    clearTimeout(timer.current);
    if (query.trim().length < 2) return;
    timer.current = setTimeout(async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!res.ok) throw new Error();
        setResults(data.places);
        setOpen(true);
        setActive(data.places.length ? 0 : -1);
      } catch {
        setFailed(true);
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(timer.current);
  }, [query, value]);

  function choose(p: Place) {
    onChange(p);
    setQuery(p.label);
    setOpen(false);
  }

  const listId = `${id}-list`;
  return (
    <div className="relative">
      <label htmlFor={id} className="field-label">Place of birth <span aria-hidden className="text-blush-deep">*</span></label>
      <input
        id={id}
        className="input"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${id}-opt-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-hint${error ? ` ${id}-err` : ""}`}
        autoComplete="off"
        placeholder="Start typing a town or city"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(null);
          if (e.target.value.trim().length < 2) { setResults([]); setOpen(false); }
        }}
        onFocus={() => results.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, results.length - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter" && open && active >= 0 && results[active]) { e.preventDefault(); choose(results[active]); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      <p id={`${id}-hint`} className="field-hint">
        {loading ? "Searching…" : failed ? "Place search isn't responding — please try again." : value ? `Time zone: ${value.timeZone}` : "Choose from the list. Add “, country” to narrow it down."}
      </p>
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-line bg-white py-1 shadow-(--shadow-lift)">
          {results.map((p, i) => (
            <li
              key={p.id}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); choose(p); }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-4 py-2.5 ${i === active ? "bg-lavender/50" : ""}`}
            >
              <span className="block">{p.label}</span>
              <span className="text-xs text-muted">{p.latitude.toFixed(2)}°, {p.longitude.toFixed(2)}° · {p.timeZone}</span>
            </li>
          ))}
        </ul>
      )}
      {open && !loading && query.trim().length >= 2 && results.length === 0 && !failed && (
        <p className="absolute z-20 mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted shadow-(--shadow-soft)">No matching places. Try the nearest town or city.</p>
      )}
    </div>
  );
}

function offsetLabel(m: number | null) {
  if (m == null) return "";
  const sign = m >= 0 ? "+" : "−";
  const a = Math.abs(m);
  return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(Math.round(a % 60)).padStart(2, "0")}`;
}

export function BirthChart() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [message, setMessage] = useState("");
  const [chart, setChart] = useState<ChartResult | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!date) errs.date = "Please enter your date of birth";
    if (!unknownTime && !time) errs.time = "Enter your birth time, or tick “I don't know my birth time”";
    if (!place) errs.place = "Please choose your birthplace from the list";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time: unknownTime ? null : time, placeId: place!.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setChart(data.chart);
      setStatus("done");
      setTimeout(() => resultRef.current?.focus(), 50);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const byBody = (b: string) => chart?.placements.find((p) => p.body === b);
  const ascendant = chart?.angles.find((a) => a.name === "Ascendant");

  return (
    <div className="grid gap-14">
      <form onSubmit={submit} noValidate className="card grid gap-6 p-6 sm:p-10" aria-describedby="privacy-note">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="bc-date" className="field-label">Date of birth <span aria-hidden className="text-blush-deep">*</span></label>
            <input id="bc-date" type="date" className="input" min="1800-01-01" max="2100-12-31" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={errors.date ? true : undefined} aria-describedby={errors.date ? "bc-date-err" : undefined} />
            {errors.date && <p id="bc-date-err" className="field-error">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor="bc-time" className="field-label">Time of birth {!unknownTime && <span aria-hidden className="text-blush-deep">*</span>}</label>
            <input id="bc-time" type="time" className="input" value={time} disabled={unknownTime} onChange={(e) => setTime(e.target.value)} aria-invalid={errors.time ? true : undefined} aria-describedby={`bc-time-hint${errors.time ? " bc-time-err" : ""}`} />
            <p id="bc-time-hint" className="field-hint">Local clock time, as on your birth certificate.</p>
            {errors.time && <p id="bc-time-err" className="field-error">{errors.time}</p>}
            <label className="mt-3 flex items-center gap-3 text-[0.95rem]">
              <input type="checkbox" className="h-5 w-5 accent-plum" checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTime(""); }} />
              I don&rsquo;t know my birth time
            </label>
          </div>
        </div>
        <PlaceCombobox value={place} onChange={setPlace} error={errors.place} />
        {unknownTime && (
          <p className="rounded-xl bg-lavender/40 px-4 py-3 text-sm text-plum">
            Without a birth time we can still show your planets&rsquo; signs, but not your rising sign (Ascendant), Midheaven or houses, and your Moon&rsquo;s exact degree is uncertain.
          </p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button className="btn-primary" disabled={status === "loading"}>{status === "loading" ? "Reading the sky…" : "Calculate my chart"}</button>
          <p id="privacy-note" className="text-sm text-muted">Your birth details are used only to calculate your chart and are never stored.</p>
        </div>
        <div aria-live="polite">
          {status === "error" && <p role="alert" className="rounded-xl bg-danger/10 px-4 py-3 text-danger">{message}</p>}
        </div>
      </form>

      {status === "loading" && (
        <div className="grid place-items-center py-10" aria-hidden>
          <div className="h-40 w-40 animate-spin rounded-full border-2 border-dashed border-lavender-deep [animation-duration:6s]" />
        </div>
      )}

      {chart && status === "done" && (
        <section aria-labelledby="chart-result" className="grid gap-12">
          {chart.isFixture && (
            <p role="alert" className="rounded-2xl border-2 border-dashed border-warning bg-warning/10 p-4 font-medium text-warning">
              DEVELOPMENT FIXTURE — these placements are sample data, not your real chart.
            </p>
          )}
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="grid place-items-center rounded-[2rem] bg-ivory-deep p-4 sm:p-8"><ChartWheel chart={chart} /></div>
            <div>
              <p className="eyebrow">Your chart</p>
              <h2 id="chart-result" tabIndex={-1} ref={resultRef} className="display-md mt-3 outline-none">Your big three</h2>
              <p className="mt-2 text-sm text-muted">
                {chart.input.placeLabel} · {chart.input.date}{chart.timeKnown ? ` · ${chart.input.time} (${offsetLabel(chart.utcOffsetMinutes)})` : " · time unknown"}
              </p>
              <ul className="mt-6 grid gap-4">
                {(["Sun", "Moon"] as const).map((b) => {
                  const p = byBody(b)!;
                  return (
                    <li key={b} className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
                      <p className="flex items-baseline gap-2 font-display text-2xl text-plum">
                        <span aria-hidden>{BODY_INFO[b].glyph}</span>{b} in {p.signUncertain && p.possibleSigns ? `${p.possibleSigns.join(" or ")}` : p.sign}
                      </p>
                      <p className="mt-1 text-sm text-ink/80">{BIG_THREE[b]} {!p.signUncertain && <>{p.sign}: {SIGN_INFO[p.sign].keywords}.</>}</p>
                      {p.signUncertain && <p className="mt-2 text-sm text-lavender-deep">The Moon changed sign on this day, so without a birth time we can&rsquo;t tell which sign it was in.</p>}
                    </li>
                  );
                })}
                <li className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
                  {ascendant ? (
                    <>
                      <p className="font-display text-2xl text-plum">Rising in {ascendant.sign}</p>
                      <p className="mt-1 text-sm text-ink/80">{BIG_THREE.Ascendant} {ascendant.sign}: {SIGN_INFO[ascendant.sign].keywords}.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-2xl text-plum">Rising sign unknown</p>
                      <p className="mt-1 text-sm text-ink/80">Your Ascendant changes roughly every two hours, so it needs an accurate birth time.</p>
                    </>
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl text-plum">What your chart says</h3>
            <p className="mt-1 text-sm text-muted">A short reading of your main placements. Tap the sections below for the full detail.</p>
                <ul className="mt-4 grid gap-3 text-[1rem] leading-relaxed sm:grid-cols-2 sm:gap-x-8">
                  {chart.placements.filter((p) => !p.signUncertain).slice(0, 7).map((p) => (
                    <li key={p.body}><strong className="font-medium text-plum">{p.body} in {p.sign}</strong> — {BODY_INFO[p.body].meaning}, coloured by {SIGN_INFO[p.sign].keywords}{p.house ? `, focused on ${HOUSE_MEANING[p.house - 1]} (house ${p.house})` : ""}.</li>
                  ))}
                </ul>
          </div>

          <div className="grid gap-3">
            <details className="card p-5 sm:p-6">
              <summary className="cursor-pointer font-display text-xl text-plum">All placements, degrees & houses</summary>
              <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-line">
                <table className="w-full min-w-[420px] text-left text-[0.95rem]">
                  <caption className="sr-only">Planet positions</caption>
                  <thead className="bg-ivory-deep text-xs uppercase tracking-wider text-muted">
                    <tr><th scope="col" className="px-4 py-3">Body</th><th scope="col" className="px-4 py-3">Sign</th><th scope="col" className="px-4 py-3">Degree</th><th scope="col" className="px-4 py-3">House</th></tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white/70">
                    {chart.placements.map((p) => (
                      <tr key={p.body}>
                        <th scope="row" className="px-4 py-3 font-medium"><span aria-hidden className="mr-2 text-plum">{BODY_INFO[p.body].glyph}</span>{p.body}{p.retrograde && p.body !== "North Node" && <span className="ml-1 text-xs text-muted" title="Retrograde">℞</span>}</th>
                        <td className="px-4 py-3">{p.signUncertain && p.possibleSigns ? p.possibleSigns.join(" / ") : <><span aria-hidden>{SIGN_INFO[p.sign].glyph} </span>{p.sign}</>}</td>
                        <td className="px-4 py-3 tabular-nums">{p.signUncertain ? "—" : formatDegree(p.degree)}</td>
                        <td className="px-4 py-3">{p.house ?? "—"}</td>
                      </tr>
                    ))}
                    {chart.angles.map((a) => (
                      <tr key={a.name} className="bg-ivory-deep/40">
                        <th scope="row" className="px-4 py-3 font-medium">{a.name}</th>
                        <td className="px-4 py-3"><span aria-hidden>{SIGN_INFO[a.sign].glyph} </span>{a.sign}</td>
                        <td className="px-4 py-3 tabular-nums">{formatDegree(a.degree)}</td>
                        <td className="px-4 py-3">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            {chart.aspects.length > 0 && (
              <details className="card p-5 sm:p-6">
                <summary className="cursor-pointer font-display text-xl text-plum">Key aspects ({Math.min(8, chart.aspects.length)})</summary>
                <p className="mt-3 text-sm text-muted">Aspects are angles between planets — they show which parts of you work together easily and which create creative tension.</p>
                  <ul className="mt-4 grid gap-2 text-[0.95rem]">
                    {chart.aspects.slice(0, 8).map((a, i) => (
                      <li key={i}><span aria-hidden className="mr-1 text-plum">{ASPECT_INFO[a.type].symbol}</span>{a.a} {ASPECT_INFO[a.type].label} {a.b} <span className="text-muted">({a.orb.toFixed(1)}° orb · {ASPECT_INFO[a.type].note})</span></li>
                    ))}
                  </ul>
              </details>
            )}
          </div>

          {chart.notes.length > 0 && (
            <div className="rounded-2xl bg-lavender/35 p-5 text-sm text-plum">
              <p className="font-medium">Notes about this chart</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">{chart.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
            </div>
          )}

          <details className="card p-6 text-sm">
            <summary className="cursor-pointer font-display text-xl text-plum">How this chart is calculated</summary>
            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-ink/80">
              <li>Calculated with <strong>{chart.provider.name}</strong> — an open-source astronomy library (VSOP87 / NOVAS models).</li>
              <li>Zodiac: <strong>tropical</strong> (Western), apparent positions on the true ecliptic of date.</li>
              <li>Houses: <strong>{chart.houseSystem === "placidus" ? "Placidus" : chart.houseSystem === "whole-sign" ? "Whole Sign" : "not calculated (birth time unknown)"}</strong>. Lunar node: mean North Node.</li>
              <li>Birth time converted to UTC with the IANA time zone database ({chart.input.timeZone}{chart.timeKnown ? `, ${offsetLabel(chart.utcOffsetMinutes)}` : ""}), including historical daylight-saving rules. UTC: {chart.utc.replace("T", " ").slice(0, 16)}.</li>
              <li>Coordinates: {chart.input.latitude.toFixed(3)}°, {chart.input.longitude.toFixed(3)}° (GeoNames).</li>
              <li>Interpretations are general and for reflection and entertainment — they are written separately from the calculations.</li>
            </ul>
          </details>
        </section>
      )}
    </div>
  );
}
