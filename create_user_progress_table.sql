-- Supabase Dashboard의 SQL Editor에서 실행하세요
-- user_progress 테이블 생성 및 설정

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('쉬움', '중간', '어려움')),
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- 사용자당 난이도별로 하나의 레코드만 허용
    UNIQUE(user_id, difficulty)
);

-- 2. 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_difficulty ON public.user_progress(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_progress_score ON public.user_progress(score DESC);

-- 3. updated_at 자동 업데이트 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. updated_at 트리거 생성
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. RLS (Row Level Security) 활성화
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 6. RLS 정책 생성
-- 모든 사용자가 랭킹을 위해 다른 사용자의 점수를 볼 수 있도록 허용
DROP POLICY IF EXISTS "Public can view scores for ranking" ON public.user_progress;
CREATE POLICY "Public can view scores for ranking" ON public.user_progress
    FOR SELECT USING (true);

-- 사용자는 자신의 진척도만 삽입/업데이트 가능
DROP POLICY IF EXISTS "Users can insert their own progress" ON public.user_progress;
CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own progress" ON public.user_progress;
CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. 테스트 데이터 삽입 (선택사항 - 테스트용)
-- INSERT INTO public.user_progress (user_id, difficulty, score) 
-- VALUES 
--     ('7ffd0905-1c9c-4657-bb80-911dd3437ec1', '쉬움', 15),
--     ('7ffd0905-1c9c-4657-bb80-911dd3437ec1', '중간', 8),
--     ('7ffd0905-1c9c-4657-bb80-911dd3437ec1', '어려움', 3);

-- 실행 완료 후 테이블 확인
SELECT 
    table_name, 
    table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'user_progress';