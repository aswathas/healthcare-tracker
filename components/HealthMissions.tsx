'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/useToast';

export const HealthMissions = ({ conditions, medications, healthData }: { conditions: any, medications: any, healthData: any }) => {
  const [missions, setMissions] = useState<string[]>([]);
  const { showToast } = useToast();

  const generateMissions = async () => {
    try {
      const response = await fetch('/api/ai-missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          conditions,
          medications,
          lastCbc: healthData?.recent_cbc?.[0]
        })
      });

      // Rate limiting check
      if (response.status === 429) {
        showToast('Too many requests - please wait before generating new missions', 'warning');
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setMissions(data.missions);
      } else {
        showToast('Failed to generate missions: ' + data.error, 'error');
      }
    } catch (error) {
      showToast('AI service unavailable - try again later', 'error');
    }
  };

  useEffect(() => {
    if (conditions?.length > 0) generateMissions();
  }, [conditions]);

  return (
    <div className="space-y-3">
      {missions.length > 0 ? (
        missions.map((mission, index) => (
          <div key={index} className="p-3 bg-blue-50 rounded-lg">
            {mission}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No health missions generated yet</p>
      )}
    </div>
  );
};
