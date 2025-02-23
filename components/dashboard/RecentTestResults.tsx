'use client';

import { BeakerIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface TestResult {
  id: number;
  type: string;
  value: string;
  unit: string;
  date: string;
  status: 'normal' | 'elevated' | 'low';
}

interface RecentTestResultsProps {
  results: TestResult[];
}

export default function RecentTestResults({ results }: RecentTestResultsProps) {
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'elevated':
        return <ChevronUpIcon className="h-5 w-5 text-red-500" />;
      case 'low':
        return <ChevronDownIcon className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'elevated':
        return 'text-red-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Test Results</h2>
        
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BeakerIcon className="h-6 w-6 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(result.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-semibold ${getStatusColor(result.status)}`}>
                    {result.value} {result.unit}
                  </span>
                  {getStatusIcon(result.status)}
                </div>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No recent test results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
