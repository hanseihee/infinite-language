'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useRankingData } from '@/hooks/useRankingData';
import { useUserDisplay } from '@/hooks/useUserDisplay';



export default function RankingPage() {
  const { user, loading } = useAuth();
  const { rankingData, userRanks, isLoading, error, refetchRankingData } = useRankingData(user);
  const { getUserDisplayName, getRankIcon } = useUserDisplay(user);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('쉬움');

  const difficulties = ['쉬움', '중간', '어려움'];

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
              onClick={refetchRankingData}
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

          {/* 사용자 개인 순위 표시 - 상단에 강조 */}
          {user && Object.keys(userRanks).length > 0 && (
            <div className="max-w-4xl mx-auto mb-8">
              <div className="rounded-2xl shadow-2xl border-2 border-gradient-to-r from-blue-500 to-purple-600 bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-8" style={{backgroundColor: '#191D24'}}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    🏆 내 순위
                  </h2>
                  <p className="text-slate-400 text-sm">전체 사용자 중 내 위치</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {difficulties.map(difficulty => (
                    <div key={difficulty} className="text-center p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                      <h3 className="text-lg font-semibold text-slate-200 mb-3">{difficulty}</h3>
                      {userRanks[difficulty] ? (
                        <>
                          <div className="text-3xl font-bold mb-2 animate-pulse">
                            {userRanks[difficulty] <= 3 ? (
                              <span className="text-yellow-400">{getRankIcon(userRanks[difficulty])}</span>
                            ) : (
                              <span className="text-blue-400">{getRankIcon(userRanks[difficulty])}</span>
                            )}
                          </div>
                          <p className="text-lg font-semibold text-slate-300 mb-1">
                            {rankingData[difficulty]?.find(item => item.user_id === user.id)?.score || 0}점
                          </p>
                          <p className="text-xs text-slate-500">
                            총 {rankingData[difficulty]?.length || 0}명 중
                          </p>
                        </>
                      ) : (
                        <div className="py-4">
                          <p className="text-slate-500 text-lg">기록 없음</p>
                          <p className="text-slate-600 text-xs mt-1">퀴즈를 시작해보세요!</p>
                        </div>
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