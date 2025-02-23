export interface SurgicalMarkers {
  id?: string;
  user_id: string;
  assessment_date: string;
  
  // Cardiac Function
  ecg_status?: string;
  heart_rate_variability?: number;
  troponin_level?: number;
  bnp_level?: number;
  ejection_fraction?: number;
  
  // Pulmonary Function
  oxygen_saturation?: number;
  fev1?: number;
  fvc?: number;
  abg_ph?: number;
  abg_po2?: number;
  abg_pco2?: number;
  
  // Hematological Profile
  hemoglobin?: number;
  hematocrit?: number;
  wbc_count?: number;
  platelet_count?: number;
  iron_level?: number;
  ferritin?: number;
  pt?: number;
  ptt?: number;
  inr?: number;
  
  // Metabolic and Biochemical
  sodium?: number;
  potassium?: number;
  chloride?: number;
  bicarbonate?: number;
  creatinine?: number;
  bun?: number;
  egfr?: number;
  alt?: number;
  ast?: number;
  alkaline_phosphatase?: number;
  bilirubin?: number;
  albumin?: number;
  blood_glucose?: number;
  hba1c?: number;
  total_cholesterol?: number;
  ldl?: number;
  hdl?: number;
  triglycerides?: number;
  
  // Inflammatory Markers
  crp?: number;
  esr?: number;
  
  // Nutritional Status
  bmi?: number;
  
  // Risk Scores
  asa_score?: number;
  rcri_score?: number;
  
  // Additional Info
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  temperature?: number;
  smoking_status?: string;
  alcohol_consumption?: string;
  physical_activity_level?: string;
  
  // Calculated Scores
  cardiac_score?: number;
  pulmonary_score?: number;
  hematology_score?: number;
  metabolic_score?: number;
  overall_surgical_score?: number;
}

export interface SurgicalScores {
  cardiac_score: number;
  pulmonary_score: number;
  hematology_score: number;
  metabolic_score: number;
  overall_surgical_score: number;
}

// Scoring ranges and weights
export const SCORE_WEIGHTS = {
  cardiac: 0.3,
  pulmonary: 0.25,
  hematology: 0.25,
  metabolic: 0.2
};

// Normal ranges for various markers
export const NORMAL_RANGES = {
  hemoglobin: { min: 12, max: 16 },
  hematocrit: { min: 36, max: 46 },
  wbc_count: { min: 4000, max: 11000 },
  platelet_count: { min: 150000, max: 450000 },
  sodium: { min: 135, max: 145 },
  potassium: { min: 3.5, max: 5.0 },
  creatinine: { min: 0.6, max: 1.2 },
  bun: { min: 7, max: 20 },
  oxygen_saturation: { min: 95, max: 100 },
  systolic_bp: { min: 90, max: 120 },
  diastolic_bp: { min: 60, max: 80 }
};
