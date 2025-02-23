"use client";

import { useState } from "react";

interface CBCData {
  test_date: string;
  hemoglobin: number | null;
  hematocrit: number | null;
  white_blood_cells: number | null;
  platelets: number | null;
  notes: string;
}

interface CBCFormProps {
  data?: CBCData;
  onChange: (data: CBCData) => void;
}

export default function CBCForm({ data, onChange }: CBCFormProps) {
  const [formData, setFormData] = useState<CBCData>(
    data || {
      test_date: new Date().toISOString().split("T")[0],
      hemoglobin: null,
      hematocrit: null,
      white_blood_cells: null,
      platelets: null,
      notes: "",
    }
  );

  const handleNumberChange = (field: keyof CBCData, value: string) => {
    let numValue: number | null = null;
    
    if (value !== "") {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        numValue = parsed;
      }
    }

    const newData = {
      ...formData,
      [field]: numValue
    };
    setFormData(newData);
    onChange(newData);
  };

  const handleTextChange = (field: keyof CBCData, value: string) => {
    const newData = {
      ...formData,
      [field]: value,
    };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Test Date
        </label>
        <input
          type="date"
          value={formData.test_date}
          onChange={(e) => handleTextChange("test_date", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hemoglobin (g/dL)
        </label>
        <input
          type="number"
          step="0.1"
          value={formData.hemoglobin ?? ""}
          onChange={(e) => handleNumberChange("hemoglobin", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Hematocrit (%)
        </label>
        <input
          type="number"
          step="0.1"
          value={formData.hematocrit ?? ""}
          onChange={(e) => handleNumberChange("hematocrit", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          White Blood Cells (K/µL)
        </label>
        <input
          type="number"
          step="0.1"
          value={formData.white_blood_cells ?? ""}
          onChange={(e) =>
            handleNumberChange("white_blood_cells", e.target.value)
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Platelets (K/µL)
        </label>
        <input
          type="number"
          step="1"
          value={formData.platelets ?? ""}
          onChange={(e) => handleNumberChange("platelets", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleTextChange("notes", e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}
