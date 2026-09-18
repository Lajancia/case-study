import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { RDKIT_ROUTE_SLUG } from './lib/rdkit-route'

const handleI18nRouting = createMiddleware(routing)

// /hire is not linked from anywhere: it is registered directly on B2B
// platforms, so arriving there means the visitor is on the contract track
// rather than the hiring one. Remember that so the header can offer a way
// back once they follow a link into the case studies.
const HIRE_PATH = new RegExp(`^/(?:(?:${routing.locales.join('|')})/)?hire/?$`)

// Deliberately a session cookie. A persistent one would still be showing the
// hire link to someone who opened it once and came back months later to read
// the site as a recruiter — the exact leak the split is there to avoid.
export const HIRE_TRACK_COOKIE = 'track'

// The one route that runs RDKit. Nothing else on the site needs what it needs,
// so the allowance stops here.
const RDKIT_PATH = new RegExp(
  `^/(?:(?:${routing.locales.join('|')})/)?work/${RDKIT_ROUTE_SLUG}/?$`,
)

const isProduction = process.env.NODE_ENV === 'production'

/**
 * A per-request Content-Security-Policy.
 *
 * Next emits inline <script> tags to hand the RSC payload to the client, so a
 * source list alone leaves only the two useless choices: allow every inline
 * script, or break the page. A nonce distinguishes them — Next reads this
 * header while rendering and stamps the matching value onto its own scripts,
 * so anything injected into the markup arrives without one and never runs.
 *
 * 'strict-dynamic' extends that trust to the chunks the Next runtime appends
 * itself, which exist too late to carry a nonce of their own. It also makes
 * browsers ignore the source list for scripts, which is the stronger rule:
 * trust follows the chain rather than the hostname.
 *
 * The nonce has to be unguessable and fresh per response, so the document
 * cannot be prerendered or shared by a cache. That is the real price of this
 * policy, and it is paid deliberately: see "Rendering mode" in the README for
 * what it buys and what it would take to undo.
 */
function contentSecurityPolicy(nonce: string, allowRdkit: boolean) {
  // RDKit needs both, and this was learned the hard way. 'wasm-unsafe-eval'
  // lets the browser compile the module; without it nothing loads at all. But
  // the Emscripten embind layer then builds its method invokers with
  // `new Function(...)`, so 'unsafe-eval' is required too.
  //
  // That is a real concession — it lets already-trusted code turn strings into
  // code — and it is why this is scoped to the single route that renders the
  // viewer. 'strict-dynamic' still governs what may run in the first place, so
  // an injected script has no way in; what is relaxed here is what the code we
  // shipped may do, not who may ship code.
  const scriptExtras = [
    allowRdkit ? " 'wasm-unsafe-eval' 'unsafe-eval'" : '',
    // React's, in development only: it reconstructs server stacks in the
    // browser. Production needs no eval of its own.
    isProduction || allowRdkit ? '' : " 'unsafe-eval'",
  ].join('')

  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${scriptExtras}`,
    // A nonce cannot cover style *attributes*, and React writes those for every
    // style={{ ... }} prop. Style injection is far weaker than script
    // injection, so this is the usual place to stop.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    // next/font downloads the Geist families at build time and serves them from
    // /_next/static, so no font host is needed.
    `font-src 'self'`,
    // Mol* fetches the demo structure straight from RCSB.
    `connect-src 'self' https://files.rcsb.org`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    // The modern replacement for X-Frame-Options, which stays in next.config.ts
    // only for browsers that never implemented this.
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replaceAll('-', '')
  const csp = contentSecurityPolicy(nonce, RDKIT_PATH.test(request.nextUrl.pathname))

  // next-intl copies the incoming headers onto the response it forwards
  // downstream, so the policy has to be on the request before it runs: that
  // forwarded copy is what Next reads to find the nonce at render time.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('content-security-policy', csp)
  requestHeaders.set('x-nonce', nonce)

  const response = handleI18nRouting(
    new NextRequest(request, { headers: requestHeaders }),
  )
  response.headers.set('Content-Security-Policy', csp)

  if (HIRE_PATH.test(request.nextUrl.pathname)) {
    response.cookies.set(HIRE_TRACK_COOKIE, 'hire', {
      path: '/',
      sameSite: 'lax',
      // Only the server reads this, in SiteHeader, so script has no business
      // seeing it.
      httpOnly: true,
      secure: isProduction,
    })
  }

  return response
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
