import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface ActiveSession {
  id: string;
  user_id: string;
  is_active: boolean;
  current_topic: string | null;
  current_topic_title: string | null;
  start_time: string | null;
  time_left: number;
  timer_duration: number;
  problems_solved: number;
  last_updated: string;
  device_id: string | null;
}

const DEVICE_ID = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useActiveSession = (user: User | null) => {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch active session
  const fetchActiveSession = useCallback(async () => {
    if (!user) {
      setActiveSession(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('active_sessions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setActiveSession(data);
    } catch (error) {
      console.error('Error fetching active session:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update active session
  const updateActiveSession = useCallback(async (updates: Partial<ActiveSession>) => {
    if (!user) return;

    try {
      const { data, error } = await (supabase as any)
        .from('active_sessions')
        .upsert({
          user_id: user.id,
          device_id: DEVICE_ID,
          last_updated: new Date().toISOString(),
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      setActiveSession(data);
    } catch (error) {
      console.error('Error updating active session:', error);
    }
  }, [user]);

  // Start session
  const startSession = useCallback(async (topic: string, topicTitle: string, duration: number) => {
    await updateActiveSession({
      is_active: true,
      current_topic: topic,
      current_topic_title: topicTitle,
      start_time: new Date().toISOString(),
      time_left: duration,
      timer_duration: duration,
      problems_solved: 0,
    });
  }, [updateActiveSession]);

  // Update time left (throttled)
  const updateTimeLeft = useCallback(async (timeLeft: number) => {
    if (!activeSession) return;
    
    // Only update database every 10 seconds to reduce load
    const now = Date.now();
    const lastUpdate = new Date(activeSession.last_updated).getTime();
    if (now - lastUpdate < 10000) {
      // Update local state immediately for smooth UI
      setActiveSession(prev => prev ? { ...prev, time_left: timeLeft } : null);
      return;
    }

    await updateActiveSession({ time_left: timeLeft });
  }, [activeSession, updateActiveSession]);

  // End session
  const endSession = useCallback(async () => {
    await updateActiveSession({
      is_active: false,
      current_topic: null,
      current_topic_title: null,
      start_time: null,
      time_left: 0,
    });
  }, [updateActiveSession]);

  // Update problems solved
  const updateProblemsCount = useCallback(async (count: number) => {
    await updateActiveSession({ problems_solved: count });
  }, [updateActiveSession]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('active_sessions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'active_sessions',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newData = payload.new as ActiveSession;
            // Only update if it's from a different device
            if (newData.device_id !== DEVICE_ID) {
              setActiveSession(newData);
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchActiveSession();
  }, [fetchActiveSession]);

  // Migrate from localStorage on first load
  useEffect(() => {
    if (!user || activeSession || loading) return;

    const localData = localStorage.getItem('dsa-study-session');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.isActive) {
          startSession(
            parsed.currentTopic,
            parsed.currentTopicTitle,
            parsed.timerDuration
          );
          // Update time left if session is ongoing
          if (parsed.timeLeft !== parsed.timerDuration) {
            setTimeout(() => updateTimeLeft(parsed.timeLeft), 1000);
          }
        }
        localStorage.removeItem('dsa-study-session');
      } catch (error) {
        console.error('Error migrating localStorage data:', error);
      }
    }
  }, [user, activeSession, loading, startSession, updateTimeLeft]);

  return {
    activeSession,
    loading,
    startSession,
    endSession,
    updateTimeLeft,
    updateProblemsCount,
    refetch: fetchActiveSession,
  };
};