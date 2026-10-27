/**
 * Checks a birth-chart text file in src/lib/astro/text for completeness.
 *   npx tsx scripts/check-astro-text.ts src/lib/astro/text/sun.ts
 * Prints each export, how many entries it has, and word counts.
 */
import path from "node:path";
import { SIGNS } from "../src/lib/astro/types";

const file = process.argv[2];
if (!file) throw new Error("Pass a file path");
const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const problems: string[] = [];

function checkString(where: string, s: unknown, min: number) {
  if (typeof s !== "string" || !s.trim()) return problems.push(`${where}: missing`);
  if (/TODO|lorem|\[.*?\]/i.test(s)) problems.push(`${where}: placeholder text`);
  if (/[^\x00-\x7F’‘“”—–…éèêàçñöüïô×°′″☉☽☿♀♂♃♄♅♆♇♈♉♊♋♌♍♎♏♐♑♒♓]/.test(s)) problems.push(`${where}: unusual character`);
  if (words(s) < min) problems.push(`${where}: only ${words(s)} words (min ${min})`);
}

async function main() {
const mod = await import(path.resolve(file));
for (const [name, value] of Object.entries(mod)) {
  const v = value as Record<string, unknown> | unknown[];
  let total = 0, n = 0;
  if (Array.isArray(v)) {
    if (v.length !== 12) problems.push(`${name}: has ${v.length} entries, needs 12`);
    v.forEach((s, i) => { checkString(`${name}[${i}]`, s, 15); total += words(String(s)); n++; });
  } else if (v && typeof v === "object") {
    const keys = Object.keys(v);
    const isSignMap = keys.some((k) => (SIGNS as readonly string[]).includes(k));
    if (isSignMap && !/_\d$/.test(name)) for (const s of SIGNS) if (!(s in v)) problems.push(`${name}: missing ${s}`);
    for (const [k, entry] of Object.entries(v)) {
      if (typeof entry === "string") { checkString(`${name}.${k}`, entry, 10); total += words(entry); n++; }
      else if (entry && typeof entry === "object") {
        for (const [f, s] of Object.entries(entry as Record<string, unknown>)) {
          if (typeof s === "string") {
            const shortField = ["short", "symbol", "dates", "element", "modality", "ruler", "polarity"].includes(f);
            if (shortField) { if (!s.trim()) problems.push(`${name}.${k}.${f}: missing`); }
            else { checkString(`${name}.${k}.${f}`, s, 15); total += words(s); n++; }
          }
        }
      }
    }
  }
  console.log(`${name}: ${n} texts, ${total} words, avg ${n ? Math.round(total / n) : 0}`);
}
if (problems.length) { console.log(`\n${problems.length} problem(s):\n` + problems.slice(0, 60).join("\n")); process.exitCode = 1; }
else console.log("OK");
}
main();
