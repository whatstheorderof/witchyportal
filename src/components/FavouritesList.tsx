"use client";

import Link, { useI18n } from "@/i18n/client";
import { msg } from "@/i18n/config";
import { removeFavourite, useFavourites } from "./ShareFavourite";

const LABEL = { article: msg("Article"), tip: msg("Tip"), astrology: msg("Astrology"), video: msg("Video") } as const;

export function FavouritesList() {
  const favs = useFavourites();
  const { t } = useI18n();
  if (!favs.length) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span aria-hidden className="font-display text-5xl text-lavender-deep">♡</span>
        <h2 className="font-display text-2xl text-plum">{t("Nothing saved yet")}</h2>
        <p className="max-w-md text-muted">{t("Tap the heart on any tip, article, astrology post or video to keep it here.")}</p>
        <Link href="/discover" className="btn-outline mt-2">{t("Discover something")}</Link>
      </div>
    );
  }
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {favs.map((f) => (
        <li key={f.key} className="card flex items-start justify-between gap-3 p-5">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-plum-soft">{t(LABEL[f.type])}</p>
            <Link href={f.href} className="mt-1 block font-display text-xl leading-snug text-plum link-underline">{f.title}</Link>
          </div>
          <button type="button" onClick={() => removeFavourite(f.key)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted hover:bg-sand/60" aria-label={t("Remove {title}", { title: f.title })}>✕</button>
        </li>
      ))}
    </ul>
  );
}
