import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { KNOWN_CONTRAST_FAILURES } from './contrast-baseline'
import { KNOWN_NON_CONTRAST_EXCEPTIONS } from './known-non-contrast-exceptions'

/**
 * The site sells frontend competence to people who will judge it by the site
 * itself. A missing label or an unreadable control on the page arguing for
 * engineering quality costs more here than it would anywhere else.
 *
 * Two gates:
 *   1. Any violation that is not colour-contrast fails, unless the specific
 *      node matches an entry in known-non-contrast-exceptions.ts. A rule id
 *      alone is not enough to earn a pass there — the exception is scoped to
 *      the exact element it was written for.
 *   2. Colour-contrast failures are allowed only for the exact foreground /
 *      background pairs recorded in contrast-baseline.ts. A new one fails.
 *
 * Both themes are checked. next-themes resolves the default `system` theme
 * against prefers-color-scheme in an inline script before first paint, so
 * emulating the media query is what actually drives dark here — and it covers
 * the path most visitors arrive on, having never touched the toggle.
 */

const ROUTES = ['/en', '/en/work', '/en/about', '/en/hire', '/ko/work']
const CASE_STUDY = '/en/work/scientific-platform-performance'

// wcag2a/wcag2aa are the rules a client or a recruiter would actually cite.
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

interface ContrastFailure {
  pair: string
  ratio: string
  target: string
}

async function audit(page: Page, route: string) {
  await page.goto(route)

  // The demo route mounts two viewers behind pulsing skeletons. animate-pulse
  // animates opacity, so the colour axe computes for a skeleton depends on when
  // it looks — and a skeleton is not what a reader is left with anyway. Audit
  // the settled page.
  if (route === CASE_STUDY) {
    await expect(page.getByRole('button', { name: 'Cartoon' })).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.getByText('Loading RDKit.js')).toBeHidden({ timeout: 30_000 })
  }

  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()

  const other: string[] = []
  for (const violation of violations.filter((v) => v.id !== 'color-contrast')) {
    const unexcepted = violation.nodes.filter(
      (node) =>
        !KNOWN_NON_CONTRAST_EXCEPTIONS.some(
          (exception) => exception.ruleId === violation.id && exception.matches(node),
        ),
    )
    if (unexcepted.length > 0) {
      other.push(`${violation.id} (${unexcepted.length}): ${violation.help}`)
    }
  }

  const contrast: ContrastFailure[] = []
  for (const violation of violations.filter((v) => v.id === 'color-contrast')) {
    for (const node of violation.nodes) {
      const match = (node.failureSummary ?? '').match(
        /contrast of ([\d.]+) \(foreground color: (#[0-9a-f]{6}), background color: (#[0-9a-f]{6})/,
      )
      // An unparseable summary is treated as unknown rather than ignored.
      const pair = match ? `${match[2]} on ${match[3]}` : (node.failureSummary ?? 'unknown')
      contrast.push({
        pair,
        ratio: match?.[1] ?? '?',
        target: node.target.join(' '),
      })
    }
  }
  return { other, contrast }
}

function unrecorded(contrast: ContrastFailure[]) {
  return [
    ...new Set(
      contrast
        .filter((f) => !(f.pair in KNOWN_CONTRAST_FAILURES))
        .map((f) => `${f.pair} — ratio ${f.ratio} — e.g. ${f.target}`),
    ),
  ]
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`${theme} theme`, () => {
    test.use({ storageState: { cookies: [], origins: [] } })

    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme })
    })

    for (const route of [...ROUTES, CASE_STUDY]) {
      test(`${route} has no unrecorded accessibility problems`, async ({ page }) => {
        const { other, contrast } = await audit(page, route)

        expect(other, 'non-contrast violations must stay at zero').toEqual([])
        expect(unrecorded(contrast), 'new colour-contrast failures').toEqual([])
      })
    }
  })
}

test('every page has exactly one h1', async ({ page }) => {
  for (const route of [...ROUTES, CASE_STUDY]) {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 }), route).toHaveCount(1)
  }
})

test('the skip link is the first thing a keyboard reaches', async ({ page }) => {
  await page.goto('/en')
  await page.keyboard.press('Tab')

  const focused = page.locator(':focus')
  await expect(focused).toHaveAttribute('href', '#main-content')
  await focused.press('Enter')
  await expect(page.locator('#main-content')).toBeVisible()
})
