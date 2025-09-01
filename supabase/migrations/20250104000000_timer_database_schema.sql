-- Create user preferences table
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  default_timer_duration INTEGER DEFAULT 1500,
  break_duration INTEGER DEFAULT 300,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create active sessions table for real-time sync
CREATE TABLE active_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT false,
  current_topic TEXT,
  current_topic_title TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  time_left INTEGER DEFAULT 0,
  timer_duration INTEGER DEFAULT 1500,
  problems_solved INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_id TEXT,
  UNIQUE(user_id)
);

-- Create browser history table
CREATE TABLE browser_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active_time INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE browser_history ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own active sessions" ON active_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own active sessions" ON active_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own browser history" ON browser_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own browser history" ON browser_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX idx_browser_history_user_id ON browser_history(user_id);
CREATE INDEX idx_browser_history_session_id ON browser_history(session_id);

-- Create real-time publication
ALTER PUBLICATION supabase_realtime ADD TABLE active_sessions;