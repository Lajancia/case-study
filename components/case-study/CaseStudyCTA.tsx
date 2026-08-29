import { siteConfig, mailtoUrl } from '@/lib/site'

export function CaseStudyCTA() {
  return (
    <section className="rounded-lg bg-blue-50 p-8 text-center mt-12">
      <h2 className="text-2xl font-bold mb-2">Interested in a frontend performance audit?</h2>
      <p className="text-gray-600 mb-6 max-w-lg mx-auto">
        One-week fixed-scope audit for your React/Next.js product. You get a prioritized action plan with measurable targets.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {siteConfig.calendlyUrl ? (
          <a
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Book a call
          </a>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-300 px-6 py-2.5 text-gray-500 font-medium cursor-not-allowed">
            Book a call (coming soon)
          </span>
        )}
        <a
          href={mailtoUrl('Frontend performance audit inquiry')}
          className="inline-flex items-center rounded-full border border-blue-600 px-6 py-2.5 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
        >
          Email Soomin
        </a>
      </div>
    </section>
  )
}