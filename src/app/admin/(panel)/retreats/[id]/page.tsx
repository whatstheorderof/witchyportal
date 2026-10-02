import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import * as s from "@/db/schema";
import { AdminHeader, Notice, Panel, StatusPill } from "@/components/admin/ui";
import { AdminForm, Check, F, Select } from "@/components/admin/AdminForm";
import { PublishFields } from "@/components/admin/PublishFields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { Repeater } from "@/components/admin/Repeater";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteDeparture, deleteFaq, deleteOption, deleteRetreat, saveDeparture, saveFaq, saveOption, updateRetreat } from "../../../actions";
import { pickerMedia } from "@/lib/admin-data";
import { SITE_TIMEZONE, formatDateRange, toDateTimeLocal } from "@/lib/dates";
import { CURRENCIES, formatMoney, minorToInput } from "@/lib/money";
import { AVAILABILITY_LABEL, AvailabilityBadge } from "@/components/Availability";
import { allowedPaymentHosts } from "@/lib/validation";
import { paymentMode } from "@/lib/env";

export const metadata = { title: "Edit retreat" };

const availabilityOptions = s.availability.enumValues.map((v) => ({ value: v, label: AVAILABILITY_LABEL[v] }));

function OptionFields({ o }: { o?: s.BookingOption }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Label" name="label" defaultValue={o?.label} required placeholder="e.g. Shared room — deposit" />
        <Select label="Payment type" name="paymentType" defaultValue={o?.paymentType ?? "deposit"} options={[{ value: "deposit", label: "Deposit (part payment)" }, { value: "full", label: "Full payment" }]} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <F label="Amount charged by the link" name="amount" defaultValue={minorToInput(o?.amount)} required inputMode="decimal" hint="Must match the payment link exactly." />
        <F label="Full price of the place" name="totalPrice" defaultValue={minorToInput(o?.totalPrice)} inputMode="decimal" hint="Required for deposits." />
        <Select label="Currency" name="currency" defaultValue={o?.currency ?? "GBP"} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="Balance note" name="balanceNote" defaultValue={o?.balanceNote} placeholder="e.g. Balance due 8 weeks before arrival" />
        <Select label="Availability (manual)" name="availability" defaultValue={o?.availability ?? "available"} options={availabilityOptions} />
      </div>
      <F label="Short description" name="description" defaultValue={o?.description} />
      <div className="grid gap-4 sm:grid-cols-2">
        <F label="LIVE payment link (production)" name="paymentUrl" type="url" defaultValue={o?.paymentUrl} mono placeholder="https://buy.stripe.com/…" />
        <F label="TEST payment link (previews)" name="testPaymentUrl" type="url" defaultValue={o?.testPaymentUrl} mono placeholder="https://buy.stripe.com/test_…" hint="Use your provider's test mode so no real money is taken on preview sites." />
      </div>
      <div className="grid items-end gap-4 sm:grid-cols-2">
        <Check label="Show on the site" name="isVisible" defaultChecked={o?.isVisible ?? true} />
        <F label="Sort order" name="sortOrder" type="number" defaultValue={o?.sortOrder ?? 0} />
      </div>
    </>
  );
}

export default async function EditRetreat({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { created } = await searchParams;
  const [r] = await db.select().from(s.retreats).where(eq(s.retreats.id, id)).limit(1);
  if (!r) notFound();
  const [deps, faqs, media] = await Promise.all([
    db.select().from(s.departures).where(eq(s.departures.retreatId, id)).orderBy(asc(s.departures.startDate)),
    db.select().from(s.faqs).where(eq(s.faqs.retreatId, id)).orderBy(asc(s.faqs.sortOrder)),
    pickerMedia(),
  ]);
  const opts = deps.length ? await db.select().from(s.bookingOptions).where(inArray(s.bookingOptions.departureId, deps.map((d) => d.id))).orderBy(asc(s.bookingOptions.sortOrder), asc(s.bookingOptions.amount)) : [];
  const mode = paymentMode();

  return (
    <>
      <AdminHeader
        back={{ href: "/admin/retreats", label: "All retreats" }}
        title={r.title}
        intro={<span className="flex flex-wrap items-center gap-2"><StatusPill status={r.status} publishAt={r.publishAt} /> /retreats/{r.slug}</span>}
        actions={<Link href={`/retreats/${r.slug}?preview=1`} target="_blank" className="btn-outline min-h-10 text-sm">Preview ↗</Link>}
      />
      {created && <div className="mb-6"><Notice tone="ok">Draft created. Fill in the details, add dates and booking options, then publish.</Notice></div>}
      <nav aria-label="Sections" className="mb-6 flex flex-wrap gap-2 text-sm">
        {[["details", "Details"], ["dates", "Dates & booking options"], ["faqs", "FAQs"], ["danger", "Delete"]].map(([h, l]) => <a key={h} href={`#${h}`} className="chip min-h-9">{l}</a>)}
      </nav>

      <div className="grid gap-8">
        <Panel title="Details" id="details">
          <AdminForm action={updateRetreat} sticky>
            <input type="hidden" name="id" value={r.id} />
            <PublishFields status={r.status} publishAt={toDateTimeLocal(r.publishAt)} tz={SITE_TIMEZONE} />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Title" name="title" defaultValue={r.title} required />
              <F label="Web address (slug)" name="slug" defaultValue={r.slug} required mono hint="Lowercase words joined by hyphens." />
            </div>
            <F label="Tagline" name="tagline" defaultValue={r.tagline} />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Location" name="location" defaultValue={r.location} />
              <F label="Country" name="country" defaultValue={r.country} />
            </div>
            <F label="Summary (shown on cards and at the top)" name="summary" defaultValue={r.summary} textarea rows={3} />
            <F label="Concept" name="concept" defaultValue={r.concept} textarea rows={6} hint="Markdown supported: **bold**, *italic*, lists, [links](https://…)." />
            <F label="Yulia's personal message" name="personalMessage" defaultValue={r.personalMessage} textarea rows={5} />
            <F label="Intended guest experience" name="guestExperience" defaultValue={r.guestExperience} textarea rows={5} />
            <F label="What guests will take home (one per line)" name="benefits" defaultValue={r.benefits.join("\n")} textarea rows={5} hint="How the retreat helps — what Yulia hopes the women gain. Shown as a highlighted list." />
            <Repeater name="activities" label="Activities" addLabel="Add activity" initial={r.activities} fields={[{ key: "title", label: "Title" }, { key: "description", label: "Description", textarea: true }]} />
            <Repeater name="itinerary" label="Sample itinerary" addLabel="Add day" initial={r.itinerary} fields={[{ key: "day", label: "Day label" }, { key: "title", label: "Title" }, { key: "description", label: "Description", textarea: true }]} />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Included (one per line)" name="inclusions" defaultValue={r.inclusions.join("\n")} textarea rows={6} />
              <F label="Not included (one per line)" name="exclusions" defaultValue={r.exclusions.join("\n")} textarea rows={6} />
            </div>
            <F label="Duration" name="duration" defaultValue={r.duration} placeholder="e.g. 7 days · 6 nights" hint="Shown on cards before dates are set." />
            <F label="Accommodation" name="accommodation" defaultValue={r.accommodation} textarea rows={5} />
            <F label="Meals" name="meals" defaultValue={r.meals} textarea rows={3} hint="What's included, dietary requirements you can cater for." />
            <F label="Travel guidance" name="travel" defaultValue={r.travel} textarea rows={4} hint="Nearest airport, transfers, when to arrive and leave." />
            <Repeater name="forMe" label="Is this retreat for me? (questions & answers)" addLabel="Add question" initial={r.forMe} fields={[{ key: "question", label: "Question" }, { key: "answer", label: "Answer", textarea: true }]} />
            <F label="Retreat-specific terms" name="terms" defaultValue={r.terms} textarea rows={5} />
            <MediaPicker name="heroMediaId" label="Hero image" media={media} defaultValue={r.heroMediaId} />
            <MediaPicker name="gallery" label="Gallery (photos and dancing footage)" media={media} defaultValue={r.gallery} multiple kind="any" hint="Order matters — the first item is shown largest. Uploaded videos play with sound off and controls." />
            <F label="YouTube video (optional)" name="videoUrl" defaultValue={r.videoUrl} mono placeholder="https://youtu.be/…" />
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="SEO title" name="seoTitle" defaultValue={r.seoTitle} maxLength={70} />
              <F label="SEO description" name="seoDescription" defaultValue={r.seoDescription} maxLength={170} />
            </div>
            <div className="grid items-end gap-4 sm:grid-cols-2">
              <Check label="Placeholder content" name="isPlaceholder" defaultChecked={r.isPlaceholder} hint="Shows a “sample” badge on the site. Untick once real details are in." />
              <F label="Sort order" name="sortOrder" type="number" defaultValue={r.sortOrder} />
            </div>
          </AdminForm>
        </Panel>

        <Panel
          title="Dates & booking options"
          id="dates"
          intro={<>Availability is <strong>managed manually</strong>: after confirming a payment with your provider, update the option or dates here. This environment uses <strong>{mode === "live" ? "LIVE" : "TEST"}</strong> links. Approved payment hosts: {allowedPaymentHosts().slice(0, 6).join(", ")}…</>}
        >
          <div className="grid gap-6">
            {deps.map((d) => {
              const dOpts = opts.filter((o) => o.departureId === d.id);
              return (
                <div key={d.id} className="rounded-2xl bg-ivory-deep p-4 ring-1 ring-line sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-2xl text-plum">{formatDateRange(d.startDate, d.endDate)}</h3>
                    <div className="flex items-center gap-2"><AvailabilityBadge value={d.availability} />{!d.isVisible && <span className="text-xs text-muted">hidden</span>}</div>
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-plum">Edit dates &amp; availability</summary>
                    <div className="mt-4">
                      <AdminForm action={saveDeparture} submitLabel="Save dates">
                        <input type="hidden" name="id" value={d.id} /><input type="hidden" name="retreatId" value={r.id} />
                        <div className="grid gap-4 sm:grid-cols-2"><F label="Start date" name="startDate" type="date" defaultValue={d.startDate} required /><F label="End date" name="endDate" type="date" defaultValue={d.endDate} required /></div>
                        <div className="grid gap-4 sm:grid-cols-2"><Select label="Availability (manual)" name="availability" defaultValue={d.availability} options={availabilityOptions} /><F label="Availability note" name="availabilityNote" defaultValue={d.availabilityNote} placeholder="e.g. 3 places left" /></div>
                        <div className="grid items-end gap-4 sm:grid-cols-2"><Check label="Show on the site" name="isVisible" defaultChecked={d.isVisible} /><F label="Sort order" name="sortOrder" type="number" defaultValue={d.sortOrder} /></div>
                      </AdminForm>
                      <div className="mt-4"><ConfirmDelete action={deleteDeparture} fields={{ id: d.id, retreatId: r.id }} label="Delete these dates" what="these dates and their booking options" /></div>
                    </div>
                  </details>

                  <ul className="mt-4 grid gap-3">
                    {dOpts.map((o) => (
                      <li key={o.id} className="rounded-xl bg-white/80 p-4 ring-1 ring-line">
                        <details>
                          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                            <span className="font-medium">{o.label}</span>
                            <span className="flex flex-wrap items-center gap-2 text-sm">
                              <span>{o.paymentType === "deposit" ? "Deposit" : "Full"} {formatMoney(o.amount, o.currency)}</span>
                              <AvailabilityBadge value={o.availability} />
                              {!o.paymentUrl && <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning">no live link</span>}
                              {!o.testPaymentUrl && <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs text-muted">no test link</span>}
                            </span>
                          </summary>
                          <div className="mt-4">
                            <AdminForm action={saveOption} submitLabel="Save option">
                              <input type="hidden" name="id" value={o.id} /><input type="hidden" name="departureId" value={d.id} />
                              <OptionFields o={o} />
                            </AdminForm>
                            <div className="mt-4"><ConfirmDelete action={deleteOption} fields={{ id: o.id, retreatId: r.id }} label="Delete option" what="this booking option" /></div>
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-plum">+ Add booking option</summary>
                    <div className="mt-4 rounded-xl bg-white/80 p-4 ring-1 ring-line">
                      <AdminForm action={saveOption} submitLabel="Add option" resetOnSuccess>
                        <input type="hidden" name="departureId" value={d.id} />
                        <OptionFields />
                      </AdminForm>
                    </div>
                  </details>
                </div>
              );
            })}
            <details className="rounded-2xl border border-dashed border-line p-4 sm:p-5" open={deps.length === 0}>
              <summary className="cursor-pointer font-medium text-plum">+ Add dates</summary>
              <div className="mt-4">
                <AdminForm action={saveDeparture} submitLabel="Add dates" resetOnSuccess>
                  <input type="hidden" name="retreatId" value={r.id} />
                  <div className="grid gap-4 sm:grid-cols-2"><F label="Start date" name="startDate" type="date" required /><F label="End date" name="endDate" type="date" required /></div>
                  <div className="grid gap-4 sm:grid-cols-2"><Select label="Availability (manual)" name="availability" defaultValue="available" options={availabilityOptions} /><F label="Availability note" name="availabilityNote" /></div>
                  <div className="grid items-end gap-4 sm:grid-cols-2"><Check label="Show on the site" name="isVisible" defaultChecked /><F label="Sort order" name="sortOrder" type="number" defaultValue={0} /></div>
                </AdminForm>
              </div>
            </details>
          </div>
        </Panel>

        <Panel title="FAQs for this retreat" id="faqs">
          <div className="grid gap-3">
            {faqs.map((f) => (
              <details key={f.id} className="rounded-xl bg-white/80 p-4 ring-1 ring-line">
                <summary className="cursor-pointer font-medium">{f.question} <StatusPill status={f.status} publishAt={f.publishAt} /></summary>
                <div className="mt-4">
                  <AdminForm action={saveFaq}>
                    <input type="hidden" name="id" value={f.id} /><input type="hidden" name="retreatId" value={r.id} />
                    <F label="Question" name="question" defaultValue={f.question} required />
                    <F label="Answer" name="answer" defaultValue={f.answer} textarea required />
                    <PublishFields status={f.status} publishAt={toDateTimeLocal(f.publishAt)} tz={SITE_TIMEZONE} />
                    <div className="grid items-end gap-4 sm:grid-cols-2"><Check label="Placeholder" name="isPlaceholder" defaultChecked={f.isPlaceholder} /><F label="Sort order" name="sortOrder" type="number" defaultValue={f.sortOrder} /></div>
                  </AdminForm>
                  <div className="mt-3"><ConfirmDelete action={deleteFaq} fields={{ id: f.id, retreatId: r.id }} what="this FAQ" /></div>
                </div>
              </details>
            ))}
            <details className="rounded-xl border border-dashed border-line p-4">
              <summary className="cursor-pointer font-medium text-plum">+ Add FAQ</summary>
              <div className="mt-4">
                <AdminForm action={saveFaq} submitLabel="Add FAQ" resetOnSuccess>
                  <input type="hidden" name="retreatId" value={r.id} />
                  <F label="Question" name="question" required />
                  <F label="Answer" name="answer" textarea required />
                  <PublishFields status="published" publishAt="" tz={SITE_TIMEZONE} />
                  <F label="Sort order" name="sortOrder" type="number" defaultValue={faqs.length} />
                </AdminForm>
              </div>
            </details>
          </div>
        </Panel>

        <Panel title="Delete retreat" id="danger" intro="Removes the retreat, all its dates, booking options and FAQs. To hide it temporarily, set the status to Archived instead.">
          <ConfirmDelete action={deleteRetreat} fields={{ id: r.id }} label="Delete retreat" what={`“${r.title}”`} />
        </Panel>
      </div>
    </>
  );
}
