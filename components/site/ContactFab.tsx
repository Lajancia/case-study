import { getTranslations } from 'next-intl/server';
import { siteConfig } from '@/lib/site';
import type { Locale } from '@/lib/case-studies';

// Contact used to be the heaviest item in a header that had grown to eight
// slots. It is the one entry that benefits from being reachable at any scroll
// position, so it lives down here instead of competing with the nav links.
export async function ContactFab({ locale }: { locale: Locale }) {
	const t = await getTranslations({ locale, namespace: 'nav' });

	return (
		<a
			href={`mailto:${siteConfig.email}`}
			aria-label={t('contact')}
			title={t('contact')}
			className="fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-90 hover:scale-105 transition dark:bg-blue-500 dark:hover:bg-blue-600"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				aria-hidden="true"
				className="h-5 w-5"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3 8.25 10.9 13.2a2 2 0 0 0 2.2 0L21 8.25M4.5 5.25h15A1.5 1.5 0 0 1 21 6.75v10.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.25V6.75a1.5 1.5 0 0 1 1.5-1.5Z"
				/>
			</svg>
		</a>
	);
}
