-- Run this SQL in your Supabase SQL Editor to set up the complete schema

-- Enhanced production schema for DSA Daily Boost

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    study_streak INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    weekly_goal_problems INTEGER DEFAULT 20,
    weekly_goal_hours INTEGER DEFAULT 15,
    weekly_goal_topics INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced user_progress table
DROP TABLE IF EXISTS user_progress;
CREATE TABLE user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    problems_saved INTEGER DEFAULT 0,
    mastery_level INTEGER DEFAULT 0,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    problems_attempted INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    session_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_date DATE DEFAULT CURRENT_DATE,
    topic_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_date)
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_progress
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for study_sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON study_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON study_sessions;

CREATE POLICY "Users can view own sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_challenges
DROP POLICY IF EXISTS "Users can view own challenges" ON daily_challenges;
DROP POLICY IF EXISTS "Users can insert own challenges" ON daily_challenges;
DROP POLICY IF EXISTS "Users can update own challenges" ON daily_challenges;

CREATE POLICY "Users can view own challenges" ON daily_challenges
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenges" ON daily_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own challenges" ON daily_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_topic ON user_progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_user_date ON daily_challenges(user_id, challenge_date);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();