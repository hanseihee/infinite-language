import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role key를 사용하여 RLS 우회
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { user_id, difficulty, correct_answers, total_questions } = await request.json();

    console.log('📝 Progress API called with:', {
      user_id,
      difficulty,
      correct_answers,
      total_questions
    });

    if (!user_id || !difficulty || correct_answers === undefined || !total_questions) {
      console.error('❌ Missing required parameters:', {
        user_id: !!user_id,
        difficulty: !!difficulty,
        correct_answers: correct_answers !== undefined,
        total_questions: !!total_questions
      });
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

    // 기존 진척도 조회
    const result = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user_id)
      .eq('difficulty', difficulty)
      .single();
    
    const existingProgress = result.data;
    const selectError = result.error;
    
    // 테이블이 존재하지 않는 경우 처리
    if (selectError && (selectError.message?.includes('relation') || selectError.code === '42P01')) {
      console.log('⚠️ user_progress 테이블이 존재하지 않습니다:', selectError.message);
      console.log('💡 Supabase Dashboard에서 테이블을 생성해주세요. create_user_progress_table.sql 파일을 참조하세요.');
      return NextResponse.json({
        success: true,
        message: '테이블이 준비되지 않았습니다. 퀴즈는 완료되었지만 점수가 저장되지 않았습니다.',
        data: { user_id, difficulty, score: correct_answers },
        previous_score: 0,
        new_score: correct_answers,
        total_score: correct_answers,
        table_missing: true
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
      
      console.log('📈 Updating existing progress:', {
        previous_score: existingProgress.score,
        new_score: newScore,
        total_score: updatedScore
      });
      
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
        console.error('❌ Error updating progress:', error);
        return NextResponse.json(
          { error: '진척도 업데이트 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      console.log('✅ Progress updated successfully:', data[0]);
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
      console.log('🆕 Creating new progress record for user:', user_id);
      
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
        console.error('❌ Error creating progress:', error);
        return NextResponse.json(
          { error: '진척도 생성 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      console.log('✅ New progress created successfully:', data[0]);
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
    const result = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user_id)
      .order('difficulty');

    const data = result.data;
    const error = result.error;

    // 테이블이 존재하지 않는 경우 처리
    if (error && (error.message?.includes('relation') || error.code === '42P01')) {
      console.log('user_progress 테이블이 존재하지 않습니다:', error);
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: '아직 진척도 데이터가 없습니다.'
      });
    }

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