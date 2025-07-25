'use client';

import { useState, useEffect, useCallback } from 'react';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [customEnvironment, setCustomEnvironment] = useState<string>('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const { user, signInWithGoogle } = useAuth();

  const difficulties = ['쉬움', '중간', '어려움'];
  const environments = ['일상', '회사', '쇼핑', '여행', '레스토랑', '병원', '학교', '공항'];

  // 최종 환경 선택: 사용자 입력이 있으면 우선, 없으면 드롭다운 선택
  const getFinalEnvironment = () => {
    if (customEnvironment.trim()) {
      return customEnvironment.trim();
    }
    if (selectedEnvironment) {
      return selectedEnvironment;
    }
    if (typeof window !== 'undefined') {
      const savedEnvironment = localStorage.getItem('lastEnvironment');
      if (savedEnvironment && environments.includes(savedEnvironment)) {
        return savedEnvironment;
      }
    }
    return '';
  };

  // 사용자의 일일 퀴즈 시도 횟수 확인
  const checkQuizAttempts = useCallback(async () => {
    if (!user) return null;

    try {
      console.log('Checking quiz attempts for user:', user.id);
      const response = await fetch(`/api/quiz-attempts?user_id=${user.id}`);
      
      if (!response.ok) {
        console.error('API response not ok:', response.status);
        // 에러가 있어도 기본값 설정
        setRemainingAttempts(50);
        return;
      }
      
      const data = await response.json();
      console.log('Quiz attempts response:', data);
      
      if (data.success && data.data && typeof data.data.remaining_attempts === 'number') {
        setRemainingAttempts(data.data.remaining_attempts);
        console.log('Remaining attempts set to:', data.data.remaining_attempts);
      } else {
        console.error('Invalid response format:', data);
        // 응답 형식이 잘못되어도 기본값 설정
        setRemainingAttempts(50);
      }
    } catch (error) {
      console.error('Error checking quiz attempts:', error);
      // 네트워크 에러 시에도 기본값 설정
      setRemainingAttempts(50);
    }
    return null;
  }, [user]);

  // 사용자가 로그인하면 시도 횟수 확인
  useEffect(() => {
    if (user) {
      checkQuizAttempts();
    } else {
      // 로그아웃 상태에서는 remainingAttempts 초기화
      setRemainingAttempts(null);
    }
  }, [user, checkQuizAttempts]);

  // URL 파라미터에서 로그인 결과 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginResult = urlParams.get('login');
    
    if (loginResult === 'success') {
      // 로그인 성공 시 URL 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const startQuiz = () => {
    if (!selectedDifficulty) {
      alert('난이도를 선택해주세요.');
      return;
    }

    const finalEnvironment = getFinalEnvironment();
    if (!finalEnvironment) {
      alert('환경을 선택하거나 입력해주세요.');
      return;
    }

    // 선택한 환경을 localStorage에 저장
    if (!customEnvironment.trim() && selectedEnvironment) {
      localStorage.setItem('lastEnvironment', selectedEnvironment);
    }

    // 퀴즈 페이지로 이동
    window.location.href = `/quiz?difficulty=${selectedDifficulty}&environment=${encodeURIComponent(finalEnvironment)}`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen w-full overflow-x-hidden" style={{backgroundColor: '#14171D'}}>
        <div className="max-w-md mx-auto px-4 pt-16 sm:pt-24 pb-8">
          <h1 className="gradient-title text-3xl sm:text-5xl lg:text-7xl font-bold text-center mb-8 sm:mb-12 py-4 leading-tight tracking-tight">
            lingbrew
            <span className="sr-only"> - AI 언어 학습 플랫폼</span>
          </h1>
          
          {/* 디버깅용 상태 표시 */}
          {user && (
            <div className="mb-4 p-3 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-300">
              <p>로그인 상태: ✅ | remainingAttempts: {remainingAttempts === null ? 'null' : remainingAttempts}</p>
            </div>
          )}

          {user && remainingAttempts !== null && remainingAttempts > 0 && (
            <div className="mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-200 text-center">
                오늘 남은 퀴즈 횟수: <span className="font-bold text-white">{remainingAttempts}회</span>
              </p>
            </div>
          )}

          {user && remainingAttempts === 0 && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-sm text-red-200 text-center">
                오늘의 퀴즈 횟수를 모두 사용했습니다. 내일 다시 도전해주세요!
              </p>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-base sm:text-lg font-semibold mb-3 text-white">
                난이도 선택
              </label>
              <Dropdown 
                options={difficulties} 
                placeholder="난이도를 선택하세요"
                onSelect={setSelectedDifficulty}
              />
            </div>

            <div>
              <label className="block text-base sm:text-lg font-semibold mb-3 text-white">
                환경 선택
              </label>
              <Dropdown 
                options={environments} 
                placeholder="환경을 선택하세요"
                onSelect={(environment) => {
                  setSelectedEnvironment(environment);
                  // 드롭다운에서 선택할 때 사용자 입력 초기화
                  setCustomEnvironment('');
                }}
                selectedOption={selectedEnvironment || undefined}
              />
              
              {/* 사용자 직접 입력 필드 */}
              <div className="mt-3">
                <label className="block text-sm sm:text-base font-medium text-gray-400 mb-2">
                  또는 직접 입력하세요
                </label>
                <input
                  type="text"
                  value={customEnvironment}
                  onChange={(e) => {
                    setCustomEnvironment(e.target.value);
                    // 사용자가 직접 입력할 때 드롭다운 선택 해제
                    if (e.target.value.trim()) {
                      setSelectedEnvironment(null);
                    }
                  }}
                  placeholder="예: 카페, 도서관, 호텔 등"
                  className="w-full px-3 py-2 text-sm sm:text-base text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  style={{backgroundColor: '#252B36'}}
                />
                {customEnvironment.trim() && (
                  <span className="mt-2 inline-block text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded">
                    직접입력: {customEnvironment}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={user ? startQuiz : signInWithGoogle}
              disabled={user && remainingAttempts === 0}
              className={`w-full py-3 sm:py-4 px-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 
                ${user && remainingAttempts === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              {!user ? '로그인' : (remainingAttempts === 0 ? '오늘 횟수 초과' : '퀴즈 시작')}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}