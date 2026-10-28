import Link from "next/link";
import type { DailyHoroscope } from "@/lib/astro/horoscope";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { MoonGlyph } from "@/components/MoonGlyph";

export function Ratings({ ratings, light = false }: { ratings: DailyHoroscope["ratings"]; light?: boolean }) {
  return (
    <dl className="grid grid-cols-3 gap-2">
      {(["love", "work", "energy"] as const).map((k) => (
        <div key={k} className={`rounded-2xl px-3 py-2 text-center ${light ? "bg-ivory/10" : "bg-white/70 ring-1 ring-line"}`}>
          <dt className={`text-[0.68rem] uppercase tracking-[0.18em] ${light ? "text-ivory/75" : "text-plum-soft"}`}>{k}</dt>
          <dd className="mt-0.5" aria-label={`${ratings[k]} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => <span key={i} aria-hidden className={i < ratings[k] ? (light ? "text-gold" : "text-plum") : light ? "text-ivory/25" : "text-line"}>★</span>)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const dayLabel = (day: string) => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));

/** At-a-glance astrological day for one sign. `compact` for the splash and side cards. */
export function DayCard({ h, compact = false, light = false, link = true }: { h: DailyHoroscope; compact?: boolean; light?: boolean; link?: boolean }) {
  const muted = light ? "text-ivory/80" : "text-ink/80";
  return (
    <div>
      <div className="flex items-center gap-4">
        <MoonGlyph angle={h.moon.angle} size={compact ? 56 : 72} glow={light} />
        <div>
          <p className={`eyebrow ${light ? "text-blush" : ""}`}>{dayLabel(h.day)}</p>
          <p className={`mt-1 text-sm ${muted}`}>{h.moon.phase} in {h.moon.sign} · {Math.round(h.moon.illumination * 100)}% lit{h.moon.entersSign ? ` · enters ${h.moon.entersSign.sign} at ${h.moon.entersSign.time}` : ""}</p>
        </div>
      </div>
      <h3 className={`mt-5 font-display text-3xl leading-tight sm:text-4xl ${light ? "text-ivory" : "text-plum"}`}><span aria-hidden className="mr-2">{SIGN_INFO[h.sign].glyph}</span>{h.headline}</h3>
      <p className={`mt-1 text-sm ${muted}`}>Today&rsquo;s focus for {h.sign}: {h.focus}</p>
      <div className="mt-5"><Ratings ratings={h.ratings} light={light} /></div>
      <div className={`mt-5 grid gap-3 leading-relaxed ${light ? "text-ivory/90" : "text-ink/85"}`}>
        {(compact ? h.paragraphs.slice(0, 1) : h.paragraphs).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      {!compact && h.retrograde && <p className={`mt-4 rounded-2xl p-4 text-[0.95rem] ${light ? "bg-ivory/10" : "bg-lavender/35 text-plum"}`}><strong className="font-medium">{h.retrograde.planet} retrograde: </strong>{h.retrograde.text}</p>}
      <div className={`mt-5 rounded-2xl p-4 ${light ? "bg-ivory/10" : "bg-blush/50"}`}>
        <p className={`text-xs font-medium uppercase tracking-[0.18em] ${light ? "text-blush" : "text-plum-soft"}`}>Yulia&rsquo;s ritual for today</p>
        <p className={`mt-1 font-display text-lg italic ${light ? "text-ivory" : "text-plum"}`}>{h.ritual}</p>
      </div>
      {!compact && <p className={`mt-4 text-sm ${muted}`}>{h.energyNote}</p>}
      {compact && link && <Link href={`/horoscope/${h.sign.toLowerCase()}`} className={`mt-5 inline-block text-sm link-underline ${light ? "text-ivory" : "text-plum"}`}>Read your full horoscope</Link>}
    </div>
  );
}
