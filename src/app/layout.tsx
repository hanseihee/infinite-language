import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infinite Language - 무한 영어 학습 | 영어 문장 만들기 연습",
  description: "AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요. 난이도별 학습, 실시간 발음 지원, 랭킹 시스템까지!",
  keywords: "영어학습, 영어문장만들기, 영어공부, 온라인영어, 영어퀴즈, 영어게임, 무료영어학습, AI영어학습, 영어문법, 영어회화",
  authors: [{ name: "Infinite Language Team" }],
  creator: "Infinite Language",
  publisher: "Infinite Language",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://infinite-language-one.vercel.app'),
  openGraph: {
    title: "Infinite Language - 무한 영어 학습",
    description: "AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요.",
    url: 'https://infinite-language-one.vercel.app',
    siteName: 'Infinite Language',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Infinite Language - 영어 학습 플랫폼',
      }
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Infinite Language - 무한 영어 학습',
    description: 'AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요.',
    images: ['/og-image.png'],
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
    canonical: 'https://infinite-language-one.vercel.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Infinite Language',
    applicationCategory: 'EducationalApplication',
    description: 'AI 기반 영어 학습 플랫폼으로 매일 새로운 영어 문장을 만들며 실력을 향상시키세요.',
    url: 'https://infinite-language-one.vercel.app',
    inLanguage: ['ko', 'en'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    creator: {
      '@type': 'Organization',
      name: 'Infinite Language Team',
    },
    educationalUse: ['영어 학습', '문장 구성 연습', '어휘 학습'],
    learningResourceType: 'Quiz',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
      </body>
    </html>
  );
}
