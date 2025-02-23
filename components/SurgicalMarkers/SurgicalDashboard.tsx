"use client";

import React from "react";
import { SurgicalMarkers } from "@/types/surgical-markers";
import { NORMAL_RANGES } from "@/types/surgical-markers";

interface Props {
  marker: SurgicalMarkers;
}

const ScoreIndicator: React.FC<{ score: number; label: string }> = ({
  score,
  label,
}) => {
  const percentage = score * 100;
  const getColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const ValueIndicator: React.FC<{
  value: number | undefined;
  label: string;
  unit: string;
  normalRange?: { min: number; max: number };
}> = ({ value, label, unit, normalRange }) => {
  if (!value) return null;

  const isNormal = normalRange
    ? value >= normalRange.min && value <= normalRange.max
    : true;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="text-sm text-gray-500">{label}</div>
      <div
        className={`text-xl font-semibold ${
          isNormal ? "text-green-600" : "text-red-600"
        }`}
      >
        {value} {unit}
      </div>
      {normalRange && (
        <div className="text-xs text-gray-400">
          Normal: {normalRange.min}-{normalRange.max}
        </div>
      )}
    </div>
  );
};

const SurgicalDashboard: React.FC<Props> = ({ marker }) => {
  // Date formatting options for consistency between server and client
  const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  return (
    <div className="space-y-6">
      {/* Overall Scores */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Surgical Readiness Scores
        </h3>
        <ScoreIndicator
          score={marker.overall_surgical_score || 0}
          label="Overall Score"
        />
        <ScoreIndicator
          score={marker.cardiac_score || 0}
          label="Cardiac Score"
        />
        <ScoreIndicator
          score={marker.pulmonary_score || 0}
          label="Pulmonary Score"
        />
        <ScoreIndicator
          score={marker.hematology_score || 0}
          label="Hematology Score"
        />
        <ScoreIndicator
          score={marker.metabolic_score || 0}
          label="Metabolic Score"
        />
      </div>

      {/* Vital Signs */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Vital Signs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ValueIndicator
            value={marker.heart_rate}
            label="Heart Rate"
            unit="bpm"
            normalRange={{ min: 60, max: 100 }}
          />
          <ValueIndicator
            value={marker.systolic_bp}
            label="Systolic BP"
            unit="mmHg"
            normalRange={NORMAL_RANGES.systolic_bp}
          />
          <ValueIndicator
            value={marker.oxygen_saturation}
            label="O₂ Saturation"
            unit="%"
            normalRange={NORMAL_RANGES.oxygen_saturation}
          />
          <ValueIndicator
            value={marker.temperature}
            label="Temperature"
            unit="°C"
            normalRange={{ min: 36.5, max: 37.5 }}
          />
        </div>
      </div>

      {/* Lab Values */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Laboratory Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ValueIndicator
            value={marker.hemoglobin}
            label="Hemoglobin"
            unit="g/dL"
            normalRange={NORMAL_RANGES.hemoglobin}
          />
          <ValueIndicator
            value={marker.wbc_count}
            label="WBC Count"
            unit="/μL"
            normalRange={NORMAL_RANGES.wbc_count}
          />
          <ValueIndicator
            value={marker.platelet_count}
            label="Platelets"
            unit="K/μL"
            normalRange={NORMAL_RANGES.platelet_count}
          />
          <ValueIndicator
            value={marker.creatinine}
            label="Creatinine"
            unit="mg/dL"
            normalRange={NORMAL_RANGES.creatinine}
          />
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">ASA Score</div>
            <div className="text-xl font-semibold">
              {marker.asa_score || "Not assessed"}
              {marker.asa_score && "/6"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              American Society of Anesthesiologists Physical Status
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500">RCRI Score</div>
            <div className="text-xl font-semibold">
              {marker.rcri_score || "Not assessed"}
              {marker.rcri_score && "/6"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Revised Cardiac Risk Index
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Info */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Assessment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Assessment Date</div>
            <div className="text-lg">
              {new Date(marker.assessment_date).toLocaleDateString('en-GB', DATE_FORMAT_OPTIONS)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-lg">
              {new Date(marker.updated_at).toLocaleDateString('en-GB', DATE_FORMAT_OPTIONS)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgicalDashboard;
