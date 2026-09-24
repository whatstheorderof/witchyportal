import type { Metadata } from "next";
import { PageHero } from "@/components/Section";
import { BirthChart } from "@/components/birth-chart/BirthChart";
import { RetreatPromo } from "@/components/RetreatPromo";

export const metadata: Metadata = {
  title: "Birth Chart",
  description: "Calculate your natal chart — Sun, Moon, rising sign, planets and houses — from your birth date, time and place.",
};

export default function BirthChartPage() {
  return (
    <>
      <PageHero eyebrow="Birth chart" title="The sky on the day you arrived" intro="Enter your birth date, time and place to see your Sun, Moon and rising sign, every planet's position, your houses and key aspects." />
      <div className="container-page py-12 lg:py-20">
        <BirthChart />
      </div>
      <RetreatPromo eyebrow="Now you know your stars" />
    </>
  );
}
