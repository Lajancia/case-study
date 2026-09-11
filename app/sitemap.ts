import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'
import { getAllSlugs } from '@/lib/case-studies'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push(
      { url: `${siteConfig.url}/${locale}`, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
      { url: `${siteConfig.url}/${locale}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
      { url: `${siteConfig.url}/${locale}/work`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
      // Not linked from the site nav — reached from B2B platform profiles — but
      // listed here so it stays indexable.
      { url: `${siteConfig.url}/${locale}/hire`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    )
    for (const slug of getAllSlugs()) {
      entries.push({
        url: `${siteConfig.url}/${locale}/work/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  return entries
}
