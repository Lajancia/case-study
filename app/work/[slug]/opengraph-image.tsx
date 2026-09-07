import { ImageResponse } from 'next/og'
import { getCaseStudy } from '@/lib/case-studies'

export const runtime = 'edge'

export const alt = 'Case study'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = getCaseStudy(slug)
  if (!study) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            color: '#374151',
            fontSize: 32,
            fontFamily: 'sans-serif',
          }}
        >
          Case study not found
        </div>
      ),
      { ...size },
    )
  }

  const hasOutcomes = study.outcomes.length > 0
  const outcomeMetric = hasOutcomes
    ? `${study.outcomes[0].label}: ${study.outcomes[0].before} → ${study.outcomes[0].after}`
    : ''

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
          background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 16,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          {study.title}
        </div>
        <div
          style={{
            fontSize: 18,
            textAlign: 'center',
            opacity: 0.85,
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          {study.description}
        </div>
        {hasOutcomes && (
          <div
            style={{
              display: 'flex',
              gap: 48,
              marginTop: 32,
              fontSize: 20,
            }}
          >
            {study.outcomes.slice(0, 2).map((o) => (
              <div key={o.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, marginBottom: 4, opacity: 0.7 }}>
                  {o.label}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>
                    {o.before}
                  </span>
                  <span style={{ fontSize: 36, fontWeight: 700 }}>{o.after}</span>
                  <span style={{ color: '#a7f3d0', fontSize: 16 }}>{o.change}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    { ...size },
  )
}