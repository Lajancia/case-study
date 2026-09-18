# Static-by-default rendering: dropping the CSP nonce

Status: approved, ready for implementation plan
Date: 2026-09-18
Branch: `perf/static-by-default`

## Problem

Every route renders on demand today. Two independent dynamic APIs force this:

1. `app/layout.tsx` calls `headers()` to read an `x-nonce` value and hands it to next-themes'
   `ThemeProvider`, so its inline theme-init script carries the nonce the CSP requires.
2. `components/site/SiteHeader.tsx` calls `cookies()` to read `HIRE_TRACK_COOKIE` and decide
   whether to show a "back to hire" banner.

Both live in layouts shared by every route under `app/`, so both force the entire site dynamic:
no static generation, no CDN caching, no ISR.

## Why now

A conversation-length investigation (2026-09-18) established:

- The site has zero forms, zero `dangerouslySetInnerHTML`, and zero third-party `<script>` tags
  anywhere (verified by grep). There is no live XSS injection vector for the nonce to be
  protecting against today.
- Next's own CSP guide (`node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`)
  frames nonces as the tool for sensitive-data/compliance/strict-security cases — none of which
  apply to a portfolio site with no user data.
- `strict-dynamic` trusts the script chain that originates from a nonce'd/hash'd script. It does
  not protect against a supply-chain compromise baked into an already-trusted dependency — the one
  attack class this codebase is actually exposed to (like any npm-based app). Dropping the nonce
  does not make that exposure worse.
- Nonce-based CSP is incompatible with Partial Prerendering / Cache Components in this Next
  version (confirmed in the same guide, and already noted in the current README).
- Next's experimental `experimental.sri` (hash-based CSP) was considered and rejected: too much
  production-stability risk for a career-critical site to carry on an experimental flag.
- RDKit's `wasm-unsafe-eval`/`unsafe-eval` concession cannot be removed without recompiling RDKit
  from source with Emscripten's `DYNAMIC_EXECUTION=0` (confirmed against emscripten-core/emscripten
  issues #18732 and #20673) — disproportionate effort for this project. It stays.
- The original project decision to gate any static-rendering discussion behind a Cloudflare
  CDN measurement is superseded here, on the user's explicit call, given the above.

## Decision

Go static by default across `app/[locale]` and the RDKit embed route. Keep CSP everywhere, but
drop the nonce/`strict-dynamic` requirement from `script-src` in favor of `'unsafe-inline'`,
uniformly, RDKit included. Every other CSP directive is unaffected and moves to a static
declaration.

RDKit's own `wasm-unsafe-eval`/`unsafe-eval` scoping is preserved exactly as-is, on its own route
only. Unifying `script-src` does not widen *that* concession — it only removes the nonce
requirement that was forcing dynamic rendering everywhere it applied.

### Why unify RDKit instead of giving it a separate root layout

Considered keeping RDKit's route on `nonce` + `strict-dynamic` (stronger, since it's the one route
with an eval concession) via a second root layout (Next.js route groups support multiple root
layouts for exactly this). Rejected: the risk math doesn't support it. Risk is probability ×
consequence; the eval concession raises consequence-if-compromised but the probability of
compromise is the same ~zero as the rest of the site (no injection vector on that page either — it
is one controlled component, `RdkitEmbed.tsx`, no user input). Route groups would also restructure
`app/` and duplicate the root-layout shell across two trees, adding real implementation surface to
a change happening in a codebase with a documented prior incident of exactly this shape ("a CSP
that broke the RDKit viewer in production, under two green specs" — `CONTRIBUTING.md`). Simpler
wins on both security-math and implementation-risk grounds.

## Scope of changes

- `app/layout.tsx` — remove the `headers()` call and the `nonce` prop passed to `ThemeProvider`.
- `proxy.ts` — remove nonce generation and CSP header construction/assignment entirely. Remove
  `HIRE_TRACK_COOKIE` cookie-setting on the `/hire` path. Keep: next-intl locale routing, and the
  RDKit-path special-case that skips next-intl (still needed — next-intl would otherwise redirect
  the unprefixed embed path and 404, independent of CSP).
- `components/site/SiteHeader.tsx` — remove the `cookies()` read and the hire-track banner
  rendering. `/hire` the page itself is untouched.
- `next.config.ts` — add the CSP (and `frame-ancestors`/`X-Frame-Options` framing rules) as static
  `headers()` entries:
  - Default: `script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`, `font-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`,
    `form-action 'self'`, `connect-src 'self'`, `base-uri 'self'`, `upgrade-insecure-requests`.
  - RDKit embed path (`lib/rdkit-route.ts`'s `RDKIT_EMBED_PATH`): `script-src` additionally carries
    `'wasm-unsafe-eval' 'unsafe-eval'`; `frame-ancestors 'self'` (and `X-Frame-Options: SAMEORIGIN`)
    instead of `'none'`/`DENY`.
  - Molstar demo path (`lib/rdkit-route.ts`'s `MOLSTAR_DEMO_SLUG`, locale-prefixed): `connect-src`
    additionally carries `https://files.rcsb.org`.
- `app/[locale]/layout.tsx`, `app/[locale]/work/[slug]/page.tsx` — add next-intl's
  `setRequestLocale()` so the already-declared `generateStaticParams()` actually takes effect.
- `README.md` — rewrite "Rendering mode" (no longer dynamic-by-necessity), "Theming" (no more
  nonce plumbing), and "Security headers" (nonce/strict-dynamic language is gone) sections. Add a
  forward note: if a form or any HTML-injecting feature is added later, reach for
  `cacheComponents` (Cache Components / Partial Prerendering, `next.config.ts`) and wrap just that
  piece in Suspense — not a page-wide reversion to dynamic rendering.

## Out of scope (explicitly deferred, recorded so it isn't re-litigated)

- Cloudflare CDN — no longer a prerequisite for this change; may proceed independently, before or
  after.
- `experimental.sri` — rejected for production-stability risk on an experimental flag.
- `cacheComponents` / Partial Prerendering — not enabled now; this site has no component that
  needs per-request data yet. Documented in the README as the mechanism to reach for when one
  appears.
- Recompiling RDKit's WASM with `DYNAMIC_EXECUTION=0` — disproportionate; not pursued.
- Route groups / multiple root layouts — rejected in favor of unifying `script-src`.

## Risk accepted

Site-wide `script-src` XSS protection moves from `nonce`+`strict-dynamic` to `'unsafe-inline'`.
This is real defense-in-depth given up, justified because no live injection vector exists today
(verified, not assumed) and the nonce was never protecting against this codebase's actual exposure
(supply-chain compromise of an already-trusted dependency). If a future change introduces an
injection point (a form, `dangerouslySetInnerHTML`, a third-party script), that change is the
moment to reconsider `script-src` for the specific route it lands on — not before.

## Testing

- `e2e/security-headers.spec.ts` — CSP assertions change from nonce-pattern matching to fixed-value
  checks per route (default vs. RDKit-path vs. Molstar-path). Cover the framing
  (`frame-ancestors`/`X-Frame-Options`) split the same way the existing spec does.
- `e2e/theme.spec.ts` — must keep passing unmodified in behavior (theme still applies pre-hydration,
  no flash) on both a static page and the RDKit embed (through a `frameLocator`, per the existing
  pattern), now without a nonce anywhere.
- RDKit rendering itself: this is the regression the project has shipped before under a green
  suite (`CONTRIBUTING.md` Global Invariant #2). Beyond the e2e spec, verify live via the
  `next-dev-loop` skill against a real browser — confirm the WASM compiles and a molecule actually
  renders, not just that the response has no CSP violation.
- `npm run lint && npm run typecheck && npm run test && npm run test:e2e`, then
  `npm run build && npx next start` to confirm the routes are actually static (check response
  headers / build output for prerendered pages) before calling this done.

## Next step

Hand this spec to the `writing-plans` skill for a step-by-step implementation plan.
