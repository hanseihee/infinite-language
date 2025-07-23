import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      quiz_sessions: {
        Row: {
          id: string
          user_id: string
          score: number
          total_questions: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          total_questions: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          total_questions?: number
          completed_at?: string
          created_at?: string
        }
      }
      user_answers: {
        Row: {
          id: string
          quiz_session_id: string
          question_text: string
          user_answer: string
          correct_answer: string
          is_correct: boolean
          created_at: string
        }
        Insert: {
          id?: string
          quiz_session_id: string
          question_text: string
          user_answer: string
          correct_answer: string
          is_correct: boolean
          created_at?: string
        }
        Update: {
          id?: string
          quiz_session_id?: string
          question_text?: string
          user_answer?: string
          correct_answer?: string
          is_correct?: boolean
          created_at?: string
        }
      }
      sentences: {
        Row: {
          id: string
          sentence_text: string
          target_word: string
          correct_answer: string
          difficulty: string
          created_at: string
        }
        Insert: {
          id?: string
          sentence_text: string
          target_word: string
          correct_answer: string
          difficulty: string
          created_at?: string
        }
        Update: {
          id?: string
          sentence_text?: string
          target_word?: string
          correct_answer?: string
          difficulty?: string
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