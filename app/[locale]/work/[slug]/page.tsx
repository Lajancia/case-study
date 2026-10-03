import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCaseStudy, getAllSlugs, type Locale } from "@/lib/case-studies";
import { mdxModules } from "@/content/work";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { routing } from "@/i18n/routing";
import { CaseStudyCTA } from "@/components/case-study/CaseStudyCTA";

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const study = getCaseStudy(locale, slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.description,
    robots: study.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const study = getCaseStudy(locale, slug);
  if (!study) notFound();

  const MDXContent = mdxModules[locale]?.[slug];
  if (!MDXContent) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <CaseStudyHero study={study} locale={locale} />
      <div className="prose">
        <MDXContent />
      </div>
      <CaseStudyCTA locale={locale} />
    </article>
  );
}
