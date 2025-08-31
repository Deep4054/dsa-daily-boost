-- Enhanced features migration for DSA Daily Boost
-- Adds email logging, user challenge completions, and enhanced user profiles

-- Email logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('welcome', 'timer_complete', 'daily_summary', 'achievement', 'admin_notification')),
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
    external_id TEXT, -- ID from email service provider
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User challenge completions table (as mentioned in the schema)
CREATE TABLE IF NOT EXISTS user_challenge_completions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_taken_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced profiles table (rename from user_profiles to profiles for consistency)
DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    study_streak INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    weekly_goal_problems INTEGER DEFAULT 20,
    weekly_goal_hours INTEGER DEFAULT 15,
    weekly_goal_topics INTEGER DEFAULT 2,
    email_notifications BOOLEAN DEFAULT true,
    browser_notifications BOOLEAN DEFAULT true,
    daily_summary_emails BOOLEAN DEFAULT true,
    achievement_emails BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced daily logs with timer duration and overtime tracking
DROP TABLE IF EXISTS daily_logs;
CREATE TABLE daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE DEFAULT CURRENT_DATE,
    problems_solved INTEGER DEFAULT 0,
    study_time_minutes INTEGER DEFAULT 0,
    timer_duration_minutes INTEGER DEFAULT 0,
    overtime_minutes INTEGER DEFAULT 0,
    topics_studied TEXT[] DEFAULT '{}',
    sessions_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, log_date)
);

-- Enhanced study sessions with more detailed tracking
DROP TABLE IF EXISTS study_sessions;
CREATE TABLE study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    topic_title TEXT,
    duration_minutes INTEGER DEFAULT 0,
    timer_duration_minutes INTEGER DEFAULT 0,
    overtime_minutes INTEGER DEFAULT 0,
    problems_attempted INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    session_date DATE DEFAULT CURRENT_DATE,
    session_start_time TIMESTAMP WITH TIME ZONE,
    session_end_time TIMESTAMP WITH TIME ZONE,
    completion_status TEXT DEFAULT 'completed' CHECK (completion_status IN ('completed', 'stopped', 'interrupted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning streaks table
CREATE TABLE IF NOT EXISTS learning_streaks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    streak_type TEXT DEFAULT 'daily' CHECK (streak_type IN ('daily', 'weekly', 'monthly')),
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, streak_type)
);

-- Enable RLS on all new tables
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_logs (admin only)
CREATE POLICY "Admin can view email logs" ON email_logs
    FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "System can insert email logs" ON email_logs
    FOR INSERT WITH CHECK (true);

-- RLS Policies for user_challenge_completions
CREATE POLICY "Users can view own challenge completions" ON user_challenge_completions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenge completions" ON user_challenge_completions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_logs
CREATE POLICY "Users can view own daily logs" ON daily_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily logs" ON daily_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily logs" ON daily_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for study_sessions
CREATE POLICY "Users can view own study sessions" ON study_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study sessions" ON study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON user_achievements
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_streaks
CREATE POLICY "Users can view own streaks" ON learning_streaks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streaks" ON learning_streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON learning_streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

CREATE INDEX IF NOT EXISTS idx_user_challenge_completions_user_id ON user_challenge_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenge_completions_challenge_id ON user_challenge_completions(challenge_id);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_daily_logs_date ON daily_logs(log_date);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_study_sessions_topic ON study_sessions(topic_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(achievement_type);

CREATE INDEX IF NOT EXISTS idx_learning_streaks_user_type ON learning_streaks(user_id, streak_type);

-- Updated triggers for timestamp management
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at 
    BEFORE UPDATE ON daily_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_streaks_updated_at 
    BEFORE UPDATE ON learning_streaks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update learning streaks
CREATE OR REPLACE FUNCTION update_learning_streak(user_id_param UUID, activity_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
DECLARE
    current_streak_record RECORD;
    days_diff INTEGER;
BEGIN
    -- Get current daily streak
    SELECT * INTO current_streak_record 
    FROM learning_streaks 
    WHERE user_id = user_id_param AND streak_type = 'daily';
    
    IF current_streak_record IS NULL THEN
        -- Create new streak record
        INSERT INTO learning_streaks (user_id, streak_type, current_streak, longest_streak, last_activity_date)
        VALUES (user_id_param, 'daily', 1, 1, activity_date);
    ELSE
        -- Calculate days difference
        days_diff := activity_date - current_streak_record.last_activity_date;
        
        IF days_diff = 1 THEN
            -- Consecutive day, increment streak
            UPDATE learning_streaks 
            SET current_streak = current_streak + 1,
                longest_streak = GREATEST(longest_streak, current_streak + 1),
                last_activity_date = activity_date,
                updated_at = NOW()
            WHERE user_id = user_id_param AND streak_type = 'daily';
        ELSIF days_diff = 0 THEN
            -- Same day, no change needed
            NULL;
        ELSE
            -- Streak broken, reset to 1
            UPDATE learning_streaks 
            SET current_streak = 1,
                last_activity_date = activity_date,
                updated_at = NOW()
            WHERE user_id = user_id_param AND streak_type = 'daily';
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
    user_stats RECORD;
    streak_record RECORD;
BEGIN
    -- Get user statistics
    SELECT 
        COUNT(*) as total_sessions,
        SUM(problems_solved) as total_problems,
        SUM(duration_minutes) as total_minutes
    INTO user_stats
    FROM study_sessions 
    WHERE user_id = user_id_param;
    
    -- Get streak information
    SELECT current_streak INTO streak_record
    FROM learning_streaks 
    WHERE user_id = user_id_param AND streak_type = 'daily';
    
    -- Award achievements based on milestones
    
    -- First session achievement
    IF user_stats.total_sessions = 1 THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'first_session', 'Getting Started', 'Completed your first study session!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Problem solving milestones
    IF user_stats.total_problems >= 10 THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'problems_10', 'Problem Solver', 'Solved 10 problems!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF user_stats.total_problems >= 50 THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'problems_50', 'Coding Enthusiast', 'Solved 50 problems!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF user_stats.total_problems >= 100 THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'problems_100', 'Century Club', 'Solved 100 problems!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Study time milestones
    IF user_stats.total_minutes >= 300 THEN -- 5 hours
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'study_5h', 'Dedicated Learner', 'Studied for 5 hours!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF user_stats.total_minutes >= 1200 THEN -- 20 hours
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'study_20h', 'Study Master', 'Studied for 20 hours!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Streak achievements
    IF streak_record.current_streak >= 7 THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'streak_7', 'Week Warrior', 'Maintained a 7-day streak!')
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF streak_record.current_streak >= 30 THEN
        INSERT INTO user_achievements (user_id, achievement_type, achievement_name, achievement_description)
        VALUES (user_id_param, 'streak_30', 'Monthly Master', 'Maintained a 30-day streak!')
        ON CONFLICT DO NOTHING;
    END IF;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Initialize learning streak
    INSERT INTO public.learning_streaks (user_id, streak_type, current_streak, longest_streak)
    VALUES (NEW.id, 'daily', 0, 0);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();