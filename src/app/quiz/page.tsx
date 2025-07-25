'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import WordSelector from '@/components/WordSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useUserDisplay } from '@/hooks/useUserDisplay';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

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

interface UserProgress {
  id: string;
  user_id: string;
  difficulty: string;
  score: number;
  rank: number;
  user_info?: {
    email: string;
    raw_user_meta_data: {
      name?: string;
      full_name?: string;
      email?: string;
      avatar_url?: string;
    };
  };
}

function QuizPageContent() {
  const { user, loading } = useAuth();
  const { getUserDisplayName, getRankIcon } = useUserDisplay(user);
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
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [rankingData, setRankingData] = useState<UserProgress[] | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);

  const recordQuizStart = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          difficulty,
          environment,
          score: 0, // 시작 시점이므로 0점
          total_questions: 10
        }),
      });

      if (response.ok) {
        console.log('✅ Quiz start recorded - count decreased');
      } else {
        const errorData = await response.text();
        console.error('❌ Failed to record quiz start:', {
          status: response.status,
          error: errorData
        });
      }
    } catch (error) {
      console.error('❌ Error recording quiz start:', error);
    }
  }, [user, difficulty, environment]);

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
      
      // 퀴즈 시작 시점에 기록 저장 (카운트 감소)
      await recordQuizStart();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, environment, recordQuizStart]);

  useEffect(() => {
    if (difficulty && environment) {
      generateSentences();
    }
  }, [difficulty, environment, generateSentences]);

  const handleWordsChange = (words: string[]) => {
    setCurrentAnswer(words.join(' '));
  };

  const playTTS = async (text: string) => {
    setIsPlayingTTS(true);
    
    // 1순위: Web Speech API 시도 (브라우저 내장, 가장 안정적)
    if (tryWebSpeechAPI(text)) {
      return;
    }
    
    // 2순위: Google TTS API 시도
    try {
      const response = await fetch(`/api/tts?text=${encodeURIComponent(text)}&lang=en&slow=false`);
      const data = await response.json();
      
      if (data.error) {
        console.error('TTS API 에러:', data.error);
        setIsPlayingTTS(false);
        return;
      }
      
      if (data.url) {
        const audio = new Audio();
        
        const playbackTimeout = setTimeout(() => {
          console.warn('TTS playback timeout');
          audio.pause();
          setIsPlayingTTS(false);
        }, 10000);
        
        // 오디오 이벤트 리스너 설정
        audio.onended = () => {
          clearTimeout(playbackTimeout);
          setIsPlayingTTS(false);
        };
        
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          clearTimeout(playbackTimeout);
          setIsPlayingTTS(false);
        };
        
        audio.onloadeddata = () => {
          // 로드되면 바로 재생 시도
          audio.play().catch((playError) => {
            console.error('Play failed:', playError);
            setIsPlayingTTS(false);
          });
        };
        
        
        // 오디오 소스 설정
        audio.src = data.url;
        audio.load();
      } else {
        throw new Error('No audio URL received');
      }
    } catch (error) {
      console.error('TTS 재생 실패:', error);
      setIsPlayingTTS(false);
    }
  };

  const tryWebSpeechAPI = (text: string): boolean => {
    // Web Speech API 지원 확인
    if (!('speechSynthesis' in window)) {
      console.log('Web Speech API not supported');
      return false;
    }

    try {
      // 기존 음성 중지
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsPlayingTTS(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Web Speech API error:', event.error);
        setIsPlayingTTS(false);
        return false;
      };
      
      speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('Web Speech API failed:', error);
      return false;
    }
  };

  const checkAnswerWithText = (answerText: string) => {
    const currentSentence = sentences[currentSentenceIndex];
    const originalSentence = currentSentence.originalSentence
      .replace(/[?!.]/g, '')
      .toLowerCase()
      .trim();
    const userSentence = answerText.toLowerCase().trim();
    
    const isCorrect = originalSentence === userSentence;
    
    const result: AnswerResult = {
      isCorrect,
      userAnswer: answerText,
      correctAnswer: currentSentence.originalSentence
    };

    const newAnswers = [...userAnswers];
    newAnswers[currentSentenceIndex] = answerText;
    setUserAnswers(newAnswers);

    const newResults = [...answerResults];
    newResults[currentSentenceIndex] = result;
    setAnswerResults(newResults);
    
    setShowFeedback(true);
    
    // TTS 음성 재생
    playTTS(currentSentence.originalSentence);
  };

  const checkCurrentAnswer = () => {
    checkAnswerWithText(currentAnswer);
  };

  const handleTTSClick = () => {
    if (isPlayingTTS) return; // 이미 재생 중이면 무시
    
    const currentSentence = sentences[currentSentenceIndex];
    playTTS(currentSentence.originalSentence);
  };

  const saveProgressToSupabase = async (correctCount: number, totalQuestions: number) => {
    if (!user || !difficulty || !environment) {
      console.warn('Cannot save progress: missing user, difficulty, or environment');
      return;
    }

    console.log('Saving progress:', {
      user_id: user.id,
      difficulty,
      environment,
      correct_answers: correctCount,
      total_questions: totalQuestions
    });

    try {
      // 퀴즈 완료 - 기록은 시작 시점에 이미 저장됨
      console.log('✅ Quiz completed with score:', correctCount);

      // 2. 기존 user_progress 테이블 업데이트 (랭킹용)
      const { data: existingProgress, error: selectError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('difficulty', difficulty)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('❌ Error fetching existing progress:', selectError);
        return;
      }

      const newScore = correctCount;
      
      if (existingProgress) {
        // 기존 기록이 있으면 점수 누적
        const updatedScore = existingProgress.score + newScore;
        
        console.log('📈 Updating existing progress:', {
          previous_score: existingProgress.score,
          new_score: newScore,
          total_score: updatedScore
        });
        
        const { data, error } = await supabase
          .from('user_progress')
          .update({ 
            score: updatedScore,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('difficulty', difficulty)
          .select();

        if (error) {
          console.error('❌ Error updating progress:', error);
          return;
        }

        console.log('✅ Progress updated successfully:', data[0]);
      } else {
        // 새로운 기록 생성
        console.log('🆕 Creating new progress record for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_progress')
          .insert([{
            user_id: user.id,
            difficulty,
            score: newScore,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();

        if (error) {
          console.error('❌ Error creating progress:', error);
          return;
        }

        console.log('✅ New progress created successfully:', data[0]);
      }
      
      // 점수 저장 후 랭킹 정보 가져오기
      await fetchRankingData();
    } catch (error) {
      console.error('❌ Error saving progress:', error);
    }
  };

  const fetchRankingData = async () => {
    if (!user || !difficulty) return;

    try {
      const response = await fetch(`/api/ranking?difficulty=${difficulty}&user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setRankingData(data.data);
        setUserRank(data.user_rank);
      } else {
        console.error('❌ Failed to fetch ranking:', data.error);
      }
    } catch (error) {
      console.error('❌ Network error fetching ranking:', error);
    }
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
      const correctCount = answerResults.filter(result => result.isCorrect).length;
      saveProgressToSupabase(correctCount, sentences.length);
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

  // 로그인 체크
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl gradient-loading font-bold">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              퀴즈를 이용하려면 먼저 로그인해주세요.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl gradient-loading font-bold">문장을 생성하고 있습니다...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
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
      </>
    );
  }

  if (showResults) {
    const correctCount = answerResults.filter(result => result.isCorrect).length;
    
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8">퀴즈 결과</h1>
            
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {correctCount} / {sentences.length}
              </div>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4">
                정답률: {Math.round((correctCount / sentences.length) * 100)}%
              </p>
              
              {/* 현재 사용자 순위 표시 */}
              {userRank && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                  <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200">
                    <strong>🏆 {difficulty} 난이도 순위:</strong> {getRankIcon(userRank)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 sm:space-y-6">
              {answerResults.map((result, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-base sm:text-lg font-semibold mr-2">문제 {index + 1}</span>
                    {result.isCorrect ? (
                      <span className="text-green-500">✓ 정답</span>
                    ) : (
                      <span className="text-red-500">✗ 오답</span>
                    )}
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <p><strong>정답:</strong> {result.correctAnswer}</p>
                    <p><strong>당신의 답:</strong> {result.userAnswer || '(답하지 않음)'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 상위 랭킹 표시 */}
            {rankingData && rankingData.length > 0 && (
              <div className="mt-8 sm:mt-10">
                <h2 className="text-lg sm:text-xl font-bold text-center mb-4 sm:mb-6">
                  🏆 {difficulty} 난이도 상위 랭킹
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 sm:p-6">
                  <div className="space-y-3">
                    {rankingData.slice(0, 5).map((userProgress: UserProgress) => (
                      <div 
                        key={userProgress.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          user && userProgress.user_id === user.id 
                            ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                            : 'bg-white dark:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-lg font-bold min-w-[50px]">
                            {getRankIcon(userProgress.rank)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm sm:text-base">
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
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {userProgress.score}점
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-4">
                    <button
                      onClick={() => window.location.href = '/ranking'}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm underline"
                    >
                      전체 랭킹 보기
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => window.location.href = '/'}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base"
                >
                  홈으로 돌아가기
                </button>
                <button
                  onClick={() => window.location.href = '/ranking'}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base"
                >
                  전체 랭킹 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  const currentSentence = sentences[currentSentenceIndex];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">영어 문장 만들기</h1>
            <div className="text-sm text-gray-500">
              {currentSentenceIndex + 1} / {sentences.length}
            </div>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base lg:text-lg mb-2">
              <strong>난이도:</strong> {difficulty} | <strong>환경:</strong> {environment}
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4">
              문제 {currentSentenceIndex + 1}: 아래 단어들을 올바른 순서로 배열하세요
            </h2>
            
            {/* 한국어 힌트 */}
            <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-200">
                <strong>💡 힌트 (한국어):</strong> {currentSentence.koreanTranslation}
              </p>
            </div>
            
            <WordSelector
              words={currentSentence.shuffledWords}
              onWordsChange={handleWordsChange}
              onAllWordsSelected={(allWords) => {
                if (!showFeedback) {
                  // 전달받은 완전한 단어 배열로 즉시 답안 확인
                  const completeAnswer = allWords.join(' ');
                  checkAnswerWithText(completeAnswer);
                }
              }}
            />

            {currentAnswer && (
              <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200">
                  <strong>현재 답:</strong> {currentAnswer}
                </p>
              </div>
            )}

            {showFeedback && answerResults[currentSentenceIndex] && (
              <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg ${
                answerResults[currentSentenceIndex].isCorrect 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 space-y-2 sm:space-y-0">
                  <div className="flex items-center">
                    {answerResults[currentSentenceIndex].isCorrect ? (
                      <span className="text-sm sm:text-base text-green-700 dark:text-green-300 font-semibold">✓ 정답입니다!</span>
                    ) : (
                      <span className="text-sm sm:text-base text-red-700 dark:text-red-300 font-semibold">✗ 틀렸습니다</span>
                    )}
                  </div>
                  {isPlayingTTS && (
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                      <div className="animate-pulse mr-2">🔊</div>
                      <span className="text-sm">음성 재생 중...</span>
                    </div>
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
                  <button
                    onClick={handleTTSClick}
                    disabled={isPlayingTTS}
                    className={`text-xs mt-2 flex items-center space-x-1 transition-colors ${
                      isPlayingTTS 
                        ? 'text-blue-400 dark:text-blue-500 cursor-not-allowed' 
                        : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer'
                    }`}
                  >
                    <span className={isPlayingTTS ? 'animate-pulse' : ''}>🔊</span>
                    <span className="underline">
                      {isPlayingTTS ? '음성 재생 중...' : '정답을 음성으로 들어보세요'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={goToPrevSentence}
              disabled={currentSentenceIndex === 0}
              className="w-full sm:w-auto bg-gray-500 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-2 px-3 sm:px-4 rounded disabled:cursor-not-allowed text-sm sm:text-base"
            >
              이전
            </button>
            
            <button
              onClick={goToNextSentence}
              disabled={!currentAnswer}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-3 sm:px-4 rounded disabled:cursor-not-allowed text-sm sm:text-base"
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
    </>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl gradient-loading font-bold">페이지를 로딩하고 있습니다...</p>
        </div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
}