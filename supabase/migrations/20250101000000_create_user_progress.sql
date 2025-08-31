-- Create user_progress table for tracking user learning progress
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL,
    problems_solved INTEGER DEFAULT 0,
    mastery_level INTEGER DEFAULT 0,
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON user_progress
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_created_at ON user_progress(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_progress_updated_at 
    BEFORE UPDATE ON user_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
