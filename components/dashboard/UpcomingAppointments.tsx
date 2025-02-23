'use client';

import { CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

export default function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Appointments</h2>
        
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.doctorName}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                  <div className="mt-1">
                    <p className="text-sm text-gray-500 flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {appointment.specialty}
                    </p>
                    <p className="mt-1 text-sm text-gray-500 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {appointment.location}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
