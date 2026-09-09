// Locale-independent config only. User-facing copy (tagline, availability,
// etc.) lives in messages/{locale}.json instead, keyed under "site".
export const siteConfig = {
	name: 'Soomin Hwang',
	url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
	email: 'lajancia@soominlab.com',
	social: {
		linkedin: 'https://linkedin.com/in/lajancia',
		github: 'https://github.com/Lajancia',
		medium: 'https://medium.com/@lajancia',
	},
	portfolioUrl: 'https://soominlab.com',
	calendlyUrl: '', // To be filled: real Calendly URL
	resumeUrl: '/resume.pdf', // Drop the actual file at public/resume.pdf
};

export function mailtoUrl(subject: string) {
	return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}`;
}
