import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { COMPANY_ORDER, getCaseStudies, type Locale } from '@/lib/case-studies'
import { WorkCard } from '@/components/work/WorkCard'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'work' })
  return {
    title: t('title'),
    description: 'Case studies demonstrating frontend engineering results.',
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'work' })
  const caseStudies = getCaseStudies(locale)
  const published = caseStudies.filter((c) => !c.draft)
  const drafts = caseStudies.filter((c) => c.draft)

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>
      {published.length > 0 && (
        <div className="space-y-12">
          {COMPANY_ORDER.map((company) => {
            const studies = published.filter((c) => c.company === company)
            if (studies.length === 0) return null
            return (
              <div key={company}>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 dark:text-gray-400">
                  {t(`groups.${company}`)}
                </h2>
                <div className="grid gap-6">
                  {studies.map((study) => (
                    <WorkCard key={study.slug} study={study} locale={locale} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {drafts.length > 0 && (
        <div className="mt-12">
          {published.length > 0 && (
            <h2 className="text-lg font-medium text-gray-400 mb-4 dark:text-gray-600">{t('comingSoon')}</h2>
          )}
          <div className="grid gap-6">
            {drafts.map((study) => (
              <WorkCard key={study.slug} study={study} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
