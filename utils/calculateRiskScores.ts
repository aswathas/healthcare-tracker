import { SurgicalMarkers } from '@/types/surgical-markers';

export interface RiskScores {
  asa_description: string;
  rcri_risk: string;
  surgical_risk: string;
  recommendations: string[];
}

export function calculateDetailedRiskScores(markers: SurgicalMarkers): RiskScores {
  // ASA Score Description
  const asaDescriptions = {
    1: 'Healthy person',
    2: 'Mild systemic disease',
    3: 'Severe systemic disease',
    4: 'Severe systemic disease that is a constant threat to life',
    5: 'Moribund person who is not expected to survive without the operation',
    6: 'Declared brain-dead person whose organs are being removed for donor purposes'
  };

  // RCRI Risk Levels
  const getRCRIRisk = (score: number): string => {
    if (score <= 0) return 'Very Low Risk (0.4% risk of cardiac complications)';
    if (score === 1) return 'Low Risk (0.9% risk of cardiac complications)';
    if (score === 2) return 'Moderate Risk (6.6% risk of cardiac complications)';
    return 'High Risk (>11% risk of cardiac complications)';
  };

  // Calculate Surgical Risk based on scores
  const calculateSurgicalRisk = (markers: SurgicalMarkers): string => {
    const overallScore = markers.overall_surgical_score || 0;
    if (overallScore >= 0.8) return 'Low Risk - Proceed with standard precautions';
    if (overallScore >= 0.6) return 'Moderate Risk - Consider optimization before surgery';
    return 'High Risk - Requires medical optimization before surgery';
  };

  // Generate Recommendations
  const generateRecommendations = (markers: SurgicalMarkers): string[] => {
    const recommendations: string[] = [];

    // Cardiac recommendations
    if ((markers.cardiac_score || 0) < 0.7) {
      if (markers.systolic_bp && (markers.systolic_bp < 90 || markers.systolic_bp > 160)) {
        recommendations.push('Blood pressure optimization recommended');
      }
      if (markers.heart_rate && (markers.heart_rate < 60 || markers.heart_rate > 100)) {
        recommendations.push('Cardiac evaluation recommended');
      }
    }

    // Pulmonary recommendations
    if ((markers.pulmonary_score || 0) < 0.7) {
      if (markers.oxygen_saturation && markers.oxygen_saturation < 94) {
        recommendations.push('Pulmonary optimization recommended');
      }
    }

    // Hematological recommendations
    if ((markers.hematology_score || 0) < 0.7) {
      if (markers.hemoglobin && markers.hemoglobin < 10) {
        recommendations.push('Anemia workup and possible treatment recommended');
      }
      if (markers.platelet_count && markers.platelet_count < 150000) {
        recommendations.push('Hematology consultation recommended');
      }
    }

    // Metabolic recommendations
    if ((markers.metabolic_score || 0) < 0.7) {
      if (markers.blood_glucose && markers.blood_glucose > 180) {
        recommendations.push('Diabetes/blood sugar optimization recommended');
      }
      if (markers.creatinine && markers.creatinine > 1.5) {
        recommendations.push('Renal function optimization recommended');
      }
    }

    // Add general recommendations based on overall score
    if ((markers.overall_surgical_score || 0) < 0.6) {
      recommendations.push('Consider preoperative rehabilitation program');
      recommendations.push('Multi-disciplinary team evaluation recommended');
    }

    return recommendations.length > 0 ? recommendations : ['No specific recommendations at this time'];
  };

  return {
    asa_description: asaDescriptions[markers.asa_score as keyof typeof asaDescriptions] || 'Not assessed',
    rcri_risk: getRCRIRisk(markers.rcri_score || 0),
    surgical_risk: calculateSurgicalRisk(markers),
    recommendations: generateRecommendations(markers)
  };
}
