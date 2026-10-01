"use client";

import { useState } from "react";
import { MAJOR_ARCANA, type TarotCard } from "@/lib/tarot";
import { TarotBack, TarotFace } from "./TarotCardView";

export function TarotPull() {
  const [pull, setPull] = useState<{ card: TarotCard; reversed: boolean } | null>(null);
  const [n, setN] = useState(0);

  function draw() {
    const buf = new Uint32Array(2);
    crypto.getRandomValues(buf);
    setPull({ card: MAJOR_ARCANA[buf[0] % MAJOR_ARCANA.length], reversed: buf[1] % 4 === 0 });
    setN((x) => x + 1);
  }

  return (
    <div className="grid items-center gap-8 sm:grid-cols-[240px_1fr] sm:gap-12">
      <div className="mx-auto w-full max-w-[240px]">
        {pull ? <div key={n} className="reveal"><TarotFace card={pull.card} reversed={pull.reversed} /></div> : <TarotBack />}
      </div>
      <div aria-live="polite">
        {pull ? (
          <>
            <p className="eyebrow">You drew</p>
            <h3 className="display-md mt-2">{pull.card.name}{pull.reversed ? " (reversed)" : ""}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.15em] text-plum-soft">{pull.card.keywords}</p>
            <p className="mt-4 text-lg text-ink/85">{pull.reversed ? pull.card.reversed : pull.card.upright}</p>
            <p className="mt-4 rounded-2xl bg-lavender/40 p-4 text-plum"><span className="font-medium">Reflect:</span> {pull.card.prompt}</p>
          </>
        ) : (
          <>
            <h3 className="display-md">Ask your question</h3>
            <p className="mt-3 text-lg text-ink/80">Take a breath, hold a question gently in your mind, then draw a card from the Major Arcana.</p>
          </>
        )}
        <button type="button" onClick={draw} className="btn-primary mt-6">{pull ? "Draw another card" : "Draw a card"}</button>
      </div>
    </div>
  );
}
