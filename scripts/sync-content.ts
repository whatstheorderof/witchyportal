/**
 * Publishes the Markdown files in /content to the database. Runs on every
 * Vercel build (see "vercel-build" in package.json) and locally with
 * `npm run content:sync`.
 *
 * Safe with the admin area: if Yulia edits an item in /admin, the file
 * version will NOT overwrite her change (the item is skipped and logged).
 * See content/README.md.
 */
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { drizzle } from "drizzle-orm/postgres-js";
import { and, eq, isNull, ne } from "drizzle-orm";
import postgres from "postgres";
import * as s from "../src/db/schema";

const ROOT = path.join(process.cwd(), "content");
const TYPES: Record<string, (typeof s.postType.enumValues)[number]> = {
  tips: "tip",
  affirmations: "affirmation",
  motivations: "motivation",
  astrology: "astrology",
  articles: "article",
};

/** Image fields allowed in content/site/*.md, and the setting each one fills */
const SITE_IMAGE_FIELDS: Record<string, Record<string, string>> = {
  home: { heroImage: "heroMediaId", introImage: "introMediaId" },
  about: { portraitImage: "portraitMediaId", secondaryImage: "secondaryMediaId", meetImage: "meetMediaId" },
};

const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);

type PostFields = { title: string; excerpt: string; body: string; topic: string; period: string | null; status: string; publishAt: string | null };
const postHash = (p: PostFields) => hash([p.title, p.excerpt, p.body, p.topic, p.period, p.status, p.publishAt]);

function toDate(v: unknown): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(String(v));
  return Number.isNaN(+d) ? null : d;
}

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.warn("⚠ DATABASE_URL not set — skipping content sync.");
    return;
  }
  if (!existsSync(ROOT)) return;
  const client = postgres(url, { max: 1, onnotice: () => {} });
  const db = drizzle(client, { schema: s });
  const counts = { added: 0, updated: 0, unchanged: 0, keptAdminEdits: 0 };

  try {
    /* ---------------- Posts ---------------- */
    for (const [folder, type] of Object.entries(TYPES)) {
      const dir = path.join(ROOT, folder);
      if (!existsSync(dir)) continue;
      for (const file of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
        const { data, content } = matter(readFileSync(path.join(dir, file), "utf8"));
        const slug = String(data.slug ?? file.replace(/\.md$/, ""));
        const publishAt = toDate(data.date) ?? new Date();
        const wantStatus = data.draft ? "draft" : publishAt > new Date() ? "scheduled" : "published";
        const fields: PostFields = {
          title: String(data.title ?? "").trim(),
          excerpt: String(data.excerpt ?? "").trim(),
          body: content.trim(),
          topic: String(data.topic ?? "").trim(),
          period: data.period ? String(data.period) : null,
          // Future-dated files are "scheduled" — they appear on their date automatically.
          status: data.draft ? "draft" : "scheduled",
          publishAt: publishAt.toISOString(),
        };
        if (!fields.title) {
          console.warn(`⚠ ${folder}/${file}: missing title — skipped`);
          continue;
        }
        const fileHash = postHash(fields);
        const [row] = await db.select().from(s.posts).where(and(eq(s.posts.type, type), eq(s.posts.slug, slug))).limit(1);
        const values = {
          type, slug,
          title: fields.title, excerpt: fields.excerpt, body: fields.body, topic: fields.topic, period: fields.period,
          // "scheduled" with a past date is live; stored as published for clarity in admin
          status: (wantStatus === "draft" ? "draft" : wantStatus === "scheduled" ? "scheduled" : "published") as (typeof s.publishStatus.enumValues)[number],
          publishAt,
          isPlaceholder: false,
          syncHash: fileHash,
        };
        if (!row) {
          await db.insert(s.posts).values(values);
          counts.added++;
          continue;
        }
        if (row.syncHash === fileHash) {
          counts.unchanged++;
          continue;
        }
        const current = postHash({
          title: row.title, excerpt: row.excerpt, body: row.body, topic: row.topic, period: row.period,
          status: row.status === "draft" ? "draft" : "scheduled",
          publishAt: row.publishAt?.toISOString() ?? null,
        });
        if (row.syncHash && current !== row.syncHash) {
          console.log(`  • kept admin edits: ${folder}/${file}`);
          counts.keptAdminEdits++;
          continue;
        }
        if (!row.syncHash && !row.isPlaceholder) {
          console.log(`  • kept (created in admin): ${folder}/${file}`);
          counts.keptAdminEdits++;
          continue;
        }
        await db.update(s.posts).set(values).where(eq(s.posts.id, row.id));
        counts.updated++;
      }
    }

    /* ---------------- Retreats ---------------- */
    const retreatDir = path.join(ROOT, "retreats");
    let syncedRetreats = 0;
    if (existsSync(retreatDir)) {
      const mediaId = async (img: unknown): Promise<string | null> => {
        const src = typeof img === "string" ? img : (img as { src?: string })?.src;
        const alt = typeof img === "object" && img ? String((img as { alt?: string }).alt ?? "") : "";
        if (!src) return null;
        const [m] = await db.select().from(s.media).where(eq(s.media.url, src)).limit(1);
        if (m) return m.id;
        const [created] = await db.insert(s.media).values({ url: src, alt, kind: /\.(mp4|webm|mov)$/i.test(src) ? "video" : "image" }).returning();
        return created.id;
      };
      // v1 field list — kept so databases synced before v2 are still recognised as unedited
      const retreatFieldsV1 = (r: Record<string, unknown>) => [
        r.title, r.tagline, r.location, r.country, r.summary, r.concept, r.personalMessage, r.guestExperience,
        r.benefits, r.activities, r.itinerary, r.inclusions, r.exclusions, r.accommodation, r.terms, r.videoUrl, r.sortOrder,
        r.seoTitle, r.seoDescription, r.status === "draft" ? "draft" : "live",
      ];
      const retreatFields = (r: Record<string, unknown>) => [...retreatFieldsV1(r), r.duration, r.meals, r.travel, r.forMe];
      for (const file of readdirSync(retreatDir).filter((f) => f.endsWith(".md")).sort()) {
        const { data, content } = matter(readFileSync(path.join(retreatDir, file), "utf8"));
        const slug = String(data.slug ?? file.replace(/\.md$/, ""));
        const str = (k: string) => (data[k] == null ? "" : String(data[k]).trim());
        const list = (k: string) => (Array.isArray(data[k]) ? (data[k] as unknown[]).map((x) => String(x).trim()).filter(Boolean) : []);
        const values = {
          slug,
          title: str("title"),
          tagline: str("tagline"),
          location: str("location"),
          country: str("country"),
          summary: str("summary"),
          concept: content.trim(),
          personalMessage: str("personalMessage"),
          guestExperience: str("guestExperience"),
          benefits: list("benefits"),
          activities: (Array.isArray(data.activities) ? data.activities : []).map((a: { title?: string; description?: string }) => ({ title: String(a.title ?? ""), description: String(a.description ?? "") })),
          itinerary: (Array.isArray(data.itinerary) ? data.itinerary : []).map((d: { day?: string; title?: string; description?: string }) => ({ day: String(d.day ?? ""), title: String(d.title ?? ""), description: String(d.description ?? "") })),
          inclusions: list("inclusions"),
          exclusions: list("exclusions"),
          accommodation: str("accommodation"),
          duration: str("duration"),
          meals: str("meals"),
          travel: str("travel"),
          forMe: (Array.isArray(data.forMe) ? data.forMe : []).map((q: { question?: string; answer?: string }) => ({ question: String(q.question ?? ""), answer: String(q.answer ?? "") })).filter((q: { question: string; answer: string }) => q.question && q.answer),
          terms: str("terms"),
          videoUrl: str("videoUrl") || null,
          sortOrder: Number(data.sortOrder ?? 0),
          seoTitle: str("seoTitle") || null,
          seoDescription: str("seoDescription") || null,
          status: (data.draft ? "draft" : "published") as "draft" | "published",
        };
        if (!values.title) {
          console.warn(`⚠ retreats/${file}: missing title — skipped`);
          continue;
        }
        const fileHash = hash([retreatFields(values), data.heroImage ?? null, data.gallery ?? null, data.isPlaceholder ?? false]);
        const [row] = await db.select().from(s.retreats).where(eq(s.retreats.slug, slug)).limit(1);
        syncedRetreats++;
        if (row?.syncHash === fileHash) {
          counts.unchanged++;
          continue;
        }
        if (row && !row.syncHash) {
          console.log(`  • kept (created in admin): retreats/${file}`);
          counts.keptAdminEdits++;
          continue;
        }
        if (row) {
          const appliedRows = await db.select({ applied: s.settings.value }).from(s.settings).where(eq(s.settings.key, `_sync_retreat_${slug}`));
          const stored = appliedRows[0]?.applied as string | { v: number; h: string } | undefined;
          const rowObj = row as unknown as Record<string, unknown>;
          const edited = typeof stored === "string"
            ? hash(retreatFieldsV1(rowObj)) !== stored
            : stored ? hash(retreatFields(rowObj)) !== stored.h : false;
          if (edited) {
            console.log(`  • kept admin edits: retreats/${file}`);
            counts.keptAdminEdits++;
            continue;
          }
        }
        const heroMediaId = await mediaId(data.heroImage);
        const gallery = [];
        for (const g of Array.isArray(data.gallery) ? data.gallery : []) {
          const id = await mediaId(g);
          if (id) gallery.push(id);
        }
        const full = { ...values, heroMediaId, gallery, isPlaceholder: Boolean(data.isPlaceholder), syncHash: fileHash, publishAt: row?.publishAt ?? new Date() };
        if (row) await db.update(s.retreats).set(full).where(eq(s.retreats.id, row.id));
        else await db.insert(s.retreats).values(full);
        const applied = { v: 2, h: hash(retreatFields(values as unknown as Record<string, unknown>)) };
        await db.insert(s.settings).values({ key: `_sync_retreat_${slug}`, value: applied }).onConflictDoUpdate({ target: s.settings.key, set: { value: applied } });
        if (row) counts.updated++;
        else counts.added++;
      }
      if (syncedRetreats > 0) {
        // Real retreats exist: hide the seeded sample retreat(s).
        const archived = await db
          .update(s.retreats)
          .set({ status: "archived" })
          .where(and(eq(s.retreats.isPlaceholder, true), isNull(s.retreats.syncHash), ne(s.retreats.status, "archived")))
          .returning({ slug: s.retreats.slug });
        for (const a of archived) console.log(`  • archived sample retreat: ${a.slug}`);
      }
    }

    /* ---------------- Videos (series back catalogue) ---------------- */
    // Each video is added once. If it's later hidden or deleted in /admin it isn't re-added.
    const { videos: fileVideos } = await import("../content/videos");
    const [vRow] = await db.select().from(s.settings).where(eq(s.settings.key, "_sync_videos")).limit(1);
    const doneVideos = new Set(((vRow?.value as { ids?: string[] })?.ids ?? []) as string[]);
    const newVideos = fileVideos.filter((v) => /^[A-Za-z0-9_-]{11}$/.test(v.id) && !doneVideos.has(v.id));
    if (newVideos.length) {
      const inserted = await db
        .insert(s.videos)
        .values(newVideos.map((v) => ({
          youtubeId: v.id,
          kind: v.kind,
          title: v.title,
          description: v.description ?? "",
          source: "content",
          status: "published" as const,
          publishAt: toDate(v.date) ?? new Date(),
        })))
        .onConflictDoNothing()
        .returning({ id: s.videos.id });
      counts.added += inserted.length;
      counts.unchanged += newVideos.length - inserted.length;
      for (const v of newVideos) doneVideos.add(v.id);
      const value = { ids: [...doneVideos] };
      await db.insert(s.settings).values({ key: "_sync_videos", value }).onConflictDoUpdate({ target: s.settings.key, set: { value } });
    } else counts.unchanged += fileVideos.length;

    /* ---------------- Site settings (home, about, contact) ---------------- */
    const [syncRow] = await db.select().from(s.settings).where(eq(s.settings.key, "_sync")).limit(1);
    const syncState = ((syncRow?.value as Record<string, string>) ?? {}) as Record<string, string>;
    for (const key of ["home", "about", "contact"] as const) {
      const file = path.join(ROOT, "site", `${key}.md`);
      if (!existsSync(file)) continue;
      const { data: rawData, content } = matter(readFileSync(file, "utf8"));
      // Image fields (e.g. `introImage: { src, alt }`) are handled separately from the text below.
      const imageFields = SITE_IMAGE_FIELDS[key] ?? {};
      const data = Object.fromEntries(Object.entries(rawData).filter(([k]) => !(k in imageFields)));
      const [row] = await db.select().from(s.settings).where(eq(s.settings.key, key)).limit(1);
      const existing = (row?.value as Record<string, unknown>) ?? {};

      const imageUpdates: Record<string, string> = {};
      for (const [field, settingKey] of Object.entries(imageFields)) {
        const img = rawData[field] as { src?: string; alt?: string } | string | undefined;
        const src = typeof img === "string" ? img : img?.src;
        if (!src) continue;
        const stateKey = `${key}:image:${field}`;
        if (syncState[stateKey] === src) continue;
        // Never replace a photo uploaded in /admin — only bundled starter photos (/images/…) or empty slots.
        const currentId = existing[settingKey];
        if (typeof currentId === "string" && currentId) {
          const [cur] = await db.select({ url: s.media.url }).from(s.media).where(eq(s.media.id, currentId)).limit(1);
          if (cur && !cur.url.startsWith("/images/")) {
            console.log(`  • kept admin photo: site/${key}.md ${field}`);
            syncState[stateKey] = src;
            continue;
          }
        }
        const alt = typeof img === "object" ? String(img.alt ?? "") : "";
        const [m] = await db.select().from(s.media).where(eq(s.media.url, src)).limit(1);
        const id = m ? m.id : (await db.insert(s.media).values({ url: src, alt, kind: "image" }).returning())[0].id;
        imageUpdates[settingKey] = id;
        syncState[stateKey] = src;
      }
      if (Object.keys(imageUpdates).length) {
        Object.assign(existing, imageUpdates);
        await db.insert(s.settings).values({ key, value: existing }).onConflictDoUpdate({ target: s.settings.key, set: { value: existing, updatedAt: new Date() } });
        counts.updated++;
      }

      const fromFile: Record<string, unknown> = { ...data };
      if (content.trim()) fromFile[key === "home" ? "introText" : "story"] = content.trim();
      const fileHash = hash(fromFile);
      if (syncState[key] === fileHash) {
        counts.unchanged++;
        continue;
      }
      const currentSubset = hash(Object.fromEntries(Object.keys(fromFile).map((k) => [k, existing[k]])));
      const previousFileHash = syncState[`${key}:applied`];
      const untouched = !previousFileHash || currentSubset === previousFileHash || Object.keys(fromFile).every((k) => existing[k] === undefined);
      if (!untouched) {
        console.log(`  • kept admin edits: site/${key}.md`);
        counts.keptAdminEdits++;
        continue;
      }
      const merged = { ...existing, ...fromFile };
      await db.insert(s.settings).values({ key, value: merged }).onConflictDoUpdate({ target: s.settings.key, set: { value: merged, updatedAt: new Date() } });
      syncState[key] = fileHash;
      syncState[`${key}:applied`] = hash(Object.fromEntries(Object.keys(fromFile).map((k) => [k, merged[k]])));
      counts.updated++;
    }
    await db.insert(s.settings).values({ key: "_sync", value: syncState }).onConflictDoUpdate({ target: s.settings.key, set: { value: syncState } });

    console.log(`✓ Content synced — ${counts.added} added, ${counts.updated} updated, ${counts.unchanged} unchanged${counts.keptAdminEdits ? `, ${counts.keptAdminEdits} kept as edited in admin` : ""}`);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error("Content sync failed:", e);
  process.exit(1);
});
