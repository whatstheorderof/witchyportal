import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Witchy Portal admin" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-ivory">{children}</div>;
}
