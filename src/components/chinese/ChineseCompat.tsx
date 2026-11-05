"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { ANIMALS, RELATION_LABEL, relation, type Animal, type Relation } from "@/lib/astro/chinese-rules";

/** Two animals, their traditional relationship and what it means. */
export function ChineseCompat({ texts, initial = ["Rat", "Dragon"] }: { texts: Record<Relation, string>; initial?: [Animal, Animal] }) {
  const { t, rlang } = useI18n();
  const [a, setA] = useState<Animal>(initial[0]);
  const [b, setB] = useState<Animal>(initial[1]);
  const rel = relation(a, b);
  const select = (id: string, label: string, v: Animal, set: (x: Animal) => void) => (
    <div className="flex-1">
      <label htmlFor={id} className="field-label">{label}</label>
      <select id={id} className="input" value={v} onChange={(e) => set(e.target.value as Animal)}>{ANIMALS.map((x) => <option key={x} value={x}>{t(x)}</option>)}</select>
    </div>
  );
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row">{select("cc-a", t("Your animal"), a, setA)}{select("cc-b", t("Their animal"), b, setB)}</div>
      <div aria-live="polite" className="mt-6 rounded-2xl bg-blush/40 p-5">
        <p className="eyebrow">{t("{a} and {b}", { a: t(a), b: t(b) })}</p>
        <p className="mt-1 font-display text-3xl text-plum">{t(RELATION_LABEL[rel])}</p>
        <div lang={rlang} className="mt-3 grid gap-3 leading-relaxed text-ink/85">{texts[rel].split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
      </div>
    </div>
  );
}
