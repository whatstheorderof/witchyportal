"use client";
/**
 * The visitor's birth details, saved only in this browser when they opt in
 * ("Save my chart on this device"). Nothing is stored on our server: the
 * details are sent with each request for a personal day, used, and discarded.
 */
import { useSyncExternalStore } from "react";

export interface SavedChart { date: string; time: string | null; placeId: number; placeLabel: string; name?: string; sun?: string }

const KEY = "witchy:chart";
const EVENT = "witchy:chart-change";
let cache: { raw: string | null; value: SavedChart | null } = { raw: null, value: null };

function read(): SavedChart | null {
  let raw: string | null = null;
  try { raw = localStorage.getItem(KEY); } catch { return null; }
  if (raw === cache.raw) return cache.value;
  let value: SavedChart | null = null;
  try {
    const v = raw ? JSON.parse(raw) : null;
    if (v && /^\d{4}-\d{2}-\d{2}$/.test(v.date) && Number.isInteger(v.placeId) && typeof v.placeLabel === "string") value = { date: v.date, time: typeof v.time === "string" ? v.time : null, placeId: v.placeId, placeLabel: v.placeLabel, ...(v.name ? { name: String(v.name).slice(0, 40) } : {}), ...(v.sun ? { sun: String(v.sun) } : {}) };
  } catch { value = null; }
  cache = { raw, value };
  return value;
}

export function saveMyChart(c: SavedChart | null) {
  try { if (c) localStorage.setItem(KEY, JSON.stringify(c)); else localStorage.removeItem(KEY); } catch { /* private mode */ }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
}
/** The saved chart; `undefined` while rendering on the server */
export function useMyChart(): SavedChart | null | undefined {
  return useSyncExternalStore(subscribe, read, () => undefined);
}
