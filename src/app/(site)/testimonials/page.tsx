import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "@/i18n/client";
import { testimonials } from "@content/testimonials";
import { PageHero } from "@/components/Section";
import { TestimonialCard } from "@/components/Testimonials";
import { ArrowRight } from "@/components/Icons";
import { getI18n } from "@/i18n/server";
import { localeMeta } from "@/i18n/meta";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return localeMeta({
    title: t("Testimonials"),
    description: t("Kind words from Yulia Moon's clients and community — on her spells, tarot readings, workshops and guidance."),
    path: "/testimonials",
  });
}

export default async function TestimonialsPage() {
  const { t, locale } = await getI18n();
  return (
    <>
      <PageHero image="redSmoke" eyebrow={t("Testimonials")} title={t("Kind words")} intro={t("Messages from clients and followers who have worked with Yulia — for spells, readings, workshops and spiritual guidance.") + (locale !== "en" ? " " + t("Clients' own words, in the language they wrote them.") : "")}>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/services" className="btn-primary">{t("Work with Yulia")} <ArrowRight /></Link>
          <Link href="/contact" className="btn-outline">{t("Get in touch")}</Link>
        </div>
      </PageHero>

      <section className="container-page py-14 lg:py-20" aria-label={t("Testimonials")}>
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {testimonials.map((x) => <TestimonialCard key={x.quote.slice(0, 24)} t={x} />)}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-muted">
          {t("Shared as they were sent to Yulia, with first names or initials only. Every experience is personal — spells, readings and guidance are offered for spiritual support and aren’t a substitute for medical, legal or financial advice.")}
        </p>
      </section>

      <section className="container-page pb-16 lg:pb-24">
        <div className="rounded-[2rem] bg-ivory-deep p-8 text-center sm:p-12">
          <h2 className="display-md">{t("Worked with Yulia?")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">{t("She’d love to hear from you. Send your words by message or through the contact form.")}</p>
          <Link href="/contact" className="btn-primary mt-6">{t("Share your experience")}</Link>
        </div>
      </section>
    </>
  );
}
