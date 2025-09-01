import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  default_timer_duration: number;
  break_duration: number;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = (user: User | null) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await (supabase as any)
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default preferences
        const { data: newPrefs, error: insertError } = await (supabase as any)
          .from('user_preferences')
          .insert({
            user_id: user.id,
            email_notifications: true,
            default_timer_duration: 1500,
            break_duration: 300,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setPreferences(newPrefs);
      } else {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { data, error } = await (supabase as any)
        .from('user_preferences')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  }, [user, preferences]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    updatePreferences,
    refetch: fetchPreferences,
  };
};