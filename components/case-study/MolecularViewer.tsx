'use client'

import { useState, useEffect, useRef } from 'react'
import { DEMO_PDB, DEMO_LIGAND_SMILES } from '@/lib/molecular-demo'

/**
 * RDKit 2D chemical structure viewer — loaded from CDN on demand.
 * 
 * This component demonstrates route-scoped loading of scientific libraries:
 * RDKit.js (WASM, ~2.5 MB) only loads on this page and contributes zero
 * bytes to any other route.
 * 
 * Molstar 3D viewer is embedded via iframe from molstar.org/viewer —
 * it loads independently of the page's JS bundle.
 */

export default function MolecularViewer() {
  const [mounted, setMounted] = useState(false)
  const [rdkitStatus, setRdkitStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [iframeLoaded, setIframeLoaded] = useState(false)
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

    // Script loaded but WASM not yet initialized — Module is the promise
    if (typeof w.initRDKitModule === 'function' && !w._rdkitLoading) {
      w._rdkitLoading = true
      w.initRDKitModule().then((Module: any) => {
        w.RDKitModule = Module
        renderRdkItSvg(Module)
      }).catch(() => setRdkitStatus('error'))
      return
    }

    // Not loaded yet — fetch CDN script
    if (!w._rdkitLoading) {
      w._rdkitLoading = true
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@rdkit/rdkit@latest/dist/RDKit_minimal.js'
      script.async = true
      script.onload = () => {
        if (typeof w.initRDKitModule === 'function') {
          w.initRDKitModule().then((Module: any) => {
            w.RDKitModule = Module
            renderRdkItSvg(Module)
          }).catch(() => setRdkitStatus('error'))
        } else {
          setRdkitStatus('error')
        }
      }
      script.onerror = () => setRdkitStatus('error')
      document.head.appendChild(script)
    }

    function renderRdkItSvg(Module: any) {
      try {
        if (!rdkitSvgRef.current) return
        const mol = Module.get_mol(DEMO_LIGAND_SMILES)
        if (mol) {
          const svg = mol.get_svg({ width: 300, height: 220 })
          rdkitSvgRef.current.innerHTML = svg
          mol.delete()
          setRdkitStatus('ready')
        } else {
          setRdkitStatus('error')
        }
      } catch {
        setRdkitStatus('error')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  if (!mounted) return null

  const molstarUrl = `https://molstar.org/viewer/?pdb=${DEMO_PDB}`

  return (
    <div className="not-prose my-10 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Live demo: Molecular Viewer
      </h3>
      <p className="text-sm text-gray-500">
        RDKit.js loads <em>only on this page</em> — open DevTools &rarr; Network
        and filter &quot;rdkit&quot; to confirm route-scoped loading.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Molstar 3D via iframe */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Molstar &mdash; 3D Protein Structure
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {DEMO_PDB} (crambin)
            </span>
          </div>
          <div className="relative bg-gray-100" style={{ minHeight: 380 }}>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm animate-pulse z-10">
                Loading Molstar viewer...
              </div>
            )}
            <iframe
              src={molstarUrl}
              className="w-full border-0"
              style={{ height: 380 }}
              title="Molstar 3D protein viewer"
              onLoad={() => setIframeLoaded(true)}
              allow="fullscreen"
            />
          </div>
        </div>

        {/* RDKit 2D */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              RDKit.js &mdash; 2D Molecule Structure
            </span>
            <span className="text-xs text-gray-400 ml-2">Aspirin (C₉H₈O₄)</span>
          </div>
          <div
            className="flex items-center justify-center bg-white"
            style={{ minHeight: 380 }}
          >
            {rdkitStatus === 'loading' && (
              <div className="text-gray-400 text-sm animate-pulse px-4 text-center">
                <p>Loading RDKit.js (~2.5 MB WASM)...</p>
                <p className="text-xs mt-2">This library loads on-demand — zero bytes on other pages.</p>
              </div>
            )}
            {rdkitStatus === 'ready' && (
              <div
                ref={rdkitSvgRef}
                className="flex items-center justify-center p-4 w-full"
              />
            )}
            {rdkitStatus === 'error' && (
              <div className="text-red-500 text-sm text-center p-4">
                <p>Failed to load RDKit.js</p>
                <p className="text-xs mt-2 text-gray-400">
                  CDN may be blocked or the WASM module failed to compile.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
        <span>Molstar: <a href={molstarUrl} target="_blank" rel="noopener noreferrer" className="underline">open fullscreen</a></span>
        <span>&middot;</span>
        <span>RDKit.js: loaded from CDN (route-scoped)</span>
        <span>&middot;</span>
        <span>PDB data: <a href={`https://files.rcsb.org/download/${DEMO_PDB}.pdb`} target="_blank" rel="noopener noreferrer" className="underline">RCSB</a></span>
      </div>
    </div>
  )
}