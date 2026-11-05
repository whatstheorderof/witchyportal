"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChartResult } from "@/lib/astro/types";
import type { NatalReport } from "@/lib/astro/report-types";
import Link, { useI18n } from "@/i18n/client";
import { Report, type ContactLinks } from "./Report";
import { saveMyChart, useMyChart } from "@/lib/my-chart";
import { setMySign } from "@/lib/my-sign";

export interface Place {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

export function PlaceCombobox({ value, onChange, error }: { value: Place | null; onChange: (p: Place | null) => void; error?: string }) {
  const id = useId();
  const [query, setQuery] = useState(value?.label ?? "");
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { t } = useI18n();

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
      <label htmlFor={id} className="field-label">{t("Place of birth")} <span aria-hidden className="text-blush-deep">*</span></label>
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
        placeholder={t("Start typing a town or city")}
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
        {loading ? t("Searching…") : failed ? t("Place search isn't responding — please try again.") : value ? t("Time zone: {zone}", { zone: value.timeZone }) : t("Choose from the list. Add “, country” to narrow it down.")}
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
        <p className="absolute z-20 mt-1 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted shadow-(--shadow-soft)">{t("No matching places. Try the nearest town or city.")}</p>
      )}
    </div>
  );
}

export function BirthChart({ contact }: { contact: ContactLinks }) {
  const [name, setName] = useState("");
  const [report, setReport] = useState<NatalReport | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [place, setPlace] = useState<Place | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [message, setMessage] = useState("");
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [save, setSave] = useState(false);
  const saved = useMyChart();
  const resultRef = useRef<HTMLDivElement>(null);
  const { t, api } = useI18n();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!date) errs.date = t("Please enter your date of birth");
    if (!unknownTime && !time) errs.time = t("Enter your birth time, or tick “I don't know my birth time”");
    if (!place) errs.place = t("Please choose your birthplace from the list");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(api("/api/chart"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time: unknownTime ? null : time, placeId: place!.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("Something went wrong"));
      setChart(data.chart);
      setReport(data.report);
      if (save) {
        const sun = (data.chart as ChartResult).placements.find((p) => p.body === "Sun")?.sign;
        saveMyChart({ date, time: unknownTime ? null : time, placeId: place!.id, placeLabel: place!.label, ...(name.trim() ? { name: name.trim() } : {}), ...(sun ? { sun } : {}) });
        if (sun) setMySign(sun);
      }
      setStatus("done");
      setTimeout(() => { const h = document.getElementById("chart-result"); h?.focus(); resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : t("Something went wrong"));
    }
  }

  return (
    <div className="grid min-w-0 gap-14 [&>*]:min-w-0">
      <form onSubmit={submit} noValidate className="card grid gap-6 p-6 print:hidden sm:p-10" aria-describedby="privacy-note">
        <div>
          <label htmlFor="bc-name" className="field-label">{t("Name")} <span className="font-normal text-muted">{t("(optional — for the report title)")}</span></label>
          <input id="bc-name" className="input" autoComplete="off" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="bc-date" className="field-label">{t("Date of birth")} <span aria-hidden className="text-blush-deep">*</span></label>
            <input id="bc-date" type="date" className="input" min="1800-01-01" max="2100-12-31" value={date} onChange={(e) => setDate(e.target.value)} aria-invalid={errors.date ? true : undefined} aria-describedby={errors.date ? "bc-date-err" : undefined} />
            {errors.date && <p id="bc-date-err" className="field-error">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor="bc-time" className="field-label">{t("Time of birth")} {!unknownTime && <span aria-hidden className="text-blush-deep">*</span>}</label>
            <input id="bc-time" type="time" className="input" value={time} disabled={unknownTime} onChange={(e) => setTime(e.target.value)} aria-invalid={errors.time ? true : undefined} aria-describedby={`bc-time-hint${errors.time ? " bc-time-err" : ""}`} />
            <p id="bc-time-hint" className="field-hint">{t("Local clock time, as on your birth certificate.")}</p>
            {errors.time && <p id="bc-time-err" className="field-error">{errors.time}</p>}
            <label className="mt-3 flex items-center gap-3 text-[0.95rem]">
              <input type="checkbox" className="h-5 w-5 accent-plum" checked={unknownTime} onChange={(e) => { setUnknownTime(e.target.checked); if (e.target.checked) setTime(""); }} />
              {t("I don’t know my birth time")}
            </label>
          </div>
        </div>
        <PlaceCombobox value={place} onChange={setPlace} error={errors.place} />
        {unknownTime && (
          <p className="rounded-xl bg-lavender/40 px-4 py-3 text-sm text-plum">
            {t("Without a birth time we can still show your planets’ signs, but not your rising sign (Ascendant), Midheaven or houses, and your Moon’s exact degree is uncertain.")}
          </p>
        )}
        <div id="save-chart" className="scroll-mt-28 rounded-xl bg-blush/30 px-4 py-3">
          {saved ? (
            <p className="text-[0.95rem] text-plum">
              {saved.name ? t("A birth chart ({name}) is saved on this device for your", { name: saved.name }) : t("A birth chart is saved on this device for your")} <Link href="/today" className="link-underline">{t("personal daily horoscope")}</Link>.{" "}
              <button type="button" className="link-underline" onClick={() => saveMyChart(null)}>{t("Forget it")}</button>
            </p>
          ) : (
            <label className="flex items-start gap-3 text-[0.95rem]">
              <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-plum" checked={save} onChange={(e) => setSave(e.target.checked)} />
              <span><strong className="font-medium text-plum">{t("Save my chart on this device")}</strong> {t("for a personal daily horoscope read from my whole chart. It stays in this browser only — we never store it — and you can forget it at any time.")}</span>
            </label>
          )}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <button className="btn-primary" disabled={status === "loading"}>{status === "loading" ? t("Reading the sky…") : t("Get my free natal chart")}</button>
          <p id="privacy-note" className="text-sm text-muted">{t("Your birth details are used only to calculate your chart and are never stored on our server.")}</p>
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

      {chart && report && status === "done" && <div ref={resultRef}><Report chart={chart} report={report} name={name} contact={contact} /></div>}
    </div>
  );
}
