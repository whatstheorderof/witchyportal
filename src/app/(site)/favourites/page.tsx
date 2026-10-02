import type { Metadata } from "next";
import { PageHero } from "@/components/Section";
import { FavouritesList } from "@/components/FavouritesList";

export const metadata: Metadata = { title: "Your favourites", robots: { index: false } };

export default function FavouritesPage() {
  return (
    <>
      <PageHero eyebrow="Saved" title="Your favourites" intro="Tips, articles, astrology and videos you've saved. They're kept on this device only — no account needed." />
      <section className="container-page py-14 lg:py-20"><FavouritesList /></section>
    </>
  );
}
