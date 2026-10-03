// Simple PDB IDs for demo: 1CRN (small protein, ~327 atoms), 4HHB (hemoglobin)
export const DEMO_PDB = '1CRN'
export const DEMO_LIGAND_SMILES = 'CC(=O)OC1=CC=CC=C1C(=O)O' // aspirin
export const RCSB_URL = 'https://files.rcsb.org/download'
export const ALLOWED_PDB_IDS = [DEMO_PDB] as const

export function pdbDataPath(pdbId: string) {
  return `/api/pdb/${pdbId}`
}
