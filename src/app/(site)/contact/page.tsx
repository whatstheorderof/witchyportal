import type { Metadata } from "next";
import { listGeneralFaqs, listRetreats } from "@/lib/queries";
import { getSetting } from "@/lib/settings";
import { PageHero } from "@/components/Section";
import { EnquiryForm } from "@/components/forms";
import { Markdown } from "@/components/Markdown";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with Yulia Moon about retreats, collaborations and questions." };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ retreat?: string }> }) {
  const { retreat } = await searchParams;
  const [retreats, faqs, contact] = await Promise.all([listRetreats(), listGeneralFaqs(), getSetting("contact")]);
  const defaultRetreat = retreats.find((r) => r.id === retreat)?.id;
  return (
    <>
      <PageHero eyebrow="Contact" title="Send Yulia a message" intro={contact.responseTime} />
      <div className="container-page grid gap-16 py-14 lg:grid-cols-[1.3fr_1fr] lg:py-20">
        <section aria-label="Enquiry form" className="card p-6 sm:p-10">
          <EnquiryForm retreats={retreats.map((r) => ({ id: r.id, title: r.title }))} defaultRetreatId={defaultRetreat} />
        </section>
        <aside className="grid content-start gap-10">
          {(contact.email || contact.instagram) && (
            <div className="grid gap-6">
              {contact.email && (
                <div>
                  <p className="eyebrow">Email</p>
                  <a href={`mailto:${contact.email}`} className="mt-2 block font-display text-2xl text-plum link-underline">{contact.email}</a>
                </div>
              )}
              {contact.instagram && (
                <div>
                  <p className="eyebrow">Instagram</p>
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="mt-2 block font-display text-2xl text-plum link-underline">@{contact.instagram.replace(/\/$/, "").split("/").pop()}</a>
                  <p className="mt-1 text-sm text-muted">Send Yulia your Ask a Witch questions by DM.</p>
                </div>
              )}
            </div>
          )}
          {faqs.length > 0 && (
            <div>
              <p className="eyebrow">Frequently asked</p>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {faqs.map((f) => (
                  <details key={f.id} className="group py-1">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-xl text-plum [&::-webkit-details-marker]:hidden">
                      {f.question}<span aria-hidden className="text-2xl transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="pb-4 text-[0.97rem]"><Markdown>{f.answer}</Markdown></div>
                  </details>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
