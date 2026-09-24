"use client";

import Link from "next/link";
import { useId } from "react";
import { useActionForm } from "@/lib/useActionForm";
import type { FormState } from "@/lib/forms";
import { joinWaitlist, sendEnquiry, subscribe } from "@/app/actions/public";

function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Status({ state }: { state: FormState }) {
  if (!state.message) return <div role="status" aria-live="polite" />;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      aria-live="polite"
      className={`rounded-xl px-4 py-3 text-sm ${state.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}
    >
      {state.message}
    </p>
  );
}

export function Field({
  label, name, type = "text", state, required, autoComplete, hint, textarea, defaultValue, children, placeholder,
}: {
  label: string; name: string; type?: string; state: FormState; required?: boolean; autoComplete?: string; hint?: string;
  textarea?: boolean; defaultValue?: string; children?: React.ReactNode; placeholder?: string;
}) {
  const id = useId();
  const err = state.errors?.[name];
  const describedBy = [hint ? `${id}-hint` : null, err ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id, name, required, "aria-invalid": err ? true : undefined, "aria-describedby": describedBy,
    defaultValue: state.values?.[name] ?? defaultValue, className: "input", placeholder,
  };
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required ? <span aria-hidden className="text-blush-deep">*</span> : <span className="text-muted font-normal">(optional)</span>}
      </label>
      {children ? (
        <select {...common}>{children}</select>
      ) : textarea ? (
        <textarea {...common} rows={5} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} />
      )}
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {err && <p id={`${id}-err`} className="field-error">{err}</p>}
    </div>
  );
}

export function NewsletterForm({ source = "footer", dark = false }: { source?: string; dark?: boolean }) {
  const { state, action, pending, onSubmit } = useActionForm(subscribe);
  const id = useId();
  if (state.ok) return <Status state={state} />;
  return (
    <form action={action} onSubmit={onSubmit} className="relative grid gap-3" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">Email address</label>
        <input
          id={`${id}-email`} name="email" type="email" autoComplete="email" required placeholder="Your email address"
          defaultValue={state.values?.email} aria-invalid={state.errors?.email ? true : undefined}
          aria-describedby={state.errors?.email ? `${id}-err` : undefined} className="input flex-1"
        />
        <button className={dark ? "btn-light" : "btn-primary"} disabled={pending}>{pending ? "Joining…" : "Subscribe"}</button>
      </div>
      {state.errors?.email && <p id={`${id}-err`} className={`text-sm ${dark ? "text-blush" : "text-danger"}`}>{state.errors.email}</p>}
      <label className={`flex items-start gap-3 text-sm ${dark ? "text-ivory/80" : "text-muted"}`}>
        <input type="checkbox" name="consent" className="mt-1 h-5 w-5 shrink-0 accent-plum" required />
        <span>I&rsquo;d like to receive emails from Witchy Portal. See our <Link href="/policies/privacy" className="underline underline-offset-2">privacy policy</Link>.</span>
      </label>
      {state.errors?.consent && <p className={`text-sm ${dark ? "text-blush" : "text-danger"}`}>{state.errors.consent}</p>}
      {!state.ok && state.message && !state.errors && <Status state={state} />}
    </form>
  );
}

export function EnquiryForm({ retreats, defaultRetreatId }: { retreats: { id: string; title: string }[]; defaultRetreatId?: string }) {
  const { state, action, pending, onSubmit } = useActionForm(sendEnquiry);
  if (state.ok) return <div className="card p-6"><Status state={state} /></div>;
  return (
    <form action={action} onSubmit={onSubmit} className="relative grid gap-5" noValidate>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" state={state} required autoComplete="name" />
        <Field label="Email" name="email" type="email" state={state} required autoComplete="email" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What's it about?" name="topic" state={state} required defaultValue={defaultRetreatId ? "retreat" : "general"}>
          <option value="general">General question</option>
          <option value="retreat">A retreat</option>
          <option value="collaboration">Collaboration</option>
          <option value="press">Press</option>
        </Field>
        <Field label="Retreat" name="retreatId" state={state} defaultValue={defaultRetreatId ?? ""}>
          <option value="">Not about a specific retreat</option>
          {retreats.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
        </Field>
      </div>
      <Field label="Message" name="message" state={state} required textarea />
      <Status state={state} />
      <div>
        <button className="btn-primary" disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
      </div>
    </form>
  );
}

export function WaitlistForm({ retreatId, departures }: { retreatId: string; departures: { id: string; label: string }[] }) {
  const { state, action, pending, onSubmit } = useActionForm(joinWaitlist);
  if (state.ok) return <Status state={state} />;
  return (
    <form action={action} onSubmit={onSubmit} className="relative grid gap-4" noValidate>
      <Honeypot />
      <input type="hidden" name="retreatId" value={retreatId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" state={state} required autoComplete="name" />
        <Field label="Email" name="email" type="email" state={state} required autoComplete="email" />
      </div>
      {departures.length > 0 && (
        <Field label="Preferred dates" name="departureId" state={state}>
          <option value="">Any dates</option>
          {departures.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
        </Field>
      )}
      <Field label="Anything we should know?" name="note" state={state} textarea />
      <Status state={state} />
      <div>
        <button className="btn-outline" disabled={pending}>{pending ? "Joining…" : "Join the waitlist"}</button>
      </div>
    </form>
  );
}
