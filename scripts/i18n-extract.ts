/**
 * Finds every English string that needs translating and reports what each
 * language is missing.
 *
 *   npx tsx scripts/i18n-extract.ts            → summary of missing strings per language
 *   npx tsx scripts/i18n-extract.ts --out DIR  → also writes DIR/ui.json and DIR/content.json
 *                                               (the English strings still missing in any language)
 *   npx tsx scripts/i18n-extract.ts --prune    → removes translations whose English no longer exists
 *
 * Interface strings: literal t("…") and msg("…") calls in src/ (not admin).
 * Content strings: the Phase 1 content in the database (retreats, settings,
 * highlights, policy pages, FAQs, booking options) and /content/services.ts,
 * craft.ts and socials.ts. Needs DATABASE_URL for the database part.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";

const ROOT = process.cwd();
const LANGS = ["es", "zh", "hi", "fr", "ar", "pt"];
const args = process.argv.slice(2);
const outDir = args.includes("--out") ? args[args.indexOf("--out") + 1] : null;
const prune = args.includes("--prune");

const contentKey = (s: string) => s.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").trim();

/* ---------- Interface strings ---------- */
function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) { if (!/admin|node_modules/.test(f)) walk(p, out); }
    else if (/\.(ts|tsx)$/.test(f) && !p.includes(`${path.sep}admin${path.sep}`)) out.push(p);
  }
  return out;
}
const ui = new Set<string>();
const callRe = /\b(?:t|tr|msg)\(\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\$]|\\.)*`)/g;
for (const file of walk(path.join(ROOT, "src"))) {
  // Reading texts are translated by scripts/readings.ts; only their msg() labels (names, filters) are interface strings.
  const isText = file.includes(`${path.sep}lib${path.sep}astro${path.sep}text`);
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(callRe)) {
    if (isText && !m[0].startsWith("msg")) continue;
    const lit = m[1];
    let v: string;
    if (lit.startsWith("`")) v = lit.slice(1, -1).replace(/\\`/g, "`");
    else v = JSON.parse(lit.startsWith("'") ? `"${lit.slice(1, -1).replace(/"/g, '\\"').replace(/\\'/g, "'")}"` : lit);
    if (v.trim()) ui.add(v);
  }
}
// The site description (used as t(SITE_DESCRIPTION))
const seo = readFileSync(path.join(ROOT, "src/lib/seo.ts"), "utf8").match(/SITE_DESCRIPTION =\s*"([^"]+)"/);
if (seo) ui.add(seo[1]);

/* ---------- Content strings ---------- */
const content = new Set<string>();
const addAll = (v: unknown, skipKeys = new Set<string>()) => {
  if (typeof v === "string") { const k = contentKey(v); if (k && /[A-Za-z]/.test(k) && !/^(https?:\S+|\/\S*|#\S*|[\w.-]+@[\w.-]+)$/.test(k)) content.add(k); }
  else if (Array.isArray(v)) v.forEach((x) => addAll(x, skipKeys));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!skipKeys.has(k)) addAll(x, skipKeys);
};

async function fromContentFiles() {
  const { services } = await import(path.join(ROOT, "content/services.ts"));
  addAll(services);
  const { craft } = await import(path.join(ROOT, "content/craft.ts"));
  for (const c of craft) addAll(c.alt);
  const { socials } = await import(path.join(ROOT, "content/socials.ts"));
  for (const s of socials) { addAll(s.label); addAll(s.description); }
  const { testimonials } = await import(path.join(ROOT, "content/testimonials.ts"));
  for (const t of testimonials) addAll(t.about); // the quotes stay in the client's own words
  // Built-in setting defaults (used until a setting is saved in the admin)
  const settingsSrc = readFileSync(path.join(ROOT, "src/lib/settings.ts"), "utf8");
  for (const k of ["newsletterTitle", "newsletterText", "responseTime"]) {
    const m = settingsSrc.match(new RegExp(`${k}:\\s*"([^"]+)"`));
    if (m) addAll(m[1]);
  }
}

async function fromDatabase() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) { console.warn("⚠ DATABASE_URL not set — content from the database is skipped."); return; }
  const sql = postgres(url, { max: 1, onnotice: () => {} });
  try {
    const skip = new Set(["id", "slug", "status", "publishAt", "createdAt", "updatedAt", "heroMediaId", "videoUrl", "seoTitle", "syncHash", "gallery", "currency", "email", "retreatEmail", "whatsapp", "instagram", "youtube", "tiktok", "etsy", "paypalEmail", "paypalMe", "revolut", "featuredRetreatId", "weekVideoPickId", "weekArticlePickId", "weekTipPickId", "welcomeVideoUrl", "heroVideoMediaId", "introMediaId", "portraitMediaId", "secondaryMediaId", "meetMediaId", "announcement", "channelId", "channelUrl"]);
    const retreats = await sql`select * from retreats where status = 'published'`;
    for (const r of retreats) {
      const { title, tagline, location, country, summary, concept, personal_message, guest_experience, benefits, activities, itinerary, inclusions, exclusions, accommodation, duration, meals, travel, for_me, terms, seo_title, seo_description } = r;
      addAll({ title, tagline, location, country, summary, concept, personal_message, guest_experience, benefits, activities, itinerary, inclusions, exclusions, accommodation, duration, meals, travel, for_me, terms, seo_title, seo_description });
      const deps = await sql`select * from departures where retreat_id = ${r.id} and is_visible`;
      for (const d of deps) {
        addAll([d.label, d.availability_note]);
        for (const o of await sql`select label, description, balance_note from booking_options where departure_id = ${d.id} and is_visible`) addAll([o.label, o.description, o.balance_note]);
      }
      for (const f of await sql`select question, answer from faqs where retreat_id = ${r.id}`) addAll([f.question, f.answer]);
    }
    for (const f of await sql`select question, answer from faqs where retreat_id is null`) addAll([f.question, f.answer]);
    for (const h of await sql`select eyebrow, title, text from highlights where status = 'published'`) addAll([h.eyebrow, h.title, h.text]);
    for (const p of await sql`select title, body from pages where status = 'published'`) addAll([p.title, p.body]);
    for (const s of await sql`select key, value from settings where key in ('home', 'about', 'site', 'contact')`) addAll(s.value, skip);
    // Post topics (labels on cards and filters; the posts themselves are in scripts/readings.ts)
    for (const p of await sql`select distinct topic from posts where status = 'published' and topic <> ''`) addAll(p.topic);
  } finally {
    await sql.end();
  }
}

async function main() {
  await fromContentFiles();
  await fromDatabase();
  const missing: Record<string, { ui: string[]; content: string[] }> = {};
  for (const l of LANGS) {
    for (const kind of ["ui", "content"] as const) {
      const file = path.join(ROOT, `src/i18n/${kind}/${l}.json`);
      const dict: Record<string, string> = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
      const wanted = kind === "ui" ? ui : content;
      (missing[l] ??= { ui: [], content: [] })[kind] = [...wanted].filter((k) => !dict[k]);
      if (prune) {
        const kept = Object.fromEntries(Object.entries(dict).filter(([k]) => wanted.has(k)));
        writeFileSync(file, JSON.stringify(kept, null, 2) + "\n");
      }
    }
  }
  const words = (a: string[]) => a.reduce((n, s) => n + s.split(/\s+/).length, 0);
  console.log(`Interface strings: ${ui.size} (${words([...ui])} words); content strings: ${content.size} (${words([...content])} words)`);
  for (const l of LANGS) console.log(`  ${l}: missing ${missing[l].ui.length} interface, ${missing[l].content.length} content`);
  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    const anyMissing = (kind: "ui" | "content") => [...new Set(LANGS.flatMap((l) => missing[l][kind]))];
    writeFileSync(path.join(outDir, "ui.json"), JSON.stringify(anyMissing("ui"), null, 2));
    writeFileSync(path.join(outDir, "content.json"), JSON.stringify(anyMissing("content"), null, 2));
    console.log(`Wrote missing English strings to ${outDir}/ui.json and content.json`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
