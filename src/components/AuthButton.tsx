'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAuthActions } from '@/hooks/useAuthActions';
import Image from 'next/image';

interface AuthButtonProps {
  mobile?: boolean;
  onAction?: () => void;
}

export default function AuthButton({ mobile = false, onAction }: AuthButtonProps) {
  const { user, loading } = useAuth();
  const { handleSignIn, handleSignOut } = useAuthActions({ onAction });

  if (loading) {
    return (
      <div className="flex items-center">
        <span className="text-sm gradient-loading font-medium">로딩 중...</span>
      </div>
    );
  }

  if (user) {
    if (mobile) {
      // 모바일에서는 로그아웃 버튼만 표시 (사용자 정보는 햄버거 메뉴에서 별도 표시)
      return (
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
        >
          로그아웃
        </button>
      );
    }

    // 데스크톱 버전
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          {user.user_metadata?.avatar_url && (
            <Image
              src={user.user_metadata.avatar_url}
              alt="프로필"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="hidden md:block text-sm font-medium text-slate-200">
            {user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  // 로그인 버튼
  const buttonClass = mobile
    ? "w-full flex justify-center items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors text-slate-200"
    : "flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg shadow-sm transition-colors text-slate-200";

  return (
    <button
      onClick={handleSignIn}
      className={buttonClass}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="text-sm font-medium">
        Google로 로그인
      </span>
    </button>
  );
}