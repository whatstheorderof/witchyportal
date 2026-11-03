"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-render the current server page every few seconds (stops after ~2 minutes). */
export function AutoRefresh({ seconds = 5 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const id = setInterval(() => { if (++n > 24) clearInterval(id); else router.refresh(); }, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
