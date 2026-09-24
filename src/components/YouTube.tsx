"use client";

import { useState } from "react";
import { PlayIcon } from "./Icons";

/**
 * Privacy-friendly YouTube embed: shows a thumbnail and loads the
 * youtube-nocookie player only when the visitor presses play.
 */
export function YouTubeEmbed({ id, title, vertical = false }: { id: string; title: string; vertical?: boolean }) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/${vertical ? "oar2" : "hqdefault"}.jpg`;
  return (
    <div className={`relative w-full overflow-hidden rounded-(--radius-card) bg-plum-deep ${vertical ? "aspect-[9/16]" : "aspect-video"}`}>
      {active ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            onError={(e) => { const img = e.currentTarget; if (!img.dataset.fallback) { img.dataset.fallback = "1"; img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; } }}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <span className="scrim-card absolute inset-0" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-plum shadow-(--shadow-lift) transition group-hover:scale-105">
            <PlayIcon className="ml-1 h-7 w-7" />
          </span>
        </button>
      )}
    </div>
  );
}
