import type { Locale } from "./case-studies";

export interface Role {
  company: string;
  title: string;
  period: string;
  bullets: string[];
  hasNote?: boolean;
}

export interface AboutContent {
  experience: Role[];
  skills: string[];
  educationSchool: string;
  educationProgram: string;
  educationMinor?: string;
  educationPeriod: string;
}

const EXPERIENCE_EN: Role[] = [
  {
    company: "Arontier",
    title: "Frontend Engineer, Platform Team",
    period: "Mar 2025 – present",
    bullets: [
      "Own frontend development on AD3, a protein structure analysis platform — Molstar/RDKit-based 3D visualization, analysis parameter forms, and route-scoped bundle optimization (32MB → 6.5MB, Lighthouse 29 → 78).",
      "Built viewer and interaction UI for a digital pathology (WSI) platform, including security-requirement response for an on-premise, regulated deployment.",
      "Designed a shared Jenkins Build-Test-Scan-Deploy pipeline (Cypress, Snyk, SonarQube) used across three frontend products — cut manual regression testing from ~5 hours to ~1 hour per release.",
      "Built 3D/2D molecular viewers for an antibody-drug conjugate (ADC) data platform, and introduced a Claude Code-based workflow for automated test generation.",
      "Led AD3's E2E migration from Cypress to Playwright; ADC was built on Playwright from the start and set the conventions the migration followed.",
    ],
  },
  {
    company: "Illuminarian",
    title: "Frontend Engineer",
    period: "Jun 2024 – Feb 2025 · 9 months · Remote",
    bullets: [
      "Migrated to a Next.js 14 standalone build + pnpm, cutting the Docker image from 1.3GB to 500MB and deploy time from 15 minutes to under 3.",
      "Built a recruiting and applicant-management service plus its admin panel (Next.js 14, React Hook Form, React Query).",
      "Introduced MSW to let frontend development and testing proceed ahead of backend API availability.",
    ],
    hasNote: true,
  },
  {
    company: "Yura",
    title: "Frontend Engineer & API Developer",
    period:
      "Oct 2022 – May 2024 · 1 yr 8 mo · Seoul-based, remote collaboration with Serbia plant",
    bullets: [
      "Designed and built a chart-based monitoring dashboard for a Serbia-based production plant, from Figma design through React/MUI implementation to a Spring Boot + MariaDB backend.",
      "Visualized per-product, per-line AOI pass rates with ApexCharts and Plotly; the resulting real-time monitoring cut the AOI defect rate by roughly 20%.",
      "Coordinated directly with the Serbia-based plant team in English on process formulas and feedback.",
    ],
  },
  {
    company: "commON srl",
    title: "Frontend Intern",
    period: "Nov 2021 – May 2022 · 7 months · On-site (Milan) + remote",
    bullets: [
      "Built the official website and a magazine display/purchase platform for a Milan-based startup using Vue.js/Vuetify.",
      "Worked in a multinational team on a fashion-magazine and event-marketing web product, and improved portfolio UX for social-driven traffic.",
    ],
  },
];

const EXPERIENCE_KO: Role[] = [
  {
    company: "아론티어 (Arontier)",
    title: "프론트엔드 엔지니어, 플랫폼팀",
    period: "2025년 3월 – 현재",
    bullets: [
      "단백질 구조 분석 플랫폼 AD3의 프론트엔드 개발 담당 — Molstar/RDKit 기반 3D 시각화, 분석 파라미터 입력 폼, 라우트 단위 번들 최적화(32MB → 6.5MB, Lighthouse 29 → 78).",
      "병리 이미지(WSI) 분석 플랫폼의 뷰어·인터랙션 UI 개발, 온프레미스 규제 환경 납품을 위한 보안 요구사항 대응 포함.",
      "3개 프론트엔드 제품에서 공통으로 쓰는 Jenkins Build-Test-Scan-Deploy 파이프라인(Cypress, Snyk, SonarQube) 설계 — 수동 회귀 테스트 시간을 릴리즈당 약 5시간에서 1시간으로 단축.",
      "항체-약물 접합체(ADC) 데이터 플랫폼의 3D/2D 분자 뷰어 구현, Claude Code 기반 테스트 자동 생성 워크플로우 도입.",
      "AD3의 E2E 테스트를 Cypress에서 Playwright로 마이그레이션 주도 — ADC에서 먼저 잡은 Playwright 기준을 그대로 적용.",
    ],
  },
  {
    company: "일루미나리안",
    title: "프론트엔드 엔지니어",
    period: "2024년 6월 – 2025년 2월 · 9개월 · 원격",
    bullets: [
      "Next.js 14 standalone 빌드 + pnpm으로 마이그레이션, Docker 이미지를 1.3GB에서 500MB로, 배포 시간을 15분에서 3분 이내로 단축.",
      "채용 공고 및 지원자 관리 서비스와 그 관리자 페이지 개발 (Next.js 14, React Hook Form, React Query).",
      "MSW를 도입해 백엔드 API 준비 전에 프론트엔드 개발·테스트를 먼저 진행할 수 있도록 함.",
    ],
    hasNote: true,
  },
  {
    company: "유라",
    title: "프론트엔드 엔지니어 & API 개발자",
    period:
      "2022년 10월 – 2024년 5월 · 1년 8개월 · 서울 근무, 세르비아 현지와 원격 협업",
    bullets: [
      "세르비아 소재 생산 공장을 위한 차트 기반 모니터링 대시보드를 Figma 설계부터 React/MUI 구현, Spring Boot + MariaDB 백엔드까지 직접 설계·개발.",
      "ApexCharts·Plotly로 품목별·라인별 AOI 직행률을 시각화 — 실시간 모니터링 체계로 AOI 불량률을 약 20% 감소.",
      "세르비아 현지 공장 팀과 영어로 직접 소통하며 공정 계산식과 피드백을 반영.",
    ],
  },
  {
    company: "commON srl",
    title: "프론트엔드 인턴",
    period: "2021년 11월 – 2022년 5월 · 7개월 · 밀라노 현지 근무 + 원격",
    bullets: [
      "밀라노 소재 스타트업의 공식 웹사이트와 매거진 디스플레이·구매 플랫폼을 Vue.js/Vuetify로 개발.",
      "다국적 팀에서 패션 매거진 및 이벤트 마케팅 웹 제품을 작업하고, SNS 유입 트래픽을 위한 포트폴리오 UX 개선.",
    ],
  },
];

const SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Vite",
  "Jotai",
  "TanStack Query",
  "React Hook Form",
  "MSW",
  "MUI",
  "Tailwind CSS",
  "Molstar",
  "RDKit",
  "OpenSeadragon",
  "Three.js",
  "ApexCharts",
  "Plotly",
  "Playwright",
  "Cypress",
  "Jenkins",
  "Docker",
  "Docker Compose",
  "GitLab",
  "GitHub",
  "Snyk",
  "OWASP ZAP",
  "SonarQube",
  "Claude Code",
  "Django",
  "Python",
  "Spring Boot",
];

const ABOUT_CONTENT: Record<Locale, AboutContent> = {
  en: {
    experience: EXPERIENCE_EN,
    skills: SKILLS,
    educationSchool: "Hankuk University of Foreign Studies (Global)",
    educationProgram: "Computer & Electronic Systems Engineering",
    educationMinor: "Minor in Spanish Interpretation & Translation",
    educationPeriod: "2018 – 2023",
  },
  ko: {
    experience: EXPERIENCE_KO,
    skills: SKILLS,
    educationSchool: "한국외국어대학교(글로벌)",
    educationProgram: "컴퓨터전자시스템공학부",
    educationMinor: "부전공 스페인통번역학과",
    educationPeriod: "2018 – 2023",
  },
};

export function getAboutContent(locale: Locale): AboutContent {
  return ABOUT_CONTENT[locale] ?? ABOUT_CONTENT.en;
}
