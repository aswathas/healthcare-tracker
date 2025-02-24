'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { showToast } from '@/lib/toast';
import { Heart } from 'lucide-react';
import { format } from 'date-fns';
import ReportTabs from '../components/ReportTabs';

interface Report {
  id: string;
  date: string;
  title: string;
  summary: string;
  details: {
    findings: string[];
    recommendations: string[];
    metrics?: Record<string, number | string>;
    trends?: {
      metric: string;
      trend: 'increasing' | 'decreasing' | 'stable';
      value: number | string;
      previousValue?: number | string;
    }[];
  };
  status: 'normal' | 'attention' | 'critical';
  ai_analysis?: {
    insights: string[];
    recommendations: string[];
    risk_assessment: string;
  };
}

export default function CardiacReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/auth/login';
        return;
      }

      // Sample cardiac report
      const sampleReports: Report[] = [{
        id: '2',
        date: '2025-02-20',
        title: 'Cardiovascular Health Assessment',
        summary: 'Cardiac evaluation shows good heart health with minor recommendations',
        details: {
          findings: [
            'Normal heart rhythm',
            'Blood pressure slightly elevated',
            'Good heart rate variability'
          ],
          recommendations: [
            'Increase aerobic exercise',
            'Reduce sodium intake',
            'Monitor blood pressure weekly'
          ],
          metrics: {
            'Blood Pressure': '128/82 mmHg',
            'Heart Rate': '72 bpm',
            'ECG': 'Normal sinus rhythm'
          },
          trends: [
            {
              metric: 'Systolic BP',
              trend: 'increasing',
              value: 128,
              previousValue: 122
            }
          ]
        },
        status: 'attention',
        ai_analysis: {
          insights: [
            'Slight upward trend in blood pressure',
            'Heart rhythm remains stable',
            'Exercise tolerance is good'
          ],
          recommendations: [
            'Consider lifestyle modifications for BP management',
            'Schedule follow-up in 3 months',
            'Start BP monitoring log'
          ],
          risk_assessment: 'Moderate risk - Blood pressure trending upward'
        }
      }];

      setReports(sampleReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showToast('error', 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'attention':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
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
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-pink-500" />
        <h1 className="text-3xl font-bold">Cardiac Reports</h1>
      </div>

      <ReportTabs activeTab="cardiac" />

      <div className="space-y-6 mt-8">
        {reports.map((report) => (
          <Card key={report.id} className={`p-6 border ${getStatusColor(report.status)}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium">{report.title}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(report.date), 'PPP')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.status === 'normal' ? 'bg-green-100 text-green-800' :
                report.status === 'attention' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{report.summary}</p>

            <div className="space-y-4">
              {report.details.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(report.details.metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">{key}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Key Findings</h4>
                <ul className="list-disc list-inside space-y-1">
                  {report.details.findings.map((finding, index) => (
                    <li key={index} className="text-gray-600">{finding}</li>
                  ))}
                </ul>
              </div>

              {report.details.trends && (
                <div className="space-y-2">
                  <h4 className="font-medium">Trends</h4>
                  <div className="space-y-2">
                    {report.details.trends.map((trend, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className={`${
                          trend.trend === 'increasing' ? 'text-red-500' :
                          trend.trend === 'decreasing' ? 'text-green-500' :
                          'text-blue-500'
                        }`}>
                          {trend.trend === 'increasing' ? '↑' :
                           trend.trend === 'decreasing' ? '↓' : '→'}
                        </span>
                        <span>{trend.metric}: {trend.value}</span>
                        {trend.previousValue && (
                          <span className="text-gray-500 text-sm">
                            (was {trend.previousValue})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.ai_analysis && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-medium text-blue-800">AI Analysis</h4>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-800">Insights:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {report.ai_analysis.insights.map((insight, index) => (
                        <li key={index} className="text-blue-700 text-sm">{insight}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-blue-800">Recommendations:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {report.ai_analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-blue-700 text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-blue-800">Risk Assessment:</p>
                    <p className="text-blue-700 text-sm">{report.ai_analysis.risk_assessment}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
