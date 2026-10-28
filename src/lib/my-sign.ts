"use client";
/**
 * The visitor's chosen star sign, kept in this browser only (no account).
 * Components subscribe with useMySign() and stay in sync across the page.
 */
import { useSyncExternalStore } from "react";
import { SIGNS, type Sign } from "@/lib/astro/types";

const KEY = "witchy:sign";
const SPLASH_KEY = "witchy:splash";
const SEEN_KEY = "witchy:splash-seen";
const EVENT = "witchy:sign-change";

function read(key: string) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, v: string | null) {
  try { if (v == null) localStorage.removeItem(key); else localStorage.setItem(key, v); } catch { /* private mode */ }
  window.dispatchEvent(new Event(EVENT));
}

export function getMySign(): Sign | null {
  const v = read(KEY);
  return v && (SIGNS as readonly string[]).includes(v) ? (v as Sign) : null;
}
export function setMySign(sign: Sign | null) { write(KEY, sign); }

/** Whether to greet this visitor with their day when they open the site (on by default once a sign is chosen) */
export const splashEnabled = () => read(SPLASH_KEY) !== "off";
export const setSplashEnabled = (on: boolean) => write(SPLASH_KEY, on ? "on" : "off");
export const splashSeenOn = () => read(SEEN_KEY);
export const markSplashSeen = (day: string) => write(SEEN_KEY, day);

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
}
/** The chosen sign; `undefined` while rendering on the server */
export function useMySign(): Sign | null | undefined {
  return useSyncExternalStore(subscribe, getMySign, () => undefined);
}

/** Whether the daily greeting is on; `true` while rendering on the server */
export function useSplashEnabled(): boolean {
  return useSyncExternalStore(subscribe, splashEnabled, () => true);
}
