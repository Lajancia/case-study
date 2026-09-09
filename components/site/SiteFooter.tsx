import { siteConfig, mailtoUrl } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 mt-16 dark:border-gray-800">
      <div className="mx-auto max-w-4xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500">
        <p>© {year} {siteConfig.name}. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href={mailtoUrl('Hello from your case study site')} className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">Email</a>
          <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">LinkedIn</a>
          <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">GitHub</a>
          <a href={siteConfig.social.medium} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">Medium</a>
          <a href={siteConfig.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors dark:hover:text-gray-100">
            Interactive portfolio
          </a>
        </div>
      </div>
    </footer>
  )
}