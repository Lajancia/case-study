import 'molstar/build/viewer/molstar.css'
import { useEffect, useRef, useState } from 'react'
import { createPluginUI } from 'molstar/lib/mol-plugin-ui'
import { renderReact18 } from 'molstar/lib/mol-plugin-ui/react18'
import { DefaultPluginUISpec } from 'molstar/lib/mol-plugin-ui/spec'
import { PluginConfig } from 'molstar/lib/mol-plugin/config'
import type { PluginUIContext } from 'molstar/lib/mol-plugin-ui/context'
import type { StateObjectRef } from 'molstar/lib/mol-state'
import type { PluginStateObject } from 'molstar/lib/mol-plugin-state/objects'
import { CASE_STUDY_PRESETS } from './presets'

interface MolstarViewerProps {
  pdbId: string
  height?: number
}

/**
 * Low-level Mol* embed (createPluginUI + DefaultPluginUISpec), not the
 * pre-built Viewer app — same integration style used in production: all
 * default side panels hidden, only the 3D viewport + our own preset
 * switcher are shown.
 */
export default function MolstarViewer({ pdbId, height = 480 }: MolstarViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pluginRef = useRef<PluginUIContext | null>(null)
  const structureRef = useRef<StateObjectRef<PluginStateObject.Molecule.Structure> | null>(null)
  // Survives React Strict Mode's mount→cleanup→remount replay (refs aren't
  // reset by it, unlike a plain local variable) so the second replayed
  // effect reuses the same in-flight creation instead of calling
  // createPluginUI a second time on the same container.
  const creationRef = useRef<Promise<PluginUIContext> | null>(null)
  const [ready, setReady] = useState(false)
  const [activePreset, setActivePreset] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      if (!containerRef.current) return
      try {
        if (!creationRef.current) {
          creationRef.current = createPluginUI({
            target: containerRef.current,
            render: renderReact18,
            spec: {
              ...DefaultPluginUISpec(),
              layout: { initial: { controlsDisplay: 'reactive' } },
              components: {
                controls: { left: 'none', right: 'none', top: 'none', bottom: 'none' },
              },
              config: [
                [PluginConfig.VolumeStreaming.Enabled, false],
                [PluginConfig.Viewport.ShowAnimation, false],
                [PluginConfig.Viewport.ShowExpand, false],
                [PluginConfig.Viewport.ShowControls, false],
                [PluginConfig.Viewport.ShowSelectionMode, false],
                [PluginConfig.Viewport.ShowSettings, false],
                [PluginConfig.Viewport.ShowReset, false],
                [PluginConfig.Viewport.ShowToggleFullscreen, false],
                [PluginConfig.Viewport.ShowScreenshotControls, false],
                [PluginConfig.Viewport.ShowIllumination, false],
                [PluginConfig.Viewport.ShowTrajectoryControls, false],
                [PluginConfig.Viewport.ShowXR, 'never'],
              ],
            },
          })
        }

        const plugin = await creationRef.current
        if (cancelled) return
        pluginRef.current = plugin

        const data = await plugin.builders.data.download(
          { url: `https://files.rcsb.org/download/${pdbId}.pdb` },
          { state: { isGhost: true } }
        )
        const trajectory = await plugin.builders.structure.parseTrajectory(data, 'pdb')
        await plugin.builders.structure.hierarchy.applyPreset(trajectory, 'default')
        const structure = plugin.managers.structure.hierarchy.current.structures[0]?.cell
        if (!structure) throw new Error('No structure produced from trajectory')
        structureRef.current = structure
        await plugin.builders.structure.representation.applyPreset(structure, CASE_STUDY_PRESETS[0].preset)

        if (!cancelled) setReady(true)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to initialize Mol*')
      }
    }
    init()

    return () => {
      cancelled = true
      pluginRef.current?.dispose()
      pluginRef.current = null
    }
  }, [pdbId])

  async function selectPreset(index: number) {
    const plugin = pluginRef.current
    const structure = structureRef.current
    if (!plugin || !structure) return
    setActivePreset(index)
    await plugin.builders.structure.representation.applyPreset(structure, CASE_STUDY_PRESETS[index].preset)
  }

  return (
    <div>
      <div className="flex gap-1.5 mb-2">
        {CASE_STUDY_PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            disabled={!ready}
            onClick={() => selectPreset(i)}
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              activePreset === i
                ? 'bg-blue-600 border-blue-600 text-white dark:bg-blue-500 dark:border-blue-500'
                : 'border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        ref={containerRef}
        className="relative rounded-md overflow-hidden bg-black"
        style={{ height }}
      />
      {!ready && !error && (
        <p className="text-xs text-gray-400 mt-2 dark:text-gray-600">Loading Mol* ({pdbId})…</p>
      )}
      {error && <p className="text-xs text-red-500 mt-2 dark:text-red-400">{error}</p>}
    </div>
  )
}
