import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/work/scientific-platform-performance/', // draft until published
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}