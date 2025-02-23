"use client";

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { SurgicalMarkers } from '@/types/surgical-markers';

interface Props {
  marker: SurgicalMarkers;
}

const SurgicalVisualization: React.FC<Props> = ({ marker }) => {
  const radarData = [
    {
      category: 'Cardiac',
      score: marker.cardiac_score ? marker.cardiac_score * 100 : 0,
      fullMark: 100,
    },
    {
      category: 'Pulmonary',
      score: marker.pulmonary_score ? marker.pulmonary_score * 100 : 0,
      fullMark: 100,
    },
    {
      category: 'Hematology',
      score: marker.hematology_score ? marker.hematology_score * 100 : 0,
      fullMark: 100,
    },
    {
      category: 'Metabolic',
      score: marker.metabolic_score ? marker.metabolic_score * 100 : 0,
      fullMark: 100,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // green
    if (score >= 60) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const overallScore = marker.overall_surgical_score ? marker.overall_surgical_score * 100 : 0;
  const scoreColor = getScoreColor(overallScore);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Surgical Readiness Overview</h3>
        <div className="flex items-center">
          <div className="text-3xl font-bold" style={{ color: scoreColor }}>
            {overallScore.toFixed(1)}%
          </div>
          <div className="ml-2 text-sm text-gray-500">Overall Score</div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke={scoreColor}
              fill={scoreColor}
              fillOpacity={0.6}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {radarData.map((item) => (
          <div key={item.category} className="text-center">
            <div className="text-sm text-gray-500">{item.category}</div>
            <div 
              className="text-xl font-semibold"
              style={{ color: getScoreColor(item.score) }}
            >
              {item.score.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurgicalVisualization;
