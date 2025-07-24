'use client';

import { useState, useEffect } from 'react';

interface WordSelectorProps {
  words: string[];
  onWordsChange: (words: string[]) => void;
  onAllWordsSelected?: () => void;
}

export default function WordSelector({ words, onWordsChange, onAllWordsSelected }: WordSelectorProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<Set<number>>(new Set());

  // 비프음 재생 함수
  const playBeep = () => {
    try {
      // Web Audio API를 사용한 비프음
      const AudioContextClass = window.AudioContext || (window as typeof window & {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      console.log('Audio not supported');
    }
  };

  // Reset when words prop changes (new sentence)
  useEffect(() => {
    setSelectedWords([]);
    setUsedWords(new Set());
  }, [words]);

  const handleWordClick = (word: string, index: number) => {
    if (usedWords.has(index)) return;
    
    playBeep();
    const newSelectedWords = [...selectedWords, word];
    const newUsedWords = new Set([...usedWords, index]);
    
    setSelectedWords(newSelectedWords);
    setUsedWords(newUsedWords);
    onWordsChange(newSelectedWords);
    
    // 모든 단어가 선택되었는지 확인하고 콜백 호출
    if (newSelectedWords.length === words.length && onAllWordsSelected) {
      // 약간의 지연을 두고 콜백 호출 (사용자가 선택을 확인할 수 있도록)
      setTimeout(() => {
        onAllWordsSelected();
      }, 500);
    }
  };

  const handleClear = () => {
    playBeep();
    setSelectedWords([]);
    setUsedWords(new Set());
    onWordsChange([]);
  };

  const handleRemoveWord = (indexToRemove: number) => {
    playBeep();
    const removedWord = selectedWords[indexToRemove];
    const newSelectedWords = selectedWords.filter((_, index) => index !== indexToRemove);
    
    // 사용된 단어에서도 제거
    const originalIndex = words.findIndex((word, idx) => 
      word === removedWord && usedWords.has(idx)
    );
    if (originalIndex !== -1) {
      const newUsedWords = new Set(usedWords);
      newUsedWords.delete(originalIndex);
      setUsedWords(newUsedWords);
    }
    
    setSelectedWords(newSelectedWords);
    onWordsChange(newSelectedWords);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 정답칸 */}
      <div className="p-3 sm:p-4 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 min-h-[70px] sm:min-h-[80px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-2 space-y-2 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-blue-800 dark:text-blue-200">
            내 답안
          </h3>
          <button
            onClick={handleClear}
            className="px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm rounded-md transition-colors min-h-[32px] flex items-center"
          >
            지우기
          </button>
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 min-h-[35px] sm:min-h-[40px]">
          {selectedWords.length === 0 ? (
            <p className="text-sm sm:text-base text-blue-600 dark:text-blue-300 italic">
              아래 단어들을 클릭하여 문장을 완성하세요
            </p>
          ) : (
            selectedWords.map((word, index) => (
              <div
                key={index}
                onClick={() => handleRemoveWord(index)}
                className="inline-block bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors shadow-sm text-sm sm:text-base min-h-[32px] sm:min-h-[36px] flex items-center"
              >
                {word}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 단어 선택 영역 */}
      <div className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-700 dark:text-gray-300">
          단어 선택
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {words.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word, index)}
              disabled={usedWords.has(index)}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all shadow-sm text-sm sm:text-base min-h-[36px] sm:min-h-[40px] flex items-center justify-center ${
                usedWords.has(index)
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
          단어를 클릭하여 순서대로 문장을 만들어보세요
        </p>
      </div>
    </div>
  );
}