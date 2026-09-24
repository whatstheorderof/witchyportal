"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { initialFormState, type FormState } from "@/lib/forms";
import { useActionForm } from "@/lib/useActionForm";

const Ctx = createContext<FormState>(initialFormState);
export const useFormErrors = () => useContext(Ctx);

export function AdminForm({
  action, children, className = "grid gap-6", submitLabel = "Save", resetOnSuccess = false, sticky = false,
}: {
  action: (s: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode; className?: string; submitLabel?: string; resetOnSuccess?: boolean; sticky?: boolean;
}) {
  const { state, pending, action: formAction, onSubmit } = useActionForm(action);
  const ref = useRef<HTMLFormElement>(null);
  // Dirty relative to the latest server response: a new response clears it.
  const [dirtyFor, setDirtyFor] = useState<FormState | null>(null);
  const dirty = dirtyFor === state;
  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);
  return (
    <Ctx.Provider value={state}>
      <form ref={ref} action={formAction} onSubmit={onSubmit} className={className} onChange={() => setDirtyFor(state)} noValidate>
        {children}
        <div className={sticky ? "sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-4 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8" : "flex flex-wrap items-center gap-4"}>
          <Submit label={submitLabel} pending={pending} />
          <FormMessage state={state} />
          {dirty && !state.message && <span className="text-sm text-muted">Unsaved changes</span>}
        </div>
      </form>
    </Ctx.Provider>
  );
}

function Submit({ label, pending }: { label: string; pending: boolean }) {
  return <button className="btn-primary min-h-11" disabled={pending}>{pending ? "Saving…" : label}</button>;
}

function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return <span role="status" aria-live="polite" />;
  return (
    <span role={state.ok ? "status" : "alert"} className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}>
      {state.ok ? "✓ " : ""}{state.message}
    </span>
  );
}

type FieldProps = {
  label: string; name: string; defaultValue?: string | number | null; type?: string; hint?: React.ReactNode; textarea?: boolean;
  rows?: number; required?: boolean; placeholder?: string; className?: string; mono?: boolean; maxLength?: number; inputMode?: "decimal" | "text";
};

export function F({ label, name, defaultValue, type = "text", hint, textarea, rows = 4, required, placeholder, className = "", mono, maxLength, inputMode }: FieldProps) {
  const id = useId();
  const state = useFormErrors();
  const err = state.errors?.[name];
  const props = {
    id, name, required, placeholder, maxLength, inputMode,
    defaultValue: defaultValue ?? "",
    "aria-invalid": err ? true : undefined,
    "aria-describedby": [hint ? `${id}-h` : "", err ? `${id}-e` : ""].filter(Boolean).join(" ") || undefined,
    className: `input ${mono ? "font-mono text-sm" : ""}`,
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}{required && <span aria-hidden className="text-blush-deep"> *</span>}</label>
      {textarea ? <textarea {...props} rows={rows} /> : <input {...props} type={type} />}
      {hint && <p id={`${id}-h`} className="field-hint">{hint}</p>}
      {err && <p id={`${id}-e`} className="field-error">{err}</p>}
    </div>
  );
}

export function Select({ label, name, defaultValue, options, hint, className = "" }: { label: string; name: string; defaultValue?: string | null; options: { value: string; label: string }[]; hint?: string; className?: string }) {
  const id = useId();
  const err = useFormErrors().errors?.[name];
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}</label>
      <select id={id} name={name} defaultValue={defaultValue ?? ""} className="input" aria-invalid={err ? true : undefined}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint && <p className="field-hint">{hint}</p>}
      {err && <p className="field-error">{err}</p>}
    </div>
  );
}

export function Check({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 h-5 w-5 accent-plum" />
      <span><span className="text-[0.95rem]">{label}</span>{hint && <span className="block text-sm text-muted">{hint}</span>}</span>
    </label>
  );
}
