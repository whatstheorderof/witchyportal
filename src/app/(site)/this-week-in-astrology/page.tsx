import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { todayKey, weekInAstrology, weekStart } from "@/lib/astro/horoscope";
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

export default async function ThisWeekPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  await connection();
  const thisMonday = weekStart(todayKey());
  const asked = (await searchParams).week;
  const allowed = [addDays(thisMonday, -7), thisMonday, addDays(thisMonday, 7)];
  const monday = asked && allowed.includes(asked) ? asked : thisMonday;
  const w = weekInAstrology(monday);
  const i = allowed.indexOf(monday);

  return (
    <>
      <JsonLd data={[
        { "@type": "Article", headline: `This week in astrology: ${w.label}`, datePublished: `${monday}T00:00:00Z`, author: { "@id": absoluteUrl("/about#yulia") }, publisher: { "@id": absoluteUrl("/#organization") }, url: absoluteUrl("/this-week-in-astrology"), image: absoluteUrl("/opengraph-image") },
        breadcrumbLd([["Horoscopes", "/horoscope"], ["This week in astrology", "/this-week-in-astrology"]]),
      ]} />
      <PageHero image="crown" eyebrow={w.label} title="This week in astrology" intro="The sky this week, for everyone: the Moon's phases, planets changing sign, retrogrades and the big meetings between planets — what they mean and how to work with them." />
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <div className="min-w-0">
          <nav aria-label="Choose a week" className="flex flex-wrap gap-2">
            {i > 0 && <Link href={allowed[i - 1] === thisMonday ? "/this-week-in-astrology" : `?week=${allowed[i - 1]}`} className="chip">← Last week</Link>}
            {i !== 1 && <Link href="/this-week-in-astrology" className="chip">This week</Link>}
            {i < 2 && <Link href={`?week=${allowed[i + 1]}`} className="chip">Next week →</Link>}
          </nav>
          {w.events.length === 0 ? (
            <p className="mt-8 text-ink/80">A quiet week in the sky — no planets change sign and there are no major lunations. Follow the Moon below.</p>
          ) : (
            <ol className="mt-8 grid gap-6">
              {w.events.map((e, k) => (
                <li key={k} className="card p-6 sm:p-8">
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
