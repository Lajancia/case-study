import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { siteConfig, mailtoUrl } from '@/lib/site';
import { getCaseStudies, type Locale } from '@/lib/case-studies';
import { ResultsAtAGlance } from '@/components/site/ResultsAtAGlance';

/** Small uppercase mono section label, per the Figma telemetry design. */
function Kicker({ children }: { children: string }) {
	return (
		<div className="mb-3 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-[#ffb3ae]">
			<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
			{children}
		</div>
	);
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'home' });
	const tSite = await getTranslations({ locale, namespace: 'site' });
	const featuredStudies = getCaseStudies(locale).slice(0, 2);

	return (
		<div className="mx-auto max-w-6xl px-6">
			{/* Technical status beacon bar */}
			<div className="-mx-6 border-b border-gray-200 dark:border-gray-800">
				<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2 font-mono text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
					<div className="flex flex-wrap items-center gap-x-2">
						<span>ROOT &gt; HOME</span>
						<span aria-hidden>/</span>
						<span>{locale === 'ko' ? 'KO-KR' : 'EN-US'}</span>
					</div>
					<div className="flex items-center gap-2">
						<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-green-500" />
						<span>ALL_SYSTEMS: NOMINAL</span>
					</div>
				</div>
			</div>

			{/* Hero */}
			<section className="py-16 sm:py-24">
				<div className="mb-5">
					<span className="border border-gray-200 bg-gray-50 px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-[#ffb3ae]">
						{t('dossierBadge')}
					</span>
				</div>
				<h1 className="animate-slide-up max-w-3xl text-4xl font-bold tracking-tight leading-tight mb-4 text-gray-900 sm:text-5xl dark:text-white">
					{tSite('tagline')}
				</h1>
				<p className="animate-slide-up [animation-delay:80ms] max-w-2xl text-lg text-gray-600 mb-6 dark:text-gray-400">
					{t('heroSubtitle')}
				</p>
				<div className="animate-slide-up [animation-delay:160ms] flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
					<Link
						href="/work"
						className="inline-flex w-full max-w-64 items-center justify-center border border-blue-600 bg-blue-600 px-8 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 sm:w-auto sm:max-w-none dark:border-blue-700 dark:bg-blue-700 dark:text-[#f8f9fa] dark:hover:bg-[#991b1b]"
					>
						{t('viewCaseStudy')}
					</Link>
					{siteConfig.calendlyUrl ? (
						<a
							href={siteConfig.calendlyUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex w-full max-w-64 items-center justify-center border border-gray-300 px-8 py-2.5 font-mono text-sm font-medium tracking-wider text-gray-700 transition-colors hover:border-gray-400 sm:w-auto sm:max-w-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600"
						>
							{t('bookACall')}
						</a>
					) : (
						<a
							href={mailtoUrl('Hello from your case study site')}
							className="inline-flex w-full max-w-64 items-center justify-center border border-gray-300 px-8 py-2.5 font-mono text-sm font-medium tracking-wider text-gray-700 transition-colors hover:border-gray-400 sm:w-auto sm:max-w-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600"
						>
							{t('emailSoomin')}
						</a>
					)}
				</div>
			</section>

			{/* Results at a glance — KPI row */}
			<ResultsAtAGlance locale={locale} />

			{/* Featured results */}
			{featuredStudies.length > 0 && (
				<section className="my-16">
					<Kicker>SELECTED AUDITS</Kicker>
					<h2 className="text-2xl font-bold">{t('selectedWork')}</h2>
					<div className="mt-6 space-y-6">
						{featuredStudies.map((study) => (
							<div
								key={study.slug}
								className="border border-gray-200 bg-gray-50 p-6 transition-colors hover:border-blue-400 sm:p-8 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-600"
							>
								<div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-blue-600 dark:text-[#ffb3ae]">
									{study.industry}
								</div>
								<h3 className="mb-2 text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
									{study.title}
								</h3>
								<p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
									{study.description}
								</p>
								<div className="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
									{study.outcomes.slice(0, 2).map((outcome) => (
										<div
											key={outcome.label}
											className="min-w-0 border border-gray-200 bg-gray-100 px-3.5 py-2.5 dark:border-gray-800 dark:bg-gray-800"
										>
											<div className="mb-1.5 truncate font-mono text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-500">
												{outcome.label}
											</div>
											<div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
												<span className="text-xs text-gray-600 line-through dark:text-gray-500">
													{outcome.before}
												</span>
												<span className="text-xl font-semibold text-gray-900 dark:text-white">
													{outcome.after}
												</span>
												<span className="font-mono text-[11px] font-medium text-green-700 dark:text-green-400">
													{outcome.change}
												</span>
											</div>
										</div>
									))}
								</div>
								<Link
									href={`/work/${study.slug}`}
									className="font-mono text-xs font-medium tracking-wide text-blue-600 transition-colors hover:text-blue-700 dark:text-[#ffb3ae] dark:hover:text-blue-500"
								>
									{t('readFullCaseStudy')}
								</Link>
							</div>
						))}
					</div>
					<Link
						href="/work"
						className="mt-6 block text-center font-mono text-xs uppercase tracking-wider text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-700"
					>
						{t('seeAllCaseStudies')}
					</Link>
				</section>
			)}

			{/* Core strengths — 3-column technical focus grid */}
			<section className="mb-16">
				<Kicker>CORE STRENGTHS</Kicker>
				<h2 className="text-2xl font-bold mb-2">{t('howWeWorkTitle')}</h2>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
					{t('howWeWorkSubtitle')}
				</p>
				<div className="grid gap-6 sm:grid-cols-3">
					<div className="border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
						<h3 className="mb-2 font-semibold">{t('frontendTitle')}</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{t('frontendBody')}
						</p>
					</div>
					<div className="border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
						<h3 className="mb-2 font-semibold">{t('devopsTitle')}</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{t('devopsBody')}
						</p>
					</div>
					<div className="border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
						<h3 className="mb-2 font-semibold">{t('agenticTitle')}</h3>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{t('agenticBody')}
						</p>
					</div>
				</div>
			</section>

			{/* Expertise tag matrix */}
			<section className="mb-16">
				<Kicker>EXPERTISE MATRIX</Kicker>
				<h2 className="text-2xl font-bold mb-6">{t('expertiseTitle')}</h2>
				<div className="mb-4 flex flex-wrap gap-2">
					{[
						'React',
						'Next.js',
						'TypeScript',
						'Scientific visualization',
						'Playwright',
						'Cypress',
						'Jenkins',
						'Docker',
						'DevSecOps',
						'Performance optimization',
					].map((item) => (
						<span
							key={item}
							className="border border-gray-200 bg-gray-50 px-3 py-1 font-mono text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
						>
							{item}
						</span>
					))}
				</div>
				<Link
					href="/about"
					className="font-mono text-xs font-medium tracking-wide text-blue-600 transition-colors hover:text-blue-700 dark:text-[#ffb3ae] dark:hover:text-blue-500"
				>
					{t('fullBackground')}
				</Link>
			</section>

			{/* Closing CTA */}
			<section className="border-t border-gray-200 py-12 text-center dark:border-gray-800">
				<div className="mb-4 flex justify-center">
					<div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-[#ffb3ae]">
						<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
						CLOSING TRANSMISSION
					</div>
				</div>
				<h2 className="mb-3 text-2xl font-bold">{t('letsWorkTitle')}</h2>
				<p className="mb-6 text-gray-600 dark:text-gray-400">
					{t('letsWorkSubtitle')}
				</p>
				<div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
					<Link
						href="/work"
						className="inline-flex w-full max-w-64 items-center justify-center border border-blue-600 bg-blue-600 px-8 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-blue-700 sm:w-auto sm:max-w-none dark:border-blue-700 dark:bg-blue-700 dark:text-[#f8f9fa] dark:hover:bg-[#991b1b]"
					>
						{t('viewCaseStudy')}
					</Link>
					<a
						href={mailtoUrl("Let's work together")}
						className="inline-flex w-full max-w-64 items-center justify-center border border-gray-300 px-8 py-2.5 font-mono text-sm font-medium tracking-wider text-gray-700 transition-colors hover:border-gray-400 sm:w-auto sm:max-w-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-600"
					>
						{t('emailSoomin')}
					</a>
				</div>
			</section>
		</div>
	);
}
