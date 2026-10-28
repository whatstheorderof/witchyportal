import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { dailyHoroscope, todayKey } from "@/lib/astro/horoscope";
import { moonPhaseAt, positionsAt, ukTime } from "@/lib/astro/sky";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { MoonGlyph } from "@/components/MoonGlyph";
import { YourDay } from "@/components/stars/YourDay";

export const metadata: Metadata = pageMeta({
  title: "Daily Horoscopes for Every Star Sign | Witchy Portal",
  absoluteTitle: true,
  description: "Free daily horoscopes for all twelve signs from Yulia Moon, read from today's real sky — plus monthly horoscopes and this week in astrology.",
  path: "/horoscope",
});

export default async function HoroscopeHub() {
  await connection();
  const day = todayKey();
  const noon = ukTime(day, "12:00");
  const pos = positionsAt(noon);
  const moon = pos.find((p) => p.body === "Moon")!;
  const phase = moonPhaseAt(noon);
  const retro = pos.filter((p) => p.retrograde);
  const label = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${day}T12:00:00Z`));
  return (
    <>
      <JsonLd data={[breadcrumbLd([["Horoscopes", "/horoscope"]]), { "@type": "ItemList", name: "Daily horoscopes", itemListElement: SIGNS.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: `${s} horoscope`, url: absoluteUrl(`/horoscope/${s.toLowerCase()}`) })) }]} />
      <PageHero image="veil" eyebrow={label} title="Daily horoscopes" intro="What's in store for you today, read from the real sky — the Moon's journey through your chart, its phase and its meetings with the planets — in Yulia's words, with a small ritual for every day." />
      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr] lg:py-16">
        <YourDay />
        <div className="grid content-start gap-6">
          <div className="card flex items-center gap-5 p-6">
            <MoonGlyph angle={phase.angle} size={72} glow={false} />
            <div>
              <p className="eyebrow">Today&rsquo;s sky</p>
              <p className="mt-1 font-display text-2xl text-plum">{phase.name} in {moon.sign}</p>
              <p className="text-sm text-muted">{Math.round(phase.illumination * 100)}% lit · Sun in {pos[0].sign}</p>
              {retro.length > 0 && <p className="mt-1 text-sm text-muted">Retrograde: {retro.map((r) => `${r.body} in ${r.sign}`).join(", ")}</p>}
            </div>
          </div>
          <Link href="/this-week-in-astrology" className="card group p-6"><p className="eyebrow">For everyone</p><p className="mt-1 font-display text-2xl text-plum">This week in astrology</p><p className="text-sm text-muted">The week&rsquo;s New and Full Moons, planets changing sign and the big aspects.</p></Link>
          <Link href="/moon/phases" className="card group p-6"><p className="eyebrow">Moon magic</p><p className="mt-1 font-display text-2xl text-plum">Moon phases guide</p><p className="text-sm text-muted">What each phase is for, and when the next one falls.</p></Link>
        </div>
      </section>
      <section className="container-page pb-16" aria-labelledby="signs-h">
        <h2 id="signs-h" className="display-md">Choose your sign</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNS.map((s) => {
            const h = dailyHoroscope(s, day);
            return (
              <li key={s}>
                <Link href={`/horoscope/${s.toLowerCase()}`} className="card flex h-full gap-4 p-5 transition hover:-translate-y-0.5">
                  <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-plum-deep font-display text-2xl text-ivory">{SIGN_INFO[s].glyph}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl text-plum">{s}</span>
                    <span className="block text-[0.95rem] text-ink/80">{h.headline}</span>
                    <span className="mt-1 block text-xs text-muted">Read today&rsquo;s horoscope</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
