export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export const initialFormState: FormState = { ok: false, message: "" };

export function fieldErrors(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}
