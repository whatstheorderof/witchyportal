# Content guide (for Yulia)

Sign in at **your-domain.com/admin**. Everything you save goes live on the site straight away (or at the time you schedule) — no developer needed.

## Publishing states

Tips, astrology, articles, Ask a Witch and the birth chart each finish with an invitation to the featured retreat, so visitors who come for the content are led towards booking.

Every retreat, post, video, FAQ, homepage feature and policy page has a **Status**:

| Status | What visitors see |
| --- | --- |
| **Draft** | Nothing. Only you, in admin. Use **Preview ↗** to see it as it will look. |
| **Scheduled** | Nothing until the **Publish at** time, then it appears automatically. |
| **Published** | Live now. The publish date is shown as the post's date. |
| **Archived** | Hidden, but kept so you can bring it back later. |

Times are UK time (Europe/London).

## Weekly content

- **Tips** — *Content → Tips*. Title + a short tip text + topic (topics become filter buttons).
- **Affirmations** — the title *is* the affirmation.
- **Motivations** — *Content → Motivations*. A short title plus a few encouraging lines.
- **Astrology** — add a *Period* such as "Libra season" or "Week of 21 September", an excerpt, the full text and optionally a cover image.
- **Articles** — title, topic, excerpt, body and cover image.

Tip: write several in one sitting and **schedule** them for the coming weeks.

### Formatting text (Markdown)

```
## A heading
**bold**  *italic*
- a bullet
> a quote
[link text](https://example.com)
```

## Ask a Witch videos

The Ask a Witch page is a hub for your YouTube channel (@YuliaMoonPortal): the newest answer plays large at the top, then a row of Shorts and a grid of longer videos, all watchable on the site.

- **Automatic:** once a day the site checks your channel and adds new uploads whose title or description mentions "Ask a Witch" (or #askawitch). Change this in *Settings → YouTube* (Ask a Witch only / every upload / off, and the matching words).
- **From your channel:** *Ask a Witch videos → Check channel for videos* lists your latest uploads; tick the ones you want and press **Add ticked videos**.
- **Older videos:** paste links (one per line) into **Paste links** — titles are filled in from YouTube.
- Edit any video to change its title, add a topic (topics become filter buttons) or hide it. Videos only load from YouTube when a visitor presses play.

Tip: put "Ask a Witch" in the title or description of those uploads so they're picked up automatically.

## Watch (Witchy TV)

`/watch` plays every video the site knows about, one after another, like a TV channel: Everything, Ask a Witch, The Yulia Moon Show, Shorts, Full episodes and one channel per topic. Episodes are sorted into the series by their titles — keep "Ask a Witch" or "Yulia Moon Show" in the title of new uploads (the matching words are in *Settings → YouTube*). Link straight to a channel with `/watch?channel=show` or `/watch?channel=ask`.

YouTube's public feed only lists a channel's latest 15 uploads, so older episodes are listed in `content/videos.ts`; the daily check adds anything new. **Whole channel** plays the YouTube uploads playlist directly, so it works even before videos are imported. Nothing loads from YouTube until the visitor presses play. Videos added under *Ask a Witch videos* appear here automatically.

## This week with Yulia

*Settings → Homepage → This week with Yulia* lets you pin a video, an article and a tip for the homepage's weekly strip. Leave a box on "Latest" and the newest published item is used — so if you publish something every week, you don't need to touch these. **Welcome video** (a YouTube link) replaces the portrait in the homepage "Meet Yulia" section.

## Retreats

*Retreats & dates → Edit*. A retreat has:

1. **Details** — concept, your personal message, guest experience, **what guests will take home** (one benefit per line), activities, sample itinerary, included / not included, accommodation, terms, hero image and a gallery of photos **and dancing footage** (uploaded videos play muted with controls).
2. **Dates** (departures) — each with its own availability.
3. **Booking options** for each date — label, price, deposit or full payment, and payment links. See [BOOKINGS.md](BOOKINGS.md).
4. **FAQs** for that retreat.

Untick **Placeholder content** once the real details are in — this removes the "Sample" badge.

## Photos and video

*Media library → Upload.* Every image needs **alt text**: one sentence describing what's in the picture ("Yulia dancing barefoot on the sand at sunset"). This is read aloud to blind visitors and helps Google.

- Photos: JPG/PNG/WebP, ideally 2000–3000px wide. The site automatically makes smaller versions for phones.
- Dancing footage for the homepage: a short silent loop (10–20 seconds, under ~15 MB, MP4). Choose it in *Settings → Homepage → Hero background video*. Visitors who've asked their phone to reduce motion see the hero photo instead.

## Homepage and About page

*Settings* holds the homepage hero text, featured retreat, introduction, the About page (your story, views on retreats, why you host them, what you hope guests gain), contact email and social links. *Homepage features* are the three image cards on the homepage.

## Insights

*Insights* shows how visitors move through booking over the last 7, 30 or 90 days: retreat page views → booking option chosen → summary viewed → sent to the payment page, plus waitlist, enquiry and newsletter counts. It stores no names, emails, IP addresses or birth details — only which step happened and when. "Sent to payment" is not the same as paid: always confirm payments in Stripe (or your payment provider).

## Favourites and sharing

Visitors can save tips, articles, astrology posts and videos with the heart button; they're kept on their own phone (no account) and listed at `/favourites`. Every tip, affirmation and motivation now has its own page (`/tips/<name>`) with a Share button, and shared links show a branded preview image with the title.

## Enquiries, waitlist and newsletter

*Inbox* shows contact messages, waitlist sign-ups and newsletter subscribers. Reply from your own email, then mark items as handled. **Export CSV** downloads a list (e.g. to import subscribers into your email tool).
