import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { mailtoUrl } from "@/lib/site";
import type { Locale } from "@/lib/case-studies";
import { ResultsAtAGlance } from "@/components/site/ResultsAtAGlance";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hire" });
  return {
    title: t("title"),
    description: t("tagline"),
  };
}

export default async function HirePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hire" });

  const services = [
    {
      title: t("service1Title"),
      body: t("service1Body"),
      link: t("service1Link"),
      href: "/work/path-wsi-viewer" as const,
    },
    {
      title: t("service2Title"),
      body: t("service2Body"),
      link: t("service2Link"),
      href: "/work/scientific-platform-performance" as const,
    },
    {
      title: t("service3Title"),
      body: t("service3Body"),
      link: t("service3Link"),
      href: "/work/devsecops-pipeline" as const,
    },
  ];

  const howIWork = [
    { title: t("how1Title"), body: t("how1Body") },
    { title: t("how2Title"), body: t("how2Body") },
    { title: t("how3Title"), body: t("how3Body") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
        {t("title")}
      </h1>
      <p className="text-lg text-gray-600 mb-6 dark:text-gray-400">
        {t("tagline")}
      </p>
      <p className="text-gray-700 leading-relaxed mb-16 dark:text-gray-300">
        {t("intro")}
      </p>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">{t("servicesTitle")}</h2>
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="border border-gray-200 rounded-lg p-6 dark:border-gray-800"
            >
              <h3 className="font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-gray-600 mb-3 dark:text-gray-400">
                {service.body}
              </p>
              <Link
                href={service.href}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
              >
                {service.link}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <ResultsAtAGlance locale={locale} />

      {/* Tucked under the KPI tiles rather than floating in its own band */}
      <section className="-mt-12 mb-16">
        <Link
          href="/work"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t("workLink")}
        </Link>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">{t("howTitle")}</h2>
        <div className="space-y-5">
          {howIWork.map((item) => (
            <div
              key={item.title}
              className="border-l-2 border-gray-200 pl-5 dark:border-gray-800"
            >
              <h3 className="font-semibold text-gray-900 mb-1 dark:text-gray-100">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-blue-50 p-8 text-center dark:bg-blue-950/40">
        <h2 className="text-2xl font-bold mb-2">{t("ctaTitle")}</h2>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto dark:text-gray-400">
          {t("ctaBody")}
        </p>
        <a
          href={mailtoUrl("Project inquiry")}
          className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {t("ctaButton")}
        </a>
      </section>
    </div>
  );
}
