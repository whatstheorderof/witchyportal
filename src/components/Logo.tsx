export function MoonMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <path d="M20.3 5.2a11.4 11.4 0 1 0 6 20.9A9.6 9.6 0 0 1 20.3 5.2Z" fill="currentColor" />
      <circle cx="23.6" cy="9.4" r="1.2" fill="currentColor" opacity=".55" />
      <circle cx="26.3" cy="14.8" r=".8" fill="currentColor" opacity=".55" />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-2 ${light ? "text-ivory" : "text-plum"}`}>
      <MoonMark className="h-6 w-6 sm:h-7 sm:w-7" />
      <span className="font-display text-[1.45rem] leading-none tracking-tight sm:text-[1.65rem]">
        Witchy <em className="font-normal">Portal</em>
      </span>
    </span>
  );
}
