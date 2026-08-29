export interface CaseStudyMeta {
  slug: string
  title: string
  description: string
  publishedAt: string
  role: string
  timeline: string
  industry: string
  stack: string[]
  outcomes: Array<{
    label: string
    before: string
    after: string
    change: string
  }>
  draft: boolean
}

export const caseStudies: CaseStudyMeta[] = [
  {
    slug: 'scientific-platform-performance',
    title: "Cutting a Scientific 3D Platform's Main Bundle by 80%",
    description:
      'How route-scoped loading and runtime rendering changes cut a scientific React platform\'s main bundle from 32MB to 6.5MB.',
    publishedAt: '2026-10-XX', // placeholder
    role: 'Frontend Developer (sole frontend owner)',
    timeline: 'Mar 2025 – present',
    industry: 'Biotech / AI drug discovery',
    stack: ['React', 'Vite', 'Molstar', 'RDKit', 'Plotly', 'MUI'],
    outcomes: [
      { label: 'Main bundle', before: '32MB', after: '6.5MB', change: '−80%' },
      { label: 'Lighthouse Performance', before: '29', after: '78', change: '+49' },
    ],
    draft: true,
  },
]

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

export function getPublishedCaseStudies(): CaseStudyMeta[] {
  return caseStudies.filter((c) => !c.draft)
}