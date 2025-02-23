'use client';

import { HeartIcon, BriefcaseIcon, BeakerIcon } from '@heroicons/react/24/outline';

interface HealthData {
  conditions: string[];
  medications: string[];
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
}

interface HealthSummaryProps {
  data: HealthData;
}

export default function HealthSummary({ data }: HealthSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Health Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Active Conditions</h3>
            <ul className="space-y-3">
              {data.conditions.map((condition, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <HeartIcon className="h-5 w-5 text-red-500 mr-2" />
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Medications</h3>
            <ul className="space-y-3">
              {data.medications.map((medication, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <BriefcaseIcon className="h-5 w-5 text-blue-500 mr-2" />
                  {medication}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Vitals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Blood Pressure</div>
                <BeakerIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{data.vitals.bloodPressure}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Heart Rate</div>
                <HeartIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{data.vitals.heartRate}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">Temperature</div>
                <BeakerIcon className="h-5 w-5 text-orange-500" />
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{data.vitals.temperature}°F</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-500">O2 Saturation</div>
                <BeakerIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">{data.vitals.oxygenSaturation}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
