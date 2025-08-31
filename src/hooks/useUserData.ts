import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { dsaTopics } from "@/data/dsaTopics";
import { emailService } from "@/services/emailService";

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  completed: boolean;
  mastery_level: number;
  last_studied: string;
  study_time_minutes: number;
  problems_solved: number;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  topic_id: string;
  duration_minutes: number;
  problems_solved: number;
  session_date: string;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string;
  problems_solved: number;
  study_time_minutes: number;
  created_at: string;
}

export interface UserChallengeCompletion {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  time_taken_minutes: number | null;
}

export interface UserStats {
  totalProblems: number;
  topicsMastered: number;
  totalStudyTime: number;
  challengesCompleted: number;
  weeklyGoals: {
    problemsCompleted: number;
    studyTimeCompleted: number;
    topicsCompleted: number;
  };
}

export const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [challengeCompletions, setChallengeCompletions] = useState<UserChallengeCompletion[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);
      
      // Send welcome email and admin notification for new sign-ins
      if (event === 'SIGNED_IN' && newUser && newUser.email) {
        try {
          // Check if this is a new user (first sign-in)
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', newUser.id)
            .single();
          
          if (!existingProfile) {
            // Send welcome email to user
            await emailService.sendWelcomeEmail(
              newUser.email,
              newUser.user_metadata?.full_name || newUser.email.split('@')[0]
            );
            
            // Send admin notification
            await emailService.sendAdminNotification(
              newUser.email,
              newUser.user_metadata?.full_name || newUser.email.split('@')[0],
              newUser.user_metadata
            );
          }
        } catch (error) {
          console.error('Error sending welcome emails:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Force loading to complete after 2 seconds max
      const timeout = setTimeout(() => {
        console.log('⏰ Forcing loading to complete');
        setLoading(false);
      }, 2000);
      
      fetchUserData().finally(() => {
        clearTimeout(timeout);
      });
    } else {
      resetData();
    }
  }, [user]);

  const resetData = () => {
    setUserProfile(null);
    setUserProgress([]);
    setStudySessions([]);
    setDailyLogs([]);
    setChallengeCompletions([]);
    setUserStats(null);
    setLoading(false);
  };

  const fetchUserData = async () => {
    if (!user) return;

    console.log('📊 Loading user data from localStorage for:', user.email);
    
    // Set basic user profile
    setUserProfile({
      id: user.id,
      user_id: user.id,
      display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    // Load data from localStorage
    const savedProgress = JSON.parse(localStorage.getItem(`progress_${user.id}`) || '[]');
    const savedSessions = JSON.parse(localStorage.getItem(`sessions_${user.id}`) || '[]');
    const savedLogs = JSON.parse(localStorage.getItem(`logs_${user.id}`) || '[]');
    
    setUserProgress(savedProgress);
    setStudySessions(savedSessions);
    setDailyLogs(savedLogs);
    setChallengeCompletions([]);
    
    // Calculate stats from saved data
    const totalProblems = savedProgress.reduce((sum: number, p: any) => sum + (p.problems_solved || 0), 0);
    const totalStudyTime = savedSessions.reduce((sum: number, s: any) => sum + (s.duration_minutes || 0), 0);
    
    setUserStats({
      totalProblems,
      topicsMastered: savedProgress.filter((p: any) => p.mastery_level >= 70).length,
      totalStudyTime,
      challengesCompleted: 0,
      weeklyGoals: {
        problemsCompleted: totalProblems,
        studyTimeCompleted: totalStudyTime,
        topicsCompleted: savedProgress.filter((p: any) => p.completed).length
      }
    });
    
    console.log('✅ User data loaded from localStorage');
    setLoading(false);
  };

  const calculateStats = (progress: UserProgress[], sessions: StudySession[], completions: UserChallengeCompletion[]) => {
    const totalProblems = progress.reduce((sum, p) => sum + p.problems_solved, 0);
    const topicsMastered = progress.filter(p => p.mastery_level >= 70).length;
    const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
    const challengesCompleted = completions.length;

    // Weekly calculations
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyProgress = progress.filter(p => new Date(p.last_studied) >= weekStart);
    const weeklySessions = sessions.filter(s => new Date(s.session_date) >= weekStart);

    setUserStats({
      totalProblems,
      topicsMastered,
      totalStudyTime,
      challengesCompleted,
      weeklyGoals: {
        problemsCompleted: weeklyProgress.reduce((sum, p) => sum + p.problems_solved, 0),
        studyTimeCompleted: weeklySessions.reduce((sum, s) => sum + s.duration_minutes, 0),
        topicsCompleted: weeklyProgress.filter(p => p.completed).length
      }
    });
  };

  const updateProblemStatus = async (topicId: string, status: 'completed' | 'not-completed' | 'saved') => {
    if (!user) return;

    try {
      const savedProgress = JSON.parse(localStorage.getItem(`progress_${user.id}`) || '[]');
      const existingProgress = savedProgress.find((p: any) => p.topic_id === topicId);
      const topic = dsaTopics.find(t => t.id === topicId);
      const maxProblems = topic?.problemsCount || 15;
      
      if (status === 'completed') {
        const newSolved = (existingProgress?.problems_solved || 0) + 1;
        const masteryLevel = Math.min(100, Math.round((newSolved / maxProblems) * 100));
        
        if (existingProgress) {
          existingProgress.problems_solved = newSolved;
          existingProgress.mastery_level = masteryLevel;
          existingProgress.completed = masteryLevel >= 70;
          existingProgress.last_studied = new Date().toISOString();
        } else {
          savedProgress.push({
            id: Date.now().toString(),
            user_id: user.id,
            topic_id: topicId,
            problems_solved: newSolved,
            mastery_level: masteryLevel,
            completed: masteryLevel >= 70,
            last_studied: new Date().toISOString(),
            study_time_minutes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        localStorage.setItem(`progress_${user.id}`, JSON.stringify(savedProgress));
        await fetchUserData();
        console.log('✅ Problem status updated in localStorage');
      }
    } catch (error) {
      console.error('Error updating problem status:', error);
    }
  };

  const updateTopicProgress = async (topicId: string, problemsSolved: number) => {
    if (!user) return;

    try {
      const topic = dsaTopics.find(t => t.id === topicId);
      const maxProblems = topic?.problemsCount || 15;
      const masteryLevel = Math.min(100, Math.round((problemsSolved / maxProblems) * 100));
      
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          topic_id: topicId,
          problems_solved: problemsSolved,
          mastery_level: masteryLevel,
          completed: masteryLevel >= 70,
          last_studied: new Date().toISOString()
        });

      if (error) throw error;
      await fetchUserData();
    } catch (error) {
      console.error('Error updating topic progress:', error);
    }
  };

  const updateStudyTime = async (topicId: string, minutesToAdd: number) => {
    if (!user) return;

    try {
      const existingProgress = userProgress.find(p => p.topic_id === topicId);
      const currentStudyTime = existingProgress?.study_time_minutes || 0;
      
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          topic_id: topicId,
          study_time_minutes: currentStudyTime + minutesToAdd,
          last_studied: new Date().toISOString()
        });

      if (error) throw error;
      await fetchUserData();
    } catch (error) {
      console.error('Error updating study time:', error);
    }
  };

  const addStudySession = async (problemsSolved: number, studyTimeMinutes: number, timerDurationMinutes: number, topicId: string) => {
    if (!user) return;

    try {
      // Save to localStorage
      const newSession = {
        id: Date.now().toString(),
        user_id: user.id,
        topic_id: topicId,
        duration_minutes: studyTimeMinutes,
        problems_solved: problemsSolved,
        session_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      const savedSessions = JSON.parse(localStorage.getItem(`sessions_${user.id}`) || '[]');
      savedSessions.unshift(newSession);
      localStorage.setItem(`sessions_${user.id}`, JSON.stringify(savedSessions));
      
      // Update daily log
      const today = new Date().toISOString().split('T')[0];
      const savedLogs = JSON.parse(localStorage.getItem(`logs_${user.id}`) || '[]');
      const existingLog = savedLogs.find((log: any) => log.log_date === today);
      
      if (existingLog) {
        existingLog.problems_solved += problemsSolved;
        existingLog.study_time_minutes += studyTimeMinutes;
        existingLog.timer_duration_minutes = (existingLog.timer_duration_minutes || 0) + timerDurationMinutes;
        existingLog.overtime_minutes = Math.max(0, existingLog.study_time_minutes - existingLog.timer_duration_minutes);
      } else {
        savedLogs.unshift({
          id: Date.now().toString(),
          user_id: user.id,
          log_date: today,
          problems_solved: problemsSolved,
          study_time_minutes: studyTimeMinutes,
          timer_duration_minutes: timerDurationMinutes,
          overtime_minutes: Math.max(0, studyTimeMinutes - timerDurationMinutes),
          created_at: new Date().toISOString()
        });
      }
      
      localStorage.setItem(`logs_${user.id}`, JSON.stringify(savedLogs));
      
      // Refresh data
      await fetchUserData();
      console.log('✅ Study session saved to localStorage');
    } catch (error) {
      console.error('Error adding study session:', error);
    }
  };

  const addDailyLog = async (problemsSolved: number, studyTimeMinutes: number) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const existingLog = dailyLogs.find(log => log.log_date === today);
      
      if (existingLog) {
        const { error } = await supabase
          .from('daily_logs')
          .update({
            problems_solved: existingLog.problems_solved + problemsSolved,
            study_time_minutes: existingLog.study_time_minutes + studyTimeMinutes
          })
          .eq('id', existingLog.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('daily_logs')
          .insert({
            user_id: user.id,
            log_date: today,
            problems_solved: problemsSolved,
            study_time_minutes: studyTimeMinutes
          });
        
        if (error) throw error;
      }
      
      await fetchUserData();
    } catch (error) {
      console.error('Error adding daily log:', error);
    }
  };

  const completeChallenge = async (challengeId: string, timeTakenMinutes?: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_challenge_completions')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          time_taken_minutes: timeTakenMinutes
        });

      if (error) throw error;
      await fetchUserData();
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return {
    user,
    userProfile,
    userProgress,
    studySessions,
    dailyLogs,
    challengeCompletions,
    userStats,
    loading,
    updateProblemStatus,
    updateTopicProgress,
    updateStudyTime,
    addStudySession,
    addDailyLog,
    completeChallenge,
    updateProfile,
    refetch: fetchUserData
  };
};