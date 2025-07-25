# Google AdSense 설정 가이드

## 1. Google AdSense 계정 생성 및 사이트 등록

1. [Google AdSense](https://www.google.com/adsense/)에 접속
2. Google 계정으로 로그인
3. "시작하기" 클릭
4. 웹사이트 URL 입력: `https://lingbrew.com`
5. 국가/지역 선택: 대한민국
6. 결제 정보 입력

## 2. 사이트 AdSense 코드 추가

AdSense 승인을 받기 위해 사이트에 AdSense 코드가 이미 추가되어 있습니다.

```typescript
// layout.tsx에 이미 추가됨
{process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID && (
  <script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
    crossOrigin="anonymous"
  />
)}
```

## 3. 환경 변수 설정

`.env.local` 파일에 AdSense Publisher ID 추가:

```bash
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxx
```

Publisher ID는 AdSense 계정 → 계정 → 계정 정보에서 확인 가능합니다.

## 4. 사이트 승인 대기

- AdSense 팀에서 사이트를 검토합니다 (보통 몇 일 ~ 몇 주 소요)
- 승인 기준:
  - 고품질 콘텐츠
  - 충분한 트래픽
  - 사용자 친화적인 디자인
  - AdSense 정책 준수

## 5. 광고 단위 생성 (승인 후)

승인 후 AdSense 대시보드에서:

1. **광고** → **광고 단위별** → **디스플레이 광고** 생성
2. 각 광고 위치별로 다른 슬롯 ID 생성:
   - 홈페이지 상단 배너
   - 퀴즈 페이지 중간

3. 생성된 슬롯 ID를 코드에서 업데이트:

```typescript
// 홈페이지 (src/app/page.tsx)
<GoogleAdsense 
  adSlot="여기에_실제_슬롯_ID_입력" 
  adFormat="auto"
/>

// 퀴즈 페이지 (src/app/quiz/page.tsx)  
<GoogleAdsense 
  adSlot="여기에_실제_슬롯_ID_입력" 
  adFormat="rectangle"
/>
```

## 6. 광고 배치 위치

현재 구현된 광고 위치:

1. **홈페이지**: 제목 아래, 난이도 선택 위
2. **퀴즈 페이지**: 퀴즈 중간 지점 (5번째 문제)

## 7. 수익 최적화 팁

- 모바일 친화적인 반응형 광고 사용
- 사용자 경험을 해치지 않는 적절한 위치에 배치
- A/B 테스트로 최적의 광고 위치 찾기
- 콘텐츠와 관련성 높은 광고 유도

## 8. 주의사항

- 자체 광고 클릭 금지
- 광고 조작 금지
- AdSense 정책 준수
- 트래픽 구매 금지

## 9. Vercel 환경 변수 설정

Vercel 대시보드에서 환경 변수 추가:
- Variable: `NEXT_PUBLIC_GOOGLE_ADSENSE_ID`
- Value: `ca-pub-xxxxxxxxxx`
- Environment: Production, Preview, Development 모두 체크