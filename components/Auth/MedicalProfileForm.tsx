'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Database } from '@/types/database.types';

type MedicalProfile = Database['public']['Tables']['medical_profiles']['Row'];

interface FormData {
  age: string;
  sex: string;
  hospital_id: string;
  pregnancy: boolean;
  pregnancy_months: string;
  conditions: {
    diabetes: boolean;
    hypertension: boolean;
    heart_disease: boolean;
    other: string;
  };
}

export default function MedicalProfileForm() {
  const { user, supabase } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    sex: '',
    hospital_id: '',
    pregnancy: false,
    pregnancy_months: '',
    conditions: {
      diabetes: false,
      hypertension: false,
      heart_disease: false,
      other: ''
    }
  });

  useEffect(() => {
    if (user) {
      loadExistingProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadExistingProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          age: data.age.toString(),
          sex: data.sex,
          hospital_id: data.hospital_id,
          pregnancy: data.pregnancy,
          pregnancy_months: data.pregnancy_months?.toString() || '',
          conditions: data.conditions as FormData['conditions']
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      const profileData = {
        user_id: user.id,
        age: parseInt(formData.age),
        sex: formData.sex,
        hospital_id: formData.hospital_id,
        pregnancy: formData.pregnancy,
        pregnancy_months: formData.pregnancy ? parseInt(formData.pregnancy_months) : null,
        conditions: formData.conditions
      };

      const { error } = await supabase
        .from('medical_profiles')
        .upsert(profileData);

      if (error) throw error;
      showToast('Medical profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating medical profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">
          Age
        </label>
        <input
          id="age"
          type="number"
          required
          min="1"
          max="150"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          aria-label="Age"
        />
      </div>

      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
          Sex
        </label>
        <select
          id="sex"
          required
          value={formData.sex}
          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          aria-label="Sex"
        >
          <option value="">Select sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="hospital_id" className="block text-sm font-medium text-gray-700">
          Hospital ID
        </label>
        <input
          id="hospital_id"
          type="text"
          required
          value={formData.hospital_id}
          onChange={(e) => setFormData({ ...formData, hospital_id: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          aria-label="Hospital ID"
        />
      </div>

      {formData.sex === 'female' && (
        <>
          <div>
            <label htmlFor="pregnancy" className="block text-sm font-medium text-gray-700">
              Pregnancy Status
            </label>
            <input
              id="pregnancy"
              type="checkbox"
              checked={formData.pregnancy}
              onChange={(e) => setFormData({ ...formData, pregnancy: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label="Pregnancy Status"
            />
          </div>

          {formData.pregnancy && (
            <div>
              <label htmlFor="pregnancy_months" className="block text-sm font-medium text-gray-700">
                Pregnancy Months
              </label>
              <input
                id="pregnancy_months"
                type="number"
                required
                min="0"
                max="9"
                value={formData.pregnancy_months}
                onChange={(e) => setFormData({ ...formData, pregnancy_months: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                aria-label="Pregnancy Months"
              />
            </div>
          )}
        </>
      )}

      <fieldset className="space-y-4">
        <legend className="text-lg font-medium text-gray-900">Medical Conditions</legend>
        
        <div>
          <label htmlFor="diabetes" className="inline-flex items-center">
            <input
              id="diabetes"
              type="checkbox"
              checked={formData.conditions.diabetes}
              onChange={(e) => setFormData({
                ...formData,
                conditions: { ...formData.conditions, diabetes: e.target.checked }
              })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label="Diabetes"
            />
            <span className="ml-2">Diabetes</span>
          </label>
        </div>

        <div>
          <label htmlFor="hypertension" className="inline-flex items-center">
            <input
              id="hypertension"
              type="checkbox"
              checked={formData.conditions.hypertension}
              onChange={(e) => setFormData({
                ...formData,
                conditions: { ...formData.conditions, hypertension: e.target.checked }
              })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label="Hypertension"
            />
            <span className="ml-2">Hypertension</span>
          </label>
        </div>

        <div>
          <label htmlFor="heart_disease" className="inline-flex items-center">
            <input
              id="heart_disease"
              type="checkbox"
              checked={formData.conditions.heart_disease}
              onChange={(e) => setFormData({
                ...formData,
                conditions: { ...formData.conditions, heart_disease: e.target.checked }
              })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label="Heart Disease"
            />
            <span className="ml-2">Heart Disease</span>
          </label>
        </div>

        <div>
          <label htmlFor="other_conditions" className="block text-sm font-medium text-gray-700">
            Other Conditions
          </label>
          <textarea
            id="other_conditions"
            value={formData.conditions.other}
            onChange={(e) => setFormData({
              ...formData,
              conditions: { ...formData.conditions, other: e.target.value }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            aria-label="Other Conditions"
          />
        </div>
      </fieldset>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Medical Profile'}
        </button>
      </div>
    </form>
  );
}
