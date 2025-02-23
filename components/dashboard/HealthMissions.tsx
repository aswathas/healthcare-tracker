'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface Mission {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

interface HealthMissionsProps {
  missions: Mission[];
}

export default function HealthMissions({ missions }: HealthMissionsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Health Missions</h2>
        
        <div className="space-y-4">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-lg ${
                mission.completed ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className={`h-6 w-6 ${
                      mission.completed ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{mission.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{mission.description}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mission.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      Due: {new Date(mission.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {missions.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No health missions available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
