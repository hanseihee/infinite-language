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
  return children;
}