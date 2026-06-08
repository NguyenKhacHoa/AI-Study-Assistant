-- ==========================================
-- STUDYAI DATABASE SCHEMA INITIALIZATION
-- AUTHOR: Senior PostgreSQL DBA
-- TARGET: Supabase PostgreSQL Instance
-- ==========================================

-- Enable UUID Extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. TABLE: profiles
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    PRIMARY KEY (id)
);

-- ------------------------------------------
-- 2. TABLE: quizzes
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    source_material TEXT,
    creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    PRIMARY KEY (id)
);

-- ------------------------------------------
-- 3. TABLE: questions
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Format: ["Option A", "Option B", ...]
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    PRIMARY KEY (id)
);

-- ------------------------------------------
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', 'New Learner'),
        COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- RLS POLICIES: profiles
-- ------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" 
    ON public.profiles FOR DELETE 
    USING (auth.uid() = id);

-- ------------------------------------------
-- RLS POLICIES: quizzes
-- ------------------------------------------
CREATE POLICY "Users can view their own quizzes" 
    ON public.quizzes FOR SELECT 
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can insert their own quizzes" 
    ON public.quizzes FOR INSERT 
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own quizzes" 
    ON public.quizzes FOR UPDATE 
    USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own quizzes" 
    ON public.quizzes FOR DELETE 
    USING (auth.uid() = creator_id);

-- ------------------------------------------
-- RLS POLICIES: questions
-- ------------------------------------------
CREATE POLICY "Users can view questions of their own quizzes" 
    ON public.questions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE public.quizzes.id = public.questions.quiz_id 
            AND public.quizzes.creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert questions to their own quizzes" 
    ON public.questions FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE public.quizzes.id = public.questions.quiz_id 
            AND public.quizzes.creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can update questions of their own quizzes" 
    ON public.questions FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE public.quizzes.id = public.questions.quiz_id 
            AND public.quizzes.creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete questions of their own quizzes" 
    ON public.questions FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            WHERE public.quizzes.id = public.questions.quiz_id 
            AND public.quizzes.creator_id = auth.uid()
        )
    );

-- ------------------------------------------
-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ------------------------------------------
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create updated_at triggers for each table
CREATE OR REPLACE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE OR REPLACE TRIGGER update_quizzes_modtime BEFORE UPDATE ON public.quizzes FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE OR REPLACE TRIGGER update_questions_modtime BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION update_modified_column();
