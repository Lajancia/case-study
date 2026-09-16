import { expect, test, type Page } from '@playwright/test'

/**
 * /hire is unlinked on purpose: it is registered directly on B2B platforms, so
 * landing there means the visitor is on the contract track rather than the
 * hiring one. The proxy records that in a session cookie, and the header reads
 * it to offer a way back. Get this wrong in either direction and the split
 * fails silently — a recruiter is sold consulting, or a client who followed a
 * link into the case studies can never find /hire again.
 */

const HIRE_LINK = { name: 'Work with me' }
const RESUME_LINK = { name: 'Resume' }

/**
 * Below the sm breakpoint the nav lives behind a hamburger and is not rendered
 * until it is opened. Without this the "no hire link" assertions would pass on
 * mobile for the wrong reason.
 */
async function openNav(page: Page, isMobile: boolean, openLabel = 'Open menu') {
  if (!isMobile) return
  await page.getByRole('button', { name: openLabel }).click()
}

test.describe('default (hiring) track', () => {
  test('no hire link is exposed to a visitor who never saw /hire', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/en')
    await openNav(page, !!isMobile)

    await expect(page.getByRole('link', HIRE_LINK)).toHaveCount(0)
    await expect(page.getByRole('link', RESUME_LINK).first()).toBeVisible()
  })

  // Unlinked from the nav, but deliberately listed in the sitemap so it stays
  // indexable — that is how B2B prospects are meant to reach it at all.
  test('/hire stays indexable for both locales', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    for (const locale of ['en', 'ko']) {
      expect(sitemap).toContain(`/${locale}/hire`)
      expect(sitemap).toContain(`/${locale}/work`)
    }
  })
})

test.describe('contract track', () => {
  test('landing on /hire reveals the way back, and hides the resume', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/en/hire')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Follow a link out into the case studies, as a visitor would.
    await page.goto('/en/work')
    await openNav(page, !!isMobile)

    await expect(page.getByRole('link', HIRE_LINK).first()).toBeVisible()
    // A resume is off message once someone is on the contract track.
    await expect(page.getByRole('link', RESUME_LINK)).toHaveCount(0)

    await page.getByRole('link', HIRE_LINK).first().click()
    await expect(page).toHaveURL(/\/en\/hire$/)
  })

  test('the cookie is set by the proxy and scoped to the session', async ({
    page,
    context,
  }) => {
    await page.goto('/en/hire')

    const cookie = (await context.cookies()).find((c) => c.name === 'track')
    expect(cookie?.value).toBe('hire')
    expect(cookie?.path).toBe('/')
    // A persistent cookie would still be showing the hire link months later to
    // someone who came back as a recruiter — the exact leak the split avoids.
    expect(cookie?.expires).toBe(-1)
  })

  test('the track survives a locale switch', async ({ page, isMobile }) => {
    await page.goto('/en/hire')
    await page.goto('/ko/work')
    await openNav(page, !!isMobile, '메뉴 열기')

    await expect(page.getByRole('link', { name: '함께 일하기' }).first()).toBeVisible()
  })

  test('each service links to a case study and to its filtered slice', async ({ page }) => {
    await page.goto('/en/hire')

    const seeAll = page.getByRole('link', { name: /see all .* work \(\d+\)/i })
    await expect(seeAll.first()).toBeVisible()

    // The count printed on the link has to be what the filtered page shows.
    const label = await seeAll.first().textContent()
    const claimed = Number(label?.match(/\((\d+)\)/)?.[1])
    await seeAll.first().click()

    await expect(page).toHaveURL(/\/en\/work\?do=/)
    await expect(page.getByRole('article')).toHaveCount(claimed)
  })
})
