-- Create user_progress table for storing quiz scores
-- Run this SQL in your Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('쉬움', '중간', '어려움')),
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, difficulty)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_difficulty ON user_progress(difficulty);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own progress
CREATE POLICY "Users can manage their own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Create policy to allow public read access for ranking features  
CREATE POLICY "Allow public read access for rankings" ON user_progress
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT ALL ON user_progress TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_progress_id_seq TO anon, authenticated;