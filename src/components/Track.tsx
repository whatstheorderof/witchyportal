"use client";

import { useEffect } from "react";

export function track(name: string, props: Record<string, string> = {}) {
  try {
    const body = JSON.stringify({ name, props, path: window.location.pathname });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    else fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    /* ignore */
  }
}

/** Sends one anonymous event when the page is viewed. */
export function TrackView({ name, props }: { name: string; props?: Record<string, string> }) {
  useEffect(() => {
    track(name, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);
  return null;
}
