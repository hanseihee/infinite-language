import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'lingbrew - 랭킹 | 언어 학습 순위',
  description: '영어 학습 실력을 겨뤄보세요! 난이도별 랭킹 시스템으로 다른 학습자들과 경쟁하며 동기부여를 받아보세요.',
  openGraph: {
    title: 'lingbrew - 랭킹',
    description: '영어 학습 실력을 겨뤄보세요! 난이도별 랭킹 시스템으로 경쟁하며 학습하세요.',
  },
};

export default function RankingLayout({
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
        name: '랭킹',
        item: 'https://lingbrew.com/ranking',
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