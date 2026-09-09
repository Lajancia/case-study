import { StructureRepresentationPresetProvider, presetStaticComponent } from 'molstar/lib/mol-plugin-state/builder/structure/representation-preset'
import { StateObjectRef } from 'molstar/lib/mol-state'

const PresetParams = {
  ...StructureRepresentationPresetProvider.CommonParams,
}

/**
 * Cartoon backbone, colored N-to-C so secondary structure motifs stay
 * visually distinguishable even on a single-chain protein.
 */
export const CartoonRainbowPreset = StructureRepresentationPresetProvider({
  id: 'case-study-cartoon-rainbow',
  display: { name: 'Cartoon (rainbow)' },
  params: () => PresetParams,
  async apply(ref, params, plugin): Promise<StructureRepresentationPresetProvider.Result> {
    const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref)
    if (!structureCell) return {}
    const components = {
      polymer: await presetStaticComponent(plugin, structureCell, 'polymer'),
    }
    const { update, builder, typeParams } = StructureRepresentationPresetProvider.reprBuilder(plugin, params)
    const representations = {
      polymer: builder.buildRepresentation(
        update,
        components.polymer,
        { type: 'cartoon', typeParams, color: 'sequence-id' },
        { tag: 'polymer' }
      ),
    }
    await update.commit({ revertOnError: true })
    plugin.managers.camera.reset()
    return { components, representations }
  },
})

/**
 * Full atomic detail — every atom as a sphere/stick, colored by element.
 */
export const BallAndStickPreset = StructureRepresentationPresetProvider({
  id: 'case-study-ball-and-stick',
  display: { name: 'Ball & stick' },
  params: () => PresetParams,
  async apply(ref, params, plugin): Promise<StructureRepresentationPresetProvider.Result> {
    const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref)
    if (!structureCell) return {}
    const components = {
      polymer: await presetStaticComponent(plugin, structureCell, 'polymer'),
    }
    const { update, builder, typeParams } = StructureRepresentationPresetProvider.reprBuilder(plugin, params)
    const representations = {
      polymer: builder.buildRepresentation(
        update,
        components.polymer,
        { type: 'ball-and-stick', typeParams, color: 'element-symbol' },
        { tag: 'polymer' }
      ),
    }
    await update.commit({ revertOnError: true })
    plugin.managers.camera.reset()
    return { components, representations }
  },
})

/**
 * Molecular surface — solvent-accessible envelope, useful for judging
 * binding-pocket shape at a glance.
 */
export const SurfacePreset = StructureRepresentationPresetProvider({
  id: 'case-study-surface',
  display: { name: 'Surface' },
  params: () => PresetParams,
  async apply(ref, params, plugin): Promise<StructureRepresentationPresetProvider.Result> {
    const structureCell = StateObjectRef.resolveAndCheck(plugin.state.data, ref)
    if (!structureCell) return {}
    const components = {
      polymer: await presetStaticComponent(plugin, structureCell, 'polymer'),
    }
    const { update, builder, typeParams } = StructureRepresentationPresetProvider.reprBuilder(plugin, params)
    const representations = {
      polymer: builder.buildRepresentation(
        update,
        components.polymer,
        { type: 'molecular-surface', typeParams: { ...typeParams, quality: 'custom', resolution: 0.5 }, color: 'sequence-id' },
        { tag: 'polymer' }
      ),
    }
    await update.commit({ revertOnError: true })
    plugin.managers.camera.reset()
    return { components, representations }
  },
})

export const CASE_STUDY_PRESETS = [
  { label: 'Cartoon', preset: CartoonRainbowPreset },
  { label: 'Ball & stick', preset: BallAndStickPreset },
  { label: 'Surface', preset: SurfacePreset },
]
