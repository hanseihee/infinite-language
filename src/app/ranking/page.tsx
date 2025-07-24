'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

interface UserProgress {
  id: string;
  user_id: string;
  difficulty: string;
  score: number;
  rank: number;
  users?: {
    id: string;
    email: string;
    user_metadata?: {
      name?: string;
      full_name?: string;
      avatar_url?: string;
    };
  };
}

interface RankingData {
  [difficulty: string]: UserProgress[];
}

export default function RankingPage() {
  const { user, loading } = useAuth();
  const [rankingData, setRankingData] = useState<RankingData>({});
  const [userRanks, setUserRanks] = useState<{[key: string]: number}>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('쉬움');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const difficulties = ['쉬움', '중간', '어려움'];

  useEffect(() => {
    fetchRankingData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRankingData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = user 
        ? `/api/ranking?user_id=${user.id}`
        : '/api/ranking';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setRankingData(data.data);
        if (data.user_ranks) {
          setUserRanks(data.user_ranks);
        }
      } else {
        setError(data.error || '랭킹 데이터를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching ranking:', error);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDisplayName = (userProgress: UserProgress) => {
    const userData = userProgress.users;
    if (!userData) return '익명 사용자';
    
    const metadata = userData.user_metadata;
    if (metadata?.name) return metadata.name;
    if (metadata?.full_name) return metadata.full_name;
    if (userData.email) {
      return userData.email.split('@')[0];
    }
    return '익명 사용자';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}위`;
    }
  };

  if (loading || isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#14171D'}}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg text-slate-200">랭킹 데이터를 불러오는 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#14171D'}}>
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchRankingData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              다시 시도
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen w-full" style={{backgroundColor: '#14171D'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          
          <h1 className="gradient-title text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 py-4 leading-tight font-['Inter',_'Pretendard',_sans-serif] tracking-tight">
            랭킹
          </h1>

          {/* 사용자 개인 순위 표시 */}
          {user && Object.keys(userRanks).length > 0 && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="rounded-2xl shadow-2xl p-6" style={{backgroundColor: '#191D24'}}>
                <h2 className="text-xl font-bold mb-4 text-slate-200 text-center">내 순위</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {difficulties.map(difficulty => (
                    <div key={difficulty} className="text-center p-4 rounded-lg" style={{backgroundColor: '#252B36'}}>
                      <h3 className="text-lg font-semibold text-slate-200 mb-2">{difficulty}</h3>
                      {userRanks[difficulty] ? (
                        <>
                          <div className="text-2xl font-bold text-blue-400 mb-1">
                            {getRankIcon(userRanks[difficulty])}
                          </div>
                          <p className="text-sm text-slate-400">
                            {rankingData[difficulty]?.find(item => item.user_id === user.id)?.score || 0}점
                          </p>
                        </>
                      ) : (
                        <p className="text-slate-500">기록 없음</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 난이도 선택 탭 */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex justify-center space-x-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedDifficulty === difficulty
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* 랭킹 리스트 */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl shadow-2xl overflow-hidden" style={{backgroundColor: '#191D24'}}>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-200 text-center">
                  {selectedDifficulty} 난이도 랭킹
                </h2>
                
                {rankingData[selectedDifficulty] && rankingData[selectedDifficulty].length > 0 ? (
                  <div className="space-y-3">
                    {rankingData[selectedDifficulty].slice(0, 50).map((userProgress) => (
                      <div 
                        key={userProgress.id}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                          user && userProgress.user_id === user.id 
                            ? 'bg-blue-600/20 border border-blue-500/50' 
                            : 'bg-slate-700/50 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-xl font-bold text-slate-200 min-w-[60px]">
                            {getRankIcon(userProgress.rank)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">
                              {getUserDisplayName(userProgress)}
                              {user && userProgress.user_id === user.id && (
                                <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                  나
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-400">
                            {userProgress.score}점
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">
                      {selectedDifficulty} 난이도에 아직 기록이 없습니다.
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                      첫 번째 도전자가 되어보세요!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}