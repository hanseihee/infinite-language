import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'lingbrew - AI 언어 학습'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#14171D',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              margin: 0,
            }}
          >
            lingbrew
          </h1>
          <p
            style={{
              fontSize: 36,
              color: '#E5E7EB',
              margin: 0,
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            AI 기반 영어 학습 플랫폼
          </p>
          <p
            style={{
              fontSize: 28,
              color: '#9CA3AF',
              margin: 0,
              textAlign: 'center',
              maxWidth: 800,
            }}
          >
            매일 새로운 문장으로 영어 실력을 향상시키세요
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 40,
            fontSize: 24,
            color: '#6B7280',
          }}
        >
          <span>🎯 난이도별 학습</span>
          <span>🔊 발음 지원</span>
          <span>🏆 랭킹 시스템</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}