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
  capabilityTags: string[]
  domains: string[]
  collaborations: string[]
  draft: boolean
}

export const caseStudies: CaseStudyMeta[] = [
  {
    slug: 'scientific-platform-performance',
    title: "Cutting a Scientific 3D Platform's Main Bundle by 80%",
    description:
      'How route-scoped loading and runtime rendering changes cut a scientific React platform\'s main bundle from 32MB to 6.5MB.',
    publishedAt: '2026-08-XX',
    role: 'Frontend Developer (sole frontend owner)',
    timeline: 'Mar 2025 – present',
    industry: 'Biotech / AI drug discovery',
    stack: ['React', 'Vite', 'Molstar', 'RDKit', 'Plotly', 'MUI'],
    outcomes: [
      { label: 'Main bundle', before: '32MB', after: '6.5MB', change: '−80%' },
      { label: 'Lighthouse Performance', before: '29', after: '78', change: '+49' },
    ],
    capabilityTags: ['performance', 'visualization'],
    domains: ['biotech'],
    collaborations: [],
    draft: true,
  },
  {
    slug: 'scientific-visualization',
    title: '3D Molecular Visualization in the Browser: Molstar & RDKit.js',
    description:
      'Integrating two specialized scientific libraries for interactive 3D protein structure viewing and 2D cheminformatics, loaded on-demand to prevent bundle bloat.',
    publishedAt: '2026-XX-XX',
    role: 'Frontend Developer',
    timeline: 'Mar 2025 – present',
    industry: 'Biotech / Scientific visualization',
    stack: ['React', 'Molstar', 'RDKit.js', 'Three.js', 'RCSB PDB'],
    outcomes: [
      { label: '3D protein viewer payload (Molstar)', before: "N/A (new)", after: 'on-demand', change: '−100% vs eager' },
      { label: '2D mol depiction payload (RDKit.js WASM)', before: "N/A (new)", after: 'on-demand', change: '−100% vs eager' },
    ],
    capabilityTags: ['visualization', 'performance'],
    domains: ['biotech'],
    collaborations: [],
    draft: true,
  },
  {
    slug: 'next14-r3f-portfolio',
    title: 'Building an Immersive 3D Portfolio: Next.js 14 + React Three Fiber',
    description:
      'A bilingual 3D portfolio site with interactive WebGL scenes, macro keyboard controls, Panda CSS styling, and a full CI/CD pipeline from Jenkins to K3s.',
    publishedAt: '2026-XX-XX',
    role: 'Frontend Developer (solo)',
    timeline: 'Dec 2023 – present',
    industry: 'Personal portfolio / 3D web',
    stack: ['Next.js 14', 'React Three Fiber', 'Three.js', 'Panda CSS', 'i18next', 'Framer Motion', 'Docker', 'Jenkins'],
    outcomes: [
      { label: '3D scenes', before: '0', after: '5+ (keyboard, bike, astronaut, boxes, gallery)', change: 'interactive WebGL' },
      { label: 'Pipeline deployment', before: 'Manual', after: 'Jenkins → GHCR → K3s', change: 'fully automated' },
    ],
    capabilityTags: ['visualization', 'devops'],
    domains: ['web'],
    collaborations: [],
    draft: true,
  },
  {
    slug: 'cicd-pipeline',
    title: 'From Commit to Production: Jenkins + K3s + ArgoCD GitOps Pipeline',
    description:
      'A fully automated CI/CD pipeline that takes code from GitHub, builds and pushes Docker images via Jenkins, and deploys to a K3s cluster using ArgoCD with GitOps principles.',
    publishedAt: '2026-XX-XX',
    role: 'DevOps Engineer (solo)',
    timeline: 'Jan 2024 – present',
    industry: 'DevOps / Cloud infrastructure',
    stack: ['Jenkins', 'Docker', 'GitHub Container Registry', 'K3s', 'ArgoCD', 'GitOps', 'Nginx', 'Tailscale'],
    outcomes: [
      { label: 'Deployment time', before: 'Manual SSH', after: '< 5 min auto', change: 'fully automated' },
      { label: 'Infrastructure', before: 'Single VPS', after: 'K3s cluster', change: 'high availability' },
    ],
    capabilityTags: ['devops', 'fullstack'],
    domains: ['infrastructure'],
    collaborations: [],
    draft: true,
  },
]

export function getCaseStudy(slug: string): CaseStudyMeta | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

export function getPublishedCaseStudies(): CaseStudyMeta[] {
  return caseStudies.filter((c) => !c.draft)
}