import type { Metadata } from "next";
import { PageHero } from "@/components/Section";
import { JournalApp } from "@/components/JournalApp";
import { getI18n } from "@/i18n/server";
import { getReadings } from "@/i18n/readings";
import { FULL_DECK } from "@/lib/tarot";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t("Your journal"), description: t("A private journal for your tarot pulls, dreams and Moon intentions, kept on your own device."), robots: { index: false } };
}

export default async function JournalPage() {
  const [{ t }, rx] = await Promise.all([getI18n(), getReadings()]);
  const cards = rx.deep(FULL_DECK).map((c) => c.name);
  return (
    <>
      <PageHero eyebrow={t("Private")} title={t("Your journal")} intro={t("Your tarot pulls, dreams and Moon intentions, in one place. Everything stays on this device — no account, and nothing is sent to us.")} />
      <section className="container-page py-14 lg:py-20"><JournalApp cards={cards} /></section>
    </>
  );
}
