import { expect, test } from '@playwright/test'

/**
 * Theming moved from a `theme` cookie the server read to next-themes, which
 * settles the choice from localStorage in an inline script before first paint.
 *
 * The cookie version ignored the operating system entirely: with no cookie it
 * rendered no class, and the stylesheet has no prefers-color-scheme rule, so a
 * visitor whose OS is dark got a light page — while the toggle, which did
 * consult the media query, drew itself as though the page were dark. These
 * specs pin down the behaviour that replaced it.
 */

// Start every test with no stored choice, so `system` is what resolves.
test.use({ storageState: { cookies: [], origins: [] } })

const html = (page: import('@playwright/test').Page) => page.locator('html')

test.describe('with no choice stored', () => {
  test('a dark operating system gets a dark page', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/en')

    await expect(html(page)).toHaveClass(/\bdark\b/)
  })

  test('a light operating system gets a light page', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/en')

    await expect(html(page)).not.toHaveClass(/\bdark\b/)
  })
})

test.describe('the toggle', () => {
  test('overrides the system preference and survives a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/en')

    await page.getByRole('button', { name: 'Switch to dark mode' }).click()
    await expect(html(page)).toHaveClass(/\bdark\b/)

    // The choice lives in localStorage, so it has to outlast the document.
    await page.reload()
    await expect(html(page)).toHaveClass(/\bdark\b/)
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible()
  })

  test('keeps an accessible name before hydration settles', async ({ page }) => {
    // The button renders on the server, where the stored theme is unknowable.
    // Whatever it shows then, it may never be an unnamed control.
    await page.goto('/en', { waitUntil: 'commit' })

    await expect(
      page.getByRole('button', { name: /Switch to (dark|light) mode/ }),
    ).toBeAttached()
  })
})
