'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { format } from 'date-fns';
import { Stethoscope, Plus, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DoctorVisit {
  id: string;
  user_id: string;
  visit_date: string;
  doctor_name: string;
  reason: string;
  diagnosis: string;
  follow_up_date: string;
  notes: string;
  specialty: string;
  prescription: string;
  created_at: string;
  updated_at: string;
}

export default function DoctorVisits() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const toast = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchVisits();
  }, [user]);

  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('doctor_visits')
        .select('*')
        .eq('user_id', user?.id)
        .order('visit_date', { ascending: false });

      if (error) throw error;
      setVisits(data || []);
    } catch (error: any) {
      console.error('Error fetching visits:', error);
      toast('Failed to load doctor visits', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Visits</h1>
        <Button asChild>
          <Link href="/doctor-visits/new" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Visit
          </Link>
        </Button>
      </div>

      {visits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit) => (
            <Card key={visit.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-5 w-5 text-blue-500" />
                    <h3 className="font-medium text-lg">{visit.doctor_name}</h3>
                  </div>
                  {visit.specialty && (
                    <p className="text-blue-600 text-sm mb-2">{visit.specialty}</p>
                  )}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(visit.visit_date), 'PPP')}</span>
                  </div>
                  {visit.reason && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600">Reason</p>
                      <p className="text-sm">{visit.reason}</p>
                    </div>
                  )}
                  {visit.diagnosis && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600">Diagnosis</p>
                      <p className="text-sm">{visit.diagnosis}</p>
                    </div>
                  )}
                  {visit.notes && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600">Notes</p>
                      <p className="text-sm">{visit.notes}</p>
                    </div>
                  )}
                  {visit.prescription && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-600">Prescription</p>
                      <p className="text-sm">{visit.prescription}</p>
                    </div>
                  )}
                  {visit.follow_up_date && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium text-gray-600">Follow-up Date</p>
                      <p className="text-sm text-blue-600">
                        {format(new Date(visit.follow_up_date), 'PPP')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Stethoscope className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Doctor Visits Yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your doctor visits to maintain a complete health record.</p>
          <Button asChild>
            <Link href="/doctor-visits/new" className="flex items-center gap-2 justify-center">
              <Plus className="h-5 w-5" />
              Add Your First Visit
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
