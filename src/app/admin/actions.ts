"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { and, eq, gte, sql } from "drizzle-orm";
import { del } from "@vercel/blob";
import { db } from "@/db";
import * as s from "@/db/schema";
import { requireAdmin, startSession, endSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { fieldErrors, type FormState } from "@/lib/forms";
import { parseMoney, CURRENCIES } from "@/lib/money";
import { fromDateTimeLocal } from "@/lib/dates";
import { parseYouTubeId, slugSchema, slugify, validatePaymentUrl } from "@/lib/validation";
import { DEFAULTS, saveSetting, type SettingsKey } from "@/lib/settings";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const optStr = (fd: FormData, k: string) => str(fd, k) || null;
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const lines = (fd: FormData, k: string) => str(fd, k).split("\n").map((l) => l.trim()).filter(Boolean);
const uuidOrNull = (fd: FormData, k: string) => {
  const v = str(fd, k);
  return /^[0-9a-f-]{36}$/i.test(v) ? v : null;
};
const ok = (message: string): FormState => ({ ok: true, message });
const fail = (message: string, errors?: Record<string, string>): FormState => ({ ok: false, message, errors });

function refreshSite() {
  revalidatePath("/", "layout");
}

/** Normalises editorial status + publish time and validates scheduling. */
function readPublishing(fd: FormData): { status: (typeof s.publishStatus.enumValues)[number]; publishAt: Date | null } | { error: string } {
  const status = str(fd, "status") as (typeof s.publishStatus.enumValues)[number];
  if (!s.publishStatus.enumValues.includes(status)) return { error: "Choose a valid status" };
  let publishAt = fromDateTimeLocal(str(fd, "publishAt"));
  if (status === "scheduled" && !publishAt) return { error: "Scheduled items need a publish date and time" };
  if (status === "published" && !publishAt) publishAt = new Date();
  return { status, publishAt };
}

async function uniqueSlug<T extends { slug: string }>(base: string, exists: (slug: string) => Promise<boolean>) {
  let slug = slugify(base) || "untitled";
  let i = 2;
  while (await exists(slug)) slug = `${slugify(base)}-${i++}`;
  return slug;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${email}|${ip}`;
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(s.loginAttempts)
    .where(and(eq(s.loginAttempts.key, key), eq(s.loginAttempts.success, false), gte(s.loginAttempts.createdAt, since)));
  if (n >= 5) return fail("Too many attempts. Please wait 15 minutes and try again.");

  const [user] = await db.select().from(s.adminUsers).where(eq(s.adminUsers.email, email)).limit(1);
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;
  await db.insert(s.loginAttempts).values({ key, success: valid });
  if (!user || !valid) return { ok: false, message: "That email and password don't match.", values: { email } };

  await db.update(s.adminUsers).set({ lastLoginAt: new Date() }).where(eq(s.adminUsers.id, user.id));
  await startSession(user);
  const next = str(fd, "next");
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ */
/* Retreats                                                            */
/* ------------------------------------------------------------------ */

export async function createRetreat(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const title = str(fd, "title");
  if (!title) return fail("Give the retreat a title", { title: "Required" });
  const slug = await uniqueSlug(title, async (x) => (await db.select({ id: s.retreats.id }).from(s.retreats).where(eq(s.retreats.slug, x)).limit(1)).length > 0);
  const [r] = await db.insert(s.retreats).values({ title, slug, status: "draft" }).returning({ id: s.retreats.id });
  redirect(`/admin/retreats/${r.id}?created=1`);
}

const activitySchema = z.array(z.object({ title: z.string().trim().min(1).max(200), description: z.string().trim().max(2000) })).max(40);
const itinerarySchema = z.array(z.object({ day: z.string().trim().min(1).max(60), title: z.string().trim().min(1).max(200), description: z.string().trim().max(4000) })).max(60);

export async function updateRetreat(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const pub = readPublishing(fd);
  if ("error" in pub) return fail(pub.error, { status: pub.error });

  const parsed = z
    .object({
      title: z.string().trim().min(1, "Title is required").max(200),
      slug: slugSchema,
      tagline: z.string().max(300),
      location: z.string().max(200),
      country: z.string().max(120),
      summary: z.string().max(1200),
      seoTitle: z.string().max(70).nullable(),
      seoDescription: z.string().max(170).nullable(),
      videoUrl: z.string().nullable().refine((v) => !v || parseYouTubeId(v) !== null, "Enter a valid YouTube link"),
      sortOrder: z.coerce.number().int(),
    })
    .safeParse({
      title: str(fd, "title"), slug: str(fd, "slug"), tagline: str(fd, "tagline"), location: str(fd, "location"), country: str(fd, "country"),
      summary: str(fd, "summary"), seoTitle: optStr(fd, "seoTitle"), seoDescription: optStr(fd, "seoDescription"),
      videoUrl: optStr(fd, "videoUrl"), sortOrder: str(fd, "sortOrder") || "0",
    });
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error.issues));

  let activities, itinerary, forMe;
  try {
    activities = activitySchema.parse(JSON.parse(str(fd, "activities") || "[]"));
    itinerary = itinerarySchema.parse(JSON.parse(str(fd, "itinerary") || "[]"));
    forMe = z.array(z.object({ question: z.string().trim().min(1).max(300), answer: z.string().trim().min(1).max(3000) })).max(30).parse(JSON.parse(str(fd, "forMe") || "[]"));
  } catch {
    return fail("Each activity and itinerary day needs at least a title.", { activities: "Check activities and itinerary" });
  }

  const clash = await db.select({ id: s.retreats.id }).from(s.retreats).where(and(eq(s.retreats.slug, parsed.data.slug), sql`${s.retreats.id} <> ${id}`)).limit(1);
  if (clash.length) return fail("Another retreat already uses that web address.", { slug: "Already in use" });

  const gallery = fd.getAll("gallery").map(String).filter((x) => /^[0-9a-f-]{36}$/i.test(x));

  await db
    .update(s.retreats)
    .set({
      ...parsed.data,
      concept: str(fd, "concept"),
      personalMessage: str(fd, "personalMessage"),
      guestExperience: str(fd, "guestExperience"),
      benefits: lines(fd, "benefits"),
      accommodation: str(fd, "accommodation"),
      duration: str(fd, "duration"),
      meals: str(fd, "meals"),
      travel: str(fd, "travel"),
      forMe,
      terms: str(fd, "terms"),
      inclusions: lines(fd, "inclusions"),
      exclusions: lines(fd, "exclusions"),
      activities,
      itinerary,
      heroMediaId: uuidOrNull(fd, "heroMediaId"),
      gallery,
      isPlaceholder: bool(fd, "isPlaceholder"),
      status: pub.status,
      publishAt: pub.publishAt,
    })
    .where(eq(s.retreats.id, id));
  refreshSite();
  return ok("Retreat saved.");
}

export async function deleteRetreat(fd: FormData) {
  await requireAdmin();
  await db.delete(s.retreats).where(eq(s.retreats.id, str(fd, "id")));
  refreshSite();
  redirect("/admin/retreats?deleted=1");
}

/* ---------------- Departures ---------------- */

export async function saveDeparture(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z
    .object({
      retreatId: z.string().uuid(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date is required"),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date is required"),
      availability: z.enum(s.availability.enumValues),
      availabilityNote: z.string().max(120).nullable(),
      label: z.string().max(120).nullable(),
      sortOrder: z.coerce.number().int(),
    })
    .refine((v) => v.endDate >= v.startDate, { message: "End date must be on or after the start date", path: ["endDate"] })
    .safeParse({
      retreatId: str(fd, "retreatId"), startDate: str(fd, "startDate"), endDate: str(fd, "endDate"),
      availability: str(fd, "availability"), availabilityNote: optStr(fd, "availabilityNote"), label: optStr(fd, "label"),
      sortOrder: str(fd, "sortOrder") || "0",
    });
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error.issues));
  const id = uuidOrNull(fd, "id");
  const values = { ...parsed.data, isVisible: bool(fd, "isVisible") };
  if (id) await db.update(s.departures).set(values).where(eq(s.departures.id, id));
  else await db.insert(s.departures).values(values);
  refreshSite();
  return ok(id ? "Dates saved." : "Dates added.");
}

export async function deleteDeparture(fd: FormData) {
  await requireAdmin();
  await db.delete(s.departures).where(eq(s.departures.id, str(fd, "id")));
  refreshSite();
  revalidatePath(`/admin/retreats/${str(fd, "retreatId")}`);
}

/* ---------------- Booking options ---------------- */

export async function saveOption(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const errors: Record<string, string> = {};
  const amount = parseMoney(str(fd, "amount"));
  if (amount === null || amount <= 0) errors.amount = "Enter the amount charged, e.g. 250 or 250.00";
  const totalRaw = str(fd, "totalPrice");
  const totalPrice = totalRaw ? parseMoney(totalRaw) : null;
  if (totalRaw && totalPrice === null) errors.totalPrice = "Enter a valid amount";
  const paymentType = str(fd, "paymentType");
  if (paymentType !== "deposit" && paymentType !== "full") errors.paymentType = "Choose deposit or full payment";
  if (paymentType === "deposit" && !totalPrice) errors.totalPrice = "For a deposit, enter the full price so guests know the total";
  if (paymentType === "deposit" && amount && totalPrice && amount >= totalPrice) errors.amount = "A deposit should be less than the full price";
  const currency = str(fd, "currency");
  if (!(CURRENCIES as readonly string[]).includes(currency)) errors.currency = "Choose a currency";
  const label = str(fd, "label");
  if (!label) errors.label = "Label is required (e.g. “Shared room — deposit”)";
  const availability = str(fd, "availability") as (typeof s.availability.enumValues)[number];
  if (!s.availability.enumValues.includes(availability)) errors.availability = "Choose availability";

  const urls: Record<"paymentUrl" | "testPaymentUrl", string | null> = { paymentUrl: null, testPaymentUrl: null };
  for (const k of ["paymentUrl", "testPaymentUrl"] as const) {
    const raw = str(fd, k);
    if (!raw) continue;
    const v = validatePaymentUrl(raw);
    if (!v.ok) errors[k] = v.error;
    else urls[k] = v.url;
  }
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", errors);

  const departureId = str(fd, "departureId");
  const values = {
    departureId,
    label,
    description: str(fd, "description"),
    paymentType: paymentType as "deposit" | "full",
    amount: amount!,
    totalPrice: totalPrice ?? (paymentType === "full" ? amount : null),
    currency,
    balanceNote: optStr(fd, "balanceNote"),
    availability,
    ...urls,
    isVisible: bool(fd, "isVisible"),
    sortOrder: Number(str(fd, "sortOrder") || 0),
  };
  const id = uuidOrNull(fd, "id");
  if (id) await db.update(s.bookingOptions).set(values).where(eq(s.bookingOptions.id, id));
  else await db.insert(s.bookingOptions).values(values);
  refreshSite();
  const warn = !urls.paymentUrl ? " Note: no live payment link yet — visitors will be asked to contact you." : "";
  return ok((id ? "Option saved." : "Option added.") + warn);
}

export async function deleteOption(fd: FormData) {
  await requireAdmin();
  await db.delete(s.bookingOptions).where(eq(s.bookingOptions.id, str(fd, "id")));
  refreshSite();
  revalidatePath(`/admin/retreats/${str(fd, "retreatId")}`);
}

/* ------------------------------------------------------------------ */
/* Posts: articles, tips, affirmations, astrology                      */
/* ------------------------------------------------------------------ */

export async function createPost(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const type = str(fd, "type") as (typeof s.postType.enumValues)[number];
  if (!s.postType.enumValues.includes(type)) return fail("Choose a content type");
  const title = str(fd, "title");
  if (!title) return fail("Title is required", { title: "Required" });
  const slug = await uniqueSlug(title, async (x) => (await db.select({ id: s.posts.id }).from(s.posts).where(and(eq(s.posts.type, type), eq(s.posts.slug, x))).limit(1)).length > 0);
  const [p] = await db.insert(s.posts).values({ type, title, slug, status: "draft" }).returning({ id: s.posts.id });
  redirect(`/admin/content/${p.id}?created=1`);
}

export async function updatePost(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const [existing] = await db.select().from(s.posts).where(eq(s.posts.id, id)).limit(1);
  if (!existing) return fail("This item no longer exists.");
  const pub = readPublishing(fd);
  if ("error" in pub) return fail(pub.error, { status: pub.error });
  const parsed = z
    .object({
      title: z.string().trim().min(1, "Title is required").max(300),
      slug: slugSchema,
      excerpt: z.string().max(600),
      body: z.string().max(60000),
      topic: z.string().max(60),
      period: z.string().max(80).nullable(),
      seoDescription: z.string().max(170).nullable(),
    })
    .safeParse({
      title: str(fd, "title"), slug: str(fd, "slug"), excerpt: str(fd, "excerpt"), body: String(fd.get("body") ?? ""),
      topic: str(fd, "topic"), period: optStr(fd, "period"), seoDescription: optStr(fd, "seoDescription"),
    });
  if (!parsed.success) return fail("Please fix the highlighted fields.", fieldErrors(parsed.error.issues));
  const clash = await db.select({ id: s.posts.id }).from(s.posts).where(and(eq(s.posts.type, existing.type), eq(s.posts.slug, parsed.data.slug), sql`${s.posts.id} <> ${id}`)).limit(1);
  if (clash.length) return fail("That web address is already used.", { slug: "Already in use" });
  await db
    .update(s.posts)
    .set({ ...parsed.data, coverMediaId: uuidOrNull(fd, "coverMediaId"), isPlaceholder: bool(fd, "isPlaceholder"), status: pub.status, publishAt: pub.publishAt })
    .where(eq(s.posts.id, id));
  refreshSite();
  return ok(pub.status === "scheduled" ? "Saved — it will go live automatically at the scheduled time." : "Saved.");
}

export async function deletePost(fd: FormData) {
  await requireAdmin();
  const [p] = await db.delete(s.posts).where(eq(s.posts.id, str(fd, "id"))).returning({ type: s.posts.type });
  refreshSite();
  redirect(`/admin/content?type=${p?.type ?? "article"}&deleted=1`);
}

/* ------------------------------------------------------------------ */
/* Videos                                                              */
/* ------------------------------------------------------------------ */

export async function saveVideo(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const pub = readPublishing(fd);
  if ("error" in pub) return fail(pub.error, { status: pub.error });
  const youtubeId = parseYouTubeId(str(fd, "url"));
  const errors: Record<string, string> = {};
  if (!youtubeId) errors.url = "Paste a YouTube link (youtube.com/watch?v=…, youtu.be/…, or youtube.com/shorts/…)";
  const title = str(fd, "title");
  if (!title) errors.title = "Title is required";
  const kind = str(fd, "kind") === "short" ? "short" : "video";
  if (Object.keys(errors).length) return fail("Please fix the highlighted fields.", errors);
  const values = {
    youtubeId: youtubeId!, kind: kind as "short" | "video", title, description: str(fd, "description"), topic: str(fd, "topic"),
    sortOrder: Number(str(fd, "sortOrder") || 0), isPlaceholder: bool(fd, "isPlaceholder"), status: pub.status, publishAt: pub.publishAt,
  };
  const id = uuidOrNull(fd, "id");
  try {
    if (id) await db.update(s.videos).set(values).where(eq(s.videos.id, id));
    else await db.insert(s.videos).values(values);
  } catch {
    return fail("That video is already on the site.", { url: "Already added" });
  }
  refreshSite();
  if (!id) redirect("/admin/videos?saved=1");
  return ok("Video saved.");
}

/** Imports the videos ticked in the "From your channel" list. */
export async function importChannelVideos(fd: FormData) {
  await requireAdmin();
  const ids = fd.getAll("pick").map(String).filter((x) => /^[A-Za-z0-9_-]{11}$/.test(x));
  const entries = ids.map((id) => ({
    youtubeId: id,
    title: str(fd, `title_${id}`).slice(0, 300) || "Ask a Witch",
    description: str(fd, `desc_${id}`),
    kind: (str(fd, `kind_${id}`) === "short" ? "short" : "video") as "short" | "video",
    published: str(fd, `pub_${id}`) ? new Date(str(fd, `pub_${id}`)) : null,
  }));
  const { importEntries } = await import("@/lib/youtube-sync");
  const added = await importEntries(entries, str(fd, "status") === "draft" ? "draft" : "published");
  refreshSite();
  redirect(`/admin/videos?imported=${added}`);
}

/** Adds many videos from pasted links, looking up each title on YouTube. */
export async function addVideoLinks(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const lines = str(fd, "links").split(/\s+/).filter(Boolean).slice(0, 50);
  if (!lines.length) return fail("Paste at least one YouTube link", { links: "Required" });
  const bad = lines.filter((l) => !parseYouTubeId(l));
  if (bad.length) return fail(`These aren't YouTube video links: ${bad.slice(0, 3).join(", ")}`, { links: "Check the links" });
  const { fetchVideoTitle } = await import("@/lib/youtube");
  const { importEntries } = await import("@/lib/youtube-sync");
  const seen = new Set<string>();
  const entries = [];
  for (const l of lines) {
    const id = parseYouTubeId(l)!;
    if (seen.has(id)) continue;
    seen.add(id);
    const kind = /\/shorts\//.test(l) ? "short" as const : "video" as const;
    entries.push({ youtubeId: id, kind, title: (await fetchVideoTitle(id, kind)) ?? "Ask a Witch", description: "", published: new Date() });
  }
  const added = await importEntries(entries, "published");
  refreshSite();
  const skipped = entries.length - added;
  return ok(`Added ${added} video${added === 1 ? "" : "s"}${skipped ? ` (${skipped} already on the site)` : ""}. Edit any title that needs tidying.`);
}

export async function deleteVideo(fd: FormData) {
  await requireAdmin();
  await db.delete(s.videos).where(eq(s.videos.id, str(fd, "id")));
  refreshSite();
  redirect("/admin/videos?deleted=1");
}

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export async function saveFaq(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const pub = readPublishing(fd);
  if ("error" in pub) return fail(pub.error);
  const question = str(fd, "question");
  const answer = str(fd, "answer");
  if (!question || !answer) return fail("Question and answer are both required", { question: question ? "" : "Required", answer: answer ? "" : "Required" });
  const values = { question, answer, retreatId: uuidOrNull(fd, "retreatId"), sortOrder: Number(str(fd, "sortOrder") || 0), isPlaceholder: bool(fd, "isPlaceholder"), status: pub.status, publishAt: pub.publishAt };
  const id = uuidOrNull(fd, "id");
  if (id) await db.update(s.faqs).set(values).where(eq(s.faqs.id, id));
  else await db.insert(s.faqs).values(values);
  refreshSite();
  return ok(id ? "FAQ saved." : "FAQ added.");
}

export async function deleteFaq(fd: FormData) {
  await requireAdmin();
  await db.delete(s.faqs).where(eq(s.faqs.id, str(fd, "id")));
  refreshSite();
  revalidatePath("/admin/faqs");
  const r = str(fd, "retreatId");
  if (r) revalidatePath(`/admin/retreats/${r}`);
}

/* ------------------------------------------------------------------ */
/* Homepage highlights                                                 */
/* ------------------------------------------------------------------ */

export async function saveHighlight(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const pub = readPublishing(fd);
  if ("error" in pub) return fail(pub.error);
  const title = str(fd, "title");
  const href = str(fd, "href") || "/";
  if (!title) return fail("Title is required", { title: "Required" });
  if (!href.startsWith("/") && !/^https:\/\//.test(href)) return fail("Link must start with / or https://", { href: "Invalid link" });
  const values = { title, href, eyebrow: str(fd, "eyebrow"), text: str(fd, "text"), mediaId: uuidOrNull(fd, "mediaId"), sortOrder: Number(str(fd, "sortOrder") || 0), status: pub.status, publishAt: pub.publishAt };
  const id = uuidOrNull(fd, "id");
  if (id) await db.update(s.highlights).set(values).where(eq(s.highlights.id, id));
  else await db.insert(s.highlights).values(values);
  refreshSite();
  return ok(id ? "Highlight saved." : "Highlight added.");
}

export async function deleteHighlight(fd: FormData) {
  await requireAdmin();
  await db.delete(s.highlights).where(eq(s.highlights.id, str(fd, "id")));
  refreshSite();
  revalidatePath("/admin/highlights");
}

/* ------------------------------------------------------------------ */
/* Policy pages                                                        */
/* ------------------------------------------------------------------ */

export async function savePage(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const pub = readPublishing(fd);
  if ("error" in pub) return fail(pub.error);
  const title = str(fd, "title");
  if (!title) return fail("Title is required", { title: "Required" });
  const slugParsed = slugSchema.safeParse(str(fd, "slug"));
  if (!slugParsed.success) return fail("Check the web address", { slug: slugParsed.error.issues[0].message });
  const values = { title, slug: slugParsed.data, body: String(fd.get("body") ?? ""), isPlaceholder: bool(fd, "isPlaceholder"), status: pub.status, publishAt: pub.publishAt };
  const id = uuidOrNull(fd, "id");
  try {
    if (id) await db.update(s.pages).set(values).where(eq(s.pages.id, id));
    else await db.insert(s.pages).values(values);
  } catch {
    return fail("That web address is already used.", { slug: "Already in use" });
  }
  refreshSite();
  return ok("Page saved.");
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export async function saveSettings(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const key = str(fd, "key") as SettingsKey;
  if (!(key in DEFAULTS)) return fail("Unknown settings group");
  const base = DEFAULTS[key] as unknown as Record<string, unknown>;
  const value: Record<string, unknown> = {};
  for (const [k, def] of Object.entries(base)) {
    if (typeof def === "boolean") value[k] = bool(fd, k);
    else if (/(MediaId|RetreatId|PickId)$/.test(k)) value[k] = uuidOrNull(fd, k);
    else value[k] = String(fd.get(k) ?? "").trim();
  }
  if (key === "contact") {
    const email = String(value.email);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a valid contact email", { email: "Invalid email" });
    for (const k of ["instagram", "youtube", "tiktok", "etsy"]) {
      const v = String(value[k] ?? "");
      if (v && !/^https:\/\//.test(v)) return fail("Social links must start with https://", { [k]: "Must start with https://" });
    }
  }
  if (key === "home" && value.welcomeVideoUrl && !parseYouTubeId(String(value.welcomeVideoUrl))) {
    return fail("The welcome video must be a YouTube link", { welcomeVideoUrl: "Paste a YouTube link" });
  }
  if (key === "youtube") {
    if (value.channelId && !/^UC[A-Za-z0-9_-]{22}$/.test(String(value.channelId))) return fail("The channel id starts with UC and is 24 characters long", { channelId: "Invalid channel id" });
    if (!["off", "ask-a-witch", "all"].includes(String(value.autoImport))) return fail("Choose an automatic import option", { autoImport: "Invalid" });
    if (value.channelUrl && !/^https:\/\/(www\.)?youtube\.com\//.test(String(value.channelUrl))) return fail("Channel link must be a youtube.com address", { channelUrl: "Invalid" });
  }
  await saveSetting(key, value as never);
  refreshSite();
  return ok("Settings saved.");
}

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

const mediaSchema = z.object({
  url: z.string().url().or(z.string().startsWith("/")),
  pathname: z.string().nullable(),
  kind: z.enum(["image", "video"]),
  alt: z.string().trim().max(400),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
});

/** Registers a file that the browser has already uploaded to Vercel Blob. */
export async function registerMedia(input: z.infer<typeof mediaSchema>) {
  await requireAdmin();
  const data = mediaSchema.parse(input);
  const [m] = await db.insert(s.media).values(data).returning();
  revalidatePath("/admin/media");
  return m;
}

/** Local development fallback when BLOB_READ_WRITE_TOKEN is not configured. */
export async function uploadMediaLocal(fd: FormData) {
  await requireAdmin();
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL) throw new Error("Local uploads are only available in development");
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) throw new Error("No file");
  const { writeFile, mkdir } = await import("node:fs/promises");
  const path = await import("node:path");
  const name = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}${path.extname(file.name).toLowerCase()}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${name}`, pathname: null };
}

export async function updateMedia(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = str(fd, "id");
  const [m] = await db.select().from(s.media).where(eq(s.media.id, id)).limit(1);
  if (!m) return fail("Not found");
  const alt = str(fd, "alt");
  if (m.kind === "image" && !alt) return fail("Alt text is required for images — describe what the picture shows.", { alt: "Required" });
  await db.update(s.media).set({ alt, caption: optStr(fd, "caption"), posterUrl: optStr(fd, "posterUrl"), isPlaceholder: bool(fd, "isPlaceholder") }).where(eq(s.media.id, id));
  refreshSite();
  return ok("Saved.");
}

export async function deleteMedia(fd: FormData) {
  await requireAdmin();
  const [m] = await db.delete(s.media).where(eq(s.media.id, str(fd, "id"))).returning();
  if (m?.pathname && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(m.url);
    } catch (e) {
      console.error("blob delete failed", e);
    }
  }
  refreshSite();
  redirect("/admin/media?deleted=1");
}

/* ------------------------------------------------------------------ */
/* Inbox                                                               */
/* ------------------------------------------------------------------ */

export async function setInboxStatus(fd: FormData) {
  await requireAdmin();
  const table = str(fd, "table");
  const status = str(fd, "status") as "new" | "handled" | "archived";
  if (!["new", "handled", "archived"].includes(status)) return;
  const id = str(fd, "id");
  if (table === "enquiries") await db.update(s.enquiries).set({ status }).where(eq(s.enquiries.id, id));
  if (table === "waitlist") await db.update(s.waitlist).set({ status }).where(eq(s.waitlist.id, id));
  revalidatePath("/admin/inbox");
}

export async function unsubscribe(fd: FormData) {
  await requireAdmin();
  await db.update(s.subscribers).set({ unsubscribedAt: new Date() }).where(eq(s.subscribers.id, str(fd, "id")));
  revalidatePath("/admin/inbox");
}
