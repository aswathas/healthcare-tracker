"use client";

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { SurgicalMarkers } from '@/types/surgical-markers';

interface Props {
  markers: SurgicalMarkers[];
}

const SurgicalTimeline: React.FC<Props> = ({ markers }) => {
  const data = markers.map(marker => ({
    date: new Date(marker.assessment_date).toLocaleDateString(),
    cardiac: marker.cardiac_score ? (marker.cardiac_score * 100).toFixed(1) : null,
    pulmonary: marker.pulmonary_score ? (marker.pulmonary_score * 100).toFixed(1) : null,
    hematology: marker.hematology_score ? (marker.hematology_score * 100).toFixed(1) : null,
    metabolic: marker.metabolic_score ? (marker.metabolic_score * 100).toFixed(1) : null,
    overall: marker.overall_surgical_score ? (marker.overall_surgical_score * 100).toFixed(1) : null,
  }));

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Surgical Readiness Timeline</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip
            formatter={(value: number) => [`${value}%`]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="cardiac"
            name="Cardiac Score"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="pulmonary"
            name="Pulmonary Score"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="hematology"
            name="Hematology Score"
            stroke="#ffc658"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="metabolic"
            name="Metabolic Score"
            stroke="#ff7300"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="overall"
            name="Overall Score"
            stroke="#ff0000"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SurgicalTimeline;
