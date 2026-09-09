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
      {published.length > 0 && (
        <div className="grid gap-6">
          {published.map((study) => (
            <WorkCard key={study.slug} study={study} />
          ))}
        </div>
      )}
      {drafts.length > 0 && (
        <div className="mt-8">
          {published.length > 0 && (
            <h2 className="text-lg font-medium text-gray-400 mb-4 dark:text-gray-600">Coming soon</h2>
          )}
          <div className="grid gap-6">
            {drafts.map((study) => (
              <WorkCard key={study.slug} study={study} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}