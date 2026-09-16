import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { HIRE_TRACK_COOKIE } from '@/proxy';
import { siteConfig } from '@/lib/site';
import type { Locale } from '@/lib/case-studies';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { MobileNav } from '@/components/site/MobileNav';
import { LanguageSwitcher } from '@/components/site/LanguageSwitcher';

export async function SiteHeader({ locale }: { locale: Locale }) {
	const t = await getTranslations({ locale, namespace: 'nav' });
	const contactHref = siteConfig.calendlyUrl || `mailto:${siteConfig.email}`;
	const resumeUrl = `/resume_${locale}.pdf`;

	// Set by the proxy when someone lands on /hire. The page is unlinked by
	// design, so this is the only way back to it once they follow a link out.
	const onHireTrack =
		(await cookies()).get(HIRE_TRACK_COOKIE)?.value === 'hire';

	const navLinks = [
		{ label: t('about'), href: '/about' as const },
		{ label: t('work'), href: '/work' as const },
		...(onHireTrack ? [{ label: t('hire'), href: '/hire' as const }] : []),
		{
			label: t('technicalWriting'),
			href: siteConfig.social.medium,
			external: true,
		},
	];

	return (
		<header className="relative z-50 border-b border-gray-200 dark:border-gray-800">
			<div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
				<Link
					href="/"
					className="text-lg font-semibold tracking-tight text-gray-900 hover:text-blue-600 transition-colors dark:text-white dark:hover:text-gray-100"
				>
					{siteConfig.name}
				</Link>
				<nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
					<Link
						href="/about"
						className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
					>
						{t('about')}
					</Link>
					<Link
						href="/work"
						className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
					>
						{t('work')}
					</Link>
					{onHireTrack && (
						<Link
							href="/hire"
							className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
						>
							{t('hire')}
						</Link>
					)}
					<a
						href={siteConfig.social.medium}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-gray-900 transition-colors dark:hover:text-gray-100"
					>
						{t('technicalWriting')}
					</a>
					<a
						href={resumeUrl}
						download
						className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-3.5 py-1.5 text-gray-700 hover:border-gray-400 transition-colors dark:border-gray-700 dark:text-gray-700 dark:hover:border-gray-500"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="w-3.5 h-3.5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
							/>
						</svg>
						{t('resume')}
					</a>
					<a
						href={contactHref}
						className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-white text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
					>
						{t('contact')}
					</a>
					<LanguageSwitcher />
					<ThemeToggle />
				</nav>
				<div className="flex items-center gap-1 sm:hidden">
					<LanguageSwitcher />
					<ThemeToggle />
					<MobileNav
						links={navLinks}
						contactHref={contactHref}
						contactLabel={t('contact')}
						resumeUrl={resumeUrl}
						resumeLabel={t('resume')}
						openLabel={t('openMenu')}
						closeLabel={t('closeMenu')}
					/>
				</div>
			</div>
		</header>
	);
}
