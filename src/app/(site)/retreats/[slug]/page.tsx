import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRetreatBySlug } from "@/lib/queries";
import { getAdmin } from "@/lib/auth";
import { formatDateRange, nightsBetween } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { parseYouTubeId } from "@/lib/validation";
import { MediaImage } from "@/components/MediaImage";
import { Markdown, PlaceholderNote } from "@/components/Markdown";
import { AvailabilityBadge, isBookable } from "@/components/Availability";
import { BookingSelector, type SelectorDeparture } from "@/components/BookingSelector";
import { WaitlistForm } from "@/components/forms";
import { YouTubeEmbed } from "@/components/YouTube";
import { ArrowRight, CalendarIcon, CheckIcon, MinusIcon, PinIcon } from "@/components/Icons";
import { PreviewBanner } from "@/components/PreviewBanner";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> };

async function load(props: Props) {
  const { slug } = await props.params;
  const { preview } = await props.searchParams;
  const isPreview = preview === "1" && Boolean(await getAdmin());
  const retreat = await getRetreatBySlug(slug, { preview: isPreview });
  return { retreat, isPreview };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { retreat } = await load(props);
  if (!retreat) return { title: "Retreat not found" };
  return {
    title: retreat.seoTitle || retreat.title,
    description: retreat.seoDescription || retreat.summary,
    openGraph: retreat.hero ? { images: [{ url: retreat.hero.url, alt: retreat.hero.alt }] } : undefined,
  };
}

export default async function RetreatPage(props: Props) {
  const { retreat, isPreview } = await load(props);
  if (!retreat) notFound();

  const departures: SelectorDeparture[] = retreat.departures.map((d) => {
    const n = nightsBetween(d.startDate, d.endDate);
    return {
      id: d.id,
      dateLabel: formatDateRange(d.startDate, d.endDate),
      nightsLabel: `${n} night${n === 1 ? "" : "s"}`,
      availability: d.availability,
      availabilityNote: d.availabilityNote,
      bookable: isBookable(d.availability),
      options: d.options.map((o) => ({
        id: o.id,
        label: o.label,
        description: o.description,
        paymentType: o.paymentType,
        amountLabel: formatMoney(o.amount, o.currency),
        totalLabel: o.totalPrice ? formatMoney(o.totalPrice, o.currency) : null,
        balanceNote: o.balanceNote,
        availability: o.availability,
        bookable: isBookable(o.availability) && isBookable(d.availability),
      })),
    };
  });
  const anyBookable = departures.some((d) => d.bookable && d.options.some((o) => o.bookable));
  const showWaitlist = retreat.departures.length === 0 || retreat.departures.some((d) => !isBookable(d.availability)) || !anyBookable;
  const videoId = retreat.videoUrl ? parseYouTubeId(retreat.videoUrl) : null;

  const sections = [
    { id: "overview", label: "Overview", show: true },
    { id: "experience", label: "Experience", show: Boolean(retreat.guestExperience || retreat.activities.length || retreat.benefits.length) },
    { id: "itinerary", label: "Itinerary", show: retreat.itinerary.length > 0 },
    { id: "stay", label: "Stay", show: Boolean(retreat.accommodation) },
    { id: "book", label: "Dates & prices", show: true },
    { id: "faq", label: "FAQs", show: retreat.faqs.length > 0 },
  ].filter((s) => s.show);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: retreat.title,
    description: retreat.summary,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: retreat.location, address: retreat.country },
    ...(retreat.nextDeparture ? { startDate: retreat.nextDeparture.startDate, endDate: retreat.nextDeparture.endDate } : {}),
    ...(retreat.fromPrice ? { offers: { "@type": "Offer", price: (retreat.fromPrice.amount / 100).toFixed(2), priceCurrency: retreat.fromPrice.currency } } : {}),
    organizer: { "@type": "Person", name: "Yulia Moon" },
  };

  return (
    <>
      {isPreview && <PreviewBanner status={retreat.status} editHref={`/admin/retreats/${retreat.id}`} />}
      {!isPreview && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}

      {/* HERO */}
      <section className="relative isolate flex min-h-[78svh] items-end overflow-hidden bg-plum-deep text-ivory">
        <div className="absolute inset-0 -z-10">
          <MediaImage media={retreat.hero} fallback="horns" priority sizes="100vw" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <div className="container-page pb-12 pt-32 lg:pb-16">
          <Link href="/retreats" className="text-sm text-ivory/80 hover:text-ivory">← All retreats</Link>
          <p className="mt-6 flex items-center gap-1.5 text-ivory/85"><PinIcon />{retreat.location}{retreat.country ? `, ${retreat.country}` : ""}</p>
          <h1 className="display-xl mt-3 max-w-4xl text-ivory">{retreat.title}</h1>
          {retreat.tagline && <p className="mt-4 max-w-2xl text-lg text-ivory/85 sm:text-xl">{retreat.tagline}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {retreat.nextDeparture && (
              <span className="inline-flex items-center gap-2 rounded-full bg-ivory/15 px-4 py-2 text-sm backdrop-blur"><CalendarIcon />Next: {formatDateRange(retreat.nextDeparture.startDate, retreat.nextDeparture.endDate)}</span>
            )}
            {retreat.overallAvailability && <AvailabilityBadge value={retreat.overallAvailability} solid />}
            {retreat.isPlaceholder && <span className="placeholder-flag">Sample retreat — details are placeholders</span>}
          </div>
        </div>
      </section>

      {/* SECTION NAV */}
      <nav aria-label="On this page" className="sticky top-16 z-30 border-b border-line/70 bg-ivory/90 backdrop-blur-md lg:top-20">
        <ul className="no-scrollbar container-page flex gap-1 overflow-x-auto py-2">
          {sections.map((s) => (
            <li key={s.id}><a href={`#${s.id}`} className="chip whitespace-nowrap border-transparent bg-transparent">{s.label}</a></li>
          ))}
        </ul>
      </nav>

      <div className="container-page grid gap-16 py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20 lg:py-20">
        <div className="min-w-0">
          {/* OVERVIEW */}
          <section id="overview" className="scroll-mt-36">
            <p className="eyebrow">The concept</p>
            <p className="mt-4 font-display text-[1.7rem] leading-snug text-plum sm:text-3xl">{retreat.summary}</p>
            {retreat.concept && <div className="mt-6"><Markdown>{retreat.concept}</Markdown></div>}
          </section>

          {retreat.personalMessage && (
            <section className="mt-16 rounded-[2rem] bg-blush/60 p-7 sm:p-10" aria-labelledby="msg-title">
              <p id="msg-title" className="eyebrow">A message from Yulia</p>
              <div className="mt-4 font-display text-2xl italic leading-snug text-plum sm:text-[1.7rem]">
                <Markdown className="[&>*+*]:mt-4">{retreat.personalMessage}</Markdown>
              </div>
              <p className="mt-6 font-display text-xl text-plum-soft">— Yulia Moon</p>
            </section>
          )}

          {/* GALLERY */}
          {(retreat.gallery.length > 0 || videoId) && (
            <section className="mt-16" aria-label="Gallery">
              <div tabIndex={0} aria-label="Photo and video gallery — scroll sideways" className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
                {videoId && (
                  <div className="w-[85vw] shrink-0 snap-center sm:col-span-2 sm:w-auto">
                    <YouTubeEmbed id={videoId} title={`${retreat.title} — video`} />
                  </div>
                )}
                {retreat.gallery.map((m, i) => (
                  <figure key={m.id} className={`relative w-[80vw] shrink-0 snap-center overflow-hidden rounded-(--radius-card) bg-sand sm:w-auto ${i % 3 === 0 ? "aspect-[4/5] sm:row-span-2 sm:aspect-auto" : "aspect-[4/5] sm:aspect-[4/3]"}`}>
                    {m.kind === "video" ? (
                      <video src={m.url} poster={m.posterUrl ?? undefined} aria-label={m.alt || `${retreat.title} — video`} controls muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <MediaImage media={m} sizes="(min-width:640px) 40vw, 80vw" />
                    )}
                    {m.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-deep/80 to-transparent p-4 text-sm text-ivory">{m.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* EXPERIENCE */}
          {(retreat.guestExperience || retreat.activities.length > 0 || retreat.benefits.length > 0) && (
            <section id="experience" className="mt-20 scroll-mt-36">
              <p className="eyebrow">Your experience</p>
              <h2 className="display-md mt-3">What your days will feel like</h2>
              {retreat.guestExperience && <div className="mt-6"><Markdown>{retreat.guestExperience}</Markdown></div>}
              {retreat.benefits.length > 0 && (
                <div className="mt-10 rounded-[2rem] bg-lavender/35 p-6 sm:p-8">
                  <h3 className="font-display text-2xl text-plum">What you&rsquo;ll take home</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {retreat.benefits.map((b, i) => <li key={i} className="flex gap-3"><span aria-hidden className="text-blush-deep">✦</span>{b}</li>)}
                  </ul>
                </div>
              )}
              {retreat.activities.length > 0 && (
                <ul className="mt-10 grid gap-4 sm:grid-cols-2">
                  {retreat.activities.map((a, i) => (
                    <li key={i} className="card p-6">
                      <span aria-hidden className="font-display text-3xl text-blush-deep">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-2 font-display text-2xl text-plum">{a.title}</h3>
                      <p className="mt-2 text-ink/80">{a.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* ITINERARY */}
          {retreat.itinerary.length > 0 && (
            <section id="itinerary" className="mt-20 scroll-mt-36">
              <p className="eyebrow">Sample itinerary</p>
              <h2 className="display-md mt-3">Day by day</h2>
              <p className="mt-3 text-muted">A sample rhythm — the exact schedule may shift with the weather, the tides and the group.</p>
              <ol className="mt-8 border-l border-line">
                {retreat.itinerary.map((d, i) => (
                  <li key={i} className="relative pl-8 pb-8 last:pb-0">
                    <span aria-hidden className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-ivory bg-blush-deep" />
                    <details open={i === 0} className="group">
                      <summary className="flex min-h-11 cursor-pointer list-none items-baseline gap-3 [&::-webkit-details-marker]:hidden">
                        <span className="eyebrow shrink-0">{d.day}</span>
                        <span className="font-display text-2xl text-plum">{d.title}</span>
                        <span aria-hidden className="ml-auto text-plum transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-2 whitespace-pre-line text-ink/80">{d.description}</p>
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* INCLUDED */}
          {(retreat.inclusions.length > 0 || retreat.exclusions.length > 0) && (
            <section className="mt-20 grid gap-6 sm:grid-cols-2" aria-label="What's included">
              {retreat.inclusions.length > 0 && (
                <div className="card p-6 sm:p-7">
                  <h2 className="font-display text-2xl text-plum">Included</h2>
                  <ul className="mt-4 grid gap-3">
                    {retreat.inclusions.map((x, i) => <li key={i} className="flex gap-3"><CheckIcon className="mt-1 h-4 w-4 shrink-0 text-success" />{x}</li>)}
                  </ul>
                </div>
              )}
              {retreat.exclusions.length > 0 && (
                <div className="rounded-(--radius-card) bg-sand/50 p-6 sm:p-7">
                  <h2 className="font-display text-2xl text-plum">Not included</h2>
                  <ul className="mt-4 grid gap-3">
                    {retreat.exclusions.map((x, i) => <li key={i} className="flex gap-3"><MinusIcon className="mt-1 h-4 w-4 shrink-0 text-muted" />{x}</li>)}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* STAY */}
          {retreat.accommodation && (
            <section id="stay" className="mt-20 scroll-mt-36">
              <p className="eyebrow">Where you&rsquo;ll stay</p>
              <h2 className="display-md mt-3">Accommodation</h2>
              <div className="mt-6"><Markdown>{retreat.accommodation}</Markdown></div>
            </section>
          )}

          {/* BOOK */}
          <section id="book" className="mt-20 scroll-mt-36 rounded-[2rem] bg-ivory-deep p-5 ring-1 ring-line sm:p-8">
            <p className="eyebrow">Dates &amp; prices</p>
            <h2 className="display-md mt-3">Reserve your place</h2>
            <div className="mt-8">
              {departures.length > 0 ? (
                <BookingSelector slug={retreat.slug} departures={departures} />
              ) : (
                <p className="rounded-2xl bg-sand/60 p-5">New dates for this retreat will be announced soon. Join the waitlist and you&rsquo;ll hear first.</p>
              )}
            </div>
            {showWaitlist && (
              <div className="mt-10 border-t border-line pt-8" id="waitlist">
                <h3 className="font-display text-2xl text-plum">Join the waitlist</h3>
                <p className="mt-2 text-muted">Leave your details and we&rsquo;ll email you if a place opens up or new dates are released. Joining the waitlist is not a booking.</p>
                <div className="mt-5">
                  <WaitlistForm retreatId={retreat.id} departures={departures.map((d) => ({ id: d.id, label: d.dateLabel }))} />
                </div>
              </div>
            )}
          </section>

          {/* FAQ */}
          {retreat.faqs.length > 0 && (
            <section id="faq" className="mt-20 scroll-mt-36">
              <p className="eyebrow">Good to know</p>
              <h2 className="display-md mt-3">Questions &amp; answers</h2>
              <div className="mt-8 divide-y divide-line border-y border-line">
                {retreat.faqs.map((f) => (
                  <details key={f.id} className="group py-2">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-plum [&::-webkit-details-marker]:hidden">
                      {f.question}
                      <span aria-hidden className="text-2xl transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="pb-4"><Markdown>{f.answer}</Markdown></div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* TERMS */}
          {retreat.terms && (
            <section className="mt-16" aria-label="Terms">
              <details className="card p-6">
                <summary className="cursor-pointer font-display text-xl text-plum">Booking terms for this retreat</summary>
                <div className="mt-4 text-[0.95rem]"><Markdown>{retreat.terms}</Markdown></div>
              </details>
              <p className="mt-3 text-sm text-muted">See also our general <Link href="/policies/booking-terms" className="link-underline">booking terms</Link>.</p>
            </section>
          )}

          {retreat.isPlaceholder && <div className="mt-10"><PlaceholderNote>All details on this retreat are placeholders for Yulia to replace</PlaceholderNote></div>}
        </div>

        {/* DESKTOP STICKY SUMMARY */}
        <aside className="hidden lg:block" aria-label="Booking summary">
          <div className="sticky top-40 card p-7">
            <p className="eyebrow">From</p>
            <p className="mt-1 font-display text-4xl text-plum">{retreat.fromPrice ? formatMoney(retreat.fromPrice.amount, retreat.fromPrice.currency) : "Price TBC"}</p>
            <ul className="mt-5 grid gap-2 text-sm">
              {retreat.departures.slice(0, 4).map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3">
                  <span>{formatDateRange(d.startDate, d.endDate)}</span>
                  <AvailabilityBadge value={d.availability} />
                </li>
              ))}
            </ul>
            <a href="#book" className="btn-primary mt-6 w-full">{anyBookable ? "Choose dates" : "Join the waitlist"} <ArrowRight /></a>
            <Link href={`/contact?retreat=${retreat.id}`} className="mt-3 block text-center text-sm text-plum link-underline">Ask Yulia a question</Link>
          </div>
        </aside>
      </div>

      {/* MOBILE STICKY BOOKING BAR */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted">From</p>
            <p className="truncate font-display text-2xl leading-none text-plum">{retreat.fromPrice ? formatMoney(retreat.fromPrice.amount, retreat.fromPrice.currency) : "Price TBC"}</p>
          </div>
          <a href="#book" className="btn-primary min-h-12 px-6">{anyBookable ? "Book now" : "Waitlist"}</a>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </>
  );
}
