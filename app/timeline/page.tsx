"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import { format } from "date-fns";
import { Stethoscope, FileText, Activity, AlertCircle, Pill, Calendar, ChevronDown } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  type: "doctor_visit" | "test_result" | "cbc_test" | "appointment" | "medication";
  title: string;
  description: string;
  metadata: {
    hospital?: string;
    doctor_name?: string;
    documents?: Record<string, unknown>;
    values?: Record<string, unknown>;
    status?: "normal" | "abnormal" | "critical";
    medication?: {
      name: string;
      dosage: string;
      adherence: boolean;
      lastTaken?: string;
    };
  };
}

export default function Timeline() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
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

      // Fetch all relevant data in parallel
      const [
        visitsResult,
        cbcResult,
        medicationsResult,
        appointmentsResult,
      ] = await Promise.all([
        supabase
          .from("doctor_visits")
          .select("*")
          .eq("user_id", session.user.id)
          .order("visit_date", { ascending: false }),
        supabase
          .from("cbc_tests")
          .select("*")
          .eq("user_id", session.user.id)
          .order("test_date", { ascending: false }),
        supabase
          .from("medications")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("appointments")
          .select("*")
          .eq("user_id", session.user.id)
          .order("appointment_date", { ascending: false }),
      ]);

      const timelineEvents: TimelineEvent[] = [];

      // Process doctor visits
      if (visitsResult.data) {
        timelineEvents.push(
          ...visitsResult.data.map((visit) => ({
            id: visit.id,
            date: visit.visit_date,
            type: "doctor_visit",
            title: `Doctor Visit: ${visit.doctor_name}`,
            description: visit.notes || "No notes provided",
            metadata: {
              hospital: visit.hospital,
              doctor_name: visit.doctor_name,
              documents: visit.documents,
            },
          }))
        );
      }

      // Process CBC tests
      if (cbcResult.data) {
        timelineEvents.push(
          ...cbcResult.data.map((test) => ({
            id: test.id,
            date: test.test_date,
            type: "cbc_test",
            title: "CBC Test Results",
            description: `WBC: ${test.wbc}, RBC: ${test.rbc}, Platelets: ${test.platelets}`,
            metadata: {
              values: {
                wbc: test.wbc,
                rbc: test.rbc,
                platelets: test.platelets,
                hemoglobin: test.hemoglobin,
              },
              status: test.status,
            },
          }))
        );
      }

      // Process medications
      if (medicationsResult.data) {
        timelineEvents.push(
          ...medicationsResult.data.map((med) => ({
            id: med.id,
            date: med.lastTaken || med.created_at,
            type: "medication",
            title: `Medication: ${med.name}`,
            description: `${med.dosage} - ${med.frequency}`,
            metadata: {
              medication: {
                name: med.name,
                dosage: med.dosage,
                adherence: med.lastTaken ? true : false,
                lastTaken: med.lastTaken,
              },
            },
          }))
        );
      }

      // Process appointments
      if (appointmentsResult.data) {
        timelineEvents.push(
          ...appointmentsResult.data.map((apt) => ({
            id: apt.id,
            date: apt.appointment_date,
            type: "appointment",
            title: "Scheduled Appointment",
            description: apt.notes || `Appointment with ${apt.doctor_name}`,
            metadata: {
              doctor_name: apt.doctor_name,
              hospital: apt.hospital_name,
            },
          }))
        );
      }

      // Sort all events by date
      timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEvents(timelineEvents);
    } catch (error) {
      showToast("error", "Failed to fetch timeline data");
      console.error("Error fetching timeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEventExpansion = (id: string) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getEventIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "doctor_visit":
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case "test_result":
      case "cbc_test":
        return <FileText className="h-5 w-5 text-purple-500" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-green-500" />;
      case "medication":
        return <Pill className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.type === "cbc_test" && event.metadata.status) {
      switch (event.metadata.status) {
        case "normal":
          return "bg-green-50 border-green-200";
        case "abnormal":
          return "bg-yellow-50 border-yellow-200";
        case "critical":
          return "bg-red-50 border-red-200";
      }
    }

    switch (event.type) {
      case "doctor_visit":
        return "bg-blue-50 border-blue-200";
      case "medication":
        return event.metadata.medication?.adherence
          ? "bg-green-50 border-green-200"
          : "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Health Timeline</h1>
        <p className="text-gray-600">Track your health journey</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading timeline...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border ${getEventColor(event)} transition-all`}
            >
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => toggleEventExpansion(event.id)}
              >
                <div className="mt-1">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedEvents.has(event.id) ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.date), "PPP")}
                  </p>
                </div>
              </div>

              {expandedEvents.has(event.id) && (
                <div className="mt-4 pl-12">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>{event.description}</p>

                    {event.type === "doctor_visit" && (
                      <>
                        <p>
                          <span className="font-medium">Hospital:</span> {event.metadata.hospital}
                        </p>
                        <p>
                          <span className="font-medium">Doctor:</span> {event.metadata.doctor_name}
                        </p>
                      </>
                    )}

                    {event.type === "cbc_test" && event.metadata.values && (
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(event.metadata.values).map(([key, value]) => (
                          <p key={key}>
                            <span className="font-medium">{key.toUpperCase()}:</span> {value}
                          </p>
                        ))}
                      </div>
                    )}

                    {event.type === "medication" && event.metadata.medication && (
                      <>
                        <p>
                          <span className="font-medium">Dosage:</span> {event.metadata.medication.dosage}
                        </p>
                        {event.metadata.medication.lastTaken && (
                          <p>
                            <span className="font-medium">Last Taken:</span>{" "}
                            {format(new Date(event.metadata.medication.lastTaken), "PPP p")}
                          </p>
                        )}
                        <p
                          className={`font-medium ${
                            event.metadata.medication.adherence ? "text-green-600" : "text-orange-600"
                          }`}
                        >
                          Status: {event.metadata.medication.adherence ? "Taken" : "Missed"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
