'use client';

import { useState } from 'react';
import Dropdown from '@/components/Dropdown';

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');

  const difficultyOptions = ['쉬움', '중간', '어려움'];
  const environmentOptions = ['일상', '회사', '쇼핑', '여행', '레스토랑', '병원', '학교', '공항'];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-12 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
          Infinite Language
        </h1>
        
        {/* 드롭다운 메뉴 섹션 */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
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
                onSelect={setSelectedEnvironment}
                selectedOption={selectedEnvironment}
              />
            </div>
          </div>
          
          {/* 선택된 옵션 표시 */}
          {(selectedDifficulty || selectedEnvironment) && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
                선택된 설정
              </h3>
              <div className="space-y-1 text-sm sm:text-base text-blue-700 dark:text-blue-300">
                {selectedDifficulty && <p>난이도: {selectedDifficulty}</p>}
                {selectedEnvironment && <p>환경: {selectedEnvironment}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto px-4">
          <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">시작하기</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              언어 학습 여정을 시작해보세요
            </p>
            <button
              onClick={() => {
                if (!selectedDifficulty || !selectedEnvironment) {
                  alert('난이도와 환경을 모두 선택해주세요!');
                  return;
                }
                window.location.href = `/quiz?difficulty=${selectedDifficulty}&environment=${selectedEnvironment}`;
              }}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 text-sm sm:text-base touch-manipulation min-h-[44px]"
              disabled={!selectedDifficulty || !selectedEnvironment}
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
  )
}
