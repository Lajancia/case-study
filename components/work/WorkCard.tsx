import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { CaseStudyMeta, Locale } from '@/lib/case-studies'

interface WorkCardProps {
  study: CaseStudyMeta
  locale: Locale
}

export async function WorkCard({ study, locale }: WorkCardProps) {
  const t = await getTranslations({ locale, namespace: 'work' })
  return (
    <article className={`border rounded-lg p-6 transition-all duration-200 ${
      study.draft
        ? 'border-gray-200 bg-gray-50 opacity-60 grayscale-[40%] dark:border-gray-800 dark:bg-gray-900/50'
        : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 dark:border-gray-800 dark:hover:border-blue-500'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className={`text-xs font-medium uppercase tracking-wider ${study.draft ? 'text-gray-400 dark:text-gray-600' : 'text-indigo-600 dark:text-indigo-400'}`}>{study.industry}</div>
        {study.draft && (
          <span className="shrink-0 text-xs font-semibold text-gray-500 bg-gray-200 border border-gray-300 rounded-full px-2.5 py-0.5 leading-none dark:text-gray-400 dark:bg-gray-800 dark:border-gray-700">
            {t('draft')}
          </span>
        )}
      </div>
      <h2 className={`text-xl font-semibold mb-2 leading-snug ${study.draft ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>{study.title}</h2>
      <p className={`text-sm mb-4 line-clamp-2 ${study.draft ? 'text-gray-400 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>{study.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {study.outcomes.slice(0, 2).map((outcome) => (
          <div key={outcome.label} className="min-w-0">
            <div className="text-xs text-gray-500 mb-0.5 dark:text-gray-500">{outcome.label}</div>
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-gray-400 line-through text-sm dark:text-gray-600">{outcome.before}</span>
              <span className={`font-semibold ${study.draft ? 'text-gray-400 dark:text-gray-600' : 'text-green-700 dark:text-green-400'}`}>{outcome.after}</span>
              <span className={`text-xs font-medium ${study.draft ? 'text-gray-400 dark:text-gray-600' : 'text-green-600 dark:text-green-500'}`}>{outcome.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {study.stack.map((tech) => (
          <span key={tech} className="text-xs bg-[#00224D] text-[#F5EBDD] dark:bg-gray-800 dark:text-gray-400 px-2 py-0.5 rounded font-medium">{tech}</span>
        ))}
      </div>
      <Link
        href={`/work/${study.slug}`}
        className={`text-sm font-medium transition-colors ${
          study.draft ? 'text-gray-400 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-500' : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
        }`}
      >
        {t('readCaseStudy')}
      </Link>
    </article>
  )
}