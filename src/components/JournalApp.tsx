"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "@/i18n/client";
import { useI18n } from "@/i18n/client";
import { msg } from "@/i18n/config";
import { loadJournal, newId, saveJournal, ukToday, type JournalEntry, type JournalKind } from "@/lib/daily-ritual";

const KINDS: { key: JournalKind; label: string; prompt: string }[] = [
  { key: "tarot", label: msg("Tarot pull"), prompt: msg("What did the card bring up for you? Where do you see it in your life today?") },
  { key: "dream", label: msg("Dream"), prompt: msg("What happened, who was there and how did it feel? Write it before it fades.") },
  { key: "moon", label: msg("Moon intention"), prompt: msg("Write your intention in the present tense, as if it's already true.") },
  { key: "note", label: msg("Note"), prompt: msg("Anything on your mind — a sign, a feeling, a small win.") },
];

/** A private journal kept in localStorage (see lib/daily-ritual). */
export function JournalApp({ cards }: { cards: string[] }) {
  const { t, intl } = useI18n();
  const id = useId();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [kind, setKind] = useState<JournalKind>("note");
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [card, setCard] = useState<JournalEntry["card"]>();
  const [filter, setFilter] = useState<JournalKind | "all">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const add = q.get("add") as JournalKind | null;
    const n = Number(q.get("n"));
    const id = setTimeout(() => {
      setEntries(loadJournal());
      setDate(ukToday());
      if (add && KINDS.some((k) => k.key === add)) setKind(add);
      if (add === "tarot" && Number.isInteger(n) && cards[n]) {
        const reversed = q.get("r") === "1";
        setCard({ n, reversed });
        setTitle(reversed ? t("{card}, reversed", { card: cards[n] }) : cards[n]);
      }
      const given = q.get("title");
      if (given) setTitle(given.slice(0, 120));
      setReady(true);
    }, 0);
    return () => clearTimeout(id);
  }, [cards, t]);

  const kindOf = (k: JournalKind) => KINDS.find((x) => x.key === k)!;
  const shown = useMemo(() => (filter === "all" ? entries : entries.filter((e) => e.kind === filter)), [entries, filter]);
  const fmt = (d: string) => new Intl.DateTimeFormat(intl, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() && !text.trim()) return;
    const next = [{ id: newId(), date: date || ukToday(), kind, title: title.trim() || t(kindOf(kind).label), text: text.trim(), ...(card && kind === "tarot" ? { card } : {}) }, ...entries];
    saveJournal(next);
    setEntries(loadJournal());
    setTitle("");
    setText("");
    setCard(undefined);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function remove(entryId: string) {
    const next = entries.filter((e) => e.id !== entryId);
    saveJournal(next);
    setEntries(next);
    setConfirmId(null);
  }

  function exportText() {
    const body = entries
      .map((e) => `${e.date} · ${t(kindOf(e.kind).label)}\n${e.title}\n\n${e.text}`)
      .join("\n\n————————\n\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([`${t("My Witchy Portal journal")}\n\n${body}\n`], { type: "text/plain;charset=utf-8" }));
    a.download = `witchy-portal-journal-${ukToday()}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
      <form onSubmit={save} className="card grid content-start gap-5 p-6 sm:p-8" aria-labelledby={`${id}-new`}>
        <h2 id={`${id}-new`} className="font-display text-3xl text-plum">{t("New entry")}</h2>
        <fieldset>
          <legend className="text-sm font-medium text-ink">{t("What are you writing?")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <label key={k.key} className="chip min-h-11 cursor-pointer has-[:checked]:border-plum has-[:checked]:bg-plum has-[:checked]:text-ivory has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-plum">
                <input type="radio" name="kind" value={k.key} checked={kind === k.key} onChange={() => setKind(k.key)} className="sr-only" />
                {t(k.label)}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
          <label className="grid gap-2 text-sm font-medium text-ink">
            {t("Title")}
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-ink">
            {t("Date")}
            <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} max={ukToday()} />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-ink">
          {t("Your words")}
          <textarea className="input min-h-44" value={text} onChange={(e) => setText(e.target.value)} placeholder={t(kindOf(kind).prompt)} maxLength={5000} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" disabled={!ready}>{t("Save entry")}</button>
          {saved && <span role="status" className="text-sm text-plum">{t("Saved to your journal.")}</span>}
        </div>
        <p className="text-xs text-muted">{t("Saved in this browser only. Clearing your browsing data deletes it, so use “Download” now and then to keep a copy.")}</p>
      </form>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl text-plum">{t("Your entries")}</h2>
          {entries.length > 0 && <button type="button" onClick={exportText} className="btn-outline min-h-11">{t("Download")}</button>}
        </div>
        <div role="group" aria-label={t("Show")} className="mt-4 flex flex-wrap gap-2">
          {[{ key: "all" as const, label: msg("All") }, ...KINDS].map((k) => (
            <button key={k.key} type="button" aria-pressed={filter === k.key} onClick={() => setFilter(k.key)} className="chip min-h-11 aria-pressed:border-plum aria-pressed:bg-plum aria-pressed:text-ivory">{t(k.label)}</button>
          ))}
        </div>
        {ready && shown.length === 0 && (
          <div className="mt-6 rounded-2xl bg-ivory-deep p-6 text-muted">
            <p>{entries.length === 0 ? t("Nothing here yet. Your first entry will appear here.") : t("No entries of this kind yet.")}</p>
            <p className="mt-3 flex flex-wrap gap-3">
              <Link href="/tarot#your-card" className="text-plum link-underline">{t("Draw your card for today")}</Link>
              <Link href="/moon" className="text-plum link-underline">{t("Moon calendar")}</Link>
            </p>
          </div>
        )}
        <ul className="mt-6 grid gap-4">
          {shown.map((e) => (
            <li key={e.id} className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-plum-soft">{fmt(e.date)} · {t(kindOf(e.kind).label)}</p>
              <p className="mt-1 font-display text-2xl text-plum">{e.title}</p>
              {e.text && <p className="mt-2 whitespace-pre-wrap text-ink/85">{e.text}</p>}
              <div className="mt-3">
                {confirmId === e.id ? (
                  <span className="flex flex-wrap items-center gap-3 text-sm">
                    <span>{t("Delete this entry? It can't be undone.")}</span>
                    <button type="button" onClick={() => remove(e.id)} className="font-medium text-danger underline underline-offset-4">{t("Delete")}</button>
                    <button type="button" onClick={() => setConfirmId(null)} className="text-plum underline underline-offset-4">{t("Keep it")}</button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirmId(e.id)} className="text-sm text-muted underline underline-offset-4">{t("Delete")}</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
