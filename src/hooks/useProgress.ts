import { useState, useEffect } from 'react';
import { ProgressService } from '@/services/progressService';
import { UserService } from '@/services/userService';
import { useAuth } from './useAuth';
import type { Database } from '@/integrations/supabase/types';

type UserProgress = Database['public']['Tables']['user_progress']['Row'];

interface ProgressStats {
  totalProblems: number;
  topicsMastered: number;
  currentStreak: number;
  totalXP: number;
  weeklyGoals: {
    problemsTarget: number;
    problemsCompleted: number;
    hoursTarget: number;
    hoursCompleted: number;
    topicsTarget: number;
    topicsCompleted: number;
  };
}

export const useProgress = () => {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    if (!user) {
      setProgress([]);
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const progressData = await ProgressService.getUserProgress(user.id);
      setProgress(progressData);

      // Calculate stats
      const totalProblems = progressData.reduce((sum, p) => sum + p.problems_solved, 0);
      const topicsMastered = progressData.filter(p => p.mastery_level >= 70).length;
      
      const weeklyProblems = calculateWeeklyProblems(progressData);
      const weeklyHours = Math.round(calculateWeeklyStudyTime(progressData) / 60);

      setStats({
        totalProblems,
        topicsMastered,
        currentStreak: profile?.study_streak || 0,
        totalXP: profile?.total_xp || 0,
        weeklyGoals: {
          problemsTarget: profile?.weekly_goal_problems || 20,
          problemsCompleted: weeklyProblems,
          hoursTarget: profile?.weekly_goal_hours || 15,
          hoursCompleted: weeklyHours,
          topicsTarget: profile?.weekly_goal_topics || 2,
          topicsCompleted: topicsMastered
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user, profile]);

  const updateProblemStatus = async (
    topicId: string,
    status: 'completed' | 'not-completed' | 'saved'
  ) => {
    if (!user) return;

    try {
      await ProgressService.updateProblemStatus(user.id, topicId, status);
      
      // Add XP for completed problems
      if (status === 'completed') {
        await UserService.addXP(user.id, 10);
      }
      
      // Refresh data
      await fetchProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
    }
  };

  const resetProgress = async (topicId: string) => {
    if (!user) return;

    try {
      await ProgressService.resetProgress(user.id, topicId);
      await fetchProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset progress');
    }
  };

  return {
    progress,
    stats,
    loading,
    error,
    updateProblemStatus,
    resetProgress,
    refetch: fetchProgress
  };
};

// Helper functions
const calculateWeeklyProblems = (progress: UserProgress[]): number => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  return progress
    .filter(p => new Date(p.last_practiced) >= weekStart)
    .reduce((sum, p) => sum + p.problems_solved, 0);
};

const calculateWeeklyStudyTime = (progress: UserProgress[]): number => {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  
  return progress
    .filter(p => new Date(p.last_practiced) >= weekStart)
    .reduce((sum, p) => sum + (p.problems_solved * 10), 0);
};