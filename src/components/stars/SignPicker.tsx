"use client";

import { SIGNS, type Sign } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { useI18n } from "@/i18n/client";

// [start month, day, end month, day]
const RANGE: Record<Sign, [number, number, number, number]> = {
  Aries: [3, 21, 4, 19], Taurus: [4, 20, 5, 20], Gemini: [5, 21, 6, 20], Cancer: [6, 21, 7, 22],
  Leo: [7, 23, 8, 22], Virgo: [8, 23, 9, 22], Libra: [9, 23, 10, 22], Scorpio: [10, 23, 11, 21],
  Sagittarius: [11, 22, 12, 21], Capricorn: [12, 22, 1, 19], Aquarius: [1, 20, 2, 18], Pisces: [2, 19, 3, 20],
};
const dates = (s: Sign, intl: string) => {
  const [m1, d1, m2, d2] = RANGE[s];
  const f = new Intl.DateTimeFormat(intl, { day: "numeric", month: "short", timeZone: "UTC" });
  return `${f.format(Date.UTC(2001, m1 - 1, d1))} – ${f.format(Date.UTC(2001, m2 - 1, d2))}`;
};

/** Twelve sign buttons. `light` for dark backgrounds. */
export function SignPicker({ onPick, selected, light = false, label }: { onPick: (s: Sign) => void; selected?: Sign | null; light?: boolean; label?: string }) {
  const { t, intl } = useI18n();
  return (
    <div role="group" aria-label={label ?? t("Choose your star sign")} className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
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
          <span className="mt-1 text-sm font-medium">{t(s)}</span>
          <span className={`text-[0.7rem] ${light ? "opacity-75" : "opacity-80"}`}>{dates(s, intl)}</span>
        </button>
      ))}
    </div>
  );
}
