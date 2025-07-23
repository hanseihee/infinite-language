import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');

  // 현재 요청의 호스트 정보를 사용하여 올바른 리다이렉트 URL 생성
  const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

  // OAuth 에러 체크
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/?error=oauth_error`);
  }

  if (code) {
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error('인증 코드 교환 오류:', exchangeError);
      return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
    }

    if (data?.session) {
      console.log('로그인 성공:', data.user?.email);
      return NextResponse.redirect(`${baseUrl}/?success=login`);
    }
  }

  // 성공적으로 로그인된 경우 홈으로 리다이렉트
  return NextResponse.redirect(baseUrl);
}