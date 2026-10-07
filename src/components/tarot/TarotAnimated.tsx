"use client";

import type { TarotCard } from "@/lib/tarot";
import { TarotBack, TarotFace } from "@/components/TarotCardView";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A small stack of face-down cards that riffles while `shuffling` is true. */
export function ShufflingDeck({ shuffling, count = 6, className = "" }: { shuffling: boolean; count?: number; className?: string }) {
  return (
    <div aria-hidden className={`relative aspect-[5/8] w-full ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`absolute inset-0 ${shuffling ? (i % 2 ? "tarot-riffle-r" : "tarot-riffle-l") : ""}`}
          style={{
            transform: shuffling ? undefined : `translate(${(i - count / 2) * 1.5}px, ${-i * 1.5}px) rotate(${(i - count / 2) * 0.8}deg)`,
            animationDelay: shuffling ? `${i * 45}ms` : undefined,
            zIndex: i,
          }}
        >
          <TarotBack />
        </div>
      ))}
    </div>
  );
}

/** A card that flips from its back to its face. */
export function FlipCard({ card, reversed = false, flipped, className = "", compact = false }: { card: TarotCard; reversed?: boolean; flipped: boolean; className?: string; compact?: boolean }) {
  return (
    <div aria-hidden className={`tarot-flip ${className}`}>
      <div className={`tarot-flip-inner ${flipped ? "is-flipped" : ""}`}>
        <div className="tarot-face"><TarotBack /></div>
        <div className="tarot-face tarot-face-front"><TarotFace card={card} reversed={reversed} compact={compact} /></div>
      </div>
    </div>
  );
}
