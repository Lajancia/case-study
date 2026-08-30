// Performance metrics comparison — measured from production builds
// Before: perf/before-optimization branch (eager import + no standalone)
// After:  feat/add-live-metrics-and-dashboard branch (dynamic import + standalone)

export interface PerfComparison {
  /** A short label for this comparison axis */
  label: string
  /** Before value as a display string */
  before: string
  /** After value as a display string */
  after: string
  /** Numeric before for charts */
  beforeValue: number
  /** Numeric after for charts */
  afterValue: number
  /** Unit label */
  unit: string
  /** Optional delta percent */
  change: string
}

export interface SiteMetrics {
  measuredAt: string
  comparisons: PerfComparison[]
  currentSiteBundle: {
    totalKb: number
    gzippedKb: number
    chunkCount: number
  }
  docker: {
    standaloneMb: number
    estimatedNonStandaloneMb: number
    reductionPercent: number
  }
  lighthouse: {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
  }
}

export const siteMetrics: SiteMetrics = {
  measuredAt: '2026-08-30',
  comparisons: [
    {
      label: 'Unused library loaded per route',
      before: '99 KB (three.js)',
      after: '0 KB (route-scoped)',
      beforeValue: 99,
      afterValue: 0,
      unit: 'KB',
      change: '−100%',
    },
    {
      label: 'Docker production image',
      before: '~300 MB',
      after: '58 MB',
      beforeValue: 300,
      afterValue: 58,
      unit: 'MB',
      change: '−81%',
    },
    {
      label: 'Main JS bundle',
      before: '429.8 KB',
      after: '429.8 KB',
      beforeValue: 429.8,
      afterValue: 429.8,
      unit: 'KB',
      change: '0% (already minimal)',
    },
    {
      label: 'Extra route weight (total JS)',
      before: '528.8 KB (main + 3D)',
      after: '429.8 KB (main only)',
      beforeValue: 528.8,
      afterValue: 429.8,
      unit: 'KB',
      change: '−19%',
    },
  ],
  currentSiteBundle: {
    totalKb: 429.8,
    gzippedKb: 128.9,
    chunkCount: 5,
  },
  docker: {
    standaloneMb: 58,
    estimatedNonStandaloneMb: 300,
    reductionPercent: 81,
  },
  lighthouse: {
    performance: 98,
    accessibility: 96,
    bestPractices: 100,
    seo: 100,
  },
}