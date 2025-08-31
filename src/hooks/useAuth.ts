import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          const profile = await UserService.getProfile(session.user.id);
          setState({
            user: session.user,
            profile,
            session,
            loading: false,
            error: null
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Authentication error'
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const profile = await UserService.getProfile(session.user.id);
            setState({
              user: session.user,
              profile,
              session,
              loading: false,
              error: null
            });
          } else {
            setState({
              user: null,
              profile: null,
              session: null,
              loading: false,
              error: null
            });
          }
        } catch (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Authentication error'
          }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      
      if (error) throw error;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }));
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      }));
    }
  };

  const refreshProfile = async () => {
    if (!state.user) return;
    
    try {
      const profile = await UserService.getProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh profile'
      }));
    }
  };

  return {
    ...state,
    signInWithGoogle,
    signOut,
    refreshProfile
  };
};