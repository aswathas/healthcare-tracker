export interface Profile {
  id: string;
  email: string;
  name: string;
  age?: number;
  sex?: string;
  hospital_id?: string;
  pregnancy?: boolean;
  pregnancy_months?: number;
  cardiac_conditions?: {
    hasCondition: boolean;
    ccf: boolean;
    valvularDisease: boolean;
    cardiomyopathy: boolean;
    arrhythmias: boolean;
    congenitalHeartDisease: boolean;
    coronaryArteryDisease: boolean;
    treatment?: {
      medication: string;
      surgery: boolean;
      lastProcedureDate: string;
    };
  };
  pulmonary_conditions?: {
    copd: boolean;
    asthma: boolean;
  };
  renal_conditions?: {
    postTransplant: boolean;
    dialysis: boolean;
    justPrior: boolean;
    immediatePost: boolean;
    intermittent: boolean;
  };
  medications?: {
    steroids: boolean;
    lasix: boolean;
    mannitol: boolean;
    other: string;
  };
  antihypertension_medication?: string;
  diabetic?: boolean;
  diabetes_since?: string;
  diabetes_type?: {
    type1: boolean;
    type2: boolean;
    gestational: boolean;
    hba1c: string;
    complications: {
      neuropathy: boolean;
      retinopathy: boolean;
      nephropathy: boolean;
    };
  };
  on_insulin?: boolean;
  smoking?: boolean;
  cigarettes_per_day?: number;
  malignancies?: {
    headAndNeck: boolean;
    lungs: boolean;
    git: boolean;
    brain: boolean;
    renal: boolean;
    blood: boolean;
  };
  investigation_markers?: {
    hb: boolean;
    ah: boolean;
    a: boolean;
    c: boolean;
    creatinine: boolean;
    anp: boolean;
    bnp: boolean;
    sodium: boolean;
    potassium: boolean;
  };
  hyperthyroid?: boolean;
  liver_diseases?: string;
}
