'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Profile } from '@/types';
import { Database } from '@/types/database';

export default function UpdateMedicalProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() => createClientComponentClient<Database>());

  const [formData, setFormData] = useState<Partial<Profile>>({
    age: undefined,
    sex: '',
    hospital_id: '',
    pregnancy: false,
    pregnancy_months: 1,
    cardiac_conditions: {
      hasCondition: false,
      ccf: false,
      valvularDisease: false,
      cardiomyopathy: false,
      arrhythmias: false,
      congenitalHeartDisease: false,
      coronaryArteryDisease: false,
      treatment: {
        medication: '',
        surgery: false,
        lastProcedureDate: ''
      }
    },
    pulmonary_conditions: {
      copd: false,
      asthma: false
    },
    renal_conditions: {
      postTransplant: false,
      dialysis: false,
      justPrior: false,
      immediatePost: false,
      intermittent: false
    },
    medications: {
      steroids: false,
      lasix: false,
      mannitol: false,
      other: ''
    },
    antihypertension_medication: '',
    diabetic: false,
    diabetes_since: '',
    diabetes_type: {
      hb: false,
      a: false,
      c: false
    },
    on_insulin: false,
    smoking: false,
    cigarettes_per_day: undefined,
    malignancies: {
      headAndNeck: false,
      lungs: false,
      git: false,
      brain: false,
      renal: false,
      blood: false
    },
    investigation_markers: {
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
    liver_diseases: ''
  });

  useEffect(() => {
    let mounted = true;

    const loadExistingProfile = async () => {
      try {
        if (!user?.id) {
          console.log('No user ID, redirecting to login');
          router.push('/auth/login');
          return;
        }

        console.log('Loading profile for user:', user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          showToast('Failed to load profile: ' + error.message, 'error');
          return;
        }

        if (!profile) {
          console.log('No profile found, using default values');
          return;
        }

        if (mounted) {
          console.log('Setting form data with profile:', profile);
          setFormData(profile);
          showToast('Profile loaded successfully', 'success');
        }
      } catch (err) {
        console.error('Unexpected error loading profile:', err);
        showToast('An unexpected error occurred', 'error');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadExistingProfile();

    return () => {
      mounted = false;
    };
  }, [user, router, supabase, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      showToast('Profile updated successfully', 'success');
      router.push('/settings');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Loading your medical profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Update Medical Profile</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Settings
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                aria-label="Age"
              />
            </div>

            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
              <select
                id="sex"
                value={formData.sex || ''}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                aria-label="Sex"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="hospital_id" className="block text-sm font-medium text-gray-700">Hospital ID</label>
              <input
                id="hospital_id"
                type="text"
                value={formData.hospital_id || ''}
                onChange={(e) => setFormData({ ...formData, hospital_id: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                aria-label="Hospital ID"
                placeholder="Enter your hospital ID"
              />
            </div>

            <div>
              <label htmlFor="pregnancy" className="block text-sm font-medium text-gray-700">Pregnancy Status</label>
              <div className="mt-1">
                <input
                  id="pregnancy"
                  type="checkbox"
                  checked={formData.pregnancy || false}
                  onChange={(e) => setFormData({ ...formData, pregnancy: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  aria-label="Pregnancy Status"
                />
                <label htmlFor="pregnancy" className="ml-2 text-sm text-gray-700">Currently Pregnant</label>
              </div>
            </div>

            {formData.pregnancy && (
              <div>
                <label htmlFor="pregnancy_months" className="block text-sm font-medium text-gray-700">Pregnancy Duration (months)</label>
                <input
                  id="pregnancy_months"
                  type="number"
                  min="1"
                  max="9"
                  value={formData.pregnancy_months || 1}
                  onChange={(e) => setFormData({ ...formData, pregnancy_months: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  aria-label="Pregnancy Duration in Months"
                />
              </div>
            )}

            {/* Cardiac Conditions */}
            <div>
              <h2 className="text-lg font-medium mb-4">Cardiac Conditions</h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="hasCardiacCondition"
                    type="checkbox"
                    checked={formData.cardiac_conditions?.hasCondition}
                    onChange={(e) => setFormData({
                      ...formData,
                      cardiac_conditions: {
                        ...formData.cardiac_conditions!,
                        hasCondition: e.target.checked
                      }
                    })}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    aria-label="Has Cardiac Condition"
                  />
                  <label htmlFor="hasCardiacCondition" className="ml-2 block text-sm text-gray-700">Has Cardiac Condition</label>
                </div>
                {formData.cardiac_conditions?.hasCondition && (
                  <div className="ml-6 space-y-2">
                    {[
                      {key: 'ccf', label: 'Congestive Cardiac Failure (CCF)'},
                      {key: 'valvularDisease', label: 'Valvular Heart Disease'},
                      {key: 'cardiomyopathy', label: 'Cardiomyopathy'},
                      {key: 'arrhythmias', label: 'Arrhythmias'},
                      {key: 'congenitalHeartDisease', label: 'Congenital Heart Disease'},
                      {key: 'coronaryArteryDisease', label: 'Coronary Artery Disease'}
                    ].map(({key, label}) => (
                      <div key={key} className="flex items-center">
                        <input
                          id={key}
                          type="checkbox"
                          checked={formData.cardiac_conditions?.[key as keyof typeof formData.cardiac_conditions]}
                          onChange={(e) => setFormData({
                            ...formData,
                            cardiac_conditions: {
                              ...formData.cardiac_conditions!,
                              [key]: e.target.checked
                            }
                          })}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          aria-label={label}
                        />
                        <label htmlFor={key} className="ml-2 block text-sm text-gray-700">{label}</label>
                      </div>
                    ))}
                    <div>
                      <label htmlFor="treatmentMedication" className="block text-sm font-medium text-gray-700">Treatment</label>
                      <div className="mt-1 space-y-2">
                        <div>
                          <label htmlFor="treatmentMedication" className="block text-sm font-medium text-gray-700">Medication</label>
                          <input
                            id="treatmentMedication"
                            type="text"
                            value={formData.cardiac_conditions?.treatment?.medication || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              cardiac_conditions: {
                                ...formData.cardiac_conditions!,
                                treatment: {
                                  ...formData.cardiac_conditions!.treatment,
                                  medication: e.target.value
                                }
                              }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            aria-label="Treatment Medication"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            id="treatmentSurgery"
                            type="checkbox"
                            checked={formData.cardiac_conditions?.treatment?.surgery}
                            onChange={(e) => setFormData({
                              ...formData,
                              cardiac_conditions: {
                                ...formData.cardiac_conditions!,
                                treatment: {
                                  ...formData.cardiac_conditions!.treatment,
                                  surgery: e.target.checked
                                }
                              }
                            })}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            aria-label="Treatment Surgery"
                          />
                          <label htmlFor="treatmentSurgery" className="ml-2 block text-sm text-gray-700">Surgery</label>
                        </div>
                        <div>
                          <label htmlFor="lastProcedureDate" className="block text-sm font-medium text-gray-700">Last Procedure Date</label>
                          <input
                            id="lastProcedureDate"
                            type="date"
                            value={formData.cardiac_conditions?.treatment?.lastProcedureDate || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              cardiac_conditions: {
                                ...formData.cardiac_conditions!,
                                treatment: {
                                  ...formData.cardiac_conditions!.treatment,
                                  lastProcedureDate: e.target.value
                                }
                              }
                            })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            aria-label="Last Procedure Date"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
