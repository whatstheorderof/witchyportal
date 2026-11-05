import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileTabBar } from "@/components/MobileTabBar";
import { DailySplash } from "@/components/stars/DailySplash";
import { LocaleProvider } from "@/i18n/client";
import { getBarePath, getI18n, uiDict } from "@/i18n/server";
import { isTranslatedPath } from "@/i18n/config";
import { LanguageSuggest } from "@/components/i18n/LanguageSuggest";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getI18n();
  const path = await getBarePath();
  const untranslated = locale !== "en" && !isTranslatedPath(path);
  return (
    <LocaleProvider locale={locale} dict={uiDict(locale)}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-plum focus:px-5 focus:py-3 focus:text-ivory">
        {t("Skip to content")}
      </a>
      <SiteHeader />
      <main id="main" className="min-h-[70vh]">
        {untranslated && (
          <p className="fixed inset-x-0 top-16 z-30 bg-lavender/95 px-4 py-2 text-center text-sm text-plum backdrop-blur lg:top-20 print:hidden">
            {t("This page isn't translated yet, so its content is in English.")} <a href={`${path}?lang=en`} lang="en" className="underline">{t("Open the English page")}</a>
          </p>
        )}
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar />
      <DailySplash />
      <LanguageSuggest />
    </LocaleProvider>
  );
}
