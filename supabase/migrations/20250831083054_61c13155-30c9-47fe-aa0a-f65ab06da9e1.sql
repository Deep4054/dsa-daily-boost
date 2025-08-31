-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  last_studied TIMESTAMP WITH TIME ZONE DEFAULT now(),
  study_time_minutes INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create study sessions table
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  problems_solved INTEGER DEFAULT 0,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily challenges table
CREATE TABLE public.daily_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_date DATE NOT NULL DEFAULT CURRENT_DATE,
  topic_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'medium',
  points INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_date)
);

-- Create user challenge completions table
CREATE TABLE public.user_challenge_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  time_taken_minutes INTEGER,
  UNIQUE(user_id, challenge_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for study_sessions
CREATE POLICY "Users can view their own sessions" ON public.study_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON public.study_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for daily_challenges
CREATE POLICY "Everyone can view daily challenges" ON public.daily_challenges
  FOR SELECT USING (true);

-- Create RLS policies for user_challenge_completions
CREATE POLICY "Users can view their own completions" ON public.user_challenge_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions" ON public.user_challenge_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample daily challenge
INSERT INTO public.daily_challenges (topic_id, title, description, difficulty, points)
VALUES ('arrays', 'Two Sum Problem', 'Find two numbers in an array that add up to a target sum', 'easy', 100)
ON CONFLICT (challenge_date) DO NOTHING;