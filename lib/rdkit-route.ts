/**
 * The one route that runs RDKit's WASM viewer.
 *
 * proxy.ts scopes the 'wasm-unsafe-eval'/'unsafe-eval' CSP allowance to this
 * path alone, and CSP is enforced per document — a client-side (soft)
 * navigation into this route keeps whatever policy the *previous* page
 * loaded with, which never carries this route's WASM allowance. So every
 * in-app link that points here has to force a full navigation instead of
 * going through next/link's router transition; see WorkCard.tsx and
 * app/[locale]/hire/page.tsx for the two places that do.
 *
 * Kept in its own module, rather than importing it out of lib/case-studies.ts,
 * so the per-request Edge middleware in proxy.ts doesn't have to bundle that
 * file's full case-study dataset just to read one string.
 */
export const RDKIT_ROUTE_SLUG = 'scientific-platform-performance'
