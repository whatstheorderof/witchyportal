# Writing brief — Witchy Portal birth chart report

You are writing original interpretation text for the free natal chart report on Witchy Portal (witchyportal.org), the site of Yulia Moon, a Slavic witch in London who runs seaside retreats, tarot readings and spellwork. The report should be as in-depth as the best free natal reports online, and better written.

## Voice
- Warm, intimate, lightly mystical, intelligent. Grounded in real behaviour: say what this placement looks like in everyday life (how you argue, flirt, spend, rest, work, recover), not vague abstractions.
- Second person ("you"). British English spelling (colour, behaviour, realise, centre, favourite).
- Balanced: every text gives gifts AND the shadow side or growth edge, then a constructive note. Never fatalistic or fear-based.
- Gender-neutral. No assumptions about sexuality, marriage, children, religion or money.
- Vary sentence openings and structure across entries. Do not start every entry the same way ("With X in Y, you…"). Avoid filler like "This placement suggests". Avoid clichés repeated across entries.
- Light witchy colour is welcome (a ritual, a crystal, a moon phase, a candle) but sparingly — at most one practical suggestion per entry, and not in every entry.

## Hard rules
- 100% ORIGINAL. Write from general astrological knowledge. Do NOT reproduce, closely paraphrase or imitate the structure of Cafe Astrology, Astrodienst, astrology.com or any book. No quotes.
- No predictions about health, illness, body parts, death, accidents, inheritance, divorce, pregnancy or money windfalls. No medical, legal or financial advice.
- No famous people, statistics or invented facts.
- Plain text only: no markdown, no headings, no bullet points, no emoji. Separate paragraphs with a blank line ("\n\n" inside the TypeScript string).
- Use straight ASCII or typographic quotes/apostrophes consistently; use "—" for dashes. Avoid other special characters.
- Hit the word counts given in your task (they are per entry). Count matters: thin entries are not acceptable.

## Files
- Types are in `src/lib/astro/text/types.ts` (SignText, SignTextWithShort, HouseText, PairText, pairKey/FACTOR_ORDER). Import types with `import type { … } from "./types";`.
- Write ONLY the file(s) named in your task. Do not edit any other file in the repository.
- Use template literals or normal strings; escape correctly. Keep each entry as one string.
- When done, run `npx tsx scripts/check-astro-text.ts <your file>` from `/home/claude/witchy-portal` and fix every problem it reports (missing keys, too few words, odd characters). Then run `npx tsc --noEmit --skipLibCheck --strict --module esnext --moduleResolution bundler --target es2022 <your file>` and fix any type errors.
- Reply with: file path(s), number of entries, total words, and confirmation the checker printed OK. Nothing else.
