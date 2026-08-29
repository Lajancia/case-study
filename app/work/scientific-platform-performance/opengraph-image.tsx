import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const runtime = 'edge'

export const alt = "Cutting a Scientific 3D Platform's Main Bundle by 80%"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function ScientificPerformanceOG() {
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
        <div style={{ fontSize: 36, fontWeight: 700, marginBottom: 16, textAlign: 'center', lineHeight: 1.3 }}>
          Cutting a Scientific 3D Platform's Main Bundle by 80%
        </div>
        <div style={{ display: 'flex', gap: 48, marginTop: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700, textDecoration: 'line-through', opacity: 0.5 }}>32MB</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>Before</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 700 }}>6.5MB</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>After</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}