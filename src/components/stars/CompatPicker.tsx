"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SIGNS, type Sign } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { useMySign } from "@/lib/my-sign";

/** Pick two signs and go to their compatibility page. */
export function CompatPicker() {
  const mine = useMySign();
  const [a, setA] = useState<Sign | "">("");
  const [b, setB] = useState<Sign | "">("");
  const router = useRouter();
  const first = a || mine || "";
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (!first || !b) return;
    const [x, y] = SIGNS.indexOf(first) <= SIGNS.indexOf(b) ? [first, b] : [b, first];
    router.push(`/compatibility/${x.toLowerCase()}-and-${y.toLowerCase()}`);
  };
  const select = (id: string, label: string, value: string, set: (v: Sign) => void) => (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <select id={id} className="input" value={value} onChange={(e) => set(e.target.value as Sign)} required>
        <option value="" disabled>Choose a sign</option>
        {SIGNS.map((s) => <option key={s} value={s}>{SIGN_INFO[s].glyph} {s}</option>)}
      </select>
    </div>
  );
  return (
    <form onSubmit={go} className="card grid gap-5 p-6 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end sm:p-8">
      {select("compat-a", "Your sign", first, setA)}
      <span aria-hidden className="hidden pb-3 text-center font-display text-3xl text-blush-deep sm:block">♡</span>
      {select("compat-b", "Their sign", b, setB)}
      <button className="btn-primary" disabled={!first || !b}>Test our signs</button>
    </form>
  );
}
