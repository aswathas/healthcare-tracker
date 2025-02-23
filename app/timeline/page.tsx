"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import { format } from "date-fns";
import { Stethoscope, FileText, Activity, AlertCircle } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  type: "doctor_visit" | "test_result" | "cbc_test" | "appointment";
  title: string;
  description: string;
  metadata: {
    hospital?: string;
    doctor_name?: string;
    documents?: Record<string, unknown>;
    values?: Record<string, unknown>;
    status?: "normal" | "abnormal" | "critical";
  };
}

export default function Timeline() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    fetchTimelineEvents();
  }, []);

  const fetchTimelineEvents = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }

      // Fetch doctor visits
      const { data: visits, error: visitsError } = await supabase
        .from("doctor_visits")
        .select("*")
        .eq("user_id", session.user.id)
        .order("visit_date", { ascending: false });

      if (visitsError) throw visitsError;

      // Fetch CBC results
      const { data: cbcResults, error: cbcError } = await supabase
        .from("cbc_values")
        .select("*")
        .eq("user_id", session.user.id)
        .order("assessment_date", { ascending: false });

      if (cbcError) throw cbcError;

      // Fetch appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", session.user.id)
        .order("appointment_date", { ascending: false });

      if (appointmentsError) throw appointmentsError;

      // Combine and format all events
      const allEvents: TimelineEvent[] = [
        ...(visits || []).map((visit) => ({
          id: visit.id,
          date: visit.visit_date,
          type: "doctor_visit" as const,
          title: "Doctor Visit",
          description: visit.notes || "Visit with " + visit.doctor_name,
          metadata: {
            doctor_name: visit.doctor_name,
            hospital: visit.hospital_name,
          },
        })),
        ...(cbcResults || []).map((cbc) => ({
          id: cbc.id,
          date: cbc.assessment_date,
          type: "cbc_test" as const,
          title: "CBC Test Results",
          description: "Complete Blood Count Analysis",
          metadata: {
            values: {
              hemoglobin: `${cbc.haemoglobin} g/dL`,
              wbc: `${cbc.total_wbc} K/µL`,
              rbc: `${cbc.rbc} M/µL`,
              platelets: `${cbc.platelets} K/µL`,
            },
            status: determineStatus(cbc),
          },
        })),
        ...(appointments || []).map((apt) => ({
          id: apt.id,
          date: apt.appointment_date,
          type: "appointment" as const,
          title: "Scheduled Appointment",
          description: apt.notes || `Appointment with ${apt.doctor_name}`,
          metadata: {
            doctor_name: apt.doctor_name,
            hospital: apt.hospital_name,
          },
        })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setEvents(allEvents);
    } catch (error) {
      console.error("Error fetching timeline events:", error);
      showToast.error("Failed to load timeline events");
    } finally {
      setLoading(false);
    }
  };

  const determineStatus = (cbc: any): "normal" | "abnormal" | "critical" => {
    // Add your logic to determine CBC status based on values
    return "normal";
  };

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "doctor_visit":
        return <Stethoscope className="h-6 w-6 text-blue-600" />;
      case "cbc_test":
        return <Activity className="h-6 w-6 text-green-600" />;
      case "test_result":
        return <FileText className="h-6 w-6 text-purple-600" />;
      case "appointment":
        return <AlertCircle className="h-6 w-6 text-orange-600" />;
      default:
        return <Activity className="h-6 w-6 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Health Timeline</h1>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.date), "PPP")}
                    </p>
                  </div>
                  {event.metadata.status && (
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        event.metadata.status === "normal"
                          ? "bg-green-100 text-green-800"
                          : event.metadata.status === "abnormal"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {event.metadata.status.charAt(0).toUpperCase() +
                        event.metadata.status.slice(1)}
                    </span>
                  )}
                </div>
                <p className="mt-2">{event.description}</p>
                {event.metadata.doctor_name && (
                  <p className="text-sm text-gray-600 mt-1">
                    Doctor: {event.metadata.doctor_name}
                  </p>
                )}
                {event.metadata.hospital && (
                  <p className="text-sm text-gray-600">
                    Hospital: {event.metadata.hospital}
                  </p>
                )}
                {event.metadata.values && (
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(event.metadata.values).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {events.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No timeline events found</p>
          </div>
        )}
      </div>
    </div>
  );
}
