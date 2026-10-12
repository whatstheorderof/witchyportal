import type { Metadata } from "next";
import Link from "next/link";
import { testimonials } from "@content/testimonials";
import { PageHero } from "@/components/Section";
import { TestimonialCard } from "@/components/Testimonials";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Kind words from Yulia Moon's clients and community — on her spells, tarot readings, workshops and guidance.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero image="redSmoke" eyebrow="Testimonials" title="Kind words" intro="Messages from clients and followers who have worked with Yulia — for spells, readings, workshops and spiritual guidance.">
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/services" className="btn-primary">Work with Yulia <ArrowRight /></Link>
          <Link href="/contact" className="btn-outline">Get in touch</Link>
        </div>
      </PageHero>

      <section className="container-page py-14 lg:py-20" aria-label="Testimonials">
        <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {testimonials.map((t) => <TestimonialCard key={t.quote.slice(0, 24)} t={t} />)}
        </div>
        <p className="mt-8 max-w-3xl text-sm text-muted">
          Shared as they were sent to Yulia, with first names or initials only. Every experience is personal — spells, readings and guidance are offered for spiritual support and aren&rsquo;t a substitute for medical, legal or financial advice.
        </p>
      </section>

      <section className="container-page pb-16 lg:pb-24">
        <div className="rounded-[2rem] bg-ivory-deep p-8 text-center sm:p-12">
          <h2 className="display-md">Worked with Yulia?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">She&rsquo;d love to hear from you. Send your words by message or through the contact form.</p>
          <Link href="/contact" className="btn-primary mt-6">Share your experience</Link>
        </div>
      </section>
    </>
  );
}
