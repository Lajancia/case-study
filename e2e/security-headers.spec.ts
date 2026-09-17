import { expect, test } from '@playwright/test'

/**
 * The security headers used to be declared only in nginx/case-studies.conf,
 * which is copied onto the server by hand. That copy fell behind, and for a
 * long time production served none of them — the repo said one thing and the
 * site did another, with nothing to notice. These specs are the thing that
 * notices: they assert against real responses, so a header that stops being
 * sent fails the build rather than going quiet.
 */

const ROUTES = ['/en', '/ko', '/en/work', '/en/about', '/en/hire']

/** The route whose RDKit demo compiles WebAssembly. */
const WASM_ROUTE = '/en/work/scientific-platform-performance'

const STATIC_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
}

test.describe('security headers', () => {
  for (const route of ROUTES) {
    test(`${route} sends the static security headers`, async ({ request }) => {
      const headers = (await request.get(route)).headers()

      for (const [key, value] of Object.entries(STATIC_HEADERS)) {
        expect(headers[key], `${key} on ${route}`).toBe(value)
      }
      // Announcing the framework only helps someone shopping for a version to
      // target.
      expect(headers['x-powered-by'], `x-powered-by on ${route}`).toBeUndefined()
    })
  }

  test('static assets carry the headers too', async ({ request }) => {
    const headers = (await request.get('/rdkit/RDKit_minimal.js')).headers()

    // nosniff is what keeps a browser from reinterpreting a declared type —
    // the guarantee the self-hosted RDKit assets rely on.
    expect(headers['x-content-type-options']).toBe('nosniff')
  })
})

test.describe('content security policy', () => {
  test('every route is covered, and the nonce is fresh each time', async ({
    request,
  }) => {
    const seen = new Set<string>()

    for (const route of [...ROUTES, WASM_ROUTE]) {
      const csp = (await request.get(route)).headers()['content-security-policy']
      expect(csp, `no CSP on ${route}`).toBeTruthy()

      const nonce = csp.match(/'nonce-([a-f0-9]+)'/)?.[1]
      expect(nonce, `no nonce on ${route}`).toBeTruthy()
      // A nonce reused across responses is one an attacker can simply read off
      // an earlier page, which makes it worth no more than 'unsafe-inline'.
      expect(seen.has(nonce!), `nonce repeated on ${route}`).toBe(false)
      seen.add(nonce!)
    }
  })

  test('the policy keeps script injection closed', async ({ request }) => {
    const csp = (await request.get('/en')).headers()['content-security-policy']
    const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src'))!

    // The whole point of the nonce: inline script stays blocked. 'unsafe-inline'
    // anywhere in script-src would quietly undo it.
    expect(scriptSrc).not.toContain('unsafe-inline')
    expect(scriptSrc).toContain(`'strict-dynamic'`)

    for (const directive of [
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
    ]) {
      expect(csp).toContain(directive)
    }
  })

  test('Next stamps the nonce onto every script it emits', async ({ request }) => {
    const response = await request.get('/en')
    const nonce = response
      .headers()
      ['content-security-policy'].match(/'nonce-([a-f0-9]+)'/)![1]
    const html = await response.text()

    const scripts = html.match(/<script\b[^>]*>/g) ?? []
    expect(scripts.length).toBeGreaterThan(0)

    // Under 'strict-dynamic' a script without the nonce simply does not run, so
    // one unstamped tag means a blank page rather than a subtle regression.
    const unstamped = scripts.filter((tag) => !tag.includes(`nonce="${nonce}"`))
    expect(unstamped, `scripts missing the nonce: ${unstamped.join(' ')}`).toEqual([])
  })

  test(`only the RDKit route may compile WebAssembly`, async ({ request }) => {
    // 'wasm-unsafe-eval' allows WebAssembly.instantiate and nothing else —
    // eval() and new Function() stay blocked everywhere. It is still scoped to
    // the one route that needs it.
    const onDemo = (await request.get(WASM_ROUTE)).headers()['content-security-policy']
    expect(onDemo).toContain(`'wasm-unsafe-eval'`)

    for (const route of ROUTES) {
      const csp = (await request.get(route)).headers()['content-security-policy']
      expect(csp, `wasm allowed on ${route}`).not.toContain('wasm-unsafe-eval')
    }
  })
})
