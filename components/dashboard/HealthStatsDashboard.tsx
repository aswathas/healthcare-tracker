"use client";

import { MedicalProfile } from '@/types/medical-profile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { 
  Trophy,
  Star,
  Target,
  Award,
  Heart,
  Activity,
  Dumbbell,
  Brain,
  Calendar,
  Pill,
  FileText,
  TrendingUp,
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  profile: MedicalProfile | null;
}

const mockHealthData = [
  { date: '2024-01', score: 65 },
  { date: '2024-02', score: 72 },
  { date: '2024-03', score: 78 },
  { date: '2024-04', score: 75 },
  { date: '2024-05', score: 82 },
  { date: '2024-06', score: 85 },
];

const mockVitals = [
  { name: 'Blood Pressure', value: '120/80', status: 'normal', icon: Heart },
  { name: 'Heart Rate', value: '72 bpm', status: 'normal', icon: Activity },
  { name: 'Blood Sugar', value: '95 mg/dL', status: 'normal', icon: TrendingUp },
  { name: 'SpO2', value: '98%', status: 'normal', icon: Stethoscope },
];

export default function HealthStatsDashboard({ profile }: Props) {
  const calculateLevel = (profile: MedicalProfile | null) => {
    if (!profile) return { score: 0, level: 1, color: 'bg-gray-200', title: 'Novice' };

    let baseScore = 50;
    // Deductions for health conditions
    if (profile.smoking?.is_smoker) {
      baseScore -= 15;
      if (profile.smoking.cigarettes_per_day && profile.smoking.cigarettes_per_day > 10) {
        baseScore -= 10;
      }
    }

    if (profile.cardiac?.has_condition) {
      baseScore -= 10;
      if (profile.cardiac.ccf) baseScore -= 5;
      if (profile.cardiac.valvular_heart_disease) baseScore -= 5;
      if (profile.cardiac.cardiomyopathy) baseScore -= 5;
    }

    if (profile.diabetes?.is_diabetic) {
      baseScore -= 10;
      if (profile.diabetes.on_insulin) baseScore -= 5;
    }

    if (profile.pulmonary?.copd || profile.pulmonary?.asthma) {
      baseScore -= 10;
    }

    if (profile.renal?.dialysis_type) {
      baseScore -= 15;
    }

    if (profile.malignancy) {
      if (profile.malignancy.head_and_neck) baseScore -= 10;
      if (profile.malignancy.lungs) baseScore -= 15;
      if (profile.malignancy.git) baseScore -= 10;
      if (profile.malignancy.brain) baseScore -= 20;
      if (profile.malignancy.renal) baseScore -= 10;
      if (profile.malignancy.blood) baseScore -= 15;
    }

    if (profile.hyperthyroid) baseScore -= 5;
    if (profile.liver_diseases) baseScore -= 10;

    // Ensure score stays within 0-100 range
    baseScore = Math.max(0, Math.min(100, baseScore));

    // Calculate level based on score
    const level = Math.max(1, Math.floor(baseScore / 10));
    let title = 'Novice';
    if (baseScore >= 80) title = 'Health Master';
    else if (baseScore >= 60) title = 'Health Expert';
    else if (baseScore >= 40) title = 'Health Warrior';
    
    return { score: baseScore, level, title, color: 'bg-blue-500' };
  };

  const { score, level, title } = calculateLevel(profile);

  const upcomingAppointments = [
    {
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      date: '2024-03-01',
      time: '10:00 AM',
    },
    {
      doctor: 'Dr. Michael Chen',
      specialty: 'General Physician',
      date: '2024-03-15',
      time: '2:30 PM',
    },
  ];

  const recentMedications = [
    {
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Daily',
      timeLeft: '15 days',
    },
    {
      name: 'Omega-3',
      dosage: '1000mg',
      frequency: 'Daily',
      timeLeft: '20 days',
    },
  ];

  return (
    <div className="p-6 ml-64 bg-gray-50 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Trophy className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">Health Score</p>
                <h3 className="text-2xl font-bold">{score}</h3>
              </div>
            </div>
            <Progress value={score} className="mt-4 bg-white/20" indicatorClassName="bg-white" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Level</p>
                <h3 className="text-2xl font-bold">{level}</h3>
                <p className="text-sm text-gray-500">{title}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Goals Met</p>
                <h3 className="text-2xl font-bold">8/10</h3>
                <p className="text-sm text-green-600">+2 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Achievements</p>
                <h3 className="text-2xl font-bold">12</h3>
                <p className="text-sm text-orange-600">3 new</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Health Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Vitals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVitals.map((vital, index) => {
                const Icon = vital.icon;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{vital.name}</p>
                        <p className="text-xs text-gray-500">{vital.status}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{vital.value}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments and Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Link 
                href="/appointments" 
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Medications</CardTitle>
              <Link 
                href="/medications" 
                className="text-sm text-blue-600 hover:underline"
              >
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMedications.map((medication, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{medication.name}</p>
                      <p className="text-sm text-gray-500">{medication.timeLeft} left</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {medication.dosage} - {medication.frequency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="fixed bottom-6 right-6">
        <div className="flex gap-3">
          <Link
            href="/medical-profile"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Update Profile</span>
          </Link>
          <Link
            href="/ai-doctor"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Brain className="h-5 w-5" />
            <span>Ask AI Doctor</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
