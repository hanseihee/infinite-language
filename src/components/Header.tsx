'use client';

import Link from 'next/link';
import Image from 'next/image';
import AuthButton from '@/components/AuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { useHeaderMenu } from '@/hooks/useHeaderMenu';

export default function Header() {
  const { user } = useAuth();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useHeaderMenu();

  return (
    <header className="w-full sticky top-0 z-50" style={{backgroundColor: '#14171D'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고/브랜드 영역과 랭킹 메뉴 (왼쪽) */}
          <div className="flex items-center space-x-6">
            <Link href="/">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent cursor-pointer">
                Infinite Language
              </h1>
            </Link>
            <div className="hidden md:flex">
              <Link 
                href="/ranking" 
                className="text-slate-300 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                랭킹
              </Link>
            </div>
          </div>

          {/* 데스크톱 네비게이션 메뉴 (오른쪽) */}
          <nav className="hidden md:flex items-center">
            <AuthButton />
          </nav>

          {/* 모바일 햄버거 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-blue-400 focus:outline-none focus:text-blue-400 transition-colors"
              aria-label="메뉴 열기"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 드롭다운 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/50 backdrop-blur-sm">
              <Link
                href="/ranking"
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-700/50 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                랭킹
              </Link>
              
              <div className="px-3 py-2 border-t border-slate-600 mt-2 pt-2">
                {user ? (
                  <>
                    <div className="flex items-center space-x-3 mb-3">
                      {user.user_metadata?.avatar_url && (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="프로필"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <div className="text-sm">
                        <p className="text-slate-200 font-medium">
                          {user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-slate-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <AuthButton mobile={true} onAction={closeMobileMenu} />
                  </>
                ) : (
                  <AuthButton mobile={true} onAction={closeMobileMenu} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}