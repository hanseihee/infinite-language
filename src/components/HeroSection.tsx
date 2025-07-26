'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { user, signInWithGoogle } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const rotatingWords = ['English', 'Grammar', 'Speaking', 'Writing', 'Reading', 'Listening'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      {/* 배경 그라디언트 애니메이션 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 animate-gradient"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                🚀 AI 기반 영어 학습 플랫폼
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="text-gray-900 dark:text-white">
                매일 5분으로
              </span>
              <br />
              <span className="relative">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-30"></span>
                <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {rotatingWords[currentWordIndex]}
                </span>
              </span>
              <span className="text-gray-900 dark:text-white">
                &nbsp;실력 향상
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              실전 영어 문장 구성 연습으로 문법과 어휘를 동시에 학습하세요.
              <br />
              AI가 틀린 문제를 분석하고 상세한 설명을 제공합니다.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base"
                >
                  학습 시작하기 →
                </button>
              ) : (
                <>
                  <button
                    onClick={signInWithGoogle}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    무료로 시작하기
                  </button>
                  <button
                    onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 text-base"
                  >
                    체험해보기
                  </button>
                </>
              )}
            </div>

          </div>

          {/* 오른쪽: 비주얼 요소 */}
          <div className="relative lg:block hidden">
            <div className="relative w-full h-[400px]">
              {/* 플로팅 카드들 */}
              <div className="absolute top-5 right-5 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 animate-float">
                <p className="text-lg font-bold mb-1">Perfect! ✓</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">문법 정확도 95%</p>
              </div>
              
              <div className="absolute bottom-10 left-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-2xl p-4 animate-float-delayed">
                <p className="text-base font-semibold mb-1">Today&apos;s Goal</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-white rounded-full"></div>
                  </div>
                  <span className="text-xs">4/5</span>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-xl shadow-2xl p-6 animate-float-slow">
                <p className="text-3xl font-bold mb-1">📝</p>
                <p className="text-base font-semibold">5 문장 완성</p>
              </div>

              {/* 배경 원형 요소들 */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* 모바일용 비주얼 요소 */}
        <div className="lg:hidden mt-12 relative h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-2xl p-8 animate-float">
              <p className="text-4xl font-bold mb-2 text-center">🎯</p>
              <p className="text-lg font-semibold">매일 5문제</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}