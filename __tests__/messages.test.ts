import { describe, expect, test } from 'vitest'
import en from '@/messages/en.json'
import ko from '@/messages/ko.json'
import { routing } from '@/i18n/routing'

/**
 * next-intl resolves keys per locale at render time. A key present in one
 * locale and missing from the other does not fail the build — it throws on the
 * page that happens to use it, in the locale nobody checked.
 */

type Messages = { [key: string]: string | Messages }

function flatten(messages: Messages, prefix = ''): string[] {
  return Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'string' ? [path] : flatten(value, path)
  })
}

const enKeys = flatten(en as Messages).sort()
const koKeys = flatten(ko as Messages).sort()

describe('message catalogues', () => {
  test('en and ko declare exactly the same keys', () => {
    expect(koKeys).toEqual(enKeys)
  })

  test('every routed locale has a catalogue', () => {
    const catalogues: Record<string, unknown> = { en, ko }
    for (const locale of routing.locales) {
      expect(catalogues[locale]).toBeDefined()
    }
  })

  test.each([
    ['en', en],
    ['ko', ko],
  ])('%s has no blank strings', (_locale, messages) => {
    const blanks = flatten(messages as Messages).filter((path) => {
      const value = path
        .split('.')
        .reduce<unknown>((node, key) => (node as Messages)?.[key], messages)
      return typeof value === 'string' && value.trim() === ''
    })
    expect(blanks).toEqual([])
  })

  // The Work page renders t(`capabilities.${capability}`) for whatever
  // CAPABILITY_ORDER holds, so a new capability without a label throws there.
  test('both locales label every capability filter', async () => {
    const { CAPABILITY_ORDER } = await import('@/lib/case-studies')
    for (const capability of CAPABILITY_ORDER) {
      expect(enKeys).toContain(`work.capabilities.${capability}`)
      expect(koKeys).toContain(`work.capabilities.${capability}`)
    }
  })

  // Same for the company headings the Work page groups cards under.
  test('both locales label every company group', async () => {
    const { COMPANY_ORDER } = await import('@/lib/case-studies')
    for (const company of COMPANY_ORDER) {
      expect(enKeys).toContain(`work.groups.${company}`)
      expect(koKeys).toContain(`work.groups.${company}`)
    }
  })
})
