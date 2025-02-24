"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";

interface CBCProfile {
  id?: number;
  user_id: string;
  hemoglobin: number;
  hematocrit: number;
  white_blood_cells: number;
  platelets: number;
  mean_corpuscular_volume: number;
  mean_corpuscular_hemoglobin: number;
  red_blood_cells: number;
  created_at?: string;
  updated_at?: string;
}

const defaultCBC: Partial<CBCProfile> = {
  hemoglobin: 0,
  hematocrit: 0,
  white_blood_cells: 0,
  platelets: 0,
  mean_corpuscular_volume: 0,
  mean_corpuscular_hemoglobin: 0,
  red_blood_cells: 0,
};

export default function CBCProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<CBCProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      if (authLoading) return;

      if (!user) {
        router.push("/auth/login");
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("cbc_profiles")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        setProfile(data || { ...defaultCBC, user_id: user.id } as CBCProfile);
      } catch (error) {
        console.error("Error fetching CBC profile:", error);
        setError(error instanceof Error ? error.message : "Failed to load CBC profile");
        toast.error("Failed to load CBC profile");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("cbc_profiles")
        .insert({
          ...profile,
          user_id: user.id,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success("CBC profile updated successfully");
    } catch (error) {
      console.error("Error saving CBC profile:", error);
      toast.error("Failed to save CBC profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CBCProfile, value: number) => {
    setProfile((prev) => prev ? { ...prev, [field]: value } : null);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Blood Count (CBC)</h1>
        
        {profile && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="hemoglobin" className="block text-sm font-medium text-gray-700">
                  Hemoglobin (g/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="hemoglobin"
                  value={profile.hemoglobin}
                  onChange={(e) => handleInputChange("hemoglobin", parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="hematocrit" className="block text-sm font-medium text-gray-700">
                  Hematocrit (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="hematocrit"
                  value={profile.hematocrit}
                  onChange={(e) => handleInputChange("hematocrit", parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="wbc" className="block text-sm font-medium text-gray-700">
                  White Blood Cells (K/µL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="wbc"
                  value={profile.white_blood_cells}
                  onChange={(e) => handleInputChange("white_blood_cells", parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="platelets" className="block text-sm font-medium text-gray-700">
                  Platelets (K/µL)
                </label>
                <input
                  type="number"
                  step="1"
                  id="platelets"
                  value={profile.platelets}
                  onChange={(e) => handleInputChange("platelets", parseInt(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="mcv" className="block text-sm font-medium text-gray-700">
                  Mean Corpuscular Volume (fL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="mcv"
                  value={profile.mean_corpuscular_volume}
                  onChange={(e) => handleInputChange("mean_corpuscular_volume", parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="mch" className="block text-sm font-medium text-gray-700">
                  Mean Corpuscular Hemoglobin (pg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="mch"
                  value={profile.mean_corpuscular_hemoglobin}
                  onChange={(e) => handleInputChange("mean_corpuscular_hemoglobin", parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="rbc" className="block text-sm font-medium text-gray-700">
                  Red Blood Cells (M/µL)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="rbc"
                  value={profile.red_blood_cells}
                  onChange={(e) => handleInputChange("red_blood_cells", parseFloat(e.target.value) || 0)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
