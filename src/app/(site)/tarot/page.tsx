import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { MAJOR_ARCANA, TAROT_DEPTH, cardOfTheDay, type TarotCard } from "@/lib/tarot";
import { MINOR_ARCANA, SUITS } from "@/lib/tarot-minor";
import { CardSymbol } from "@/components/TarotCardView";
import { formatDate } from "@/lib/dates";
import { PageHero } from "@/components/Section";
import { DailyCard } from "@/components/tarot/DailyCard";
import { TarotReading } from "@/components/tarot/TarotReading";
import { RetreatPromo } from "@/components/RetreatPromo";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Tarot card of the day",
  description: "Today's tarot card with its full meaning, a free three-card reading, and the meaning of all 78 cards — Major and Minor Arcana.",
};

export default async function TarotPage() {
  await connection();
  const today = cardOfTheDay();
  return (
    <>
      <PageHero image="crownPortrait" eyebrow="Tarot" title="Card of the day" intro="One card from the full 78-card deck for everyone today — and a three-card reading of your own. For reflection, intuition and a little magic.">
        <a href="#reading" className="btn-outline mt-7">Get a three-card reading ↓</a>
      </PageHero>

      <section className="container-page py-14 lg:py-20" aria-labelledby="today">
        <DailyCard card={today} depth={TAROT_DEPTH[today.n]} dateLabel={formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: undefined })} />
      </section>

      <section className="container-page py-14 lg:py-20" aria-labelledby="arcana">
        <h2 id="arcana" className="display-md">The cards</h2>
        <p className="mt-2 max-w-2xl text-muted">A tarot deck has 78 cards. The 22 Major Arcana tell the story of a soul&rsquo;s journey; the 56 Minor Arcana, in four suits, speak to everyday life.</p>

        <h3 className="mt-10 font-display text-3xl text-plum">The Major Arcana</h3>
        <p className="mt-1 max-w-2xl text-sm text-muted">From The Fool&rsquo;s first step to The World&rsquo;s completion — the big themes and turning points.</p>
        <CardList cards={MAJOR_ARCANA} />

        <h3 className="mt-14 font-display text-3xl text-plum">The Minor Arcana</h3>
        <p className="mt-1 max-w-2xl text-sm text-muted">Four suits of fourteen cards — Ace to Ten, then Page, Knight, Queen and King.</p>
        <div className="mt-6 grid gap-4">
          {SUITS.map((suit) => (
            <details key={suit.suit} className="group/suit card p-0">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-plum text-2xl text-ivory"><CardSymbol card={MINOR_ARCANA.find((c) => c.suit === suit.suit)!} /></span>
                <span>
                  <span className="block font-display text-2xl text-plum">{suit.suit} <span className="text-base text-muted">· {suit.element}</span></span>
                  <span className="block text-sm text-muted">{suit.about}</span>
                </span>
                <span aria-hidden className="ml-auto text-2xl text-plum transition group-open/suit:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-3"><CardList cards={MINOR_ARCANA.filter((c) => c.suit === suit.suit)} /></div>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/articles/tarot-for-beginners" className="btn-outline">Tarot for beginners <ArrowRight /></Link>
          <Link href="/ask-a-witch" className="btn-outline">Watch Yulia&rsquo;s readings</Link>
        </div>
        <p className="mt-6 text-xs text-muted">Tarot is offered for reflection and entertainment.</p>
      </section>

      <section id="reading" className="scroll-mt-24 bg-ivory-deep py-14 lg:py-20" aria-labelledby="reading-title">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Your reading</p>
            <h2 id="reading-title" className="display-md mt-2">A three-card reading</h2>
            <p className="mt-3 text-muted">Choose a spread, shuffle the deck and turn over your cards. Each one is read for its place in the spread, then together.</p>
          </div>
          <div className="mt-10"><TarotReading /></div>
        </div>
      </section>
      <RetreatPromo eyebrow="Readings in person" title="Powerful tarot readings are part of every retreat" />
    </>
  );
}

function CardList({ cards }: { cards: TarotCard[] }) {
  return (
    <div className="mt-4 divide-y divide-line border-y border-line">
      {cards.map((c) => (
        <details key={c.n} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
            <span className="w-10 shrink-0 font-display text-xl text-plum-soft">{c.numeral}</span>
            <span className="font-display text-xl text-plum">{c.name}</span>
            <span className="hidden text-sm text-muted sm:inline">{c.keywords}</span>
            <span aria-hidden className="ml-auto text-2xl text-plum transition group-open:rotate-45">+</span>
          </summary>
          <div className="grid gap-2 pb-5 pl-14 text-[0.97rem]">
            <p className="text-ink/80">{TAROT_DEPTH[c.n].meaning}</p>
            <p><strong className="font-medium text-plum">Upright:</strong> {c.upright}</p>
            <p><strong className="font-medium text-plum">Reversed:</strong> {c.reversed}</p>
            <p className="text-muted">Reflect: {c.prompt}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
