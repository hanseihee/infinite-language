import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "영어 퀴즈 - lingbrew | 문장 만들기 연습",
  description: "AI가 생성한 영어 문장을 올바른 순서로 배열하며 실력을 향상시키세요. 난이도별, 상황별 맞춤 학습!",
  keywords: "영어퀴즈, 영어문장만들기, 영어게임, 온라인영어퀴즈, 문장구성연습, 영어어순, 영어학습게임",
  openGraph: {
    title: "영어 퀴즈 - lingbrew",
    description: "AI가 생성한 영어 문장을 올바른 순서로 배열하며 실력을 향상시키세요.",
    url: 'https://lingbrew.com/quiz',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '영어 퀴즈 - lingbrew',
    description: 'AI가 생성한 영어 문장을 올바른 순서로 배열하며 실력을 향상시키세요.',
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://lingbrew.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '영어 퀴즈',
        item: 'https://lingbrew.com/quiz',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}