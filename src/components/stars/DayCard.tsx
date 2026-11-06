"use client";

import Link, { useI18n } from "@/i18n/client";
import type { DailyHoroscope } from "@/lib/astro/horoscope";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { MoonGlyph } from "@/components/MoonGlyph";

export function Ratings({ ratings, light = false }: { ratings: DailyHoroscope["ratings"]; light?: boolean }) {
  const { t } = useI18n();
  const LABEL = { love: t("love"), work: t("work"), energy: t("energy") };
  return (
    <dl className="grid grid-cols-3 gap-2">
      {(["love", "work", "energy"] as const).map((k) => (
        <div key={k} className={`rounded-2xl px-3 py-2 text-center ${light ? "bg-ivory/10" : "bg-white/70 ring-1 ring-line"}`}>
          <dt className={`text-[0.68rem] uppercase tracking-[0.18em] ${light ? "text-ivory/75" : "text-plum-soft"}`}>{LABEL[k]}</dt>
          <dd className="mt-0.5">
            <span className="sr-only">{t("{n} out of 5", { n: ratings[k] })}</span>
            {Array.from({ length: 5 }, (_, i) => <span key={i} aria-hidden className={i < ratings[k] ? (light ? "text-gold" : "text-plum") : light ? "text-ivory/25" : "text-line"}>★</span>)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const dayLabel = (day: string, intl = "en-GB") => new Intl.DateTimeFormat(intl, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));

/** At-a-glance astrological day for one sign. `compact` for the splash and side cards. */
export function DayCard({ h, compact = false, light = false, link = true }: { h: DailyHoroscope; compact?: boolean; light?: boolean; link?: boolean }) {
  const muted = light ? "text-ivory/80" : "text-ink/80";
  const { t, intl, rlang } = useI18n();
  return (
    <div>
      <div className="flex items-center gap-4">
        <MoonGlyph angle={h.moon.angle} size={compact ? 56 : 72} glow={light} />
        <div>
          <p className={`eyebrow ${light ? "text-blush" : ""}`}>{dayLabel(h.day, intl)}</p>
          <p className={`mt-1 text-sm ${muted}`}>{t("{phase} in {sign}", { phase: t(h.moon.phase), sign: t(h.moon.sign) })} · {t("{n}% lit", { n: Math.round(h.moon.illumination * 100) })}{h.moon.entersSign ? ` · ${t("enters {sign} at {time}", { sign: t(h.moon.entersSign.sign), time: h.moon.entersSign.time })}` : ""}</p>
        </div>
      </div>
      <h3 lang={rlang} className={`mt-5 font-display text-3xl leading-tight sm:text-4xl ${light ? "text-ivory" : "text-plum"}`}><span aria-hidden className="me-2">{SIGN_INFO[h.sign].glyph}</span>{h.headline}</h3>
      <p className={`mt-1 text-sm ${muted}`}>{t("Today’s focus for {sign}:", { sign: t(h.sign) })} <span>{h.focus}</span></p>
      <div className="mt-5"><Ratings ratings={h.ratings} light={light} /></div>
      <div lang={rlang} className={`mt-5 grid gap-3 leading-relaxed ${light ? "text-ivory/90" : "text-ink/85"}`}>
        {(compact ? h.paragraphs.slice(0, 1) : h.paragraphs).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {!compact && h.retrograde && <p lang={rlang} className={`mt-4 rounded-2xl p-4 text-[0.95rem] ${light ? "bg-ivory/10" : "bg-lavender/35 text-plum"}`}><strong className="font-medium">{t("{planet} retrograde:", { planet: t(h.retrograde.planet) })} </strong>{h.retrograde.text}</p>}
      <div className={`mt-5 rounded-2xl p-4 ${light ? "bg-ivory/10" : "bg-blush/50"}`}>
        <p className={`text-xs font-medium uppercase tracking-[0.18em] ${light ? "text-blush" : "text-plum-soft"}`}>{t("Yulia’s ritual for today")}</p>
        <p lang={rlang} className={`mt-1 font-display text-lg italic ${light ? "text-ivory" : "text-plum"}`}>{h.ritual}</p>
      </div>
      {!compact && <p lang={rlang} className={`mt-4 text-sm ${muted}`}>{h.energyNote}</p>}
      {compact && link && <Link href={`/horoscope/${h.sign.toLowerCase()}`} className={`mt-5 inline-block text-sm link-underline ${light ? "text-ivory" : "text-plum"}`}>{t("Read your full horoscope")}</Link>}
    </div>
  );
}
