import { Metadata } from 'next'
import { getCaseStudy } from '@/lib/case-studies'
import VisContent from '@/content/work/scientific-visualization.mdx'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'

export function generateMetadata(): Metadata {
  const study = getCaseStudy('scientific-visualization')
  if (!study) return {}
  return {
    title: study.title,
    description: study.description,
    robots: study.draft ? { index: false, follow: false } : undefined,
  }
}

export default function ScientificVisPage() {
  const study = getCaseStudy('scientific-visualization')
  if (!study) return <div>Case study not found</div>

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <CaseStudyHero study={study} />
      <div className="prose">
        <VisContent />
      </div>
      <CaseStudyCTA />
    </article>
  )
}