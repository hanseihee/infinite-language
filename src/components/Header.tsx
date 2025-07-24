'use client';

import Link from 'next/link';
import AuthButton from '@/components/AuthButton';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50" style={{backgroundColor: '#14171D'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고/브랜드 영역 */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer">
                Infinite Language
              </h1>
            </Link>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/ranking" 
              className="text-slate-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
            >
              랭킹
            </Link>
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}