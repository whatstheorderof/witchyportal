import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-plum focus:px-5 focus:py-3 focus:text-ivory">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="min-h-[70vh]">{children}</main>
      <SiteFooter />
      <MobileTabBar />
    </>
  );
}
