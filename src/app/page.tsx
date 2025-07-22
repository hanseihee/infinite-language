export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Infinite Language
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">
          언어 학습을 위한 Next.js 애플리케이션
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">시작하기</h2>
            <p className="text-gray-600 dark:text-gray-400">
              언어 학습 여정을 시작해보세요
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">학습 진도</h2>
            <p className="text-gray-600 dark:text-gray-400">
              학습 진도를 확인하고 관리하세요
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
