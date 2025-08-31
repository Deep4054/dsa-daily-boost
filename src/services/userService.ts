import { supabase } from '@/integrations/supabase/client';

const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  if (error?.message) {
    throw new Error(error.message);
  }
  throw new Error('An unexpected error occurred');
};
import type { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export class UserService {
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  static async createProfile(profile: UserProfileInsert): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }

  static async updateProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }

  static async addXP(userId: string, xp: number): Promise<void> {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('total_xp')
        .eq('id', userId)
        .single();

      if (profile) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ total_xp: profile.total_xp + xp })
          .eq('id', userId);

        if (error) throw error;
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }
}