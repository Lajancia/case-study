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

/** The case-study page that embeds the RDKit demo — no WASM allowance of its own. */
const DEMO_ROUTE = '/en/work/scientific-platform-performance'

/** The isolated document that actually compiles RDKit's WASM (lib/rdkit-route.ts). */
const RDKIT_EMBED_ROUTE = '/embed/rdkit-viewer'

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

    for (const route of [...ROUTES, DEMO_ROUTE, RDKIT_EMBED_ROUTE]) {
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

  test(`only the RDKit embed may compile WebAssembly`, async ({ request }) => {
    // 'wasm-unsafe-eval' allows WebAssembly.instantiate and nothing else —
    // eval() and new Function() stay blocked everywhere. It is scoped to the
    // one document that needs it: RDKit's own iframe (lib/rdkit-route.ts),
    // not the case-study page that frames it in.
    const onEmbed = (await request.get(RDKIT_EMBED_ROUTE)).headers()['content-security-policy']
    expect(onEmbed).toContain(`'wasm-unsafe-eval'`)

    for (const route of [...ROUTES, DEMO_ROUTE]) {
      const csp = (await request.get(route)).headers()['content-security-policy']
      expect(csp, `wasm allowed on ${route}`).not.toContain('wasm-unsafe-eval')
    }
  })

  test('only the RDKit embed may be framed, and only by this origin', async ({
    request,
  }) => {
    // frame-ancestors is what actually stops a hostile page from iframing
    // RDKit's relaxed-eval document to attack it via clickjacking or a
    // framed-UI trick. 'self' has to be scoped as tightly as the eval
    // allowance it travels with, or isolating RDKit into its own document
    // would gain nothing.
    const onEmbed = (await request.get(RDKIT_EMBED_ROUTE)).headers()['content-security-policy']
    expect(onEmbed).toContain(`frame-ancestors 'self'`)

    for (const route of [...ROUTES, DEMO_ROUTE]) {
      const csp = (await request.get(route)).headers()['content-security-policy']
      expect(csp, `frame-ancestors on ${route}`).toContain(`frame-ancestors 'none'`)
    }
  })

  test('X-Frame-Options matches frame-ancestors for browsers that ignore it', async ({
    request,
  }) => {
    // The CSP directive is what modern browsers enforce; X-Frame-Options is
    // the fallback for ones that predate it (next.config.ts). A mismatch
    // here would mean an old browser enforcing a stricter or looser rule
    // than the one actually intended.
    const embedHeaders = (await request.get(RDKIT_EMBED_ROUTE)).headers()
    expect(embedHeaders['x-frame-options']).toBe('SAMEORIGIN')

    for (const route of [...ROUTES, DEMO_ROUTE]) {
      const headers = (await request.get(route)).headers()
      expect(headers['x-frame-options'], `x-frame-options on ${route}`).toBe('DENY')
    }
  })

  test('the RDKit embed is not indexed and has no locale of its own', async ({
    request,
  }) => {
    // It sits outside app/[locale] (lib/rdkit-route.ts) — a request without a
    // locale prefix must be served directly, not redirected to add one. A
    // redirect here would 404 (there is no app/[locale]/embed route) and, on
    // the way, swap this response's CSP for the stricter unprefixed default.
    const response = await request.get(RDKIT_EMBED_ROUTE, { maxRedirects: 0 })
    expect(response.status(), 'RDKit embed was redirected instead of served directly').toBe(200)

    const html = await response.text()
    expect(html).toContain('noindex')
  })
})

/**
 * A policy that blocks the site's own code is worse than no policy: it fails in
 * the browser, not in the build. And it fails quietly — a CSP violation is not
 * a console error, so a spec that watches the console cannot see it. Only the
 * securitypolicyviolation event can, which is what this listens for.
 *
 * This exists because the RDKit route shipped broken: 'wasm-unsafe-eval' let
 * the module compile, but Emscripten's embind builds its invokers with
 * `new Function`, and nothing caught the difference until it was live.
 */

interface ViolationWindow extends Window {
  __cspViolations?: string[]
}

const collectViolations = () => {
  document.addEventListener('securitypolicyviolation', (event) => {
    const w = window as ViolationWindow
    w.__cspViolations ??= []
    w.__cspViolations.push(
      `${event.violatedDirective} blocked ${event.blockedURI} from ${event.sourceFile || 'inline'}`,
    )
  })
}

// addInitScript runs in every frame, RDKit's embed included, but each frame
// keeps its own window — so violations there sit on that frame's own
// __cspViolations, invisible to a check against only the top page.
const violationsOn = (page: import('@playwright/test').Page) =>
  Promise.all(page.frames().map((frame) => frame.evaluate(() => (window as ViolationWindow).__cspViolations ?? []))).then(
    (perFrame) => perFrame.flat(),
  )

test.describe('the policy does not block the site itself', () => {
  for (const route of [...ROUTES, DEMO_ROUTE]) {
    test(`${route} renders with no policy violations`, async ({ page }) => {
      await page.addInitScript(collectViolations)
      await page.goto(route)
      await page.waitForLoadState('networkidle')

      expect(await violationsOn(page)).toEqual([])
    })
  }

  test('the RDKit viewer runs under the policy', async ({ page, isMobile }) => {
    // Mol* shares the route and needs WebGL, which headless mobile emulation
    // does not reliably provide; the RDKit half is what matters here.
    test.skip(!!isMobile)

    await page.addInitScript(collectViolations)
    await page.goto(DEMO_ROUTE)

    // RDKit runs in its own document, framed in by data-testid="rdkit-frame"
    // (lib/rdkit-route.ts) — frameLocator reaches into it the same way a
    // reader's DevTools would.
    const rdkit = page.frameLocator('[data-testid="rdkit-frame"]')

    // Waiting for the depiction rather than for the network: the failure this
    // guards against leaves the page idle with an error panel showing.
    await expect(rdkit.getByTestId('rdkit-depiction').locator('svg')).toBeVisible({
      timeout: 30_000,
    })
    await expect(rdkit.getByTestId('rdkit-error')).toHaveCount(0)

    expect(await violationsOn(page)).toEqual([])
  })
})
