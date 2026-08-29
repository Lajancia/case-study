import Link from 'next/link'
import type { CaseStudyMeta } from '@/lib/case-studies'

interface WorkCardProps {
  study: CaseStudyMeta
}

export function WorkCard({ study }: WorkCardProps) {
  return (
    <article className="border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{study.industry}</div>
      <h2 className="text-xl font-semibold mb-2 leading-snug">{study.title}</h2>
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