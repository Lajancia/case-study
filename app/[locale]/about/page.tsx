import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { mailtoUrl } from "@/lib/site";
import { getAboutContent } from "@/lib/about-content";
import type { Locale } from "@/lib/case-studies";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description:
      "Background, experience, and skills — Soomin Hwang, frontend engineer for data-intensive React products.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const content = getAboutContent(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-4 dark:text-gray-400">
        {tSite("tagline")}
      </p>

      <section className="mb-16">
        <p className="text-gray-700 leading-relaxed dark:text-gray-300">
          {t("intro")}
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">{t("experience")}</h2>
        <div className="space-y-10">
          {content.experience.map((role) => (
            <div
              key={`${role.company}-${role.period}`}
              className="border-l-2 border-gray-200 pl-5 dark:border-gray-800"
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {role.company}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  — {role.title}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3 dark:text-gray-600">
                {role.period}
              </p>
              <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                {role.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-gray-300 dark:text-gray-700">
                      &middot;
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {role.hasNote && (
                <p className="text-xs text-gray-400 mt-2 italic dark:text-gray-600">
                  {t("leftNote")}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">{t("skills")}</h2>
        <div className="flex flex-wrap gap-2">
          {content.skills.map((item) => (
            <span
              key={item}
              className="text-sm bg-[#00224D] text-[#F5EBDD] dark:bg-[#FF204E] dark:text-white px-3 py-1 rounded-full font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold mb-6">{t("education")}</h2>
        <div className="border-l-2 border-gray-200 pl-5 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {content.educationSchool}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            {content.educationProgram}
            {content.educationMinor && (
              <> &middot; {content.educationMinor}</>
            )}{" "}
            &middot; {content.educationPeriod}
          </p>
        </div>
      </section>

      <section className="text-center py-12 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-3">{t("letsWorkTitle")}</h2>
        <p className="text-gray-600 mb-6 dark:text-gray-400">
          {t("letsWorkSubtitle")}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={mailtoUrl("Hello from your about page")}
            className="inline-flex items-center rounded-full bg-blue-600 px-6 py-2.5 text-white font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t("emailSoomin")}
          </a>
        </div>
      </section>
    </div>
  );
}
