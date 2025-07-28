import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lingbrew - AI 언어 학습 | 영어 문장 만들기 연습",
  description: "AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요. 난이도별 학습, 실시간 발음 지원, 랭킹 시스템까지!",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  keywords: "영어학습, 영어문장만들기, 영어공부, 온라인영어, 영어퀴즈, 영어게임, 무료영어학습, AI영어학습, 영어문법, 영어회화",
  authors: [{ name: "lingbrew Team" }],
  creator: "lingbrew",
  publisher: "lingbrew",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lingbrew.com'),
  openGraph: {
    title: "lingbrew - AI 언어 학습",
    description: "AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요.",
    url: 'https://lingbrew.com',
    siteName: 'lingbrew',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'lingbrew - AI 언어 학습 플랫폼',
      }
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lingbrew - AI 언어 학습',
    description: 'AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://lingbrew.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'lingbrew',
      applicationCategory: 'EducationalApplication',
      description: 'AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요.',
      url: 'https://lingbrew.com',
      inLanguage: ['ko', 'en'],
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KRW',
      },
      creator: {
        '@type': 'Organization',
        name: 'lingbrew Team',
      },
      educationalUse: ['영어 학습', '문장 구성 연습', '어휘 학습'],
      learningResourceType: 'Quiz',
      audience: {
        '@type': 'EducationalAudience',
        educationalRole: 'student',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'lingbrew는 무료로 사용할 수 있나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '네, lingbrew는 완전 무료로 이용하실 수 있습니다. 하루에 50문제까지 무료로 학습할 수 있으며, 추가 비용은 없습니다.',
          },
        },
        {
          '@type': 'Question',
          name: '영어 문장은 어떻게 생성되나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'lingbrew는 OpenAI의 GPT-3.5 기술을 활용하여 사용자가 선택한 난이도와 환경에 맞는 실용적인 영어 문장을 실시간으로 생성합니다.',
          },
        },
        {
          '@type': 'Question',
          name: '어떤 난이도가 나에게 맞나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '쉬움: 기초 문법과 일상 단어 위주 (초급자)\n중간: 복잡한 문장 구조와 다양한 시제 (중급자)\n어려움: 고급 어휘와 관용 표현 포함 (상급자)',
          },
        },
        {
          '@type': 'Question',
          name: '발음 듣기 기능은 어떻게 사용하나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '각 문제를 풀고 나면 스피커 아이콘을 클릭하여 정답 문장의 올바른 발음을 들을 수 있습니다. Google TTS 기술을 사용하여 자연스러운 영어 발음을 제공합니다.',
          },
        },
        {
          '@type': 'Question',
          name: '랭킹 시스템은 어떻게 작동하나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '각 난이도별로 누적 점수를 기반으로 순위가 매겨집니다. 문제를 많이 풀고 정답률이 높을수록 더 높은 순위를 달성할 수 있습니다.',
          },
        },
      ],
    },
  ];

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color" content="#3B82F6" />
        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
