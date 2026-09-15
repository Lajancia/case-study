import Link from 'next/link'
import { routing } from '@/i18n/routing'

// Fallback for paths the proxy skips (files with an extension, /api/*) and for
// notFound() thrown by app/[locale]/layout.tsx itself, where the locale layout
// is not available to wrap the UI. Everything else lands on
// app/[locale]/not-found.tsx instead.
export default function RootNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Link
          href={`/${routing.defaultLocale}`}
          className="mt-10 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
