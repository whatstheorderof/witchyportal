"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export interface Favourite {
  key: string;
  type: "article" | "tip" | "astrology" | "video";
  title: string;
  href: string;
  savedAt: string;
}

const STORE = "witchyportal:favourites";
const listeners = new Set<() => void>();
let cache: Favourite[] | null = null;

function read(): Favourite[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(STORE) ?? "[]") as Favourite[];
  } catch {
    cache = [];
  }
  return cache;
}
function write(list: Favourite[]) {
  cache = list;
  try {
    localStorage.setItem(STORE, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode) — keep in memory for this visit */
  }
  listeners.forEach((l) => l());
}
const EMPTY: Favourite[] = [];
export function useFavourites() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    read,
    () => EMPTY,
  );
}
export function removeFavourite(key: string) {
  write(read().filter((f) => f.key !== key));
}

export function FavouriteButton({ item, compact = false, dark = false }: { item: Omit<Favourite, "savedAt">; compact?: boolean; dark?: boolean }) {
  const favs = useFavourites();
  const saved = favs.some((f) => f.key === item.key);
  const toggle = () => write(saved ? read().filter((f) => f.key !== item.key) : [{ ...item, savedAt: new Date().toISOString() }, ...read()]);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      aria-pressed={saved}
      aria-label={saved ? `Remove “${item.title}” from favourites` : `Save “${item.title}” to favourites`}
      className={`relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full ${compact ? "w-11 justify-center" : "px-4"} text-sm transition ${dark ? "bg-ivory/15 text-ivory hover:bg-ivory/25" : "bg-white/80 text-plum ring-1 ring-line hover:bg-white"}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {!compact && (saved ? "Saved" : "Save")}
    </button>
  );
}

export function ShareButton({ title, text }: { title: string; text?: string }) {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 2500);
    return () => clearTimeout(t);
  }, [msg]);
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMsg("Link copied");
    } catch (e) {
      if ((e as Error).name !== "AbortError") setMsg("Couldn't share — copy the address bar link instead");
    }
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button type="button" onClick={share} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/80 px-4 text-sm text-plum ring-1 ring-line hover:bg-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v7a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Share
      </button>
      <span role="status" aria-live="polite" className="text-sm text-success">{msg}</span>
    </span>
  );
}
