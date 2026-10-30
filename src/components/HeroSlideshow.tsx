"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export interface Slide { src: string; alt: string }

const INTERVAL = 7000;

/**
 * Header photos that slowly cross-fade from one to the next. The first photo
 * is rendered straight away (good for speed); the rest load in the background.
 * Visitors who prefer reduced motion see the first photo only, and anyone can
 * pause it.
 */
export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(1); // how many slides are mounted
  const [paused, setPaused] = useState(false);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!motionOk || paused || slides.length < 2) return;
    const t = setInterval(() => {
      if (document.hidden) return;
      setLoaded((n) => Math.min(slides.length, Math.max(n, 2) + 1));
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL);
    // Start fetching the second photo early so the first change is smooth.
    const warm = setTimeout(() => setLoaded((n) => Math.max(n, 2)), 1500);
    return () => { clearInterval(t); clearTimeout(warm); };
  }, [motionOk, paused, slides.length]);

  return (
    <>
      {slides.slice(0, loaded).map((s, i) => (
        <div key={s.src} aria-hidden={i !== index} className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}>
          <div className={`absolute inset-0 ${i === index ? "ken-burns" : ""}`}>
            <Image src={s.src} alt={i === 0 ? s.alt : ""} fill sizes="100vw" priority={i === 0} quality={75} className="object-cover" />
          </div>
        </div>
      ))}
      {motionOk && slides.length > 1 && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play the header slideshow" : "Pause the header slideshow"}
          className="absolute bottom-24 right-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-plum-deep/45 text-ivory backdrop-blur-sm hover:bg-plum-deep/70 sm:bottom-28 sm:right-8 lg:bottom-36 lg:right-12"
        >
          {paused ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
          )}
        </button>
      )}
    </>
  );
}
