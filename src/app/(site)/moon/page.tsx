import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { FULL_MOON_NAMES, PHASE_GUIDANCE, moonNow, upcomingMoons } from "@/lib/astro/moon";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { formatDate, SITE_TIMEZONE } from "@/lib/dates";
import { MoonGlyph } from "@/components/MoonGlyph";
import { PageHero } from "@/components/Section";
import { RetreatPromo } from "@/components/RetreatPromo";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Moon calendar",
  description: "Tonight's moon phase and the dates of the next new and full moons, with a simple ritual for each.",
};

const time = (d: Date) => new Intl.DateTimeFormat("en-GB", { timeZone: SITE_TIMEZONE, hour: "2-digit", minute: "2-digit" }).format(d);

export default async function MoonPage() {
  await connection();
  const now = moonNow();
  const guide = PHASE_GUIDANCE[now.phaseKey];
  const events = upcomingMoons(12);
  const next = events[0];

  return (
    <>
      <PageHero eyebrow="Moon calendar" title="Live by the moon" intro="Where the Moon is tonight, what each phase is good for, and every new and full moon for the next six months." />

      <section className="container-page py-14 lg:py-20" aria-labelledby="tonight">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2rem] bg-plum-deep p-8 text-ivory sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-16">
          <MoonGlyph angle={now.angle} size={200} className="mx-auto" />
          <div>
            <p className="eyebrow text-blush">Tonight</p>
            <h2 id="tonight" className="display-md mt-2 text-ivory">{now.phaseName} in {now.sign}</h2>
            <p className="mt-2 text-ivory/75">{Math.round(now.illumination * 100)}% illuminated · {now.waxing ? "waxing (growing)" : "waning (shrinking)"}</p>
            <div className="mt-6 rounded-2xl bg-ivory/10 p-5">
              <p className="font-display text-2xl text-blush">{guide.theme}</p>
              <p className="mt-2 text-ivory/85">{guide.ritual}</p>
            </div>
            {next && (
              <p className="mt-5 text-ivory/80">
                Next: <strong className="text-ivory">{next.kind === "new" ? "New Moon" : FULL_MOON_NAMES[next.date.getUTCMonth()]}</strong> in {next.sign} on {formatDate(next.date, { weekday: "long", day: "numeric", month: "long", year: undefined })} at {time(next.date)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-page pb-14 lg:pb-20" aria-labelledby="calendar">
        <h2 id="calendar" className="display-md">Coming up</h2>
        <p className="mt-2 text-muted">Times shown in UK time.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <li key={e.date.toISOString()} className="card flex items-center gap-4 p-5">
              <MoonGlyph angle={e.kind === "new" ? 0 : 180} size={52} />
              <div>
                <p className="font-display text-2xl leading-tight text-plum">
                  {e.kind === "new" ? "New Moon" : "Full Moon"} in {e.sign} <span aria-hidden className="text-lg">{SIGN_INFO[e.sign].glyph}</span>
                </p>
                <p className="text-sm text-muted">
                  {formatDate(e.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · {time(e.date)}
                  {e.kind === "full" && <> · {FULL_MOON_NAMES[e.date.getUTCMonth()]}</>}
                </p>
                <p className="mt-1 text-sm text-ink/75">{e.kind === "new" ? "Set intentions" : "Release & give thanks"} · {SIGN_INFO[e.sign].keywords}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/articles/beginners-guide-to-moon-rituals" className="btn-outline">A beginner&rsquo;s guide to moon rituals <ArrowRight /></Link>
          <Link href="/astrology" className="btn-outline">Astrology posts</Link>
        </div>
        <p className="mt-6 text-xs text-muted">Calculated with Astronomy Engine. Full moon names are traditional Northern Hemisphere names.</p>
      </section>
      <RetreatPromo eyebrow="Dance under the stars" />
    </>
  );
}
