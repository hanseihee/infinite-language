import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { user_id, difficulty, correct_answers, total_questions } = await request.json();

    if (!user_id || !difficulty || correct_answers === undefined || !total_questions) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 유효한 난이도인지 확인
    const validDifficulties = ['쉬움', '중간', '어려움'];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: '유효하지 않은 난이도입니다.' },
        { status: 400 }
      );
    }

    // 기존 진척도 조회 (테이블이 없을 경우 임시 저장소 사용)
    let existingProgress = null;
    let selectError = null;
    
    try {
      const result = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user_id)
        .eq('difficulty', difficulty)
        .single();
      
      existingProgress = result.data;
      selectError = result.error;
    } catch (err) {
      console.log('user_progress 테이블이 존재하지 않습니다. 임시 저장소를 사용합니다.', err);
      // 테이블이 없을 경우 로컬 스토리지나 다른 방법으로 처리할 수 있습니다.
      return NextResponse.json({
        success: true,
        message: '테이블이 준비되지 않았습니다. 관리자에게 문의하세요.',
        data: { user_id, difficulty, score: correct_answers },
        previous_score: 0,
        new_score: correct_answers,
        total_score: correct_answers
      });
    }

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error fetching existing progress:', selectError);
      return NextResponse.json(
        { error: '진척도 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    const newScore = correct_answers;
    
    if (existingProgress) {
      // 기존 기록이 있으면 점수 누적
      const updatedScore = existingProgress.score + newScore;
      
      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          score: updatedScore,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user_id)
        .eq('difficulty', difficulty)
        .select();

      if (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
          { error: '진척도 업데이트 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: '진척도가 업데이트되었습니다.',
        data: data[0],
        previous_score: existingProgress.score,
        new_score: newScore,
        total_score: updatedScore
      });
    } else {
      // 새로운 기록 생성
      const { data, error } = await supabase
        .from('user_progress')
        .insert([{
          user_id,
          difficulty,
          score: newScore,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error creating progress:', error);
        return NextResponse.json(
          { error: '진척도 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: '새로운 진척도가 생성되었습니다.',
        data: data[0],
        previous_score: 0,
        new_score: newScore,
        total_score: newScore
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자의 모든 난이도별 진척도 조회
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user_id)
      .order('difficulty');

    if (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json(
        { error: '진척도 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: data || []
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}