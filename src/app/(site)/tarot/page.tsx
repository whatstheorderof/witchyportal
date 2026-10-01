import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { MAJOR_ARCANA, cardOfTheDay } from "@/lib/tarot";
import { formatDate } from "@/lib/dates";
import { PageHero } from "@/components/Section";
import { TarotFace } from "@/components/TarotCardView";
import { TarotPull } from "@/components/TarotPull";
import { RetreatPromo } from "@/components/RetreatPromo";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Tarot card of the day",
  description: "Today's tarot card from the Major Arcana, plus draw your own card for a moment of reflection.",
};

export default async function TarotPage() {
  await connection();
  const today = cardOfTheDay();
  return (
    <>
      <PageHero eyebrow="Tarot" title="Card of the day" intro="One card from the Major Arcana for everyone today — and a deck to draw your own. For reflection, intuition and a little magic." />

      <section className="container-page py-14 lg:py-20" aria-labelledby="today">
        <div className="grid items-center gap-10 sm:grid-cols-[260px_1fr] sm:gap-14">
          <div className="mx-auto w-full max-w-[260px]"><TarotFace card={today} /></div>
          <div>
            <p className="eyebrow">{formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: undefined })}</p>
            <h2 id="today" className="display-lg mt-2">{today.name}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-plum-soft">{today.keywords}</p>
            <p className="mt-5 text-xl leading-relaxed text-ink/85">{today.upright}</p>
            <p className="mt-5 rounded-2xl bg-blush/60 p-5 font-display text-2xl italic text-plum">{today.prompt}</p>
          </div>
        </div>
      </section>

      <section className="bg-ivory-deep py-14 lg:py-20" aria-labelledby="draw">
        <div className="container-page">
          <h2 id="draw" className="sr-only">Draw your own card</h2>
          <TarotPull />
        </div>
      </section>

      <section className="container-page py-14 lg:py-20" aria-labelledby="arcana">
        <h2 id="arcana" className="display-md">The Major Arcana</h2>
        <p className="mt-2 max-w-2xl text-muted">The 22 cards of the Major Arcana tell the story of a soul&rsquo;s journey, from The Fool&rsquo;s first step to The World&rsquo;s completion.</p>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {MAJOR_ARCANA.map((c) => (
            <details key={c.n} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
                <span className="w-10 font-display text-xl text-plum-soft">{c.numeral}</span>
                <span className="font-display text-xl text-plum">{c.name}</span>
                <span className="hidden text-sm text-muted sm:inline">{c.keywords}</span>
                <span aria-hidden className="ml-auto text-2xl text-plum transition group-open:rotate-45">+</span>
              </summary>
              <div className="grid gap-2 pb-5 pl-14 text-[0.97rem]">
                <p><strong className="font-medium text-plum">Upright:</strong> {c.upright}</p>
                <p><strong className="font-medium text-plum">Reversed:</strong> {c.reversed}</p>
                <p className="text-muted">Reflect: {c.prompt}</p>
              </div>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/articles/tarot-for-beginners" className="btn-outline">Tarot for beginners <ArrowRight /></Link>
          <Link href="/ask-a-witch" className="btn-outline">Watch Yulia&rsquo;s readings</Link>
        </div>
        <p className="mt-6 text-xs text-muted">Tarot is offered for reflection and entertainment.</p>
      </section>
      <RetreatPromo eyebrow="Readings in person" title="Powerful tarot readings are part of every retreat" />
    </>
  );
}
