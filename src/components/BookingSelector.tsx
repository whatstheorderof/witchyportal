"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { AVAILABILITY_LABEL } from "./Availability";
import { track } from "./Track";
import { ArrowRight, CalendarIcon, CheckIcon } from "./Icons";

export interface SelectorOption {
  id: string;
  label: string;
  description: string;
  paymentType: "deposit" | "full";
  amountLabel: string;
  totalLabel: string | null;
  remainingLabel: string | null;
  balanceNote: string | null;
  availability: keyof typeof AVAILABILITY_LABEL;
  bookable: boolean;
}

export interface SelectorDeparture {
  id: string;
  dateLabel: string;
  nightsLabel: string;
  availability: keyof typeof AVAILABILITY_LABEL;
  availabilityNote: string | null;
  bookable: boolean;
  options: SelectorOption[];
}

export function BookingSelector({ slug, departures }: { slug: string; departures: SelectorDeparture[] }) {
  const firstBookable = departures.find((d) => d.bookable) ?? departures[0];
  const [depId, setDepId] = useState(firstBookable?.id ?? "");
  const dep = departures.find((d) => d.id === depId);
  const bookableOptions = useMemo(() => dep?.options.filter((o) => o.bookable) ?? [], [dep]);
  const [optId, setOptId] = useState(bookableOptions[0]?.id ?? "");
  const option = dep?.options.find((o) => o.id === optId && o.bookable);
  const gid = useId();

  function chooseDeparture(id: string) {
    setDepId(id);
    const d = departures.find((x) => x.id === id);
    setOptId(d?.options.find((o) => o.bookable)?.id ?? "");
  }

  return (
    <div className="grid gap-8">
      <fieldset>
        <legend className="mb-3 flex items-baseline gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-plum text-sm text-ivory">1</span>
          <span className="font-display text-2xl text-plum">Choose your dates</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {departures.map((d) => (
            <label
              key={d.id}
              className={`relative flex min-h-20 cursor-pointer flex-col justify-center rounded-2xl border bg-white/70 px-4 py-3 transition has-[:checked]:border-plum has-[:checked]:bg-white has-[:checked]:shadow-(--shadow-soft) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lavender-deep ${
                d.bookable ? "border-line hover:border-plum/40" : "border-line/70 bg-ivory-deep/60"
              }`}
            >
              <input type="radio" name={`${gid}-dep`} value={d.id} checked={depId === d.id} onChange={() => chooseDeparture(d.id)} className="sr-only" />
              <span className="flex items-center gap-2 font-medium text-ink"><CalendarIcon />{d.dateLabel}</span>
              <span className="mt-1 text-sm text-muted">{d.nightsLabel} · {d.availabilityNote || AVAILABILITY_LABEL[d.availability]}</span>
              {depId === d.id && <CheckIcon className="absolute right-4 top-4 h-5 w-5 text-plum" />}
            </label>
          ))}
        </div>
      </fieldset>

      {dep && (
        <fieldset>
          <legend className="mb-3 flex items-baseline gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-plum text-sm text-ivory">2</span>
            <span className="font-display text-2xl text-plum">Choose your option</span>
          </legend>
          {!dep.bookable ? (
            <p className="rounded-2xl bg-lavender/40 px-4 py-4 text-ink">
              {dep.availability === "waitlist" || dep.availability === "sold_out"
                ? "These dates are full. Join the waitlist below and we'll let you know if a place opens up."
                : "Bookings are closed for these dates."}
            </p>
          ) : dep.options.length === 0 ? (
            <p className="rounded-2xl bg-sand/60 px-4 py-4">Booking options for these dates are being finalised. Please get in touch to reserve interest.</p>
          ) : (
            <div className="grid gap-3">
              {dep.options.map((o) => (
                <label
                  key={o.id}
                  className={`relative flex cursor-pointer flex-col gap-1 rounded-2xl border bg-white/70 px-4 py-4 pr-12 transition has-[:checked]:border-plum has-[:checked]:bg-white has-[:checked]:shadow-(--shadow-soft) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lavender-deep ${
                    o.bookable ? "border-line hover:border-plum/40" : "cursor-not-allowed border-line/60 opacity-60"
                  }`}
                >
                  <input type="radio" name={`${gid}-opt`} value={o.id} disabled={!o.bookable} checked={optId === o.id} onChange={() => { setOptId(o.id); track("option_select", { option: o.label }); }} className="sr-only" />
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-medium text-ink">{o.label}</span>
                    <span className="font-display text-2xl text-plum">{o.amountLabel}</span>
                  </span>
                  <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
                    <dt className="text-muted">{o.paymentType === "deposit" ? "Deposit today" : "Pay today"}</dt>
                    <dd className="font-medium text-ink">{o.amountLabel}{o.paymentType === "full" ? " — paid in full" : ""}</dd>
                    {o.totalLabel && <><dt className="text-muted">Total price</dt><dd className="text-ink">{o.totalLabel}</dd></>}
                    {o.remainingLabel && <><dt className="text-muted">Remaining</dt><dd className="text-ink">{o.remainingLabel}{o.balanceNote ? ` · ${o.balanceNote}` : ""}</dd></>}
                    {!o.remainingLabel && o.balanceNote && <><dt className="text-muted">When</dt><dd className="text-ink">{o.balanceNote}</dd></>}
                  </dl>
                  {(!o.bookable || o.availability === "limited") && (
                    <span className="text-sm text-muted">{!o.bookable ? AVAILABILITY_LABEL[o.availability] : "Few places left"}</span>
                  )}
                  {o.description && <span className="text-sm text-ink/75">{o.description}</span>}
                  {optId === o.id && <CheckIcon className="absolute right-4 top-4 h-5 w-5 text-plum" />}
                </label>
              ))}
            </div>
          )}
        </fieldset>
      )}

      <div className="rounded-2xl bg-plum-deep p-5 text-ivory sm:p-6" aria-live="polite">
        <p className="text-[0.7rem] uppercase tracking-[0.22em] text-blush">Your selection</p>
        {option && dep ? (
          <>
            <p className="mt-2 font-display text-2xl">{dep.dateLabel}</p>
            <p className="text-ivory/80">{option.label}</p>
            <p className="mt-3 text-ivory/90">
              {option.paymentType === "deposit" ? "Deposit today: " : "Pay in full today: "}
              <strong className="font-display text-3xl font-medium">{option.amountLabel}</strong>
            </p>
            {option.totalLabel && option.paymentType === "deposit" && (
              <p className="text-sm text-ivory/75">Total {option.totalLabel}{option.remainingLabel ? ` · ${option.remainingLabel} remaining` : ""}{option.balanceNote ? ` · ${option.balanceNote}` : ""}</p>
            )}
            <Link href={`/retreats/${slug}/book?option=${option.id}`} className="btn-light mt-5 w-full sm:w-auto">
              Review &amp; continue <ArrowRight />
            </Link>
            <p className="mt-3 text-xs text-ivory/60">You&rsquo;ll see a full summary before going to the secure payment page.</p>
          </>
        ) : (
          <p className="mt-2 text-ivory/80">Choose available dates and an option to continue.</p>
        )}
      </div>
    </div>
  );
}
