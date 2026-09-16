'use client'

import { useEffect, useSyncExternalStore } from 'react'
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

// The theme lives on <html> and in a cookie, both outside React, so the button
// subscribes to them rather than keeping its own copy. Writing the class is
// enough to update the button: the observer below sees the change.
function subscribeToTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
  // With no explicit choice the OS preference decides, so a change there has to
  // reach the button too.
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', onStoreChange)
  return () => {
    observer.disconnect()
    media.removeEventListener('change', onStoreChange)
  }
}

function isDarkNow() {
  const root = document.documentElement
  if (root.classList.contains('dark')) return true
  if (root.classList.contains('light')) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const isDarkOnServer = () => false

export function ThemeToggle() {
  const t = useTranslations('theme')
  const isDark = useSyncExternalStore(subscribeToTheme, isDarkNow, isDarkOnServer)

  // Visitors from before the cookie switch still have their choice in
  // localStorage. Move it over once, then let the cookie drive. This only
  // writes to the outside world; the subscription above reports the result.
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem('theme')
      if (stored) localStorage.removeItem('theme')
    } catch {}
    if (!stored) return

    const root = document.documentElement
    const alreadyChosen =
      root.classList.contains('dark') || root.classList.contains('light')
    if (alreadyChosen) return

    applyTheme(stored === 'dark')
  }, [])

  function toggle() {
    applyTheme(!isDark)
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
