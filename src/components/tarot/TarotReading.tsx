"use client";

import { useRef, useState } from "react";
import { FULL_DECK, SPREADS, TAROT_DEPTH, isMajor, type TarotCard } from "@/lib/tarot";
import { FlipCard, ShufflingDeck, prefersReducedMotion, wait } from "./TarotAnimated";
import { track } from "@/components/Track";

type Pull = { card: TarotCard; reversed: boolean };
type Phase = "idle" | "shuffle" | "deal" | "reveal" | "done";
type SpreadKey = (typeof SPREADS)[number]["key"];

/** Draw `n` different cards, each with a 1-in-4 chance of being reversed. */
function drawCards(n: number): Pull[] {
  const deck = [...FULL_DECK];
  const rand = new Uint32Array(deck.length + n);
  crypto.getRandomValues(rand);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = rand[i] % (i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, n).map((card, i) => ({ card, reversed: rand[deck.length + i] % 4 === 0 }));
}

const SUIT_NOTE: Record<string, string> = {
  Wands: "this is all about passion, creativity and taking action.",
  Cups: "this is a matter of the heart, feelings and relationships.",
  Swords: "your thoughts, words and decisions are at the centre of this.",
  Pentacles: "this is about money, work, home and your body.",
};

function themeOf(p: Pull) {
  const t = TAROT_DEPTH[p.card.n].theme;
  return p.reversed ? `${t} (held back for now)` : t;
}

function summary(spread: SpreadKey, pulls: Pull[]) {
  const [a, b, c] = pulls.map(themeOf);
  switch (spread) {
    case "one": return `Your card brings a message of ${a}.`;
    case "ppf": return `Your story moves from ${a} in the past, through ${b} right now, towards ${c}.`;
    case "mbs": return `Your mind is working with ${a}, your body is asking for ${b}, and your spirit is calling you towards ${c}.`;
    case "sao": return `You're facing ${a}. Meet it with ${b}, and it can lead to ${c}.`;
  }
}

export function TarotReading() {
  const [spreadKey, setSpreadKey] = useState<SpreadKey>("ppf");
  const spread = SPREADS.find((s) => s.key === spreadKey)!;
  const [pulls, setPulls] = useState<Pull[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [flipped, setFlipped] = useState(0);
  const run = useRef(0);
  const results = useRef<HTMLDivElement>(null);

  async function read() {
    const id = ++run.current;
    const drawn = drawCards(spread.positions.length);
    track("tarot_reading", { spread: spreadKey });
    if (prefersReducedMotion()) {
      setPulls(drawn);
      setFlipped(drawn.length);
      setPhase("done");
      return;
    }
    setPulls([]);
    setFlipped(0);
    setPhase("shuffle");
    await wait(1700);
    if (id !== run.current) return;
    setPulls(drawn);
    setPhase("deal");
    await wait(450 + drawn.length * 180);
    if (id !== run.current) return;
    setPhase("reveal");
    for (let i = 1; i <= drawn.length; i++) {
      await wait(i === 1 ? 200 : 750);
      if (id !== run.current) return;
      setFlipped(i);
    }
    await wait(800);
    if (id !== run.current) return;
    setPhase("done");
    results.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function chooseSpread(k: SpreadKey) {
    run.current++;
    setSpreadKey(k);
    setPulls([]);
    setFlipped(0);
    setPhase("idle");
  }

  const busy = phase === "shuffle" || phase === "deal" || phase === "reveal";
  const cols = spread.positions.length === 1 ? "max-w-[200px] grid-cols-1" : "max-w-3xl grid-cols-3";

  return (
    <div>
      <div role="group" aria-label="Choose a spread" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {SPREADS.map((s) => (
          <button key={s.key} type="button" aria-pressed={s.key === spreadKey} disabled={busy} onClick={() => chooseSpread(s.key)} className="chip min-h-11 shrink-0 whitespace-nowrap aria-pressed:border-plum aria-pressed:bg-plum aria-pressed:text-ivory">
            {s.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-10">
        {phase === "idle" || phase === "shuffle" ? (
          <div className="mx-auto w-[150px] sm:w-[190px]">
            <ShufflingDeck shuffling={phase === "shuffle"} />
          </div>
        ) : (
          <ol className={`mx-auto grid gap-3 sm:gap-6 ${cols}`}>
            {pulls.map((p, i) => (
              <li key={`${p.card.n}-${i}`} className="text-center">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-plum-soft sm:text-sm">{spread.positions[i].name}</p>
                <div className="tarot-deal" style={{ animationDelay: `${i * 180}ms` }}>
                  <FlipCard card={p.card} reversed={p.reversed} flipped={i < flipped} compact={pulls.length > 1} />
                </div>
              </li>
            ))}
          </ol>
        )}
        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          {phase === "idle" && <p className="max-w-md text-ink/80">Take a breath and hold your question gently in mind. When you&rsquo;re ready, shuffle the deck.</p>}
          {busy && <p className="text-sm text-muted" aria-live="polite">{phase === "shuffle" ? "Shuffling…" : phase === "deal" ? "Dealing your cards…" : "Turning them over…"}</p>}
          <button type="button" onClick={read} disabled={busy} className="btn-primary mt-2">
            {phase === "done" ? "Shuffle and read again" : "Shuffle & draw"}
          </button>
        </div>
      </div>

      {/* Reading */}
      <div ref={results} aria-live="polite" className="scroll-mt-24">
        {phase === "done" && pulls.length > 0 && (
          <div className="reveal mt-12">
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-plum-deep p-7 text-ivory sm:p-10">
              <p className="eyebrow text-blush">Your reading</p>
              <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">{summary(spreadKey, pulls)}</p>
              {pulls.length > 1 && pulls.filter((p) => isMajor(p.card)).length >= 2 && (
                <p className="mt-4 text-ivory/80">With {pulls.filter((p) => isMajor(p.card)).length} Major Arcana cards, this reading points to a significant chapter — the big themes of your life are at play, not just day-to-day details.</p>
              )}
              {pulls.length > 1 && pulls.every((p) => p.card.suit && p.card.suit === pulls[0].card.suit) && (
                <p className="mt-4 text-ivory/80">Every card is from the suit of {pulls[0].card.suit} — {SUIT_NOTE[pulls[0].card.suit!]}</p>
              )}
              {pulls.filter((p) => p.reversed).length >= 2 && (
                <p className="mt-4 text-ivory/80">With more than one card reversed, some of this energy is blocked or turned inward. Be gentle with yourself and look within before you act.</p>
              )}
            </div>
            <ol className={`mt-8 grid gap-5 ${pulls.length > 1 ? "lg:grid-cols-3" : "mx-auto max-w-2xl"}`}>
              {pulls.map((p, i) => {
                const d = TAROT_DEPTH[p.card.n];
                return (
                  <li key={i} className="card p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{spread.positions[i].name} · <span className="normal-case tracking-normal text-muted">{spread.positions[i].hint}</span></p>
                    <h3 className="mt-2 font-display text-3xl text-plum">{p.card.name}{p.reversed && <span className="text-xl text-lavender-deep"> · reversed</span>}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-plum-soft">{p.card.keywords}</p>
                    <p className="mt-4 text-ink/90">{p.reversed ? p.card.reversed : p.card.upright}</p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{d.meaning}</p>
                    <p className="mt-4 rounded-xl bg-blush/50 p-3 font-display text-lg italic text-plum">{p.card.prompt}</p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 text-center text-xs text-muted">Drawn from the full 78-card deck: Major Arcana cards speak to big life themes, Minor Arcana cards to everyday situations. For reflection and entertainment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
