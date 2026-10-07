"use client";

import { useEffect, useRef, useState } from "react";
import type { TarotCard, TarotDepth } from "@/lib/tarot";
import { FlipCard, ShufflingDeck, prefersReducedMotion, wait } from "./TarotAnimated";

type Phase = "waiting" | "shuffle" | "draw" | "flip" | "done";

/**
 * Today's card: the deck shuffles, one card is drawn and turned over, then the
 * reading fades in. The reading is in the page from the start for search
 * engines and screen readers; the animation is decorative.
 */
export function DailyCard({ card, depth, dateLabel }: { card: TarotCard; depth: TarotDepth; dateLabel: string }) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const area = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const cancelled = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const t = setTimeout(() => setPhase("done"), 0);
      return () => clearTimeout(t);
    }
    const el = area.current;
    if (!el) return;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        await wait(250);
        for (const [p, ms] of [["shuffle", 1700], ["draw", 650], ["flip", 900]] as const) {
          if (cancelled.current) return;
          setPhase(p);
          await wait(ms);
        }
        if (!cancelled.current) setPhase("done");
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const skip = () => {
    cancelled.current = true;
    setPhase("done");
  };
  const revealed = phase === "done";
  const showDeck = phase === "waiting" || phase === "shuffle";

  return (
    <div className="grid items-center gap-10 sm:grid-cols-[260px_1fr] sm:gap-14">
      <div ref={area} className="relative mx-auto w-full max-w-[220px] sm:max-w-[260px]">
        {showDeck ? (
          <ShufflingDeck shuffling={phase === "shuffle"} />
        ) : (
          <div className={phase === "draw" ? "tarot-deal" : ""}>
            <FlipCard card={card} flipped={phase === "flip" || phase === "done"} />
          </div>
        )}
        {!revealed && (
          <div className="mt-5 flex flex-col items-center gap-2">
            <p className="text-sm text-muted" aria-hidden>{phase === "waiting" ? "Your card is waiting…" : phase === "shuffle" ? "Shuffling the deck…" : "Drawing today's card…"}</p>
            <button type="button" onClick={skip} className="text-sm text-plum underline underline-offset-4">Skip to today&rsquo;s card</button>
          </div>
        )}
      </div>

      <div className={`transition-all duration-700 ${revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
        <p className="eyebrow">{dateLabel}</p>
        <h2 id="today" className="display-lg mt-2">{card.name}</h2>
        <p className="mt-2 text-sm uppercase tracking-[0.15em] text-plum-soft">{card.keywords}</p>
        <p className="mt-5 text-xl leading-relaxed text-ink/90">{card.upright}</p>
        <p className="mt-4 leading-relaxed text-ink/80">{depth.meaning}</p>
        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          {([["Love", depth.love], ["Work", depth.work], ["Spirit", depth.spirit]] as const).map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white/70 p-4 ring-1 ring-line">
              <dt className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{k}</dt>
              <dd className="mt-1 text-[0.95rem] text-ink/85">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 rounded-2xl bg-blush/60 p-5 font-display text-2xl italic text-plum">{card.prompt}</p>
        <p className="mt-3 text-sm text-muted"><span className="font-medium text-ink/80">If it appears reversed:</span> {card.reversed}</p>
      </div>
    </div>
  );
}
