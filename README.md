# Soomin Case Studies

An independent, high-performance English case-study website proving Soomin Hwang's frontend expertise for EU B2B prospects.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Content:** Local MDX
- **Testing:** Vitest + Testing Library (unit), Playwright + axe (e2e)
- **Deployment:** Docker multi-stage build, nginx reverse proxy, self-hosted VPS

## Routes

All routes are locale-prefixed (`/en`, `/ko`).

| Route | Description |
|-------|-------------|
| `/[locale]` | Landing page with value proposition and featured work |
| `/[locale]/work` | Case study index; `?do=<capability>` filters it |
| `/[locale]/work/[slug]` | One case study, rendered from MDX |
| `/[locale]/about` | Background and experience |
| `/[locale]/hire` | Contract-track page. Unlinked from the nav — it is registered directly on B2B platforms — but listed in the sitemap. |

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript check (runs `next typegen` first, so it works on a fresh clone without a build) |
| `npm test` | Unit tests (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:e2e` | End-to-end tests (Playwright + axe) |

`npm run test:e2e` builds the app and serves it on port 3100 by default; it needs
browsers installed once via `npx playwright install chromium`.

## Deployment

1. Build: `docker compose build` — `NEXT_PUBLIC_SITE_URL` is a **build arg** (see `docker-compose.yml`), because Next inlines `NEXT_PUBLIC_*` at build time. Setting it only at runtime leaves `localhost:3000` baked into og:image, canonical, and sitemap URLs.
2. Run: `docker compose up -d`
3. Configure nginx with the provided `nginx/case-studies.conf` (serves `soominlab.com`, redirects `www` → apex). This file is copied onto the host by hand, so it drifts: whenever it changes here, update the server's copy and `nginx -t && nginx -s reload`. It deliberately sets no security headers — those ship with the image (see below), so a missed copy cannot take them down with it.
4. Expand Let's Encrypt certificate to cover `soominlab.com` and `www.soominlab.com`
5. Create DNS A record pointing to the VPS

## Security headers

`next.config.ts` sets every security header as a static value — `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and the Content-Security-Policy — and turns off `X-Powered-By`. The CSP used to be built in `proxy.ts`, per request, around a nonce that Next stamped onto the scripts it emitted. There is no nonce anymore (see Rendering mode below), so the CSP is a plain string declared once, next to the rest of the headers, and `script-src` relies on `'self' 'unsafe-inline'` instead of a nonce plus `'strict-dynamic'`.

Three directives are deliberate concessions on top of that baseline. `style-src 'unsafe-inline'`, for the style *attributes* React writes for every `style={{ ... }}` prop — an inline style attribute has no CSP nonce or hash mechanism of its own, so this concession would have been needed even before the nonce was dropped. `'wasm-unsafe-eval' 'unsafe-eval'` on the RDKit embed route alone: the first lets the browser compile the module, and the second is needed because Emscripten's embind layer builds its method invokers with `new Function`. And, in development only (`process.env.NODE_ENV !== 'production'`), one more `'unsafe-eval'` on the default and Molstar-demo CSPs, for React and Turbopack's own dev-time debug instrumentation — it never ships in a production response, and it is unrelated to RDKit's concession, which applies in both environments. Everywhere else, in production, turning a string into code is blocked.

The RDKit route shipped broken once on the eval concession, which is worth recording: `'wasm-unsafe-eval'` alone let the module compile, so the page looked right in tests while the viewer showed an error in production. Two things hid it. The spec waited for the loading text to disappear — which also happens on failure — and then asserted on the first `<svg>` on the page, which is the theme toggle in the header. And a CSP violation is not a console error, so the spec watching the console could not have seen it either. Both are fixed: the viewer's output is now addressed by `data-testid`, and `e2e/security-headers.spec.ts` listens for `securitypolicyviolation` on every route.

The RDKit embed carries its own CSP, scoped by path in `next.config.ts`'s `headers()` (matched on `lib/rdkit-route.ts`'s `RDKIT_EMBED_PATH`) — the same per-route scoping this site always used there, just declared statically now instead of computed per request in `proxy.ts`. Molstar does not need a browser-side CSP exception anymore: the page fetches the demo PDB through this app's own `/api/pdb/[pdbId]` route, which allowlists the one demo structure and proxies the RCSB response server-side. That keeps client-side navigations under the inherited `connect-src 'self'` policy instead of depending on a new top-level document response.

`e2e/security-headers.spec.ts` asserts all of this against real responses. It exists because the headers previously lived only in the nginx config and had silently stopped reaching production.

## Rendering mode

Routes are statically generated by default. `app/[locale]/layout.tsx` and `app/[locale]/work/[slug]/page.tsx` call next-intl's `setRequestLocale()`, which makes the `generateStaticParams()` already declared in both files actually take effect: `/[locale]`, `/[locale]/about`, `/[locale]/hire`, and every `/[locale]/work/[slug]` case study prerender at build time. That used to be impossible: the CSP's nonce had to be fresh per response, so the document could be neither prerendered nor held in a shared cache, and the root layout read it from `headers()` to hand to next-themes, which made the dynamic dependency explicit rather than incidental. There is no nonce anymore — `script-src` carries `'unsafe-inline'` instead (see Security headers above) — and the hire-track cookie read that also forced every route dynamic is gone too. Full reasoning for dropping the nonce is in `docs/superpowers/specs/2026-09-18-static-by-default-rendering-design.md`: no live injection vector exists on this site to protect against, the nonce was never protecting against this codebase's actual exposure (a supply-chain compromise of an already-trusted dependency), and RDKit's own eval concession didn't justify treating its route differently from the rest of the site on this axis.

Two routes are deliberate, independent exceptions to "static by default," for unrelated reasons:

- `/[locale]/work` stays dynamic. It reads `searchParams` to apply the `?do=<capability>` filter, which forces on-demand rendering in Next.js regardless of the CSP — dropping the nonce did nothing for this one route, because the nonce was never what made it dynamic.
- `/embed/rdkit-viewer` prerenders like everything else, but its CSP is not the sitewide one: `script-src` there carries `'wasm-unsafe-eval' 'unsafe-eval'` (see Security headers) because RDKit's WASM module needs it to compile. That is a CSP exception, not a rendering-mode one — the route is still static.

For context on why this change wasn't performance-driven: measured against production before it, the server spent ~30ms rendering a page, and the document was 12.7 KB of a 250 KB page — the other 95% is hashed assets under `_next/static`, served `immutable` and cacheable anywhere regardless of rendering mode. There was no CDN in front of the site then and there still isn't, so static generation doesn't save a request the way it would behind one; the same numbers are why leaving `/[locale]/work` dynamic isn't a performance concern either. Lighthouse scored 100 on desktop and 95 on mobile before this change.

If a form, `dangerouslySetInnerHTML`, or any other HTML-injecting feature lands on a route later, that is the moment to reconsider `script-src` for that specific route — not before, and not sitewide. The mechanism for keeping the rest of the site static while that one piece is dynamic is Next's `cacheComponents` config (Cache Components / Partial Prerendering) with the dynamic piece wrapped in `<Suspense>`, not a page-wide reversion to `headers()`/`cookies()`-forced dynamic rendering — Partial Prerendering and a nonce-based CSP are mutually exclusive anyway, so that reversion would have to stay off the table regardless.

## Theming

`next-themes` with `attribute="class"`, matching the `dark` variant `globals.css` declares. The choice lives in localStorage and is applied by an inline script before first paint. That script runs under this site's `script-src 'unsafe-inline'` (see Security headers above) — no nonce needed, and the root layout no longer reads `headers()` to hand it one.

This replaced a `theme` cookie that the root layout read to render the class server-side. That version ignored the operating system: with no cookie it emitted no class, and the stylesheet has no `prefers-color-scheme` rule, so a visitor whose OS was dark got a light page while the toggle drew itself as though the page were dark. `e2e/theme.spec.ts` covers the behaviour that replaced it.

## Content

Case studies live in `content/work/{locale}/` as MDX files. Metadata includes title, description, metrics, and draft status. Draft routes are `noindex` until approved for publication.

Adding one means touching three places, which the unit tests check agree:

1. `lib/case-studies.ts` — the metadata the cards and hero render
2. `content/work/{locale}/<slug>.mdx` — the prose, for both locales
3. `content/work/index.ts` — the slug → component registry

Miss the third and the route 404s, so `__tests__/content-sync.test.ts` fails instead.

## Testing

| Suite | What it covers |
|-------|----------------|
| `__tests__/` (Vitest) | Case-study metadata invariants: locale parity, capability filter counts, home-page KPI refs resolving, and the three-way content sync above. Message catalogues are checked key-for-key across locales. |
| `e2e/navigation.spec.ts` | Home → work → case study, capability filtering via `?do=`, locale switching, 404s. |
| `e2e/route-scoped-loading.spec.ts` | The claim the site is built on — Molstar and RDKit load only on the route that renders them. Enforced as a JS budget (~0.15 MB on every other route against ~3.1 MB there), plus that the live demo really renders. |
| `e2e/accessibility.spec.ts` | axe against WCAG 2.1 A/AA, in both themes, on every page. Any non-contrast violation fails outright. |

Pages are async server components, which Vitest cannot render, so component
behaviour is covered end-to-end rather than in unit tests.

Known colour-contrast debt is recorded in `e2e/contrast-baseline.ts`: those pairs
come from the brand palette and are listed rather than fixed, so the suite stays
honest about them while failing on any new one.

## Verification Gates

- [ ] Employer written approval obtained
- [ ] Native-English proofreading completed
- [ ] All technical claims verified by Soomin
- [ ] Draft status changed to `false`
- [ ] Production Lighthouse scores ≥95 in all four categories
