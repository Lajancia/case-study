import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig, mailtoUrl } from "@/lib/site";
import { getCaseStudies, type Locale } from "@/lib/case-studies";
import { ResultsAtAGlance } from "@/components/site/ResultsAtAGlance";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const featuredStudies = getCaseStudies(locale).slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          {tSite("tagline")}
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-6 dark:text-gray-400">
          {t("heroSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Link
            href="/work"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors w-full max-w-64 sm:w-auto sm:max-w-none dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t("viewCaseStudy")}
          </Link>
          {siteConfig.calendlyUrl ? (
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-8 py-2.5 text-gray-700 font-medium hover:border-gray-400 transition-colors w-full max-w-64 sm:w-auto sm:max-w-none dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500"
            >
              {t("bookACall")}
            </a>
          ) : (
            <a
              href={mailtoUrl("Hello from your case study site")}
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-8 py-2.5 text-gray-700 font-medium hover:border-gray-400 transition-colors w-full max-w-64 sm:w-auto sm:max-w-none dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500"
            >
              {t("emailSoomin")}
            </a>
          )}
        </div>
      </section>

      {/* Results at a glance — KPI row */}
      <ResultsAtAGlance locale={locale} />

      {/* Featured results */}
      {featuredStudies.length > 0 && (
        <section className="mb-16">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 dark:text-gray-500">
            {t("selectedWork")}
          </h2>
          <div className="space-y-6">
            {featuredStudies.map((study) => (
              <div
                key={study.slug}
                className="border border-gray-200 rounded-lg p-6 sm:p-8 hover:border-gray-300 transition-colors dark:border-gray-800 dark:hover:border-gray-700"
              >
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2 dark:text-blue-400">
                  {study.industry}
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                  {study.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
                  {study.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  {study.outcomes.slice(0, 2).map((outcome) => (
                    <div key={outcome.label} className="min-w-0">
                      <div className="text-sm text-gray-500 mb-0.5 dark:text-gray-500">
                        {outcome.label}
                      </div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-gray-400 line-through dark:text-gray-600">
                          {outcome.before}
                        </span>
                        <span className="text-xl font-bold text-green-700 dark:text-green-400">
                          {outcome.after}
                        </span>
                        <span className="text-green-600 font-semibold dark:text-green-500">
                          {outcome.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/work/${study.slug}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t("readFullCaseStudy")}
                </Link>
              </div>
            ))}
          </div>
          <Link
            href="/work"
            className="block text-center mt-6 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:text-gray-100"
          >
            {t("seeAllCaseStudies")}
          </Link>
        </section>
      )}

      {/* Engagement types */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">{t("howWeWorkTitle")}</h2>
        <p className="text-sm text-gray-500 mb-6 dark:text-gray-500">
          {t("howWeWorkSubtitle")}
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-800">
            <h3 className="font-semibold mb-2">{t("frontendTitle")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("frontendBody")}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-800">
            <h3 className="font-semibold mb-2">{t("devopsTitle")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("devopsBody")}
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 dark:border-gray-800">
            <h3 className="font-semibold mb-2">{t("agenticTitle")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("agenticBody")}
            </p>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">{t("expertiseTitle")}</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            "React",
            "Next.js",
            "TypeScript",
            "Scientific visualization",
            "Playwright",
            "Cypress",
            "Jenkins",
            "Docker",
            "DevSecOps",
            "Performance optimization",
          ].map((item) => (
            <span
              key={item}
              className="text-sm bg-[#00224D] text-[#F5EBDD] dark:bg-gray-800 dark:text-gray-300 px-3 py-1 rounded-full font-medium"
            >
              {item}
            </span>
          ))}
        </div>
        <Link
          href="/about"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t("fullBackground")}
        </Link>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-3">{t("letsWorkTitle")}</h2>
        <p className="text-gray-600 mb-6 dark:text-gray-400">
          {t("letsWorkSubtitle")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/work"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors w-full max-w-64 sm:w-auto sm:max-w-none dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t("viewCaseStudy")}
          </Link>
          <a
            href={mailtoUrl("Let's work together")}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-8 py-2.5 text-gray-700 font-medium hover:border-gray-400 transition-colors w-full max-w-64 sm:w-auto sm:max-w-none dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500"
          >
            {t("emailSoomin")}
          </a>
        </div>
      </section>
    </div>
  );
}
