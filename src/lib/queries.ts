import "server-only";
import { connection } from "next/server";
import { and, asc, desc, eq, inArray, lte, ne, or, sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { db } from "@/db";
import {
  bookingOptions,
  departures,
  faqs,
  highlights,
  media,
  pages,
  posts,
  retreats,
  videos,
  type BookingOption,
  type Departure,
  type Media,
  type Retreat,
} from "@/db/schema";

/**
 * Public visibility rule: published, or scheduled with publish_at in the past.
 * Evaluated at request time, so scheduled items appear exactly on time
 * without a cron job or redeploy.
 */
export function isLive(t: { status: AnyPgColumn; publishAt: AnyPgColumn }): SQL {
  return or(
    eq(t.status, "published"),
    and(eq(t.status, "scheduled"), lte(t.publishAt, sql`now()`)),
  )!;
}

export type DepartureWithOptions = Departure & { options: BookingOption[] };
export type RetreatCard = Retreat & {
  hero: Media | null;
  departures: DepartureWithOptions[];
  fromPrice: { amount: number; currency: string } | null;
  nextDeparture: DepartureWithOptions | null;
  overallAvailability: Departure["availability"] | null;
};

async function attachDepartures(list: Retreat[], includeHidden = false): Promise<RetreatCard[]> {
  if (!list.length) return [];
  const ids = list.map((r) => r.id);
  const deps = await db
    .select()
    .from(departures)
    .where(and(inArray(departures.retreatId, ids), includeHidden ? undefined : eq(departures.isVisible, true)))
    .orderBy(asc(departures.startDate), asc(departures.sortOrder));
  const opts = deps.length
    ? await db
        .select()
        .from(bookingOptions)
        .where(
          and(
            inArray(bookingOptions.departureId, deps.map((d) => d.id)),
            includeHidden ? undefined : eq(bookingOptions.isVisible, true),
          ),
        )
        .orderBy(asc(bookingOptions.sortOrder), asc(bookingOptions.amount))
    : [];
  const heroIds = list.map((r) => r.heroMediaId).filter(Boolean) as string[];
  const heroes = heroIds.length ? await db.select().from(media).where(inArray(media.id, heroIds)) : [];
  const today = new Date().toISOString().slice(0, 10);

  return list.map((r) => {
    const ds: DepartureWithOptions[] = deps
      .filter((d) => d.retreatId === r.id)
      .map((d) => ({ ...d, options: opts.filter((o) => o.departureId === d.id) }));
    const upcoming = ds.filter((d) => d.endDate >= today);
    const bookable = upcoming.flatMap((d) =>
      ["available", "limited"].includes(d.availability)
        ? d.options.filter((o) => ["available", "limited"].includes(o.availability))
        : [],
    );
    // "From" price = lowest full price (a deposit is not the price of the retreat).
    const priced = bookable.length ? bookable : upcoming.flatMap((d) => d.options);
    const fromCandidates = priced.map((o) => ({ amount: o.totalPrice ?? o.amount, currency: o.currency }));
    const fromPrice = fromCandidates.sort((a, b) => a.amount - b.amount)[0] ?? null;
    const order = ["available", "limited", "waitlist", "sold_out", "closed"] as const;
    const overall = upcoming.length
      ? order.find((s) => upcoming.some((d) => d.availability === s)) ?? null
      : null;
    return {
      ...r,
      hero: heroes.find((h) => h.id === r.heroMediaId) ?? null,
      departures: upcoming,
      fromPrice,
      nextDeparture: upcoming[0] ?? null,
      overallAvailability: overall,
    };
  });
}

export async function listRetreats(): Promise<RetreatCard[]> {
  await connection();
  const rows = await db.select().from(retreats).where(isLive(retreats)).orderBy(asc(retreats.sortOrder), desc(retreats.createdAt));
  return attachDepartures(rows);
}

export async function getRetreatBySlug(slug: string, opts: { preview?: boolean } = {}) {
  await connection();
  const [row] = await db
    .select()
    .from(retreats)
    .where(and(eq(retreats.slug, slug), opts.preview ? undefined : isLive(retreats)))
    .limit(1);
  if (!row) return null;
  const [card] = await attachDepartures([row]);
  const galleryIds = (row.gallery ?? []).filter(Boolean);
  const galleryRows = galleryIds.length ? await db.select().from(media).where(inArray(media.id, galleryIds)) : [];
  const gallery = galleryIds.map((id) => galleryRows.find((g) => g.id === id)).filter(Boolean) as Media[];
  const retreatFaqs = await db
    .select()
    .from(faqs)
    .where(and(eq(faqs.retreatId, row.id), opts.preview ? undefined : isLive(faqs)))
    .orderBy(asc(faqs.sortOrder));
  return { ...card, gallery, faqs: retreatFaqs };
}

export async function getRetreatById(id: string) {
  await connection();
  const [row] = await db.select().from(retreats).where(and(eq(retreats.id, id), isLive(retreats))).limit(1);
  if (!row) return null;
  return (await attachDepartures([row]))[0];
}

/** Resolves a booking option with its departure and retreat — public only. */
export async function getBookingSelection(optionId: string) {
  await connection();
  const rows = await db
    .select({ option: bookingOptions, departure: departures, retreat: retreats })
    .from(bookingOptions)
    .innerJoin(departures, eq(bookingOptions.departureId, departures.id))
    .innerJoin(retreats, eq(departures.retreatId, retreats.id))
    .where(and(eq(bookingOptions.id, optionId), eq(bookingOptions.isVisible, true), eq(departures.isVisible, true), isLive(retreats)))
    .limit(1);
  return rows[0] ?? null;
}

export async function listPosts(type: (typeof posts.$inferSelect)["type"], opts: { topic?: string; limit?: number } = {}) {
  await connection();
  const rows = await db
    .select({ post: posts, cover: media })
    .from(posts)
    .leftJoin(media, eq(posts.coverMediaId, media.id))
    .where(and(eq(posts.type, type), isLive(posts), opts.topic ? eq(posts.topic, opts.topic) : undefined))
    .orderBy(desc(sql`coalesce(${posts.publishAt}, ${posts.createdAt})`))
    .limit(opts.limit ?? 100);
  return rows.map((r) => ({ ...r.post, cover: r.cover }));
}

export async function listTopics(type: (typeof posts.$inferSelect)["type"]) {
  await connection();
  const rows = await db
    .selectDistinct({ topic: posts.topic })
    .from(posts)
    .where(and(eq(posts.type, type), isLive(posts)));
  return rows.map((r) => r.topic).filter(Boolean).sort();
}

export async function getPost(type: (typeof posts.$inferSelect)["type"], slug: string, opts: { preview?: boolean } = {}) {
  await connection();
  const [row] = await db
    .select({ post: posts, cover: media })
    .from(posts)
    .leftJoin(media, eq(posts.coverMediaId, media.id))
    .where(and(eq(posts.type, type), eq(posts.slug, slug), opts.preview ? undefined : isLive(posts)))
    .limit(1);
  return row ? { ...row.post, cover: row.cover } : null;
}

export function publishedAt(p: { publishAt: Date | null; createdAt: Date }) {
  return p.publishAt ?? p.createdAt;
}

export async function listVideos(opts: { kind?: "video" | "short"; topic?: string; limit?: number } = {}) {
  await connection();
  return db
    .select()
    .from(videos)
    .where(and(isLive(videos), opts.kind ? eq(videos.kind, opts.kind) : undefined, opts.topic ? eq(videos.topic, opts.topic) : undefined))
    .orderBy(asc(videos.sortOrder), desc(sql`coalesce(${videos.publishAt}, ${videos.createdAt})`))
    .limit(opts.limit ?? 100);
}

export async function listHighlights() {
  await connection();
  const rows = await db
    .select({ h: highlights, m: media })
    .from(highlights)
    .leftJoin(media, eq(highlights.mediaId, media.id))
    .where(isLive(highlights))
    .orderBy(asc(highlights.sortOrder));
  return rows.map((r) => ({ ...r.h, media: r.m }));
}

export async function listGeneralFaqs() {
  await connection();
  return db.select().from(faqs).where(and(sql`${faqs.retreatId} is null`, isLive(faqs))).orderBy(asc(faqs.sortOrder));
}

export async function getPage(slug: string) {
  await connection();
  const [row] = await db.select().from(pages).where(and(eq(pages.slug, slug), isLive(pages))).limit(1);
  return row ?? null;
}

export async function getLivePostById(id: string | null | undefined) {
  if (!id) return null;
  await connection();
  const [row] = await db
    .select({ post: posts, cover: media })
    .from(posts)
    .leftJoin(media, eq(posts.coverMediaId, media.id))
    .where(and(eq(posts.id, id), isLive(posts)))
    .limit(1);
  return row ? { ...row.post, cover: row.cover } : null;
}

export async function getLiveVideoById(id: string | null | undefined) {
  if (!id) return null;
  await connection();
  const [row] = await db.select().from(videos).where(and(eq(videos.id, id), isLive(videos))).limit(1);
  return row ?? null;
}

/** Latest of several short-post types (tips, affirmations, motivations). */
export async function latestShortPost() {
  const all = await Promise.all((["tip", "affirmation", "motivation"] as const).map((t) => listPosts(t, { limit: 1 })));
  return all.flat().sort((a, b) => +(b.publishAt ?? b.createdAt) - +(a.publishAt ?? a.createdAt))[0] ?? null;
}

/** A few other live posts of the given types, same topic first. */
export async function relatedPosts(types: (typeof posts.$inferSelect)["type"][], exclude: string, topic: string | null, limit = 3) {
  await connection();
  const rows = await db
    .select({ post: posts, cover: media })
    .from(posts)
    .leftJoin(media, eq(posts.coverMediaId, media.id))
    .where(and(inArray(posts.type, types), isLive(posts), ne(posts.id, exclude)))
    .orderBy(desc(sql`coalesce(${posts.publishAt}, ${posts.createdAt})`))
    .limit(40);
  const all = rows.map((r) => ({ ...r.post, cover: r.cover }));
  const same = topic ? all.filter((p) => p.topic === topic) : [];
  return [...same, ...all.filter((p) => !same.includes(p))].slice(0, limit);
}

/** Find a tip, affirmation or motivation by slug. */
export async function getTipLike(slug: string, opts: { preview?: boolean } = {}) {
  for (const t of ["tip", "affirmation", "motivation"] as const) {
    const p = await getPost(t, slug, opts);
    if (p) return p;
  }
  return null;
}
