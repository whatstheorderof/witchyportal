import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRetreatBySlug } from "@/lib/queries";
import { getAdmin } from "@/lib/auth";
import { formatDateRange, nightsBetween } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { parseYouTubeId } from "@/lib/validation";
import { retreatFacts } from "@/lib/retreat-facts";
import { MediaImage } from "@/components/MediaImage";
import { Markdown, PlaceholderNote } from "@/components/Markdown";
import { AvailabilityBadge, isBookable } from "@/components/Availability";
import { BookingSelector, type SelectorDeparture } from "@/components/BookingSelector";
import { RetreatBookingCard } from "@/components/RetreatBookingCard";
import { StickyBookingBar } from "@/components/StickyBookingBar";
import { TrackView } from "@/components/Track";
import { WaitlistForm } from "@/components/forms";
import { YouTubeEmbed } from "@/components/YouTube";
import { CheckIcon, MinusIcon, PinIcon } from "@/components/Icons";
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
  const title = retreat.seoTitle || retreat.title;
  const description = retreat.seoDescription || retreat.summary;
  return { title, description, openGraph: { title, description, type: "website" }, twitter: { card: "summary_large_image", title, description } };
}

function Fact({ label, value, muted }: { label: string; value: React.ReactNode; muted?: boolean }) {
  return (
    <div className="min-w-[8.5rem]">
      <dt className="text-[0.68rem] uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd className={`mt-0.5 font-medium ${muted ? "text-muted" : "text-ink"}`}>{value}</dd>
    </div>
  );
}

function Detail({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-20 scroll-mt-36" aria-labelledby={id ? `${id}-h` : undefined}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id ? `${id}-h` : undefined} className="display-md mt-3">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function RetreatPage(props: Props) {
  const { retreat, isPreview } = await load(props);
  if (!retreat) notFound();
  const f = retreatFacts(retreat);

  const departures: SelectorDeparture[] = retreat.departures.map((d) => {
    const n = nightsBetween(d.startDate, d.endDate);
    return {
      id: d.id,
      dateLabel: formatDateRange(d.startDate, d.endDate),
      nightsLabel: `${n + 1} days · ${n} night${n === 1 ? "" : "s"}`,
      availability: d.availability,
      availabilityNote: d.availabilityNote,
      bookable: isBookable(d.availability),
      options: d.options.map((o) => {
        const total = o.totalPrice ?? (o.paymentType === "full" ? o.amount : null);
        const remaining = total != null && o.paymentType === "deposit" ? total - o.amount : null;
        return {
          id: o.id,
          label: o.label,
          description: o.description,
          paymentType: o.paymentType,
          amountLabel: formatMoney(o.amount, o.currency),
          totalLabel: total != null ? formatMoney(total, o.currency) : null,
          remainingLabel: remaining && remaining > 0 ? formatMoney(remaining, o.currency) : null,
          balanceNote: o.balanceNote,
          availability: o.availability,
          bookable: isBookable(o.availability) && isBookable(d.availability),
        };
      }),
    };
  });
  const showWaitlist = retreat.departures.length === 0 || retreat.departures.some((d) => !isBookable(d.availability)) || !f.bookable;
  const videoId = retreat.videoUrl ? parseYouTubeId(retreat.videoUrl) : null;
  const hasIncluded = retreat.inclusions.length > 0 || retreat.exclusions.length > 0;

  // What Yulia still needs to confirm — shown honestly instead of empty sections.
  const pending = [
    !f.datesKnown && "Dates and prices",
    !f.destinationKnown && "Location",
    retreat.itinerary.length === 0 && "Day-by-day itinerary",
    !retreat.accommodation && "Accommodation",
    !retreat.meals && "Meals",
    !retreat.travel && "Travel guidance",
    !hasIncluded && "What's included",
    retreat.forMe.length === 0 && retreat.faqs.length === 0 && "Questions & answers",
  ].filter(Boolean) as string[];

  const sections = [
    { id: "overview", label: "Overview", show: true },
    { id: "for-you", label: "Is it for me?", show: retreat.forMe.length > 0 },
    { id: "experience", label: "Experience", show: Boolean(retreat.guestExperience || retreat.activities.length || retreat.benefits.length) },
    { id: "itinerary", label: "Itinerary", show: retreat.itinerary.length > 0 },
    { id: "stay", label: "Stay & food", show: Boolean(retreat.accommodation || retreat.meals) },
    { id: "included", label: "Included", show: hasIncluded },
    { id: "travel", label: "Travel", show: Boolean(retreat.travel) },
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
      {!isPreview && <TrackView name="retreat_view" props={{ retreat: retreat.slug }} />}

      {/* HERO */}
      <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-plum-deep text-ivory lg:min-h-[76svh]">
        <div className="absolute inset-0 -z-10">
          <MediaImage media={retreat.hero} fallback="horns" priority sizes="100vw" />
          <div className="scrim-hero absolute inset-0" />
        </div>
        <div className="container-page pb-10 pt-32 lg:pb-14">
          <Link href="/retreats" className="text-sm text-ivory/80 hover:text-ivory">← All retreats</Link>
          <p className="mt-6 flex items-center gap-1.5 text-ivory/85"><PinIcon />{f.destination}</p>
          <h1 className="display-xl mt-3 max-w-4xl text-ivory">{retreat.title}</h1>
          {retreat.tagline && <p className="mt-4 max-w-2xl text-lg text-ivory/90 sm:text-xl">{retreat.tagline}</p>}
          {retreat.isPlaceholder && <span className="placeholder-flag mt-5">Sample retreat — details are placeholders</span>}
        </div>
      </section>

      {/* KEY FACTS — destination, dates, duration, price, availability together */}
      <section aria-label="Key facts" className="border-b border-line/70 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-5">
          <dl className="flex flex-wrap gap-x-8 gap-y-3">
            <Fact label="Destination" value={f.destination} muted={!f.destinationKnown} />
            <Fact label="Dates" value={f.dates} muted={!f.datesKnown} />
            <Fact label="Duration" value={f.duration} />
            <Fact label="Price" value={f.price} muted={!f.priceKnown} />
            {f.availability && <Fact label="Availability" value={<AvailabilityBadge value={f.availability} />} />}
          </dl>
          <a href="#book" className="btn-primary hidden min-h-11 lg:inline-flex">{f.bookable ? "Choose dates & book" : "Join the waitlist"}</a>
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

      <div className="container-page grid gap-16 py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-16 lg:py-20 xl:gap-x-24">
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

          {/* IS THIS FOR ME */}
          {retreat.forMe.length > 0 && (
            <Detail id="for-you" eyebrow="Is this retreat for me?" title="Your questions, answered gently">
              <div className="grid gap-3 sm:grid-cols-2">
                {retreat.forMe.map((q, i) => (
                  <div key={i} className="card p-6">
                    <h3 className="font-display text-xl text-plum">{q.question}</h3>
                    <div className="mt-2 text-[0.97rem]"><Markdown>{q.answer}</Markdown></div>
                  </div>
                ))}
              </div>
            </Detail>
          )}
        </div>

        {/* DESKTOP BOOKING SUMMARY */}
        <aside className="hidden lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:block" aria-label="Booking summary">
          <div className="sticky top-40">
            <RetreatBookingCard retreat={retreat} layout="stacked" showImage={false} />
            <Link href={`/contact?retreat=${retreat.id}`} className="mt-4 block text-center text-sm text-plum link-underline">Ask Yulia a question</Link>
          </div>
        </aside>

        {/* GALLERY — wider grid on desktop */}
        {(retreat.gallery.length > 0 || videoId) && (
          <section aria-label="Gallery" className="min-w-0 lg:col-start-1">
            <div tabIndex={0} aria-label="Photo and video gallery — scroll sideways" className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
              {videoId && (
                <div className="w-[85vw] shrink-0 snap-center sm:col-span-3 sm:w-auto">
                  <YouTubeEmbed id={videoId} title={`${retreat.title} — video`} />
                </div>
              )}
              {retreat.gallery.map((m, i) => (
                <figure key={m.id} className={`relative w-[80vw] shrink-0 snap-center overflow-hidden rounded-(--radius-card) bg-sand sm:w-auto ${i === 0 ? "aspect-[4/5] sm:col-span-2 sm:row-span-2 sm:aspect-auto" : "aspect-[4/5] sm:aspect-[4/3]"}`}>
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

        <div className="min-w-0 lg:col-start-1">
          {/* EXPERIENCE */}
          {(retreat.guestExperience || retreat.activities.length > 0 || retreat.benefits.length > 0) && (
            <Detail id="experience" eyebrow="Your experience" title="What your days will feel like">
              {retreat.guestExperience && <Markdown>{retreat.guestExperience}</Markdown>}
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
            </Detail>
          )}

          {/* ITINERARY */}
          {retreat.itinerary.length > 0 && (
            <Detail id="itinerary" eyebrow="Sample itinerary" title="Day by day">
              <p className="-mt-3 mb-6 text-muted">A sample rhythm — the exact schedule may shift with the weather, the tides and the group.</p>
              <ol className="border-l border-line">
                {retreat.itinerary.map((d, i) => (
                  <li key={i} className="relative pb-8 pl-8 last:pb-0">
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
            </Detail>
          )}

          {/* STAY & FOOD */}
          {(retreat.accommodation || retreat.meals) && (
            <Detail id="stay" eyebrow="Where you'll stay" title="Accommodation & food">
              <div className="grid gap-6 sm:grid-cols-2">
                {retreat.accommodation && <div><h3 className="font-display text-xl text-plum">Accommodation</h3><div className="mt-2"><Markdown>{retreat.accommodation}</Markdown></div></div>}
                {retreat.meals && <div><h3 className="font-display text-xl text-plum">Meals</h3><div className="mt-2"><Markdown>{retreat.meals}</Markdown></div></div>}
              </div>
            </Detail>
          )}

          {/* INCLUDED */}
          {hasIncluded && (
            <section id="included" className="mt-20 grid scroll-mt-36 gap-6 sm:grid-cols-2" aria-label="What's included">
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

          {/* TRAVEL */}
          {retreat.travel && (
            <Detail id="travel" eyebrow="Getting there" title="Travel guidance">
              <Markdown>{retreat.travel}</Markdown>
            </Detail>
          )}

          {/* STILL TO BE CONFIRMED */}
          {pending.length > 0 && (
            <section className="mt-16 rounded-[2rem] border border-dashed border-lavender-deep/40 bg-lavender/20 p-6 sm:p-8" aria-labelledby="pending-h">
              <h2 id="pending-h" className="font-display text-2xl text-plum">Still being finalised</h2>
              <p className="mt-2 text-ink/80">Yulia is confirming these details now. Join the waitlist to hear the moment they&rsquo;re announced, or ask her anything.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {pending.map((p) => <li key={p} className="rounded-full bg-white/80 px-3 py-1 text-sm ring-1 ring-line">{p}</li>)}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="#waitlist" className="btn-primary min-h-11">Join the waitlist</a>
                <Link href={`/contact?retreat=${retreat.id}`} className="btn-outline min-h-11">Ask Yulia</Link>
              </div>
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
                <p className="rounded-2xl bg-white/70 p-5 ring-1 ring-line">Dates and prices for this retreat will be announced soon. Join the waitlist below and you&rsquo;ll hear first — joining doesn&rsquo;t commit you to anything.</p>
              )}
            </div>
            {showWaitlist && (
              <div className="mt-10 scroll-mt-36 border-t border-line pt-8" id="waitlist">
                <h3 className="font-display text-2xl text-plum">Join the waitlist</h3>
                <p className="mt-2 text-muted">We&rsquo;ll email you when dates are released or a place opens up, before anything is announced publicly. Joining the waitlist is not a booking.</p>
                <div className="mt-5">
                  <WaitlistForm retreatId={retreat.id} departures={departures.map((d) => ({ id: d.id, label: d.dateLabel }))} />
                </div>
              </div>
            )}
          </section>

          {/* FAQ */}
          {retreat.faqs.length > 0 && (
            <Detail id="faq" eyebrow="Good to know" title="Questions & answers">
              <div className="divide-y divide-line border-y border-line">
                {retreat.faqs.map((q) => (
                  <details key={q.id} className="group py-2">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-plum [&::-webkit-details-marker]:hidden">
                      {q.question}
                      <span aria-hidden className="text-2xl transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="pb-4"><Markdown>{q.answer}</Markdown></div>
                  </details>
                ))}
              </div>
            </Detail>
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
      </div>

      <StickyBookingBar
        price={retreat.fromPrice ? formatMoney(retreat.fromPrice.amount, retreat.fromPrice.currency) : null}
        dates={retreat.nextDeparture ? formatDateRange(retreat.nextDeparture.startDate, retreat.nextDeparture.endDate) : null}
        bookable={f.bookable}
      />
    </>
  );
}
