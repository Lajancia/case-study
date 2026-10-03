import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { RDKIT_EMBED_PATH } from './lib/rdkit-route'

const handleI18nRouting = createMiddleware(routing)

// The RDKit embed sits outside app/[locale] (lib/rdkit-route.ts) — it has
// no locale-prefixed identity, and handing it to next-intl finds that out
// the hard way: with localePrefix 'always', next-intl redirects any
// unprefixed path to one, e.g. /en/embed/rdkit-viewer. That 404s (there is
// no app/[locale]/embed route). Skip next-intl entirely for it. This is
// unrelated to the CSP now — headers are static (next.config.ts) — it's
// purely to avoid the unwanted redirect/404.
const RDKIT_PATH = new RegExp(`^${RDKIT_EMBED_PATH}/?$`)

export function proxy(request: NextRequest) {
  if (RDKIT_PATH.test(request.nextUrl.pathname)) {
    return
  }
  return handleI18nRouting(request)
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
