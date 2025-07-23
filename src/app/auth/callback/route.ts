import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // 환경별 리다이렉트 URL 생성
  const getBaseUrl = () => {
    const host = requestUrl.host;
    
    // Vercel 배포 환경
    if (host.includes('vercel.app') || host.includes('infinite-language-one.vercel.app')) {
      return 'https://infinite-language-one.vercel.app';
    }
    
    // 로컬 개발 환경
    return `${requestUrl.protocol}//${host}`;
  };

  const baseUrl = getBaseUrl();
  console.log('Callback - Request host:', requestUrl.host);
  console.log('Callback - Redirect baseUrl:', baseUrl);

  // OAuth 에러 체크
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/?error=oauth_error`);
  }

  // 인증 코드가 있으면 Supabase에서 세션 교환 처리
  if (code) {
    console.log('OAuth code received, exchanging for session');
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Session exchange error:', exchangeError);
        return NextResponse.redirect(`${baseUrl}/?error=session_exchange_failed`);
      }
      
      console.log('Session exchange successful:', data.session ? 'session created' : 'no session');
      // 성공적으로 세션 생성 후 홈으로 리다이렉트
      return NextResponse.redirect(`${baseUrl}/?success=login`);
    } catch (err) {
      console.error('Unexpected error during session exchange:', err);
      return NextResponse.redirect(`${baseUrl}/?error=unexpected_error`);
    }
  }

  // 코드가 없으면 홈으로 리다이렉트
  console.log('No code received, redirecting to home');
  return NextResponse.redirect(baseUrl);
}