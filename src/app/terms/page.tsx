export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
          <p className="mb-4">
            이 약관은 Infinite Language(이하 &quot;서비스&quot;)가 제공하는 언어 학습 서비스의 이용과 관련하여 
            서비스와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제2조 (용어의 정의)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>&quot;서비스&quot;란 Infinite Language가 제공하는 모든 언어 학습 관련 서비스를 의미합니다.</li>
            <li>&quot;이용자&quot;란 이 약관에 따라 서비스를 이용하는 모든 사용자를 의미합니다.</li>
            <li>&quot;계정&quot;이란 서비스 이용을 위해 이용자가 설정한 이메일 주소와 관련 정보를 의미합니다.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
          <p className="mb-4">
            1. 이 약관은 서비스를 이용하고자 하는 모든 이용자에게 그 효력이 발생합니다.
          </p>
          <p className="mb-4">
            2. 서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제4조 (서비스의 제공)</h2>
          <p className="mb-4">
            1. 서비스는 다음과 같은 기능을 제공합니다:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>영어 문장 구성 연습</li>
            <li>난이도별 학습 콘텐츠</li>
            <li>상황별 문장 학습</li>
            <li>음성 지원 기능</li>
          </ul>
          <p className="mb-4">
            2. 서비스는 기술적 필요에 따라 제공하는 서비스의 내용을 변경할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제5조 (이용자의 의무)</h2>
          <p className="mb-4">
            이용자는 다음 행위를 하여서는 안 됩니다:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>타인의 정보를 도용하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
            <li>법령 또는 공서양속에 위반되는 행위</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제6조 (개인정보 보호)</h2>
          <p className="mb-4">
            서비스는 이용자의 개인정보를 보호하기 위해 노력하며, 개인정보의 보호 및 사용에 대해서는 
            별도의 개인정보처리방침을 따릅니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제7조 (서비스 이용의 제한)</h2>
          <p className="mb-4">
            서비스는 이용자가 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 
            서비스 이용을 제한할 수 있습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제8조 (면책조항)</h2>
          <p className="mb-4">
            1. 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 
            서비스 제공에 관한 책임이 면제됩니다.
          </p>
          <p className="mb-4">
            2. 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">제9조 (재판권 및 준거법)</h2>
          <p className="mb-4">
            이 약관과 관련하여 발생한 분쟁에 대해서는 대한민국 법령을 적용하며, 
            관할 법원은 민사소송법상의 관할법원으로 합니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">부칙</h2>
          <p className="mb-4">
            이 약관은 2025년 1월 1일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  )
}