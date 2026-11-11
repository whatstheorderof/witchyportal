"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/client";
import { track } from "@/components/Track";

/**
 * Share a Story-sized image (from /api/share) through the phone's share sheet,
 * or download it where sharing files isn't supported.
 */
export function ShareImage({ query, filename, className = "btn-outline" }: { query: Record<string, string | number | boolean>; filename: string; className?: string }) {
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const url = `/api/share?${new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]))}`;

  async function share() {
    setBusy(true);
    setNote("");
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const file = new File([blob], `${filename}.png`, { type: "image/png" });
      track("share_image", { kind: String(query.kind) });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: "witchyportal.org" });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        setNote(t("Image saved — post it to your Story."));
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setNote(t("Couldn't make the image. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button type="button" onClick={share} disabled={busy} className={className}>
        {busy ? t("Making your image…") : t("Share as image")}
      </button>
      {note && <span role="status" className="text-sm text-muted">{note}</span>}
    </span>
  );
}
