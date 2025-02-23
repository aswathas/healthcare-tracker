export type GenderType = 'Male' | 'Female' | 'Other' | 'Prefer not to say';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type DialysisType = 'post_transplant' | 'just_prior' | 'immediate_post' | 'intermittent';

export interface CBCValues {
  id?: string;
  user_id?: string;
  rbc: number;
  haemoglobin: number;
  pcv: number;
  mcv: number;
  mch: number;
  mchc: number;
  total_wbc: number;
  neutrophils: number;
  lymphocytes: number;
  monocytes: number;
  eosinophils: number;
  basophils: number;
  immature_granulocytes: number;
  assessment_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PregnancyInfo {
  is_pregnant: boolean;
  months?: number;
}

export interface CardiacInfo {
  has_condition: boolean;
  ccf: boolean;
  valvular_heart_disease: boolean;
  cardiomyopathy: boolean;
}

export interface PulmonaryInfo {
  copd: boolean;
  asthma: boolean;
}

export interface RenalInfo {
  dialysis_type: DialysisType | null;
}

export interface MedicationsInfo {
  steroids: boolean;
  lasix: boolean;
  mannitol: boolean;
  antihypertension?: string;
  other?: string;
}

export interface DiabetesInfo {
  is_diabetic: boolean;
  since?: string;
  type?: 'HB' | 'A' | 'C';
  on_insulin: boolean;
}

export interface SmokingInfo {
  is_smoker: boolean;
  cigarettes_per_day?: number;
  frequency?: 'none' | 'occasional' | 'regular' | 'heavy';
}

export interface MalignancyInfo {
  head_and_neck: boolean;
  lungs: boolean;
  git: boolean;
  brain: boolean;
  renal: boolean;
  blood: boolean;
}

export interface InvestigationsInfo {
  hb: boolean;
  ah: boolean;
  a: boolean;
  c: boolean;
  creatinine: boolean;
  anp: boolean;
  bnp: boolean;
  sodium: boolean;
  potassium: boolean;
}

export interface MedicalProfile {
  id?: string;
  user_id?: string;
  age: number;
  sex: GenderType;
  hospital_id?: string;
  blood_type?: BloodType;
  height: number;
  weight: number;
  
  pregnancy: PregnancyInfo;
  cardiac: CardiacInfo;
  pulmonary: PulmonaryInfo;
  renal: RenalInfo;
  medications: MedicationsInfo;
  diabetes: DiabetesInfo;
  smoking: SmokingInfo;
  malignancy: MalignancyInfo;
  investigations: InvestigationsInfo;
  
  hyperthyroid: boolean;
  liver_diseases?: string;
  
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  
  health_score?: number;
  bmi?: number;
  
  cbc_values?: CBCValues;
  follow_up_date?: string;
  
  created_at?: string;
  updated_at?: string;
}

export interface SurgicalAssessment {
  id?: string;
  user_id?: string;
  medical_profile_id?: string;
  cbc_values_id?: string;
  
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  respiratory_rate: number;
  temperature: number;
  oxygen_saturation: number;
  
  asa_score: number;
  rcri_score: number;
  surgical_risk_score: number;
  
  assessment_date?: string;
  next_assessment_date?: string;
  notes?: string;
  recommendations?: string[];
  
  created_at?: string;
  updated_at?: string;
  
  // Relations
  medical_profile?: MedicalProfile;
  cbc_values?: CBCValues;
}
