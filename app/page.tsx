import Link from 'next/link'
import { siteConfig, mailtoUrl } from '@/lib/site'
import { caseStudies } from '@/lib/case-studies'

export default function HomePage() {
  const featured = caseStudies[0]
  return (
    <div className="mx-auto max-w-4xl px-6">
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-4">
          {siteConfig.tagline}
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-6">
          성능 최적화, 과학 시각화, 테스트 자동화, 배포 품질 — 데이터 중심 React 제품을 위한 모든 것.
        </p>
        <p className="text-sm text-gray-500 mb-8">{siteConfig.availability.status} — {siteConfig.availability.timezone}</p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/work"
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            View case study
          </Link>
          {siteConfig.calendlyUrl ? (
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-gray-300 px-6 py-2.5 text-gray-700 font-medium hover:border-gray-400 transition-colors"
            >
              Book a call
            </a>
          ) : (
            <a
              href={mailtoUrl('Hello from your case study site')}
              className="inline-flex items-center rounded-full border border-gray-300 px-6 py-2.5 text-gray-700 font-medium hover:border-gray-400 transition-colors"
            >
              Email Soomin
            </a>
          )}
        </div>
      </section>

      {/* Featured result */}
      {featured && (
        <section className="border border-gray-200 rounded-lg p-6 sm:p-8 mb-16 hover:border-gray-300 transition-colors">
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-2">{featured.industry}</div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">{featured.title}</h2>
          <p className="text-gray-600 text-sm mb-4">{featured.description}</p>
          <div className="grid grid-cols-2 gap-6 mb-4">
            {featured.outcomes.map((outcome) => (
              <div key={outcome.label}>
                <div className="text-sm text-gray-500 mb-0.5">{outcome.label}</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-400 line-through">{outcome.before}</span>
                  <span className="text-xl font-bold text-green-700">{outcome.after}</span>
                  <span className="text-green-600 font-semibold">{outcome.change}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href={`/work/${featured.slug}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
            Read full case study →
          </Link>
        </section>
      )}

      {/* Engagement types */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-2">협업 방식</h2>
        <p className="text-sm text-gray-500 mb-6">월 단위, 스프린트, 또는 프로젝트 단위 B2B 계약.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">프런트엔드 개발</h3>
            <p className="text-sm text-gray-600 mb-4">
              데이터 집약적 애플리케이션을 위한 React / Next.js 제품 개발 — 대시보드, 과학 도구, 3D 시각화 인터페이스, 디자인 시스템.
            </p>
            <p className="text-xs text-gray-500">B2B 계약 &middot; 월간 또는 스프린트 기준</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-2">성능 및 배포 품질</h3>
            <p className="text-sm text-gray-600 mb-4">
              번들 최적화, Lighthouse 개선, 테스트 자동화, CI/CD 강화 — 기존 개발에 통합하거나 집중 워크스트림으로 진행.
            </p>
            <p className="text-xs text-gray-500">개발 계약의 일부 &middot; 또는 독립 워크스트림</p>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="mb-16" id="about">
        <h2 className="text-2xl font-bold mb-6">Expertise</h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'TypeScript', 'Scientific visualization', 'Playwright', 'Cypress', 'Jenkins', 'Docker', 'DevSecOps', 'Performance optimization'].map((item) => (
            <span key={item} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{item}</span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-3">Let&apos;s work together</h2>
        <p className="text-gray-600 mb-6">Available for contract and B2B engagements from October 2026.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/work"
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            View case study
          </Link>
          <a
            href={mailtoUrl('Let\'s work together')}
            className="inline-flex items-center rounded-full border border-gray-300 px-6 py-2.5 text-gray-700 font-medium hover:border-gray-400 transition-colors"
          >
            Email Soomin
          </a>
        </div>
      </section>
    </div>
  )
}