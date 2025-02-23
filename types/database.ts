export interface Profile {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface MedicalProfile {
  id: string
  user_id: string
  age: number | null
  sex: 'male' | 'female' | 'other'
  hospital_id: string | null
  pregnancy: boolean
  pregnancy_months: number | null
  conditions: {
    diabetes: boolean
    hypertension: boolean
    heart_disease: boolean
    other: string
  }
  cardiac_conditions: {
    ccf: boolean
    valvularDisease: boolean
    cardiomyopathy: boolean
  }
  pulmonary_conditions: {
    copd: boolean
    asthma: boolean
  }
  renal_conditions: {
    postTransplant: boolean
    dialysis: boolean
  }
  medications: {
    steroids: boolean
    lasix: boolean
    mannitol: boolean
    other: string
  }
  malignancies: {
    headAndNeck: boolean
    lungs: boolean
    git: boolean
    brain: boolean
    renal: boolean
    blood: boolean
  }
  diabetic: boolean
  diabetes_type: {
    hb: boolean
    a: boolean
    c: boolean
  }
  on_insulin: boolean
  diabetes_since: string | null
  antihypertension_medication: string | null
  liver_diseases: string | null
  hyperthyroid: boolean
  created_at: string
  updated_at: string
}

export interface CBCResult {
  id: string
  user_id: string
  test_date: string
  hemoglobin: number | null
  rbc_count: number | null
  hematocrit: number | null
  mcv: number | null
  mch: number | null
  mchc: number | null
  rdw: number | null
  wbc_count: number | null
  neutrophils_percent: number | null
  lymphocytes_percent: number | null
  monocytes_percent: number | null
  eosinophils_percent: number | null
  basophils_percent: number | null
  platelet_count: number | null
  mpv: number | null
  lab_name: string | null
  notes: string | null
  reference_ranges: {
    hemoglobin: { min: number; max: number }
    rbc_count: { min: number; max: number }
    hematocrit: { min: number; max: number }
    wbc_count: { min: number; max: number }
    platelet_count: { min: number; max: number }
  }
  created_at: string
  updated_at: string
}

export interface DoctorVisit {
  id: string
  user_id: string
  visit_date: string
  doctor_name: string
  reason: string | null
  diagnosis: string | null
  prescription: string | null
  follow_up_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      medical_profiles: {
        Row: MedicalProfile
        Insert: Omit<MedicalProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MedicalProfile, 'id' | 'created_at' | 'updated_at'>>
      }
      cbc_results: {
        Row: CBCResult
        Insert: Omit<CBCResult, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CBCResult, 'id' | 'created_at' | 'updated_at'>>
      }
      doctor_visits: {
        Row: DoctorVisit
        Insert: Omit<DoctorVisit, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DoctorVisit, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
