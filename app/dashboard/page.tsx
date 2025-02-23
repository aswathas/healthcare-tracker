'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Heart, Activity, Award, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  maxProgress: number;
  color: string;
}

interface HealthMetric {
  date: string;
  value: number;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const [profileResult, visitsResult] = await Promise.all([
        supabase
          .from('medical_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single(),
        supabase
          .from('doctor_visits')
          .select('*')
          .eq('user_id', session.user.id)
          .order('visit_date', { ascending: false })
      ]);

      if (profileResult.data) {
        setProfile(profileResult.data);
        setHealthScore(profileResult.data.health_score || 0);
        generateAchievements(profileResult.data, visitsResult.data || []);
        generateHealthMetrics(visitsResult.data || []);
      }

      if (visitsResult.data) {
        setVisits(visitsResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAchievements = (profile: any, visits: any[]) => {
    const achievements: Achievement[] = [
      {
        id: 'profile_complete',
        title: 'Profile Master',
        description: 'Complete your medical profile',
        icon: <Trophy className="w-6 h-6" />,
        progress: calculateProfileCompletion(profile),
        maxProgress: 100,
        color: '#FFD700'
      },
      {
        id: 'health_score',
        title: 'Health Champion',
        description: 'Maintain a high health score',
        icon: <Heart className="w-6 h-6" />,
        progress: (profile.health_score || 0) * 100,
        maxProgress: 100,
        color: '#FF6B6B'
      },
      {
        id: 'regular_checkups',
        title: 'Regular Checkups',
        description: 'Complete regular health checkups',
        icon: <Activity className="w-6 h-6" />,
        progress: Math.min(visits.length * 10, 100),
        maxProgress: 100,
        color: '#4ECDC4'
      },
      {
        id: 'health_goals',
        title: 'Goal Setter',
        description: 'Set and achieve health goals',
        icon: <Target className="w-6 h-6" />,
        progress: 60,
        maxProgress: 100,
        color: '#45B7D1'
      }
    ];

    setAchievements(achievements);
  };

  const generateHealthMetrics = (visits: any[]) => {
    const metrics = visits.map(visit => ({
      date: new Date(visit.visit_date).toLocaleDateString(),
      value: Math.random() * 100 // Replace with actual health metrics
    })).slice(0, 10);

    setHealthMetrics(metrics);
  };

  const calculateProfileCompletion = (profile: any) => {
    const requiredFields = [
      'age',
      'sex',
      'blood_type',
      'height',
      'weight',
      'emergency_contact_name',
      'emergency_contact_phone'
    ];

    const completedFields = requiredFields.filter(field => profile[field]);
    return (completedFields.length / requiredFields.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Health Dashboard</h1>

      {/* Health Score */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Overall Health Score</h2>
          <div className="flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-2xl font-bold">{(healthScore * 100).toFixed(1)}%</span>
          </div>
        </div>
        <Progress value={healthScore * 100} className="h-4" />
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className="p-4">
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-full" style={{ backgroundColor: `${achievement.color}20` }}>
                {achievement.icon}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.description}</p>
              </div>
            </div>
            <Progress value={achievement.progress} className="h-2" />
            <p className="text-right text-sm mt-1">
              {achievement.progress.toFixed(0)}%
            </p>
          </Card>
        ))}
      </div>

      {/* Health Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Health Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Health Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Physical', value: 30 },
                    { name: 'Mental', value: 25 },
                    { name: 'Lifestyle', value: 25 },
                    { name: 'Medical', value: 20 }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {achievements.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {visits.slice(0, 5).map((visit: any) => (
            <div key={visit.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold">{visit.doctor_name}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(visit.visit_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
