import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface StudyHistoryEntry {
  id: string;
  user_id: string;
  topic_name: string;
  topic_title: string;
  planned_duration: number;
  actual_duration: number;
  problems_solved: number;
  start_time: string;
  end_time: string;
  completed: boolean;
  overtime_minutes: number;
  created_at: string;
}

export const useStudyHistory = (user: User | null) => {
  const [history, setHistory] = useState<StudyHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error fetching study history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addHistoryEntry = useCallback(async (entry: Omit<StudyHistoryEntry, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('study_sessions')
        .insert({
          user_id: user.id,
          ...entry,
        })
        .select()
        .single();

      if (error) throw error;
      setHistory(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding history entry:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    addHistoryEntry,
    refetch: fetchHistory,
  };
};