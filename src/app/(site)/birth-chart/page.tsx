import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, breadcrumbLd, faqLd, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/Section";
import { BirthChart } from "@/components/birth-chart/BirthChart";
import { RetreatPromo } from "@/components/RetreatPromo";
import { getSetting } from "@/lib/settings";
import { SIGNS } from "@/lib/astro/types";
import { SIGN_INFO } from "@/lib/astro/interpretations";
import { ZODIAC } from "@/lib/astro/text/zodiac";

export const metadata: Metadata = pageMeta({
  title: "Free Birth Chart Calculator: Natal Chart & Full Report | Witchy Portal",
  absoluteTitle: true,
  description: "Free birth chart (natal chart) calculator with a full written report: planets, rising sign, houses, aspects, Part of Fortune, Nodes, Lilith and your Moon phase. Nothing is stored.",
  path: "/birth-chart",
});

const FAQS = [
  {
    question: "Is a birth chart the same as a natal chart?",
    answer: "Yes. A birth chart, natal chart and birth horoscope all mean the same thing: a map of where the Sun, Moon and planets were, from the place and moment you were born.",
  },
  {
    question: "Is this birth chart calculator really free?",
    answer: "Yes — the chart and the full written report are free, with no sign-up. If you'd like a personal reading, Yulia offers full birth chart assessments.",
  },
  {
    question: "What if I don't know my birth time?",
    answer: "You'll still get every planet's sign and the aspects between them. Without a time we can't calculate your rising sign (Ascendant), Midheaven, houses or Part of Fortune, and if the Moon changed sign that day we show both possibilities. Your birth certificate, a parent or hospital records may have the time.",
  },
  {
    question: "How do I find my rising sign?",
    answer: "Your rising sign (Ascendant) is the sign that was rising on the eastern horizon at the moment you were born. It changes roughly every two hours, so enter your exact birth time and place above — it's shown at the top of your report.",
  },
  {
    question: "Which zodiac and house system do you use?",
    answer: "The tropical (Western) zodiac and Placidus houses — the most widely used combination in Western astrology. Close to the poles, where Placidus can't be calculated, we use Whole Sign houses.",
  },
  {
    question: "Why might my chart look slightly different on another website?",
    answer: "Planet positions should match to within a minute of arc. Small differences come from choices such as the true or mean North Node, the house system, or the exact coordinates and time zone used for your birthplace. We use historical time-zone and daylight-saving records for every place.",
  },
  {
    question: "Do you store my birth details?",
    answer: "No. Your date, time and place are used once to calculate your chart and are never saved or logged.",
  },
];

export default async function BirthChartPage() {
  const contact = await getSetting("contact");
  return (
    <>
      <JsonLd
        data={[
          {
            "@type": "WebApplication",
            name: "Witchy Portal Birth Chart Calculator",
            url: absoluteUrl("/birth-chart"),
            description: "Free natal chart calculator with a full written report: planets in signs and houses, rising sign, aspects, Part of Fortune, Nodes, Lilith and Moon phase.",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
            publisher: { "@id": absoluteUrl("/#organization") },
          },
          faqLd(FAQS),
          breadcrumbLd([["Birth chart", "/birth-chart"]]),
        ]}
      />
      <div className="print:hidden">
      <PageHero
        image="hornsPortrait"
        eyebrow="Natal chart"
        title="Free birth chart calculator"
        intro="Your complete natal chart and a full written report — planets, rising sign, houses, aspects, Part of Fortune, the Nodes, Lilith and the Moon phase you were born under. Free, and nothing is stored."
      />
      </div>
      <div className="container-page py-12 lg:py-20">
        <BirthChart contact={{ whatsapp: contact.whatsapp || null, email: contact.email || null }} />
      </div>

      {/* GUIDE — what a birth chart is and how to read it */}
      <article className="border-t border-line bg-ivory-deep/50 py-16 print:hidden lg:py-24" aria-labelledby="guide-h">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_20rem] lg:gap-20">
          <div className="prose-witchy max-w-none">
            <p className="eyebrow">A guide to your natal chart</p>
            <h2 id="guide-h" className="display-md mt-2">What is a birth chart?</h2>
            <p>A birth chart — also called a natal chart — is a snapshot of the sky at the exact moment and place you were born. It shows where the Sun, the Moon and each planet were in the zodiac, which sign was rising on the eastern horizon, and how the sky divides into twelve houses around you. Astrologers read it as a map of your temperament, your gifts, your challenges and the rhythms of your life.</p>
            <p>Your Sun sign — the &ldquo;star sign&rdquo; in magazine horoscopes — is only one part of it. Two people with the same Sun sign can have very different charts, because the Moon, the rising sign and every other planet are in different places.</p>

            <h2 className="display-md mt-12">What&rsquo;s in your natal chart report</h2>
            <ul>
              <li><strong>Planet positions</strong> — the sign, degree and house of the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto, plus the North Node and Black Moon Lilith.</li>
              <li><strong>Ascendant, Midheaven and houses</strong> — your rising sign, your career point and the sign on each of the twelve house cusps (Placidus).</li>
              <li><strong>Aspects</strong> — every major angle between your planets and to your Ascendant and Midheaven, with its orb, an aspect grid and a written reading.</li>
              <li><strong>Part of Fortune and the South Node</strong> — where joy flows easily, and the familiar pattern your North Node grows beyond.</li>
              <li><strong>Your Moon</strong> — its sign, degree, house and the lunar phase you were born under.</li>
              <li><strong>Charts</strong> — a chart wheel, an aspect grid and the balance of elements, modalities and polarity.</li>
            </ul>

            <h2 className="display-md mt-12">How to read your birth chart</h2>
            <h3>The planets: what</h3>
            <p>Each planet is a part of you. The Sun is your core self, the Moon your emotional needs, Mercury your mind, Venus how you love, Mars how you act, Jupiter where you grow, and Saturn where you learn through effort. Uranus, Neptune and Pluto move slowly, so their signs are shared by your whole generation — their houses are what make them personal.</p>
            <h3>The signs: how</h3>
            <p>The sign a planet is in describes how it expresses itself — boldly in Aries, steadily in Taurus, curiously in Gemini, tenderly in Cancer. Read about each one in our <Link href="/zodiac">guide to the signs of the zodiac</Link>.</p>
            <h3>The houses: where</h3>
            <p>The twelve houses are areas of life — self, money, communication, home, creativity, work, partnership, intimacy, belief, career, friendship and the inner world. A planet&rsquo;s house shows where its energy is most active for you.</p>
            <h3>The aspects: how it all connects</h3>
            <p>Aspects are the angles between planets. Conjunctions (0°) fuse two energies, trines (120°) and sextiles (60°) flow easily, and squares (90°) and oppositions (180°) create the tension that pushes you to grow. The tighter the orb, the stronger the aspect.</p>

            <h2 className="display-md mt-12">Why your birth time matters</h2>
            <p>The planets move slowly enough that the date alone fixes most of their signs. But the sky turns once a day, so your rising sign changes about every two hours and the houses shift with it. An accurate birth time — ideally to within a few minutes — gives you the Ascendant, the Midheaven, the houses and the Part of Fortune. Without one you&rsquo;ll still get a meaningful reading of the planets in their signs and the aspects between them.</p>

            <h2 className="display-md mt-12">How this chart is calculated</h2>
            <p>Positions come from Astronomy Engine, an open-source library built on the VSOP87 and NOVAS models used by astronomers, and are accurate to well under an arcminute. We use the tropical zodiac, Placidus houses, the true North Node and the mean Black Moon Lilith, and convert your local birth time using the historical time-zone and daylight-saving records for your birthplace.</p>

            <h2 className="display-md mt-12">Questions about birth charts</h2>
            <div className="not-prose mt-6 divide-y divide-line border-y border-line">
              {FAQS.map((f) => (
                <details key={f.question} className="group py-1">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-plum [&::-webkit-details-marker]:hidden">
                    {f.question}<span aria-hidden className="text-2xl transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-4 text-[0.97rem] text-ink/85">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="grid content-start gap-8">
            <nav aria-labelledby="signs-h" className="card p-6">
              <h2 id="signs-h" className="font-display text-2xl text-plum">The zodiac signs</h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.95rem]">
                {SIGNS.map((s) => (
                  <li key={s}><Link href={`/zodiac/${s.toLowerCase()}`} className="link-underline"><span aria-hidden className="mr-1 text-plum">{SIGN_INFO[s].glyph}</span>{s}</Link><span className="block text-xs text-muted">{ZODIAC[s].dates}</span></li>
                ))}
              </ul>
            </nav>
            <div className="rounded-[2rem] bg-plum-deep p-6 text-ivory">
              <p className="eyebrow text-blush">Personal reading</p>
              <p className="mt-2 font-display text-2xl">A full birth chart assessment with Yulia</p>
              <p className="mt-2 text-sm text-ivory/80">Yulia weaves your whole chart together — patterns, blocks and gifts — with recommendations for your life now.</p>
              <Link href="/services#astrology-reports" className="btn-outline mt-5 border-ivory/40 text-ivory hover:bg-ivory/10">Find out more</Link>
            </div>
          </aside>
        </div>
      </article>
      <div className="print:hidden"><RetreatPromo eyebrow="Now you know your stars" /></div>
    </>
  );
}
