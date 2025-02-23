'use client';

import { MedicalProfile, GenderType, BloodType, DialysisType } from '@/types/medical-profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneralMedicalFormProps {
  profile: Partial<MedicalProfile>;
  onChange: (profile: Partial<MedicalProfile>) => void;
}

export default function GeneralMedicalForm({ profile, onChange }: GeneralMedicalFormProps) {
  const handleChange = (field: keyof MedicalProfile, value: any) => {
    onChange({ ...profile, [field]: value });
  };

  const handleNestedChange = (category: string, field: string, value: any) => {
    onChange({
      ...profile,
      [category]: {
        ...(profile[category as keyof MedicalProfile] || {}),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={profile?.age || ''}
            onChange={(e) => handleChange('age', parseInt(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select
            value={profile?.sex || ''}
            onValueChange={(value) => handleChange('sex', value as GenderType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="blood_type">Blood Type</Label>
          <Select
            value={profile?.blood_type || ''}
            onValueChange={(value) => handleChange('blood_type', value as BloodType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Blood Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={profile?.height || ''}
            onChange={(e) => handleChange('height', parseFloat(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={profile?.weight || ''}
            onChange={(e) => handleChange('weight', parseFloat(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
          <Input
            id="emergency_contact_name"
            value={profile?.emergency_contact_name || ''}
            onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
          <Input
            id="emergency_contact_phone"
            value={profile?.emergency_contact_phone || ''}
            onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
          />
        </div>
      </div>

      {/* Pregnancy Information */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Pregnancy Information</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={profile?.pregnancy?.is_pregnant || false}
              onCheckedChange={(checked) => handleNestedChange('pregnancy', 'is_pregnant', checked)}
            />
            <span>Currently Pregnant</span>
          </label>
          {profile?.pregnancy?.is_pregnant && (
            <div className="space-y-2">
              <Label htmlFor="pregnancy_months">Months</Label>
              <Input
                id="pregnancy_months"
                type="number"
                min="1"
                max="9"
                value={profile?.pregnancy?.months || ''}
                onChange={(e) => handleNestedChange('pregnancy', 'months', parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Cardiac Conditions */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Cardiac Conditions</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={profile?.cardiac?.has_condition || false}
              onCheckedChange={(checked) => handleNestedChange('cardiac', 'has_condition', checked)}
            />
            <span>Has Cardiac Condition</span>
          </label>
          {profile?.cardiac?.has_condition && (
            <div className="space-y-2 pl-6">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={profile?.cardiac?.ccf || false}
                  onCheckedChange={(checked) => handleNestedChange('cardiac', 'ccf', checked)}
                />
                <span>Congestive Cardiac Failure (CCF)</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={profile?.cardiac?.valvular_heart_disease || false}
                  onCheckedChange={(checked) => handleNestedChange('cardiac', 'valvular_heart_disease', checked)}
                />
                <span>Valvular Heart Disease</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={profile?.cardiac?.cardiomyopathy || false}
                  onCheckedChange={(checked) => handleNestedChange('cardiac', 'cardiomyopathy', checked)}
                />
                <span>Cardiomyopathy</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Pulmonary Conditions */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Pulmonary Conditions</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={profile?.pulmonary?.copd || false}
              onCheckedChange={(checked) => handleNestedChange('pulmonary', 'copd', checked)}
            />
            <span>COPD</span>
          </label>
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={profile?.pulmonary?.asthma || false}
              onCheckedChange={(checked) => handleNestedChange('pulmonary', 'asthma', checked)}
            />
            <span>Asthma</span>
          </label>
        </div>
      </div>

      {/* Renal Information */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Renal Information</h3>
        <div className="space-y-2">
          <Label>Dialysis Type</Label>
          <Select
            value={profile?.renal?.dialysis_type || ''}
            onValueChange={(value) => handleNestedChange('renal', 'dialysis_type', value as DialysisType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Dialysis Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="post_transplant">Post Transplant</SelectItem>
              <SelectItem value="just_prior">Just Prior</SelectItem>
              <SelectItem value="immediate_post">Immediate Post</SelectItem>
              <SelectItem value="intermittent">Intermittent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Diabetes Information */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Diabetes Information</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={profile?.diabetes?.is_diabetic || false}
              onCheckedChange={(checked) => handleNestedChange('diabetes', 'is_diabetic', checked)}
            />
            <span>Has Diabetes</span>
          </label>
          {profile?.diabetes?.is_diabetic && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={profile?.diabetes?.type || ''}
                  onValueChange={(value) => handleNestedChange('diabetes', 'type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Diabetes Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HB">HB</SelectItem>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={profile?.diabetes?.on_insulin || false}
                  onCheckedChange={(checked) => handleNestedChange('diabetes', 'on_insulin', checked)}
                />
                <span>On Insulin</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Other Medical Conditions */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Other Medical Conditions</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={profile?.hyperthyroid || false}
              onCheckedChange={(checked) => handleChange('hyperthyroid', checked)}
            />
            <span>Hyperthyroid</span>
          </label>
          <div className="space-y-2">
            <Label htmlFor="liver_diseases">Liver Diseases (if any)</Label>
            <Input
              id="liver_diseases"
              value={profile?.liver_diseases || ''}
              onChange={(e) => handleChange('liver_diseases', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
