"use client";

import { useEffect, useState } from "react";

/** Background video that is only mounted when the visitor allows motion. */
export function HeroVideo({ src, poster }: { src: string; poster?: string }) {
  const [allowMotion, setAllowMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowMotion(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (!allowMotion) return null;
  return (
    <video
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
