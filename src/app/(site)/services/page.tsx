import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { services } from "@content/services";
import { testimonials } from "@content/testimonials";
import { getSetting } from "@/lib/settings";
import { whatsappLink } from "@/lib/contact-links";
import { PageHero } from "@/components/Section";
import { MediaImage } from "@/components/MediaImage";
import { TestimonialsStrip } from "@/components/Testimonials";
import { RetreatPromo } from "@/components/RetreatPromo";
import { ArrowRight, ExternalIcon } from "@/components/Icons";

export const metadata: Metadata = pageMeta({
  title: "Work with Yulia — spells, tarot & astrology",
  description: "Book spells, tarot and oracle readings, dream interpretation, astrology reports, favourable dates and party hire with Yulia Moon, a Slavic witch in London.",
  path: "/services",
});

export default async function ServicesPage() {
  const contact = await getSetting("contact");
  const wa = contact.whatsapp ? whatsappLink(contact.whatsapp, "Hi Yulia, I'd like to ask about ") : null;

  const contactButtons = (dark = false) => (
    <div className="flex flex-wrap gap-3">
      {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={dark ? "btn-light" : "btn-primary"}>Message on WhatsApp <ExternalIcon /></a>}
      {contact.email && <a href={`mailto:${contact.email}`} className={dark ? "btn-outline border-ivory/40 text-ivory hover:bg-ivory/10" : "btn-outline"}>Email Yulia</a>}
      <Link href="/contact" className={dark ? "btn-outline border-ivory/40 text-ivory hover:bg-ivory/10" : "btn-outline"}>Contact form</Link>
    </div>
  );

  return (
    <>
      <PageHero image="redSmoke" eyebrow="Work with Yulia" title="Spells, readings & guidance" intro={services.intro}>
        <div className="mt-7">{contactButtons()}</div>
      </PageHero>

      {/* Personal approach */}
      <section className="container-page py-14 lg:py-20" aria-labelledby="approach">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] rounded-tl-[7rem]">
            <MediaImage fallback="candleWindow" sizes="(min-width:1024px) 45vw, 92vw" />
          </div>
          <div>
            <p className="eyebrow">Tailored to you</p>
            <h2 id="approach" className="display-md mt-2">Every piece of work is personal</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/85">{services.personal}</p>
            <ol className="mt-8 grid gap-4">
              {services.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-plum font-display text-lg text-ivory">{i + 1}</span>
                  <div>
                    <p className="font-display text-xl text-plum">{s.title}</p>
                    <p className="text-ink/80">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* What you can book */}
      <section className="bg-ivory-deep py-14 lg:py-20" aria-labelledby="book">
        <div className="container-page">
          <p className="eyebrow">What you can book</p>
          <h2 id="book" className="display-md mt-2">Spells, readings & spiritual guidance</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.offerings.map((o) => (
              <li key={o.title} className="card p-6">
                <p className="font-display text-2xl text-plum">{o.title}</p>
                <p className="mt-2 text-ink/80">{o.text}</p>
              </li>
            ))}
            <li className="card flex flex-col justify-between gap-4 bg-plum-deep p-6 text-ivory">
              <p className="font-display text-2xl">Not sure what you need?</p>
              <p className="text-ivory/80">Tell Yulia what&rsquo;s happening and she&rsquo;ll suggest what would help.</p>
              {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-light self-start">Ask on WhatsApp</a> : <Link href="/contact" className="btn-light self-start">Get in touch</Link>}
            </li>
          </ul>
        </div>
      </section>

      {/* Astrology */}
      <section className="container-page py-14 lg:py-20" aria-labelledby="astrology-reports">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="eyebrow">Astrology reports</p>
            <h2 id="astrology-reports" className="display-md mt-2">Written in your stars</h2>
            <p className="mt-4 text-ink/80">Personal astrology reports based on your birth chart. Curious first? Try the free birth chart calculator.</p>
            <Link href="/birth-chart" className="btn-outline mt-6">Free birth chart <ArrowRight /></Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {services.astrology.map((a) => (
              <li key={a.title} className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">
                <p className="font-display text-xl text-plum">{a.title}</p>
                <p className="mt-1 text-[0.95rem] text-ink/80">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Favourable dates */}
      <section id="dates" className="scroll-mt-24 bg-plum-deep py-14 text-ivory lg:py-20" aria-labelledby="dates-title">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow text-blush">New service</p>
            <h2 id="dates-title" className="display-md mt-2 text-ivory">{services.favourableDates.title}</h2>
            <p className="mt-4 text-lg text-ivory/85">{services.favourableDates.text}</p>
            <p className="mt-6 inline-flex rounded-full bg-blush px-5 py-2 font-display text-2xl text-plum-deep">{services.favourableDates.price}</p>
            <div className="mt-8">{contactButtons(true)}</div>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Occasions">
            {services.favourableDates.occasions.map((o) => (
              <li key={o} className="rounded-full border border-ivory/25 px-4 py-2 text-sm text-ivory/90">{o}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="container-page scroll-mt-24 py-14 lg:py-20" aria-labelledby="events-title">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Party hire</p>
            <h2 id="events-title" className="display-md mt-2">{services.events.title}</h2>
            {services.events.paragraphs.map((p) => <p key={p.slice(0, 20)} className="mt-4 leading-relaxed text-ink/85">{p}</p>)}
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Ideal for">
              {services.events.ideal.map((x) => <li key={x} className="chip">{x}</li>)}
            </ul>
            <div className="mt-8">{contactButtons()}</div>
          </div>
          <div className="relative aspect-[911/1024] overflow-hidden rounded-[2rem] rounded-br-[7rem]">
            <MediaImage fallback="redCandles" sizes="(min-width:1024px) 40vw, 92vw" />
          </div>
        </div>
      </section>

      <TestimonialsStrip items={testimonials.filter((t) => t.featured)} className="border-t border-line" />

      <section className="container-page pb-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/testimonials" className="card group flex items-center justify-between gap-4 p-6">
            <span><span className="block font-display text-2xl text-plum">Testimonials</span><span className="text-ink/75">Kind words from Yulia&rsquo;s clients.</span></span>
            <ArrowRight />
          </Link>
          <Link href="/retreats" className="card group flex items-center justify-between gap-4 p-6">
            <span><span className="block font-display text-2xl text-plum">Retreats</span><span className="text-ink/75">Seven days of ritual by the sea.</span></span>
            <ArrowRight />
          </Link>
        </div>
      </section>
      <RetreatPromo eyebrow="Go deeper" />
    </>
  );
}
