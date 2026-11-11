"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "@/i18n/client";
import { useI18n } from "@/i18n/client";

type Item = { slug: string; kind: string; name: string; summary: string; keywords: string[]; intentions: string[] };
type Opt = { key: string; label: string };

/** Filter crystals, herbs and candle colours by type and by what you need. All links are in the page. */
export function CorrFinder({ items, kinds, intentions }: { items: Item[]; kinds: Opt[]; intentions: Opt[] }) {
  const { t, rlang } = useI18n();
  const [kind, setKind] = useState("all");
  const [need, setNeed] = useState("all");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const n = q.get("need"), k = q.get("type");
    const id = setTimeout(() => {
      if (n && intentions.some((i) => i.key === n)) setNeed(n);
      if (k && kinds.some((i) => i.key === k)) setKind(k);
    }, 0);
    return () => clearTimeout(id);
  }, [intentions, kinds]);

  const shown = useMemo(() => items.filter((i) => (kind === "all" || i.kind === kind) && (need === "all" || i.intentions.includes(need))), [items, kind, need]);
  const chip = "chip min-h-11 aria-pressed:border-plum aria-pressed:bg-plum aria-pressed:text-ivory";

  return (
    <div>
      <div role="group" aria-label={t("Show")} className="flex flex-wrap gap-2">
        {[{ key: "all", label: t("Everything") }, ...kinds].map((k) => (
          <button key={k.key} type="button" aria-pressed={kind === k.key} onClick={() => setKind(k.key)} className={chip}>{k.label}</button>
        ))}
      </div>
      <p className="mt-6 text-sm font-medium text-ink">{t("I need…")}</p>
      <div role="group" aria-label={t("I need…")} className="mt-2 flex flex-wrap gap-2">
        {[{ key: "all", label: t("Anything") }, ...intentions].map((i) => (
          <button key={i.key} type="button" aria-pressed={need === i.key} onClick={() => setNeed(i.key)} className={chip}>{i.label}</button>
        ))}
      </div>
      <p role="status" className="mt-4 text-sm text-muted">{t("{n} shown", { n: shown.length })}</p>
      {kinds.map((k) => {
        const list = shown.filter((i) => i.kind === k.key);
        if (!list.length) return null;
        return (
          <section key={k.key} className="mt-10" aria-label={k.label}>
            <h2 className="font-display text-3xl text-plum">{k.label}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => (
                <li key={i.slug}>
                  <Link href={`/correspondences/${i.slug}`} className="card block h-full p-5 transition hover:-translate-y-0.5">
                    <span className="block font-display text-2xl text-plum">{i.name}</span>
                    <span lang={rlang} className="mt-1 block text-xs uppercase tracking-[0.15em] text-plum-soft">{i.keywords.join(" · ")}</span>
                    <span lang={rlang} className="mt-2 block text-[0.95rem] text-ink/80">{i.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
