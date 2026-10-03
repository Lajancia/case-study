import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const runtime = 'edge'

export const alt = 'Soomin Hwang — Frontend Case Studies'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TAGLINE: Record<string, string> = {
  en: 'Frontend engineer for data-intensive React products.',
  ko: '데이터 집약적인 React 제품을 위한 프론트엔드 엔지니어.',
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tagline = TAGLINE[locale] ?? TAGLINE.en

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 24, opacity: 0.9, textAlign: 'center', maxWidth: 600 }}>
          {tagline}
        </div>
      </div>
    ),
    { ...size },
  )
}
