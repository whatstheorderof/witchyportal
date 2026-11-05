"use client";

import { useState } from "react";
import { MoonGlyph } from "@/components/MoonGlyph";
import type { MonthMoons } from "@/lib/astro/calendar";
import { useI18n } from "@/i18n/client";
import { msg } from "@/i18n/config";

export type DayMark = { kind: "eclipse" | "sabbat" | "retrograde"; label: string };

const QUARTER_LABEL = { new: msg("New Moon in {sign} at {time}"), first: msg("First Quarter in {sign} at {time}"), full: msg("Full Moon in {sign} at {time}"), last: msg("Last Quarter in {sign} at {time}") } as const;
/** Month and weekday names in the visitor's language (2024 starts on a Monday). */
const monthName = (i: number, intl: string) => new Intl.DateTimeFormat(intl, { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, i, 15))).replace(/^./, (c) => c.toUpperCase());
const weekday = (i: number, intl: string, style: "long" | "narrow") => new Intl.DateTimeFormat(intl, { weekday: style, timeZone: "UTC" }).format(new Date(Date.UTC(2024, 0, 1 + i)));

const MARK_STYLE: Record<DayMark["kind"], { dot: string; symbol: string }> = {
  eclipse: { dot: "bg-danger text-white", symbol: "◐" },
  sabbat: { dot: "bg-lavender-deep text-white", symbol: "✦" },
  retrograde: { dot: "bg-ink/70 text-white", symbol: "℞" },
};

function phaseName(angle: number) {
  if (angle < 12 || angle >= 348) return "New Moon";
  if (angle < 80) return "Waxing Crescent";
  if (angle < 100) return "First Quarter";
  if (angle < 168) return "Waxing Gibbous";
  if (angle < 192) return "Full Moon";
  if (angle < 260) return "Waning Gibbous";
  if (angle < 280) return "Last Quarter";
  return "Waning Crescent";
}

export function MoonYear({ year, months, todayKey, marks }: { year: number; months: MonthMoons[]; todayKey: string; marks: Record<string, DayMark[]> }) {
  const { t, intl } = useI18n();
  const MONTHS = Array.from({ length: 12 }, (_, i) => monthName(i, intl));
  const WEEKDAYS = Array.from({ length: 7 }, (_, i) => [weekday(i, intl, "narrow"), weekday(i, intl, "long")]);
  const thisYear = todayKey.startsWith(String(year));
  const [shown, setShown] = useState(thisYear ? Number(todayKey.slice(5, 7)) - 1 : 0);

  return (
    <div>
      {/* Phone: one month at a time */}
      <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
        <button type="button" onClick={() => setShown((m) => Math.max(0, m - 1))} disabled={shown === 0} className="grid h-11 w-11 place-items-center rounded-full border border-line text-plum disabled:opacity-30" aria-label={t("Previous month")}>‹</button>
        <label className="sr-only" htmlFor="moon-month">{t("Month")}</label>
        <select id="moon-month" value={shown} onChange={(e) => setShown(Number(e.target.value))} className="input min-h-11 max-w-[60%] text-center font-display text-xl text-plum">
          {MONTHS.map((m, i) => <option key={m} value={i}>{m} {year}</option>)}
        </select>
        <button type="button" onClick={() => setShown((m) => Math.min(11, m + 1))} disabled={shown === 11} className="grid h-11 w-11 place-items-center rounded-full border border-line text-plum disabled:opacity-30" aria-label={t("Next month")}>›</button>
      </div>

      <div className="grid gap-x-8 gap-y-10 lg:grid-cols-3">
        {months.map((m) => (
          <table key={m.month} className={`w-full table-fixed border-separate border-spacing-1 ${m.month === shown ? "" : "hidden lg:table"}`}>
            <caption className="sr-only mb-2 text-start font-display text-2xl text-plum lg:not-sr-only">
              {MONTHS[m.month]}
              <span className="sr-only"> {year}</span>
            </caption>
            <thead>
              <tr>{WEEKDAYS.map(([s, l], i) => <th key={i} scope="col" className="pb-1 text-center text-[0.7rem] font-medium uppercase tracking-wider text-muted"><abbr title={l} className="no-underline">{s}</abbr></th>)}</tr>
            </thead>
            <tbody>
              {weeks(m).map((week, wi) => (
                <tr key={wi}>
                  {week.map((d, di) => {
                    if (!d) return <td key={di} />;
                    const q = d.quarter;
                    const isMajor = q && (q.kind === "new" || q.kind === "full");
                    const today = d.key === todayKey;
                    const dayMarks = marks[d.key] ?? [];
                    const label = [
                      new Intl.DateTimeFormat(intl, { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${d.key}T12:00:00Z`)),
                      q ? t(QUARTER_LABEL[q.kind], { sign: t(q.sign), time: q.time }) : t(phaseName(d.angle)),
                      ...dayMarks.map((x) => x.label),
                      today ? t("today") : "",
                    ].filter(Boolean).join(", ");
                    return (
                      <td key={di} className="p-0 align-top">
                        <div
                          title={label}
                          className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-center ${
                            q?.kind === "full" ? "bg-blush" : q?.kind === "new" ? "bg-plum-deep text-ivory" : "bg-white/60"
                          } ${today ? "ring-2 ring-plum ring-offset-1 ring-offset-ivory" : ""}`}
                        >
                          <span className="sr-only">{label}</span>
                          <span aria-hidden className={`absolute start-1.5 top-1 text-[0.65rem] leading-none sm:text-[0.7rem] ${q?.kind === "new" ? "text-ivory/85" : "text-ink/70"} ${today ? "font-semibold" : ""}`}>{d.day}</span>
                          <MoonGlyph angle={d.angle} size={isMajor ? 26 : 20} glow={false} className="mt-2" />
                          {dayMarks.length > 0 && (
                            <span aria-hidden className="absolute end-0.5 top-0.5 flex gap-0.5">
                              {dayMarks.slice(0, 2).map((x, i) => (
                                <span key={i} className={`grid h-3.5 w-3.5 place-items-center rounded-full text-[0.5rem] leading-none ${MARK_STYLE[x.kind].dot}`}>{MARK_STYLE[x.kind].symbol}</span>
                              ))}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>

      {/* Legend */}
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink/80" aria-label={t("Key")}>
        <li className="flex items-center gap-2"><span aria-hidden className="h-5 w-5 rounded-md bg-plum-deep" />{t("New moon")}</li>
        <li className="flex items-center gap-2"><span aria-hidden className="h-5 w-5 rounded-md bg-blush" />{t("Full moon")}</li>
        {(Object.keys(MARK_STYLE) as DayMark["kind"][]).map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full text-[0.7rem] ${MARK_STYLE[k].dot}`}>{MARK_STYLE[k].symbol}</span>
            {k === "eclipse" ? t("Eclipse") : k === "sabbat" ? t("Sabbat, equinox or solstice") : t("Planet turns retrograde or direct")}
          </li>
        ))}
        {thisYear && <li className="flex items-center gap-2"><span aria-hidden className="h-5 w-5 rounded-md ring-2 ring-plum" />{t("Today")}</li>}
      </ul>
    </div>
  );
}

function weeks(m: MonthMoons) {
  const cells: (MonthMoons["days"][number] | null)[] = [...Array(m.firstWeekday).fill(null), ...m.days];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
}
