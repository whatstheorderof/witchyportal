import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { todayKey, weekInAstrology, weekStart } from "@/lib/astro/horoscope";
import { MoonGlyph } from "@/components/MoonGlyph";
import { addDays } from "@/lib/astro/sky";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";

export const metadata: Metadata = pageMeta({
  title: "This Week in Astrology | Witchy Portal",
  absoluteTitle: true,
  description: "This week in astrology with Yulia Moon: the New and Full Moons, planets changing sign, retrogrades and the big aspects — what they mean and how to work with them.",
  path: "/this-week-in-astrology",
});

const KIND_LABEL = { lunation: "Moon", ingress: "Sign change", station: "Retrograde", aspect: "Aspect" } as const;
const KIND_DOT = { lunation: "bg-plum", ingress: "bg-blush-deep", station: "bg-warning", aspect: "bg-lavender-deep" } as const;

export default async function ThisWeekPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  await connection();
  const thisMonday = weekStart(todayKey());
  const asked = (await searchParams).week;
  const allowed = [addDays(thisMonday, -7), thisMonday, addDays(thisMonday, 7)];
  const monday = asked && allowed.includes(asked) ? asked : thisMonday;
  const w = weekInAstrology(monday);
  const i = allowed.indexOf(monday);
  const today = todayKey();

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `This week in astrology: ${w.label}`, datePublished: `${monday}T00:00:00Z`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl("/this-week-in-astrology"), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Horoscopes", "/horoscope"], ["This week in astrology", "/this-week-in-astrology"]]),
      ]} />
      <PageHero image="crown" eyebrow={w.label} title="This week in astrology" intro="The sky this week, for everyone: the Moon's phases, planets changing sign, retrogrades and the big meetings between planets — what they mean and how to work with them." />
      <section className="container-page pt-12 lg:pt-16" aria-labelledby="cal-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="cal-h" className="display-md">The week at a glance</h2>
            <nav aria-label="Choose a week" className="mt-3 flex flex-wrap gap-2">
            {i > 0 && <Link href={allowed[i - 1] === thisMonday ? "/this-week-in-astrology" : `?week=${allowed[i - 1]}`} className="chip">← Last week</Link>}
            {i !== 1 && <Link href="/this-week-in-astrology" className="chip">This week</Link>}
            {i < 2 && <Link href={`?week=${allowed[i + 1]}`} className="chip">Next week →</Link>}
          </nav>
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted" aria-label="Key">
            {(Object.keys(KIND_LABEL) as (keyof typeof KIND_LABEL)[]).map((k) => (
              <li key={k} className="flex items-center gap-1.5"><span aria-hidden className={`h-2.5 w-2.5 rounded-full ${KIND_DOT[k]}`} />{KIND_LABEL[k]}</li>
            ))}
          </ul>
        </div>
        <ol className="mt-6 grid gap-2 lg:grid-cols-7">
          {w.days.map((d) => {
            const isToday = d.day === today;
            return (
              <li key={d.day} aria-current={isToday ? "date" : undefined} className={`grid content-start gap-3 rounded-2xl p-4 lg:min-h-64 ${isToday ? "bg-plum-deep text-ivory" : "bg-white/70 ring-1 ring-line"}`}>
                <div className="flex items-center justify-between gap-3 lg:grid lg:justify-items-center lg:text-center">
                  <p>
                    <span className={`block text-xs font-medium uppercase tracking-[0.18em] ${isToday ? "text-blush" : "text-plum-soft"}`}>{d.weekday}{isToday ? " · today" : ""}</span>
                    <span className="font-display text-xl">{d.date}</span>
                  </p>
                  <span className="flex items-center gap-2 lg:grid lg:justify-items-center lg:gap-1">
                    <span className={`rounded-full ${isToday ? "" : "bg-plum-deep"} p-0.5`}><MoonGlyph angle={d.moon.angle} size={34} glow={false} /></span>
                    <span className={`text-xs leading-tight ${isToday ? "text-ivory/85" : "text-muted"}`}>
                      <span className="block">Moon in {d.moon.sign}</span>
                      {d.moon.entersSign && <span className="block">→ {d.moon.entersSign.sign} {d.moon.entersSign.time}</span>}
                    </span>
                  </span>
                </div>
                {d.events.length > 0 ? (
                  <ul className="grid gap-1.5">
                    {d.events.map((e) => (
                      <li key={e.id}>
                        <a href={`#${e.id}`} className={`flex gap-2 rounded-lg px-2 py-1.5 text-sm leading-snug ${isToday ? "hover:bg-ivory/10" : "hover:bg-ivory-deep"}`}>
                          <span aria-hidden className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${KIND_DOT[e.kind]}`} />
                          <span><span className={`block text-xs ${isToday ? "text-ivory/70" : "text-muted"}`}>{e.time}</span>{e.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-sm ${isToday ? "text-ivory/70" : "text-muted"}`}>Follow the Moon.</p>
                )}
              </li>
            );
          })}
        </ol>
      </section>
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <div className="min-w-0">
          <h2 className="display-md">In detail</h2>
          {w.events.length === 0 ? (
            <p className="mt-8 text-ink/80">A quiet week in the sky — no planets change sign and there are no major lunations. Follow the Moon below.</p>
          ) : (
            <ol className="mt-8 grid gap-6">
              {w.events.map((e) => (
                <li key={e.id} id={e.id} className="card scroll-mt-28 p-6 sm:p-8">
                  <p className="text-sm text-muted"><span className="mr-2 rounded-full bg-lavender/60 px-2.5 py-0.5 text-xs font-medium text-plum">{KIND_LABEL[e.kind]}</span>{e.when}</p>
                  <h2 className="mt-2 font-display text-2xl text-plum sm:text-3xl">{e.title}</h2>
                  {e.paragraphs.length > 0 ? <div className="mt-3 grid gap-3 leading-relaxed text-ink/85">{e.paragraphs.map((p, j) => <p key={j}>{p}</p>)}</div> : <p className="mt-2 text-ink/75">A quarter Moon — a natural checkpoint. Review your intentions and adjust course.</p>}
                </li>
              ))}
            </ol>
          )}
        </div>
        <aside className="grid content-start gap-6">
          <section className="card p-6" aria-labelledby="moon-h">
            <h2 id="moon-h" className="font-display text-2xl text-plum">The Moon this week</h2>
            <ul className="mt-4 grid gap-4">
              {w.moonDays.map((m, k) => (
                <li key={k}>
                  <p className="font-medium text-plum"><span aria-hidden className="mr-1">{SIGN_INFO[m.sign].glyph}</span>Moon in {m.sign}</p>
                  <p className="text-xs text-muted">From {m.from}</p>
                  <p className="mt-1 text-sm text-ink/80">{m.text}</p>
                </li>
              ))}
            </ul>
          </section>
          {w.retrogrades.length > 0 && (
            <section className="card p-6"><h2 className="font-display text-xl text-plum">Retrograde this week</h2><ul className="mt-3 grid gap-1 text-sm">{w.retrogrades.map((r) => <li key={r.planet}>{r.planet} in {r.sign}</li>)}</ul></section>
          )}
          <Link href="/horoscope" className="btn-primary justify-center">Your daily horoscope</Link>
        </aside>
      </div>
    </>
  );
}
