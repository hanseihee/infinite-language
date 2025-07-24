import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 서버 사이드에서는 service role key 사용 (RLS 무시)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json(
      { error: 'user_id is required' },
      { status: 400 }
    );
  }

  try {
    // 한국 시간 기준으로 오늘 날짜 계산 (자정 기준)
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    const today = koreaTime.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // 한국 시간 기준 오늘 0시부터 내일 0시까지의 UTC 시간 범위
    const koreaYear = koreaTime.getFullYear();
    const koreaMonth = koreaTime.getMonth();
    const koreaDate = koreaTime.getDate();
    
    // 한국 시간 오늘 0시 = UTC 어제 15시
    const todayStartKorea = new Date(koreaYear, koreaMonth, koreaDate, 0, 0, 0, 0);
    const todayStartUTC = new Date(todayStartKorea.getTime() - (9 * 60 * 60 * 1000));
    
    // 한국 시간 내일 0시 = UTC 오늘 15시  
    const tomorrowStartKorea = new Date(koreaYear, koreaMonth, koreaDate + 1, 0, 0, 0, 0);
    const tomorrowStartUTC = new Date(tomorrowStartKorea.getTime() - (9 * 60 * 60 * 1000));
    
    const todayStart = todayStartUTC.toISOString();
    const todayEnd = tomorrowStartUTC.toISOString();
    
    // quiz_attempts 테이블이 있는지 확인하고 사용, 없으면 user_progress 사용
    let data, error;
    
    // 먼저 quiz_attempts 테이블 사용 시도
    const { data: quizData, error: quizError } = await supabaseAdmin
      .from('quiz_attempts')
      .select('id')
      .eq('user_id', user_id)
      .eq('attempt_date', today);
    
    if (!quizError) {
      // quiz_attempts 테이블이 존재하고 정상 작동
      data = quizData;
      error = null;
    } else {
      // quiz_attempts 테이블이 없거나 오류 발생시 user_progress 사용
      console.log('quiz_attempts 테이블 사용 불가, user_progress 사용:', quizError.message);
      
      const { data: progressData, error: progressError } = await supabaseAdmin
        .from('user_progress')
        .select('id, created_at')
        .eq('user_id', user_id)
        .gte('created_at', todayStart)
        .lt('created_at', todayEnd);
      
      data = progressData;
      error = progressError;
    }

    if (error) {
      console.error('Error fetching quiz attempts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch quiz attempts' },
        { status: 500 }
      );
    }

    const attemptCount = data?.length || 0;
    const maxAttempts = 10;
    const remainingAttempts = Math.max(0, maxAttempts - attemptCount);

    return NextResponse.json({
      success: true,
      data: {
        attempts_today: attemptCount,
        max_attempts: maxAttempts,
        remaining_attempts: remainingAttempts,
        can_play: remainingAttempts > 0
      }
    });

  } catch (error) {
    console.error('Error in quiz-attempts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 퀴즈 시도 기록 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, difficulty, environment, score, total_questions } = body;

    if (!user_id || !difficulty || !environment || score === undefined || !total_questions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 한국 시간 기준 날짜
    const now = new Date();
    const koreaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
    const today = koreaTime.toISOString().split('T')[0];

    // quiz_attempts 테이블 사용 시도
    console.log('💾 Attempting to save quiz attempt:', {
      user_id,
      difficulty,
      environment,
      score,
      total_questions,
      attempt_date: today
    });

    const { data, error } = await supabaseAdmin
      .from('quiz_attempts')
      .insert([{
        user_id,
        difficulty,
        environment,
        score,
        total_questions,
        attempt_date: today
      }])
      .select();

    if (error) {
      console.error('❌ Error saving quiz attempt:', error);
      return NextResponse.json(
        { 
          error: 'Failed to save quiz attempt',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    console.log('✅ Quiz attempt saved successfully:', data);

    return NextResponse.json({
      success: true,
      data: data[0]
    });

  } catch (error) {
    console.error('Error in POST quiz-attempts API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}