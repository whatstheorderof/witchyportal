# Site content

Everything in this folder is published to the website automatically when it's deployed (pushed to `main`). Edit a file, push, and the change appears — no admin clicks needed.

| Folder | Appears on |
| --- | --- |
| `site/home.md` | Homepage hero and "Hello, I'm Yulia" introduction |
| `site/about.md` | About Yulia page |
| `site/contact.md` | Contact details and social links (footer, Contact, Ask a Witch) |
| `retreats/` | Retreat pages — description, activities, benefits, images (dates, prices and payment links are managed in /admin) |
| `socials.ts` | Socials page links (Instagram, YouTube, Etsy…) |
| `videos.ts` | Back catalogue of Ask a Witch and Yulia Moon Show episodes (Watch and Ask a Witch pages). New uploads are picked up automatically each day. |
| `tips/` | Witchy Tips page (tip cards) |
| `affirmations/` | Witchy Tips page (affirmation cards) |
| `motivations/` | Witchy Tips page (motivation cards) |
| `astrology/` | Astrology page |
| `articles/` | Articles page |

## Post files

One Markdown file per post. The file name becomes the web address (`articles/moon-rituals.md` → `/articles/moon-rituals`).

```markdown
---
title: Keep a bowl of sea salt by your door
date: 2026-10-05          # future dates are scheduled and go live on that day
topic: Home rituals       # becomes a filter button
excerpt: The short text shown on cards.
period: Scorpio season    # astrology only
draft: true               # optional — keeps it hidden
---

The full text (articles and astrology). Markdown: **bold**, *italic*, ## headings, - lists.
```

## Retreat files

`retreats/<name>.md` holds everything about a retreat except dates, prices and payment links (those live in /admin so availability can't be overwritten by a deploy). Useful fields:

```yaml
duration: 7 days            # shown in the key facts strip and on cards
location: Location to be announced
meals: |                    # "Stay & food" section
  Breakfast and dinner daily…
travel: |                   # "Getting there" section — nearest airport, transfers
  Fly into …
forMe:                      # "Is this retreat for me?" — Yulia's own answers only
  - question: I've never done tarot — is that OK?
    answer: …
```

Leave a field out until the real answer is known — the retreat page lists it under "Still being finalised" instead of guessing.

## Files vs the admin area

- New files are added on the next deploy; changed files update the site.
- If something is edited in `/admin`, that edit wins — the file won't overwrite it (the build log says "kept admin edits").
- Deleting a file doesn't delete the post from the site. Archive or delete it in `/admin`.
- Retreats, dates, prices, payment links, videos and photos are managed in `/admin` (or by asking Claude to add them to the seed).
