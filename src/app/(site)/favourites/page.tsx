import type { Metadata } from "next";
import { PageHero } from "@/components/Section";
import { FavouritesList } from "@/components/FavouritesList";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Your favourites"), robots: { index: false } };
}

export default async function FavouritesPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHero eyebrow={t("Saved")} title={t("Your favourites")} intro={t("Tips, articles, astrology and videos you've saved. They're kept on this device only — no account needed.")} />
      <section className="container-page py-14 lg:py-20"><FavouritesList /></section>
    </>
  );
}
