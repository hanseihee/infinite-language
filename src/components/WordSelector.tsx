'use client';

import { useState, useEffect } from 'react';

interface WordSelectorProps {
  words: string[];
  onWordsChange: (words: string[]) => void;
}

export default function WordSelector({ words, onWordsChange }: WordSelectorProps) {
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
    <div className="space-y-4">
      {/* 정답칸 */}
      <div className="p-4 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 min-h-[80px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
            내 답안
          </h3>
          <button
            onClick={handleClear}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
          >
            지우기
          </button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          {selectedWords.length === 0 ? (
            <p className="text-blue-600 dark:text-blue-300 italic">
              아래 단어들을 클릭하여 문장을 완성하세요
            </p>
          ) : (
            selectedWords.map((word, index) => (
              <div
                key={index}
                onClick={() => handleRemoveWord(index)}
                className="inline-block bg-blue-500 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors shadow-sm"
              >
                {word}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 단어 선택 영역 */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">
          단어 선택
        </h3>
        <div className="flex flex-wrap gap-2">
          {words.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word, index)}
              disabled={usedWords.has(index)}
              className={`px-3 py-2 rounded-lg transition-all shadow-sm ${
                usedWords.has(index)
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-50'
                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 cursor-pointer'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          단어를 클릭하여 순서대로 문장을 만들어보세요
        </p>
      </div>
    </div>
  );
}