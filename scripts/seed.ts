/**
 * Seeds starter content. Safe to run more than once: each section is only
 * inserted when its table is empty.
 *
 *   npm run db:seed          — fill any empty tables
 *   tsx scripts/seed.ts --once   — used by every Vercel build: seeds a
 *                                  database only the first time, so content
 *                                  Yulia deletes never comes back
 *
 * Everything marked isPlaceholder / "[Placeholder]" is sample content that
 * Yulia must replace or delete before launch. No facts about Yulia,
 * testimonials or real retreat details are invented here.
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { sql as dsql } from "drizzle-orm";
import postgres from "postgres";
import type { PgTable } from "drizzle-orm/pg-core";
import * as s from "../src/db/schema";

const once = process.argv.includes("--once");
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  if (once) {
    console.warn("⚠ DATABASE_URL not set — skipping starter content.");
    process.exit(0);
  }
  throw new Error("DATABASE_URL is not set");
}
const client = postgres(url, { max: 1, onnotice: () => {} });
const db = drizzle(client, { schema: s });

const empty = async (table: PgTable) => {
  const [{ n }] = await db.select({ n: dsql<number>`count(*)::int` }).from(table);
  return n === 0;
};

const MARKER = "_seeded";

async function main() {
  if (once) {
    const done = await db.select().from(s.settings).where(dsql`${s.settings.key} = ${MARKER}`);
    if (done.length) {
      console.log("✓ Starter content already added — skipping");
      await client.end();
      return;
    }
  }
  /* ---------------- Media: the supplied starter photographs ---------------- */
  let mediaIds: Record<string, string> = {};
  if (await empty(s.media)) {
    const rows = await db
      .insert(s.media)
      .values([
        { url: "/images/horned-dusk-beach.jpg", alt: "A figure with long red hair and horns walks towards the sea at dusk, black chiffon sleeves billowing", width: 2560, height: 1710 },
        { url: "/images/sea-joy.jpg", alt: "A woman with red hair raising her arms in joy, waist-deep in a calm blue sea", width: 2560, height: 1710 },
        { url: "/images/veiled-crown-shore.jpg", alt: "A figure in a black star-flecked veil lifting a jewelled crown at the shoreline at dusk", width: 2560, height: 1710 },
        { url: "/images/sand-texture-golden.jpg", alt: "Close-up of wind-sculpted sand and a small shell in golden evening light", width: 2560, height: 1710 },
      ])
      .returning();
    mediaIds = { horns: rows[0].id, sea: rows[1].id, veil: rows[2].id, sand: rows[3].id };
    console.log("✓ media");
  } else {
    const rows = await db.select().from(s.media);
    const by = (f: string) => rows.find((r) => r.url.includes(f))?.id ?? rows[0]?.id;
    mediaIds = { horns: by("horned"), sea: by("sea-joy"), veil: by("veiled"), sand: by("sand") };
  }

  /* ---------------- Sample retreat ---------------- */
  let retreatId: string | undefined;
  if (await empty(s.retreats)) {
    const [r] = await db
      .insert(s.retreats)
      .values({
        slug: "sample-sea-and-moon-retreat",
        title: "Sea & Moon Retreat",
        tagline: "[Placeholder] A few days of salt water, movement and ritual by the shore",
        location: "[Location TBC]",
        country: "[Country TBC]",
        summary:
          "[Placeholder summary] Describe the heart of this retreat in two or three sentences: where it is, who it's for, and how guests will feel when they leave.",
        concept:
          "[Placeholder] Explain the concept of the retreat here — the idea behind it, the season or moon phase it's timed around, and the practices it draws on.\n\nThis text is Markdown, so Yulia can use **bold**, *italics*, lists and links.",
        personalMessage:
          "[Placeholder] A personal note from Yulia to the women considering this retreat — in her own words.",
        guestExperience:
          "[Placeholder] Describe the intended guest experience: the pace of the days, how much free time there is, the size of the group and the feeling of the space.",
        benefits: [
          "[Placeholder] What Yulia hopes each woman takes home — e.g. a feeling, a practice, a new confidence",
          "[Placeholder] How the retreat helps in everyday life afterwards",
          "[Placeholder] A ritual or tool to keep using at home",
        ],
        activities: [
          { title: "[Activity] Sunrise movement", description: "[Placeholder] e.g. gentle dance or movement on the beach — replace with the real activity." },
          { title: "[Activity] Moon ritual circle", description: "[Placeholder] Describe the ritual or circle practice." },
          { title: "[Activity] Sea swimming", description: "[Placeholder] Describe any swimming or water practice, including safety notes." },
          { title: "[Activity] Free time", description: "[Placeholder] What guests can do in their own time." },
        ],
        itinerary: [
          { day: "Day 1", title: "[Placeholder] Arrival & opening circle", description: "Arrive from [time]. Settle in, welcome dinner and opening ritual." },
          { day: "Day 2", title: "[Placeholder] Sea & movement", description: "Morning movement, brunch, afternoon free, evening practice." },
          { day: "Day 3", title: "[Placeholder] Moon ritual", description: "Describe the day." },
          { day: "Day 4", title: "[Placeholder] Closing & departure", description: "Closing circle and departures by [time]." },
        ],
        inclusions: ["[Placeholder] Nights of accommodation", "[Placeholder] Meals included", "[Placeholder] All sessions and rituals", "[Placeholder] Materials"],
        exclusions: ["[Placeholder] Flights and travel to the venue", "[Placeholder] Travel insurance", "[Placeholder] Optional extras"],
        accommodation:
          "[Placeholder] Describe the venue, room types (shared/private), bathrooms, accessibility, and what guests should bring.",
        terms:
          "[Placeholder — to be written or reviewed by Yulia / a legal adviser]\n\n- Deposit and balance due dates\n- Cancellation and refund policy\n- What happens if the retreat is cancelled\n- Travel insurance requirement",
        heroMediaId: mediaIds.horns,
        gallery: [mediaIds.sea, mediaIds.veil, mediaIds.sand].filter(Boolean),
        isPlaceholder: true,
        status: "published",
        publishAt: new Date(),
      })
      .returning();
    retreatId = r.id;

    const deps = await db
      .insert(s.departures)
      .values([
        { retreatId: r.id, startDate: "2027-05-20", endDate: "2027-05-24", availability: "available", availabilityNote: "[Placeholder] Places available", sortOrder: 0 },
        { retreatId: r.id, startDate: "2027-09-16", endDate: "2027-09-20", availability: "waitlist", sortOrder: 1 },
      ])
      .returning();

    await db.insert(s.bookingOptions).values([
      { departureId: deps[0].id, label: "[Placeholder] Shared room — deposit", description: "Replace label, price and payment link in Admin.", paymentType: "deposit", amount: 25000, totalPrice: 100000, currency: "GBP", balanceNote: "[Placeholder] Balance due 8 weeks before arrival", availability: "available", sortOrder: 0 },
      { departureId: deps[0].id, label: "[Placeholder] Shared room — pay in full", paymentType: "full", amount: 100000, totalPrice: 100000, currency: "GBP", availability: "available", sortOrder: 1 },
      { departureId: deps[0].id, label: "[Placeholder] Private room — deposit", paymentType: "deposit", amount: 35000, totalPrice: 140000, currency: "GBP", balanceNote: "[Placeholder] Balance due 8 weeks before arrival", availability: "limited", sortOrder: 2 },
      { departureId: deps[1].id, label: "[Placeholder] Shared room — deposit", paymentType: "deposit", amount: 25000, totalPrice: 100000, currency: "GBP", availability: "sold_out", sortOrder: 0 },
    ]);

    await db.insert(s.faqs).values([
      { retreatId: r.id, question: "[Placeholder] Do I need any experience?", answer: "[Placeholder answer for Yulia to write.]", status: "published", isPlaceholder: true, sortOrder: 0 },
      { retreatId: r.id, question: "[Placeholder] Can I come on my own?", answer: "[Placeholder answer.]", status: "published", isPlaceholder: true, sortOrder: 1 },
      { retreatId: r.id, question: "[Placeholder] How do I get there?", answer: "[Placeholder answer.]", status: "published", isPlaceholder: true, sortOrder: 2 },
    ]);
    console.log("✓ sample retreat");
  }

  /* ---------------- Content ---------------- */
  if (await empty(s.posts)) {
    const now = Date.now();
    const days = (n: number) => new Date(now - n * 86400000);
    await db.insert(s.posts).values([
      { type: "tip", slug: "sample-tip-salt-bowl", title: "Keep a small bowl of sea salt by your door", excerpt: "A simple threshold ritual: as you come home, pause, touch the salt and leave the day outside. [Sample tip — replace]", topic: "Home rituals", status: "published", publishAt: days(1), isPlaceholder: true },
      { type: "tip", slug: "sample-tip-moon-journal", title: "Start a moon journal", excerpt: "Write one line each night about how you feel and note the moon phase. After a month, look for your own patterns. [Sample tip — replace]", topic: "Moon magic", status: "published", publishAt: days(3), isPlaceholder: true },
      { type: "tip", slug: "sample-tip-barefoot", title: "Five barefoot minutes", excerpt: "Stand barefoot on grass or sand and notice three things you can hear. [Sample tip — replace]", topic: "Grounding", status: "published", publishAt: days(6), isPlaceholder: true },
      { type: "affirmation", slug: "sample-affirmation-tide", title: "Like the tide, I am allowed to rise and rest", status: "published", publishAt: days(0), isPlaceholder: true, topic: "Self-trust" },
      { type: "affirmation", slug: "sample-affirmation-voice", title: "My intuition is a voice worth listening to", status: "published", publishAt: days(4), isPlaceholder: true, topic: "Intuition" },
      { type: "motivation", slug: "sample-motivation-small-steps", title: "Small steps still move you forward", excerpt: "You don't need a full moon or a perfect plan to begin. One small, kind action today is enough. [Sample motivation — replace]", topic: "Motivation", status: "published", publishAt: days(2), isPlaceholder: true },
      { type: "astrology", slug: "sample-libra-season", title: "[Sample] Libra season: finding your balance", period: "Libra season", topic: "Seasonal", excerpt: "[Sample astrology post — Yulia to write her own weekly or seasonal wisdom here.]", body: "[Sample body text. Replace with Yulia's own astrology post.]\n\nLibra season traditionally invites reflection on balance and relationships. Use this space for Yulia's interpretation and suggested ritual.", coverMediaId: mediaIds.veil, status: "published", publishAt: days(2), isPlaceholder: true },
      { type: "article", slug: "sample-article-beginning-a-practice", title: "[Sample] Beginning a gentle daily practice", topic: "Rituals", excerpt: "[Sample article excerpt — replace with Yulia's writing.]", body: "[Sample article body — replace with Yulia's writing.]\n\n## A heading\n\nArticles support **Markdown**: headings, lists, links and quotes.\n\n> A pull quote looks like this.\n\n- A list item\n- Another list item", coverMediaId: mediaIds.sand, status: "published", publishAt: days(5), isPlaceholder: true },
      { type: "article", slug: "sample-article-sea-and-self", title: "[Sample] What the sea teaches about rest", topic: "Nature", excerpt: "[Sample article excerpt — replace with Yulia's writing.]", body: "[Sample article body — replace.]", coverMediaId: mediaIds.sea, status: "published", publishAt: days(9), isPlaceholder: true },
      { type: "article", slug: "sample-article-scheduled", title: "[Sample] A scheduled article", topic: "Rituals", excerpt: "This sample is scheduled for the future to show how scheduling works — it becomes public automatically at its publish time.", body: "Scheduled sample.", status: "scheduled", publishAt: new Date(now + 7 * 86400000), isPlaceholder: true },
    ]);
    console.log("✓ sample posts");
  }

  if (await empty(s.faqs)) {
    // only reached when the retreat already existed
  }
  const [{ n: generalFaqs }] = await db.select({ n: dsql<number>`count(*)::int` }).from(s.faqs).where(dsql`${s.faqs.retreatId} is null`);
  if (generalFaqs === 0) {
    await db.insert(s.faqs).values([
      { question: "[Placeholder] How do I book a retreat?", answer: "Choose a retreat, pick your dates and option, review the summary, then pay securely on our payment provider's page. Yulia confirms every booking personally by email.", status: "published", isPlaceholder: true, sortOrder: 0 },
      { question: "[Placeholder] Is my place confirmed after I pay?", answer: "Your place is confirmed when Yulia has received your payment and emailed you. [Yulia to confirm wording.]", status: "published", isPlaceholder: true, sortOrder: 1 },
      { question: "[Placeholder] What if a retreat is full?", answer: "Join the waitlist on the retreat page and we'll email you if a place opens up.", status: "published", isPlaceholder: true, sortOrder: 2 },
    ]);
    console.log("✓ general FAQs");
  }

  if (await empty(s.highlights)) {
    await db.insert(s.highlights).values([
      { eyebrow: "Retreats", title: "Gather by the sea", text: "Small-group retreats with ritual, movement and rest.", href: "/retreats", mediaId: mediaIds.veil, status: "published", sortOrder: 0 },
      { eyebrow: "Birth chart", title: "Read your stars", text: "Calculate your natal chart in a few seconds.", href: "/birth-chart", mediaId: mediaIds.sand, status: "published", sortOrder: 1 },
      { eyebrow: "Discover", title: "Weekly witchy wisdom", text: "Tips, affirmations and astrology for the week ahead.", href: "/discover", mediaId: mediaIds.horns, status: "published", sortOrder: 2 },
    ]);
    console.log("✓ highlights");
  }

  if (await empty(s.pages)) {
    const legal = "\n\n> **Placeholder policy.** This template must be reviewed and completed by Yulia or a legal adviser before launch.";
    await db.insert(s.pages).values([
      {
        slug: "privacy", title: "Privacy policy", status: "published",
        body: `**Who we are.** Witchy Portal is run by Yulia Moon ([business name and address to be added]). Contact: [email].${legal}\n\n## What we collect\n\n- **Enquiries** — your name, email and message, so we can reply.\n- **Waitlist** — your name, email, chosen retreat and any note, so we can tell you when a place opens.\n- **Newsletter** — your email address and the date you consented, so we can send you updates. You can unsubscribe at any time.\n- **Booking redirects** — when you continue to payment we record which option was chosen (no personal details). Payments are handled by our payment provider under their own privacy policy.\n\n## Birth chart\n\nThe birth details you enter are used only to calculate your chart and are **not stored** by Witchy Portal.\n\n## Videos\n\nYouTube videos load from youtube-nocookie.com only when you press play.\n\n## Your rights\n\n[Add UK GDPR rights, retention periods and how to contact us / the ICO.]`,
      },
      { slug: "terms", title: "Website terms", status: "published", body: `[Placeholder website terms of use.]${legal}` },
      {
        slug: "booking-terms", title: "Booking terms", status: "published",
        body: `[Placeholder booking terms.]${legal}\n\n## Booking and payment\n\n- Prices, deposits and balances are shown on each retreat before you pay.\n- Payment is taken by our payment provider. Your place is confirmed when Yulia emails you.\n\n## Balance payments\n\n[When balances are due and how they are collected.]\n\n## Cancellations and refunds\n\n[Your cancellation policy.]\n\n## If we cancel\n\n[What happens if a retreat is cancelled.]\n\n## Insurance, health and safety\n\n[Travel insurance, health declarations, swimming safety.]`,
      },
      { slug: "cookies", title: "Cookies", status: "published", body: `Witchy Portal uses only essential cookies. Visitors are not tracked for advertising. Administrators receive a secure sign-in cookie.\n\nYouTube videos use the privacy-enhanced youtube-nocookie.com player and only load when you press play.${legal}` },
    ]);
    console.log("✓ policy pages");
  }

  const [{ n: settingsCount }] = await db.select({ n: dsql<number>`count(*)::int` }).from(s.settings);
  if (settingsCount === 0) {
    await db.insert(s.settings).values([
      { key: "home", value: { heroMediaId: mediaIds.horns, introMediaId: mediaIds.sea, featuredRetreatId: retreatId ?? null } },
      { key: "about", value: { portraitMediaId: mediaIds.sea, secondaryMediaId: mediaIds.veil } },
    ]);
    console.log("✓ settings");
  }

  await db.insert(s.settings).values({ key: MARKER, value: { at: new Date().toISOString() } }).onConflictDoNothing();
  await client.end();
  console.log("✓ Starter content added");
}

main().catch(async (e) => {
  console.error(e);
  await client.end();
  process.exit(1);
});
