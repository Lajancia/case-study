'use client'

import { useSyncExternalStore } from 'react'

const neverChanges = () => () => {}

/**
 * Whether hydration has happened.
 *
 * The sanctioned way to ask: the server snapshot is false, the client one is
 * true, and no effect has to push the answer into state — which also keeps it
 * clear of `react-hooks/set-state-in-effect`.
 *
 * Use it wherever the first client render would otherwise disagree with the
 * server's: WebGL and DOM work that cannot run on the server, or a value like
 * the resolved theme that is only knowable from localStorage.
 */
export const useHydrated = () =>
  useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  )
