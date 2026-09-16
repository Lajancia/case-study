import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

// /hire is not linked from anywhere: it is registered directly on B2B
// platforms, so arriving there means the visitor is on the contract track
// rather than the hiring one. Remember that so the header can offer a way
// back once they follow a link into the case studies.
const HIRE_PATH = new RegExp(`^/(?:(?:${routing.locales.join('|')})/)?hire/?$`)

// Deliberately a session cookie. A persistent one would still be showing the
// hire link to someone who opened it once and came back months later to read
// the site as a recruiter — the exact leak the split is there to avoid.
export const HIRE_TRACK_COOKIE = 'track'

export function proxy(request: NextRequest) {
  const response = handleI18nRouting(request)

  if (HIRE_PATH.test(request.nextUrl.pathname)) {
    response.cookies.set(HIRE_TRACK_COOKIE, 'hire', {
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
}
