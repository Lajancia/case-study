import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactFab } from "@/components/site/ContactFab";
import { HtmlLangSync } from "@/components/site/HtmlLangSync";
import { siteConfig } from "@/lib/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: {
      template: `%s — ${siteConfig.name}`,
      default: `${siteConfig.name} — ${t("titleSuffix")}`,
    },
    description: t("tagline"),
    metadataBase: new URL(siteConfig.url),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangSync locale={locale} />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader locale={locale} />
      {/* Children are flex items in a column: without a definite width they
          take their cross size from content, so one wide code block or chart
          stretches the whole page past the viewport on mobile. */}
      <main id="main-content" className="flex flex-1 flex-col [&>*]:w-full">
        {children}
      </main>
      <SiteFooter locale={locale} />
      <ContactFab locale={locale} />
    </NextIntlClientProvider>
  );
}
