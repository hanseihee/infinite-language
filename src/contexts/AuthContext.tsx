'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 가져오기
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session ? 'logged in' : 'not logged in');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session ? 'logged in' : 'not logged in');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // 로그인 성공 시 강제 리렌더링 보장
      if (event === 'SIGNED_IN' && session) {
        console.log('Login successful, forcing re-render');
        // 상태 업데이트 후 약간의 지연을 두고 강제 업데이트
        setTimeout(() => {
          setUser(session.user);
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // 환경별 리다이렉트 URL 설정 - 콜백 라우트 사용
    const getRedirectUrl = () => {
      const currentOrigin = window.location.origin;
      console.log('=== DEBUG: OAuth Redirect Setup ===');
      console.log('Current origin:', currentOrigin);
      console.log('Is Vercel:', currentOrigin.includes('vercel.app'));
      console.log('Is specific domain:', currentOrigin.includes('infinite-language-one.vercel.app'));
      
      // 배포 환경 감지
      if (currentOrigin.includes('vercel.app') || currentOrigin.includes('infinite-language-one.vercel.app')) {
        console.log('Using production redirect URL');
        return 'https://infinite-language-one.vercel.app/auth/callback';
      }
      
      // 로컬 개발 환경
      console.log('Using local redirect URL');
      return `${currentOrigin}/auth/callback`;
    };

    const redirectTo = getRedirectUrl();
    console.log('Current origin:', window.location.origin);
    console.log('OAuth redirectTo:', redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo
      }
    });
    
    console.log('OAuth response data:', data);
    console.log('OAuth URL would redirect to:', data?.url);
    
    if (error) {
      console.error('Google 로그인 오류:', error);
      if (error.message.includes('provider is not enabled')) {
        alert('Google 로그인이 아직 활성화되지 않았습니다. 관리자에게 문의해주세요.');
      } else {
        alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('로그아웃 오류:', error.message);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다');
  }
  return context;
}