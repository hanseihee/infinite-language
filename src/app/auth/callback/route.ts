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

  // Implicit flow에서는 클라이언트에서 세션 처리
  // 단순히 홈으로 리다이렉트하고 클라이언트가 URL에서 토큰 파싱
  if (code) {
    console.log('OAuth code received, redirecting to home for client-side processing');
    return NextResponse.redirect(`${baseUrl}/?code=${code}`);
  }

  // 성공적으로 로그인된 경우 홈으로 리다이렉트
  return NextResponse.redirect(baseUrl);
}