'use client';

import { useState, useEffect, useCallback } from 'react';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const { user } = useAuth();

  const difficulties = ['쉬움', '중간', '어려움'];
  const environments = ['일상', '회사', '쇼핑', '여행', '레스토랑', '병원', '학교', '공항'];

  const getFinalEnvironment = () => {
    if (typeof window !== 'undefined') {
      const savedEnvironment = localStorage.getItem('lastEnvironment');
      if (savedEnvironment && environments.includes(savedEnvironment)) {
        return savedEnvironment;
      }
    }
    return environments[0];
  };

  // 사용자의 일일 퀴즈 시도 횟수 확인
  const checkQuizAttempts = useCallback(async () => {
    if (!user) return null;

    try {
      const response = await fetch(`/api/quiz-attempts?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success && typeof data.remaining_attempts === 'number') {
        setRemainingAttempts(data.remaining_attempts);
      }
    } catch (error) {
      console.error('Error checking quiz attempts:', error);
    }
    return null;
  }, [user]);

  // 사용자가 로그인하면 시도 횟수 확인
  useEffect(() => {
    if (user) {
      checkQuizAttempts();
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

    if (!selectedEnvironment) {
      alert('환경을 선택해주세요.');
      return;
    }

    // 선택한 환경을 localStorage에 저장
    localStorage.setItem('lastEnvironment', selectedEnvironment);

    // 퀴즈 페이지로 이동
    window.location.href = `/quiz?difficulty=${selectedDifficulty}&environment=${selectedEnvironment}`;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen w-full overflow-x-hidden" style={{backgroundColor: '#14171D'}}>
        <div className="max-w-md mx-auto px-4 pt-16 sm:pt-24 pb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 gradient-title">
            Infinite Language
            <span className="sr-only"> - 무한 영어 학습 플랫폼</span>
          </h1>
          
          {remainingAttempts !== null && remainingAttempts > 0 && (
            <div className="mb-6 p-4 bg-blue-900/50 border border-blue-700 rounded-lg">
              <p className="text-sm text-blue-200 text-center">
                오늘 남은 퀴즈 횟수: <span className="font-bold text-white">{remainingAttempts}회</span>
              </p>
            </div>
          )}

          {remainingAttempts === 0 && (
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
                onSelect={setSelectedEnvironment}
                defaultValue={getFinalEnvironment()}
              />
            </div>
            
            <button
              onClick={startQuiz}
              disabled={!user || remainingAttempts === 0}
              className={`w-full py-3 sm:py-4 px-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 
                ${!user || remainingAttempts === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
            >
              {!user ? '로그인이 필요합니다' : (remainingAttempts === 0 ? '오늘 횟수 초과' : '퀴즈 시작')}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}