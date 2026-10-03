import { ALLOWED_PDB_IDS, RCSB_URL } from '@/lib/molecular-demo'

const ALLOWED = new Set<string>(ALLOWED_PDB_IDS)

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pdbId: string }> },
) {
  const { pdbId } = await params
  const normalized = pdbId.toUpperCase()

  if (!ALLOWED.has(normalized)) {
    return new Response('Not found', { status: 404 })
  }

  const upstream = await fetch(`${RCSB_URL}/${normalized}.pdb`, {
    // The demo structure is immutable enough for the site, and keeping the
    // response cached avoids turning the same-origin proxy into repeat work.
    next: { revalidate: 86_400 },
  })

  if (!upstream.ok) {
    return new Response('Unable to load structure', { status: 502 })
  }

  return new Response(await upstream.text(), {
    headers: {
      'Content-Type': 'chemical/x-pdb; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
