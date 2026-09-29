import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // `/` follows the browser's Accept-Language; every other URL names its
  // locale in the path. That keeps `/` the only response that differs per
  // visitor — the one path the CDN must not cache.
  localeDetection: true,
  // No NEXT_LOCALE cookie. next-intl would otherwise attach a Set-Cookie to
  // page responses, and a response that sets a cookie is not one a shared
  // cache should hand to every visitor (Cloudflare will not, by default). The cost: a visitor who switched language is not remembered at
  // `/` next time — Accept-Language decides again. Locale-prefixed links,
  // which is how the site is shared, are unaffected.
  localeCookie: false,
})
