import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infinite Language - 이용약관',
  description: 'Infinite Language 서비스 이용약관을 확인하세요. 서비스 이용에 관한 권리와 의무사항을 안내합니다.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}