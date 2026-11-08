import React, { useState, useEffect } from "react";
import { supabase, Patient } from "../../lib/supabase";
import { Search, User, Phone, Mail, Calendar, FileText, Loader2, ArrowRight } from "lucide-react";

interface AdminPatientsProps {
  onOpenCaseHistory: (patientId: string) => void;
}

export const AdminPatients: React.FC<AdminPatientsProps> = ({
  onOpenCaseHistory,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadPatients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPatients(data as Patient[]);
      }
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search patients by name, phone or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Total Registered Patients: <strong>{patients.length}</strong>
          </span>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold font-serif text-white">
            Patient Profiles & Medical History Directory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any patient to review, record or update their clinical case history and visit records.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-2" />
            <p className="text-sm">Loading patient records...</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No patient profiles found. New bookings will automatically create patient records.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="p-5 sm:p-6 hover:bg-slate-950/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">
                      {patient.full_name}
                    </h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        patient.is_existing_patient
                          ? "bg-teal-950 text-teal-300 border-teal-800"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {patient.is_existing_patient ? "Existing Patient" : "New Patient"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <a
                      href={`tel:${patient.phone}`}
                      className="inline-flex items-center gap-1 text-teal-300 hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{patient.phone}</span>
                    </a>
                    {patient.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>{patient.email}</span>
                      </span>
                    )}
                    {patient.city && <span>City: {patient.city}</span>}
                    {patient.age && <span>Age: {patient.age}</span>}
                    {patient.gender && <span>Gender: {patient.gender}</span>}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCaseHistory(patient.id)}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Case History</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
