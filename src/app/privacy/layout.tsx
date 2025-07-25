import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infinite Language - 개인정보처리방침',
  description: 'Infinite Language의 개인정보처리방침입니다. 이메일 수집 및 개인정보 보호에 대한 정책을 확인하세요.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}