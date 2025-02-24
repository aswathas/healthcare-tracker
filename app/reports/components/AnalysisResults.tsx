'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronDown, AlertTriangle, CheckCircle, TrendingUp, FileText } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: {
    raw: string;
    structured: {
      summary: string;
      keyFindings: string[];
      riskAssessment: {
        status: string;
        risks: string[];
        severity: string;
      };
      recommendations: string[];
      trends: string[];
    };
  };
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const [activeSection, setActiveSection] = useState<string | null>('summary');

  const sections = [
    {
      id: 'summary',
      title: 'Summary',
      icon: FileText,
      content: analysis.structured.summary,
      color: 'blue'
    },
    {
      id: 'findings',
      title: 'Key Findings',
      icon: Brain,
      content: analysis.structured.keyFindings,
      color: 'purple'
    },
    {
      id: 'risks',
      title: 'Risk Assessment',
      icon: AlertTriangle,
      content: {
        status: analysis.structured.riskAssessment.status,
        risks: analysis.structured.riskAssessment.risks,
        severity: analysis.structured.riskAssessment.severity
      },
      color: 'yellow'
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      icon: CheckCircle,
      content: analysis.structured.recommendations,
      color: 'green'
    },
    {
      id: 'trends',
      title: 'Trends',
      icon: TrendingUp,
      content: analysis.structured.trends,
      color: 'indigo'
    }
  ];

  const getSeverityColor = (severity: string) => {
    const lower = severity.toLowerCase();
    if (lower.includes('low')) return 'text-green-600';
    if (lower.includes('medium')) return 'text-yellow-600';
    if (lower.includes('high')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-purple-500" />
          <h2 className="text-xl font-semibold">AI Analysis Results</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <div key={section.id} className="bg-white">
              <button
                onClick={() => setActiveSection(isActive ? null : section.id)}
                className={`
                  w-full px-6 py-4 flex items-center justify-between
                  text-left transition-colors duration-200
                  ${isActive ? `bg-${section.color}-50` : 'hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 text-${section.color}-500`} />
                  <span className="font-medium">{section.title}</span>
                </div>
                <ChevronDown
                  className={`
                    h-5 w-5 text-gray-400 transition-transform duration-200
                    ${isActive ? 'transform rotate-180' : ''}
                  `}
                />
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-6 py-4 bg-${section.color}-50 bg-opacity-30`}>
                      {section.id === 'summary' && (
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {section.content}
                        </p>
                      )}

                      {section.id === 'findings' && (
                        <ul className="space-y-2">
                          {section.content.map((finding: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-gray-600"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-purple-500" />
                              {finding}
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.id === 'risks' && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Current Status</h4>
                            <p className="text-gray-600">{section.content.status}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Identified Risks</h4>
                            <ul className="space-y-2">
                              {section.content.risks.map((risk: string, index: number) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-gray-600"
                                >
                                  <AlertTriangle className="h-4 w-4 mt-1 text-yellow-500" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Severity Level</h4>
                            <p className={getSeverityColor(section.content.severity)}>
                              {section.content.severity}
                            </p>
                          </div>
                        </div>
                      )}

                      {section.id === 'recommendations' && (
                        <ul className="space-y-2">
                          {section.content.map((rec: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-gray-600"
                            >
                              <CheckCircle className="h-4 w-4 mt-1 text-green-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.id === 'trends' && (
                        <ul className="space-y-2">
                          {section.content.map((trend: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-gray-600"
                            >
                              <TrendingUp className="h-4 w-4 mt-1 text-indigo-500" />
                              {trend}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
