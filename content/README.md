# Site content

Everything in this folder is published to the website automatically when it's deployed (pushed to `main`). Edit a file, push, and the change appears — no admin clicks needed.

| Folder | Appears on |
| --- | --- |
| `site/home.md` | Homepage hero and "Hello, I'm Yulia" introduction |
| `site/about.md` | About Yulia page |
| `site/contact.md` | Contact details and social links (footer, Contact, Ask a Witch) |
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

## Files vs the admin area

- New files are added on the next deploy; changed files update the site.
- If something is edited in `/admin`, that edit wins — the file won't overwrite it (the build log says "kept admin edits").
- Deleting a file doesn't delete the post from the site. Archive or delete it in `/admin`.
- Retreats, dates, prices, payment links, videos and photos are managed in `/admin` (or by asking Claude to add them to the seed).
