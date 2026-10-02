type P = { className?: string };
const base = (className = "h-6 w-6") => ({ className, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true });

export const HomeIcon = ({ className }: P) => (<svg {...base(className)}><path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1v-9.5Z" /></svg>);
export const WaveIcon = ({ className }: P) => (<svg {...base(className)}><path d="M2.5 15c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2 2-2 2-2" /><path d="M2.5 19.5c2.2 0 2.2-2 4.4-2s2.2 2 4.4 2 2.2-2 4.4-2 2.2 2 4.4 2" /><circle cx="15.5" cy="6.5" r="2.5" /></svg>);
export const SparkIcon = ({ className }: P) => (<svg {...base(className)}><path d="M12 3c.6 4.5 2.5 6.4 7 7-4.5.6-6.4 2.5-7 7-.6-4.5-2.5-6.4-7-7 4.5-.6 6.4-2.5 7-7Z" /><path d="M19 16.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5Z" /></svg>);
export const ChartIcon = ({ className }: P) => (<svg {...base(className)}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4" /><path d="M12 3.5v4.5M12 16v4.5M3.5 12H8M16 12h4.5M6 6l3.2 3.2M14.8 14.8 18 18M18 6l-3.2 3.2M9.2 14.8 6 18" /></svg>);
export const MenuIcon = ({ className }: P) => (<svg {...base(className)}><path d="M4 7h16M4 12h16M4 17h10" /></svg>);
export const CloseIcon = ({ className }: P) => (<svg {...base(className)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const ArrowRight = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><path d="M4 12h16m-6-6 6 6-6 6" /></svg>);
export const ArrowLeft = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><path d="M20 12H4m6-6-6 6 6 6" /></svg>);
export const PinIcon = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></svg>);
export const CalendarIcon = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>);
export const CheckIcon = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);
export const MinusIcon = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><path d="M6 12h12" /></svg>);
export const PlayIcon = ({ className }: P) => (<svg viewBox="0 0 24 24" className={className ?? "h-6 w-6"} aria-hidden="true"><path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.3-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" fill="currentColor" /></svg>);
export const LockIcon = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /></svg>);
export const ExternalIcon = ({ className }: P) => (<svg {...base(className ?? "h-4 w-4")}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>);
export const TvIcon = ({ className }: P) => (<svg {...base(className)}><rect x="3" y="6" width="18" height="12.5" rx="2.5" /><path d="m9 2.5 3 3.5 3-3.5M8 21h8" /><path d="m10.5 10 4 2.2-4 2.2v-4.4Z" fill="currentColor" stroke="none" /></svg>);
