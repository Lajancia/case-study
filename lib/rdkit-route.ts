/**
 * The one route that runs RDKit's WASM viewer — isolated in its own iframe
 * embed rather than mounted directly on the case-study page.
 *
 * RDKit needs 'wasm-unsafe-eval'/'unsafe-eval' to compile (see proxy.ts).
 * Molstar, which shares the case-study page, does not — measured by loading
 * the page under a CSP with neither and watching Molstar render a full
 * structure anyway while only RDKit's compile step failed. So the concession
 * only has to cover RDKit's own document, not the whole page: this route is
 * that document. proxy.ts scopes the eval allowance to it, and grants it
 * `frame-ancestors 'self'` instead of the sitewide `'none'` so only this
 * origin may embed it — see components/case-study/MolecularViewer.tsx for
 * the iframe that does, and app/embed/rdkit-viewer/page.tsx for the page.
 *
 * Outside app/[locale]: its handful of strings are hardcoded English
 * already, same as before this moved (it is a technical demo panel, not
 * localized copy), and nothing links to it directly — only case-study pages
 * that embed it.
 */
export const RDKIT_EMBED_PATH = '/embed/rdkit-viewer'

/**
 * The case-study route that mounts Molstar directly — unlike RDKit above,
 * Molstar isn't iframed off, so its own `connect-src` need (RCSB, where
 * MolstarViewer.tsx fetches the demo structure) has nowhere narrower to live
 * than this page. Every other route was carrying that same allowance for no
 * reason: nothing there ever calls RCSB. Scoping it to this route narrows
 * that the same way RDKIT_EMBED_PATH narrows the eval allowance above.
 */
export const MOLSTAR_DEMO_SLUG = 'scientific-platform-performance'
