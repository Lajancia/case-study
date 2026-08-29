# Soomin Case Studies

An independent, high-performance English case-study website proving Soomin Hwang's frontend expertise for EU B2B prospects.

## Tech Stack

- **Framework:** Next.js 15+ App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Content:** Local MDX
- **Testing:** Vitest + Testing Library (unit), Playwright + axe (e2e)
- **Deployment:** Docker multi-stage build, nginx reverse proxy, self-hosted VPS

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with value proposition and featured work |
| `/work` | Case study index |
| `/work/scientific-platform-performance` | AD3 case study (draft) |

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

## Deployment

1. Build: `docker compose build`
2. Run: `docker compose up -d`
3. Configure nginx with the provided `nginx/case-studies.conf`
4. Expand Let's Encrypt certificate to include the chosen hostname (e.g., `work.soominlab.com`)
5. Create DNS A record pointing to the VPS

## Content

Case studies live in `content/work/` as MDX files. Frontmatter includes title, description, metrics, and draft status. Draft routes are `noindex` until approved for publication.

## Verification Gates

- [ ] Employer written approval obtained
- [ ] Native-English proofreading completed
- [ ] All technical claims verified by Soomin
- [ ] Draft status changed to `false`
- [ ] Production Lighthouse scores ≥95 in all four categories