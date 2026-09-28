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
import { and, eq } from "drizzle-orm";
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

    /* ---------------- Site settings (home, about, contact) ---------------- */
    const [syncRow] = await db.select().from(s.settings).where(eq(s.settings.key, "_sync")).limit(1);
    const syncState = ((syncRow?.value as Record<string, string>) ?? {}) as Record<string, string>;
    for (const key of ["home", "about", "contact"] as const) {
      const file = path.join(ROOT, "site", `${key}.md`);
      if (!existsSync(file)) continue;
      const { data, content } = matter(readFileSync(file, "utf8"));
      const fromFile: Record<string, unknown> = { ...data };
      if (content.trim()) fromFile[key === "home" ? "introText" : "story"] = content.trim();
      const fileHash = hash(fromFile);
      if (syncState[key] === fileHash) {
        counts.unchanged++;
        continue;
      }
      const [row] = await db.select().from(s.settings).where(eq(s.settings.key, key)).limit(1);
      const existing = (row?.value as Record<string, unknown>) ?? {};
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
