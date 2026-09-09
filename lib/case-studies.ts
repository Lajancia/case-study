export type Locale = 'en' | 'ko'

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

const caseStudiesEn: CaseStudyMeta[] = [
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
    draft: false,
  },
  {
    slug: 'devsecops-pipeline',
    title: 'One Pipeline, Three Products: Standardizing CI/CD and Security Reporting',
    description:
      'Building a shared Jenkins Build-Test-Scan-Deploy pipeline — containerized Cypress E2E, full-suite regression runs, and Snyk/SonarQube/OWASP ZAP report automation — that cut manual regression testing from 5 hours to 1 across three frontend products.',
    publishedAt: '2026-XX-XX',
    role: 'CI/CD Pipeline Design & Operations',
    timeline: 'Apr 2025 – present',
    industry: 'Platform engineering / DevSecOps',
    stack: ['Jenkins', 'Docker', 'Cypress', 'Snyk', 'OWASP ZAP', 'SonarQube', 'Pipeline Script'],
    outcomes: [
      { label: 'Manual regression testing', before: '~5 hours/release', after: '~1 hour/release', change: '−80%' },
      { label: 'Security/quality reporting', before: 'ad hoc, manual', after: 'Snyk+Sonar every build, ZAP per release', change: 'automated' },
    ],
    capabilityTags: ['devops', 'security', 'testing'],
    domains: ['platform'],
    collaborations: [],
    draft: false,
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
    draft: false,
  },
  {
    slug: 'next14-r3f-portfolio',
    title: 'Building an Immersive 3D Portfolio: Next.js 14 + React Three Fiber',
    description:
      'A bilingual 3D portfolio site with interactive WebGL scenes (keyboard, bicycle), Panda CSS styling, and a full CI/CD pipeline from Jenkins to K3s.',
    publishedAt: '2026-XX-XX',
    role: 'Frontend Developer (solo)',
    timeline: 'Dec 2023 – present',
    industry: 'Personal portfolio / 3D web',
    stack: ['Next.js 14', 'React Three Fiber', 'Three.js', 'Panda CSS', 'i18next', 'Framer Motion', 'Docker', 'Jenkins'],
    outcomes: [
      { label: '3D scenes', before: '0', after: '2 (keyboard, bike)', change: 'interactive WebGL' },
      { label: 'Pipeline deployment', before: 'Manual', after: 'Jenkins → GHCR → K3s', change: 'fully automated' },
    ],
    capabilityTags: ['visualization', 'devops'],
    domains: ['web'],
    collaborations: [],
    draft: false,
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
    draft: false,
  },
]

// Stage 1 of the i18n rollout: only the flagship case study is translated.
// The other four intentionally reuse the English copy as a placeholder so
// nothing 404s or renders blank on /ko — replace each entry as it's
// translated (content/work/ko/<slug>.mdx should be translated at the same
// time as its metadata here).
const caseStudiesKo: CaseStudyMeta[] = [
  {
    slug: 'scientific-platform-performance',
    title: '과학 3D 플랫폼 메인 번들 80% 감축하기',
    description:
      '라우트 단위 로딩과 런타임 렌더링 개선으로 과학 분야 React 플랫폼의 메인 번들을 32MB에서 6.5MB로 줄인 과정.',
    publishedAt: '2026-08-XX',
    role: '프론트엔드 개발자 (단독 프론트엔드 담당)',
    timeline: '2025년 3월 – 현재',
    industry: '바이오테크 / AI 신약 개발',
    stack: ['React', 'Vite', 'Molstar', 'RDKit', 'Plotly', 'MUI'],
    outcomes: [
      { label: '메인 번들', before: '32MB', after: '6.5MB', change: '−80%' },
      { label: 'Lighthouse 성능 점수', before: '29', after: '78', change: '+49' },
    ],
    capabilityTags: ['performance', 'visualization'],
    domains: ['biotech'],
    collaborations: [],
    draft: false,
  },
  ...caseStudiesEn.slice(1),
]

const caseStudiesByLocale: Record<Locale, CaseStudyMeta[]> = {
  en: caseStudiesEn,
  ko: caseStudiesKo,
}

export function getCaseStudies(locale: Locale): CaseStudyMeta[] {
  return caseStudiesByLocale[locale] ?? caseStudiesEn
}

export function getCaseStudy(locale: Locale, slug: string): CaseStudyMeta | undefined {
  return getCaseStudies(locale).find((c) => c.slug === slug)
}

export function getPublishedCaseStudies(locale: Locale): CaseStudyMeta[] {
  return getCaseStudies(locale).filter((c) => !c.draft)
}

export function getAllSlugs(): string[] {
  return caseStudiesEn.map((c) => c.slug)
}
