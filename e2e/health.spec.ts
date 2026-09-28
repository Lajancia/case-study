import { expect, test } from '@playwright/test'

/**
 * /api/health is what an external uptime check (n8n) polls against the public
 * URL. Each assertion below is a way that check could report "up" while the
 * site is not: a redirect it has to follow, a body it cannot parse, or a
 * cached 200 served by something in front of the app after the app has died.
 */

test.describe('health check', () => {
  test('answers 200 directly, without a locale redirect', async ({ request }) => {
    const response = await request.get('/api/health', { maxRedirects: 0 })

    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ status: 'ok' })
  })

  test('forbids caching, so a proxy cannot answer for a dead app', async ({ request }) => {
    const response = await request.get('/api/health')

    // Next's own 404 is also no-store, so without the status check this passes
    // with no route at all.
    expect(response.status()).toBe(200)
    expect(response.headers()['cache-control']).toContain('no-store')
  })
})
