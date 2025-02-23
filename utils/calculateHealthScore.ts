import { MedicalProfile, CBCValues } from '@/types/medical-profile';

export const CBC_NORMAL_RANGES = {
  rbc: { min: 4.5, max: 5.5, unit: '10^6/µL' },
  hemoglobin: { min: 13.5, max: 17.5, unit: 'g/dL' },
  hematocrit: { min: 41, max: 50, unit: '%' },
  mcv: { min: 80, max: 96, unit: 'fL' },
  mch: { min: 27.5, max: 33.2, unit: 'pg' },
  mchc: { min: 33.4, max: 35.5, unit: 'g/dL' },
  wbc: { min: 4000, max: 11000, unit: '/µL' },
  neutrophils: { min: 40, max: 75, unit: '%' },
  lymphocytes: { min: 20, max: 45, unit: '%' },
  monocytes: { min: 2, max: 10, unit: '%' },
  eosinophils: { min: 1, max: 6, unit: '%' },
  basophils: { min: 0, max: 1, unit: '%' },
  platelets: { min: 150000, max: 450000, unit: '/µL' }
};

export function calculateCBCScore(values: Partial<CBCValues>): number {
  if (!values) return 0;

  let totalScore = 0;
  let validParameters = 0;

  Object.entries(CBC_NORMAL_RANGES).forEach(([key, range]) => {
    const value = values[key as keyof CBCValues];
    if (value !== undefined && value !== null) {
      validParameters++;
      if (value >= range.min && value <= range.max) {
        totalScore += 1;
      } else {
        // Partial score based on how far from normal range
        const midpoint = (range.max + range.min) / 2;
        const maxDeviation = Math.max(range.max - midpoint, midpoint - range.min);
        const deviation = Math.abs(value - midpoint);
        const score = Math.max(0, 1 - (deviation / maxDeviation));
        totalScore += score;
      }
    }
  });

  return validParameters > 0 ? totalScore / validParameters : 0;
}

export function calculateRiskScore(profile: Partial<MedicalProfile>): number {
  let riskScore = 1;

  // Cardiac conditions
  if (profile.cardiac?.has_condition) {
    riskScore *= 0.8;
    if (profile.cardiac.ccf) riskScore *= 0.9;
    if (profile.cardiac.valvular_heart_disease) riskScore *= 0.9;
    if (profile.cardiac.cardiomyopathy) riskScore *= 0.85;
  }

  // Pulmonary conditions
  if (profile.pulmonary?.copd) riskScore *= 0.85;
  if (profile.pulmonary?.asthma) riskScore *= 0.9;

  // Renal conditions
  if (profile.renal?.dialysis_type) riskScore *= 0.8;

  // Diabetes
  if (profile.diabetes?.is_diabetic) {
    riskScore *= 0.9;
    if (profile.diabetes.on_insulin) riskScore *= 0.95;
  }

  // Smoking
  if (profile.smoking?.is_smoker) {
    riskScore *= 0.85;
    if (profile.smoking.cigarettes_per_day && profile.smoking.cigarettes_per_day > 10) {
      riskScore *= 0.9;
    }
  }

  // Malignancy
  if (profile.malignancy) {
    if (profile.malignancy.head_and_neck) riskScore *= 0.8;
    if (profile.malignancy.lungs) riskScore *= 0.75;
    if (profile.malignancy.git) riskScore *= 0.85;
    if (profile.malignancy.brain) riskScore *= 0.7;
    if (profile.malignancy.renal) riskScore *= 0.8;
    if (profile.malignancy.blood) riskScore *= 0.75;
  }

  // Other conditions
  if (profile.hyperthyroid) riskScore *= 0.9;
  if (profile.liver_diseases) riskScore *= 0.85;

  return riskScore;
}

export function calculateOverallHealthScore(profile: Partial<MedicalProfile>): number {
  const riskScore = calculateRiskScore(profile);
  const cbcScore = calculateCBCScore(profile.cbc_values || {});
  
  // Weight the scores (60% risk factors, 40% CBC values)
  return (riskScore * 0.6) + (cbcScore * 0.4);
}
