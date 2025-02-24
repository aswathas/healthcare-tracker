'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { showToast } from '@/lib/toast';
import { FileText } from 'lucide-react';
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
    imageUrl?: string;
    comparison?: {
      date: string;
      findings: string[];
    };
  };
  status: 'normal' | 'attention' | 'critical';
  ai_analysis?: {
    insights: string[];
    recommendations: string[];
    risk_assessment: string;
  };
}

export default function ImagingReports() {
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

      // Sample imaging reports
      const sampleReports: Report[] = [
        {
          id: '3',
          date: '2025-02-15',
          title: 'Chest X-Ray Results',
          summary: 'Routine chest X-ray shows clear lung fields',
          details: {
            findings: [
              'Clear lung fields bilaterally',
              'Normal heart size',
              'No active disease process identified',
              'Normal bone structure',
              'No pleural effusions'
            ],
            recommendations: [
              'No immediate follow-up needed',
              'Continue annual screening',
              'Report any respiratory symptoms promptly'
            ],
            comparison: {
              date: '2024-02-15',
              findings: [
                'No significant changes from previous examination',
                'Stable cardiac silhouette',
                'Maintained clear lung fields'
              ]
            }
          },
          status: 'normal',
          ai_analysis: {
            insights: [
              'Lung fields are clear of any abnormalities',
              'Heart size and shape are normal',
              'No signs of infection or inflammation',
              'Bone structure shows no degenerative changes'
            ],
            recommendations: [
              'Maintain regular check-ups',
              'Report any respiratory symptoms promptly',
              'Next routine screening in 12 months'
            ],
            risk_assessment: 'Low risk - No abnormalities detected'
          }
        },
        {
          id: '4',
          date: '2025-01-10',
          title: 'MRI Brain Scan',
          summary: 'Routine brain MRI for preventive screening',
          details: {
            findings: [
              'Normal brain parenchyma',
              'No evidence of mass or hemorrhage',
              'Ventricles are normal in size',
              'No midline shift'
            ],
            recommendations: [
              'No follow-up imaging required',
              'Continue regular health check-ups'
            ]
          },
          status: 'normal',
          ai_analysis: {
            insights: [
              'Brain structure appears normal',
              'No signs of abnormal tissue growth',
              'Blood vessels show normal flow patterns'
            ],
            recommendations: [
              'Continue regular check-ups',
              'Maintain healthy lifestyle habits',
              'Report any neurological symptoms promptly'
            ],
            risk_assessment: 'Low risk - Normal brain structure and function'
          }
        }
      ];

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
        <FileText className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Imaging Reports</h1>
      </div>

      <ReportTabs activeTab="imaging" />

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
              <div className="space-y-2">
                <h4 className="font-medium">Key Findings</h4>
                <ul className="list-disc list-inside space-y-1">
                  {report.details.findings.map((finding, index) => (
                    <li key={index} className="text-gray-600">{finding}</li>
                  ))}
                </ul>
              </div>

              {report.details.comparison && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">Comparison with Previous Study</h4>
                  <p className="text-sm text-gray-500">
                    Date: {format(new Date(report.details.comparison.date), 'PPP')}
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {report.details.comparison.findings.map((finding, index) => (
                      <li key={index} className="text-gray-600 text-sm">{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {report.details.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>

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
