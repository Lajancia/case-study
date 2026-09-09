import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { ThemeToggle } from '@/components/site/ThemeToggle'
import { MobileNav } from '@/components/site/MobileNav'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Technical Writing', href: siteConfig.social.medium, external: true },
]

export function SiteHeader() {
  const contactHref = siteConfig.calendlyUrl || `mailto:${siteConfig.email}`
  return (
    <header className="relative border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900 hover:text-blue-600 transition-colors dark:text-gray-100 dark:hover:text-blue-400">
          {siteConfig.name}
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Link href="/about" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">About</Link>
          <Link href="/work" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">Work</Link>
          <a href={siteConfig.social.medium} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">
            Technical Writing
          </a>
          <a
            href={siteConfig.resumeUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-1.5 text-gray-700 hover:border-gray-400 transition-colors dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            Resume
          </a>
          <a href={contactHref} className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-white text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
            Contact
          </a>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <MobileNav links={NAV_LINKS} contactHref={contactHref} resumeUrl={siteConfig.resumeUrl} />
        </div>
      </div>
    </header>
  )
}