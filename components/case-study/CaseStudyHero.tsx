import { getTranslations } from 'next-intl/server'
import type { CaseStudyMeta, Locale } from '@/lib/case-studies'

interface CaseStudyHeroProps {
  study: CaseStudyMeta
  locale: Locale
}

export async function CaseStudyHero({ study, locale }: CaseStudyHeroProps) {
  const t = await getTranslations({ locale, namespace: 'caseStudyHero' })
  return (
    <section className="border-b border-gray-200 pb-8 mb-8 dark:border-gray-800">
      <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-3 dark:text-blue-400">{study.industry}</div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">{study.title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-0.5 dark:text-gray-500">{t('role')}</div>
          <div className="text-sm font-medium">{study.role}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5 dark:text-gray-500">{t('timeline')}</div>
          <div className="text-sm font-medium">{study.timeline}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5 dark:text-gray-500">{t('stack')}</div>
          <div className="flex flex-wrap gap-1">
            {study.stack.map((tech) => (
              <span key={tech} className="text-xs bg-[#00224D] text-[#F5EBDD] dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded font-medium">{tech}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5 dark:text-gray-500">{t('disclosure')}</div>
          {study.disclosure.href ? (
            <a
              href={study.disclosure.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
            >
              {study.disclosure.label} →
            </a>
          ) : (
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{study.disclosure.label}</div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-lg bg-gray-50 p-6 dark:bg-gray-900">
        {study.outcomes.map((outcome) => (
          <div key={outcome.label} className="min-w-0">
            <div className="text-sm text-gray-500 mb-1 dark:text-gray-500">{outcome.label}</div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-gray-400 line-through text-lg dark:text-gray-600">{outcome.before}</span>
              <span className="text-2xl font-bold text-green-700 dark:text-green-400">{outcome.after}</span>
              <span className="text-green-600 font-semibold dark:text-green-500">{outcome.change}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
