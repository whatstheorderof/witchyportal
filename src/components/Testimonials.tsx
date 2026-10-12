import Link from "next/link";
import type { Testimonial } from "@content/testimonials";
import { ArrowRight } from "./Icons";

/** One client message, set like a note by candlelight. */
export function TestimonialCard({ t, className = "" }: { t: Testimonial; className?: string }) {
  return (
    <figure className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-plum-deep p-7 text-ivory sm:p-8 ${className}`}>
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(196_56_70/0.45),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgb(196_56_70/0.25),transparent_65%)]" />
      <span aria-hidden className="relative font-display text-6xl leading-none text-blush">“</span>
      <blockquote className="relative -mt-4 font-display text-[1.35rem] leading-snug text-ivory">{t.quote}</blockquote>
      <figcaption className="relative mt-6 flex items-center justify-between gap-3 text-sm">
        <span className="font-medium tracking-wide text-blush">— {t.name}</span>
        <span className="rounded-full bg-ivory/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-ivory/80">{t.about}</span>
      </figcaption>
    </figure>
  );
}

/** A short row of client messages with a link to the full page. */
export function TestimonialsStrip({ items, eyebrow = "Kind words", title = "What clients say", className = "" }: { items: Testimonial[]; eyebrow?: string; title?: string; className?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="testimonials-strip" className={`container-page py-16 lg:py-24 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="testimonials-strip" className="display-md mt-2">{title}</h2>
        </div>
        <Link href="/testimonials" className="inline-flex items-center gap-2 text-plum link-underline">Read them all <ArrowRight /></Link>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {items.map((t) => <TestimonialCard key={t.quote.slice(0, 24)} t={t} />)}
      </div>
    </section>
  );
}
