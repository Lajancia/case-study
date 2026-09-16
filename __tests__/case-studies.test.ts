import { describe, expect, test } from 'vitest'
import {
  CAPABILITY_ORDER,
  getAllSlugs,
  getCapabilityCounts,
  getCaseStudies,
  getCaseStudiesByCapability,
  getCaseStudy,
  getHighlights,
  getPublishedCaseStudies,
  isCapability,
  type Locale,
} from '@/lib/case-studies'

const LOCALES: Locale[] = ['en', 'ko']

describe('locale parity', () => {
  // getAllSlugs() is derived from the English list alone, and it is what
  // generateStaticParams() builds routes from. A slug that exists only in
  // Korean is therefore unreachable, and one missing from Korean 404s.
  test('both locales expose the same slugs in the same order', () => {
    expect(getCaseStudies('ko').map((c) => c.slug)).toEqual(
      getCaseStudies('en').map((c) => c.slug),
    )
  })

  test('getAllSlugs covers every case study in both locales', () => {
    const slugs = getAllSlugs()
    for (const locale of LOCALES) {
      for (const study of getCaseStudies(locale)) {
        expect(slugs).toContain(study.slug)
      }
    }
  })

  test('draft status matches across locales', () => {
    for (const study of getCaseStudies('en')) {
      expect(getCaseStudy('ko', study.slug)?.draft).toBe(study.draft)
    }
  })
})

describe('case study shape', () => {
  // The home page and every work card render outcomes.slice(0, 2) as a
  // before → after pair. An empty string renders as a blank cell.
  test.each(LOCALES)('%s: every study has renderable outcomes', (locale) => {
    for (const study of getCaseStudies(locale)) {
      expect(study.outcomes.length).toBeGreaterThan(0)
      for (const outcome of study.outcomes) {
        expect(outcome.label.trim()).not.toBe('')
        expect(outcome.before.trim()).not.toBe('')
        expect(outcome.after.trim()).not.toBe('')
        expect(outcome.change.trim()).not.toBe('')
      }
    }
  })

  test.each(LOCALES)('%s: slugs are unique', (locale) => {
    const slugs = getCaseStudies(locale).map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  test.each(LOCALES)('%s: no study is listed with an empty title', (locale) => {
    for (const study of getCaseStudies(locale)) {
      expect(study.title.trim()).not.toBe('')
      expect(study.description.trim()).not.toBe('')
    }
  })
})

describe('capability filters', () => {
  // The Work page only renders a filter chip when its count is > 0, and the
  // doc comment on Capability says a grouping has to hold enough work to be
  // worth clicking. A capability nothing maps to is dead configuration.
  test.each(LOCALES)('%s: every capability matches published work', (locale) => {
    const counts = getCapabilityCounts(locale)
    for (const capability of CAPABILITY_ORDER) {
      expect(counts[capability]).toBeGreaterThan(0)
    }
  })

  test.each(LOCALES)('%s: counts exclude drafts', (locale) => {
    const counts = getCapabilityCounts(locale)
    for (const capability of CAPABILITY_ORDER) {
      const matched = getCaseStudiesByCapability(locale, capability)
      expect(matched.every((study) => !study.draft)).toBe(true)
      // The /hire page prints this count next to a link into the filter, so
      // the number has to be what the filtered page actually shows.
      expect(counts[capability]).toBe(matched.length)
    }
  })

  test.each(LOCALES)('%s: filtered results keep the curated order', (locale) => {
    const order = getPublishedCaseStudies(locale).map((c) => c.slug)
    for (const capability of CAPABILITY_ORDER) {
      const filtered = getCaseStudiesByCapability(locale, capability).map(
        (c) => c.slug,
      )
      expect(filtered).toEqual(order.filter((slug) => filtered.includes(slug)))
    }
  })

  // isCapability guards the ?do= query param before it reaches the filter.
  test('isCapability rejects anything not in CAPABILITY_ORDER', () => {
    for (const capability of CAPABILITY_ORDER) {
      expect(isCapability(capability)).toBe(true)
    }
    for (const value of ['', 'fullstack', 'PERFORMANCE', null, undefined, 3, {}]) {
      expect(isCapability(value)).toBe(false)
    }
  })
})

describe('home page highlights', () => {
  // getHighlights flatMaps over hardcoded {slug, outcome index} refs and drops
  // anything it cannot resolve. Rename a slug or reorder an outcomes array and
  // a KPI tile disappears from the home page with no error anywhere.
  test.each(LOCALES)('%s: every highlight ref resolves', (locale) => {
    expect(getHighlights(locale)).toHaveLength(getHighlights('en').length)
    for (const highlight of getHighlights(locale)) {
      expect(getCaseStudy(locale, highlight.slug)).toBeDefined()
      expect(highlight.after.trim()).not.toBe('')
    }
  })

  test('highlights are non-empty', () => {
    expect(getHighlights('en').length).toBeGreaterThan(0)
  })

  test('highlights point at published work only', () => {
    for (const highlight of getHighlights('en')) {
      expect(getCaseStudy('en', highlight.slug)?.draft).toBe(false)
    }
  })
})

describe('getCaseStudy', () => {
  test('returns undefined for an unknown slug', () => {
    expect(getCaseStudy('en', 'no-such-case-study')).toBeUndefined()
  })
})
