import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig, mailtoUrl } from "@/lib/site";
import type { Locale } from "@/lib/case-studies";

export async function CaseStudyCTA({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "caseStudyCta" });
  return (
    <section className="rounded-lg bg-blue-50 p-8 text-center mt-12 dark:bg-blue-950/40">
      <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
      <p className="text-gray-600 mb-6 max-w-lg mx-auto dark:text-gray-400">
        {t("body")}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* No booking link configured yet: show nothing rather than a
            disabled "coming soon" button, which reads as unfinished. */}
        {siteConfig.calendlyUrl && (
          <a
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center w-full sm:w-auto justify-center bg-blue-600 px-6 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:text-[#f8f9fa] dark:hover:bg-[#991b1b]"
          >
            {t("bookACall")}
          </a>
        )}
        <a
          href={mailtoUrl("Frontend performance audit inquiry")}
          className="inline-flex items-center w-full sm:w-auto justify-center bg-blue-600 px-6 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:text-[#f8f9fa] dark:hover:bg-[#991b1b]"
        >
          {t("emailSoomin")}
        </a>
        {/* Secondary to the email CTA: a way back into the list for someone
            who wants to keep reading rather than get in touch. Outlined
            against the filled email button so the two don't read alike.
            If `calendlyUrl` is ever set, "Book a call" becomes a second
            filled button — revisit which one stays solid at that point. */}
        <Link
          href="/work"
          className="inline-flex items-center w-full sm:w-auto justify-center border border-blue-600 px-6 py-2.5 font-mono text-sm font-medium tracking-wider text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-[#ffb3ae] dark:hover:bg-blue-950/60"
        >
          {t("viewProjects")}
        </Link>
      </div>
    </section>
  );
}
