import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: false,
  // next-intl writes NEXT_LOCALE regardless; over HTTPS it should not also be
  // willing to travel over plain HTTP. Off in development, where there is no
  // certificate and a Secure cookie would simply be dropped.
  localeCookie: { secure: process.env.NODE_ENV === 'production' },
})
