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
    measuredAt: string
  }
}

export const siteMetrics: SiteMetrics = {
  measuredAt: '2026-10-03',
  comparisons: [
    {
      label: 'Unused library loaded per route',
      before: '508.8 KB (three.js)',
      after: '0 KB (route-scoped)',
      beforeValue: 508.8,
      afterValue: 0,
      unit: 'KB',
      change: '−100%',
    },
    {
      label: 'Docker production image (runner stage)',
      before: '~492 MB',
      after: '~110 MB',
      beforeValue: 492,
      afterValue: 110,
      unit: 'MB',
      change: '−78%',
    },
    {
      label: 'Main JS bundle (per route)',
      before: '961.3 KB',
      after: '452.5 KB',
      beforeValue: 961.3,
      afterValue: 452.5,
      unit: 'KB',
      change: '−53%',
    },
    {
      label: 'Gzipped transfer (per route, est.)',
      before: '288.4 KB',
      after: '135.8 KB',
      beforeValue: 288.4,
      afterValue: 135.8,
      unit: 'KB',
      change: '−53%',
    },
  ],
  currentSiteBundle: {
    totalKb: 452.5,
    gzippedKb: 135.8,
    chunkCount: 7,
  },
  docker: {
    standaloneMb: 110,
    estimatedNonStandaloneMb: 492,
    reductionPercent: 78,
    /** Docker image sizes were measured on this date; not re-measured since. */
    measuredAt: '2026-08-30',
  },
}