import Link from 'next/link'
import type { CaseStudyMeta } from '@/lib/case-studies'

interface WorkCardProps {
  study: CaseStudyMeta
}

export function WorkCard({ study }: WorkCardProps) {
  return (
    <article className={`border rounded-lg p-6 transition-all duration-200 ${
      study.draft
        ? 'border-yellow-200 bg-yellow-50/30 hover:border-yellow-400 hover:shadow-lg hover:-translate-y-0.5'
        : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider">{study.industry}</div>
        {study.draft && (
          <span className="shrink-0 text-xs font-semibold text-yellow-800 bg-yellow-100 border border-yellow-300 rounded-full px-2.5 py-0.5 leading-none">
            Draft
          </span>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2 leading-snug text-gray-900">{study.title}</h2>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{study.description}</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {study.outcomes.map((outcome) => (
          <div key={outcome.label}>
            <div className="text-xs text-gray-500 mb-0.5">{outcome.label}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-gray-400 line-through text-sm">{outcome.before}</span>
              <span className="text-green-700 font-semibold">{outcome.after}</span>
              <span className="text-green-600 text-xs font-medium">{outcome.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {study.stack.map((tech) => (
          <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{tech}</span>
        ))}
      </div>
      <Link
        href={`/work/${study.slug}`}
        className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        Read case study →
      </Link>
    </article>
  )
}