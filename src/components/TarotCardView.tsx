import type { TarotCard } from "@/lib/tarot";

/** Hand-drawn suit marks for the Minor Arcana (fonts can't be trusted to have these glyphs). */
const SUIT_PATHS: Record<string, React.ReactNode> = {
  Wands: (<><path d="M16 3v26" /><path d="M16 9c-3-1-5-3-5.5-5.5C13 4 15 6 16 9Zm0 6c3-1 5-3 5.5-5.5C19 10 17 12 16 15Z" /></>),
  Cups: (<><path d="M8.5 6h15c0 6.5-3.4 10.5-7.5 10.5S8.5 12.5 8.5 6Z" /><path d="M16 16.5V25M11 27h10" /></>),
  Swords: (<><path d="M16 3l2 3.5V21h-4V6.5L16 3Z" /><path d="M10 21h12M16 21v5" /><circle cx="16" cy="27.5" r="1.5" /></>),
  Pentacles: (<><circle cx="16" cy="16" r="12" /><path d="M16 5.5 22.2 24 6.5 12.6h19L9.8 24Z" /></>),
};

/** The card's emblem: a glyph for the Major Arcana, a drawn mark for each Minor suit. */
export function CardSymbol({ card, className = "" }: { card: TarotCard; className?: string }) {
  if (card.suit) {
    return (
      <svg viewBox="0 0 32 32" aria-hidden className={`inline-block h-[1em] w-[1em] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {SUIT_PATHS[card.suit]}
      </svg>
    );
  }
  return <span aria-hidden className={className}>{card.symbol}</span>;
}

/** compact: smaller type and borders on phones, for cards dealt three across */
export function TarotFace({ card, reversed = false, className = "", compact = false }: { card: TarotCard; reversed?: boolean; className?: string; compact?: boolean }) {
  return (
    <div className={`relative flex aspect-[5/8] w-full flex-col items-center justify-between overflow-hidden rounded-[1.25rem] border-ivory bg-gradient-to-b from-plum to-plum-deep text-ivory shadow-(--shadow-lift) ring-1 ring-sand-deep ${compact ? "rounded-xl border-[3px] px-1.5 py-3 sm:rounded-[1.25rem] sm:border-[6px] sm:p-5" : "border-[6px] p-5"} ${className}`}>
      <div aria-hidden className="absolute inset-2 rounded-[0.9rem] border border-sand-deep/60" />
      <p className={`relative font-display tracking-widest text-blush ${compact ? "text-base sm:text-2xl" : "text-2xl"}`}>{card.numeral}</p>
      <p aria-hidden className={`relative font-display text-ivory ${compact ? "text-4xl sm:text-7xl" : "text-7xl sm:text-8xl"} ${reversed ? "rotate-180" : ""}`}><CardSymbol card={card} /></p>
      <div className="relative text-center">
        <p className={`font-display leading-tight ${compact ? "text-[0.82rem] sm:text-2xl" : "text-2xl"}`}>{card.name}</p>
        {reversed && <p className={`mt-1 uppercase text-lavender ${compact ? "text-[0.55rem] tracking-[0.12em] sm:text-xs sm:tracking-[0.2em]" : "text-xs tracking-[0.2em]"}`}>Reversed</p>}
      </div>
    </div>
  );
}

export function TarotBack({ className = "" }: { className?: string }) {
  return (
    <div className={`relative grid aspect-[5/8] w-full place-items-center overflow-hidden rounded-[1.25rem] border-[6px] border-ivory bg-plum-deep shadow-(--shadow-lift) ring-1 ring-sand-deep ${className}`}>
      <div aria-hidden className="absolute inset-2 rounded-[0.9rem] border border-sand-deep/60 bg-[radial-gradient(circle_at_center,rgb(217_205_234/0.25),transparent_60%)]" />
      <svg viewBox="0 0 32 32" aria-hidden className="relative h-20 w-20 text-blush"><path d="M20.3 5.2a11.4 11.4 0 1 0 6 20.9A9.6 9.6 0 0 1 20.3 5.2Z" fill="currentColor" /></svg>
    </div>
  );
}
