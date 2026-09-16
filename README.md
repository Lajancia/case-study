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
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests (Vitest) |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:e2e` | End-to-end tests (Playwright + axe) |

`npm run test:e2e` builds the app and serves it on port 3100 by default; it needs
browsers installed once via `npx playwright install chromium`.

## Deployment

1. Build: `docker compose build` — `NEXT_PUBLIC_SITE_URL` is a **build arg** (see `docker-compose.yml`), because Next inlines `NEXT_PUBLIC_*` at build time. Setting it only at runtime leaves `localhost:3000` baked into og:image, canonical, and sitemap URLs.
2. Run: `docker compose up -d`
3. Configure nginx with the provided `nginx/case-studies.conf` (serves `soominlab.com`, redirects `www` → apex)
4. Expand Let's Encrypt certificate to cover `soominlab.com` and `www.soominlab.com`
5. Create DNS A record pointing to the VPS

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