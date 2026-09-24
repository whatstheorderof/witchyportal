"use client";

import { useRef, useState } from "react";

export type PickerMedia = { id: string; url: string; alt: string; kind: "image" | "video" };

function Thumb({ m, className = "" }: { m: PickerMedia; className?: string }) {
  return m.kind === "video" ? (
    <video src={m.url} muted className={`h-full w-full object-cover ${className}`} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.url} alt={m.alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />
  );
}

export function MediaPicker({ name, label, media, defaultValue, multiple = false, kind = "image", hint }: { name: string; label: string; media: PickerMedia[]; defaultValue?: string | string[] | null; multiple?: boolean; kind?: "image" | "video"; hint?: string }) {
  const initial = Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : [];
  const [selected, setSelected] = useState<string[]>(initial.filter((id) => media.some((m) => m.id === id)));
  const dialog = useRef<HTMLDialogElement>(null);
  const options = media.filter((m) => m.kind === kind);
  const toggle = (id: string) => {
    if (multiple) setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
    else { setSelected([id]); dialog.current?.close(); }
  };
  const chosen = selected.map((id) => media.find((m) => m.id === id)).filter(Boolean) as PickerMedia[];
  return (
    <div>
      <p className="field-label">{label}</p>
      {multiple ? selected.map((id) => <input key={id} type="hidden" name={name} value={id} />) : <input type="hidden" name={name} value={selected[0] ?? ""} />}
      <div className="flex flex-wrap items-center gap-3">
        {chosen.map((m, i) => (
          <div key={m.id} className="relative h-24 w-32 overflow-hidden rounded-xl bg-sand ring-1 ring-line">
            <Thumb m={m} />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-plum-deep/60 p-1">
              {multiple && i > 0 && <button type="button" aria-label="Move earlier" onClick={() => setSelected((s) => { const c = [...s]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; return c; })} className="grid h-7 w-7 place-items-center rounded-full bg-ivory/90 text-xs">←</button>}
              <button type="button" aria-label={`Remove ${m.alt || "media"}`} onClick={() => setSelected((s) => s.filter((x) => x !== m.id))} className="grid h-7 w-7 place-items-center rounded-full bg-ivory/90 text-xs text-danger">✕</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => dialog.current?.showModal()} className="btn-outline min-h-11 text-sm">{chosen.length && !multiple ? "Change" : multiple ? "+ Add from library" : "Choose from library"}</button>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
      <dialog ref={dialog} className="m-auto w-[min(92vw,960px)] rounded-3xl bg-ivory p-0 backdrop:bg-plum-deep/60" aria-label={`Choose ${label}`}>
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <p className="font-display text-2xl text-plum">Choose {kind === "video" ? "a video" : multiple ? "images" : "an image"}</p>
          <button type="button" onClick={() => dialog.current?.close()} className="btn-outline min-h-10 text-sm">Done</button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-6">
          {options.length === 0 ? (
            <p className="text-muted">No {kind}s in the media library yet. Upload them in <a className="link-underline" href="/admin/media" target="_blank">Media</a>, then reopen this.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {options.map((m) => {
                const on = selected.includes(m.id);
                return (
                  <li key={m.id}>
                    <button type="button" onClick={() => toggle(m.id)} aria-pressed={on} className={`relative block aspect-[4/3] w-full overflow-hidden rounded-xl ring-2 ${on ? "ring-plum" : "ring-transparent hover:ring-line"}`}>
                      <Thumb m={m} />
                      {on && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-plum text-ivory">✓</span>}
                    </button>
                    <p className={`mt-1 line-clamp-2 text-xs ${m.alt ? "text-muted" : "text-danger"}`}>{m.alt || "Missing alt text"}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </dialog>
    </div>
  );
}
