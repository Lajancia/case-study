import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
	CAPABILITY_ORDER,
	COMPANY_ORDER,
	getCapabilityCounts,
	getCaseStudies,
	getCaseStudiesByCapability,
	isCapability,
	type Locale,
} from '@/lib/case-studies';
import { WorkCard } from '@/components/work/WorkCard';
import { siteConfig, mailtoUrl } from '@/lib/site';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'work' });
	return {
		title: t('title'),
		description: 'Case studies demonstrating frontend engineering results.',
	};
}

/**
 * Work index, restyled after the Figma "Case study - Desktop" frame
 * (telemetry-dossier dark design). The palette is fixed dark on purpose —
 * this section is independent of the site's light/dark theme.
 *
 * Behaviour carried over unchanged: `?do=` capability filtering stays
 * server-rendered and shareable; drafts stay visible, full-contrast, and
 * marked as drafts rather than dimmed.
 */
export default async function WorkPage({
	params,
	searchParams,
}: {
	params: Promise<{ locale: Locale }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: 'work' });

	// `?do=` picks a capability. Reading it here rather than filtering on the
	// client keeps every view a shareable, crawlable URL that works without JS —
	// the hire page links straight into these.
	const requested = (await searchParams).do;
	const active = isCapability(requested) ? requested : null;

	const counts = getCapabilityCounts(locale);
	const caseStudies = getCaseStudies(locale);
	const published = caseStudies.filter((c) => !c.draft);
	const drafts = caseStudies.filter((c) => c.draft);
	const filtered = active ? getCaseStudiesByCapability(locale, active) : null;
	const visible = filtered ?? caseStudies;

	const statusBarLabel = `SYS.AUDITS // ${
		locale === 'ko' ? 'KO-KR' : 'EN-US'
	}`;
	const filterLabel = active
		? active.replace(/-/g, '_').toUpperCase()
		: 'ALL_PROJECTS';

	const chipBase =
		'inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-xs transition-colors whitespace-nowrap';
	const chipOn =
		'border-[#d9383a] bg-[#12151c] text-[#ffb3ae] font-medium';
	const chipOff =
		'border-[#222734] bg-[#12151c] text-[#94a3b8] hover:border-[#d9383a]/60 hover:text-[#f8f9fa]';

	const renderCard = (study: (typeof visible)[number], index: number) => (
		<WorkCard key={study.slug} study={study} locale={locale} index={index} />
	);

	// AUDIT #NN runs over the whole case-study list order (published grouped by
	// company first, drafts last) so the tag is stable across capability views.
	const orderIndex = new Map(
		caseStudies.map((study, i) => [study.slug, i] as const),
	);
	const auditNo = (study: (typeof visible)[number]) =>
		orderIndex.get(study.slug) ?? 0;

	return (
		<div className="min-h-full bg-[#0b0d11] text-[#f8f9fa]">
			{/* System telemetry status bar */}
			<div className="border-b border-[#222734]">
				<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-2 font-mono text-[11px] uppercase tracking-wider text-[#94a3b8]">
					<div className="flex flex-wrap items-center gap-x-2">
						<span>{statusBarLabel}</span>
						<span aria-hidden>/</span>
						<span>ROOT &gt; WORK</span>
						<span aria-hidden>/</span>
						<span className="text-[#94a3b8]">
							FILTER: {filterLabel}
						</span>
					</div>
					<div className="flex items-center gap-2 tabular-nums">
						<span>TOTAL_AUDITS:</span>
						<span className="font-semibold text-[#f8f9fa]">
							{visible.length}
						</span>
					</div>
				</div>
			</div>

			{/* Hero & filter module */}
			<header className="relative overflow-hidden border-b border-[#222734]">
				<div
					aria-hidden
					className="pointer-events-none absolute -top-40 left-1/2 h-[384px] w-[384px] -translate-x-1/2 bg-[#d9383a]/[0.05] blur-3xl"
				/>
				<div className="relative mx-auto max-w-6xl px-6 py-16">
					<div className="mb-6 flex flex-wrap items-center gap-3">
						<span className="border border-[#222734] bg-[#181c26] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ffb3ae]">
							{t('dossier')}
						</span>
					</div>
					<h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
						{t('heroTitle')}
					</h1>
					<p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
						{t('heroSubtitle')}
					</p>

					<nav
						aria-label={t('filterAria')}
						className="mt-10 flex flex-wrap gap-2"
					>
						<Link
							href="/work"
							aria-current={active ? undefined : 'page'}
							className={`${chipBase} ${active ? chipOff : chipOn}`}
						>
							{active ? null : (
								<span
									aria-hidden
									className="h-1.5 w-1.5 rounded-full bg-[#d9383a]"
								/>
							)}
							{t('capabilities.all')}
							<span className="border border-[#222734] bg-[#181c26] px-1.5 py-0.5 text-[10px] tabular-nums text-[#94a3b8]">
								{caseStudies.length}
							</span>
						</Link>
						{CAPABILITY_ORDER.filter(
							(capability) => counts[capability] > 0,
						).map((capability) => (
							<Link
								key={capability}
								href={{ pathname: '/work', query: { do: capability } }}
								aria-current={
									active === capability ? 'page' : undefined
								}
								className={`${chipBase} ${
									active === capability ? chipOn : chipOff
								}`}
							>
								{active === capability && (
									<span
										aria-hidden
										className="h-1.5 w-1.5 rounded-full bg-[#d9383a]"
									/>
								)}
								{t(`capabilities.${capability}`)}
								<span className="border border-[#222734] bg-[#181c26] px-1.5 py-0.5 text-[10px] tabular-nums text-[#94a3b8]">
									{counts[capability]}
								</span>
							</Link>
						))}
					</nav>
				</div>
			</header>

			{/* Main content listing */}
			<div className="mx-auto max-w-6xl px-6 py-16">
				{filtered ? (
					<div>
						<p className="mb-6 font-mono text-xs uppercase tracking-wider text-[#94a3b8]">
							{t('resultCount', { count: filtered.length })}
						</p>
						<div className="grid gap-6">
							{filtered.map((study) => renderCard(study, auditNo(study)))}
						</div>
						<Link
							href="/work"
							className="mt-8 inline-block font-mono text-xs uppercase tracking-wider text-[#94a3b8] underline underline-offset-4 transition-colors hover:text-[#f8f9fa]"
						>
							{t('clearFilter')}
						</Link>
					</div>
				) : (
					<>
						{published.length > 0 && (
							<div className="space-y-16">
								{COMPANY_ORDER.map((company) => {
									const studies = published.filter(
										(c) => c.company === company,
									);
									if (studies.length === 0) return null;
									return (
										<section key={company}>
											<div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-[#222734] pb-4">
												<div>
													<h2 className="text-3xl font-bold tracking-tight">
														{t(`groups.${company}`)}
													</h2>
													<p className="mt-1 text-[13px] text-[#94a3b8]">
														{studies[0].industry}
													</p>
												</div>
												<span className="font-mono text-[11px] uppercase tracking-wider text-[#94a3b8]">
													[ENV:{' '}
													{company.replace(/-/g, '_').toUpperCase()}] ·{' '}
													{studies.length} AUDITS
												</span>
											</div>
											<div className="grid gap-6">
												{studies.map((study) => renderCard(study, auditNo(study)))}
											</div>
										</section>
									);
								})}
							</div>
						)}
						{drafts.length > 0 && (
							<div className="mt-16">
								{published.length > 0 && (
									<h2 className="mb-4 border-b border-[#222734] pb-4 text-3xl font-bold tracking-tight text-[#94a3b8]">
										{t('comingSoon')}
									</h2>
								)}
								<div className="grid gap-6">
									{drafts.map((study) => renderCard(study, auditNo(study)))}
								</div>
							</div>
						)}
					</>
				)}
			</div>

			{/* Direct engineering contact */}
			<section className="border-t border-[#222734]">
				<div className="mx-auto max-w-6xl px-6 py-16">
					<div className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ffb3ae]">
						<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#d9383a]" />
						{t('ctaLabel')}
					</div>
					<h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight">
						{t('ctaTitle')}
					</h2>
					<p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#94a3b8]">
						{t('ctaBody')}
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-4">
						<a
							href={mailtoUrl('Platform engineering inquiry')}
							className="inline-flex items-center gap-2 border border-[#d9383a] bg-[#181c26] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#ffb3ae] transition-colors hover:bg-[#d9383a]/10"
						>
							{t('ctaButton')}
						</a>
						<a
							href={siteConfig.social.linkedin}
							className="border border-[#222734] bg-[#12151c] px-3 py-1.5 font-mono text-xs text-[#94a3b8] transition-colors hover:border-[#d9383a]/60 hover:text-[#f8f9fa]"
						>
							LinkedIn
						</a>
						<a
							href={siteConfig.social.github}
							className="border border-[#222734] bg-[#12151c] px-3 py-1.5 font-mono text-xs text-[#94a3b8] transition-colors hover:border-[#d9383a]/60 hover:text-[#f8f9fa]"
						>
							GitHub
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
