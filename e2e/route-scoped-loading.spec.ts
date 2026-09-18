import { expect, test, type Page } from '@playwright/test'

/**
 * The central claim of this site: Molstar and RDKit load only on the route that
 * renders them, and cost every other route nothing. The case study invites
 * readers to open DevTools and check for themselves. These specs are that
 * check, run on every build — if an import ever creeps back up into a shared
 * layout, this fails instead of the page quietly misleading a reader.
 *
 * Chunk filenames are content hashes, so a chunk cannot be identified by name.
 * What matters is the payload anyway, so the budget is measured in bytes.
 */

const DEMO_ROUTE = '/en/work/scientific-platform-performance'

/** Routes that must stay free of the scientific libraries. */
const LIGHT_ROUTES = [
  '/en',
  '/en/work',
  '/en/about',
  '/en/hire',
  // Another case study, to prove the split is per-route and not per-section.
  '/en/work/adc-visualization',
]

/**
 * Measured at ~0.15 MB across every light route, against ~3.1 MB on the demo
 * route. The gap is two orders of magnitude wide, so this threshold catches a
 * regression long before a reader would notice one.
 */
const LIGHT_ROUTE_BUDGET = 0.5 * 1024 * 1024

const measureInFrame = () =>
  performance
    .getEntriesByType('resource')
    .filter(
      (entry): entry is PerformanceResourceTiming =>
        entry.name.includes('.js') ||
        entry.name.includes('.wasm') ||
        (entry as PerformanceResourceTiming).initiatorType === 'script',
    )
    .reduce((total, entry) => total + (entry.encodedBodySize || entry.transferSize), 0)

/**
 * Sums resource bytes across the page and every frame in it. RDKit runs in
 * its own document (lib/rdkit-route.ts) framed into the demo route, and
 * `performance.getEntriesByType` on the top page only sees the top page's own
 * resources — a frame keeps its own timeline. Without summing across frames,
 * this would silently stop counting RDKit's ~2.5 MB WASM at all.
 */
async function scriptBytes(page: Page) {
  await page.waitForLoadState('networkidle')
  const perFrame = await Promise.all(page.frames().map((frame) => frame.evaluate(measureInFrame)))
  return perFrame.reduce((total, bytes) => total + bytes, 0)
}

test.describe('route-scoped chunks', () => {
  for (const route of LIGHT_ROUTES) {
    test(`${route} stays under the JS budget`, async ({ page }) => {
      await page.goto(route)
      const bytes = await scriptBytes(page)

      expect(
        bytes,
        `${route} loaded ${(bytes / 1048576).toFixed(2)} MB of script`,
      ).toBeLessThan(LIGHT_ROUTE_BUDGET)
    })
  }

  test('no route but the demo requests RDKit', async ({ page }) => {
    // RDKit is served from /rdkit/, so unlike the hashed bundle chunks it has a
    // stable, readable URL and can be matched by name.
    for (const route of LIGHT_ROUTES) {
      const requests: string[] = []
      page.on('request', (request) => requests.push(request.url()))
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      expect(
        requests.filter((url) => url.toLowerCase().includes('rdkit')),
        `rdkit requested on ${route}`,
      ).toEqual([])
      page.removeAllListeners('request')
    }
  })

  test('the demo route loads the heavy libraries, on demand', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (request) => requests.push(request.url()))

    await page.goto(DEMO_ROUTE)
    await expect(page.getByRole('button', { name: 'Cartoon' })).toBeVisible({
      timeout: 30_000,
    })

    const bytes = await scriptBytes(page)
    // Everything above the light-route budget is the viewers arriving after the
    // document — which is the whole point of the case study.
    expect(bytes).toBeGreaterThan(LIGHT_ROUTE_BUDGET)
    expect(requests.filter((url) => url.toLowerCase().includes('rdkit')).length)
      .toBeGreaterThan(0)
  })
})

test.describe('same-origin molecular data route', () => {
  test('serves only the demo PDB through the app origin', async ({ request }) => {
    const demo = await request.get('/api/pdb/1CRN')
    expect(demo.status()).toBe(200)
    expect(await demo.text()).toContain('HEADER')

    const other = await request.get('/api/pdb/4HHB')
    expect(other.status()).toBe(404)
  })
})

test.describe('the live demo actually renders', () => {
  // Mol* needs WebGL, which the emulated mobile profile in headless Chromium
  // does not reliably provide.
  test.skip(({ isMobile }) => !!isMobile)

  test('Molstar draws a structure and RDKit draws a molecule', async ({ page }) => {
    await page.goto(DEMO_ROUTE)

    // RDKit runs in its own document, framed in by data-testid="rdkit-frame"
    // (lib/rdkit-route.ts) — frameLocator reaches into it the same way a
    // reader's DevTools would.
    const rdkit = page.frameLocator('[data-testid="rdkit-frame"]')

    // Assert on RDKit's own output, by name. An earlier version waited for the
    // loading text to disappear and then checked the first <svg> on the page:
    // the text also disappears when RDKit fails, and the first <svg> is the
    // theme toggle in the header, so the test passed while the viewer was
    // showing an error in production.
    const depiction = rdkit.getByTestId('rdkit-depiction')
    await expect(depiction.locator('svg')).toBeVisible({ timeout: 30_000 })
    await expect(rdkit.getByTestId('rdkit-error')).toHaveCount(0)

    // Mol* renders into a canvas and exposes its preset switcher once ready.
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 30_000 })

    // Three custom StructureRepresentationPresetProviders — the case study
    // names them, so they have to be there.
    for (const preset of ['Cartoon', 'Ball & stick', 'Surface']) {
      await expect(page.getByRole('button', { name: preset })).toBeVisible()
    }
  })

  test('Molstar survives arriving by client-side navigation, not just a direct load', async ({ page }) => {
    // page.goto(DEMO_ROUTE) receives the demo route's response headers. A
    // client-side <Link> navigation keeps the current document and therefore
    // the current document's CSP. Molstar must fetch its demo structure from
    // this origin, or arriving from /en inherits connect-src 'self' and the
    // browser blocks the RCSB download before Molstar reports "Invalid data
    // cell."
    await page.goto('/en')
    await page.locator(`a[href="${DEMO_ROUTE}"]`).first().click()
    await expect(page).toHaveURL(new RegExp(`${DEMO_ROUTE}$`))

    await expect(page.getByRole('button', { name: 'Cartoon' })).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 30_000 })
  })

  test('the demo page logs no console errors', async ({ page }) => {
    // Page-level 'console'/'pageerror' events include every frame on the
    // page, RDKit's embed (lib/rdkit-route.ts) included — no per-frame
    // wiring needed to catch a failure there too.
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto(DEMO_ROUTE)
    await expect(page.getByRole('button', { name: 'Cartoon' })).toBeVisible({
      timeout: 30_000,
    })

    expect(errors).toEqual([])
  })
})
