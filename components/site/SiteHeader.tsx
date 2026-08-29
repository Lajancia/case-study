import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900 hover:text-blue-600 transition-colors">
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/work" className="hover:text-gray-900 transition-colors">Work</Link>
          <a href={siteConfig.social.medium} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
            Technical Writing
          </a>
          <Link href="/#about" className="hover:text-gray-900 transition-colors">About</Link>
          <a href={siteConfig.calendlyUrl || `mailto:${siteConfig.email}`} className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </header>
  )
}