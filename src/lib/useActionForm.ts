"use client";

import { startTransition, useActionState } from "react";
import { initialFormState, type FormState } from "./forms";

/**
 * Wraps a server action for a <form>. Unlike passing the action straight to
 * <form action>, this does not reset the fields after submission — so a
 * validation error never wipes what the person typed. The `action` is still
 * returned for no-JavaScript progressive enhancement.
 */
export function useActionForm(action: (s: FormState, fd: FormData) => Promise<FormState>) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
    startTransition(() => formAction(fd));
  };
  return { state, pending, action: formAction, onSubmit };
}
