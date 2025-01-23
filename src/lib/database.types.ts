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
      profiles: {
        Row: {
          id: string
          user_id: string
          role: 'student' | 'parent' | 'staff' | 'admin'
          student_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'student' | 'parent' | 'staff' | 'admin'
          student_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'student' | 'parent' | 'staff' | 'admin'
          student_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          daily_allowance: number
          weekly_allowance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          daily_allowance?: number
          weekly_allowance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          daily_allowance?: number
          weekly_allowance?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          wallet_id: string
          type: 'credit' | 'debit'
          amount: number
          location: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wallet_id: string
          type: 'credit' | 'debit'
          amount: number
          location: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          wallet_id?: string
          type?: 'credit' | 'debit'
          amount?: number
          location?: string
          description?: string | null
          created_at?: string
        }
      }
      meal_schedules: {
        Row: {
          id: string
          meal_type: string
          start_time: string
          end_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meal_type: string
          start_time: string
          end_time: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meal_type?: string
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}