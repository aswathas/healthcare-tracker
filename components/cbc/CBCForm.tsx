'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

interface CBCFormProps {
  onSubmit: (data: CBCFormData) => Promise<void>;
  initialData?: CBCFormData;
  referenceRanges?: ReferenceRanges;
}

interface ReferenceRanges {
  hemoglobin: { min: number; max: number };
  rbc_count: { min: number; max: number };
  hematocrit: { min: number; max: number };
  wbc_count: { min: number; max: number };
  platelet_count: { min: number; max: number };
}

export interface CBCFormData {
  test_date: string;
  hemoglobin: string;
  rbc_count: string;
  hematocrit: string;
  mcv: string;
  mch: string;
  mchc: string;
  rdw: string;
  wbc_count: string;
  neutrophils_percent: string;
  lymphocytes_percent: string;
  monocytes_percent: string;
  eosinophils_percent: string;
  basophils_percent: string;
  platelet_count: string;
  mpv: string;
  lab_name: string;
  notes: string;
}

const defaultReferenceRanges: ReferenceRanges = {
  hemoglobin: { min: 12, max: 17 },
  rbc_count: { min: 4.0, max: 5.5 },
  hematocrit: { min: 36, max: 48 },
  wbc_count: { min: 4.0, max: 11.0 },
  platelet_count: { min: 150000, max: 450000 }
};

export default function CBCForm({ onSubmit, initialData, referenceRanges = defaultReferenceRanges }: CBCFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<CBCFormData>(initialData || {
    test_date: new Date().toISOString().split('T')[0],
    hemoglobin: '',
    rbc_count: '',
    hematocrit: '',
    mcv: '',
    mch: '',
    mchc: '',
    rdw: '',
    wbc_count: '',
    neutrophils_percent: '',
    lymphocytes_percent: '',
    monocytes_percent: '',
    eosinophils_percent: '',
    basophils_percent: '',
    platelet_count: '',
    mpv: '',
    lab_name: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate against reference ranges
    if (name in referenceRanges) {
      const numValue = parseFloat(value);
      const range = referenceRanges[name as keyof ReferenceRanges];
      if (numValue < range.min || numValue > range.max) {
        showToast(`${name} is outside normal range (${range.min}-${range.max})`, 'warning');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      showToast('CBC results saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save CBC results', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Test Date</label>
          <input
            type="date"
            name="test_date"
            value={formData.test_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lab Name</label>
          <input
            type="text"
            name="lab_name"
            value={formData.lab_name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Red Blood Cell Parameters */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Red Blood Cell Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hemoglobin (g/dL)
                <span className="text-xs text-gray-500 ml-1">
                  ({referenceRanges.hemoglobin.min}-{referenceRanges.hemoglobin.max})
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                name="hemoglobin"
                value={formData.hemoglobin}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                RBC Count (million/µL)
                <span className="text-xs text-gray-500 ml-1">
                  ({referenceRanges.rbc_count.min}-{referenceRanges.rbc_count.max})
                </span>
              </label>
              <input
                type="number"
                step="0.01"
                name="rbc_count"
                value={formData.rbc_count}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hematocrit (%)
                <span className="text-xs text-gray-500 ml-1">
                  ({referenceRanges.hematocrit.min}-{referenceRanges.hematocrit.max})
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                name="hematocrit"
                value={formData.hematocrit}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* White Blood Cell Parameters */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">White Blood Cell Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WBC Count (K/µL)
                <span className="text-xs text-gray-500 ml-1">
                  ({referenceRanges.wbc_count.min}-{referenceRanges.wbc_count.max})
                </span>
              </label>
              <input
                type="number"
                step="0.1"
                name="wbc_count"
                value={formData.wbc_count}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Platelet Parameters */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Platelet Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Platelet Count (K/µL)
                <span className="text-xs text-gray-500 ml-1">
                  ({referenceRanges.platelet_count.min}-{referenceRanges.platelet_count.max})
                </span>
              </label>
              <input
                type="number"
                name="platelet_count"
                value={formData.platelet_count}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save CBC Results
        </button>
      </div>
    </form>
  );
}
