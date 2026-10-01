export type Locale = "en" | "ko";

export type Company =
  | "arontier"
  | "illuminarean"
  | "yura"
  | "common-srl"
  | "personal";

export interface CaseStudyMeta {
  slug: string;
  title: string;
  description: string;
  role: string;
  timeline: string;
  industry: string;
  company: Company;
  /** What a reader can actually see of this work, and where. */
  disclosure: { label: string; href?: string };
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

/**
 * Buyer-facing groupings over `capabilityTags`. The raw tags stay as they are;
 * these decide what the Work page offers as filters, so each one has to hold
 * enough case studies to be worth clicking, and none may claim more than the
 * work supports — there is no full-stack grouping because the backends on those
 * projects were not mine. Case studies outside every grouping still show in the
 * unfiltered list.
 */
export type Capability =
  | "visualization"
  | "performance"
  | "migration"
  | "quality"
  | "delivery";

/** Frontend work first; the DevOps side is real but secondary, so it sits last. */
export const CAPABILITY_ORDER: Capability[] = [
  "visualization",
  "performance",
  "migration",
  "quality",
  "delivery",
];

const CAPABILITY_TAGS: Record<Capability, string[]> = {
  visualization: ["visualization"],
  performance: ["performance"],
  migration: ["migration"],
  quality: ["testing", "security"],
  delivery: ["devops"],
};

export function isCapability(value: unknown): value is Capability {
  return (
    typeof value === "string" &&
    (CAPABILITY_ORDER as string[]).includes(value)
  );
}

export const COMPANY_ORDER: Company[] = [
  "arontier",
  "illuminarean",
  "yura",
  "common-srl",
  "personal",
];

const caseStudiesEn: CaseStudyMeta[] = [
  {
    slug: "scientific-platform-performance",
    title:
      "AD3 Protein Structure Platform: 3D Visualization and an 80% Bundle Cut",
    description:
      "Route-scoped loading for Molstar/RDKit and runtime rendering fixes that cut a scientific React platform's main bundle from 32MB to 6.5MB and moved two heavyweight visualization libraries to on-demand loading.",
    role: "Frontend Engineer",
    timeline: "Mar 2025 – Oct 2026",
    industry: "Biotech / AI drug discovery",
    company: "arontier",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Molstar",
      "RDKit.js",
      "Plotly",
      "MUI",
    ],
    outcomes: [
      { label: "Main bundle", before: "32MB", after: "6.5MB", change: "−80%" },
      {
        label: "Lighthouse Performance",
        before: "29",
        after: "78",
        change: "+49",
      },
      {
        label: "3D/2D molecular viewers",
        before: "Eager on every route",
        after: "Route-scoped",
        change: "lazy-loaded",
      },
    ],
    disclosure: { label: "Public product", href: "https://ad3.io/" },
    capabilityTags: ["performance", "visualization"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "cicd-pipeline",
    title: "From Commit to Production: Jenkins + K3s + ArgoCD GitOps Pipeline",
    description:
      "A fully automated CI/CD pipeline that takes code from GitHub, builds and pushes Docker images via Jenkins, and deploys to a K3s cluster using ArgoCD with GitOps principles.",
    role: "DevOps Engineer (solo)",
    timeline: "Jan 2024 – present",
    industry: "DevOps / Cloud infrastructure",
    company: "personal",
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
    disclosure: {
      label: "Public repo",
      href: "https://github.com/Lajancia/Next14-R3F",
    },
    capabilityTags: ["migration", "devops", "fullstack"],
    domains: ["infrastructure"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "path-wsi-viewer",
    title:
      "PATH Digital Pathology Platform: WSI Viewer and Pre-Delivery Security Checks",
    description:
      "Building the viewer/interaction UI for a whole-slide-image (WSI) pathology platform on OpenSeadragon, and establishing an OWASP ZAP scan of the authentication flow before an on-premise hospital delivery.",
    role: "Frontend Development / Security Checks",
    timeline: "Jun 2025 – May 2026",
    industry: "Medical AI / Digital pathology",
    company: "arontier",
    stack: [
      "React",
      "TypeScript",
      "Jotai",
      "React Hook Form",
      "TanStack Query",
      "OpenSeadragon",
      "OWASP ZAP",
    ],
    outcomes: [
      {
        label: "Delivery",
        before: "Internal staging only",
        after: "On-premise hospital deployment",
        change: "shipped",
      },
      {
        label: "Pre-delivery security check",
        before: "No procedure",
        after: "OWASP ZAP scan of the auth flow",
        change: "procedure established",
      },
    ],
    disclosure: { label: "Client anonymized" },
    capabilityTags: ["security", "visualization"],
    domains: ["medtech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "adc-visualization",
    title: "ADC Visualization: 3D/2D Molecular Viewers on Next.js 16",
    description:
      "Building 3D protein-structure and 2D chemical-structure viewers (Molstar + RDKit) for an antibody-drug-conjugate (ADC) data platform, and introducing a Claude Code-based workflow for generating Playwright E2E tests.",
    role: "UI Development / Test Automation",
    timeline: "Mar 2026 – May 2026",
    industry: "Biotech / Antibody-drug conjugates (ADC)",
    company: "arontier",
    stack: [
      "React",
      "TypeScript",
      "Next.js 16",
      "Molstar",
      "RDKit",
      "Tailwind CSS",
      "Playwright",
      "Claude Code",
    ],
    outcomes: [
      {
        label: "E2E test authoring",
        before: "Hand-written specs",
        after: "Claude Code-assisted generation",
        change: "workflow adopted",
      },
      {
        label: "E2E standard",
        before: "Cypress, set per product",
        after: "Playwright conventions reused for AD3's 28-app migration",
        change: "standard set",
      },
    ],
    disclosure: { label: "Public product", href: "https://adc.arontier.co/" },
    capabilityTags: ["visualization", "testing"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "devsecops-pipeline",
    title:
      "One Pipeline, Three Products: Standardizing CI/CD and Test Reporting",
    description:
      "Moving the Jenkins pipeline definitions for three codebases into one central repository, converging their stage structure, and migrating E2E from Cypress to Playwright so 350 tests run automatically in CI.",
    role: "CI/CD Pipeline Design & Operations",
    timeline: "Apr 2025 – Oct 2026",
    industry: "Platform engineering / DevSecOps",
    company: "arontier",
    stack: [
      "Jenkins",
      "Groovy (Declarative Pipeline)",
      "Docker",
      "Playwright",
      "Snyk",
      "SonarQube",
      "OWASP ZAP",
    ],
    outcomes: [
      {
        label: "Manual regression",
        before: "~5 hours",
        after: "~1 hour",
        change: "−80%",
      },
      {
        label: "E2E pipeline definition",
        before: "314 lines (Cypress)",
        after: "151 lines (Playwright)",
        change: "−52%",
      },
    ],
    disclosure: { label: "Internal infrastructure" },
    capabilityTags: ["migration", "devops", "security", "testing"],
    domains: ["platform"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "illuminarean-dockerization",
    title: "Frontend Dockerization and CI/CD Optimization",
    description:
      "Moving a Next.js 14 app to a standalone build with a pnpm migration, cutting the Docker image from 1.3GB to 500MB and deploy time from 15 minutes to under 3.",
    role: "Deploy Pipeline & Build Structure",
    timeline: "Jul 2024 – Dec 2024",
    industry: "HR tech / Recruiting platform",
    company: "illuminarean",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Docker",
      "Jenkins",
      "pnpm",
      "GitHub Actions",
      "next-translate",
    ],
    outcomes: [
      {
        label: "Docker image size",
        before: "1.3GB",
        after: "500MB",
        change: "−62%",
      },
      {
        label: "Deploy time",
        before: "~15 min",
        after: "< 3 min",
        change: "−80%",
      },
    ],
    disclosure: { label: "Internal infrastructure" },
    capabilityTags: ["migration", "devops"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "illuminarean-hiring-platform",
    title: "Job Posting & Applicant Management Platform",
    description:
      "A Next.js 14 recruiting service and admin panel, built frontend-first against an MSW mock API before the backend was ready, with next-translate powering multilingual SSG pages.",
    role: "Service & Admin Panel Development",
    timeline: "Nov 2024 – Jan 2025",
    industry: "HR tech / Recruiting platform",
    company: "illuminarean",
    stack: [
      "Next.js 14",
      "React Query",
      "React Hook Form",
      "MSW",
      "Docker",
      "next-translate",
      "Tailwind CSS",
      "Emotion",
    ],
    outcomes: [
      {
        label: "Frontend start date",
        before: "Blocked on backend API",
        after: "Started against MSW mocks",
        change: "parallelized",
      },
      {
        label: "Schedule risk",
        before: "Sequential handoff",
        after: "Frontend/backend in parallel",
        change: "reduced",
      },
    ],
    disclosure: { label: "Service discontinued" },
    capabilityTags: ["fullstack"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "yura-smart-factory",
    title: "Smart Factory Monitoring for a Serbian Production Plant",
    description:
      "A chart-based monitoring dashboard (ApexCharts, Plotly) for AOI process yield at an overseas production plant, built from Figma design through the React frontend, with an existing Spring Boot API adapted to feed it — process visibility that helped cut the AOI defect rate by roughly 20%.",
    role: "UI/UX Design, Frontend, API Maintenance",
    timeline: "Oct 2022 – May 2024",
    industry: "Manufacturing / Smart factory",
    company: "yura",
    stack: [
      "React.js",
      "MUI",
      "ApexCharts",
      "Plotly",
      "Java Spring Boot",
      "MyBatis",
      "MariaDB",
      "Figma",
    ],
    outcomes: [
      {
        label: "AOI defect rate",
        before: "manual aggregation",
        after: "~20% lower",
        change: "−20%",
      },
      {
        label: "Process visibility",
        before: "manual review",
        after: "dashboard monitoring",
        change: "constant monitoring",
      },
    ],
    disclosure: { label: "Internal system" },
    capabilityTags: ["fullstack", "visualization"],
    domains: ["manufacturing"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "common-srl-website",
    title: "Official Website & Magazine Display/Purchase Platform",
    description:
      "Rebuilding a Milan startup's static HTML site on Vue.js/Vuetify, and moving the domain and hosting out of a contractor's personal accounts into the company's own.",
    role: "Frontend rebuild & domain/hosting handover",
    timeline: "Nov 2021 – May 2022",
    industry: "Fashion / Media startup",
    company: "common-srl",
    stack: ["Vue.js", "Vuetify"],
    outcomes: [
      {
        label: "Codebase",
        before: "Static HTML",
        after: "Vue.js / Vuetify",
        change: "rebuilt",
      },
      {
        label: "Domain & hosting",
        before: "In a contractor's accounts",
        after: "Moved to company accounts",
        change: "ownership recovered",
      },
    ],
    disclosure: { label: "Public site", href: "http://www.common-mag.com/" },
    capabilityTags: ["migration", "frontend"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "next14-r3f-portfolio",
    title: "Building an Immersive 3D Portfolio: Next.js 14 + React Three Fiber",
    description:
      "A bilingual 3D portfolio site with interactive WebGL scenes (keyboard, motorcycle), Panda CSS styling, and a full CI/CD pipeline from Jenkins to K3s.",
    role: "Frontend Engineer (solo)",
    timeline: "Dec 2023 – present",
    industry: "Personal portfolio / 3D web",
    company: "personal",
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
        label: "Browser 3D",
        before: "Static portfolio page",
        after: "Interactive R3F scenes, live",
        change: "self-built WebGL",
      },
      {
        label: "Pipeline deployment",
        before: "Manual",
        after: "Jenkins → GHCR → K3s",
        change: "fully automated",
      },
    ],
    disclosure: { label: "Live site", href: "https://creative.soominlab.com" },
    capabilityTags: ["visualization", "devops"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
];

const caseStudiesKo: CaseStudyMeta[] = [
  {
    slug: "scientific-platform-performance",
    title: "AD3 단백질 구조 분석 플랫폼: 3D 시각화 고도화와 번들 80% 감축",
    description:
      "Molstar/RDKit 라우트 단위 로딩과 런타임 렌더링 개선으로 과학 분야 React 플랫폼의 메인 번들을 32MB에서 6.5MB로 줄이고, 두 개의 대형 시각화 라이브러리를 온디맨드 로딩으로 전환한 과정.",
    role: "프론트엔드 엔지니어",
    timeline: "2025년 3월 – 2026년 10월",
    industry: "바이오테크 / AI 신약 개발",
    company: "arontier",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Molstar",
      "RDKit.js",
      "Plotly",
      "MUI",
    ],
    outcomes: [
      { label: "메인 번들", before: "32MB", after: "6.5MB", change: "−80%" },
      {
        label: "Lighthouse 성능 점수",
        before: "29",
        after: "78",
        change: "+49",
      },
      {
        label: "3D/2D 분자 뷰어",
        before: "전 라우트 즉시 로드",
        after: "라우트 단위 로드",
        change: "지연 로딩",
      },
    ],
    disclosure: { label: "공개 제품", href: "https://ad3.io/" },
    capabilityTags: ["performance", "visualization"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "cicd-pipeline",
    title: "커밋에서 프로덕션까지: Jenkins + K3s + ArgoCD GitOps 파이프라인",
    description:
      "GitHub → Jenkins 빌드 → GHCR push → GitOps 저장소 업데이트 → ArgoCD를 통한 K3s 클러스터 배포까지 완전 자동화한 CI/CD 파이프라인.",
    role: "DevOps 엔지니어 (단독)",
    timeline: "2024년 1월 – 현재",
    industry: "DevOps / 클라우드 인프라",
    company: "personal",
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
    disclosure: {
      label: "공개 저장소",
      href: "https://github.com/Lajancia/Next14-R3F",
    },
    capabilityTags: ["migration", "devops", "fullstack"],
    domains: ["infrastructure"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "path-wsi-viewer",
    title: "PATH 병리 이미지(WSI) 분석 플랫폼: 뷰어 개발과 납품 전 보안 점검",
    description:
      "OpenSeadragon 기반 WSI(Whole Slide Image) 뷰어·인터랙션 UI를 개발하고, 의료기관 온프레미스 납품에 앞서 OWASP ZAP으로 인증 플로우를 점검하는 절차를 만든 과정.",
    role: "프론트엔드 개발 / 보안 점검",
    timeline: "2025년 6월 – 2026년 5월",
    industry: "의료 AI / 디지털 병리",
    company: "arontier",
    stack: [
      "React",
      "TypeScript",
      "Jotai",
      "React Hook Form",
      "TanStack Query",
      "OpenSeadragon",
      "OWASP ZAP",
    ],
    outcomes: [
      {
        label: "납품",
        before: "사내 스테이징까지",
        after: "의료기관 온프레미스 배포",
        change: "납품 완료",
      },
      {
        label: "납품 전 보안 점검",
        before: "절차 없음",
        after: "OWASP ZAP 기반 인증 플로우 스캔",
        change: "절차 도입",
      },
    ],
    disclosure: { label: "고객사 비식별화" },
    capabilityTags: ["security", "visualization"],
    domains: ["medtech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "adc-visualization",
    title: "ADC 데이터 시각화: Next.js 16 기반 3D/2D 분자 뷰어",
    description:
      "항체-약물 접합체(ADC) 데이터 플랫폼에 Molstar·RDKit 기반 3D 단백질/2D 화학구조 뷰어를 구현하고, Claude Code 기반 Playwright E2E 테스트 자동 생성 워크플로우를 도입한 과정.",
    role: "UI 개발 / 테스트 자동화",
    timeline: "2026년 3월 – 2026년 5월",
    industry: "바이오테크 / 항체-약물 접합체(ADC)",
    company: "arontier",
    stack: [
      "React",
      "TypeScript",
      "Next.js 16",
      "Molstar",
      "RDKit",
      "Tailwind CSS",
      "Playwright",
      "Claude Code",
    ],
    outcomes: [
      {
        label: "E2E 테스트 작성",
        before: "수동 스펙 작성",
        after: "Claude Code 기반 자동 생성",
        change: "워크플로우 도입",
      },
      {
        label: "E2E 표준",
        before: "제품마다 제각각 Cypress",
        after: "AD3 28개 앱 이관의 기준이 된 Playwright 컨벤션",
        change: "표준 수립",
      },
    ],
    disclosure: { label: "공개 제품", href: "https://adc.arontier.co/" },
    capabilityTags: ["visualization", "testing"],
    domains: ["biotech"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "devsecops-pipeline",
    title: "하나의 파이프라인, 세 개의 제품: CI/CD와 테스트 리포팅 표준화",
    description:
      "세 코드베이스의 Jenkins 파이프라인 정의를 중앙 저장소 하나로 모아 스테이지 구조를 통일하고, E2E를 Cypress에서 Playwright로 전면 이관해 350개 테스트를 CI에서 자동 실행하도록 만든 과정.",
    role: "CI/CD 파이프라인 설계 및 운영",
    timeline: "2025년 4월 – 2026년 10월",
    industry: "플랫폼 엔지니어링 / DevSecOps",
    company: "arontier",
    stack: [
      "Jenkins",
      "Groovy (Declarative Pipeline)",
      "Docker",
      "Playwright",
      "Snyk",
      "SonarQube",
      "OWASP ZAP",
    ],
    outcomes: [
      {
        label: "수동 회귀 테스트",
        before: "~5시간",
        after: "~1시간",
        change: "−80%",
      },
      {
        label: "E2E 파이프라인 정의",
        before: "314줄 (Cypress)",
        after: "151줄 (Playwright)",
        change: "−52%",
      },
    ],
    disclosure: { label: "사내 인프라" },
    capabilityTags: ["migration", "devops", "security", "testing"],
    domains: ["platform"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "illuminarean-dockerization",
    title: "프론트엔드 Dockerization 및 CI/CD 최적화",
    description:
      "Next.js 14 Standalone 빌드와 pnpm 마이그레이션으로 Docker 이미지를 1.3GB에서 500MB로, 배포 시간을 15분에서 3분 이내로 줄인 과정.",
    role: "배포 파이프라인 및 빌드 구조 개선",
    timeline: "2024년 7월 – 2024년 12월",
    industry: "HR 테크 / 채용 플랫폼",
    company: "illuminarean",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Docker",
      "Jenkins",
      "pnpm",
      "GitHub Actions",
      "next-translate",
    ],
    outcomes: [
      {
        label: "Docker 이미지 용량",
        before: "1.3GB",
        after: "500MB",
        change: "−62%",
      },
      {
        label: "배포 시간",
        before: "~15분",
        after: "3분 이내",
        change: "−80%",
      },
    ],
    disclosure: { label: "사내 인프라" },
    capabilityTags: ["migration", "devops"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "illuminarean-hiring-platform",
    title: "채용 공고·지원자 관리 서비스 및 관리자 페이지 개발",
    description:
      "백엔드 API 개발 전 MSW 목업으로 프론트엔드를 선행 개발한 Next.js 14 기반 채용 서비스와 관리자 페이지, next-translate 기반 다국어 SSG 페이지.",
    role: "서비스/관리자 페이지 개발",
    timeline: "2024년 11월 – 2025년 1월",
    industry: "HR 테크 / 채용 플랫폼",
    company: "illuminarean",
    stack: [
      "Next.js 14",
      "React Query",
      "React Hook Form",
      "MSW",
      "Docker",
      "next-translate",
      "Tailwind CSS",
      "Emotion",
    ],
    outcomes: [
      {
        label: "프론트엔드 착수 시점",
        before: "백엔드 API 대기",
        after: "MSW 목업 기반 선행 개발",
        change: "병렬 개발",
      },
      {
        label: "일정 리스크",
        before: "순차 개발",
        after: "프론트/백엔드 병렬",
        change: "축소",
      },
    ],
    disclosure: { label: "운영 종료" },
    capabilityTags: ["fullstack"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "yura-smart-factory",
    title: "세르비아 생산 공장 스마트팩토리 모니터링 시스템",
    description:
      "ApexCharts·Plotly 기반 차트로 해외 생산 공장의 AOI 공정 데이터를 시각화한 모니터링 대시보드. Figma 설계부터 React 화면 구현까지 맡고 기존 Spring Boot API를 요구에 맞게 수정해, AOI 불량률을 약 20% 낮춘 과정.",
    role: "UI/UX 설계, 화면 구현, API 수정",
    timeline: "2022년 10월 – 2024년 5월",
    industry: "제조 / 스마트팩토리",
    company: "yura",
    stack: [
      "React.js",
      "MUI",
      "ApexCharts",
      "Plotly",
      "Java Spring Boot",
      "MyBatis",
      "MariaDB",
      "Figma",
    ],
    outcomes: [
      {
        label: "AOI 불량률",
        before: "수기 집계 기준",
        after: "약 20% 감소",
        change: "−20%",
      },
      {
        label: "공정 가시성",
        before: "수기 점검",
        after: "대시보드 모니터링",
        change: "대시보드",
      },
    ],
    disclosure: { label: "사내 시스템" },
    capabilityTags: ["fullstack", "visualization"],
    domains: ["manufacturing"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "common-srl-website",
    title: "공식 웹사이트 및 매거진 디스플레이·구매 플랫폼 개발",
    description:
      "밀라노 소재 스타트업의 정적 HTML 사이트를 Vue.js/Vuetify 기반으로 재구축하고, 외주 프리랜서 개인 명의로 있던 도메인과 호스팅을 회사 계정으로 이관한 프로젝트.",
    role: "프론트엔드 재구축 및 도메인·호스팅 이관",
    timeline: "2021년 11월 – 2022년 5월",
    industry: "패션 / 미디어 스타트업",
    company: "common-srl",
    stack: ["Vue.js", "Vuetify"],
    outcomes: [
      {
        label: "코드베이스",
        before: "정적 HTML",
        after: "Vue.js / Vuetify",
        change: "전면 재구축",
      },
      {
        label: "도메인·호스팅",
        before: "외주 프리랜서 개인 명의",
        after: "회사 계정으로 이전",
        change: "소유권 회수",
      },
    ],
    disclosure: { label: "공개 사이트", href: "http://www.common-mag.com/" },
    capabilityTags: ["migration", "frontend"],
    domains: ["web"],
    collaborations: [],
    draft: false,
  },
  {
    slug: "next14-r3f-portfolio",
    title: "몰입형 3D 포트폴리오 구축하기: Next.js 14 + React Three Fiber",
    description:
      "인터랙티브 WebGL 씬, 매크로 키보드 컨트롤, Panda CSS, 그리고 Jenkins부터 K3s까지 이어지는 완전한 CI/CD 파이프라인을 갖춘 이중언어 3D 포트폴리오 사이트.",
    role: "프론트엔드 엔지니어 (단독)",
    timeline: "2023년 12월 – 현재",
    industry: "개인 포트폴리오 / 3D 웹",
    company: "personal",
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
        label: "브라우저 3D",
        before: "정적 포트폴리오 페이지",
        after: "인터랙티브 R3F 씬, 실서비스 중",
        change: "WebGL 직접 구현",
      },
      {
        label: "파이프라인 배포",
        before: "수동",
        after: "Jenkins → GHCR → K3s",
        change: "완전 자동화",
      },
    ],
    disclosure: {
      label: "공개 사이트",
      href: "https://creative.soominlab.com",
    },
    capabilityTags: ["visualization", "devops"],
    domains: ["web"],
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

export function hasCapability(
  study: CaseStudyMeta,
  capability: Capability,
): boolean {
  return CAPABILITY_TAGS[capability].some((tag) =>
    study.capabilityTags.includes(tag),
  );
}

/** Published case studies for one capability, in the curated list order. */
export function getCaseStudiesByCapability(
  locale: Locale,
  capability: Capability,
): CaseStudyMeta[] {
  return getPublishedCaseStudies(locale).filter((study) =>
    hasCapability(study, capability),
  );
}

/** How many published case studies each capability would show. */
export function getCapabilityCounts(
  locale: Locale,
): Record<Capability, number> {
  const published = getPublishedCaseStudies(locale);
  return CAPABILITY_ORDER.reduce(
    (counts, capability) => {
      counts[capability] = published.filter((study) =>
        hasCapability(study, capability),
      ).length;
      return counts;
    },
    {} as Record<Capability, number>,
  );
}

export function getAllSlugs(): string[] {
  return caseStudiesEn.map((c) => c.slug);
}

export interface Highlight {
  slug: string;
  label: string;
  before: string;
  after: string;
  change: string;
}

/**
 * Headline results shown as a KPI row on the home page. Each entry points at an
 * existing case-study outcome rather than restating the numbers, so the tiles and
 * the case studies can never drift apart. Chosen for concrete before → after pairs
 * with visibly different shapes (size, score, time), spanning performance, quality,
 * process, and infrastructure.
 */
const HIGHLIGHT_REFS: Array<{ slug: string; outcome: number }> = [
  { slug: "scientific-platform-performance", outcome: 0 },
  { slug: "scientific-platform-performance", outcome: 1 },
  { slug: "devsecops-pipeline", outcome: 0 },
  { slug: "illuminarean-dockerization", outcome: 0 },
];

export function getHighlights(locale: Locale): Highlight[] {
  return HIGHLIGHT_REFS.flatMap(({ slug, outcome }) => {
    const study = getCaseStudy(locale, slug);
    const result = study?.outcomes[outcome];
    return result ? [{ slug, ...result }] : [];
  });
}
