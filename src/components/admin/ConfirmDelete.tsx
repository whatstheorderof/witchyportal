"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

function Btn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button className="btn min-h-10 bg-danger px-4 text-sm text-white hover:bg-danger/90" disabled={pending}>{pending ? "Deleting…" : label}</button>;
}

export function ConfirmDelete({ action, fields, label = "Delete", what = "this item" }: { action: (fd: FormData) => Promise<void>; fields: Record<string, string>; label?: string; what?: string }) {
  const [armed, setArmed] = useState(false);
  if (!armed) {
    return <button type="button" onClick={() => setArmed(true)} className="btn min-h-10 border border-danger/40 px-4 text-sm text-danger hover:bg-danger/5">{label}</button>;
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-2" role="group" aria-label={`Confirm delete ${what}`}>
      {Object.entries(fields).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <span className="text-sm text-danger">Delete {what} permanently?</span>
      <Btn label="Yes, delete" />
      <button type="button" onClick={() => setArmed(false)} className="btn min-h-10 px-4 text-sm text-muted hover:bg-sand/60">Cancel</button>
    </form>
  );
}
