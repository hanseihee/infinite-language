'use client';

import { useState, useEffect } from 'react';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [customEnvironment, setCustomEnvironment] = useState<string>('');

  const difficultyOptions = ['쉬움', '중간', '어려움'];
  const environmentOptions = ['일상', '회사', '쇼핑', '여행', '레스토랑', '병원', '학교', '공항'];

  // 최종 환경 선택: 사용자 입력이 있으면 우선, 없으면 드롭다운 선택
  const getFinalEnvironment = () => {
    return customEnvironment.trim() || selectedEnvironment;
  };

  const finalEnvironment = getFinalEnvironment();

  // URL 파라미터에서 로그인 결과 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'login') {
      console.log('Login success detected, cleaning up URL');
      // URL에서 success 파라미터 제거
      window.history.replaceState({}, '', '/');
      // 로그인 성공 메시지 표시 (선택사항)
      // alert('로그인이 성공적으로 완료되었습니다!');
    }

    if (error) {
      console.error('Auth error:', error);
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      
      switch (error) {
        case 'oauth_error':
          errorMessage = 'OAuth 인증 중 오류가 발생했습니다.';
          break;
        case 'session_exchange_failed':
          errorMessage = '세션 생성 중 오류가 발생했습니다.';
          break;
        case 'unexpected_error':
          errorMessage = '예상치 못한 오류가 발생했습니다.';
          break;
      }
      
      alert(errorMessage);
      // URL에서 error 파라미터 제거
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen" style={{backgroundColor: '#14171D'}}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          
          <h1 className="gradient-title text-4xl sm:text-5xl lg:text-7xl font-bold text-center mb-16 py-6 leading-tight font-['Inter',_'Pretendard',_sans-serif] tracking-tight">
            Infinite Language
          </h1>
        
          {/* 드롭다운 메뉴 섹션 */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="rounded-2xl shadow-2xl p-6 sm:p-8" style={{backgroundColor: '#191D24'}}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-slate-200 dark:text-slate-300">
                    난이도 선택
                  </label>
                  <Dropdown
                    label="난이도를 선택하세요"
                    options={difficultyOptions}
                    onSelect={setSelectedDifficulty}
                    selectedOption={selectedDifficulty}
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-slate-200 dark:text-slate-300">
                    환경 선택
                  </label>
                  <Dropdown
                    label="환경을 선택하세요"
                    options={environmentOptions}
                    onSelect={(environment) => {
                      setSelectedEnvironment(environment);
                      setCustomEnvironment('');
                    }}
                    selectedOption={selectedEnvironment}
                  />
                  
                  {/* 사용자 직접 입력 필드 */}
                  <div className="mt-4">
                    <label className="block text-base font-medium text-slate-400 dark:text-slate-500 mb-2">
                      또는 직접 입력하세요
                    </label>
                    <input
                      type="text"
                      value={customEnvironment}
                      onChange={(e) => {
                        setCustomEnvironment(e.target.value);
                        if (e.target.value.trim()) {
                          setSelectedEnvironment('');
                        }
                      }}
                      placeholder="예: 카페, 도서관, 헬스장..."
                      className="w-full px-4 py-3 text-base rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      style={{backgroundColor: '#252B36'}}
                    />
                    {customEnvironment.trim() && selectedEnvironment && (
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                        ℹ️ 직접 입력한 &quot;{customEnvironment}&quot;이(가) 사용됩니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 선택된 옵션 표시 */}
              {(selectedDifficulty || finalEnvironment) && (
                <div className="mt-8 p-5 rounded-xl" style={{backgroundColor: '#252B36'}}>
                  <h3 className="text-lg font-semibold mb-3 text-slate-200 dark:text-slate-300">
                    선택된 설정
                  </h3>
                  <div className="space-y-2 text-slate-300 dark:text-slate-400">
                    {selectedDifficulty && <p className="text-base">난이도: <span className="font-medium text-white">{selectedDifficulty}</span></p>}
                    {finalEnvironment && (
                      <p className="text-base">
                        환경: <span className="font-medium text-white">{finalEnvironment}</span>
                        {customEnvironment.trim() && (
                          <span className="ml-2 text-xs bg-blue-600/80 dark:bg-blue-500/80 text-blue-100 dark:text-blue-200 px-2 py-1 rounded-full">
                            직접입력
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 액션 카드 섹션 */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 sm:p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow" style={{backgroundColor: '#191D24'}}>
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-200 dark:text-slate-300">시작하기</h2>
                  <p className="text-base text-slate-400 dark:text-slate-500 mb-6">
                    언어 학습 여정을 시작해보세요
                  </p>
                  <button
                    onClick={() => {
                      if (!user) {
                        alert('퀴즈를 시작하려면 먼저 로그인해주세요!');
                        return;
                      }
                      if (!selectedDifficulty || !finalEnvironment) {
                        alert('난이도와 환경을 모두 선택해주세요!');
                        return;
                      }
                      window.location.href = `/quiz?difficulty=${selectedDifficulty}&environment=${encodeURIComponent(finalEnvironment)}`;
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:bg-slate-600 text-base shadow-lg hover:shadow-xl"
                    disabled={loading || !selectedDifficulty || !finalEnvironment}
                  >
                    퀴즈 시작하기
                  </button>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow" style={{backgroundColor: '#191D24'}}>
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-200 dark:text-slate-300">학습 진도</h2>
                  <p className="text-base text-slate-400 dark:text-slate-500 mb-6">
                    학습 진도를 확인하고 관리하세요
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 text-base shadow-lg hover:shadow-xl">
                    진도 확인하기
                  </button>
                </div>
              </div>
            </div>
            </div>
        </div>
      </main>
    </>
  )
}
