'use client';

import AuthButton from '@/components/AuthButton';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50" style={{backgroundColor: '#14171D'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고/브랜드 영역 */}
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Infinite Language
            </h1>
          </div>

          {/* 우측 영역: 로그인 버튼 */}
          <div className="flex items-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}