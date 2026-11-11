"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/client";

type Q<V> = { q: string; options: { text: string; value: V }[] };

/** One question at a time: radio cards, Back / Next, progress, focus moves to each new question. */
function Steps<V>({ questions, onFinish, finishLabel }: { questions: Q<V>[]; onFinish: (answers: V[]) => void; finishLabel: string }) {
  const { t, rlang } = useI18n();
  const id = useId();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const legend = useRef<HTMLLegendElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (moved.current) legend.current?.focus();
    moved.current = true;
  }, [step]);

  const q = questions[step];
  const chosen = answers[step];
  const last = step === questions.length - 1;
  function next(e: React.FormEvent) {
    e.preventDefault();
    if (chosen === null) return;
    if (last) onFinish(answers.map((a, i) => questions[i].options[a!].value));
    else setStep(step + 1);
  }

  return (
    <form onSubmit={next} className="card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4 text-sm text-muted">
        <span>{t("Question {n} of {total}", { n: step + 1, total: questions.length })}</span>
        <span aria-hidden className="h-1.5 w-32 overflow-hidden rounded-full bg-line">
          <span className="block h-full rounded-full bg-plum transition-[width] motion-reduce:transition-none" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </span>
      </div>
      <fieldset className="mt-5">
        <legend ref={legend} tabIndex={-1} lang={rlang} className="font-display text-2xl text-plum outline-none sm:text-3xl">{q.q}</legend>
        <div className="mt-5 grid gap-3 sm:grid-cols-2" lang={rlang}>
          {q.options.map((o, i) => {
            const oid = `${id}-${step}-${i}`;
            return (
              <label key={oid} htmlFor={oid} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-plum ${chosen === i ? "border-plum bg-lavender/50" : "border-line hover:bg-ivory-deep"}`}>
                <input id={oid} type="radio" name={`${id}-${step}`} className="h-4 w-4 shrink-0 accent-plum" checked={chosen === i} onChange={() => setAnswers(answers.map((a, j) => (j === step ? i : a)))} />
                <span>{o.text}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {step > 0 && <button type="button" className="btn-outline" onClick={() => setStep(step - 1)}>{t("Back")}</button>}
        <button className="btn-primary" disabled={chosen === null} aria-disabled={chosen === null}>{last ? finishLabel : t("Next")}</button>
      </div>
    </form>
  );
}

/** "Which witch are you?" — the most chosen type wins; a tie goes to the type picked latest. Opens the result page. */
export function WitchQuiz<T extends string>({ questions }: { questions: Q<T>[] }) {
  const { t, href } = useI18n();
  const router = useRouter();
  const [going, setGoing] = useState(false);
  function finish(answers: T[]) {
    const score = new Map<T, number>();
    answers.forEach((a, i) => score.set(a, (score.get(a) ?? 0) + 1 + i / 100));
    const best = [...score.entries()].sort((a, b) => b[1] - a[1])[0][0];
    setGoing(true);
    router.push(href(`/quizzes/which-witch/${best}?r=1`));
  }
  return (
    <div aria-busy={going}>
      <Steps questions={questions} onFinish={finish} finishLabel={t("See my result")} />
      {going && <p role="status" className="mt-3 text-sm text-muted">{t("Finding your witch…")}</p>}
    </div>
  );
}

/** "Is Feral Goddess Rising for me?" — adds up the answers and shows the result with the waitlist (children). */
export function RetreatQuiz({ questions, results, children }: { questions: Q<number>[]; results: Record<"ready" | "calling" | "notyet", { title: string; text: string }>; children: React.ReactNode }) {
  const { t, rlang } = useI18n();
  const [result, setResult] = useState<keyof typeof results | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (result) heading.current?.focus(); }, [result]);
  if (!result) {
    return <Steps questions={questions} finishLabel={t("See my result")} onFinish={(a) => { const s = a.reduce((x, y) => x + y, 0); setResult(s >= 10 ? "ready" : s >= 6 ? "calling" : "notyet"); }} />;
  }
  const r = results[result];
  return (
    <div className="grid gap-6">
      <div className="rounded-[2rem] bg-plum-deep p-6 text-ivory sm:p-10">
        <p className="eyebrow text-blush">{t("Your result")}</p>
        <h2 ref={heading} tabIndex={-1} lang={rlang} className="mt-2 font-display text-4xl text-ivory outline-none">{r.title}</h2>
        <div lang={rlang} className="mt-4 grid max-w-2xl gap-3 text-ivory/85">{r.text.split("\n\n").map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
        <button type="button" className="mt-5 text-sm text-ivory/80 underline underline-offset-4 hover:text-ivory" onClick={() => setResult(null)}>{t("Take the quiz again")}</button>
      </div>
      {children}
    </div>
  );
}
