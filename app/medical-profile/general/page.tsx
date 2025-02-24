"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/lib/supabase';
import type { MedicalProfile } from "@/types/medical-profile";
import GeneralMedicalForm from "@/components/medical-profile/GeneralMedicalForm";
import { toast } from "react-hot-toast";

// Define a default profile with all required fields
const defaultProfile: MedicalProfile = {
  user_id: "",
  age: 0,
  sex: "Male",
  height: 0,
  weight: 0,
  blood_type: undefined,
  pregnancy: {
    is_pregnant: false,
    months: undefined
  },
  cardiac: {
    has_condition: false,
    ccf: false,
    valvular_heart_disease: false,
    cardiomyopathy: false
  },
  pulmonary: {
    copd: false,
    asthma: false
  },
  renal: {
    dialysis_type: undefined
  },
  diabetes: {
    is_diabetic: false,
    since: undefined,
    type: undefined,
    on_insulin: false
  },
  smoking: {
    is_smoker: false,
    cigarettes_per_day: 0
  },
  medications: {
    steroids: false,
    lasix: false,
    mannitol: false,
    other: "",
    antihypertension: ""
  },
  malignancy: {
    head_and_neck: false,
    lungs: false,
    git: false,
    brain: false,
    renal: false,
    blood: false
  },
  investigations: {
    hb: false,
    ah: false,
    a: false,
    c: false,
    creatinine: false,
    anp: false,
    bnp: false,
    sodium: false,
    potassium: false
  },
  hyperthyroid: false,
  liver_diseases: ""
};

export default function GeneralMedicalProfilePage() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<MedicalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('medical_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setProfile(data);
      } else {
        // Use the default profile with the current user's ID
        setProfile({
          ...defaultProfile,
          user_id: user.id
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch medical profile');
      toast.error('Failed to fetch medical profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    fetchProfile();
  }, [authLoading, user, router, fetchProfile]);

  const handleUpdateProfile = async (updatedProfile: MedicalProfile) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error: updateError } = await supabase
        .from('medical_profiles')
        .upsert([{ ...updatedProfile, user_id: user.id }]);

      if (updateError) throw updateError;

      setProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 mb-4">Error: {error}</div>
        <button 
          onClick={() => fetchProfile()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No profile data available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Medical Profile</h1>
      <GeneralMedicalForm profile={profile} onSubmit={handleUpdateProfile} />
    </div>
  );
}
