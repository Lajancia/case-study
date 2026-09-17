import { expect, test } from '@playwright/test'

/**
 * A wide table in a case study used to push the whole page into horizontal
 * scroll on a phone, rather than scrolling just the table. `<table>` written
 * directly as HTML in an .mdx file never reaches the MDX `components` map —
 * confirmed by compiling one: MDX/CommonMark treats it as an opaque HTML
 * block — so the fix is `.prose table { display: block; overflow-x: auto }`
 * in globals.css, not a component override.
 *
 * This list is every case study confirmed (by grep, at the time this was
 * written) to contain a raw `<table>`. A new case study that adds one is not
 * automatically covered; the styling rule that fixes it is global, though, so
 * the practical risk of a silent miss is low.
 */
const TABLE_ROUTES = [
  '/en/work/adc-visualization',
  '/en/work/cicd-pipeline',
  '/en/work/common-srl-website',
  '/en/work/devsecops-pipeline',
  '/en/work/illuminarean-dockerization',
  '/en/work/illuminarean-hiring-platform',
  '/en/work/next14-r3f-portfolio',
  '/en/work/path-wsi-viewer',
  '/en/work/scientific-platform-performance',
  '/en/work/yura-smart-factory',
]

const NAV_ROUTES = ['/en', '/en/work', '/en/about', '/en/hire']

const MOBILE_WIDTH = 375

test.describe('no page forces horizontal scroll on a phone', () => {
  for (const route of [...NAV_ROUTES, ...TABLE_ROUTES]) {
    test(route, async ({ page }) => {
      await page.setViewportSize({ width: MOBILE_WIDTH, height: 800 })
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      const overflow = await page.evaluate(() => {
        const de = document.documentElement
        return de.scrollWidth - de.clientWidth
      })

      expect(overflow, `${route} overflows the viewport by ${overflow}px`).toBeLessThanOrEqual(0)
    })
  }
})
