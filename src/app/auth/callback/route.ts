import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('인증 코드 교환 오류:', error);
      return NextResponse.redirect(`${requestUrl.origin}/?error=auth_failed`);
    }
  }

  // 성공적으로 로그인된 경우 홈으로 리다이렉트
  return NextResponse.redirect(requestUrl.origin);
}