import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    // 오늘 날짜를 한국 시간으로 계산
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
    const today = koreaTime.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // quiz_attempts 테이블이 있는지 확인하고 사용, 없으면 user_progress 사용
    let data, error;
    
    // 먼저 quiz_attempts 테이블 사용 시도
    const { data: quizData, error: quizError } = await supabase
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
      
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('id, created_at')
        .eq('user_id', user_id)
        .gte('created_at', `${today}T00:00:00Z`)
        .lt('created_at', `${today}T23:59:59Z`);
      
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
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const today = koreaTime.toISOString().split('T')[0];

    // quiz_attempts 테이블 사용 시도
    const { data, error } = await supabase
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
      console.error('Error saving quiz attempt:', error);
      return NextResponse.json(
        { error: 'Failed to save quiz attempt' },
        { status: 500 }
      );
    }

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