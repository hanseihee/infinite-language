import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface UserProgress {
  id: string;
  user_id: string;
  difficulty: string;
  score: number;
  rank?: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const user_id = searchParams.get('user_id');

    if (difficulty) {
      // 특정 난이도의 랭킹 조회
      const validDifficulties = ['쉬움', '중간', '어려움'];
      if (!validDifficulties.includes(difficulty)) {
        return NextResponse.json(
          { error: '유효하지 않은 난이도입니다.' },
          { status: 400 }
        );
      }

      const result = await supabase
        .from('user_progress')
        .select('*')
        .eq('difficulty', difficulty)
        .order('score', { ascending: false })
        .limit(100);
      
      const data = result.data || [];
      const error = result.error;
      
      // 테이블이 존재하지 않는 경우 처리
      if (error && (error.message?.includes('relation') || error.code === 'PGRST116')) {
        console.log('user_progress 테이블이 존재하지 않습니다:', error);
        return NextResponse.json({
          success: true,
          data: [],
          user_rank: null,
          difficulty,
          message: '아직 랭킹 데이터가 없습니다. 테이블이 준비되지 않았습니다.'
        });
      }

      if (error) {
        console.error('Error fetching ranking:', error);
        return NextResponse.json(
          { error: '랭킹 조회 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      // 순위 계산 및 사용자 순위 찾기
      const rankingWithPosition = data.map((item, index) => ({
        ...item,
        rank: index + 1
      }));

      let userRank = null;
      if (user_id) {
        const userEntry = rankingWithPosition.find(item => item.user_id === user_id);
        userRank = userEntry ? userEntry.rank : null;
      }

      return NextResponse.json({ 
        success: true, 
        data: rankingWithPosition,
        user_rank: userRank,
        difficulty
      });
    } else {
      // 모든 난이도의 랭킹 조회
      const result = await supabase
        .from('user_progress')
        .select('*')
        .order('score', { ascending: false });
      
      const data = result.data || [];
      const error = result.error;
      
      // 테이블이 존재하지 않는 경우 처리
      if (error && (error.message?.includes('relation') || error.code === 'PGRST116')) {
        console.log('user_progress 테이블이 존재하지 않습니다:', error);
        return NextResponse.json({
          success: true,
          data: {},
          user_ranks: {},
          message: '아직 랭킹 데이터가 없습니다. 테이블이 준비되지 않았습니다.'
        });
      }

      if (error) {
        console.error('Error fetching all rankings:', error);
        return NextResponse.json(
          { error: '랭킹 조회 중 오류가 발생했습니다.' },
          { status: 500 }
        );
      }

      // 난이도별로 그룹화하고 순위 계산
      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.difficulty]) {
          acc[item.difficulty] = [];
        }
        acc[item.difficulty].push(item);
        return acc;
      }, {} as Record<string, UserProgress[]>);

      // 각 난이도별로 순위 계산
      const rankedData = Object.keys(groupedData).reduce((acc, difficulty) => {
        acc[difficulty] = groupedData[difficulty]
          .sort((a: UserProgress, b: UserProgress) => b.score - a.score)
          .map((item: UserProgress, index: number) => ({
            ...item,
            rank: index + 1
          }));
        return acc;
      }, {} as Record<string, UserProgress[]>);

      // 사용자 순위 계산 (모든 난이도)
      const userRanks: Record<string, number | null> = {};
      if (user_id) {
        Object.keys(rankedData).forEach(difficulty => {
          const userEntry = rankedData[difficulty].find(item => item.user_id === user_id);
          userRanks[difficulty] = userEntry ? userEntry.rank : null;
        });
      }

      return NextResponse.json({ 
        success: true, 
        data: rankedData,
        user_ranks: userRanks
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