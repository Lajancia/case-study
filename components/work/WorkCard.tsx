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
 * kicker (industry, soft red) + audit tag | Geist 24 title | Inter 15 summary
 * | dual telemetry strips (before grey, after white, delta green)
 * | stack chips | footer: read link + SYS.STATUS tag.
 * Fixed-dark palette on purpose — the Work page is a telemetry-style dossier
 * section, independent of the site's light/dark theme. Drafts keep full
 * contrast (no dimming) and are marked by the chip + SYS.STATUS tag instead.
 */
export async function WorkCard({ study, locale, index }: WorkCardProps) {
  const t = await getTranslations({ locale, namespace: 'work' })
  const auditNo = String(index + 1).padStart(2, '0')

  return (
    <article className="relative border border-[#222734] bg-[#12151c] p-6 transition-colors duration-200 hover:border-[#d9383a]/40">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ffb3ae]">
          {study.industry}
        </div>
        <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-[#94a3b8]">
          {study.draft && (
            <span className="border border-[#d9383a]/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#ffb3ae]">
              {t('draft')}
            </span>
          )}
          <span className="tabular-nums">AUDIT #{auditNo}</span>
        </div>
      </div>

      <h2 className="mb-2 text-2xl font-semibold leading-snug text-[#f8f9fa]">
        {study.title}
      </h2>
      <p className="mb-4 text-[15px] leading-relaxed text-[#94a3b8]">
        {study.description}
      </p>

      {study.outcomes.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {study.outcomes.slice(0, 2).map((outcome) => (
            <div
              key={outcome.label}
              className="min-w-0 border border-[#222734] bg-[#181c26] px-3.5 py-2.5"
            >
              <div className="mb-1.5 truncate font-mono text-[11px] uppercase tracking-wider text-[#94a3b8]">
                {outcome.label}
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-xs text-[#94a3b8] line-through">
                  {outcome.before}
                </span>
                <span className="text-xl leading-none font-semibold text-[#f8f9fa]">
                  {outcome.after}
                </span>
                <span className="font-mono text-[11px] font-medium text-[#10b981]">
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
            className="border border-[#222734] bg-[#181c26] px-2 py-0.5 text-xs text-[#94a3b8]"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[#222734] pt-3">
        <Link
          href={`/work/${study.slug}`}
          className="font-mono text-xs font-medium tracking-wide text-[#ffb3ae] transition-colors hover:text-[#d9383a]"
        >
          {t('readCaseStudy')}
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8]">
          {study.draft ? 'SYS.STATUS: DRAFT' : 'SYS.STATUS: VERIFIED'}
        </span>
      </div>
    </article>
  )
}
