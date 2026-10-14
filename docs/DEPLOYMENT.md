# Deployment: GitHub → Vercel

Code lives in GitHub; Vercel builds every push. `main` is production; every other branch/pull request gets its own **preview deployment**.

## 1. Create the GitHub repository

1. On GitHub (account `whatstheorderof`) create a new **private** repository named `witchyportal` (already created: https://github.com/whatstheorderof/witchyportal). Don't add a README or .gitignore (the project has them).
2. From the project folder:
   ```bash
      git push -u origin main
   ```
3. Recommended: *Settings → Branches → Add rule* for `main`: require a pull request and the **CI** status check to pass before merging.

## 2. Create the Vercel project

1. vercel.com → **Add New… → Project → Import** `witchyportal`. Framework is detected as Next.js; the build command comes from `vercel.json` (`npm run vercel-build` = run migrations, then build).
2. Don't deploy yet — add storage first:
   - **Storage → Create → Neon (Postgres)** via the Vercel Marketplace (choose the London region, `aws-eu-west-2`, to match the `lhr1` functions region in `vercel.json`), connect it to the project for *Production, Preview and Development*. Enable **"Create a database branch for each preview deployment"** so previews never touch production data. This sets `DATABASE_URL` and `DATABASE_URL_UNPOOLED`.
   - **Storage → Create → Blob**, connect to all environments. This sets `BLOB_READ_WRITE_TOKEN`. (Optionally create a second Blob store for Preview to keep test uploads separate.)
3. **Settings → Environment Variables** — add:

| Variable | Production | Preview | Development |
| --- | --- | --- | --- |
| `AUTH_SECRET` | unique random value | *different* random value | local only |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | leave empty (auto) | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_TIMEZONE` | `Europe/London` | `Europe/London` | `Europe/London` |
| `PAYMENT_MODE` | leave empty (= live) | leave empty (= test) | empty |
| `PAYMENT_ALLOWED_HOSTS` | only if needed | same | same |
| `CRON_SECRET` | random value (`openssl rand -hex 32`) | — | — |
| `GOOGLE_SITE_VERIFICATION` | optional — the code from Google Search Console's "HTML tag" method | — | — |
| `BING_SITE_VERIFICATION` | optional — the code from Bing Webmaster Tools | — | — |

4. **Deploy.** The first build creates the tables.

The daily **YouTube import** (Ask a Witch) runs as a Vercel Cron job at 07:00 UTC (`vercel.json`). It only runs on Production and needs `CRON_SECRET`. What it imports is set in Admin → Settings → YouTube.

## 3. Starter content and the first admin login (no terminal needed)

Every Vercel build runs `npm run vercel-build`, which:

1. applies database migrations,
2. adds the starter content (photos, sample retreat, sample posts, policy templates) — **only the first time** a database is set up, so anything Yulia later deletes never comes back,
3. creates the first admin account from environment variables if the database has no admin yet.

To create the first login, add these in Vercel → **Settings → Environment Variables** (Production and Preview), then redeploy:

| Variable | Value |
| --- | --- |
| `ADMIN_EMAIL` | the email Yulia will sign in with |
| `ADMIN_PASSWORD` | a passphrase of 12+ characters |
| `ADMIN_NAME` | optional, e.g. `Yulia` |

The build log shows "✓ Admin account created for …". After that the variables are ignored (an admin exists), and you can delete `ADMIN_PASSWORD`. To add more admins or reset a password later, use `npm run admin:create` from a computer (see SETUP.md).

## 4. Everyday workflow

```bash
git checkout -b feature/new-thing
# …make changes…
git push -u origin feature/new-thing
```
Open a pull request → GitHub Actions runs lint, type-check, tests and a build → Vercel posts a **preview link** on the PR. Previews use **test payment links** only. Merge to `main` → production deploys automatically.

Content (retreats, posts, videos, prices) is edited in `/admin` and **never needs a deployment**.

## 5. Custom domain

Vercel → Project → **Settings → Domains → Add** `your-domain.com` (and `www`). Add the DNS records Vercel shows at your registrar (an `A` record for the apex and a `CNAME` for `www`, or switch nameservers to Vercel). HTTPS is automatic. Then set `NEXT_PUBLIC_SITE_URL` for Production and redeploy.

## 6. Production checklist

- [ ] `AUTH_SECRET` set and unique per environment
- [ ] Neon connected, preview branching on; Blob connected
- [ ] Admin account created; seed sample content replaced or deleted
- [ ] Every booking option has a **live** link (production) and a **test** link (previews)
- [ ] Payment provider's "after payment" redirect set to `https://your-domain.com/booking/return`
- [ ] Policy pages reviewed; contact email set in Admin → Settings
- [ ] Custom domain added and `NEXT_PUBLIC_SITE_URL` updated (canonical links, the sitemap and social previews all use it)
- [ ] Search engines: site verified in Google Search Console (and Bing), `https://your-domain.com/sitemap.xml` submitted — see below

## 7. Search engines (SEO)

Built in — nothing to switch on:

- Every public page has its own title, description, **canonical link** and Open Graph / X preview (`src/lib/seo.ts` → `pageMeta`). Retreats, articles, astrology posts and tips get a generated share image.
- **Structured data** (schema.org JSON-LD) so search engines understand the content: Organization + WebSite + Yulia as a Person (homepage, About), retreats as a TouristTrip (or an Event with dates and prices once a departure is added) with the schedule and FAQs, articles/astrology/tips as BlogPosting, Ask a Witch episodes as VideoObject, Contact FAQs as FAQPage, and breadcrumbs.
- `/sitemap.xml` lists every published page, retreat and post (with images), and updates itself as Yulia publishes. `/robots.txt` allows indexing **only on Production** (previews are hidden) and keeps `/admin`, `/api` and booking pages out.
- Admin → retreats and posts have an optional **SEO title / SEO description** — use them when the page title isn't what people would search for. Keep descriptions under ~155 characters.
- Old witchyportal.com WordPress addresses (`/index.php/…`) redirect permanently to the new pages, so existing Google rankings carry over.

After the domain is live: Google Search Console → Add property (Domain) → verify (or use the HTML-tag code as `GOOGLE_SITE_VERIFICATION`) → Sitemaps → submit `sitemap.xml`. Use **URL inspection → Request indexing** for the homepage and the retreat page.

## Secrets

The repository contains no secrets; `.env*` files are git-ignored except `.env.example`. All secrets live in Vercel environment variables and are only read on the server.
