'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { DEMO_PDB, DEMO_LIGAND_SMILES } from '@/lib/molecular-demo'

const RDKIT_CDN = 'https://cdn.jsdelivr.net/npm/@rdkit/rdkit@2025.3.4-1.0.0/dist/RDKit_minimal.js'
const RDKIT_BASE = 'https://cdn.jsdelivr.net/npm/@rdkit/rdkit@2025.3.4-1.0.0/dist'

// route-scoped: molstar (npm) only enters the bundle when this component renders
const MolstarViewer = lazy(() => import('./molstar/MolstarViewer'))

/**
 * RDKit 2D chemical structure viewer — loaded from CDN on demand.
 * Molstar 3D viewer — loaded from the `molstar` npm package via
 * React.lazy(), so it code-splits into its own chunk instead of shipping
 * with every route.
 *
 * Both libraries demonstrate route-scoped loading of scientific
 * dependencies: neither contributes bytes to any other page.
 */

export default function MolecularViewer() {
  const [mounted, setMounted] = useState(false)
  const [rdkitStatus, setRdkitStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const rdkitSvgRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  // ── Load RDKit.js from CDN (route-scoped) ──
  useEffect(() => {
    if (!mounted) return

    const w = window as any

    // Already loaded + initialized
    if (w.RDKitModule) {
      renderRdkItSvg(w.RDKitModule)
      return
    }

    // Script loaded but WASM init already in progress
    if (typeof w.initRDKitModule === 'function' && !w._rdkitLoading) {
      w._rdkitLoading = true
      w.initRDKitModule({ locateFile: (path: string) => `${RDKIT_BASE}/${path}` }).then((Module: any) => {
        w.RDKitModule = Module
        renderRdkItSvg(Module)
      }).catch((e: any) => {
        setRdkitStatus('error')
        setErrorDetail(e?.message || 'WASM init failed')
      })
      return
    }

    // Not loaded yet — fetch CDN script
    if (!w._rdkitLoading) {
      w._rdkitLoading = true
      const script = document.createElement('script')
      script.src = RDKIT_CDN
      script.async = true
      script.onload = () => {
        // initRDKitModule is a global async function that returns the Module
        if (typeof w.initRDKitModule === 'function') {
          w.initRDKitModule({ locateFile: (path: string) => `${RDKIT_BASE}/${path}` }).then((Module: any) => {
            w.RDKitModule = Module
            renderRdkItSvg(Module)
          }).catch((e: any) => {
            setRdkitStatus('error')
            setErrorDetail(`WASM: ${e?.message || 'unknown'}`)
          })
        } else {
          setRdkitStatus('error')
          setErrorDetail('initRDKitModule not found on window')
        }
      }
      script.onerror = (e) => {
        setRdkitStatus('error')
        setErrorDetail('Script load failed')
      }
      document.head.appendChild(script)
    }

    function renderRdkItSvg(Module: any) {
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
      } catch (e: any) {
        setRdkitStatus('error')
        setErrorDetail(e?.message || 'render error')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  if (!mounted) return null

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
            <div className="text-gray-400 text-sm animate-pulse px-4 text-center">
              <p>Loading RDKit.js (~2.5 MB WASM) from CDN...</p>
              <p className="text-xs mt-2">This library loads on-demand — zero bytes on other pages.</p>
            </div>
          )}
          {/* RDKit renders fixed-color SVG optimized for white background */}
          <div
            ref={rdkitSvgRef}
            className={`items-center justify-center p-6 w-full ${rdkitStatus === 'ready' ? 'flex' : 'hidden'}`}
          />
          {rdkitStatus === 'error' && (
            <div className="text-red-500 text-sm text-center p-4">
              <p>Failed to load RDKit.js</p>
              {errorDetail && <p className="text-xs mt-1 text-gray-400 break-all dark:text-gray-600">{errorDetail}</p>}
              <p className="text-xs mt-2 text-gray-400 dark:text-gray-600">
                CDN: {RDKIT_CDN}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-600">
        <span>PDB data: <a href={`https://files.rcsb.org/download/${DEMO_PDB}.pdb`} target="_blank" rel="noopener noreferrer" className="underline">RCSB</a></span>
        <span>&middot;</span>
        <span>RDKit.js: v2025.3.4, loaded on-demand</span>
        <span>&middot;</span>
        <span>Molstar: npm package, loaded via React.lazy()</span>
      </div>
    </div>
  )
}