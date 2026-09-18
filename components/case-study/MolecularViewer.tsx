'use client'

import { lazy, Suspense } from 'react'
import { DEMO_PDB } from '@/lib/molecular-demo'
import { useHydrated } from '@/lib/use-hydrated'
import { RDKIT_EMBED_PATH } from '@/lib/rdkit-route'

// route-scoped: molstar (npm) only enters the bundle when this component renders
const MolstarViewer = lazy(() => import('./molstar/MolstarViewer'))

// The viewers touch WebGL and the DOM, so nothing here may render on the
// server — useHydrated is how this component waits for the client.

/**
 * RDKit 2D chemical structure viewer — self-hosted WASM, isolated in its own
 * document and framed in via <iframe> (see components/case-study/RdkitEmbed.tsx
 * and lib/rdkit-route.ts for why: it needs a CSP concession this page does not).
 * Molstar 3D viewer — loaded from the `molstar` npm package via
 * React.lazy(), so it code-splits into its own chunk instead of shipping
 * with every route.
 *
 * Both libraries demonstrate route-scoped loading of scientific
 * dependencies: neither contributes bytes to any other page.
 */
export default function MolecularViewer() {
  const hydrated = useHydrated()

  if (!hydrated) return null

  return (
    <div className="not-prose my-10 space-y-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Live demo: Molecular Viewer
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        RDKit.js loads <em>only on this page</em> — open DevTools &rarr; Network
        and filter &quot;rdkit&quot; to confirm route-scoped loading.
      </p>

      {/* Molstar 3D — full width */}
      <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-800">
        <div className="px-5 pt-3 pb-2 border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide dark:text-gray-300">
            Molstar &mdash; 3D Protein Structure
          </span>
          <span className="text-xs text-gray-400 ml-2 dark:text-gray-600">{DEMO_PDB} (crambin)</span>
        </div>
        <div className="p-4">
          <Suspense
            fallback={
              <div className="flex items-center justify-center text-gray-400 text-sm animate-pulse dark:text-gray-600" style={{ height: 480 }}>
                Loading Mol* (npm package, ~few MB, route-scoped)...
              </div>
            }
          >
            <MolstarViewer pdbId={DEMO_PDB} height={480} />
          </Suspense>
        </div>
      </div>

      {/*
        RDKit 2D — isolated in its own document (lib/rdkit-route.ts) rather
        than mounted here directly. RDKit needs 'wasm-unsafe-eval'/
        'unsafe-eval' to compile its WASM; Molstar above does not — measured
        by loading this page under a CSP with neither and watching Molstar
        render a full structure while only RDKit's compile step failed. So
        only RDKit's own document carries that concession; this page, and the
        ordinary Link that reaches it, need no special CSP treatment at all.

        sandbox: allow-scripts + allow-same-origin is the minimum RDKit needs
        (script execution, same-origin fetch of its own .wasm) — not a strong
        isolation boundary on a same-origin frame (the two together let framed
        script reach back out via the same mechanism they need to run at
        all), but it still closes off what this frame has no reason to do:
        top-level navigation, popups, forms, pointer lock. frame-ancestors on
        the embed's own response (proxy.ts) is the real boundary — it refuses
        to render inside anything but this origin's pages.
      */}
      <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-800">
        <iframe
          src={RDKIT_EMBED_PATH}
          title="RDKit.js 2D molecule structure viewer"
          data-testid="rdkit-frame"
          sandbox="allow-scripts allow-same-origin"
          style={{ width: '100%', height: 460, border: 'none', display: 'block' }}
        />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-600">
        <span>PDB data: <a href={`https://files.rcsb.org/download/${DEMO_PDB}.pdb`} target="_blank" rel="noopener noreferrer" className="underline">RCSB</a></span>
        <span>&middot;</span>
        <span>RDKit.js: v2025.3.4, self-hosted, loaded on-demand</span>
        <span>&middot;</span>
        <span>Molstar: npm package, loaded via React.lazy()</span>
      </div>
    </div>
  )
}
