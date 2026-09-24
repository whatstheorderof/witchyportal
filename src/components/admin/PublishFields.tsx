"use client";

import { useId, useState } from "react";
import { useFormErrors } from "./AdminForm";

const LABELS = {
  draft: "Draft — only visible in admin",
  scheduled: "Scheduled — goes live at the date below",
  published: "Published — live on the site",
  archived: "Archived — hidden from the site",
};

export function PublishFields({ status, publishAt, tz }: { status: keyof typeof LABELS; publishAt: string; tz: string }) {
  const [value, setValue] = useState(status);
  const id = useId();
  const err = useFormErrors().errors?.status;
  return (
    <fieldset className="grid gap-4 rounded-2xl bg-lavender/25 p-4 ring-1 ring-lavender sm:grid-cols-2">
      <legend className="sr-only">Publishing</legend>
      <div>
        <label htmlFor={`${id}-s`} className="field-label">Status</label>
        <select id={`${id}-s`} name="status" className="input" value={value} onChange={(e) => setValue(e.target.value as keyof typeof LABELS)} aria-invalid={err ? true : undefined}>
          {Object.entries(LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-d`} className="field-label">{value === "scheduled" ? "Publish at" : "Publish date"}{value === "scheduled" && <span className="text-blush-deep"> *</span>}</label>
        <input id={`${id}-d`} type="datetime-local" name="publishAt" defaultValue={publishAt} className="input" />
        <p className="field-hint">{value === "scheduled" ? `Becomes visible automatically at this time (${tz}).` : `Shown as the post date. Leave empty to use “now” when publishing (${tz}).`}</p>
      </div>
      {err && <p className="field-error sm:col-span-2">{err}</p>}
    </fieldset>
  );
}
