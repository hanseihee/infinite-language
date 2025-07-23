import { supabase } from './supabase'

export interface QuizSession {
  id?: string
  user_id?: string
  score: number
  total_questions: number
  completed_at?: string
  created_at?: string
}

export interface UserAnswer {
  id?: string
  quiz_session_id: string
  question_text: string
  user_answer: string
  correct_answer: string
  is_correct: boolean
  created_at?: string
}

export interface CachedSentence {
  id?: string
  sentence_text: string
  target_word: string
  correct_answer: string
  difficulty: string
  created_at?: string
}

export class DatabaseService {
  // Quiz Session Management
  static async createQuizSession(session: Omit<QuizSession, 'id' | 'created_at' | 'completed_at'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: session.user_id,
          score: session.score,
          total_questions: session.total_questions,
        })
        .select('id')
        .single()

      if (error) {
        console.error('Error creating quiz session:', error)
        return null
      }

      return data.id
    } catch (error) {
      console.error('Error creating quiz session:', error)
      return null
    }
  }

  static async updateQuizSession(sessionId: string, score: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('quiz_sessions')
        .update({ 
          score,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (error) {
        console.error('Error updating quiz session:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating quiz session:', error)
      return false
    }
  }

  static async getQuizSession(sessionId: string): Promise<QuizSession | null> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (error) {
        console.error('Error fetching quiz session:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching quiz session:', error)
      return null
    }
  }

  static async getUserQuizSessions(userId: string): Promise<QuizSession[]> {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user quiz sessions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user quiz sessions:', error)
      return []
    }
  }

  // User Answer Management
  static async saveUserAnswer(answer: Omit<UserAnswer, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_answers')
        .insert({
          quiz_session_id: answer.quiz_session_id,
          question_text: answer.question_text,
          user_answer: answer.user_answer,
          correct_answer: answer.correct_answer,
          is_correct: answer.is_correct,
        })

      if (error) {
        console.error('Error saving user answer:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error saving user answer:', error)
      return false
    }
  }

  static async getQuizAnswers(sessionId: string): Promise<UserAnswer[]> {
    try {
      const { data, error } = await supabase
        .from('user_answers')
        .select('*')
        .eq('quiz_session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching quiz answers:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching quiz answers:', error)
      return []
    }
  }

  // Sentence Caching
  static async cacheSentence(sentence: Omit<CachedSentence, 'id' | 'created_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sentences')
        .insert({
          sentence_text: sentence.sentence_text,
          target_word: sentence.target_word,
          correct_answer: sentence.correct_answer,
          difficulty: sentence.difficulty,
        })

      if (error) {
        console.error('Error caching sentence:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error caching sentence:', error)
      return false
    }
  }

  static async getCachedSentences(difficulty: string, limit: number = 10): Promise<CachedSentence[]> {
    try {
      const { data, error } = await supabase
        .from('sentences')
        .select('*')
        .eq('difficulty', difficulty)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching cached sentences:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching cached sentences:', error)
      return []
    }
  }

  // User Management
  static async createUser(userId: string, email: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
        })

      if (error) {
        console.error('Error creating user:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error creating user:', error)
      return false
    }
  }

  static async getUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  // Statistics
  static async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('score, total_questions, completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)

      if (error) {
        console.error('Error fetching user stats:', error)
        return null
      }

      if (!data || data.length === 0) {
        return {
          totalQuizzes: 0,
          averageScore: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          accuracy: 0
        }
      }

      const totalQuizzes = data.length
      const totalQuestions = data.reduce((sum, session) => sum + session.total_questions, 0)
      const totalCorrect = data.reduce((sum, session) => sum + session.score, 0)
      const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0
      const averageScore = totalQuizzes > 0 ? totalCorrect / totalQuizzes : 0

      return {
        totalQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        totalQuestions,
        totalCorrect,
        accuracy: Math.round(accuracy * 100) / 100
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return null
    }
  }
}