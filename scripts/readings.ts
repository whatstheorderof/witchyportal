/**
 * Phase 2 translations: the long-form readings (see src/i18n/readings.ts).
 *
 *   npx tsx scripts/readings.ts                        → words missing per language and group
 *   npx tsx scripts/readings.ts --out DIR --lang es    → DIR/<group>.en.txt: the English paragraphs still
 *                                                        missing, one per "@@n" marker (add --group NAME to limit)
 *   npx tsx scripts/readings.ts --merge DIR --lang es  → reads DIR/<group>.es.txt (same markers, translated),
 *                                                        checks it and adds it to src/i18n/readings/es/<group>.json
 *   npx tsx scripts/readings.ts --prune                → drops translations whose English no longer exists
 *
 * Sources: every export of src/lib/astro/text/** and src/lib/tarot*.ts,
 * literal rx("…") / rx.fill("…") / prose("…") calls in src/, and published posts in the
 * database (needs DATABASE_URL; skipped without it).
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";

const ROOT = process.cwd();
const LANGS = ["es", "zh", "hi", "fr", "ar", "pt"];
const args = process.argv.slice(2);
const arg = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const outDir = arg("--out"), mergeDir = arg("--merge"), onlyLang = arg("--lang"), onlyGroup = arg("--group");
const prune = args.includes("--prune");

export const readingKey = (p: string) => p.replace(/\s+/g, " ").trim();
const IDENT = new Set(["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "North Node", "South Node", "Lilith", "Ascendant", "Midheaven", "Chiron", "Part of Fortune", "Fire", "Earth", "Air", "Water", "Wands", "Cups", "Swords", "Pentacles",
  // phase names are identifiers in API output; their display names are interface strings (src/i18n/terms.ts)
  "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent", "Balsamic Moon", "First Quarter Moon", "Last Quarter Moon"]);

/** group → ordered English paragraphs (raw text, original line breaks kept) */
const groups = new Map<string, Map<string, string>>();
const seen = new Set<string>();
function add(group: string, raw: string, single = false) {
  for (const part of raw.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const k = readingKey(part);
    if (!k || !/\p{L}/u.test(k) || seen.has(k) || IDENT.has(k)) continue;
    if (!single && !/\s/.test(k)) continue; // single words are identifiers or labels (translated in the interface dictionary)
    if (/^(https?:\S+|\/\S*|[\w.-]+@[\w.-]+)$/.test(k)) continue;
    seen.add(k);
    if (!groups.has(group)) groups.set(group, new Map());
    groups.get(group)!.set(k, part.trim());
  }
}
function addDeep(group: string, v: unknown, key = "") {
  if (typeof v === "string") add(group, v, (group === "tarot" && key === "name") || key === "keywords");
  else if (Array.isArray(v)) v.forEach((x) => addDeep(group, x, key));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) addDeep(group, x, k);
}

function walk(dir: string, out: string[] = []) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) { if (!/^(admin|node_modules)$/.test(f)) walk(p, out); }
    else if (/\.(ts|tsx)$/.test(f)) out.push(p);
  }
  return out;
}

async function fromModules() {
  const textDir = path.join(ROOT, "src/lib/astro/text");
  const files = walk(textDir).filter((f) => !/types\.ts$/.test(f)).sort();
  for (const f of files) {
    const rel = path.relative(textDir, f).replace(/\.ts$/, "");
    const group = rel.startsWith("stars/") ? `stars-${rel.slice(6)}` : `chart-${rel}`;
    const mod = await import(f);
    for (const v of Object.values(mod)) addDeep(group, v);
  }
  for (const f of ["src/lib/tarot.ts", "src/lib/tarot-minor.ts"]) {
    const mod = await import(path.join(ROOT, f));
    for (const v of Object.values(mod)) addDeep("tarot", v);
  }
}

function fromCode() {
  const re = /\b(?:rx|rx\.fill|prose)\(\s*("(?:[^"\\]|\\.)*"|`(?:[^`\\$]|\\.)*`)/g;
  for (const file of walk(path.join(ROOT, "src")).sort()) {
    if (file.includes(`${path.sep}lib${path.sep}astro${path.sep}text`)) continue;
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(re)) {
      const lit = m[1];
      const v = lit.startsWith("`") ? lit.slice(1, -1).replace(/\\`/g, "`") : JSON.parse(lit);
      add("pages", v, true); // split into paragraphs, as rx() looks them up
    }
  }
}

async function fromDatabase() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) { console.warn("⚠ DATABASE_URL not set — posts are skipped."); return; }
  const sql = postgres(url, { max: 1, onnotice: () => {} });
  try {
    for (const p of await sql`select title, excerpt, body, period, seo_description from posts where status = 'published' order by type, slug`) {
      for (const v of [p.title, p.excerpt, p.period, p.seo_description]) if (v) add("posts", v);
      if (p.body) add("posts", p.body);
    }
  } finally {
    await sql.end();
  }
}

const dictPath = (lang: string, group: string) => path.join(ROOT, `src/i18n/readings/${lang}/${group}.json`);
const readJson = (f: string): Record<string, string> => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {});
function langDict(lang: string): Record<string, string> {
  const dir = path.join(ROOT, `src/i18n/readings/${lang}`);
  if (!existsSync(dir)) return {};
  return Object.assign({}, ...readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => readJson(path.join(dir, f))));
}
function writeIndex(lang: string) {
  const dir = path.join(ROOT, `src/i18n/readings/${lang}`);
  mkdirSync(dir, { recursive: true });
  const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const id = (f: string) => "d_" + f.replace(/\.json$/, "").replace(/\W/g, "_");
  writeFileSync(path.join(dir, "index.ts"),
    `// Generated by scripts/readings.ts — do not edit.\n${files.map((f) => `import ${id(f)} from "./${f}";`).join("\n")}\n\n` +
    `const dict: Record<string, string> = Object.assign({}${files.map((f) => `, ${id(f)}`).join("")});\nexport default dict;\n`);
}

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const vars = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
const mdShape = (s: string) => s.split("\n").map((l) => (/^\s*(#+|[-*]|\d+\.|>)\s/.exec(l)?.[1] ?? "")).filter(Boolean).join("|").replace(/\d+\./g, "1.");

function parseMarked(text: string): Map<number, string> {
  const out = new Map<number, string>();
  const parts = text.replace(/\r\n/g, "\n").split(/^@@(\d+)[ \t]*\n/m);
  for (let i = 1; i < parts.length; i += 2) out.set(Number(parts[i]), parts[i + 1].trim());
  return out;
}

function merge(lang: string) {
  let added = 0, problems = 0;
  for (const f of readdirSync(mergeDir!).filter((x) => x.endsWith(`.${lang}.txt`)).sort()) {
    const group = f.slice(0, -(`.${lang}.txt`.length));
    const enFile = path.join(mergeDir!, `${group}.en.txt`);
    if (!existsSync(enFile)) { console.error(`✗ ${f}: no ${group}.en.txt beside it`); problems++; continue; }
    const en = parseMarked(readFileSync(enFile, "utf8")), tr = parseMarked(readFileSync(path.join(mergeDir!, f), "utf8"));
    const dict = readJson(dictPath(lang, group));
    for (const [n, english] of en) {
      const t = tr.get(n);
      if (!t) continue; // not translated yet — fine, merge what's there
      const why = vars(english) !== vars(t) ? "placeholders differ" : mdShape(english) !== mdShape(t) ? "markdown structure differs" : /@@\d/.test(t) ? "contains a marker" : "";
      if (why) { console.error(`✗ ${group} @@${n}: ${why}`); problems++; continue; }
      dict[readingKey(english)] = t;
      added++;
    }
    for (const n of tr.keys()) if (!en.has(n)) { console.error(`✗ ${group} @@${n}: no English paragraph with this number`); problems++; }
    mkdirSync(path.dirname(dictPath(lang, group)), { recursive: true });
    writeFileSync(dictPath(lang, group), JSON.stringify(dict, null, 1) + "\n");
  }
  writeIndex(lang);
  console.log(`Merged ${added} paragraphs into src/i18n/readings/${lang}/ (${problems} problems)`);
  if (problems) process.exitCode = 1;
}

async function main() {
  await fromModules();
  fromCode();
  await fromDatabase();
  if (mergeDir) { merge(onlyLang ?? "es"); return; }

  const total = [...groups.values()].reduce((n, g) => n + [...g.keys()].reduce((m, k) => m + words(k), 0), 0);
  console.log(`Readings: ${seen.size} paragraphs, ${total} words in ${groups.size} groups`);
  for (const lang of onlyLang ? [onlyLang] : LANGS) {
    const dict = langDict(lang);
    let missingWords = 0;
    const perGroup: string[] = [];
    for (const [g, paras] of groups) {
      const miss = [...paras.keys()].filter((k) => !dict[k]);
      const w = miss.reduce((n, k) => n + words(k), 0);
      missingWords += w;
      if (miss.length) perGroup.push(`${g} ${w}`);
      if (outDir && miss.length && (!onlyGroup || onlyGroup === g)) {
        mkdirSync(outDir, { recursive: true });
        writeFileSync(path.join(outDir, `${g}.en.txt`), miss.map((k, i) => `@@${i + 1}\n${paras.get(k)}\n`).join("\n"));
      }
    }
    console.log(`  ${lang}: ${missingWords} words missing${onlyLang ? `\n    ${perGroup.join("\n    ")}` : ""}`);
    if (prune) {
      const dir = path.join(ROOT, `src/i18n/readings/${lang}`);
      if (!existsSync(dir)) continue;
      for (const f of readdirSync(dir).filter((x) => x.endsWith(".json"))) {
        const d = readJson(path.join(dir, f));
        writeFileSync(path.join(dir, f), JSON.stringify(Object.fromEntries(Object.entries(d).filter(([k]) => seen.has(k))), null, 1) + "\n");
      }
      writeIndex(lang);
    }
  }
  if (outDir) console.log(`Wrote missing English paragraphs to ${outDir}/<group>.en.txt`);
}
main().catch((e) => { console.error(e); process.exit(1); });
