"use client";

import { useState } from "react";

type Row = Record<string, string>;

export function Repeater({ name, label, fields, initial, addLabel }: { name: string; label: string; fields: { key: string; label: string; textarea?: boolean; width?: string }[]; initial: Row[]; addLabel: string }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const update = (i: number, k: string, v: string) => setRows((r) => r.map((row, j) => (j === i ? { ...row, [k]: v } : row)));
  const move = (i: number, d: number) => setRows((r) => { const c = [...r]; const [x] = c.splice(i, 1); c.splice(i + d, 0, x); return c; });
  return (
    <fieldset className="grid gap-3">
      <legend className="field-label">{label}</legend>
      <input type="hidden" name={name} value={JSON.stringify(rows.filter((r) => Object.values(r).some((v) => v.trim())))} />
      {rows.map((row, i) => (
        <div key={i} className="grid gap-3 rounded-2xl bg-white/60 p-4 ring-1 ring-line sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))_auto]">
          {fields.map((f) => (
            <label key={f.key} className={`grid gap-1 text-sm ${f.textarea ? "sm:col-span-full" : ""}`}>
              <span className="text-muted">{f.label}</span>
              {f.textarea ? (
                <textarea className="input min-h-20" value={row[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} rows={2} />
              ) : (
                <input className="input" value={row[f.key] ?? ""} onChange={(e) => update(i, f.key, e.target.value)} />
              )}
            </label>
          ))}
          <div className="flex items-end gap-1 sm:col-start-[-2] sm:row-start-1">
            <button type="button" aria-label={`Move item ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand disabled:opacity-30">↑</button>
            <button type="button" aria-label={`Move item ${i + 1} down`} disabled={i === rows.length - 1} onClick={() => move(i, 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-sand disabled:opacity-30">↓</button>
            <button type="button" aria-label={`Remove item ${i + 1}`} onClick={() => setRows((r) => r.filter((_, j) => j !== i))} className="grid h-11 w-11 place-items-center rounded-full text-danger hover:bg-danger/10">✕</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => setRows((r) => [...r, Object.fromEntries(fields.map((f) => [f.key, ""]))])} className="btn-outline min-h-11 justify-self-start text-sm">+ {addLabel}</button>
    </fieldset>
  );
}
