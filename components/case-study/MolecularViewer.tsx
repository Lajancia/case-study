'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { DEMO_PDB, DEMO_LIGAND_SMILES } from '@/lib/molecular-demo'
import { useHydrated } from '@/lib/use-hydrated'

// Self-hosted, the way AD3 serves RDKit from its own /rdkit/ path. The files
// are copied out of the @rdkit/rdkit package into public/rdkit/ by
// scripts/copy-rdkit.mjs; RDKIT_BASE is where the loader finds the .wasm.
const RDKIT_SRC = '/rdkit/RDKit_minimal.js'
const RDKIT_BASE = '/rdkit'

// route-scoped: molstar (npm) only enters the bundle when this component renders
const MolstarViewer = lazy(() => import('./molstar/MolstarViewer'))

// The viewers touch WebGL and the DOM, so nothing here may render on the
// server — useHydrated is how this component waits for the client.

/**
 * The slice of RDKit.js this demo actually touches. @rdkit/rdkit is a
 * dependency for its asset files alone — importing it, even only for its type
 * declarations, risks pulling the library into a bundle and undoing the
 * route-scoped loading this page is about. So the surface is described here.
 */
interface RDKitMol {
  get_svg(width: number, height: number): string
  delete(): void
}

interface RDKitModule {
  get_mol(smiles: string): RDKitMol | null
}

interface RDKitWindow extends Window {
  RDKitModule?: RDKitModule
  initRDKitModule?: (options: {
    locateFile: (path: string) => string
  }) => Promise<RDKitModule>
  /** Keeps a second mount from kicking off a second WASM init. */
  _rdkitLoading?: boolean
}

const messageOf = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback

/**
 * RDKit 2D chemical structure viewer — self-hosted WASM, loaded on demand.
 * Molstar 3D viewer — loaded from the `molstar` npm package via
 * React.lazy(), so it code-splits into its own chunk instead of shipping
 * with every route.
 *
 * Both libraries demonstrate route-scoped loading of scientific
 * dependencies: neither contributes bytes to any other page.
 */

export default function MolecularViewer() {
  const hydrated = useHydrated()
  const [rdkitStatus, setRdkitStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const rdkitSvgRef = useRef<HTMLDivElement>(null)

  // ── Load RDKit.js from this origin (route-scoped) ──
  useEffect(() => {
    if (!hydrated) return

    const w = window as unknown as RDKitWindow

    // Already loaded + initialized
    if (w.RDKitModule) {
      renderRdkitSvg(w.RDKitModule)
      return
    }

    // Script loaded but WASM init already in progress
    const loadedInit = w.initRDKitModule
    if (loadedInit && !w._rdkitLoading) {
      w._rdkitLoading = true
      loadedInit({ locateFile: (path) => `${RDKIT_BASE}/${path}` })
        .then((Module) => {
          w.RDKitModule = Module
          renderRdkitSvg(Module)
        })
        .catch((e: unknown) => {
          setRdkitStatus('error')
          setErrorDetail(messageOf(e, 'WASM init failed'))
        })
      return
    }

    // Not loaded yet — fetch the script
    if (!w._rdkitLoading) {
      w._rdkitLoading = true
      const script = document.createElement('script')
      script.src = RDKIT_SRC
      script.async = true
      script.onload = () => {
        // initRDKitModule is a global async function that returns the Module
        const init = w.initRDKitModule
        if (init) {
          init({ locateFile: (path) => `${RDKIT_BASE}/${path}` })
            .then((Module) => {
              w.RDKitModule = Module
              renderRdkitSvg(Module)
            })
            .catch((e: unknown) => {
              setRdkitStatus('error')
              setErrorDetail(`WASM: ${messageOf(e, 'unknown')}`)
            })
        } else {
          setRdkitStatus('error')
          setErrorDetail('initRDKitModule not found on window')
        }
      }
      script.onerror = () => {
        setRdkitStatus('error')
        setErrorDetail('Script load failed')
      }
      document.head.appendChild(script)
    }

    function renderRdkitSvg(Module: RDKitModule) {
      try {
        if (!rdkitSvgRef.current) return
        const mol = Module.get_mol(DEMO_LIGAND_SMILES)
        if (mol) {
          const svg = mol.get_svg(400, 280)
          rdkitSvgRef.current.innerHTML = svg
          mol.delete()
          setRdkitStatus('ready')
        } else {
          setRdkitStatus('error')
          setErrorDetail('get_mol returned null')
        }
      } catch (e) {
        setRdkitStatus('error')
        setErrorDetail(messageOf(e, 'render error'))
      }
    }
  }, [hydrated])

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

      {/* RDKit 2D — full width */}
      <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-800">
        <div className="px-5 pt-3 pb-2 border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide dark:text-gray-300">
            RDKit.js &mdash; 2D Molecule Structure
          </span>
          <span className="text-xs text-gray-400 ml-2 dark:text-gray-600">Aspirin (C₉H₈O₄)</span>
        </div>
        <div
          className="flex items-center justify-center bg-white"
          style={{ minHeight: 400 }}
        >
          {rdkitStatus === 'loading' && (
            // Fixed greys, not tokens: this panel is white in both themes, and
            // .dark remaps the grey scale to light values meant for dark backings.
            <div className="text-[#4b5563] text-sm animate-pulse px-4 text-center">
              <p>Loading RDKit.js (~2.5 MB WASM, served from this origin)...</p>
              <p className="text-xs mt-2">This library loads on-demand — zero bytes on other pages.</p>
            </div>
          )}
          {/* RDKit renders fixed-color SVG optimized for white background */}
          <div
            ref={rdkitSvgRef}
            // Named so a test can assert on RDKit's own output. Reaching for
            // the first <svg> on the page finds the theme toggle in the header
            // and passes whatever RDKit did.
            data-testid="rdkit-depiction"
            className={`items-center justify-center p-6 w-full ${rdkitStatus === 'ready' ? 'flex' : 'hidden'}`}
          />
          {rdkitStatus === 'error' && (
            <div data-testid="rdkit-error" className="text-[#b91c1c] text-sm text-center p-4">
              <p>Failed to load RDKit.js</p>
              {errorDetail && <p className="text-xs mt-1 text-[#4b5563] break-all">{errorDetail}</p>}
              <p className="text-xs mt-2 text-[#4b5563]">
                Source: {RDKIT_SRC}
              </p>
            </div>
          )}
        </div>
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