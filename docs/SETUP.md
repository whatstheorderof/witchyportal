# Local setup

## Requirements

- Node.js 20.9+ (22 recommended)
- A Postgres database. Easiest: create a free **Neon** project and use a development branch, or run Postgres locally (`docker run -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16`).

## Steps

1. `npm install`
2. `cp .env.example .env.local` and set at least:
   - `DATABASE_URL` — e.g. `postgres://postgres:dev@localhost:5432/postgres`
   - `AUTH_SECRET` — `openssl rand -base64 48`
3. `npm run db:migrate` — creates all tables.
4. `npm run db:seed` — adds the four supplied beach photographs to the media library and sample content marked **[Placeholder]/Sample**. Safe to re-run; it only fills empty tables.
5. `npm run admin:create -- email@example.com "long passphrase (12+ chars)" "Name"` — run again with the same email to reset a password.
6. `npm run dev` and open http://localhost:3000 (admin: http://localhost:3000/admin).

Without `BLOB_READ_WRITE_TOKEN`, uploads in development are saved to `public/uploads/` (git-ignored). In deployed environments uploads go to Vercel Blob.

## Changing the database schema

1. Edit `src/db/schema.ts`.
2. `npm run db:generate -- --name short_description` → writes a SQL file in `drizzle/`.
3. Review and commit the SQL file. It's applied automatically on the next Vercel build for each environment, or locally with `npm run db:migrate`.

## Tests

`npm test` runs the birth-chart tests, which check the engine against a published reference chart (to within 0.1°) and check historical time-zone handling.
