import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ThemeInit } from '@/components/site/ThemeInit'

export default async function LocaleNotFound() {
  const t = await getTranslations('notFound')

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <ThemeInit />
      <div className="w-full max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{t('description')}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
          >
            {t('backHome')}
          </Link>
          <Link
            href="/work"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            {t('viewWork')}
          </Link>
        </div>
      </div>
    </div>
  )
}
