# Writing brief — horoscopes, compatibility and moon guides in Yulia's voice

Witchy Portal (witchyportal.org) is the site of **Yulia Moon**, a Slavic witch based in London: spells from all paths of witchcraft ("the witchy way"), tarot, dream interpretation, astrology forecasts, favourable dates, seaside retreats. These texts are read daily by her community, so they must sound like HER, not like a generic horoscope site.

## Yulia's voice (study these real lines of hers)
- "Welcome to the world of witchcraft!"
- "As a witch, I can offer you many ways to help you and have several solutions to any problem — through spells, tarot, astrology or simply some spiritual guidance from me."
- "Witches have always been known for their wisdom, and see the world differently — in details that very few people can see."
- "The real magic begins when you trust your own energy."
- Her tips: "Add a handful of salt, a few dried rose petals and your moon water. As the water drains, imagine it carrying away whatever you no longer need."

So: warm, direct, confident, a little old-world and wise; short clear sentences; talks about energy, the Universe, intuition, your power; practical magic — candles (with colours), salt, moon water, crystals, herbs, a tarot card, a written intention, cleansing. Encouraging and protective, sometimes gently firm ("Don't…", "Trust it."). Occasional first person is welcome where natural ("I always say…", "My advice today:") — at most once per text, not in every text. Grounded wisdom with a touch of glamour. Never saccharine, never vague filler.

## Rules
- 100% ORIGINAL. Do not reproduce, closely paraphrase or imitate Cafe Astrology, Astrostyle, Co-Star, astrology.com, Susan Miller or any book. No quotes from anyone.
- No predictions about health, illness, death, accidents, pregnancy, lottery/money windfalls, legal outcomes. No medical, legal or financial advice. "Rest", "slow down" and "look after yourself" are fine.
- Never fatalistic: tension is energy to use. Every text ends constructively.
- Gender-neutral; don't assume relationship status (speak to singles and couples alike where relevant), sexuality, children or job type.
- British English spelling. Plain text: no markdown, headings, bullets or emoji. "—" for dashes. Separate paragraphs with a blank line ("\n\n").
- Vary openings and sentence shapes across entries — no template feel. When variants are requested, each variant must be genuinely different (different angle, image and advice), not a rewording.
- Hit the word counts given per entry.

## Files
- Write ONLY the file(s) named in your task, in `src/lib/astro/text/stars/`. Types you may need are in `src/lib/astro/text/types.ts` (SignText, HouseText, PairText, MoonPhaseName, FACTOR_ORDER, pairKey) and `src/lib/astro/types.ts` (Sign, SIGNS). Import types only.
- When done, run from /home/claude/witchy-portal: `npx tsx scripts/check-astro-text.ts <your file>` and fix every problem; then `npx tsc --noEmit --skipLibCheck --strict --module esnext --moduleResolution bundler --target es2022 <your file>`.
- Reply with: file path, number of entries/texts, total words, and that the checker printed OK. Nothing else.
