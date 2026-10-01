import { expect, test } from '@playwright/test'

/**
 * `/` is the one response that differs per visitor: it follows the browser's
 * Accept-Language. Everything under a locale prefix must stay identical for
 * everyone, so a shared cache (the CDN) can hold it — which is why no page
 * response may carry a Set-Cookie. See README §Rendering mode.
 *
 * Asserted on raw responses (`maxRedirects: 0`), not page navigation: the
 * thing under test is the redirect and the headers, not what a browser ends
 * up showing.
 */

const cases: Array<[acceptLanguage: string, expected: string]> = [
  ['ko-KR,ko;q=0.9,en;q=0.8', '/ko'],
  ['en-US,en;q=0.9', '/en'],
  // Neither supported locale is acceptable → the default, not an error.
  ['de-DE,de;q=0.9', '/en'],
]

for (const [acceptLanguage, expected] of cases) {
  test(`/ with Accept-Language "${acceptLanguage}" redirects to ${expected}`, async ({
    request,
  }) => {
    const res = await request.get('/', {
      headers: { 'Accept-Language': acceptLanguage },
      maxRedirects: 0,
    })

    expect(res.status()).toBeGreaterThanOrEqual(300)
    expect(res.status()).toBeLessThan(400)
    expect(new URL(res.headers()['location'], 'http://x').pathname).toBe(expected)
  })
}

for (const path of ['/en', '/ko', '/en/about']) {
  test(`${path} sets no cookie, so a shared cache can hold it`, async ({ request }) => {
    const res = await request.get(path, {
      headers: { 'Accept-Language': 'ko-KR,ko;q=0.9' },
      maxRedirects: 0,
    })

    expect(res.status()).toBe(200)
    expect(res.headers()['set-cookie']).toBeUndefined()
  })
}
