'use client'

import { useEffect, useLayoutEffect } from 'react'

// The root layout applies the theme with a beforeInteractive <script>, which Next
// only injects into server-rendered HTML. Not-found pages render on the client from
// the flight payload, where React creates the script element rather than executing
// it, so the theme class has to be set from here instead.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function ThemeInit() {
  useIsomorphicLayoutEffect(() => {
    try {
      const stored = localStorage.getItem('theme')
      const dark = stored
        ? stored === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', dark)
    } catch {}
  }, [])

  return null
}
