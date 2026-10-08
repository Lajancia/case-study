import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getHighlights, type Locale } from "@/lib/case-studies";

/**
 * KPI row of headline results, derived from case-study outcomes so the numbers
 * here and in the case studies can never drift apart. Used on the home page and
 * on /hire.
 */
export async function ResultsAtAGlance({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const highlights = getHighlights(locale);

  if (highlights.length === 0) return null;

  return (
    <section className="mb-16">
      <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-[#ffb3ae] flex items-center gap-2 mb-4">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
        {t("resultsAtAGlance")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
        {highlights.map((highlight) => (
          <Link
            key={`${highlight.slug}-${highlight.label}`}
            href={`/work/${highlight.slug}`}
            className="group bg-gray-50 p-5 transition-colors hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900"
          >
            <div className="text-xs text-gray-600 mb-2 dark:text-gray-500">
              {highlight.label}
            </div>
            {/* Kept at one type step so the four tiles stay on a single line in
                both the wide (home) and narrow (/hire) containers. */}
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 text-base font-semibold tracking-tight">
              <span className="text-gray-600 dark:text-gray-500">
                {highlight.before}
              </span>
              <span className="text-gray-300 dark:text-gray-700">→</span>
              <span className="text-green-700 dark:text-green-400">
                {highlight.after}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
