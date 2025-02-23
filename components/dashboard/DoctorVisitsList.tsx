'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface DoctorVisit {
  id: string;
  visit_date: string;
  doctor_name: string;
  specialty: string;
  reason: string;
  diagnosis: string;
  prescription: string;
  follow_up_date: string | null;
}

interface Props {
  userId: string | undefined;
  limit: number;
}

const DoctorVisitsList: React.FC<Props> = ({ userId, limit }) => {
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchVisits = async () => {
      try {
        const { data, error } = await supabase
          .from('doctor_visits')
          .select('*')
          .eq('user_id', userId)
          .order('visit_date', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setVisits(data || []);
      } catch (error) {
        console.error('Error fetching doctor visits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [userId, limit]);

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="mt-2 h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No doctor visits recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <div key={visit.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">Dr. {visit.doctor_name}</h4>
              <p className="text-sm text-gray-600">{visit.specialty}</p>
              {visit.reason && (
                <p className="text-sm text-gray-500 mt-1">{visit.reason}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {new Date(visit.visit_date).toLocaleDateString()}
              </p>
              {visit.follow_up_date && (
                <p className="text-xs text-gray-500 mt-1">
                  Follow-up: {new Date(visit.follow_up_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {(visit.diagnosis || visit.prescription) && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {visit.diagnosis && (
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Diagnosis:</span>{' '}
                  <span className="text-gray-600">{visit.diagnosis}</span>
                </p>
              )}
              {visit.prescription && (
                <p className="text-sm mt-1">
                  <span className="font-medium text-gray-700">Prescription:</span>{' '}
                  <span className="text-gray-600">{visit.prescription}</span>
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DoctorVisitsList;
