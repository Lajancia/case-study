import type { Metadata } from 'next'
import RdkitEmbed from '@/components/case-study/RdkitEmbed'

// Not a page anyone visits directly, and it has nothing to say to a search
// engine — keep it out of results rather than let it turn up as a bare,
// out-of-context panel.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

/**
 * The RDKit.js viewer, alone. Framed by <iframe> from
 * components/case-study/MolecularViewer.tsx, so the CSP concession RDKit
 * needs to compile its WASM (see proxy.ts and lib/rdkit-route.ts) applies to
 * this document only, not to the case-study page around it.
 */
export default function RdkitViewerEmbedPage() {
  return <RdkitEmbed />
}
