"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SurgicalMarkers } from '@/types/surgical-markers';
import { calculateSurgicalScores } from '@/utils/calculateSurgicalScores';
import { useToast } from '@/hooks/useToast';

interface Props {
  initialData?: SurgicalMarkers;
  onSuccess?: () => void;
}

const SurgicalMarkersForm: React.FC<Props> = ({ initialData, onSuccess }) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<SurgicalMarkers>>(
    initialData || {
      assessment_date: new Date().toISOString().split('T')[0]
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : name === 'assessment_date' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const scores = calculateSurgicalScores(formData as SurgicalMarkers);
      const dataToSave = {
        ...formData,
        ...scores,
        user_id: user.id
      };

      const { error } = initialData?.id
        ? await supabase
            .from('surgical_markers')
            .update(dataToSave)
            .eq('id', initialData.id)
        : await supabase
            .from('surgical_markers')
            .insert([dataToSave]);

      if (error) throw error;

      showToast(
        initialData?.id
          ? 'Surgical markers updated successfully'
          : 'Surgical markers saved successfully',
        'success'
      );
      
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('Error saving surgical markers:', error);
      showToast('Error saving surgical markers', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Surgical Readiness Assessment</h2>
        
        {/* Assessment Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Date
          </label>
          <input
            type="date"
            name="assessment_date"
            value={formData.assessment_date || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {/* Cardiac Function */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cardiac Function</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ECG Status
              </label>
              <select
                name="ecg_status"
                value={formData.ecg_status || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select status</option>
                <option value="normal">Normal</option>
                <option value="abnormal">Abnormal</option>
                <option value="borderline">Borderline</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                name="heart_rate"
                value={formData.heart_rate || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="60-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ejection Fraction (%)
              </label>
              <input
                type="number"
                name="ejection_fraction"
                value={formData.ejection_fraction || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="50-70"
              />
            </div>
          </div>
        </div>

        {/* Pulmonary Function */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pulmonary Function</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Oxygen Saturation (%)
              </label>
              <input
                type="number"
                name="oxygen_saturation"
                value={formData.oxygen_saturation || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="95-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FEV1 (L)
              </label>
              <input
                type="number"
                name="fev1"
                value={formData.fev1 || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* Hematological Profile */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hematological Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hemoglobin (g/dL)
              </label>
              <input
                type="number"
                name="hemoglobin"
                value={formData.hemoglobin || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WBC Count
              </label>
              <input
                type="number"
                name="wbc_count"
                value={formData.wbc_count || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platelet Count
              </label>
              <input
                type="number"
                name="platelet_count"
                value={formData.platelet_count || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Risk Scores */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ASA Score (1-6)
              </label>
              <select
                name="asa_score"
                value={formData.asa_score || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select ASA score</option>
                {[1, 2, 3, 4, 5, 6].map(score => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RCRI Score (0-6)
              </label>
              <select
                name="rcri_score"
                value={formData.rcri_score || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select RCRI score</option>
                {[0, 1, 2, 3, 4, 5, 6].map(score => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Saving...' : 'Save Markers'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SurgicalMarkersForm;
