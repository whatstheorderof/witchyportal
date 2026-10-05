"use client";

import { useState } from "react";
import { MoonGlyph } from "@/components/MoonGlyph";
import type { KeyDate, KeyKind } from "@/lib/astro/calendar";

const FILTERS: { key: string; label: string; kinds: KeyKind[] }[] = [
  { key: "all", label: "Everything", kinds: [] },
  { key: "moons", label: "New & full moons", kinds: ["new-moon", "full-moon"] },
  { key: "eclipses", label: "Eclipses", kinds: ["lunar-eclipse", "solar-eclipse"] },
  { key: "wheel", label: "Sabbats & seasons", kinds: ["sabbat", "season"] },
  { key: "retro", label: "Retrogrades", kinds: ["retrograde"] },
];

/** Key date with its display text already formatted on the server (avoids hydration differences). */
export type ShownKeyDate = KeyDate & { when: string; month: string };

function Icon({ kind }: { kind: KeyKind }) {
  if (kind === "new-moon" || kind === "full-moon")
    return <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-plum-deep"><MoonGlyph angle={kind === "new-moon" ? 0 : 180} size={30} glow={false} /></span>;
  const map: Partial<Record<KeyKind, [string, string]>> = {
    "lunar-eclipse": ["◐", "bg-danger text-white"],
    "solar-eclipse": ["◑", "bg-danger text-white"],
    sabbat: ["✦", "bg-lavender-deep text-white"],
    season: ["☀︎", "bg-lavender-deep text-white"],
    retrograde: ["℞", "bg-ink/80 text-white"],
  };
  const [sym, cls] = map[kind] ?? ["•", "bg-plum text-ivory"];
  return <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg ${cls}`}>{sym}</span>;
}

export function KeyDates({ dates, now }: { dates: ShownKeyDate[]; now: string }) {
  const [filter, setFilter] = useState("all");
  const f = FILTERS.find((x) => x.key === filter)!;
  const list = dates.filter((d) => !f.kinds.length || f.kinds.includes(d.kind));
  const nextId = list.find((d) => (d.end ?? d.start) >= now)?.id;
  const groups: [string, ShownKeyDate[]][] = [];
  for (const d of list) {
    const m = d.month;
    const g = groups.at(-1);
    if (g && g[0] === m) g[1].push(d); else groups.push([m, [d]]);
  }

  return (
    <div>
      <div role="group" aria-label="Show" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((x) => (
          <button key={x.key} type="button" aria-pressed={filter === x.key} onClick={() => setFilter(x.key)} className="chip min-h-11 shrink-0 whitespace-nowrap aria-pressed:border-plum aria-pressed:bg-plum aria-pressed:text-ivory">
            {x.label}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="mt-8 text-muted">Nothing of this kind this year.</p>
      ) : (
        <div className="mt-8 grid gap-10">
          {groups.map(([month, items]) => (
            <section key={month} aria-label={month}>
              <h3 className="eyebrow">{month}</h3>
              <ul className="mt-3 grid gap-3 md:grid-cols-2">
                {items.map((d) => {
                  const past = (d.end ?? d.start) < now;
                  const isNext = d.id === nextId;
                  return (
                    <li key={d.id} className={`card flex gap-4 p-5 ${past ? "bg-ivory-deep/70 shadow-none" : ""} ${isNext ? "ring-2 ring-plum" : ""}`}>
                      <Icon kind={d.kind} />
                      <div className="min-w-0">
                        <p className="text-sm text-muted">
                          {d.when}
                          {isNext && <span className="ml-2 rounded-full bg-plum px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-wider text-ivory">Next</span>}
                          {past && <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[0.7rem] uppercase tracking-wider text-ink/75">Passed</span>}
                        </p>
                        <p className="mt-1 font-display text-2xl leading-snug text-plum">{d.title}</p>
                        <p className="mt-1 text-[0.95rem] text-ink/80">{d.detail}</p>
                        {d.tags.length > 0 && (
                          <p className="mt-2 flex flex-wrap gap-1.5">
                            {d.tags.map((t) => <span key={t} className="rounded-full bg-lavender/60 px-2.5 py-0.5 text-xs text-plum">{t}</span>)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
