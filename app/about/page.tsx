import { Metadata } from 'next'
import { siteConfig, mailtoUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, experience, and skills — Soomin Hwang, frontend engineer for data-intensive React products.',
}

const SKILLS = [
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Zustand', 'TanStack Query', 'React Hook Form',
  'Molstar', 'RDKit', 'Three.js', 'ApexCharts',
  'Playwright', 'Cypress',
  'Jenkins', 'Docker', 'Docker Compose', 'GitLab', 'GitHub',
  'Snyk', 'OWASP ZAP', 'SonarQube',
  'Django', 'Python', 'Spring Boot',
]

interface Role {
  company: string
  companyUrl?: string
  title: string
  period: string
  bullets: string[]
  note?: string
}

const EXPERIENCE: Role[] = [
  {
    company: 'Arontier',
    title: 'Frontend Engineer, Platform Team',
    period: 'Mar 2025 – present',
    bullets: [
      'Own frontend development on AD3, a protein structure analysis platform — Molstar/RDKit-based 3D visualization, analysis parameter forms, and route-scoped bundle optimization (32MB → 6.5MB, Lighthouse 29 → 78).',
      'Built viewer and interaction UI for a digital pathology (WSI) platform, including security-requirement response for an on-premise, regulated deployment.',
      'Led a Cypress → Playwright migration and designed a shared Jenkins Build-Test-Scan-Deploy pipeline (Snyk, OWASP ZAP, SonarQube) used across three frontend products — cut manual regression testing from ~5 hours to ~1 hour per release.',
      'Built a data-visualization archive for antibody-drug conjugate (ADC) research, and introduced a Claude Code-based workflow for automated test generation.',
    ],
  },
  {
    company: 'Illuminarian',
    title: 'Frontend Engineer',
    period: 'Jun 2024 – Feb 2025 · 9 months',
    bullets: [
      'Migrated to a Next.js 14 standalone build + pnpm, cutting the Docker image from 1.3GB to 500MB and deploy time from 15 minutes to under 3.',
      'Built a recruiting and applicant-management service plus its admin panel (Next.js 14, React Hook Form, React Query).',
      'Introduced MSW to let frontend development and testing proceed ahead of backend API availability.',
    ],
    note: 'Left when the company ceased operations.',
  },
  {
    company: 'Yura',
    title: 'Frontend Engineer & API Developer',
    period: 'Oct 2022 – May 2024 · 1 yr 8 mo',
    bullets: [
      'Designed and built a chart-based monitoring dashboard for a Serbia-based production plant, from Figma design through React/MUI implementation to a Spring Boot + MariaDB backend.',
      'Visualized per-product, per-line AOI pass rates with ApexCharts; the resulting real-time monitoring cut the AOI defect rate by roughly 20%.',
      'Coordinated directly with the Serbia-based plant team in English on process formulas and feedback.',
    ],
  },
  {
    company: 'commON srl',
    title: 'Frontend Intern',
    period: 'Nov 2021 – May 2022 · 7 months',
    bullets: [
      'Built the official website and a magazine-display platform for a Milan-based startup using Vue.js/Vuetify.',
      'Worked in a multinational team on a fashion-magazine and event-marketing web product, and improved portfolio UX for social-driven traffic.',
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-3">About</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-4 dark:text-gray-400">
        {siteConfig.tagline}
      </p>
      <p className="text-sm text-gray-500 mb-12 dark:text-gray-500">
        {siteConfig.availability.status} — {siteConfig.availability.timezone}
      </p>

      <section className="mb-16">
        <p className="text-gray-700 leading-relaxed dark:text-gray-300">
          I build React/Next.js products end to end — from backend API integration through
          CI/CD, test automation, and security review. Most of my recent work has been on
          data-intensive platforms in biotech: 3D molecular visualization, scientific charting,
          and the bundle-size and delivery-pipeline discipline that keeps those products fast to
          load and safe to ship. I also use Claude Code and Codex to automate parts of testing,
          review, and refactoring in day-to-day development.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">Experience</h2>
        <div className="space-y-10">
          {EXPERIENCE.map((role) => (
            <div key={`${role.company}-${role.period}`} className="border-l-2 border-gray-200 pl-5 dark:border-gray-800">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{role.company}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-500">— {role.title}</span>
              </div>
              <p className="text-xs text-gray-400 mb-3 dark:text-gray-600">{role.period}</p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                {role.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-gray-300 dark:text-gray-700">&middot;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {role.note && (
                <p className="text-xs text-gray-400 mt-2 italic dark:text-gray-600">{role.note}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((item) => (
            <span key={item} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full dark:bg-gray-800 dark:text-gray-300">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">Education</h2>
        <div className="border-l-2 border-gray-200 pl-5 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Hankuk University of Foreign Studies (Yongin)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">Computer &amp; Electronic Systems Engineering &middot; 2018 – 2023</p>
        </div>
      </section>

      <section className="text-center py-12 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-3">Let&apos;s work together</h2>
        <p className="text-gray-600 mb-6 dark:text-gray-400">Available for contract and B2B engagements from October 2026.</p>
        <div className="flex justify-center gap-4">
          <a
            href={mailtoUrl('Hello from your about page')}
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Email Soomin
          </a>
        </div>
      </section>
    </div>
  )
}
