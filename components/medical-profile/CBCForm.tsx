"use client";

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CBCValues } from '@/types/medical-profile';

const CBC_FIELDS = {
  haemoglobin: { min: 13.5, max: 17.5, unit: 'g/dL', label: 'Haemoglobin' },
  total_wbc: { min: 4000, max: 11000, unit: '/µL', label: 'Total WBC' },
  rbc: { min: 4.5, max: 6.5, unit: 'M/µL', label: 'RBC' },
  pcv: { min: 40, max: 54, unit: '%', label: 'PCV' },
  mcv: { min: 80, max: 100, unit: 'fL', label: 'MCV' },
  mch: { min: 27, max: 32, unit: 'pg', label: 'MCH' },
  mchc: { min: 32, max: 36, unit: 'g/dL', label: 'MCHC' },
  neutrophils: { min: 40, max: 75, unit: '%', label: 'Neutrophils' },
  lymphocytes: { min: 20, max: 45, unit: '%', label: 'Lymphocytes' },
  monocytes: { min: 2, max: 10, unit: '%', label: 'Monocytes' },
  eosinophils: { min: 1, max: 6, unit: '%', label: 'Eosinophils' },
  basophils: { min: 0, max: 1, unit: '%', label: 'Basophils' },
  immature_granulocytes: { min: 0, max: 1, unit: '%', label: 'Immature Granulocytes' }
};

interface CBCFormProps {
  values?: Partial<CBCValues>;
  onChange: (values: Partial<CBCValues>) => void;
}

export default function CBCForm({ values = {}, onChange }: CBCFormProps) {
  const handleChange = (field: keyof typeof CBC_FIELDS, value: number | undefined) => {
    const newValues = { ...values, [field]: value };
    onChange(newValues);
  };

  const getInputColor = (field: keyof typeof CBC_FIELDS, value: number | undefined): string => {
    if (!value) return '';
    const range = CBC_FIELDS[field];
    if (value < range.min) return 'text-red-600';
    if (value > range.max) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <TooltipProvider>
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.entries(CBC_FIELDS) as [keyof typeof CBC_FIELDS, typeof CBC_FIELDS[keyof typeof CBC_FIELDS]][]).map(([field, range]) => (
            <div key={field} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor={field}>{range.label}</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoCircledIcon className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Normal range: {range.min} - {range.max} {range.unit}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id={field}
                type="number"
                step={field === 'total_wbc' ? '100' : '0.1'}
                placeholder={`${range.min} - ${range.max} ${range.unit}`}
                value={values[field] || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  handleChange(field, value);
                }}
                className={getInputColor(field, values[field])}
              />
            </div>
          ))}
        </div>
      </Card>
    </TooltipProvider>
  );
}
