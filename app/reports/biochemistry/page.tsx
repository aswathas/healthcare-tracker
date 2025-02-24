'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { showToast } from '@/lib/toast';
import { Activity } from 'lucide-react';
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
    normal_ranges?: Record<string, { min: number; max: number }>;
    categories?: {
      name: string;
      tests: {
        name: string;
        value: number | string;
        unit: string;
        range?: { min: number; max: number };
        status: 'normal' | 'high' | 'low';
      }[];
    }[];
  };
  status: 'normal' | 'attention' | 'critical';
  ai_analysis?: {
    insights: string[];
    recommendations: string[];
    risk_assessment: string;
  };
}

export default function BiochemistryReports() {
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

      // Sample biochemistry reports
      const sampleReports: Report[] = [
        {
          id: '5',
          date: '2025-02-22',
          title: 'Comprehensive Metabolic Panel',
          summary: 'Complete metabolic panel shows optimal liver and kidney function',
          details: {
            findings: [
              'Liver enzymes within normal range',
              'Kidney function markers optimal',
              'Electrolyte balance maintained',
              'Blood glucose levels normal'
            ],
            recommendations: [
              'Continue current medication regimen',
              'Maintain healthy diet',
              'Stay well hydrated',
              'Regular exercise recommended'
            ],
            categories: [
              {
                name: 'Liver Function',
                tests: [
                  {
                    name: 'ALT',
                    value: 25,
                    unit: 'U/L',
                    range: { min: 7, max: 55 },
                    status: 'normal'
                  },
                  {
                    name: 'AST',
                    value: 22,
                    unit: 'U/L',
                    range: { min: 8, max: 48 },
                    status: 'normal'
                  },
                  {
                    name: 'ALP',
                    value: 85,
                    unit: 'U/L',
                    range: { min: 45, max: 115 },
                    status: 'normal'
                  }
                ]
              },
              {
                name: 'Kidney Function',
                tests: [
                  {
                    name: 'Creatinine',
                    value: 0.9,
                    unit: 'mg/dL',
                    range: { min: 0.6, max: 1.2 },
                    status: 'normal'
                  },
                  {
                    name: 'BUN',
                    value: 15,
                    unit: 'mg/dL',
                    range: { min: 7, max: 20 },
                    status: 'normal'
                  },
                  {
                    name: 'eGFR',
                    value: 98,
                    unit: 'mL/min/1.73m²',
                    range: { min: 90, max: 120 },
                    status: 'normal'
                  }
                ]
              },
              {
                name: 'Electrolytes',
                tests: [
                  {
                    name: 'Sodium',
                    value: 140,
                    unit: 'mEq/L',
                    range: { min: 135, max: 145 },
                    status: 'normal'
                  },
                  {
                    name: 'Potassium',
                    value: 4.2,
                    unit: 'mEq/L',
                    range: { min: 3.5, max: 5.0 },
                    status: 'normal'
                  },
                  {
                    name: 'Chloride',
                    value: 102,
                    unit: 'mEq/L',
                    range: { min: 96, max: 106 },
                    status: 'normal'
                  }
                ]
              }
            ]
          },
          status: 'normal',
          ai_analysis: {
            insights: [
              'All metabolic parameters are within normal ranges',
              'Liver function tests show healthy liver function',
              'Kidney function markers indicate good kidney health',
              'Electrolyte balance is well maintained'
            ],
            recommendations: [
              'Continue current lifestyle habits',
              'Regular follow-up in 6 months',
              'Maintain balanced diet',
              'Stay hydrated with adequate water intake'
            ],
            risk_assessment: 'Low risk - All parameters optimal'
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

  const getStatusColor = (status: Report['status'] | string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'attention':
      case 'high':
      case 'low':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'high':
        return 'text-red-600';
      case 'low':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
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
        <Activity className="h-8 w-8 text-green-500" />
        <h1 className="text-3xl font-bold">Biochemistry Reports</h1>
      </div>

      <ReportTabs activeTab="biochemistry" />

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

            <div className="space-y-6">
              {report.details.categories && (
                <div className="grid gap-6 md:grid-cols-2">
                  {report.details.categories.map((category, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">{category.name}</h4>
                      <div className="space-y-3">
                        {category.tests.map((test, testIndex) => (
                          <div key={testIndex} className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{test.name}</p>
                              <p className="text-sm text-gray-500">
                                {test.range && `Range: ${test.range.min} - ${test.range.max} ${test.unit}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${getTestStatusColor(test.status)}`}>
                                {test.value} {test.unit}
                              </p>
                              <p className="text-sm text-gray-500">
                                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
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
