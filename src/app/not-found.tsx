import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - 페이지를 찾을 수 없습니다 | lingbrew',
  description: '요청하신 페이지를 찾을 수 없습니다. 홈으로 돌아가서 영어 학습을 시작해보세요.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            404
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          아래 버튼을 클릭해 홈으로 돌아가세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            홈으로 돌아가기
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
          >
            이전 페이지로
          </button>
        </div>
        
        <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
          <p>문제가 계속되면 고객 지원팀에 문의해주세요.</p>
        </div>
      </div>
    </div>
  );
}