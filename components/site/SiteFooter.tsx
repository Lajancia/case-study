import { getTranslations } from "next-intl/server";
import { siteConfig, mailtoUrl } from "@/lib/site";
import type { Locale } from "@/lib/case-studies";

export async function SiteFooter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      {/* Extra room at the bottom on narrow screens: the contact button floats
          over this corner, and without it the last link sits underneath. */}
      <div className="mx-auto max-w-4xl px-6 pt-8 pb-24 sm:pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500">
        <p>
          © {year} {siteConfig.name}. {t("rights")}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={mailtoUrl("Hello from your case study site")}
            className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
          >
            {t("email")}
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
          >
            {t("linkedin")}
          </a>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
          >
            {t("github")}
          </a>
          <a
            href={siteConfig.social.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
          >
            {t("medium")}
          </a>
          <a
            href={siteConfig.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
          >
            {t("portfolio")}
          </a>
        </div>
      </div>
    </footer>
  );
}
