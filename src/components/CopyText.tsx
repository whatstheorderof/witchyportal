"use client";

import { useState } from "react";

/** A small button that copies `text` to the clipboard and says so. */
export function CopyText({ text, label, copiedLabel, className = "" }: { text: string; label: string; copiedLabel: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`chip min-h-11 ${className}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard blocked: the text is still visible to copy by hand */
        }
      }}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
