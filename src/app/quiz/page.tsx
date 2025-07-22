'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WordSelector from '@/components/WordSelector';

interface Sentence {
  id: number;
  shuffledWords: string[];
  originalSentence: string;
  koreanTranslation: string;
}

interface AnswerResult {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
}

function QuizPageContent() {
  const searchParams = useSearchParams();
  const difficulty = searchParams.get('difficulty');
  const environment = searchParams.get('environment');

  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const generateSentences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-sentences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          difficulty,
          environment,
        }),
      });

      if (!response.ok) {
        throw new Error('문장 생성에 실패했습니다.');
      }

      const data = await response.json();
      setSentences(data.sentences);
      setUserAnswers(new Array(data.sentences.length).fill(''));
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, environment]);

  useEffect(() => {
    if (difficulty && environment) {
      generateSentences();
    }
  }, [difficulty, environment, generateSentences]);

  const handleWordsChange = (words: string[]) => {
    setCurrentAnswer(words.join(' '));
  };

  const checkCurrentAnswer = () => {
    const currentSentence = sentences[currentSentenceIndex];
    const originalSentence = currentSentence.originalSentence
      .replace(/[?!.]/g, '')
      .toLowerCase()
      .trim();
    const userSentence = currentAnswer.toLowerCase().trim();
    
    const isCorrect = originalSentence === userSentence;
    
    const result: AnswerResult = {
      isCorrect,
      userAnswer: currentAnswer,
      correctAnswer: currentSentence.originalSentence
    };

    const newAnswers = [...userAnswers];
    newAnswers[currentSentenceIndex] = currentAnswer;
    setUserAnswers(newAnswers);

    const newResults = [...answerResults];
    newResults[currentSentenceIndex] = result;
    setAnswerResults(newResults);

    setShowFeedback(true);
    return result;
  };

  const goToNextSentence = () => {
    if (!showFeedback) {
      checkCurrentAnswer();
      return;
    }

    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
      setCurrentAnswer('');
      setShowFeedback(false);
    } else {
      setShowResults(true);
    }
  };

  const goToPrevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
      setCurrentAnswer(userAnswers[currentSentenceIndex - 1] || '');
      setShowFeedback(false);
    }
  };

  useEffect(() => {
    if (sentences.length > 0) {
      setCurrentAnswer(userAnswers[currentSentenceIndex] || '');
    }
  }, [currentSentenceIndex, sentences, userAnswers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">문장을 생성하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctCount = answerResults.filter(result => result.isCorrect).length;
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8">퀴즈 결과</h1>
            
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-2">
                {correctCount} / {sentences.length}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                정답률: {Math.round((correctCount / sentences.length) * 100)}%
              </p>
            </div>

            <div className="space-y-6">
              {answerResults.map((result, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-semibold mr-2">문제 {index + 1}</span>
                    {result.isCorrect ? (
                      <span className="text-green-500">✓ 정답</span>
                    ) : (
                      <span className="text-red-500">✗ 오답</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p><strong>정답:</strong> {result.correctAnswer}</p>
                    <p><strong>당신의 답:</strong> {result.userAnswer || '(답하지 않음)'}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">영어 문장 만들기</h1>
            <div className="text-sm text-gray-500">
              {currentSentenceIndex + 1} / {sentences.length}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg mb-2">
              <strong>난이도:</strong> {difficulty} | <strong>환경:</strong> {environment}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              문제 {currentSentenceIndex + 1}: 아래 단어들을 올바른 순서로 배열하세요
            </h2>
            
            {/* 한국어 힌트 */}
            <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>💡 힌트 (한국어):</strong> {currentSentence.koreanTranslation}
              </p>
            </div>
            
            <WordSelector
              words={currentSentence.shuffledWords}
              onWordsChange={handleWordsChange}
            />

            {currentAnswer && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>현재 답:</strong> {currentAnswer}
                </p>
              </div>
            )}

            {showFeedback && answerResults[currentSentenceIndex] && (
              <div className={`mt-4 p-4 rounded-lg ${
                answerResults[currentSentenceIndex].isCorrect 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center mb-2">
                  {answerResults[currentSentenceIndex].isCorrect ? (
                    <span className="text-green-700 dark:text-green-300 font-semibold">✓ 정답입니다!</span>
                  ) : (
                    <span className="text-red-700 dark:text-red-300 font-semibold">✗ 틀렸습니다</span>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <p className={answerResults[currentSentenceIndex].isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                    <strong>당신의 답:</strong> {answerResults[currentSentenceIndex].userAnswer}
                  </p>
                  {!answerResults[currentSentenceIndex].isCorrect && (
                    <p className="text-green-700 dark:text-green-300">
                      <strong>정답:</strong> {answerResults[currentSentenceIndex].correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={goToPrevSentence}
              disabled={currentSentenceIndex === 0}
              className="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
            >
              이전
            </button>
            
            <button
              onClick={goToNextSentence}
              disabled={!currentAnswer}
              className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed"
            >
              {showFeedback ? 
                (currentSentenceIndex === sentences.length - 1 ? '결과 보기' : '다음 문제') 
                : '답안 확인'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">페이지를 로딩하고 있습니다...</p>
        </div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
}