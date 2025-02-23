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
      doctor_visits: {
        Row: {
          id: string
          user_id: string
          date: string
          doctor: string
          hospital: string
          summary: string | null
          documents: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          doctor: string
          hospital: string
          summary?: string | null
          documents?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          doctor?: string
          hospital?: string
          summary?: string | null
          documents?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          user_id: string
          date: string
          test_type: string
          summary: string | null
          values: Json | null
          status: 'normal' | 'abnormal' | 'critical'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          test_type: string
          summary?: string | null
          values?: Json | null
          status?: 'normal' | 'abnormal' | 'critical'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          test_type?: string
          summary?: string | null
          values?: Json | null
          status?: 'normal' | 'abnormal' | 'critical'
          created_at?: string
          updated_at?: string
        }
      }
      medical_profiles: {
        Row: {
          id: string
          user_id: string
          age: number
          sex: string
          hospital_id: string
          pregnancy: boolean
          pregnancy_months: number | null
          conditions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age: number
          sex: string
          hospital_id: string
          pregnancy?: boolean
          pregnancy_months?: number | null
          conditions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number
          sex?: string
          hospital_id?: string
          pregnancy?: boolean
          pregnancy_months?: number | null
          conditions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
          updated_at?: string
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
