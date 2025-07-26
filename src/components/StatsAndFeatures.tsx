'use client';

import { useState, useEffect } from 'react';

export default function StatsAndFeatures() {
  const [counts, setCounts] = useState({
    users: 0,
    sentences: 0,
    completionRate: 0
  });

  useEffect(() => {
    // 카운트 애니메이션
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;
    
    const targets = {
      users: 5,
      sentences: 50000,
      completionRate: 95
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        users: Math.floor(targets.users * progress),
        sentences: Math.floor(targets.sentences * progress),
        completionRate: Math.floor(targets.completionRate * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: '🎯',
      value: counts.users.toLocaleString() + ' 문제',
      label: '일일 학습 목표',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📝',
      value: counts.sentences.toLocaleString() + '+',
      label: '학습 문장',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🎯',
      value: counts.completionRate + '%',
      label: '완료율',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const features = [
    {
      icon: '🤖',
      title: 'AI 맞춤 학습',
      description: '당신의 실력을 분석하여 최적화된 문제를 제공합니다',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: '🎯',
      title: '실전 중심 학습',
      description: '일상, 비즈니스, 여행 등 실제 상황에서 쓰는 표현 학습',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '📊',
      title: '상세한 분석',
      description: '틀린 문제에 대한 AI의 상세한 문법 설명과 팁 제공',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🏆',
      title: '게임화 학습',
      description: '랭킹 시스템과 성취도 추적으로 동기부여 극대화',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: '🔊',
      title: '발음 학습',
      description: 'TTS 기술로 정확한 발음을 듣고 따라할 수 있습니다',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: '📱',
      title: '언제 어디서나',
      description: '모바일 최적화로 통근길, 점심시간에도 학습 가능',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section className="py-20 relative">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%200h20L0%2020z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 통계 섹션 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              숫자로 보는 lingbrew
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            매일 성장하는 학습 커뮤니티
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${stat.color}`}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 기능 섹션 */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            왜 lingbrew를 선택해야 할까요?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            과학적이고 효과적인 영어 학습 방법
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${feature.gradient}`}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white text-2xl mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}