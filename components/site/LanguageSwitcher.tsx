'use client'

import { useLocale } from 'next-intl'
import { usePathname } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const LABELS: Record<string, string> = {
  en: 'EN',
  ko: 'KO',
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={`px-1.5 py-1 rounded transition-colors ${
            loc === locale
              ? 'text-gray-900 dark:text-gray-700'
              : 'text-gray-500 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-500'
          }`}
        >
          {LABELS[loc] ?? loc.toUpperCase()}
        </Link>
      ))}
    </div>
  )
}
