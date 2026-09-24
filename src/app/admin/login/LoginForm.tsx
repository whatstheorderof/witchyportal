"use client";

import { login } from "../actions";
import { useActionForm } from "@/lib/useActionForm";

export function LoginForm({ next }: { next: string }) {
  const { state, action, pending, onSubmit } = useActionForm(login);
  return (
    <form action={action} onSubmit={onSubmit} className="mt-6 grid gap-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="input" defaultValue={state.values?.email} />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="input" />
      </div>
      {state.message && <p role="alert" className="text-sm text-danger">{state.message}</p>}
      <button className="btn-primary" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
