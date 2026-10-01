# Witchy Portal

A mobile-first retreat and lifestyle web app for **Yulia Moon** — retreat discovery and booking, witchy tips, affirmations, astrology, Ask a Witch videos and a real birth-chart calculator, with a protected admin for publishing without code changes.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Postgres (Neon) with Drizzle ORM · Vercel Blob for media · Vercel hosting · GitHub for code.

## Quick start (local)

```bash
npm install
cp .env.example .env.local          # then fill in DATABASE_URL and AUTH_SECRET
npm run db:migrate                   # create tables
npm run db:seed                      # starter photos + clearly marked sample content
npm run admin:create -- you@example.com "a long passphrase" "Yulia"
npm run dev                          # http://localhost:3000  ·  admin at /admin
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` / `start` | Production build / serve |
| `npm run lint` · `typecheck` · `test` | Quality checks (also run in GitHub Actions) |
| `npm run db:generate` | Create a migration after editing `src/db/schema.ts` |
| `npm run db:migrate` | Apply migrations (runs automatically on every Vercel build) |
| `npm run db:seed` | Insert starter/sample content into empty tables |
| `npm run admin:create` | Create or reset an admin login |

## Documentation

- [docs/SETUP.md](docs/SETUP.md) — local setup, database, admin accounts
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — GitHub → Vercel, environments, previews, custom domain
- [content/README.md](content/README.md) — site copy and posts kept as files, published on every deploy
- [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) — how Yulia edits and publishes content in /admin
- [docs/BOOKINGS.md](docs/BOOKINGS.md) — booking model, payment-link setup, manual operating mode
- [docs/BIRTH_CHART.md](docs/BIRTH_CHART.md) — calculation provider, conventions, verification
- [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) — prioritised list of next improvements
- [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md) — what's placeholder and what Yulia must supply

## Project structure

```
src/
  app/(site)/        public pages (home, retreats, discover, birth chart…)
  app/admin/         protected admin (login + panel) and server actions
  app/api/           checkout redirect, chart calculation, place search, uploads, CSV export
  components/        UI components (admin/ and birth-chart/ subfolders)
  db/schema.ts       database schema (retreats → departures → booking options, content, submissions)
  lib/               data queries, auth, validation, money/dates, astro engine
  proxy.ts           guards /admin (Next 16 "proxy", formerly middleware)
scripts/             migrate, seed, create-admin
drizzle/             SQL migrations (committed)
tests/               birth-chart accuracy and time-zone tests
```
