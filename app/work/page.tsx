import { Metadata } from 'next'
import { caseStudies } from '@/lib/case-studies'
import { WorkCard } from '@/components/work/WorkCard'

export const metadata: Metadata = {
  title: 'Selected work',
  description: 'Case studies demonstrating frontend engineering results.',
}

export default function WorkPage() {
  const published = caseStudies.filter((c) => !c.draft)
  const drafts = caseStudies.filter((c) => c.draft)

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">Selected work</h1>
      <div className="grid gap-6">
        {published.map((study) => (
          <WorkCard key={study.slug} study={study} />
        ))}
        {drafts.map((study) => (
          <div key={study.slug} className="opacity-50">
            <WorkCard study={study} />
          </div>
        ))}
      </div>
      {drafts.length > 0 && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          More case studies coming soon.
        </p>
      )}
    </div>
  )
}