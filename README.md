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
| `/[locale]/hire` | Contract-track page. Unlinked from the nav — it is registered directly on B2B platforms — but listed in the sitemap. Landing on it sets a session cookie that reveals a way back in the header. |

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

`next.config.ts` sets the headers that never change — `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` — and turns off `X-Powered-By`. `proxy.ts` builds a per-request Content-Security-Policy around a fresh nonce, which Next stamps onto the scripts it emits; injected script arrives without one and never runs. `'strict-dynamic'` extends that trust to the chunks the runtime appends itself.

Two directives are deliberate concessions: `style-src 'unsafe-inline'`, because a nonce cannot cover the style *attributes* React writes for every `style={{ ... }}` prop, and `'wasm-unsafe-eval'` on the RDKit case-study route alone, because the browser will not compile WebAssembly without it. Neither `eval()` nor `new Function()` is allowed anywhere.

`e2e/security-headers.spec.ts` asserts all of this against real responses. It exists because the headers previously lived only in the nginx config and had silently stopped reaching production.

## Rendering mode

Every route renders on demand. That is a consequence of the CSP: the nonce must be fresh per response, so the document can be neither prerendered nor held in a shared cache. The root layout reads it from `headers()` to hand to next-themes, which makes the dynamic dependency explicit rather than incidental.

What it costs is smaller than it sounds. Measured against production, the server spends ~30ms rendering a page, and the document is 12.7 KB of a 250 KB page — the other 95% is hashed assets under `_next/static`, served `immutable` and cacheable anywhere regardless of rendering mode. There is no CDN in front of the site today, so prerendering would not save a request either way. Lighthouse scores 100 on desktop and 95 on mobile as it stands.

`generateStaticParams()` is still declared in `app/[locale]/layout.tsx` and `app/[locale]/work/[slug]/page.tsx`. It does nothing today and is kept deliberately, because going back is a short walk rather than a rewrite: drop the nonce from the CSP, move the hire-track cookie read out of `SiteHeader`, and add next-intl's `setRequestLocale()`. Worth revisiting if the site ever sits behind a CDN, or to adopt Cache Components — Partial Prerendering and nonce-based CSP are mutually exclusive.

## Theming

`next-themes` with `attribute="class"`, matching the `dark` variant `globals.css` declares. The choice lives in localStorage and is applied by an inline script before first paint, which is why the root layout passes it the request's CSP nonce.

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
| `e2e/hire-track.spec.ts` | The contract-track cookie in both directions: hidden by default, revealed after landing on `/hire`, session-scoped, surviving a locale switch. |
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