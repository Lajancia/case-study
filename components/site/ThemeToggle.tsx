'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useHydrated } from '@/lib/use-hydrated'

export function ThemeToggle() {
  const t = useTranslations('theme')
  const { resolvedTheme, setTheme } = useTheme()

  // next-themes reads localStorage during its first client render, so its
  // answer can differ from the server's before hydration finishes. Waiting for
  // hydration keeps the two renders identical and lets the real value arrive
  // afterwards — the button carries an accessible name throughout either way.
  const hydrated = useHydrated()
  const isDark = hydrated && resolvedTheme === 'dark'

  function toggle() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t('switchToLight') : t('switchToDark')}
      className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm9 4a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm13.66 6.66a1 1 0 0 1-1.41 0l-.71-.71a1 1 0 1 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41ZM7.46 6.46a1 1 0 0 1-1.41 0l-.71-.71A1 1 0 1 1 6.75 4.34l.71.71a1 1 0 0 1 0 1.41Zm11.2-2.12a1 1 0 0 1 0 1.41l-.71.71a1 1 0 1 1-1.41-1.41l.71-.71a1 1 0 0 1 1.41 0ZM6.75 19.66a1 1 0 0 1-1.41 0l.71-.71A1 1 0 1 1 6.46 17.54l-.71.71a1 1 0 0 1 0 1.41ZM12 20a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M20.354 15.354A9 9 0 0 1 8.646 3.646a9.003 9.003 0 1 0 11.708 11.708Z" />
        </svg>
      )}
    </button>
  )
}
