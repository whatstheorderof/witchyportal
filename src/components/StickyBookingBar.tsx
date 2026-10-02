"use client";

import { useEffect, useState } from "react";

/**
 * Mobile booking action that sits just above the bottom navigation.
 * It hides itself when the booking section or the footer is on screen, so it
 * never covers the content it points to, and reserves space at the end of the
 * page so the last lines of content are never hidden behind it.
 */
export function StickyBookingBar({ price, dates, bookable }: { price: string | null; dates: string | null; bookable: boolean }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById("book"), document.querySelector("footer")].filter(Boolean) as Element[];
    if (!targets.length || !("IntersectionObserver" in window)) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
        setHidden(visible.size > 0);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        data-sticky-booking
        className={`fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-ivory/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(74_31_64/0.25)] backdrop-blur-md transition duration-300 lg:hidden ${hidden ? "pointer-events-none translate-y-full opacity-0" : ""}`}
        aria-hidden={hidden}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{dates ?? "Dates to be announced"}</p>
            <p className="truncate font-display text-xl leading-tight text-plum">{price ? `from ${price}` : "Price coming soon"}</p>
          </div>
          <a href={bookable ? "#book" : "#waitlist"} tabIndex={hidden ? -1 : 0} className="btn-primary min-h-12 shrink-0 px-6">
            {bookable ? "Book now" : "Join waitlist"}
          </a>
        </div>
      </div>
      <div className="h-24 lg:hidden" aria-hidden />
    </>
  );
}
