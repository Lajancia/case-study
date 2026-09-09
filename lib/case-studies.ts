export type Locale = "en" | "ko";

export interface CaseStudyMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  role: string;
  timeline: string;
  industry: string;
  stack: string[];
  outcomes: Array<{
    label: string;
    before: string;
    after: string;
    change: string;
  }>;
  capabilityTags: string[];
  domains: string[];
  collaborations: string[];
  draft: boolean;
}

const caseStudiesEn: CaseStudyMeta[] = [
  {
    slug: "scientific-platform-performance",
    title: "Cutting a Scientific 3D Platform's Main Bundle by 80%",
    description:
      "How route-scoped loading and runtime rendering changes cut a scientific React platform's main bundle from 32MB to 6.5MB.",
    publishedAt: "2026-08-XX",
    role: "Frontend Developer (sole frontend owner)",
    timeline: "Mar 2025 – present",
    industry: "Biotech / AI drug discovery",
    stack: ["React", "Vite", "Molstar", "RDKit", "Plotly", "MUI"],
    outcomes: [
      { label: "Main bundle", before: "32MB", after: "6.5MB", change: "−80%" },
      {
        label: "Lighthouse Performance",
        before: "29",
        after: "78",
        change: "+49",
      },
    ],
    capabilityTags: ["performance", "visualization"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "devsecops-pipeline",
    title:
      "One Pipeline, Three Products: Standardizing CI/CD and Security Reporting",
    description:
      "Building a shared Jenkins Build-Test-Scan-Deploy pipeline — containerized Cypress E2E, full-suite regression runs, and Snyk/SonarQube/OWASP ZAP report automation — that cut manual regression testing from 5 hours to 1 across three frontend products.",
    publishedAt: "2026-XX-XX",
    role: "CI/CD Pipeline Design & Operations",
    timeline: "Apr 2025 – present",
    industry: "Platform engineering / DevSecOps",
    stack: [
      "Jenkins",
      "Docker",
      "Cypress",
      "Snyk",
      "OWASP ZAP",
      "SonarQube",
      "Pipeline Script",
    ],
    outcomes: [
      {
        label: "Manual regression testing",
        before: "~5 hours/release",
        after: "~1 hour/release",
        change: "−80%",
      },
      {
        label: "Security/quality reporting",
        before: "ad hoc, manual",
        after: "Snyk+Sonar every build, ZAP per release",
        change: "automated",
      },
    ],
    capabilityTags: ["devops", "security", "testing"],
    domains: ["platform"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "scientific-visualization",
    title: "3D Molecular Visualization in the Browser: Molstar & RDKit.js",
    description:
      "Integrating two specialized scientific libraries for interactive 3D protein structure viewing and 2D cheminformatics, loaded on-demand to prevent bundle bloat.",
    publishedAt: "2026-XX-XX",
    role: "Frontend Developer",
    timeline: "Mar 2025 – present",
    industry: "Biotech / Scientific visualization",
    stack: ["React", "Molstar", "RDKit.js", "Three.js", "RCSB PDB"],
    outcomes: [
      {
        label: "3D protein viewer payload (Molstar)",
        before: "N/A (new)",
        after: "on-demand",
        change: "−100% vs eager",
      },
      {
        label: "2D mol depiction payload (RDKit.js WASM)",
        before: "N/A (new)",
        after: "on-demand",
        change: "−100% vs eager",
      },
    ],
    capabilityTags: ["visualization", "performance"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "next14-r3f-portfolio",
    title: "Building an Immersive 3D Portfolio: Next.js 14 + React Three Fiber",
    description:
      "A bilingual 3D portfolio site with interactive WebGL scenes (keyboard, bicycle), Panda CSS styling, and a full CI/CD pipeline from Jenkins to K3s.",
    publishedAt: "2026-XX-XX",
    role: "Frontend Developer (solo)",
    timeline: "Dec 2023 – present",
    industry: "Personal portfolio / 3D web",
    stack: [
      "Next.js 14",
      "React Three Fiber",
      "Three.js",
      "Panda CSS",
      "i18next",
      "Framer Motion",
      "Docker",
      "Jenkins",
    ],
    outcomes: [
      {
        label: "3D scenes",
        before: "0",
        after: "2 (keyboard, bike)",
        change: "interactive WebGL",
      },
      {
        label: "Pipeline deployment",
        before: "Manual",
        after: "Jenkins → GHCR → K3s",
        change: "fully automated",
      },
    ],
    capabilityTags: ["visualization", "devops"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "cicd-pipeline",
    title: "From Commit to Production: Jenkins + K3s + ArgoCD GitOps Pipeline",
    description:
      "A fully automated CI/CD pipeline that takes code from GitHub, builds and pushes Docker images via Jenkins, and deploys to a K3s cluster using ArgoCD with GitOps principles.",
    publishedAt: "2026-XX-XX",
    role: "DevOps Engineer (solo)",
    timeline: "Jan 2024 – present",
    industry: "DevOps / Cloud infrastructure",
    stack: [
      "Jenkins",
      "Docker",
      "GitHub Container Registry",
      "K3s",
      "ArgoCD",
      "GitOps",
      "Nginx",
      "Tailscale",
    ],
    outcomes: [
      {
        label: "Deployment time",
        before: "Manual SSH",
        after: "< 5 min auto",
        change: "fully automated",
      },
      {
        label: "Infrastructure",
        before: "Single VPS",
        after: "K3s cluster",
        change: "high availability",
      },
    ],
    capabilityTags: ["devops", "fullstack"],
    domains: ["infrastructure"],
    collaborations: [],
    draft: false,
  },
];

const caseStudiesKo: CaseStudyMeta[] = [
  {
    slug: "scientific-platform-performance",
    title: "바이오 3D 플랫폼 메인 번들 80% 감축하기",
    description:
      "라우트 단위 로딩과 런타임 렌더링 개선으로 과학 분야 React 플랫폼의 메인 번들을 32MB에서 6.5MB로 줄인 과정.",
    publishedAt: "2026-08-XX",
    role: "프론트엔드 개발자 (단독 프론트엔드 담당)",
    timeline: "2025년 3월 – 현재",
    industry: "바이오테크 / AI 신약 개발",
    stack: ["React", "Vite", "Molstar", "RDKit", "Plotly", "MUI"],
    outcomes: [
      { label: "메인 번들", before: "32MB", after: "6.5MB", change: "−80%" },
      {
        label: "Lighthouse 성능 점수",
        before: "29",
        after: "78",
        change: "+49",
      },
    ],
    capabilityTags: ["performance", "visualization"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "devsecops-pipeline",
    title: "하나의 파이프라인, 세 개의 제품: CI/CD와 보안 리포팅 표준화",
    description:
      "컨테이너화된 Cypress E2E, 전수 회귀 테스트, Snyk/SonarQube/OWASP ZAP 리포트 자동화를 갖춘 공용 Jenkins Build-Test-Scan-Deploy 파이프라인을 구축해, 3개 프론트엔드 제품의 수동 회귀 테스트 시간을 5시간에서 1시간으로 줄인 과정.",
    publishedAt: "2026-XX-XX",
    role: "CI/CD 파이프라인 설계 및 운영",
    timeline: "2025년 4월 – 현재",
    industry: "플랫폼 엔지니어링 / DevSecOps",
    stack: [
      "Jenkins",
      "Docker",
      "Cypress",
      "Snyk",
      "OWASP ZAP",
      "SonarQube",
      "Pipeline Script",
    ],
    outcomes: [
      {
        label: "수동 회귀 테스트",
        before: "릴리즈당 ~5시간",
        after: "릴리즈당 ~1시간",
        change: "−80%",
      },
      {
        label: "보안/품질 리포팅",
        before: "필요할 때만 수동",
        after: "매 빌드 Snyk+Sonar, 릴리즈마다 ZAP",
        change: "자동화",
      },
    ],
    capabilityTags: ["devops", "security", "testing"],
    domains: ["platform"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "scientific-visualization",
    title: "브라우저에서의 3D 분자 시각화: Molstar & RDKit.js",
    description:
      "두 개의 전문 과학 라이브러리를 통합해 인터랙티브 3D 단백질 구조 뷰어와 2D 케모인포매틱스를 온디맨드로 로드해서 번들 비대화를 막은 과정.",
    publishedAt: "2026-XX-XX",
    role: "프론트엔드 개발자",
    timeline: "2025년 3월 – 현재",
    industry: "바이오테크 / 과학적 시각화",
    stack: ["React", "Molstar", "RDKit.js", "Three.js", "RCSB PDB"],
    outcomes: [
      {
        label: "3D 단백질 뷰어 페이로드 (Molstar)",
        before: "해당 없음 (신규)",
        after: "온디맨드",
        change: "즉시 로드 대비 −100%",
      },
      {
        label: "2D 분자 묘사 페이로드 (RDKit.js WASM)",
        before: "해당 없음 (신규)",
        after: "온디맨드",
        change: "즉시 로드 대비 −100%",
      },
    ],
    capabilityTags: ["visualization", "performance"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "next14-r3f-portfolio",
    title: "몰입형 3D 포트폴리오 구축하기: Next.js 14 + React Three Fiber",
    description:
      "인터랙티브 WebGL 씬, 매크로 키보드 컨트롤, Panda CSS, 그리고 Jenkins부터 K3s까지 이어지는 완전한 CI/CD 파이프라인을 갖춘 이중언어 3D 포트폴리오 사이트.",
    publishedAt: "2026-XX-XX",
    role: "프론트엔드 개발자 (단독)",
    timeline: "2023년 12월 – 현재",
    industry: "개인 포트폴리오 / 3D 웹",
    stack: [
      "Next.js 14",
      "React Three Fiber",
      "Three.js",
      "Panda CSS",
      "i18next",
      "Framer Motion",
      "Docker",
      "Jenkins",
    ],
    outcomes: [
      {
        label: "3D 씬",
        before: "0",
        after: "2개 (키보드, 자전거)",
        change: "인터랙티브 WebGL",
      },
      {
        label: "파이프라인 배포",
        before: "수동",
        after: "Jenkins → GHCR → K3s",
        change: "완전 자동화",
      },
    ],
    capabilityTags: ["visualization", "devops"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "cicd-pipeline",
    title: "커밋에서 프로덕션까지: Jenkins + K3s + ArgoCD GitOps 파이프라인",
    description:
      "GitHub → Jenkins 빌드 → GHCR push → GitOps 저장소 업데이트 → ArgoCD를 통한 K3s 클러스터 배포까지 완전 자동화한 CI/CD 파이프라인.",
    publishedAt: "2026-XX-XX",
    role: "DevOps 엔지니어 (단독)",
    timeline: "2024년 1월 – 현재",
    industry: "DevOps / 클라우드 인프라",
    stack: [
      "Jenkins",
      "Docker",
      "GitHub Container Registry",
      "K3s",
      "ArgoCD",
      "GitOps",
      "Nginx",
      "Tailscale",
    ],
    outcomes: [
      {
        label: "배포",
        before: "수동 SSH",
        after: "5분 이내 자동",
        change: "완전 자동화",
      },
      {
        label: "인프라",
        before: "단일 VPS",
        after: "K3s 클러스터",
        change: "고가용성",
      },
    ],
    capabilityTags: ["devops", "fullstack"],
    domains: ["infrastructure"],
    collaborations: [],
    draft: false,
  },
];

const caseStudiesByLocale: Record<Locale, CaseStudyMeta[]> = {
  en: caseStudiesEn,
  ko: caseStudiesKo,
};

export function getCaseStudies(locale: Locale): CaseStudyMeta[] {
  return caseStudiesByLocale[locale] ?? caseStudiesEn;
}

export function getCaseStudy(
  locale: Locale,
  slug: string,
): CaseStudyMeta | undefined {
  return getCaseStudies(locale).find((c) => c.slug === slug);
}

export function getPublishedCaseStudies(locale: Locale): CaseStudyMeta[] {
  return getCaseStudies(locale).filter((c) => !c.draft);
}

export function getAllSlugs(): string[] {
  return caseStudiesEn.map((c) => c.slug);
}
