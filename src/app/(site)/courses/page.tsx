import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { courses, coursesIntro } from "@content/courses";
import { testimonials } from "@content/testimonials";
import { PageHero } from "@/components/Section";
import { TestimonialCard } from "@/components/Testimonials";
import { ExternalIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Courses — learn witchcraft with Yulia",
  description: "Online witchcraft courses by Yulia Moon: Moon Magic Workshop, Love Magic and Go Back to Your Pagan Roots. Most are suitable for complete beginners.",
};

export default function CoursesPage() {
  const workshop = testimonials.find((t) => t.about === "Workshops");
  return (
    <>
      <PageHero image="cauldron" eyebrow="Courses" title="Learn the craft" intro={coursesIntro[0]} />

      <section className="container-page py-14 lg:py-20" aria-label="Courses">
        <ul className="grid gap-8 md:grid-cols-3">
          {courses.map((c) => (
            <li key={c.url}>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-plum-deep">
                  <Image src={c.image} alt={c.alt} fill sizes="(min-width:768px) 30vw, 92vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                </div>
                <h2 className="mt-4 font-display text-3xl text-plum">{c.title}</h2>
                <span className="mt-2 inline-flex items-center gap-2 text-plum link-underline">View course &amp; enrol <ExternalIcon /></span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-lg text-ink/85">{coursesIntro[1]}</p>
        <p className="mt-2 text-sm text-muted">Courses open on Yulia&rsquo;s course platform, where you&rsquo;ll find the full details and prices.</p>
      </section>

      {workshop && (
        <section className="container-page pb-14 lg:pb-20" aria-label="From a student">
          <div className="mx-auto max-w-2xl"><TestimonialCard t={workshop} /></div>
        </section>
      )}

      <section className="container-page pb-16 lg:pb-24">
        <div className="rounded-[2rem] bg-ivory-deep p-8 text-center sm:p-12">
          <h2 className="display-md">Questions about a course?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Ask Yulia which one suits your practice — or about one-to-one guidance.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary">Get in touch</Link>
            <Link href="/services" className="btn-outline">Work with Yulia</Link>
          </div>
        </div>
      </section>
    </>
  );
}
