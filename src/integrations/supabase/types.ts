export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          study_streak: number
          total_xp: number
          weekly_goal_problems: number
          weekly_goal_hours: number
          weekly_goal_topics: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          study_streak?: number
          total_xp?: number
          weekly_goal_problems?: number
          weekly_goal_hours?: number
          weekly_goal_topics?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          study_streak?: number
          total_xp?: number
          weekly_goal_problems?: number
          weekly_goal_hours?: number
          weekly_goal_topics?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          problems_solved: number
          problems_saved: number
          mastery_level: number
          status: 'not_started' | 'in_progress' | 'completed'
          last_practiced: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          problems_solved?: number
          problems_saved?: number
          mastery_level?: number
          status?: 'not_started' | 'in_progress' | 'completed'
          last_practiced?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          problems_solved?: number
          problems_saved?: number
          mastery_level?: number
          status?: 'not_started' | 'in_progress' | 'completed'
          last_practiced?: string
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          duration_minutes: number
          problems_attempted: number
          problems_solved: number
          session_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          duration_minutes?: number
          problems_attempted?: number
          problems_solved?: number
          session_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic_id?: string
          duration_minutes?: number
          problems_attempted?: number
          problems_solved?: number
          session_date?: string
          created_at?: string
        }
      }
      daily_challenges: {
        Row: {
          id: string
          user_id: string
          challenge_date: string
          topic_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_date?: string
          topic_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_date?: string
          topic_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}