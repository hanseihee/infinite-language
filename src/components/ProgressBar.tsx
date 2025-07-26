'use client';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className={`w-full ${className}`}>
      {/* 진행률 숫자 표시 */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          문제 진행률
        </span>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {current} / {total}
        </span>
      </div>
      
      {/* 프로그래스바 컨테이너 */}
      <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
        {/* 그라디언트 프로그래스바 */}
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* 애니메이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          
          {/* 진행 중일 때 움직이는 효과 */}
          {percentage > 0 && percentage < 100 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          )}
        </div>
        
        {/* 완료 시 반짝이는 효과 */}
        {percentage === 100 && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-white/40 to-yellow-400/30 animate-ping"></div>
        )}
      </div>
      
      {/* 단계별 포인트 표시 */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index < current
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg scale-110'
                : index === current
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-md animate-pulse scale-105'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
          />
        ))}
      </div>
      
      {/* 완료 메시지 */}
      {percentage === 100 && (
        <div className="text-center mt-3">
          <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent animate-bounce">
            🎉 모든 문제 완료!
          </span>
        </div>
      )}
    </div>
  );
}