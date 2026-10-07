import type { TarotCard } from "@/lib/tarot";

/** compact: smaller type and borders on phones, for cards dealt three across */
export function TarotFace({ card, reversed = false, className = "", compact = false }: { card: TarotCard; reversed?: boolean; className?: string; compact?: boolean }) {
  return (
    <div className={`relative flex aspect-[5/8] w-full flex-col items-center justify-between overflow-hidden rounded-[1.25rem] border-ivory bg-gradient-to-b from-plum to-plum-deep text-ivory shadow-(--shadow-lift) ring-1 ring-sand-deep ${compact ? "rounded-xl border-[3px] px-1.5 py-3 sm:rounded-[1.25rem] sm:border-[6px] sm:p-5" : "border-[6px] p-5"} ${className}`}>
      <div aria-hidden className="absolute inset-2 rounded-[0.9rem] border border-sand-deep/60" />
      <p className={`relative font-display tracking-widest text-blush ${compact ? "text-base sm:text-2xl" : "text-2xl"}`}>{card.numeral}</p>
      <p aria-hidden className={`relative font-display text-ivory ${compact ? "text-4xl sm:text-7xl" : "text-7xl sm:text-8xl"} ${reversed ? "rotate-180" : ""}`}>{card.symbol}</p>
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
