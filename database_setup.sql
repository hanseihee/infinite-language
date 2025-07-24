-- =========================================
-- Infinite Language - Database Setup SQL
-- =========================================
-- Supabase Dashboard SQL Editor에서 실행하세요

-- 1. quiz_attempts 테이블 생성
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('쉬움', '중간', '어려움')),
  environment TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
  total_questions INTEGER NOT NULL DEFAULT 10 CHECK (total_questions > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 성능 최적화를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_date 
  ON quiz_attempts(user_id, attempt_date);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_difficulty 
  ON quiz_attempts(user_id, difficulty);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_created_at 
  ON quiz_attempts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_score 
  ON quiz_attempts(score DESC);

-- 3. 복합 인덱스 (통계 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_stats 
  ON quiz_attempts(difficulty, attempt_date, score DESC);

-- 4. RLS (Row Level Security) 설정
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 5. RLS 정책 생성 (IF NOT EXISTS가 없으므로 DROP 후 CREATE)
-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Users can view their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert their own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can update their own quiz attempts" ON quiz_attempts;

-- 사용자는 자신의 기록만 볼 수 있음
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- 모든 사용자가 퀴즈 기록을 삽입할 수 있음 (API 레벨에서 검증)
CREATE POLICY "Users can insert quiz attempts" 
  ON quiz_attempts FOR INSERT
  WITH CHECK (true);

-- 사용자는 자신의 기록만 업데이트할 수 있음
CREATE POLICY "Users can update their own quiz attempts"
  ON quiz_attempts FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. 기존 user_progress 테이블 최적화 (이미 있다면 스킵)
CREATE INDEX IF NOT EXISTS idx_user_progress_user_difficulty 
  ON user_progress(user_id, difficulty);

CREATE INDEX IF NOT EXISTS idx_user_progress_created_at 
  ON user_progress(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_progress_score 
  ON user_progress(score DESC);

-- 7. 통계 조회를 위한 뷰 생성
CREATE OR REPLACE VIEW quiz_statistics AS
SELECT 
  user_id,
  difficulty,
  COUNT(*) as total_attempts,
  SUM(score) as total_score,
  AVG(score::FLOAT) as avg_score,
  MAX(score) as best_score,
  COUNT(CASE WHEN attempt_date = CURRENT_DATE THEN 1 END) as attempts_today,
  MAX(created_at) as last_attempt
FROM quiz_attempts
GROUP BY user_id, difficulty;

-- 8. 일일 통계 뷰
CREATE OR REPLACE VIEW daily_quiz_stats AS
SELECT 
  attempt_date,
  difficulty,
  COUNT(*) as total_attempts,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(score::FLOAT) as avg_score,
  MAX(score) as highest_score
FROM quiz_attempts
GROUP BY attempt_date, difficulty
ORDER BY attempt_date DESC, difficulty;

-- 9. 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. 트리거 적용
DROP TRIGGER IF EXISTS update_quiz_attempts_updated_at ON quiz_attempts;
CREATE TRIGGER update_quiz_attempts_updated_at
    BEFORE UPDATE ON quiz_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 11. 데이터 검증 및 정리 (선택사항)
-- 잘못된 데이터가 있을 경우 정리
DELETE FROM quiz_attempts WHERE score < 0 OR total_questions <= 0;

-- 12. 성능 분석을 위한 쿼리 (실행 후 결과 확인)
-- 테이블 크기 확인
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename = 'quiz_attempts';

-- 인덱스 사용률 확인 (추후 모니터링용)
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  most_common_vals
FROM pg_stats 
WHERE tablename IN ('quiz_attempts', 'user_progress');

-- =========================================
-- 완료! 
-- 이제 애플리케이션에서 quiz_attempts 테이블을 사용할 수 있습니다.
-- =========================================