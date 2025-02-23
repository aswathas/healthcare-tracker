'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface DoctorVisit {
  visit_date: string;
  doctor_name: string;
  specialty: string;
  hospital_name: string;
  reason: string;
  diagnosis: string;
  prescription: string;
  follow_up_date: string;
  notes: string;
  documents: FileList | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorVisit) => void;
}

export default function DoctorVisitForm({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState<DoctorVisit>({
    visit_date: new Date().toISOString().split('T')[0],
    doctor_name: '',
    specialty: '',
    hospital_name: '',
    reason: '',
    diagnosis: '',
    prescription: '',
    follow_up_date: '',
    notes: '',
    documents: null
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
        <Dialog.Panel className="mx-auto max-w-2xl rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium mb-4">Add Doctor Visit</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Visit Information */}
              <div>
                <label htmlFor="visit_date" className="block text-sm font-medium text-gray-700">
                  Visit Date
                </label>
                <input
                  type="date"
                  id="visit_date"
                  required
                  value={formData.visit_date}
                  onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="follow_up_date" className="block text-sm font-medium text-gray-700">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  id="follow_up_date"
                  value={formData.follow_up_date}
                  onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="doctor_name" className="block text-sm font-medium text-gray-700">
                  Doctor Name
                </label>
                <input
                  type="text"
                  id="doctor_name"
                  required
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Specialty
                </label>
                <input
                  type="text"
                  id="specialty"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="hospital_name" className="block text-sm font-medium text-gray-700">
                  Hospital/Clinic Name
                </label>
                <input
                  type="text"
                  id="hospital_name"
                  required
                  value={formData.hospital_name}
                  onChange={(e) => setFormData({ ...formData, hospital_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Visit
                </label>
                <textarea
                  id="reason"
                  required
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                  Diagnosis
                </label>
                <textarea
                  id="diagnosis"
                  rows={2}
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
                  Prescription/Treatment
                </label>
                <textarea
                  id="prescription"
                  rows={2}
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700">
                  Upload Documents
                </label>
                <input
                  type="file"
                  id="documents"
                  multiple
                  onChange={(e) => setFormData({ ...formData, documents: e.target.files })}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload any relevant documents (prescriptions, test results, etc.)
                </p>
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
                Save Visit
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
