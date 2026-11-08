import React, { useState, useEffect } from "react";
import {
  supabase,
  Patient,
  PatientCaseHistory,
  formatReadableDate,
  getKolkataDateString,
} from "../../lib/supabase";
import {
  X,
  FileText,
  Calendar,
  Stethoscope,
  Plus,
  Loader2,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
  Save,
} from "lucide-react";

interface AdminCaseHistoryModalProps {
  patientId: string | null;
  appointmentId?: string | null;
  onClose: () => void;
}

export const AdminCaseHistoryModal: React.FC<AdminCaseHistoryModalProps> = ({
  patientId,
  appointmentId,
  onClose,
}) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [caseHistories, setCaseHistories] = useState<PatientCaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // New Record Form State
  const [visitDate, setVisitDate] = useState(getKolkataDateString());
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [surgeryDetails, setSurgeryDetails] = useState("");
  const [doctorAdvice, setDoctorAdvice] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");

  useEffect(() => {
    if (!patientId) return;

    let isMounted = true;
    async function loadPatientAndRecords() {
      setLoading(true);
      try {
        // Load Patient profile
        const { data: pData } = await supabase
          .from("patients")
          .select("*")
          .eq("id", patientId)
          .single();

        // Load Case History
        const { data: cData } = await supabase
          .from("patient_case_history")
          .select("*")
          .eq("patient_id", patientId)
          .order("visit_date", { ascending: false });

        if (isMounted) {
          if (pData) setPatient(pData as Patient);
          if (cData) setCaseHistories(cData as PatientCaseHistory[]);
          if (!cData || cData.length === 0) {
            setShowAddForm(true); // Open form if no records yet
          }
        }
      } catch (err) {
        console.error("Failed to load patient history:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPatientAndRecords();
    return () => {
      isMounted = false;
    };
  }, [patientId]);

  if (!patientId) return null;

  const handleSaveCaseHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || !treatment.trim()) {
      setErrorMessage("Diagnosis and Treatment fields are required.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const { data, error } = await supabase
        .from("patient_case_history")
        .insert({
          patient_id: patientId,
          appointment_id: appointmentId || null,
          visit_date: visitDate,
          diagnosis: diagnosis.trim(),
          treatment: treatment.trim(),
          surgery_details: surgeryDetails.trim() || null,
          doctor_advice: doctorAdvice.trim() || null,
          follow_up_date: followUpDate || null,
          notes: clinicalNotes.trim() || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setCaseHistories((prev) => [data as PatientCaseHistory, ...prev]);
        setStatusMessage("Clinical case history recorded successfully.");
        // Reset form
        setDiagnosis("");
        setTreatment("");
        setSurgeryDetails("");
        setDoctorAdvice("");
        setFollowUpDate("");
        setClinicalNotes("");
        setShowAddForm(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to record case history";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 mb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider bg-teal-950 px-2.5 py-0.5 rounded border border-teal-800">
                Medical Records
              </span>
              <span className="text-xs text-slate-400">Dr. Lovely Das Clinic</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
              Patient Case History: {patient?.full_name || "Patient"}
            </h3>
            <p className="text-xs text-slate-400">
              Phone: {patient?.phone} {patient?.age ? `· Age: ${patient.age}` : ""} {patient?.gender ? `· Gender: ${patient.gender}` : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Add Record Trigger Button */}
        {!showAddForm && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Visit / Case Notes</span>
            </button>
          </div>
        )}

        {/* Add Record Form */}
        {showAddForm && (
          <form
            onSubmit={handleSaveCaseHistory}
            className="mb-8 p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>New Visit Clinical Record</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Visit Date *
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Follow-up Date (Optional)
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Clinical Diagnosis *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Irreversible Pulpitis #36, Apical Periodontitis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Treatment Performed / Planned *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Single-visit RCT initiated, canal shaping with rotary files, calcium hydroxide dressing placed..."
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Surgery / Endodontic Specifics (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Working length: MB 21mm, ML 20.5mm, D 22mm. Sealer: Bioceramic."
                value={surgeryDetails}
                onChange={(e) => setSurgeryDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Doctor&apos;s Advice & Prescriptions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Amoxicillin 500mg tid 5 days, avoid hard chewing on left side until crown placement."
                value={doctorAdvice}
                onChange={(e) => setDoctorAdvice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Clinical Entry</span>
              </button>
            </div>
          </form>
        )}

        {/* Chronological List of Historical Visits */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Case History Records ({caseHistories.length})
          </h4>

          {loading ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-500" />
              Loading medical records...
            </div>
          ) : caseHistories.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
              No historical case entries recorded for this patient yet.
            </div>
          ) : (
            <div className="space-y-3">
              {caseHistories.map((entry) => (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Visit Date: {formatReadableDate(entry.visit_date)}</span>
                    </div>
                    {entry.follow_up_date && (
                      <span className="text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                        Follow-up: {formatReadableDate(entry.follow_up_date)}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Diagnosis:
                    </span>
                    <p className="text-xs font-semibold text-white mt-0.5">
                      {entry.diagnosis}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Treatment:
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5 whitespace-pre-line">
                      {entry.treatment}
                    </p>
                  </div>

                  {entry.surgery_details && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Surgery & Endodontic Details:
                      </span>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {entry.surgery_details}
                      </p>
                    </div>
                  )}

                  {entry.doctor_advice && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                      <strong className="text-teal-300 block mb-0.5">Doctor&apos;s Advice:</strong>
                      {entry.doctor_advice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
