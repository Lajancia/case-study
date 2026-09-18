'use client'

import { useState, useEffect, useRef } from 'react'
import { DEMO_LIGAND_SMILES } from '@/lib/molecular-demo'

// Self-hosted, the way AD3 serves RDKit from its own /rdkit/ path. The files
// are copied out of the @rdkit/rdkit package into public/rdkit/ by
// scripts/copy-rdkit.mjs; RDKIT_BASE is where the loader finds the .wasm.
const RDKIT_SRC = '/rdkit/RDKit_minimal.js'
const RDKIT_BASE = '/rdkit'

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
 *
 * Lives in its own document (app/embed/rdkit-viewer/page.tsx), framed by
 * components/case-study/MolecularViewer.tsx via <iframe>, rather than
 * mounted directly on the case-study page. That split exists for the CSP:
 * RDKit needs 'wasm-unsafe-eval'/'unsafe-eval' to compile (see next.config.ts),
 * Molstar does not, and CSP applies per document — so isolating RDKit here
 * keeps that concession off the page around it instead of covering both
 * viewers. See lib/rdkit-route.ts for the fuller reasoning.
 *
 * The loading logic itself is unchanged from when it ran on the case-study
 * page directly; only the document it lives in moved.
 */
export default function RdkitEmbed() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const svgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const w = window as unknown as RDKitWindow

    // Already loaded + initialized
    if (w.RDKitModule) {
      renderSvg(w.RDKitModule)
      return
    }

    // Script loaded but WASM init already in progress
    const loadedInit = w.initRDKitModule
    if (loadedInit && !w._rdkitLoading) {
      w._rdkitLoading = true
      loadedInit({ locateFile: (path) => `${RDKIT_BASE}/${path}` })
        .then((Module) => {
          w.RDKitModule = Module
          renderSvg(Module)
        })
        .catch((e: unknown) => {
          setStatus('error')
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
              renderSvg(Module)
            })
            .catch((e: unknown) => {
              setStatus('error')
              setErrorDetail(`WASM: ${messageOf(e, 'unknown')}`)
            })
        } else {
          setStatus('error')
          setErrorDetail('initRDKitModule not found on window')
        }
      }
      script.onerror = () => {
        setStatus('error')
        setErrorDetail('Script load failed')
      }
      document.head.appendChild(script)
    }

    function renderSvg(Module: RDKitModule) {
      try {
        if (!svgRef.current) return
        const mol = Module.get_mol(DEMO_LIGAND_SMILES)
        if (mol) {
          const svg = mol.get_svg(400, 280)
          svgRef.current.innerHTML = svg
          mol.delete()
          setStatus('ready')
        } else {
          setStatus('error')
          setErrorDetail('get_mol returned null')
        }
      } catch (e) {
        setStatus('error')
        setErrorDetail(messageOf(e, 'render error'))
      }
    }
  }, [])

  return (
    <div>
      {/* Fixed hex, not gray-* tokens: the viewer body below is always white
          (RDKit's SVG output has fixed colors meant for a light background),
          so a header that flipped dark/light independently of it would read
          as broken rather than synced. gray-* isn't actually fixed either —
          app/globals.css's .dark block remaps the whole scale (gray-50 becomes
          a dark navy surface color, not a lighter gray), the same trap the
          loading/error states below already route around with literal hex.
          This document also no longer shares an origin with the parent
          (MolecularViewer.tsx), so it can't observe the parent's theme
          anyway — deliberately staying theme-independent throughout rather
          than half-syncing. */}
      <div className="px-5 pt-3 pb-2 border-b border-[#ece0cd] bg-[#f5ebdd]">
        <span className="text-xs font-semibold text-[#1b4273] uppercase tracking-wide">
          RDKit.js &mdash; 2D Molecule Structure
        </span>
        <span className="text-xs text-[#7b8ea6] ml-2">Aspirin (C₉H₈O₄)</span>
      </div>
      <div
        className="flex items-center justify-center bg-white"
        style={{ minHeight: 400 }}
      >
        {status === 'loading' && (
          // Fixed greys, not tokens: this panel is white in both themes, and
          // .dark remaps the grey scale to light values meant for dark backings.
          <div className="text-[#4b5563] text-sm animate-pulse px-4 text-center">
            <p>Loading RDKit.js (~2.5 MB WASM, served from this origin)...</p>
            <p className="text-xs mt-2">This library loads on-demand — zero bytes on other pages.</p>
          </div>
        )}
        {/* RDKit renders fixed-color SVG optimized for white background */}
        <div
          ref={svgRef}
          // Named so a test can assert on RDKit's own output. This document
          // has nothing else on it, but the name is kept for parity with how
          // it was addressed before the move.
          data-testid="rdkit-depiction"
          className={`items-center justify-center p-6 w-full ${status === 'ready' ? 'flex' : 'hidden'}`}
        />
        {status === 'error' && (
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
  )
}
