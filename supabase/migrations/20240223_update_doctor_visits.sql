-- Update doctor_visits table schema
ALTER TABLE doctor_visits
DROP COLUMN IF EXISTS symptoms,
DROP COLUMN IF EXISTS prescription;

-- Add new columns
ALTER TABLE doctor_visits
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS reason TEXT,
ADD COLUMN IF NOT EXISTS prescription TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add comment to describe the table
COMMENT ON TABLE doctor_visits IS 'Stores information about patient doctor visits';

-- Add comments on columns
COMMENT ON COLUMN doctor_visits.specialty IS 'Medical specialty of the doctor';
COMMENT ON COLUMN doctor_visits.reason IS 'Reason for the visit';
COMMENT ON COLUMN doctor_visits.prescription IS 'Prescribed medications and instructions';
COMMENT ON COLUMN doctor_visits.updated_at IS 'Last update timestamp';

-- Create an update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_doctor_visits_updated_at
    BEFORE UPDATE ON doctor_visits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
