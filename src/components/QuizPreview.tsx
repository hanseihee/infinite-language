'use client';

import { useState } from 'react';

interface QuizPreviewProps {
  onLoginClick: () => void;
}

export default function QuizPreview({ onLoginClick }: QuizPreviewProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  
  // 더 긴 샘플 문제 데이터
  const sampleQuestion = {
    shuffledWords: ['meeting', 'the', 'to', 'I', 'tomorrow', 'need', 'prepare', 'presentation', 'for'],
    correctAnswer: 'I need to prepare the presentation for tomorrow meeting',
    koreanTranslation: '내일 회의를 위한 프레젠테이션을 준비해야 해요',
    difficulty: '중간',
    environment: '회사'
  };

  const handleWordClick = (word: string) => {
    if (showFeedback) return;
    
    const newAnswer = userAnswer ? `${userAnswer} ${word}` : word;
    setUserAnswer(newAnswer);
    
    // 완성되면 자동으로 피드백 표시
    if (newAnswer.split(' ').length === sampleQuestion.shuffledWords.length) {
      setTimeout(() => {
        setShowFeedback(true);
      }, 500);
    }
  };

  const resetDemo = () => {
    setShowFeedback(false);
    setUserAnswer('');
  };

  return (
    <div className="max-w-md mx-auto mt-8 mb-8">
      {/* 광고 헤더 */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            lingbrew에서 이런 문제를 풀어보세요!
          </span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          실제 문제와 피드백 화면을 미리 체험해보세요
        </p>
      </div>

      {/* 데모 컨테이너 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 p-6 relative overflow-hidden">
        
        {/* 배경 그라디언트 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"></div>
        
        <div className="relative z-10">

          {/* 문제 화면 */}
          {!showFeedback ? (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full mr-2">
                  {sampleQuestion.difficulty}
                </span>
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                  {sampleQuestion.environment}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-center mb-4">
                아래 단어들을 올바른 순서로 배열하세요
              </h3>
              
              {/* 한국어 힌트 */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>💡 힌트:</strong> {sampleQuestion.koreanTranslation}
                </p>
              </div>

              {/* 답안 영역 */}
              <div className="p-4 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 min-h-[80px]">
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">내 답안</p>
                <div className="min-h-[40px] flex items-center">
                  <p className="text-base text-blue-700 dark:text-blue-300 leading-relaxed">
                    {userAnswer || '단어를 클릭하여 문장을 만들어보세요'}
                  </p>
                </div>
              </div>

              {/* 단어 선택 영역 */}
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">단어 선택</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {sampleQuestion.shuffledWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleWordClick(word)}
                      disabled={userAnswer.includes(word)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        userAnswer.includes(word)
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer shadow-sm hover:shadow-md'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 피드백 화면 */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">결과 확인</h3>
              
              {/* 정답 피드백 */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-green-700 dark:text-green-300 font-semibold">✓ 정답입니다!</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-green-700 dark:text-green-300">
                    <strong>당신의 답:</strong> {userAnswer}
                  </p>
                  <p className="text-green-700 dark:text-green-300">
                    <strong>정답:</strong> {sampleQuestion.correctAnswer}
                  </p>
                  <button className="mt-2 flex items-center space-x-1 text-blue-600 dark:text-blue-400 text-xs">
                    <span>🔊</span>
                    <span className="underline">정답을 음성으로 들어보세요</span>
                  </button>
                </div>
              </div>

              {/* AI 분석 (샘플) */}
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center">
                  <span className="mr-2">💡</span>
                  AI 분석 결과
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-amber-700 dark:text-amber-300">문법 포인트:</span>
                    <p className="mt-1 text-amber-600 dark:text-amber-400">
                      주어(I) + 동사(like) + 목적어(coffee)의 기본 문장 구조를 잘 사용했습니다.
                    </p>
                  </div>
                  <div className="mt-3 p-2 bg-amber-100 dark:bg-amber-800/20 rounded">
                    <span className="font-medium text-amber-800 dark:text-amber-200">💡 팁:</span>
                    <p className="mt-1 text-amber-700 dark:text-amber-300">
                      영어는 주어가 항상 앞에 와야 한다는 점을 기억하세요!
                    </p>
                  </div>
                </div>
              </div>

              {/* 다시 시도 버튼 */}
              <div className="text-center">
                <button
                  onClick={resetDemo}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                >
                  다시 체험하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 체험 라벨 */}
        <div className="absolute top-2 right-2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
            DEMO
          </span>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="mt-6 text-center space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
          <h3 className="font-bold text-lg mb-2">🚀 더 많은 문제를 풀어보고 싶으시다면?</h3>
          <div className="space-y-2 text-sm mb-4">
            <p>✨ 5가지 난이도별 맞춤형 문제</p>
            <p>🎯 8가지 실생활 환경별 학습</p>
            <p>🔊 AI 음성 발음 지원</p>
            <p>💡 틀린 문제 상세 분석</p>
            <p>🏆 실시간 랭킹 시스템</p>
          </div>
          <button
            onClick={onLoginClick}
            className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors shadow-lg w-full"
          >
            지금 무료로 시작하기 →
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Google 계정으로 간편 로그인 • 하루 50문제 무료
        </p>
      </div>
    </div>
  );
}