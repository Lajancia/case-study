'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

// The root layout reads this cookie and renders the class server-side, so the
// theme is right on the first paint of every page, 404s included.
function applyTheme(dark: boolean) {
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.classList.toggle('light', !dark)
  document.cookie = `theme=${dark ? 'dark' : 'light'}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`
}

export function ThemeToggle() {
  const t = useTranslations('theme')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const chosen = root.classList.contains('dark')
      ? true
      : root.classList.contains('light')
        ? false
        : null

    // Visitors from before the cookie switch still have their choice in
    // localStorage. Move it over once, then let the cookie drive.
    let carriedOver: boolean | null = null
    try {
      const stored = localStorage.getItem('theme')
      if (stored) {
        localStorage.removeItem('theme')
        if (chosen === null) carriedOver = stored === 'dark'
      }
    } catch {}

    if (carriedOver !== null) {
      applyTheme(carriedOver)
      setIsDark(carriedOver)
      return
    }

    setIsDark(
      chosen ?? window.matchMedia('(prefers-color-scheme: dark)').matches,
    )
  }, [])

  function toggle() {
    const next = !isDark
    setIsDark(next)
    applyTheme(next)
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
