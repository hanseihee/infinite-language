-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create tables for the language learning app

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Quiz sessions table
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User answers table
CREATE TABLE IF NOT EXISTS public.user_answers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Sentences cache table (for storing generated sentences)
CREATE TABLE IF NOT EXISTS public.sentences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sentence_text TEXT NOT NULL,
    target_word TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    difficulty TEXT NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sentences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own quiz sessions" ON public.quiz_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz sessions" ON public.quiz_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own answers" ON public.user_answers
    FOR SELECT USING (
        auth.uid() = (
            SELECT user_id FROM public.quiz_sessions 
            WHERE id = user_answers.quiz_session_id
        )
    );

CREATE POLICY "Users can insert own answers" ON public.user_answers
    FOR INSERT WITH CHECK (
        auth.uid() = (
            SELECT user_id FROM public.quiz_sessions 
            WHERE id = user_answers.quiz_session_id
        )
    );

CREATE POLICY "Anyone can view sentences" ON public.sentences
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert sentences" ON public.sentences
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_quiz_session_id ON public.user_answers(quiz_session_id);
CREATE INDEX IF NOT EXISTS idx_sentences_target_word ON public.sentences(target_word);
CREATE INDEX IF NOT EXISTS idx_sentences_difficulty ON public.sentences(difficulty);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();