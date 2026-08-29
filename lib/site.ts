export const siteConfig = {
  name: 'Soomin Hwang',
  tagline: 'Frontend engineer for data-intensive React products.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: 'lajancia@soominlab.com',
  social: {
    linkedin: 'https://linkedin.com/in/lajancia',
    github: 'https://github.com/g3941813-svg',
    medium: 'https://medium.com/@lajancia',
  },
  availability: {
    status: 'Available for contract/B2B from 20 October 2026',
    timezone: 'CET (Nov–Jan), KST (thereafter)',
  },
  portfolioUrl: 'https://soominlab.com',
  calendlyUrl: '', // To be filled: real Calendly URL
}

export function mailtoUrl(subject: string) {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`
}