export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <p className="mb-4">
            lingbrew(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요시하며, 
            「개인정보 보호법」을 준수하고 있습니다. 본 개인정보처리방침은 이용자가 제공한 개인정보가 
            어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. 수집하는 개인정보 항목</h2>
          <p className="mb-4">서비스는 회원가입 및 서비스 이용을 위해 다음과 같은 개인정보를 수집하고 있습니다:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>필수항목:</strong> 이메일 주소
            </li>
            <li>
              <strong>자동 수집 항목:</strong> 서비스 이용 기록, 접속 로그, 쿠키
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. 개인정보의 수집 및 이용목적</h2>
          <p className="mb-4">서비스는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별</li>
            <li>서비스 제공: 콘텐츠 제공, 맞춤 서비스 제공</li>
            <li>서비스 개선: 서비스 이용에 대한 통계 수집 및 분석</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. 개인정보의 보유 및 이용기간</h2>
          <p className="mb-4">
            원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 
            단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>회원 정보:</strong> 회원 탈퇴 시까지
            </li>
            <li>
              <strong>서비스 이용 기록:</strong> 최대 1년
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
          <p className="mb-4">
            서비스는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 
            다만, 아래의 경우에는 예외로 합니다:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>이용자들이 사전에 동의한 경우</li>
            <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. 개인정보처리 위탁</h2>
          <p className="mb-4">
            서비스는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google (OAuth 인증):</strong> 회원 인증 및 로그인 처리
            </li>
            <li>
              <strong>Supabase:</strong> 데이터베이스 관리 및 인증 서비스
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. 이용자의 권리와 그 행사방법</h2>
          <p className="mb-4">이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정 요구</li>
            <li>삭제 요구</li>
            <li>처리정지 요구</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. 개인정보의 파기절차 및 방법</h2>
          <p className="mb-4">
            서비스는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 
            파기의 절차, 기한 및 방법은 다음과 같습니다:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>파기절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져 
              내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.
            </li>
            <li>
              <strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. 개인정보 보호책임자</h2>
          <p className="mb-4">
            서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 
            이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>개인정보 보호책임자: lingbrew 운영팀</li>
            <li>연락처: [이메일 주소]</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. 개인정보 처리방침 변경</h2>
          <p className="mb-4">
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 
            삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. 시행일</h2>
          <p className="mb-4">
            본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.
          </p>
        </section>
      </div>
    </div>
  )
}