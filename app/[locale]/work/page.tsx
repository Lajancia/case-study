import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  CAPABILITY_ORDER,
  COMPANY_ORDER,
  getCapabilityCounts,
  getCaseStudies,
  getCaseStudiesByCapability,
  isCapability,
  type Locale,
} from '@/lib/case-studies'
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
  searchParams,
}: {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'work' })

  // `?do=` picks a capability. Reading it here rather than filtering on the
  // client keeps every view a shareable, crawlable URL that works without JS —
  // the hire page links straight into these.
  const requested = (await searchParams).do
  const active = isCapability(requested) ? requested : null

  const counts = getCapabilityCounts(locale)
  const caseStudies = getCaseStudies(locale)
  const published = caseStudies.filter((c) => !c.draft)
  const drafts = caseStudies.filter((c) => c.draft)
  const filtered = active ? getCaseStudiesByCapability(locale, active) : null

  const chipBase =
    'rounded-full border px-3 py-1.5 text-sm transition-colors whitespace-nowrap'
  const chipOn =
    'border-[#00224D] bg-[#00224D] text-[#F5EBDD] dark:border-[#FF204E] dark:bg-[#FF204E] dark:text-white font-medium'
  const chipOff =
    'border-gray-300 text-gray-600 hover:border-[#00224D] hover:text-[#00224D] dark:border-gray-700 dark:text-gray-400 dark:hover:border-[#FF204E] dark:hover:text-[#FF204E]'

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <nav aria-label={t('filterAria')} className="mb-10 flex flex-wrap gap-2">
        <Link
          href="/work"
          aria-current={active ? undefined : 'page'}
          className={`${chipBase} ${active ? chipOff : chipOn}`}
        >
          {t('capabilities.all')}
        </Link>
        {CAPABILITY_ORDER.filter((capability) => counts[capability] > 0).map(
          (capability) => (
            <Link
              key={capability}
              href={{ pathname: '/work', query: { do: capability } }}
              aria-current={active === capability ? 'page' : undefined}
              className={`${chipBase} ${active === capability ? chipOn : chipOff}`}
            >
              {t(`capabilities.${capability}`)}{' '}
              <span className="tabular-nums opacity-60">
                {counts[capability]}
              </span>
            </Link>
          ),
        )}
      </nav>

      {filtered ? (
        <div>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {t('resultCount', { count: filtered.length })}
          </p>
          <div className="grid gap-6">
            {filtered.map((study) => (
              <WorkCard key={study.slug} study={study} locale={locale} />
            ))}
          </div>
          <Link
            href="/work"
            className="mt-8 inline-block text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            {t('clearFilter')}
          </Link>
        </div>
      ) : (
        <>
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
                        <WorkCard
                          key={study.slug}
                          study={study}
                          locale={locale}
                        />
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
                <h2 className="text-lg font-medium text-gray-400 mb-4 dark:text-gray-600">
                  {t('comingSoon')}
                </h2>
              )}
              <div className="grid gap-6">
                {drafts.map((study) => (
                  <WorkCard key={study.slug} study={study} locale={locale} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
