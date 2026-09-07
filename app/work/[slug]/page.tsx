import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCaseStudy, caseStudies } from '@/lib/case-studies'
import { mdxModules } from '@/content/work'
import { CaseStudyHero } from '@/components/case-study/CaseStudyHero'
import { CaseStudyCTA } from '@/components/case-study/CaseStudyCTA'

export async function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) return {}
  return {
    title: study.title,
    description: study.description,
    robots: study.draft ? { index: false, follow: false } : undefined,
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) notFound()

  const MDXContent = mdxModules[slug]
  if (!MDXContent) notFound()

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <CaseStudyHero study={study} />
      <div className="prose">
        <MDXContent />
      </div>
      <CaseStudyCTA />
    </article>
  )
}