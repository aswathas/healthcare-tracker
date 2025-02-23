'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface CBCResult {
  test_date: string;
  // Red Blood Cell Parameters
  rbc_count: string;
  hemoglobin: string;
  hematocrit: string;
  mcv: string;
  mch: string;
  mchc: string;
  rdw: string;
  
  // White Blood Cell Parameters
  wbc_count: string;
  neutrophils_percent: string;
  lymphocytes_percent: string;
  monocytes_percent: string;
  eosinophils_percent: string;
  basophils_percent: string;
  
  // Platelet Parameters
  platelet_count: string;
  mpv: string;
  
  // Cancer Information
  cancer_type: string;
  cancer_stage: string;
  
  notes: string;
  lab_name: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CBCResult) => void;
}

export default function CBCResultForm({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<CBCResult>({
    test_date: new Date().toISOString().split('T')[0],
    rbc_count: '',
    hemoglobin: '',
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
    cancer_type: '',
    cancer_stage: '',
    notes: '',
    lab_name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Add CBC Result</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <label htmlFor="test_date" className="block text-sm font-medium text-gray-700">
                  Test Date
                </label>
                <input
                  type="date"
                  id="test_date"
                  required
                  value={formData.test_date}
                  onChange={(e) => setFormData({ ...formData, test_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="lab_name" className="block text-sm font-medium text-gray-700">
                  Laboratory Name
                </label>
                <input
                  type="text"
                  id="lab_name"
                  required
                  value={formData.lab_name}
                  onChange={(e) => setFormData({ ...formData, lab_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Red Blood Cell Parameters */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Red Blood Cell Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="rbc_count" className="block text-sm font-medium text-gray-700">
                      RBC Count (M/µL)
                    </label>
                    <input
                      type="number"
                      id="rbc_count"
                      step="0.01"
                      required
                      value={formData.rbc_count}
                      onChange={(e) => setFormData({ ...formData, rbc_count: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="hemoglobin" className="block text-sm font-medium text-gray-700">
                      Hemoglobin (g/dL)
                    </label>
                    <input
                      type="number"
                      id="hemoglobin"
                      step="0.1"
                      required
                      value={formData.hemoglobin}
                      onChange={(e) => setFormData({ ...formData, hemoglobin: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="hematocrit" className="block text-sm font-medium text-gray-700">
                      Hematocrit (%)
                    </label>
                    <input
                      type="number"
                      id="hematocrit"
                      step="0.1"
                      required
                      value={formData.hematocrit}
                      onChange={(e) => setFormData({ ...formData, hematocrit: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* White Blood Cell Parameters */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-3">White Blood Cell Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="wbc_count" className="block text-sm font-medium text-gray-700">
                      WBC Count (K/µL)
                    </label>
                    <input
                      type="number"
                      id="wbc_count"
                      step="0.01"
                      required
                      value={formData.wbc_count}
                      onChange={(e) => setFormData({ ...formData, wbc_count: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="neutrophils" className="block text-sm font-medium text-gray-700">
                      Neutrophils (%)
                    </label>
                    <input
                      type="number"
                      id="neutrophils"
                      step="0.1"
                      required
                      value={formData.neutrophils_percent}
                      onChange={(e) => setFormData({ ...formData, neutrophils_percent: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lymphocytes" className="block text-sm font-medium text-gray-700">
                      Lymphocytes (%)
                    </label>
                    <input
                      type="number"
                      id="lymphocytes"
                      step="0.1"
                      required
                      value={formData.lymphocytes_percent}
                      onChange={(e) => setFormData({ ...formData, lymphocytes_percent: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Platelet Parameters */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Platelet Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="platelet_count" className="block text-sm font-medium text-gray-700">
                      Platelet Count (K/µL)
                    </label>
                    <input
                      type="number"
                      id="platelet_count"
                      required
                      value={formData.platelet_count}
                      onChange={(e) => setFormData({ ...formData, platelet_count: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="mpv" className="block text-sm font-medium text-gray-700">
                      MPV (fL)
                    </label>
                    <input
                      type="number"
                      id="mpv"
                      step="0.1"
                      required
                      value={formData.mpv}
                      onChange={(e) => setFormData({ ...formData, mpv: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Cancer Information */}
              <div className="col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Cancer Information (if applicable)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cancer_type" className="block text-sm font-medium text-gray-700">
                      Cancer Type
                    </label>
                    <input
                      type="text"
                      id="cancer_type"
                      value={formData.cancer_type}
                      onChange={(e) => setFormData({ ...formData, cancer_type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="cancer_stage" className="block text-sm font-medium text-gray-700">
                      Cancer Stage
                    </label>
                    <input
                      type="text"
                      id="cancer_stage"
                      value={formData.cancer_stage}
                      onChange={(e) => setFormData({ ...formData, cancer_stage: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save CBC Result
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
