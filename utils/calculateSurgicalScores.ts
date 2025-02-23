import { SurgicalMarkers, SurgicalScores, SCORE_WEIGHTS, NORMAL_RANGES } from '../types/surgical-markers';

function calculateNormalizedScore(value: number | undefined, min: number, max: number): number {
  if (!value) return 0.5; // Return middle score if value is missing
  
  // Normalize to 0-1 range
  const normalized = (value - min) / (max - min);
  
  // Convert to 0-1 score, where 0.5 is optimal
  return Math.max(0, Math.min(1, 1 - Math.abs(0.5 - normalized)));
}

function calculateCardiacScore(markers: SurgicalMarkers): number {
  const scores: number[] = [];
  
  // Heart rate (60-100 bpm optimal)
  if (markers.heart_rate) {
    scores.push(calculateNormalizedScore(markers.heart_rate, 40, 120));
  }
  
  // Blood pressure
  if (markers.systolic_bp) {
    scores.push(calculateNormalizedScore(markers.systolic_bp, 
      NORMAL_RANGES.systolic_bp.min, 
      NORMAL_RANGES.systolic_bp.max
    ));
  }
  
  // Ejection fraction (50-70% optimal)
  if (markers.ejection_fraction) {
    scores.push(calculateNormalizedScore(markers.ejection_fraction, 30, 90));
  }
  
  return scores.length ? scores.reduce((a, b) => a + b) / scores.length : 0.5;
}

function calculatePulmonaryScore(markers: SurgicalMarkers): number {
  const scores: number[] = [];
  
  // Oxygen saturation
  if (markers.oxygen_saturation) {
    scores.push(calculateNormalizedScore(markers.oxygen_saturation, 
      NORMAL_RANGES.oxygen_saturation.min, 
      NORMAL_RANGES.oxygen_saturation.max
    ));
  }
  
  // FEV1 (>80% predicted is normal)
  if (markers.fev1) {
    scores.push(calculateNormalizedScore(markers.fev1, 40, 120));
  }
  
  return scores.length ? scores.reduce((a, b) => a + b) / scores.length : 0.5;
}

function calculateHematologyScore(markers: SurgicalMarkers): number {
  const scores: number[] = [];
  
  // Hemoglobin
  if (markers.hemoglobin) {
    scores.push(calculateNormalizedScore(markers.hemoglobin,
      NORMAL_RANGES.hemoglobin.min,
      NORMAL_RANGES.hemoglobin.max
    ));
  }
  
  // WBC count
  if (markers.wbc_count) {
    scores.push(calculateNormalizedScore(markers.wbc_count,
      NORMAL_RANGES.wbc_count.min,
      NORMAL_RANGES.wbc_count.max
    ));
  }
  
  // Platelet count
  if (markers.platelet_count) {
    scores.push(calculateNormalizedScore(markers.platelet_count,
      NORMAL_RANGES.platelet_count.min,
      NORMAL_RANGES.platelet_count.max
    ));
  }
  
  return scores.length ? scores.reduce((a, b) => a + b) / scores.length : 0.5;
}

function calculateMetabolicScore(markers: SurgicalMarkers): number {
  const scores: number[] = [];
  
  // Sodium
  if (markers.sodium) {
    scores.push(calculateNormalizedScore(markers.sodium,
      NORMAL_RANGES.sodium.min,
      NORMAL_RANGES.sodium.max
    ));
  }
  
  // Potassium
  if (markers.potassium) {
    scores.push(calculateNormalizedScore(markers.potassium,
      NORMAL_RANGES.potassium.min,
      NORMAL_RANGES.potassium.max
    ));
  }
  
  // Creatinine
  if (markers.creatinine) {
    scores.push(calculateNormalizedScore(markers.creatinine,
      NORMAL_RANGES.creatinine.min,
      NORMAL_RANGES.creatinine.max
    ));
  }
  
  return scores.length ? scores.reduce((a, b) => a + b) / scores.length : 0.5;
}

export function calculateSurgicalScores(markers: SurgicalMarkers): SurgicalScores {
  const cardiac_score = calculateCardiacScore(markers);
  const pulmonary_score = calculatePulmonaryScore(markers);
  const hematology_score = calculateHematologyScore(markers);
  const metabolic_score = calculateMetabolicScore(markers);
  
  // Calculate weighted overall score
  const overall_surgical_score = 
    cardiac_score * SCORE_WEIGHTS.cardiac +
    pulmonary_score * SCORE_WEIGHTS.pulmonary +
    hematology_score * SCORE_WEIGHTS.hematology +
    metabolic_score * SCORE_WEIGHTS.metabolic;
  
  return {
    cardiac_score,
    pulmonary_score,
    hematology_score,
    metabolic_score,
    overall_surgical_score
  };
}
