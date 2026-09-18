'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

interface NavLink {
  label: string
  href: string
  external?: boolean
}

interface MobileNavProps {
  links: NavLink[]
  /** null on the contract track, where a resume is off message. */
  resumeUrl: string | null
  resumeLabel: string
  openLabel: string
  closeLabel: string
}

export function MobileNav({ links, resumeUrl, resumeLabel, openLabel, closeLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-90 transition dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
            {links.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
                >
                  {link.label}
                </Link>
              )
            )}
            {resumeUrl && (
              <a
                href={resumeUrl}
                download
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors dark:hover:text-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
                {resumeLabel}
              </a>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}
