"use client";

import { SIGNS, type Sign } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";

const DATES: Record<Sign, string> = {
  Aries: "21 Mar – 19 Apr", Taurus: "20 Apr – 20 May", Gemini: "21 May – 20 Jun", Cancer: "21 Jun – 22 Jul",
  Leo: "23 Jul – 22 Aug", Virgo: "23 Aug – 22 Sep", Libra: "23 Sep – 22 Oct", Scorpio: "23 Oct – 21 Nov",
  Sagittarius: "22 Nov – 21 Dec", Capricorn: "22 Dec – 19 Jan", Aquarius: "20 Jan – 18 Feb", Pisces: "19 Feb – 20 Mar",
};

/** Twelve sign buttons. `light` for dark backgrounds. */
export function SignPicker({ onPick, selected, light = false, label = "Choose your star sign" }: { onPick: (s: Sign) => void; selected?: Sign | null; light?: boolean; label?: string }) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {SIGNS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          aria-pressed={selected === s}
          className={`flex min-h-20 flex-col items-center justify-center rounded-2xl px-2 py-3 text-center transition ${
            light ? "bg-ivory/10 text-ivory hover:bg-ivory/20 aria-pressed:bg-ivory aria-pressed:text-plum" : "bg-white/80 text-plum ring-1 ring-line hover:ring-plum aria-pressed:bg-plum aria-pressed:text-ivory"
          }`}
        >
          <span aria-hidden className="font-display text-2xl leading-none">{SIGN_INFO[s].glyph}</span>
          <span className="mt-1 text-sm font-medium">{s}</span>
          <span className={`text-[0.7rem] ${light ? "opacity-75" : "opacity-80"}`}>{DATES[s]}</span>
        </button>
      ))}
    </div>
  );
}
