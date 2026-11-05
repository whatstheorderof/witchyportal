"use client";

import Link, { useI18n } from "@/i18n/client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  const { t } = useI18n();
  return (
    <div className="container-prose flex min-h-[70vh] flex-col items-center justify-center pt-24 pb-16 text-center">
      <span aria-hidden className="font-display text-6xl text-lavender-deep">☽︎</span>
      <h1 className="display-md mt-4">{t("The veil is a little thick right now")}</h1>
      <p className="mt-4 text-muted">{t("Something went wrong while loading this page. Please try again — if it keeps happening, get in touch and we’ll help.")}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button onClick={reset} className="btn-primary">{t("Try again")}</button>
        <Link href="/" className="btn-outline">{t("Go home")}</Link>
      </div>
    </div>
  );
}
