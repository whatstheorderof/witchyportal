import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { upcomingMoons, FULL_MOON_NAMES } from "@/lib/astro/moon";
import { ukDay } from "@/lib/astro/calendar";
import { NEW_MOON_IN_SIGN, FULL_MOON_IN_SIGN } from "@/lib/astro/text/stars/sky-events";
import { emailEnabled, listId, sendCampaign } from "@/lib/email";

/**
 * Called every morning by Vercel Cron (vercel.json). On the UK day of a New or
 * Full Moon it emails the Brevo "Moon reminders" list (BREVO_LIST_MOON) once.
 * Uses Yulia's own New/Full Moon in each sign text from the readings.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  if (!emailEnabled() || !listId("MOON")) return NextResponse.json({ skipped: "Brevo or BREVO_LIST_MOON not set" });

  const today = ukDay(new Date());
  const moon = upcomingMoons(3, new Date(Date.now() - 36 * 3600_000)).find((m) => ukDay(m.date) === today);
  if (!moon) return NextResponse.json({ skipped: "No New or Full Moon today", today });

  const key = `_moon_email_${today}`;
  const [done] = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  if (done) return NextResponse.json({ skipped: "Already sent", today });

  const sign = moon.sign as keyof typeof NEW_MOON_IN_SIGN;
  const isNew = moon.kind === "new";
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit" }).format(moon.date);
  const folk = isNew ? "" : FULL_MOON_NAMES[new Date(`${today}T12:00:00Z`).getUTCMonth()];
  const title = `${isNew ? "New Moon" : "Full Moon"} in ${moon.sign}`;
  const body = (isNew ? NEW_MOON_IN_SIGN : FULL_MOON_IN_SIGN)[sign];
  const paragraphs = [
    `Today the Moon is ${isNew ? "new" : "full"} in ${moon.sign}, exact at ${time} UK time${folk ? ` — the ${folk}` : ""}.`,
    ...String(body).split(/\n\s*\n/),
    "With love, Yulia",
  ];
  const id = await sendCampaign({
    list: "MOON",
    name: `${title} · ${today}`,
    subject: `${isNew ? "🌑" : "🌕"} ${title}${folk ? ` · the ${folk}` : ""} — your ritual for tonight`,
    heading: title,
    paragraphs,
    cta: { label: "See the Moon calendar", url: "https://witchyportal.org/moon" },
    reason: "you asked for New and Full Moon reminders.",
  });
  if (!id) return NextResponse.json({ error: "Brevo campaign failed" }, { status: 502 });
  await db.insert(settings).values({ key, value: { campaignId: id, title } }).onConflictDoNothing();
  return NextResponse.json({ sent: title, campaignId: id });
}
