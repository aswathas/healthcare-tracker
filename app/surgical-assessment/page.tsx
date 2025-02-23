import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SurgicalMarkersForm from '@/components/SurgicalMarkers/SurgicalMarkersForm';
import SurgicalTimeline from '@/components/SurgicalMarkers/SurgicalTimeline';
import SurgicalDashboard from '@/components/SurgicalMarkers/SurgicalDashboard';
import SurgicalVisualization from '@/components/SurgicalMarkers/SurgicalVisualization';
import ExportReport from '@/components/SurgicalMarkers/ExportReport';
import TabNavigation from '@/components/common/TabNavigation';
import { calculateDetailedRiskScores } from '@/utils/calculateRiskScores';

const AI_DESCRIPTION = `
The Surgical Readiness Assessment is a comprehensive evaluation system designed to determine a patient's preparedness for surgical procedures. This assessment:

1. Evaluates Multiple Health Markers:
   • Cardiac function and risk factors
   • Pulmonary capacity and respiratory health
   • Blood composition and clotting factors
   • Metabolic and organ function indicators

2. Calculates Risk Scores:
   • Overall surgical readiness score
   • System-specific health scores
   • ASA (American Society of Anesthesiologists) classification
   • RCRI (Revised Cardiac Risk Index)

3. Provides Recommendations:
   • Personalized health optimization suggestions
   • Pre-operative preparation guidelines
   • Risk mitigation strategies

4. Tracks Progress:
   • Historical health marker trends
   • Improvement in readiness scores
   • Response to interventions

This tool helps healthcare providers make informed decisions about surgical timing and necessary pre-operative optimizations.
`;

export default async function SurgicalAssessmentPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Fetch existing markers
  const { data: markers } = await supabase
    .from('surgical_markers')
    .select('*')
    .eq('user_id', session.user.id)
    .order('assessment_date', { ascending: false });

  const latestMarker = markers?.[0];
  const activeTab = searchParams.tab || 'dashboard';

  // Calculate risk scores for the latest marker
  const riskScores = latestMarker ? calculateDetailedRiskScores(latestMarker) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">Surgical Readiness Assessment</h1>
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 max-w-3xl">
            <p className="text-sm text-blue-700 whitespace-pre-line">{AI_DESCRIPTION}</p>
          </div>
        </div>
        {latestMarker && <ExportReport marker={latestMarker} />}
      </div>
      
      <TabNavigation
        tabs={[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'visualization', label: 'Visualization' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'new-assessment', label: 'New Assessment' },
        ]}
        activeTab={activeTab}
      />
      
      <div className="mt-8">
        {activeTab === 'dashboard' && latestMarker && (
          <div className="space-y-6">
            <SurgicalDashboard marker={latestMarker} />
            
            {/* Risk Assessment Section */}
            {riskScores && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Classification</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-500">ASA Classification</div>
                        <div className="text-lg font-medium">{riskScores.asa_description}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">RCRI Risk Level</div>
                        <div className="text-lg font-medium">{riskScores.rcri_risk}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Overall Surgical Risk</div>
                        <div className="text-lg font-medium">{riskScores.surgical_risk}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {riskScores.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'visualization' && latestMarker && (
          <SurgicalVisualization marker={latestMarker} />
        )}
        
        {activeTab === 'timeline' && markers && markers.length > 0 && (
          <SurgicalTimeline markers={markers} />
        )}
        
        {activeTab === 'new-assessment' && (
          <SurgicalMarkersForm />
        )}
        
        {(activeTab === 'dashboard' || activeTab === 'visualization') && !latestMarker && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No assessments yet</h3>
            <p className="mt-2 text-sm text-gray-500">
              Start by creating a new surgical readiness assessment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
