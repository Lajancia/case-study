import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { CaseStudyMeta, Locale } from '@/lib/case-studies'

interface WorkCardProps {
  study: CaseStudyMeta
  locale: Locale
  /** Zero-based position in the visible (possibly filtered) list, for the AUDIT #NN tag. */
  index: number
}

/**
 * Figma "Case study - Desktop" card anatomy:
 * kicker (industry, soft red) + audit tag | title | summary
 * | dual telemetry strips (before struck, after strong, delta green)
 * | stack chips | footer: read link + SYS.STATUS tag.
 * Theme-responsive via tokens: light = Figma light variant, dark = the
 * telemetry dossier. Drafts keep full contrast (no dimming) and are marked
 * by the chip + SYS.STATUS tag instead.
 */
export async function WorkCard({ study, locale, index }: WorkCardProps) {
  const t = await getTranslations({ locale, namespace: 'work' })
  const auditNo = String(index + 1).padStart(2, '0')

  return (
    <article className="relative border border-gray-200 bg-gray-50 p-6 transition-colors duration-200 hover:border-blue-400 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#d9383a]/40">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-600 dark:text-[#ffb3ae]">
          {study.industry}
        </div>
        <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-gray-500 dark:text-gray-500">
          {study.draft && (
            <span className="border border-blue-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-700 dark:border-[#d9383a]/50 dark:text-[#ffb3ae]">
              {t('draft')}
            </span>
          )}
          <span className="tabular-nums">AUDIT #{auditNo}</span>
        </div>
      </div>

      <h2 className="mb-2 text-2xl font-semibold leading-snug text-gray-900 dark:text-[#f8f9fa]">
        {study.title}
      </h2>
      <p className="mb-4 text-[15px] leading-relaxed text-gray-600 dark:text-[#94a3b8]">
        {study.description}
      </p>

      {study.outcomes.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {study.outcomes.slice(0, 2).map((outcome) => (
            <div
              key={outcome.label}
              className="min-w-0 border border-gray-200 bg-gray-100 px-3.5 py-2.5 dark:border-gray-800 dark:bg-gray-800"
            >
              <div className="mb-1.5 truncate font-mono text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-500">
                {outcome.label}
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs text-gray-600 line-through dark:text-gray-500">
                  {outcome.before}
                </span>
                <span className="text-xl leading-none font-semibold text-gray-900 dark:text-[#f8f9fa]">
                  {outcome.after}
                </span>
                <span className="font-mono text-[11px] font-medium text-green-700 dark:text-green-400">
                  {outcome.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-1.5">
        {study.stack.map((tech) => (
          <span
            key={tech}
            className="border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-gray-800">
        <Link
          href={`/work/${study.slug}`}
          className="font-mono text-xs font-medium tracking-wide text-blue-600 transition-colors hover:text-blue-700 dark:text-[#ffb3ae] dark:hover:text-[#d9383a]"
        >
          {t('readCaseStudy')}
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
          {study.draft ? 'SYS.STATUS: DRAFT' : 'SYS.STATUS: VERIFIED'}
        </span>
      </div>
    </article>
  )
}
