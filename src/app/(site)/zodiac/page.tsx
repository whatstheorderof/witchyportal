import type { Metadata } from "next";
import Link from "next/link";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { ZODIAC } from "@/lib/astro/text/zodiac";
import { absoluteUrl, breadcrumbLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = pageMeta({
  title: "The 12 Signs of the Zodiac: Dates, Elements & Traits",
  description: "A guide to the twelve signs of the zodiac — dates, symbols, elements, modalities and ruling planets, and what each sign means for personality, love and work.",
  path: "/zodiac",
});

const ELEMENTS = [
  ["Fire", "Aries, Leo, Sagittarius", "Spirit, courage and enthusiasm. Fire signs act, inspire and warm everyone around them."],
  ["Earth", "Taurus, Virgo, Capricorn", "Body, patience and practicality. Earth signs build, steady and make things real."],
  ["Air", "Gemini, Libra, Aquarius", "Mind, ideas and connection. Air signs think, talk and bring people together."],
  ["Water", "Cancer, Scorpio, Pisces", "Feeling, intuition and depth. Water signs sense, care and transform."],
] as const;
const MODALITIES = [
  ["Cardinal", "Aries, Cancer, Libra, Capricorn", "Initiators. They begin each season and like to start things."],
  ["Fixed", "Taurus, Leo, Scorpio, Aquarius", "Sustainers. They hold the middle of each season and see things through."],
  ["Mutable", "Gemini, Virgo, Sagittarius, Pisces", "Adapters. They close each season and know how to change and let go."],
] as const;

export default function ZodiacPage() {
  return (
    <>
      <JsonLd data={[
        { "@type": "ItemList", name: "Signs of the zodiac", itemListElement: SIGNS.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s, url: absoluteUrl(`/zodiac/${s.toLowerCase()}`) })) },
        breadcrumbLd([["Zodiac signs", "/zodiac"]]),
      ]} />
      <PageHero image="crown" eyebrow="Astrology basics" title="The signs of the zodiac" intro="Twelve signs, four elements, three modalities. A guide to each sign's dates, symbol and ruling planet — and what it brings to personality, love and work." />

      <section className="container-page py-14 lg:py-20" aria-label="The twelve signs">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNS.map((s) => {
            const z = ZODIAC[s];
            return (
              <li key={s}>
                <Link href={`/zodiac/${s.toLowerCase()}`} className="card group flex h-full items-start gap-5 p-6 transition hover:-translate-y-0.5">
                  <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-plum-deep font-display text-3xl text-ivory">{SIGN_INFO[s].glyph}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl text-plum">{s}</span>
                    <span className="block text-sm text-muted">{z.dates}</span>
                    <span className="mt-2 block text-sm text-ink/80">{z.element} · {z.modality} · {z.ruler.replace(/ \(.*\)/, "")}</span>
                    <span className="mt-2 block text-sm text-ink/75">{z.keywords.slice(0, 3).join(", ")}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-line bg-ivory-deep/50 py-14 lg:py-20" aria-labelledby="how-h">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div className="prose-witchy">
            <h2 id="how-h">How the zodiac works</h2>
            <p>The zodiac is the band of sky the Sun, Moon and planets travel through, divided into twelve signs of 30° each. In Western astrology the signs follow the seasons: Aries begins at the spring equinox, Cancer at the summer solstice, Libra at the autumn equinox and Capricorn at the winter solstice.</p>
            <p>Your &ldquo;star sign&rdquo; is the sign the Sun was in when you were born. But every planet in your chart sits in a sign too — that&rsquo;s why your <Link href="/birth-chart">birth chart</Link> tells a much fuller story than your Sun sign alone.</p>
            <h3>Elements</h3>
            <p>Each sign belongs to one of four elements, which describe its basic temperament.</p>
          </div>
          <div className="grid content-start gap-4">
            {ELEMENTS.map(([name, signs, text]) => (
              <div key={name} className="card p-5"><p className="font-display text-2xl text-plum">{name}</p><p className="text-sm text-muted">{signs}</p><p className="mt-2 text-ink/85">{text}</p></div>
            ))}
            <h3 className="mt-4 font-display text-2xl text-plum">Modalities</h3>
            {MODALITIES.map(([name, signs, text]) => (
              <div key={name} className="card p-5"><p className="font-display text-xl text-plum">{name}</p><p className="text-sm text-muted">{signs}</p><p className="mt-2 text-ink/85">{text}</p></div>
            ))}
          </div>
        </div>
        <div className="container-page mt-12">
          <Link href="/birth-chart" className="btn-primary">Find every sign in your chart <ArrowRight /></Link>
        </div>
      </section>
    </>
  );
}
