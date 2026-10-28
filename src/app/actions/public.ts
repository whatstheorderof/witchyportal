"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { enquiries, subscribers, waitlist, retreats, departures } from "@/db/schema";
import { emailSchema } from "@/lib/validation";
import { fieldErrors, type FormState } from "@/lib/forms";
import { after } from "next/server";
import { addToList, sendEmail } from "@/lib/email";
import { getSetting } from "@/lib/settings";
import { retreatEmailOf } from "@/lib/contact-links";

const isBot = (fd: FormData) => Boolean(fd.get("company")); // honeypot

const uuidOrEmpty = z.union([z.string().uuid(), z.literal("")]).optional().transform((v) => v || null);

export async function subscribe(_: FormState, fd: FormData): Promise<FormState> {
  if (isBot(fd)) return { ok: true, message: "Thank you — you're on the list." };
  const parsed = z
    .object({
      email: emailSchema,
      consent: z.literal("on", { message: "Please confirm you'd like to receive emails" }),
      source: z.string().max(40).optional(),
    })
    .safeParse({ email: fd.get("email"), consent: fd.get("consent"), source: fd.get("source") ?? undefined });
  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error.issues), values: { email: String(fd.get("email") ?? "") } };
  }
  try {
    await db
      .insert(subscribers)
      .values({ email: parsed.data.email, source: parsed.data.source ?? "site" })
      .onConflictDoUpdate({ target: subscribers.email, set: { unsubscribedAt: null, consentAt: new Date() } });
    const source = parsed.data.source ?? "site";
    after(() => addToList(source === "synastry-report" ? "REPORTS" : "NEWSLETTER", parsed.data.email));
    return { ok: true, message: "You're subscribed — thank you! Look out for Yulia's next letter in your inbox (check your Promotions folder if it doesn't arrive)." };
  } catch (e) {
    console.error("subscribe failed", e);
    return { ok: false, message: "Something went wrong on our side. Please try again in a moment." };
  }
}

export async function sendEnquiry(_: FormState, fd: FormData): Promise<FormState> {
  const values = Object.fromEntries(["name", "email", "topic", "message", "retreatId"].map((k) => [k, String(fd.get(k) ?? "")]));
  if (isBot(fd)) return { ok: true, message: "Thank you — your message has been sent." };
  const parsed = z
    .object({
      name: z.string().trim().min(1, "Please tell us your name").max(120),
      email: emailSchema,
      topic: z.enum(["general", "retreat", "collaboration", "press"]).default("general"),
      message: z.string().trim().min(10, "Please write a little more (at least 10 characters)").max(5000),
      retreatId: uuidOrEmpty,
    })
    .safeParse(values);
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error.issues), values };
  try {
    await db.insert(enquiries).values(parsed.data);
    const e = parsed.data;
    after(async () => {
      const contact = await getSetting("contact");
      const to = e.topic === "retreat" ? retreatEmailOf(contact) : contact.email;
      if (!to) return;
      await sendEmail({
        to,
        replyTo: e.email,
        subject: `New ${e.topic} enquiry from ${e.name}`,
        heading: `New enquiry from ${e.name}`,
        paragraphs: [`Topic: ${e.topic}`, `From: ${e.name} <${e.email}>`, e.message, "Reply to this email to answer them directly. It's also in Admin → Inbox."],
      });
    });
    return { ok: true, message: "Thank you — your message has been sent. Yulia will be in touch soon." };
  } catch (e) {
    console.error("enquiry failed", e);
    return { ok: false, message: "Your message couldn't be sent just now. Please try again, or email us directly.", values };
  }
}

export async function joinWaitlist(_: FormState, fd: FormData): Promise<FormState> {
  const values = Object.fromEntries(["name", "email", "note", "retreatId", "departureId"].map((k) => [k, String(fd.get(k) ?? "")]));
  if (isBot(fd)) return { ok: true, message: "You're on the waitlist." };
  const parsed = z
    .object({
      name: z.string().trim().min(1, "Please tell us your name").max(120),
      email: emailSchema,
      note: z.string().trim().max(1000).optional(),
      retreatId: z.string().uuid(),
      departureId: uuidOrEmpty,
    })
    .safeParse(values);
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error.issues), values };
  const [r] = await db.select({ id: retreats.id, title: retreats.title }).from(retreats).where(eq(retreats.id, parsed.data.retreatId)).limit(1);
  if (!r) return { ok: false, message: "That retreat could not be found.", values };
  if (parsed.data.departureId) {
    const [d] = await db.select({ id: departures.id, retreatId: departures.retreatId }).from(departures).where(eq(departures.id, parsed.data.departureId)).limit(1);
    if (!d || d.retreatId !== r.id) return { ok: false, message: "That date could not be found.", values };
  }
  try {
    await db.insert(waitlist).values({ ...parsed.data, note: parsed.data.note || null });
    const w = parsed.data;
    after(async () => {
      const contact = await getSetting("contact");
      const yulia = retreatEmailOf(contact);
      const first = w.name.split(/\s+/)[0];
      await addToList("WAITLIST", w.email, { FIRSTNAME: first });
      await sendEmail({
        to: w.email,
        toName: w.name,
        replyTo: yulia || undefined,
        subject: `You're on the list for ${r.title}`,
        heading: `You're on the list, ${first}`,
        paragraphs: [
          `Thank you for joining the waitlist for ${r.title}. You'll hear from Yulia as soon as ${w.departureId ? "a place opens up" : "dates and prices are announced"} — before anything is shared publicly.`,
          "Joining the waitlist isn't a booking, and there's nothing to pay.",
          "If you have any questions in the meantime, just reply to this email.",
          "With love and magic,\nYulia Moon",
        ],
      });
      if (yulia) {
        await sendEmail({
          to: yulia,
          replyTo: w.email,
          subject: `New waitlist sign-up: ${w.name} (${r.title})`,
          heading: "Someone joined the waitlist",
          paragraphs: [`${w.name} <${w.email}> joined the waitlist for ${r.title}.`, ...(w.note ? [`Their note: ${w.note}`] : []), "Reply to this email to write to them. Everyone on the waitlist is in Admin → Inbox → Waitlist."],
        });
      }
    });
    return {
      ok: true,
      message: parsed.data.departureId
        ? `You're on the waitlist for ${r.title}. Yulia will email ${parsed.data.email} if a place opens up. This isn't a booking — there's nothing to pay.`
        : `You're on the list for ${r.title}. Yulia will email ${parsed.data.email} as soon as dates and prices are announced. This isn't a booking — there's nothing to pay.`,
    };
  } catch (e) {
    console.error("waitlist failed", e);
    return { ok: false, message: "Something went wrong. Please try again.", values };
  }
}
