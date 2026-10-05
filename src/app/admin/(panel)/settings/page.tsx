import Link from "next/link";
import { asc, desc, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts, retreats, videos } from "@/db/schema";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { AdminForm, Check, F, Select } from "@/components/admin/AdminForm";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveSettings } from "../../actions";
import { getSetting } from "@/lib/settings";
import { pickerMedia } from "@/lib/admin-data";

export const metadata = { title: "Settings" };

export default async function SettingsAdmin() {
  const yt = await getSetting("youtube");
  const recent = sql`coalesce(publish_at, created_at)`;
  const [vids, arts, shortsPosts] = await Promise.all([
    db.select({ id: videos.id, title: videos.title }).from(videos).orderBy(desc(recent)).limit(40),
    db.select({ id: posts.id, title: posts.title }).from(posts).where(inArray(posts.type, ["article"])).orderBy(desc(recent)).limit(40),
    db.select({ id: posts.id, title: posts.title, type: posts.type }).from(posts).where(inArray(posts.type, ["tip", "affirmation", "motivation"])).orderBy(desc(recent)).limit(60),
  ]);
  const [home, about, contact, site, media, rs] = await Promise.all([
    getSetting("home"), getSetting("about"), getSetting("contact"), getSetting("site"), pickerMedia(),
    db.select({ id: retreats.id, title: retreats.title }).from(retreats).orderBy(asc(retreats.sortOrder)),
  ]);
  return (
    <>
      <AdminHeader title="Settings" intro="Homepage, About page, contact details and newsletter text." />
      <nav className="mb-6 flex flex-wrap gap-2 text-sm">{[["home", "Homepage"], ["about", "About Yulia"], ["contact", "Contact"], ["youtube", "YouTube"], ["site", "Newsletter"]].map(([h, l]) => <a key={h} href={`#${h}`} className="chip min-h-9">{l}</a>)}</nav>
      <div className="grid gap-8">
        <Panel title="Homepage" id="home" intro={<>Feature cards are in <Link className="link-underline" href="/admin/highlights">Homepage features</Link>.</>}>
          <AdminForm action={saveSettings}>
            <input type="hidden" name="key" value="home" />
            <F label="Hero label" name="heroEyebrow" defaultValue={home.heroEyebrow} />
            <F label="Hero headline" name="heroTitle" defaultValue={home.heroTitle} />
            <F label="Hero text" name="heroSubtitle" defaultValue={home.heroSubtitle} textarea rows={2} />
            <MediaPicker name="heroMediaId" label="Hero image" media={media} defaultValue={home.heroMediaId} hint="Also used as the video poster and for visitors who prefer reduced motion." />
            <MediaPicker name="heroVideoMediaId" label="Hero background video (optional)" media={media} defaultValue={home.heroVideoMediaId} kind="video" hint="Short, silent loop (10–20s, under 15 MB). Plays muted; never shown to visitors who prefer reduced motion." />
            <Select label="Featured retreat" name="featuredRetreatId" defaultValue={home.featuredRetreatId ?? ""} options={[{ value: "", label: "First published retreat" }, ...rs.map((r) => ({ value: r.id, label: r.title }))]} />
            <fieldset className="grid gap-4 rounded-2xl bg-ivory-deep p-4 ring-1 ring-line">
              <legend className="px-1 text-sm font-medium">This week with Yulia</legend>
              <p className="text-sm text-muted">Leave as “Latest” to show the newest automatically, or pin a specific item.</p>
              <Select label="Video" name="weekVideoPickId" defaultValue={home.weekVideoPickId ?? ""} options={[{ value: "", label: "Latest video" }, ...vids.map((v) => ({ value: v.id, label: v.title }))]} />
              <Select label="Article" name="weekArticlePickId" defaultValue={home.weekArticlePickId ?? ""} options={[{ value: "", label: "Latest article" }, ...arts.map((v) => ({ value: v.id, label: v.title }))]} />
              <Select label="Tip, affirmation or motivation" name="weekTipPickId" defaultValue={home.weekTipPickId ?? ""} options={[{ value: "", label: "Latest" }, ...shortsPosts.map((v) => ({ value: v.id, label: `${v.type}: ${v.title}` }))]} />
            </fieldset>
            <F label="Welcome video (YouTube link)" name="welcomeVideoUrl" defaultValue={home.welcomeVideoUrl} mono hint="A 30–60 second hello from Yulia. Shown beside her introduction instead of the photo." />
            <F label="Introduction heading" name="introTitle" defaultValue={home.introTitle} />
            <F label="Introduction text" name="introText" defaultValue={home.introText} textarea rows={4} />
            <MediaPicker name="introMediaId" label="Introduction image" media={media} defaultValue={home.introMediaId} />
          </AdminForm>
        </Panel>
        <Panel title="About Yulia" id="about">
          <AdminForm action={saveSettings}>
            <input type="hidden" name="key" value="about" />
            <F label="Page title" name="title" defaultValue={about.title} />
            <F label="Intro line" name="intro" defaultValue={about.intro} />
            <F label="Her story" name="story" defaultValue={about.story} textarea rows={8} hint="Markdown supported." />
            <F label="Her views on retreats" name="views" defaultValue={about.views} textarea rows={6} />
            <F label="Why she hosts them" name="why" defaultValue={about.why} textarea rows={6} />
            <F label="What she hopes guests will gain" name="hopes" defaultValue={about.hopes} textarea rows={6} />
            <MediaPicker name="portraitMediaId" label="Main portrait" media={media} defaultValue={about.portraitMediaId} />
            <MediaPicker name="secondaryMediaId" label="Secondary image" media={media} defaultValue={about.secondaryMediaId} />
            <Check label="Still placeholder text" name="isPlaceholder" defaultChecked={about.isPlaceholder} hint="Shows a placeholder badge on the page." />
          </AdminForm>
        </Panel>
        <Panel title="Contact" id="contact">
          <AdminForm action={saveSettings}>
            <input type="hidden" name="key" value="contact" />
            <F label="Public email" name="email" type="email" defaultValue={contact.email} hint="Leave empty to hide it — people can still use the contact form." />
            <F label="Response time note" name="responseTime" defaultValue={contact.responseTime} />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Etsy shop URL" name="etsy" defaultValue={contact.etsy} mono />
              <F label="Instagram URL" name="instagram" defaultValue={contact.instagram} mono />
              <F label="YouTube URL" name="youtube" defaultValue={contact.youtube} mono />
              <F label="TikTok URL" name="tiktok" defaultValue={contact.tiktok} mono />
            </div>
          </AdminForm>
        </Panel>
        <Panel title="YouTube channel" id="youtube" intro="Powers the Ask a Witch hub and the daily automatic import.">
          <AdminForm action={saveSettings}>
            <input type="hidden" name="key" value="youtube" />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Channel link" name="channelUrl" defaultValue={yt.channelUrl} mono />
              <F label="Channel id" name="channelId" defaultValue={yt.channelId} mono hint="Starts with UC. Found in YouTube Studio → Settings → Channel → Advanced." />
            </div>
            <Select label="Automatic daily import" name="autoImport" defaultValue={yt.autoImport} options={[{ value: "ask-a-witch", label: "Ask a Witch and Yulia Moon Show episodes (matching words below)" }, { value: "all", label: "Every new upload" }, { value: "off", label: "Off — I'll add videos myself" }]} />
            <F label="Ask a Witch matching words" name="matchWords" defaultValue={yt.matchWords} hint="Comma separated. A new upload is imported if its title or description contains any of these." />
            <F label="Yulia Moon Show matching words" name="showWords" defaultValue={yt.showWords} hint="Comma separated, matched on the title. These episodes get their own channel on the Watch page and stay off the Ask a Witch page." />
          </AdminForm>
        </Panel>
        <Panel title="Newsletter" id="site">
          <AdminForm action={saveSettings}>
            <input type="hidden" name="key" value="site" />
            <F label="Newsletter heading" name="newsletterTitle" defaultValue={site.newsletterTitle} />
            <F label="Newsletter text" name="newsletterText" defaultValue={site.newsletterText} textarea rows={2} />
            <input type="hidden" name="announcement" value={site.announcement} />
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
