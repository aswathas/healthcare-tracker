'use client';

import { useState, useEffect } from 'react';
import { Card, Button, notification } from 'antd';
import { PlusOutlined, CheckOutlined, BellOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  lastTaken?: string;
}

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const { user } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedications();
    checkNotificationPermission();
    const interval = setupReminders();
    return () => clearInterval(interval);
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission === 'granted');
    }
  };

  const loadMedications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedications(data || []);
    } catch (error) {
      notification.error({
        message: 'Error loading medications',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const setupReminders = () => {
    return setInterval(() => {
      const now = new Date();
      medications.forEach(med => {
        const [hours, minutes] = med.time.split(':');
        const reminderTime = new Date();
        reminderTime.setHours(parseInt(hours), parseInt(minutes), 0);
        
        if (now.getHours() === reminderTime.getHours() && 
            now.getMinutes() === reminderTime.getMinutes() &&
            notificationPermission) {
          new Notification(`Time for ${med.name}`, {
            body: `Dosage: ${med.dosage} | Frequency: ${med.frequency}`,
            icon: '/medicine-icon.png'
          });
        }
      });
    }, 60000);
  };

  const markAsTaken = async (id: string) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('medications')
        .update({ lastTaken: now })
        .eq('id', id);

      if (error) throw error;
      
      setMedications(medications.map(med => 
        med.id === id ? { ...med, lastTaken: now } : med
      ));

      notification.success({
        message: 'Medication marked as taken'
      });
    } catch (error) {
      notification.error({
        message: 'Error updating medication status',
        description: error.message
      });
    }
  };

  const calculateAdherence = (med: Medication) => {
    if (!med.startDate) return 0;
    
    const start = new Date(med.startDate);
    const end = med.endDate ? new Date(med.endDate) : new Date();
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    
    if (totalDays <= 0) return 0;
    
    const lastTaken = med.lastTaken ? new Date(med.lastTaken) : null;
    const daysTaken = lastTaken ? 1 : 0; // Simplified for demonstration
    
    return ((daysTaken / totalDays) * 100).toFixed(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Medication Management</h1>
          <p className="text-gray-600">Track and manage your medications</p>
        </div>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="bg-blue-500"
        >
          Add Medication
        </Button>
      </div>

      {!notificationPermission && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <BellOutlined className="text-yellow-500" />
            <p className="text-yellow-700">
              Enable notifications to receive medication reminders
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medications.map(med => (
          <Card
            key={med.id}
            title={med.name}
            className="shadow-sm hover:shadow-md transition-shadow"
            extra={
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => markAsTaken(med.id)}
                className="bg-green-500"
              >
                Take
              </Button>
            }
          >
            <div className="space-y-3">
              <p><span className="font-semibold">Dosage:</span> {med.dosage}</p>
              <p><span className="font-semibold">Schedule:</span> {med.frequency} at {med.time}</p>
              <p>
                <span className="font-semibold">Adherence:</span>
                <span className={`ml-2 ${
                  parseFloat(calculateAdherence(med)) >= 80 ? 'text-green-600' :
                  parseFloat(calculateAdherence(med)) >= 50 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {calculateAdherence(med)}%
                </span>
              </p>
              {med.lastTaken && (
                <p className="text-sm text-gray-500">
                  Last taken: {new Date(med.lastTaken).toLocaleString()}
                </p>
              )}
              {med.notes && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Notes:</span> {med.notes}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <p>Loading medications...</p>
        </div>
      )}
    </div>
  );
}
