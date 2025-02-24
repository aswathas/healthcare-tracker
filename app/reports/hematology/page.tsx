'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { showToast } from '@/lib/toast';
import { Microscope, X } from 'lucide-react';
import { format } from 'date-fns';
import ReportTabs from '../components/ReportTabs';
import UploadAnalyze from '../components/UploadAnalyze';
import AnalysisResults from '../components/AnalysisResults';

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
  };
  status: 'normal' | 'attention' | 'critical';
  ai_analysis?: {
    insights: string[];
    recommendations: string[];
    risk_assessment: string;
  };
}

export default function HematologyReports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchReports();
    // Check for analysis results in localStorage
    const savedAnalysis = localStorage.getItem('latestAnalysis');
    if (savedAnalysis) {
      setAnalysis(JSON.parse(savedAnalysis));
    }
  }, []);

  const fetchReports = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/auth/login';
        return;
      }

      // Sample hematology report
      const sampleReports: Report[] = [{
        id: '1',
        date: '2025-02-24',
        title: 'Complete Blood Count Analysis',
        summary: 'Routine blood work shows all parameters within normal range',
        details: {
          findings: [
            'Hemoglobin levels are optimal',
            'White blood cell count is normal',
            'Platelet count is within range'
          ],
          recommendations: [
            'Continue current health maintenance',
            'Next CBC recommended in 6 months'
          ],
          metrics: {
            'Hemoglobin': '14.2 g/dL',
            'WBC': '7.5 K/µL',
            'RBC': '4.8 M/µL',
            'Platelets': '250 K/µL'
          },
          normal_ranges: {
            'Hemoglobin': { min: 12, max: 16 },
            'WBC': { min: 4, max: 11 },
            'RBC': { min: 4.2, max: 5.8 },
            'Platelets': { min: 150, max: 450 }
          }
        },
        status: 'normal',
        ai_analysis: {
          insights: [
            'All blood parameters are within optimal ranges',
            'No significant changes from previous tests',
            'Blood cell morphology is normal'
          ],
          recommendations: [
            'Maintain current diet and exercise routine',
            'Stay hydrated',
            'Continue regular check-ups'
          ],
          risk_assessment: 'Low risk - All parameters are within normal ranges'
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

  const handleAnalysisComplete = (newAnalysis: any) => {
    setAnalysis(newAnalysis);
    localStorage.setItem('latestAnalysis', JSON.stringify(newAnalysis));
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    localStorage.removeItem('latestAnalysis');
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Microscope className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Hematology Reports</h1>
        </div>
        <UploadAnalyze onAnalysisComplete={handleAnalysisComplete} />
      </div>

      <ReportTabs activeTab="hematology" />

      {analysis && (
        <div className="mb-8 relative">
          <button
            onClick={clearAnalysis}
            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
          <AnalysisResults analysis={analysis} />
        </div>
      )}

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
                      {report.details.normal_ranges?.[key] && (
                        <p className="text-xs text-gray-400">
                          Range: {report.details.normal_ranges[key].min} - {report.details.normal_ranges[key].max}
                        </p>
                      )}
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
