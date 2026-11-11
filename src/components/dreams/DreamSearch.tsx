"use client";

import { useId, useMemo, useState } from "react";
import Link from "@/i18n/client";
import { useI18n } from "@/i18n/client";

type Item = { slug: string; title: string; summary: string; keywords: string[]; category: string };

/** Searchable A–Z of dream symbols, grouped by category. Every link is in the page for search engines. */
export function DreamSearch({ items, groups }: { items: Item[]; groups: { key: string; label: string }[] }) {
  const { t, rlang } = useI18n();
  const id = useId();
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = useMemo(
    () => (needle ? items.filter((i) => `${i.title} ${i.keywords.join(" ")} ${i.summary}`.toLowerCase().includes(needle)) : items),
    [items, needle],
  );
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-ink">{t("Search the dream dictionary")}</label>
      <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Snakes, teeth, water…")} className="input mt-2 w-full max-w-xl" />
      <p role="status" className="mt-2 text-sm text-muted">{needle ? t("{n} dreams found", { n: shown.length }) : t("{n} dreams", { n: items.length })}</p>
      {groups.map((g) => {
        const list = shown.filter((i) => i.category === g.key);
        if (!list.length) return null;
        return (
          <section key={g.key} className="mt-10" aria-label={g.label}>
            <h2 className="font-display text-3xl text-plum">{g.label}</h2>
            <ul lang={rlang} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => (
                <li key={i.slug}>
                  <Link href={`/dream-dictionary/${i.slug}`} className="card block h-full p-5 transition hover:-translate-y-0.5">
                    <span className="block font-display text-2xl text-plum">{i.title}</span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.15em] text-plum-soft">{i.keywords.join(" · ")}</span>
                    <span className="mt-2 block text-[0.95rem] text-ink/80">{i.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {needle && shown.length === 0 && (
        <p className="mt-8 rounded-2xl bg-ivory-deep p-6 text-muted">
          {t("No dream matches that yet. Yulia can interpret it for you personally.")} <Link href="/services" className="text-plum link-underline">{t("Ask Yulia")}</Link>
        </p>
      )}
    </div>
  );
}
