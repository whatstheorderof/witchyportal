/** Questions and answers as an accessible disclosure list (pair with faqLd). */
export function Faqs({ items, title = "Questions people ask", id = "faq" }: { items: { question: string; answer: string }[]; title?: string; id?: string }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={id} className="card p-6 sm:p-8">
      <h2 id={id} className="font-display text-2xl text-plum sm:text-3xl">{title}</h2>
      <div className="mt-4 divide-y divide-line">
        {items.map((q) => (
          <details key={q.question} className="group py-3">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-1 font-medium text-plum [&::-webkit-details-marker]:hidden">
              {q.question}
              <span aria-hidden className="mt-0.5 text-plum-soft transition group-open:rotate-45">+</span>
            </summary>
            <div className="mt-2 grid gap-3 leading-relaxed text-ink/85">{paras(q.answer).map((p, i) => <p key={i}>{p}</p>)}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

export const paras = (t: string) => t.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);

export function Prose({ text, className = "" }: { text: string; className?: string }) {
  return <div className={`grid gap-3 leading-relaxed text-ink/85 ${className}`}>{paras(text).map((p, i) => <p key={i}>{p}</p>)}</div>;
}
