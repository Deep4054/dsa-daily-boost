import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { dsaTopics } from "@/data/dsaTopics";
import { emailService } from "@/services/emailService";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  preferred_difficulty?: 'Easy' | 'Medium' | 'Hard';
  daily_goal_problems?: number;
  daily_goal_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  topic_id: string;
  problems_solved: number;
  mastery_level: number;
  completed: boolean;
  last_studied: string;
  created_at: string;
  updated_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  topic_id: string;
  study_time_minutes: number;
  timer_duration_minutes: number;
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
  timer_duration_minutes: number;
  overtime_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface UserChallengeCompletion {
  id: string;
  user_id: string;
  challenge_id: string;
  time_taken_minutes?: number;
  completed_at: string;
  created_at: string;
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

// Add error state
interface UseUserDataReturn {
  user: User | null;
  userProfile: UserProfile | null;
  userProgress: UserProgress[];
  studySessions: StudySession[];
  dailyLogs: DailyLog[];
  challengeCompletions: UserChallengeCompletion[];
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
  updateProblemStatus: (topicId: string, status: 'completed' | 'not-completed' | 'saved') => Promise<void>;
  addStudySession: (problemsSolved: number, studyTimeMinutes: number, timerDurationMinutes: number, topicId: string) => Promise<void>;
  completeChallenge: (challengeId: string, timeTakenMinutes?: number) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useUserData = (): UseUserDataReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [challengeCompletions, setChallengeCompletions] = useState<UserChallengeCompletion[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized reset function
  const resetData = useCallback(() => {
    setUserProfile(null);
    setUserProgress([]);
    setStudySessions([]);
    setDailyLogs([]);
    setChallengeCompletions([]);
    setUserStats(null);
    setError(null);
    setLoading(false);
  }, []);

  // Memoized function to calculate user stats
  const calculateUserStats = useCallback((
    progressData: UserProgress[],
    logsData: DailyLog[],
    completionsData: UserChallengeCompletion[]
  ): UserStats => {
    const totalProblems = progressData.reduce((sum, p) => sum + p.problems_solved, 0);
    const topicsMastered = progressData.filter(p => p.mastery_level >= 70).length;
    const totalStudyTime = logsData.reduce((sum, log) => sum + log.study_time_minutes, 0);

    // Calculate weekly goals (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentLogs = logsData.filter(log => new Date(log.log_date) >= oneWeekAgo);
    const recentProgress = progressData.filter(progress =>
      new Date(progress.updated_at) >= oneWeekAgo
    );

    return {
      totalProblems,
      topicsMastered,
      totalStudyTime,
      challengesCompleted: completionsData.length,
      weeklyGoals: {
        problemsCompleted: recentLogs.reduce((sum, log) => sum + log.problems_solved, 0),
        studyTimeCompleted: recentLogs.reduce((sum, log) => sum + log.study_time_minutes, 0),
        topicsCompleted: recentProgress.filter(p => p.mastery_level >= 70).length,
      }
    };
  }, []);

  // Memoized function to fetch user data
  const fetchUserData = useCallback(async () => {
    if (!user) {
      resetData();
      return;
    }

    setLoading(true);
    setError(null);
    console.log('📊 Fetching user data from Supabase for:', user.email);

    try {
      const [
        profileRes,
        progressRes,
        sessionsRes,
        logsRes,
        completionsRes
      ] = await Promise.allSettled([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('user_progress').select('*').eq('user_id', user.id),
        supabase.from('study_sessions').select('*').eq('user_id', user.id).order('session_date', { ascending: false }),
        supabase.from('daily_logs').select('*').eq('user_id', user.id).order('log_date', { ascending: false }),
        supabase.from('user_challenge_completions').select('*').eq('user_id', user.id)
      ]);

      // Handle each response with proper error checking
      const handleResponse = <T>(response: PromiseSettledResult<{ data: T | null; error: any }>) => {
        if (response.status === 'rejected') throw response.reason;
        if (response.value.error) throw response.value.error;
        return response.value.data || ([] as unknown as T);
      };

      const profileData = handleResponse(profileRes) as UserProfile | null;
      const progressData = handleResponse(progressRes) as UserProgress[];
      const sessionsData = handleResponse(sessionsRes) as StudySession[];
      const logsData = handleResponse(logsRes) as DailyLog[];
      const completionsData = handleResponse(completionsRes) as UserChallengeCompletion[];

      setUserProfile(profileData);
      setUserProgress(progressData);
      setStudySessions(sessionsData);
      setDailyLogs(logsData);
      setChallengeCompletions(completionsData);
      setUserStats(calculateUserStats(progressData, logsData, completionsData));

      console.log('✅ User data loaded from Supabase');
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch user data');
      resetData();
    } finally {
      setLoading(false);
    }
  }, [user, resetData, calculateUserStats]);

  // Auth state change handler
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      setUser(newUser);

      if (event === 'SIGNED_IN' && newUser && newUser.email) {
        try {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', newUser.id)
            .single();

          if (!existingProfile) {
            await Promise.allSettled([
              emailService.sendWelcomeEmail(
                newUser.email,
                newUser.user_metadata?.full_name || newUser.email.split('@')[0]
              ),
              emailService.sendAdminNotification(
                newUser.email,
                newUser.user_metadata?.full_name || newUser.email.split('@')[0],
                newUser.user_metadata
              )
            ]);
          }
        } catch (error) {
          console.error('Error sending welcome emails:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when user changes
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const timeout = setTimeout(() => {
          console.log('⏰ Forcing loading to complete');
          setLoading(false);
        }, 2000);

        await fetchUserData();
        clearTimeout(timeout);
      } else {
        resetData();
      }
    };

    loadData();
  }, [user, fetchUserData, resetData]);

  // Helper to upsert daily log entries
  const upsertDailyLog = useCallback(async (updates: {
    problems_solved?: number;
    study_time_minutes?: number;
    timer_duration_minutes?: number;
    overtime_minutes?: number;
  }) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { data: existingLog, error: fetchError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingLog) {
        const { error: updateError } = await supabase
          .from('daily_logs')
          .update({
            problems_solved: (existingLog as any).problems_solved + (updates.problems_solved || 0),
            study_time_minutes: (existingLog as any).study_time_minutes + (updates.study_time_minutes || 0),
            timer_duration_minutes: (existingLog as any).timer_duration_minutes + (updates.timer_duration_minutes || 0),
            overtime_minutes: (existingLog as any).overtime_minutes + (updates.overtime_minutes || 0),
            updated_at: new Date().toISOString(),
          } as any)
          .eq('id', (existingLog as any).id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('daily_logs')
          .insert({
            user_id: user.id,
            log_date: today,
            ...updates,
          } as any);
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error upserting daily log:', error);
      throw error;
    }
  }, [user]);

  const updateProblemStatus = useCallback(async (topicId: string, status: 'completed' | 'not-completed' | 'saved') => {
    if (!user || status !== 'completed') return;

    try {
      const topic = dsaTopics.find(t => t.id === topicId);
      const maxProblems = topic?.problemsCount || 15;

      const { data: existingProgress, error: fetchProgressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('topic_id', topicId)
        .single();

      if (fetchProgressError && fetchProgressError.code !== 'PGRST116') throw fetchProgressError;

      const newSolved = ((existingProgress as any)?.problems_solved || 0) + 1;
      const masteryLevel = Math.min(100, Math.round((newSolved / maxProblems) * 100));

      const { error: progressError } = await supabase.from('user_progress').upsert({
        user_id: user.id,
        topic_id: topicId,
        problems_solved: newSolved,
        mastery_level: masteryLevel,
        completed: masteryLevel >= 70,
        last_studied: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any);
      if (progressError) throw progressError;

      await upsertDailyLog({ problems_solved: 1 });
      await fetchUserData();

      console.log('✅ Problem status updated in Supabase');
    } catch (error) {
      console.error('Error updating problem status:', error);
      setError('Failed to update problem status');
    }
  }, [user, upsertDailyLog, fetchUserData]);

  const addStudySession = useCallback(async (problemsSolved: number, studyTimeMinutes: number, timerDurationMinutes: number, topicId: string) => {
    if (!user) return;

    try {
      const { error: sessionError } = await supabase.from('study_sessions').insert({
        user_id: user.id,
        topic_id: topicId,
        study_time_minutes: studyTimeMinutes,
        timer_duration_minutes: timerDurationMinutes,
        problems_solved: problemsSolved,
        session_date: new Date().toISOString(),
      } as any);
      if (sessionError) throw sessionError;

      const sessionOvertime = Math.max(0, studyTimeMinutes - timerDurationMinutes);
      await upsertDailyLog({
        problems_solved: problemsSolved,
        study_time_minutes: studyTimeMinutes,
        timer_duration_minutes: timerDurationMinutes,
        overtime_minutes: sessionOvertime,
      });

      await fetchUserData();
      console.log('✅ Study session saved to Supabase');
    } catch (error) {
      console.error('Error adding study session:', error);
      setError('Failed to save study session');
    }
  }, [user, upsertDailyLog, fetchUserData]);

  const completeChallenge = useCallback(async (challengeId: string, timeTakenMinutes?: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_challenge_completions')
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          time_taken_minutes: timeTakenMinutes,
          completed_at: new Date().toISOString(),
        } as any);

      if (error) throw error;
      await fetchUserData();
    } catch (error) {
      console.error('Error completing challenge:', error);
      setError('Failed to complete challenge');
    }
  }, [user, fetchUserData]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  }, [user, fetchUserData]);

  return {
    user,
    userProfile,
    userProgress,
    studySessions,
    dailyLogs,
    challengeCompletions,
    userStats,
    loading,
    error,
    updateProblemStatus,
    addStudySession,
    completeChallenge,
    updateProfile,
    refetch: fetchUserData
  };
};