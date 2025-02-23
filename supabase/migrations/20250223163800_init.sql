-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS doctor_visits CASCADE;
DROP TABLE IF EXISTS cbc_results CASCADE;
DROP TABLE IF EXISTS medical_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_profiles table
CREATE TABLE medical_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    age INTEGER CHECK (age >= 0 AND age <= 150),
    sex TEXT CHECK (sex IN ('male', 'female', 'other')),
    hospital_id TEXT,
    pregnancy BOOLEAN DEFAULT false,
    pregnancy_months INTEGER CHECK (pregnancy_months >= 0 AND pregnancy_months <= 10),
    
    -- Medical Conditions
    conditions JSONB DEFAULT '{
        "diabetes": false,
        "hypertension": false,
        "heart_disease": false,
        "other": ""
    }'::jsonb,
    
    -- Cardiac Conditions
    cardiac_conditions JSONB DEFAULT '{
        "ccf": false,
        "valvularDisease": false,
        "cardiomyopathy": false
    }'::jsonb,
    
    -- Pulmonary Conditions
    pulmonary_conditions JSONB DEFAULT '{
        "copd": false,
        "asthma": false
    }'::jsonb,
    
    -- Renal Conditions
    renal_conditions JSONB DEFAULT '{
        "postTransplant": false,
        "dialysis": false
    }'::jsonb,
    
    -- Medications
    medications JSONB DEFAULT '{
        "steroids": false,
        "lasix": false,
        "mannitol": false,
        "other": ""
    }'::jsonb,
    
    -- Malignancies
    malignancies JSONB DEFAULT '{
        "headAndNeck": false,
        "lungs": false,
        "git": false,
        "brain": false,
        "renal": false,
        "blood": false
    }'::jsonb,
    
    -- Diabetes Information
    diabetic BOOLEAN DEFAULT false,
    diabetes_type JSONB DEFAULT '{
        "hb": false,
        "a": false,
        "c": false
    }'::jsonb,
    on_insulin BOOLEAN DEFAULT false,
    diabetes_since TEXT,
    
    -- Other Medical Information
    antihypertension_medication TEXT,
    liver_diseases TEXT,
    hyperthyroid BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Create CBC Results Table
CREATE TABLE cbc_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    test_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Red Blood Cell Parameters
    hemoglobin DECIMAL(4,1),
    rbc_count DECIMAL(4,2),
    hematocrit DECIMAL(4,1),
    mcv DECIMAL(5,1),
    mch DECIMAL(4,1),
    mchc DECIMAL(4,1),
    rdw DECIMAL(4,1),
    
    -- White Blood Cell Parameters
    wbc_count DECIMAL(6,2),
    neutrophils_percent DECIMAL(4,1),
    lymphocytes_percent DECIMAL(4,1),
    monocytes_percent DECIMAL(4,1),
    eosinophils_percent DECIMAL(4,1),
    basophils_percent DECIMAL(4,1),
    
    -- Platelet Parameters
    platelet_count INTEGER,
    mpv DECIMAL(3,1),
    
    -- Metadata
    lab_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Reference Ranges (stored as JSON for flexibility)
    reference_ranges JSONB DEFAULT '{
        "hemoglobin": {"min": 12, "max": 17},
        "rbc_count": {"min": 4.0, "max": 5.5},
        "hematocrit": {"min": 36, "max": 48},
        "wbc_count": {"min": 4.0, "max": 11.0},
        "platelet_count": {"min": 150000, "max": 450000}
    }'::jsonb,
    
    CONSTRAINT valid_hemoglobin CHECK (hemoglobin BETWEEN 0 AND 25),
    CONSTRAINT valid_rbc CHECK (rbc_count BETWEEN 0 AND 10),
    CONSTRAINT valid_hematocrit CHECK (hematocrit BETWEEN 0 AND 100),
    CONSTRAINT valid_wbc CHECK (wbc_count BETWEEN 0 AND 100),
    CONSTRAINT valid_platelets CHECK (platelet_count BETWEEN 0 AND 1000000)
);

-- Create Doctor Visits Table
CREATE TABLE doctor_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    doctor_name TEXT NOT NULL,
    reason TEXT,
    diagnosis TEXT,
    prescription TEXT,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_medical_profiles_user_id ON medical_profiles(user_id);
CREATE INDEX idx_cbc_results_user_id ON cbc_results(user_id);
CREATE INDEX idx_cbc_results_test_date ON cbc_results(test_date);
CREATE INDEX idx_doctor_visits_user_id ON doctor_visits(user_id);
CREATE INDEX idx_doctor_visits_visit_date ON doctor_visits(visit_date);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_profiles_updated_at
    BEFORE UPDATE ON medical_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cbc_results_updated_at
    BEFORE UPDATE ON cbc_results
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_visits_updated_at
    BEFORE UPDATE ON doctor_visits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_visits ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Medical profiles policies
CREATE POLICY "Users can view own medical profile"
    ON medical_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own medical profile"
    ON medical_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical profile"
    ON medical_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- CBC results policies
CREATE POLICY "Users can view own CBC results"
    ON cbc_results FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own CBC results"
    ON cbc_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own CBC results"
    ON cbc_results FOR UPDATE
    USING (auth.uid() = user_id);

-- Doctor visits policies
CREATE POLICY "Users can view own doctor visits"
    ON doctor_visits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own doctor visits"
    ON doctor_visits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own doctor visits"
    ON doctor_visits FOR UPDATE
    USING (auth.uid() = user_id);
