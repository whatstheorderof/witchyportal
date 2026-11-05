"use client";

import { useRef, useState } from "react";
import { FULL_DECK, SPREADS, TAROT_DEPTH, isMajor, type TarotCard } from "@/lib/tarot";
import { FlipCard, ShufflingDeck, prefersReducedMotion, wait } from "./TarotAnimated";
import { track } from "@/components/Track";
import { useI18n } from "@/i18n/client";
import { msg } from "@/i18n/config";

type Pull = { card: TarotCard; reversed: boolean };
type Phase = "idle" | "shuffle" | "deal" | "reveal" | "done";
type SpreadKey = (typeof SPREADS)[number]["key"];
type Spread = { key: SpreadKey; label: string; positions: readonly { name: string; hint: string }[] };
type Depth = typeof TAROT_DEPTH;

/** Draw `n` different cards, each with a 1-in-4 chance of being reversed. */
function drawCards(n: number, full: TarotCard[]): Pull[] {
  const deck = [...full];
  const rand = new Uint32Array(deck.length + n);
  crypto.getRandomValues(rand);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = rand[i] % (i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck.slice(0, n).map((card, i) => ({ card, reversed: rand[deck.length + i] % 4 === 0 }));
}

const SUIT_NOTE: Record<string, string> = {
  Wands: msg("Every card is from the suit of Wands — this is all about passion, creativity and taking action."),
  Cups: msg("Every card is from the suit of Cups — this is a matter of the heart, feelings and relationships."),
  Swords: msg("Every card is from the suit of Swords — your thoughts, words and decisions are at the centre of this."),
  Pentacles: msg("Every card is from the suit of Pentacles — this is about money, work, home and your body."),
};
const SUMMARY: Record<SpreadKey, string> = {
  one: msg("Your card brings a message of {a}."),
  ppf: msg("Your story moves from {a} in the past, through {b} right now, towards {c}."),
  mbs: msg("Your mind is working with {a}, your body is asking for {b}, and your spirit is calling you towards {c}."),
  sao: msg("You're facing {a}. Meet it with {b}, and it can lead to {c}."),
};

/** The deck, meanings and spreads come from the page, already in the visitor's language. */
export function TarotReading({ deck = FULL_DECK, depth = TAROT_DEPTH, spreads = SPREADS }: { deck?: TarotCard[]; depth?: Depth; spreads?: readonly Spread[] }) {
  const { t, rlang } = useI18n();
  const themeOf = (p: Pull) => (p.reversed ? t("{theme} (held back for now)", { theme: depth[p.card.n].theme }) : depth[p.card.n].theme);
  const summary = (key: SpreadKey, pulls: Pull[]) => { const [a, b, c] = pulls.map(themeOf); return t(SUMMARY[key], { a, b: b ?? "", c: c ?? "" }); };
  const [spreadKey, setSpreadKey] = useState<SpreadKey>("ppf");
  const spread = spreads.find((s) => s.key === spreadKey)!;
  const [pulls, setPulls] = useState<Pull[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [flipped, setFlipped] = useState(0);
  const run = useRef(0);
  const results = useRef<HTMLDivElement>(null);

  async function read() {
    const id = ++run.current;
    const drawn = drawCards(spread.positions.length, deck);
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
      <div role="group" aria-label={t("Choose a spread")} className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {spreads.map((s) => (
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
          {phase === "idle" && <p className="max-w-md text-ink/80">{t("Take a breath and hold your question gently in mind. When you’re ready, shuffle the deck.")}</p>}
          {busy && <p className="text-sm text-muted" aria-live="polite">{phase === "shuffle" ? t("Shuffling…") : phase === "deal" ? t("Dealing your cards…") : t("Turning them over…")}</p>}
          <button type="button" onClick={read} disabled={busy} className="btn-primary mt-2">
            {phase === "done" ? t("Shuffle and read again") : t("Shuffle & draw")}
          </button>
        </div>
      </div>

      {/* Reading */}
      <div ref={results} aria-live="polite" className="scroll-mt-24">
        {phase === "done" && pulls.length > 0 && (
          <div className="reveal mt-12">
            <div className="mx-auto max-w-3xl rounded-[2rem] bg-plum-deep p-7 text-ivory sm:p-10">
              <p className="eyebrow text-blush">{t("Your reading")}</p>
              <p lang={rlang} className="mt-3 font-display text-2xl leading-snug sm:text-3xl">{summary(spreadKey, pulls)}</p>
              {pulls.length > 1 && pulls.filter((p) => isMajor(p.card)).length >= 2 && (
                <p className="mt-4 text-ivory/80">{t("With {n} Major Arcana cards, this reading points to a significant chapter — the big themes of your life are at play, not just day-to-day details.", { n: pulls.filter((p) => isMajor(p.card)).length })}</p>
              )}
              {pulls.length > 1 && pulls.every((p) => p.card.suit && p.card.suit === pulls[0].card.suit) && (
                <p className="mt-4 text-ivory/80">{t(SUIT_NOTE[pulls[0].card.suit!])}</p>
              )}
              {pulls.filter((p) => p.reversed).length >= 2 && (
                <p className="mt-4 text-ivory/80">{t("With more than one card reversed, some of this energy is blocked or turned inward. Be gentle with yourself and look within before you act.")}</p>
              )}
            </div>
            <ol className={`mt-8 grid gap-5 ${pulls.length > 1 ? "lg:grid-cols-3" : "mx-auto max-w-2xl"}`}>
              {pulls.map((p, i) => {
                const d = depth[p.card.n];
                return (
                  <li key={i} lang={rlang} className="card p-6">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-plum-soft">{spread.positions[i].name} · <span className="normal-case tracking-normal text-muted">{spread.positions[i].hint}</span></p>
                    <h3 className="mt-2 font-display text-3xl text-plum">{p.card.name}{p.reversed && <span className="text-xl text-lavender-deep"> · {t("reversed")}</span>}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.15em] text-plum-soft">{p.card.keywords}</p>
                    <p className="mt-4 text-ink/90">{p.reversed ? p.card.reversed : p.card.upright}</p>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{d.meaning}</p>
                    <p className="mt-4 rounded-xl bg-blush/50 p-3 font-display text-lg italic text-plum">{p.card.prompt}</p>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 text-center text-xs text-muted">{t("Drawn from the full 78-card deck: Major Arcana cards speak to big life themes, Minor Arcana cards to everyday situations. For reflection and entertainment.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
