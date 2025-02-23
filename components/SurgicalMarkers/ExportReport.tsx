"use client";

import React from 'react';
import { SurgicalMarkers } from '@/types/surgical-markers';
import { calculateDetailedRiskScores } from '@/utils/calculateRiskScores';

interface Props {
  marker: SurgicalMarkers;
}

const ExportReport: React.FC<Props> = ({ marker }) => {
  const generatePDF = async () => {
    const riskScores = calculateDetailedRiskScores(marker);
    
    // Format date
    const assessmentDate = new Date(marker.assessment_date).toLocaleDateString();
    
    // Create HTML content
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin: 20px 0; }
            .score { color: #2563eb; font-weight: bold; }
            .risk { color: #dc2626; }
            .recommendation { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Surgical Readiness Assessment Report</h1>
            <p>Assessment Date: ${assessmentDate}</p>
          </div>

          <div class="section">
            <h2>Overall Scores</h2>
            <p>Overall Surgical Score: <span class="score">${(marker.overall_surgical_score * 100).toFixed(1)}%</span></p>
            <p>Cardiac Score: <span class="score">${(marker.cardiac_score * 100).toFixed(1)}%</span></p>
            <p>Pulmonary Score: <span class="score">${(marker.pulmonary_score * 100).toFixed(1)}%</span></p>
            <p>Hematology Score: <span class="score">${(marker.hematology_score * 100).toFixed(1)}%</span></p>
            <p>Metabolic Score: <span class="score">${(marker.metabolic_score * 100).toFixed(1)}%</span></p>
          </div>

          <div class="section">
            <h2>Risk Assessment</h2>
            <p>ASA Classification: <span class="risk">${riskScores.asa_description}</span></p>
            <p>RCRI Risk Level: <span class="risk">${riskScores.rcri_risk}</span></p>
            <p>Overall Surgical Risk: <span class="risk">${riskScores.surgical_risk}</span></p>
          </div>

          <div class="section">
            <h2>Key Measurements</h2>
            <p>Blood Pressure: ${marker.systolic_bp}/${marker.diastolic_bp} mmHg</p>
            <p>Heart Rate: ${marker.heart_rate} bpm</p>
            <p>Oxygen Saturation: ${marker.oxygen_saturation}%</p>
            <p>Hemoglobin: ${marker.hemoglobin} g/dL</p>
          </div>

          <div class="section">
            <h2>Recommendations</h2>
            ${riskScores.recommendations.map(rec => `
              <p class="recommendation">• ${rec}</p>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    // Convert to PDF and download
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surgical-assessment-${assessmentDate}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  };

  const exportCSV = () => {
    const riskScores = calculateDetailedRiskScores(marker);
    
    // Prepare data
    const data = {
      'Assessment Date': new Date(marker.assessment_date).toLocaleDateString(),
      'Overall Score': (marker.overall_surgical_score * 100).toFixed(1) + '%',
      'Cardiac Score': (marker.cardiac_score * 100).toFixed(1) + '%',
      'Pulmonary Score': (marker.pulmonary_score * 100).toFixed(1) + '%',
      'Hematology Score': (marker.hematology_score * 100).toFixed(1) + '%',
      'Metabolic Score': (marker.metabolic_score * 100).toFixed(1) + '%',
      'ASA Classification': riskScores.asa_description,
      'RCRI Risk Level': riskScores.rcri_risk,
      'Surgical Risk': riskScores.surgical_risk,
      'Blood Pressure': `${marker.systolic_bp}/${marker.diastolic_bp}`,
      'Heart Rate': marker.heart_rate,
      'Oxygen Saturation': marker.oxygen_saturation,
      'Hemoglobin': marker.hemoglobin,
    };

    // Convert to CSV
    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `surgical-assessment-${new Date(marker.assessment_date).toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export PDF
      </button>
      
      <button
        onClick={exportCSV}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export CSV
      </button>
    </div>
  );
};

export default ExportReport;
