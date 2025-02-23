import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type DoctorVisit = Database['public']['Tables']['doctor_visits']['Row']
export type TestResult = Database['public']['Tables']['test_results']['Row']
export type HealthMetrics = Database['public']['Tables']['health_metrics']['Row']

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getProfile(session.user)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        getProfile(session.user)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function getProfile(user: User) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  return {
    user,
    profile,
    loading,
    supabase
  }
}
