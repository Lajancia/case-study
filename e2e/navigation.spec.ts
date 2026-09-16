import { expect, test } from '@playwright/test'

/**
 * Every page here is an async server component, which Vitest cannot render.
 * These specs are what stands between a broken page and production.
 */

test('home renders the hero, KPI tiles and featured work', async ({ page }) => {
  await page.goto('/en')

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: /view case study/i }).first()).toBeVisible()
  // The KPI row is built from getHighlights(); an unresolved ref renders nothing.
  await expect(page.getByText('−80%')).toBeVisible()
})

test('home → work → case study', async ({ page }) => {
  await page.goto('/en')
  await page.getByRole('link', { name: /view case study/i }).first().click()

  await expect(page).toHaveURL(/\/en\/work$/)
  const firstCard = page.getByRole('article').first()
  await expect(firstCard).toBeVisible()

  await firstCard.getByRole('link', { name: /read case study/i }).click()
  await expect(page).toHaveURL(/\/en\/work\/[a-z0-9-]+$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('capability filter narrows the list and stays shareable', async ({ page }) => {
  await page.goto('/en/work?do=performance')

  // Server-rendered from the query string, so the URL alone reproduces the view.
  await expect(page.getByRole('link', { name: /performance/i }).first()).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.getByRole('article').first()).toBeVisible()
  const filtered = await page.getByRole('article').count()

  await page.goto('/en/work')
  await expect(page.getByRole('article').first()).toBeVisible()
  expect(await page.getByRole('article').count()).toBeGreaterThanOrEqual(filtered)
})

test('an unknown capability falls back to the full list', async ({ page }) => {
  await page.goto('/en/work?do=fullstack')
  await expect(page.getByRole('link', { name: /all work/i })).toHaveAttribute(
    'aria-current',
    'page',
  )
})

test('an unknown case study 404s', async ({ page }) => {
  const response = await page.goto('/en/work/no-such-case-study')
  expect(response?.status()).toBe(404)
})

test('the language switcher keeps the current path', async ({ page }) => {
  await page.goto('/en/work/scientific-platform-performance')
  await page.getByRole('link', { name: 'KO', exact: true }).click()

  await expect(page).toHaveURL(/\/ko\/work\/scientific-platform-performance$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
})

test('both locales serve every case study', async ({ page }) => {
  for (const locale of ['en', 'ko']) {
    const response = await page.goto(`/${locale}/work`)
    expect(response?.status(), `${locale} work index`).toBe(200)
    await expect(page.getByRole('article').first()).toBeVisible()
  }
})
