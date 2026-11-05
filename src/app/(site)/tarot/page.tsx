import Link from "@/i18n/client";
import { getI18n } from "@/i18n/server";
import { getReadings, type Rx } from "@/i18n/readings";
import { localeMeta } from "@/i18n/meta";
import type { T } from "@/i18n/server";
import { connection } from "next/server";
import { FULL_DECK, MAJOR_ARCANA, SPREADS, TAROT_DEPTH, cardOfTheDay, type TarotCard } from "@/lib/tarot";
import { MINOR_ARCANA, SUITS } from "@/lib/tarot-minor";
import { CardSymbol } from "@/components/TarotCardView";
import { formatDate } from "@/lib/dates";
import { PageHero } from "@/components/Section";
import { DailyCard } from "@/components/tarot/DailyCard";
import { TarotReading } from "@/components/tarot/TarotReading";
import { RetreatPromo } from "@/components/RetreatPromo";
import { ArrowRight } from "@/components/Icons";

export async function generateMetadata() {
  const rx = await getReadings();
  return localeMeta({
    title: rx.t("Tarot card of the day & free three-card reading"),
    description: rx("Today's tarot card with its full meaning, a free three-card tarot reading, and the meaning of all 78 cards — Major and Minor Arcana."),
    path: "/tarot",
  });
}

export default async function TarotPage() {
  await connection();
  const [{ t, info }, rx] = await Promise.all([getI18n(), getReadings()]);
  const today = rx.deep(cardOfTheDay());
  const deck = rx.deep(FULL_DECK), depth = rx.deep(TAROT_DEPTH), spreads = rx.deep(SPREADS);
  return (
    <>
      <PageHero image="crownPortrait" eyebrow={t("Tarot")} title={t("Card of the day")} intro={rx("One card from the full 78-card deck for everyone today — and a three-card reading of your own. For reflection, intuition and a little magic.")}>
        <a href="#reading" className="btn-outline mt-7">{t("Get a three-card reading ↓")}</a>
      </PageHero>

      <section className="container-page py-14 lg:py-20" aria-labelledby="today">
        <DailyCard card={today} depth={depth[today.n]} dateLabel={formatDate(new Date(), { weekday: "long", day: "numeric", month: "long", year: undefined }, info.intl)} />
      </section>

      <section className="container-page py-14 lg:py-20" aria-labelledby="arcana">
        <h2 id="arcana" className="display-md">{t("The cards")}</h2>
        <p className="mt-2 max-w-2xl text-muted">{rx("A tarot deck has 78 cards. The 22 Major Arcana tell the story of a soul’s journey; the 56 Minor Arcana, in four suits, speak to everyday life.")}</p>

        <h3 className="mt-10 font-display text-3xl text-plum">{t("The Major Arcana")}</h3>
        <p className="mt-1 max-w-2xl text-sm text-muted">{rx("From The Fool’s first step to The World’s completion — the big themes and turning points.")}</p>
        <CardList cards={rx.deep(MAJOR_ARCANA)} depth={depth} t={t} rx={rx} />

        <h3 className="mt-14 font-display text-3xl text-plum">{t("The Minor Arcana")}</h3>
        <p className="mt-1 max-w-2xl text-sm text-muted">{rx("Four suits of fourteen cards — Ace to Ten, then Page, Knight, Queen and King.")}</p>
        <div className="mt-6 grid gap-4">
          {SUITS.map((suit) => (
            <details key={suit.suit} className="group/suit card p-0">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-plum text-2xl text-ivory"><CardSymbol card={MINOR_ARCANA.find((c) => c.suit === suit.suit)!} /></span>
                <span>
                  <span className="block font-display text-2xl text-plum">{t(suit.suit)} <span className="text-base text-muted">· {t(suit.element)}</span></span>
                  <span lang={rx.lang} className="block text-sm text-muted">{rx(suit.about)}</span>
                </span>
                <span aria-hidden className="ms-auto text-2xl text-plum transition group-open/suit:rotate-45">+</span>
              </summary>
              <div className="px-5 pb-3"><CardList cards={rx.deep(MINOR_ARCANA.filter((c) => c.suit === suit.suit))} depth={depth} t={t} rx={rx} /></div>
            </details>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/articles/tarot-for-beginners" className="btn-outline">{t("Tarot for beginners")} <ArrowRight /></Link>
          <Link href="/ask-a-witch" className="btn-outline">{t("Watch Yulia’s readings")}</Link>
        </div>
        <p className="mt-6 text-xs text-muted">{t("Tarot is offered for reflection and entertainment.")}</p>
      </section>

      <section id="reading" className="scroll-mt-24 bg-ivory-deep py-14 lg:py-20" aria-labelledby="reading-title">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{t("Your reading")}</p>
            <h2 id="reading-title" className="display-md mt-2">{t("A three-card reading")}</h2>
            <p className="mt-3 text-muted">{rx("Choose a spread, shuffle the deck and turn over your cards. Each one is read for its place in the spread, then together.")}</p>
          </div>
          <div className="mt-10">{rx.locale === "en" ? <TarotReading /> : <TarotReading deck={deck} depth={depth} spreads={spreads} />}</div>
        </div>
      </section>
      <RetreatPromo eyebrow={t("Readings in person")} title={t("Powerful tarot readings are part of every retreat")} />
    </>
  );
}

function CardList({ cards, depth, t, rx }: { cards: TarotCard[]; depth: typeof TAROT_DEPTH; t: T; rx: Rx }) {
  return (
    <div lang={rx.lang} className="mt-4 divide-y divide-line border-y border-line">
      {cards.map((c) => (
        <details key={c.n} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
            <span className="w-10 shrink-0 font-display text-xl text-plum-soft">{c.numeral}</span>
            <span className="font-display text-xl text-plum">{c.name}</span>
            <span className="hidden text-sm text-muted sm:inline">{c.keywords}</span>
            <span aria-hidden className="ms-auto text-2xl text-plum transition group-open:rotate-45">+</span>
          </summary>
          <div className="grid gap-2 pb-5 ps-14 text-[0.97rem]">
            <p className="text-ink/80">{depth[c.n].meaning}</p>
            <p><strong className="font-medium text-plum">{t("Upright:")}</strong> {c.upright}</p>
            <p><strong className="font-medium text-plum">{t("Reversed:")}</strong> {c.reversed}</p>
            <p className="text-muted">{t("Reflect:")} {c.prompt}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
