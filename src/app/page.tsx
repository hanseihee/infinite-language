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
      <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 lg:p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm px-4">
        
        <h1 className="gradient-title text-3xl sm:text-4xl lg:text-6xl font-bold text-center mb-12 py-4 leading-tight font-['Inter',_'Pretendard',_sans-serif] tracking-tight">
          Infinite Language
        </h1>
        
        {/* 드롭다운 메뉴 섹션 */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                난이도 선택
              </label>
              <Dropdown
                label="난이도를 선택하세요"
                options={difficultyOptions}
                onSelect={setSelectedDifficulty}
                selectedOption={selectedDifficulty}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                환경 선택
              </label>
              <Dropdown
                label="환경을 선택하세요"
                options={environmentOptions}
                onSelect={(environment) => {
                  setSelectedEnvironment(environment);
                  // 드롭다운에서 선택할 때 사용자 입력 초기화
                  setCustomEnvironment('');
                }}
                selectedOption={selectedEnvironment}
              />
              
              {/* 사용자 직접 입력 필드 */}
              <div className="mt-3">
                <label className="block text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 mb-2">
                  또는 직접 입력하세요
                </label>
                <input
                  type="text"
                  value={customEnvironment}
                  onChange={(e) => {
                    setCustomEnvironment(e.target.value);
                    // 사용자가 직접 입력할 때 드롭다운 선택 해제
                    if (e.target.value.trim()) {
                      setSelectedEnvironment('');
                    }
                  }}
                  placeholder="예: 카페, 도서관, 헬스장..."
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
                />
                {customEnvironment.trim() && selectedEnvironment && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    ℹ️ 직접 입력한 &quot;{customEnvironment}&quot;이(가) 사용됩니다.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* 선택된 옵션 표시 */}
          {(selectedDifficulty || finalEnvironment) && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
                선택된 설정
              </h3>
              <div className="space-y-1 text-blue-700 dark:text-blue-300">
                {selectedDifficulty && <p>난이도: {selectedDifficulty}</p>}
                {finalEnvironment && (
                  <p>
                    환경: {finalEnvironment}
                    {customEnvironment.trim() && (
                      <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        직접입력
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">시작하기</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
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
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors disabled:bg-gray-400 text-sm sm:text-base"
              disabled={loading || !selectedDifficulty || !finalEnvironment}
            >
              퀴즈 시작하기
            </button>
          </div>
          <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">학습 진도</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              학습 진도를 확인하고 관리하세요
            </p>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
