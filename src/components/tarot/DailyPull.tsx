"use client";

import { useEffect, useState } from "react";
import Link from "@/i18n/client";
import type { TarotCard, TarotDepth } from "@/lib/tarot";
import { FlipCard, ShufflingDeck, prefersReducedMotion, wait } from "./TarotAnimated";
import { useI18n } from "@/i18n/client";
import { pullForToday, streak, type DailyPull as Pull } from "@/lib/daily-ritual";
import { ShareImage } from "@/components/ShareImage";
import { track } from "@/components/Track";

type Phase = "loading" | "ready" | "shuffle" | "flip" | "done";

/**
 * "Your card for today": one card per visitor per UK day, drawn once and kept
 * on this device, with a streak for coming back each day.
 */
export function DailyPull({ deck, depth }: { deck: TarotCard[]; depth: Record<number, TarotDepth> }) {
  const { t, rlang } = useI18n();
  const [pull, setPull] = useState<Pull | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [days, setDays] = useState(0);

  useEffect(() => {
    const p = pullForToday(deck.length);
    const id = setTimeout(() => {
      setPull(p);
      setDays(streak());
      setPhase(p ? "done" : "ready");
    }, 0);
    return () => clearTimeout(id);
  }, [deck.length]);

  async function draw() {
    const p = pullForToday(deck.length, true)!;
    track("daily_pull");
    setPull(p);
    setDays(streak());
    if (prefersReducedMotion()) return setPhase("done");
    setPhase("shuffle");
    await wait(1400);
    setPhase("flip");
    await wait(900);
    setPhase("done");
  }

  const card = pull ? deck[pull.n] : null;
  const d = card ? depth[card.n] : null;

  return (
    <div className="grid items-center gap-10 sm:grid-cols-[220px_1fr] sm:gap-14">
      <div className="relative mx-auto w-full max-w-[200px] sm:max-w-[220px]">
        {phase === "loading" || phase === "ready" || phase === "shuffle" || !card ? (
          <ShufflingDeck shuffling={phase === "shuffle"} />
        ) : (
          <FlipCard card={card} reversed={pull!.reversed} flipped={phase === "done" || phase === "flip"} />
        )}
      </div>
      <div aria-live="polite">
        <p className="eyebrow">{t("Your card for today")}</p>
        {phase === "ready" && (
          <>
            <h2 className="display-md mt-2">{t("Draw your own card")}</h2>
            <p className="mt-3 max-w-xl text-ink/80">{t("One card, just for you, once a day. It stays the same until midnight — come back tomorrow for the next one.")}</p>
            <button type="button" onClick={draw} className="btn-primary mt-6">{t("Draw my card")}</button>
          </>
        )}
        {phase === "shuffle" && <p className="mt-2 text-muted">{t("Shuffling the deck…")}</p>}
        {(phase === "flip" || phase === "done") && card && d && (
          <div lang={rlang} className={`transition-opacity duration-700 ${phase === "done" ? "opacity-100" : "opacity-0"}`}>
            <h2 className="display-md mt-2">{card.name}{pull!.reversed && <span className="text-plum-soft"> · {t("Reversed")}</span>}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-plum-soft">{d.theme}</p>
            <p className="mt-4 text-lg leading-relaxed text-ink/90">{pull!.reversed ? card.reversed : card.upright}</p>
            <p className="mt-4 rounded-2xl bg-blush/60 p-4 font-display text-xl italic text-plum">{card.prompt}</p>
            <p className="mt-4 text-sm font-medium text-plum">
              {days > 1 ? t("{n} days in a row — see you tomorrow.", { n: days }) : t("Come back tomorrow for your next card.")}
            </p>
            <div className="mt-5 flex flex-wrap items-start gap-3">
              <ShareImage query={{ kind: "tarot", n: card.n, r: pull!.reversed ? 1 : 0 }} filename={`card-of-the-day-${card.n}`} className="btn-primary" />
              <Link href={`/journal?add=tarot&n=${card.n}&r=${pull!.reversed ? 1 : 0}`} className="btn-outline">{t("Write about it in my journal")}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
