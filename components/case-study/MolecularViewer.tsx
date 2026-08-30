'use client'

import { useState, useEffect, useRef } from 'react'
import { DEMO_PDB, DEMO_LIGAND_SMILES, RCSB_URL } from '@/lib/molecular-demo'

/**
 * Molstar 3D viewer + RDKit 2D depiction — both loaded route-scoped.
 * 
 * Molstar handles 3D protein structure rendering from PDB data.
 * RDKit.js (loaded from CDN) renders a 2D chemical structure SVG.
 * Neither library adds a byte to pages that don't import this component.
 */

export default function MolecularViewer() {
  const [mounted, setMounted] = useState(false)
  const [molstarStatus, setMolstarStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [rdkitStatus, setRdkitStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const molstarTargetRef = useRef<HTMLDivElement>(null)
  const rdkitSvgRef = useRef<HTMLDivElement>(null)
  const pluginRef = useRef<any>(null)

  useEffect(() => setMounted(true), [])

  // ── Load Molstar 3D viewer ──
  useEffect(() => {
    if (!mounted || !molstarTargetRef.current) return

    let disposed = false

    async function initMolstar() {
      try {
        const { PluginContext } = await import('molstar/lib/mol-plugin/context')
        const { DefaultPluginSpec } = await import('molstar/lib/mol-plugin/spec')

        if (disposed || !molstarTargetRef.current) return

        const spec = DefaultPluginSpec()
        spec.layout = { initial: { isExpanded: false, showControls: false } }
        const plugin = new PluginContext(spec)
        pluginRef.current = plugin

        await plugin.init()

        if (disposed) { plugin.dispose(); return }

        // Mount into the div — creates canvas + viewer
        await plugin.mountAsync(molstarTargetRef.current)

        if (disposed) { return }

        // Download PDB from RCSB — the same source the AD3 platform uses
        // for protein structure data
        const data = await plugin.builders.data.download(
          { url: `${RCSB_URL}/${DEMO_PDB}.pdb` },
          { state: { isGhost: true } }
        )

        if (disposed) { return }

        const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb')

        if (disposed) { return }

        // Auto-apply default representation preset (creates model + structure + 3D view)
        await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default')

        if (!disposed) {
          setMolstarStatus('ready')
        }
      } catch (e) {
        if (!disposed) {
          setMolstarStatus('error')
          setErrorMsg(e instanceof Error ? `${e.name}: ${e.message}` : String(e))
        }
      }
    }

    initMolstar()

    return () => { disposed = true; pluginRef.current?.dispose?.() }
  }, [mounted])

  // ── Load RDKit.js from CDN for 2D molecule depiction ──
  useEffect(() => {
    if (!mounted) return

    const globalRDKit = (window as any).RDKit

    if (globalRDKit && globalRDKit.Module) {
      // Already loaded and initialized
      renderRdkitSvg()
      return
    }

    // RDKit needs two-step setup: load script, then init WASM module
    if (typeof globalRDKit !== 'undefined' && globalRDKit.initRDKitModule) {
      globalRDKit.initRDKitModule().then(() => {
        renderRdkitSvg()
      }).catch(() => {
        setRdkitStatus('error')
      })
      return
    }

    // Load from CDN
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@rdkit/rdkit@2023.9.5/dist/RDKit_minimal.js'
    script.async = true
    script.onload = () => {
      const RDKit = (window as any).RDKit
      if (RDKit && RDKit.initRDKitModule) {
        RDKit.initRDKitModule().then(() => {
          renderRdkitSvg()
        }).catch(() => {
          setRdkitStatus('error')
        })
      } else {
        setRdkitStatus('error')
      }
    }
    script.onerror = () => setRdkitStatus('error')
    document.head.appendChild(script)

    function renderRdkitSvg() {
      try {
        const RDKit = (window as any).RDKit
        if (!rdkitSvgRef.current || !RDKit || !RDKit.Module) return

        const mol = RDKit.get_mol(DEMO_LIGAND_SMILES)
        if (mol) {
          const svg = mol.get_svg({ width: 280, height: 200 })
          rdkitSvgRef.current.innerHTML = svg
          mol.delete()
          setRdkitStatus('ready')
        } else {
          setRdkitStatus('error')
          setErrorMsg('RDKit: could not parse SMILES')
        }
      } catch (e) {
        setRdkitStatus('error')
        setErrorMsg(e instanceof Error ? e.message : String(e))
      }
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="not-prose my-10 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Live demo: Molstar &amp; RDKit Viewer
      </h3>
      <p className="text-sm text-gray-500">
        Both libraries load <em>only on this page</em> — open DevTools &rarr; Network and filter
        &quot;molstar&quot; or &quot;rdkit&quot; to confirm route-scoped loading.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Molstar 3D */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Molstar &mdash; 3D Protein Structure
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {DEMO_PDB} (crambin)
            </span>
          </div>
          <div
            ref={molstarTargetRef}
            className="relative bg-black"
            style={{ minHeight: 360 }}
          >
            {molstarStatus === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm animate-pulse bg-gray-900">
                <span className="bg-gray-900 px-3 py-1 rounded">Loading Molstar (1.2 MB) ...</span>
              </div>
            )}
            {molstarStatus === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm p-4 text-center bg-gray-900">
                <div>
                  <p>Molstar viewer failed to load</p>
                  {errorMsg && <p className="text-xs mt-2 text-gray-400 break-all max-w-xs">{errorMsg}</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RDKit 2D */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 pt-3 pb-2 border-b border-gray-100 bg-gray-50">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              RDKit &mdash; 2D Molecule Structure
            </span>
            <span className="text-xs text-gray-400 ml-2">Aspirin (C₉H₈O₄)</span>
          </div>
          <div className="flex items-center justify-center bg-white" style={{ minHeight: 360 }}>
            {rdkitStatus === 'loading' && (
              <div className="text-gray-400 text-sm animate-pulse">
                Loading RDKit.js (2.5 MB WASM) ...
              </div>
            )}
            {rdkitStatus === 'ready' && (
              <div ref={rdkitSvgRef} className="p-4 flex items-center justify-center" />
            )}
            {rdkitStatus === 'error' && (
              <div className="text-red-500 text-sm text-center p-4">
                <p>Failed to load RDKit.js</p>
                <p className="text-xs mt-2 text-gray-400">
                  The CDN may be blocked or the WASM module failed to compile.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
        <span>Source: <a href={`${RCSB_URL}/${DEMO_PDB}.pdb`} target="_blank" rel="noopener noreferrer" className="underline">{DEMO_PDB} PDB</a></span>
        <span>&middot;</span>
        <span>Molstar: MIT license</span>
        <span>&middot;</span>
        <span>RDKit.js: BSD license</span>
        <span>&middot;</span>
        <span>Both loaded on-demand</span>
      </div>
    </div>
  )
}