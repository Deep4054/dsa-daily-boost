import { supabase } from '@/integrations/supabase/client';

const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  if (error?.message) {
    throw new Error(error.message);
  }
  throw new Error('An unexpected error occurred');
};
import type { Database } from '@/integrations/supabase/types';

type UserProgress = Database['public']['Tables']['user_progress']['Row'];
type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert'];
type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update'];

export class ProgressService {
  static async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  static async getTopicProgress(userId: string, topicId: string): Promise<UserProgress | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  static async updateProgress(
    userId: string, 
    topicId: string, 
    updates: Partial<UserProgressUpdate>
  ): Promise<UserProgress> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          topic_id: topicId,
          ...updates,
          last_practiced: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }

  static async updateProblemStatus(
    userId: string,
    topicId: string,
    status: 'completed' | 'not-completed' | 'saved'
  ): Promise<UserProgress> {
    try {
      const existing = await this.getTopicProgress(userId, topicId);
      
      let updates: Partial<UserProgressUpdate> = {};
      
      if (status === 'completed') {
        const newSolved = (existing?.problems_solved || 0) + 1;
        updates = {
          problems_solved: newSolved,
          mastery_level: Math.min(100, Math.round((newSolved / 15) * 100)),
          status: 'in_progress'
        };
      } else if (status === 'saved') {
        updates = {
          problems_saved: (existing?.problems_saved || 0) + 1,
          mastery_level: Math.max(existing?.mastery_level || 0, 10),
          status: 'in_progress'
        };
      }

      return await this.updateProgress(userId, topicId, updates);
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }

  static async resetProgress(userId: string, topicId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('topic_id', topicId);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
}