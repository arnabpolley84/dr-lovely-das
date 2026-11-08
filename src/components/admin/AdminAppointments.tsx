import React, { useState, useEffect, useCallback } from "react";
import {
  supabase,
  Appointment,
  AppointmentStatus,
  formatReadableDate,
  getKolkataDateString,
} from "../../lib/supabase";
import { getPrescriptionSignedUrl } from "../../lib/appointmentService";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  Eye,
  RefreshCw,
  X,
} from "lucide-react";

interface AdminAppointmentsProps {
  onOpenCaseHistory: (patientId: string, appointmentId?: string) => void;
}

export const AdminAppointments: React.FC<AdminAppointmentsProps> = ({
  onOpenCaseHistory,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [customDate, setCustomDate] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Prescription Viewer Modal State
  const [viewingPrescriptionUrl, setViewingPrescriptionUrl] = useState<string | null>(null);
  const [viewingDocTitle, setViewingDocTitle] = useState("");
  const [loadingPrescription, setLoadingPrescription] = useState(false);

  const todayStr = getKolkataDateString();

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("appointments")
        .select(`
          *,
          patient:patients (*)
        `)
        .order("appointment_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (dateFilter === "today") {
        query = query.eq("appointment_date", todayStr);
      } else if (dateFilter === "tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query.eq("appointment_date", getKolkataDateString(tomorrow));
      } else if (dateFilter === "custom" && customDate) {
        query = query.eq("appointment_date", customDate);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (!error && data) {
        setAppointments(data as Appointment[]);
      }
    } catch (err) {
      console.error("Failed to load appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, customDate, statusFilter, todayStr]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Update appointment status (e.g. 'completed', 'cancelled', 'no-show', 'confirmed')
  const handleStatusChange = async (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => {
    setUpdatingId(appointmentId);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", appointmentId);

      if (error) throw error;

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // View prescription with secure signed URL from private bucket
  const handleViewPrescription = async (filePath: string, bookingId: string) => {
    setLoadingPrescription(true);
    setViewingDocTitle(`Prescription for Booking ${bookingId}`);

    try {
      const signedUrl = await getPrescriptionSignedUrl(filePath);
      if (signedUrl) {
        setViewingPrescriptionUrl(signedUrl);
      } else {
        alert("Prescription file could not be retrieved from private storage.");
      }
    } catch (err) {
      console.error("Prescription load error:", err);
      alert("Error loading prescription file.");
    } finally {
      setLoadingPrescription(false);
    }
  };

  // Filter appointments by search query (Booking ID, patient name, phone)
  const filteredAppointments = appointments.filter((appt) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const bookingMatch = appt.booking_id.toLowerCase().includes(q);
    const patientNameMatch =
      appt.patient?.full_name?.toLowerCase().includes(q) || false;
    const phoneMatch = appt.patient?.phone?.includes(q) || false;

    return bookingMatch || patientNameMatch || phoneMatch;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
            Confirmed
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-950 text-teal-300 border border-teal-800">
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
            Cancelled (Slot Released)
          </span>
        );
      case "no-show":
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
            No-Show
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Booking ID (LD-...), Patient Name or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Date Quick Filter */}
          <div className="md:col-span-4 flex items-center gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today ({formatReadableDate(todayStr)})</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="custom">Custom Date...</option>
            </select>

            {dateFilter === "custom" && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
              />
            )}
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed Only</option>
              <option value="completed">Completed Only</option>
              <option value="cancelled">Cancelled Only</option>
              <option value="no-show">No-Show Only</option>
            </select>

            <button
              onClick={loadAppointments}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Refresh appointments"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-serif text-white">
              Appointments Management ({filteredAppointments.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Review bookings, manage visit statuses, view prescriptions and record clinical case histories.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-2" />
            <p className="text-sm">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No appointments found matching your filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredAppointments.map((appt) => {
              const isUpdating = updatingId === appt.id;

              return (
                <div
                  key={appt.id}
                  className="p-5 sm:p-6 hover:bg-slate-950/40 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Booking ID, Patient Name & Info */}
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-teal-400">
                        {appt.booking_id}
                      </span>
                      {getStatusBadge(appt.status)}
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {appt.patient_type === "existing"
                          ? "Existing Patient"
                          : "New Patient"}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{appt.patient?.full_name || "Patient"}</span>
                      {appt.patient?.age && (
                        <span className="text-xs font-normal text-slate-400">
                          ({appt.patient.age} yrs, {appt.patient.gender || "N/A"})
                        </span>
                      )}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <a
                        href={`tel:${appt.patient?.phone}`}
                        className="inline-flex items-center gap-1 text-teal-300 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{appt.patient?.phone}</span>
                      </a>
                      <span>·</span>
                      <span>{appt.service_type}</span>
                    </div>

                    {appt.symptoms_note && (
                      <p className="text-xs text-slate-400 italic bg-slate-950 p-2 rounded-lg border border-slate-800">
                        &ldquo;{appt.symptoms_note}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Middle Column: Scheduled Date & Time */}
                  <div className="text-left lg:text-center min-w-[150px]">
                    <div className="flex items-center lg:justify-center gap-1.5 text-xs font-semibold text-white">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      <span>{formatReadableDate(appt.appointment_date)}</span>
                    </div>
                    <div className="flex items-center lg:justify-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{appt.appointment_time}</span>
                    </div>
                  </div>

                  {/* Right Column: Actions (Prescription, Status, Case History) */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* View Prescription Button (if uploaded) */}
                    {appt.prescription_file_path && (
                      <button
                        type="button"
                        onClick={() =>
                          handleViewPrescription(
                            appt.prescription_file_path!,
                            appt.booking_id
                          )
                        }
                        className="px-3 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 border border-teal-800 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="View uploaded prescription"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-400" />
                        <span>Prescription</span>
                      </button>
                    )}

                    {/* Case History Trigger */}
                    <button
                      type="button"
                      onClick={() =>
                        onOpenCaseHistory(appt.patient_id, appt.id)
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                    >
                      <User className="w-3.5 h-3.5 text-teal-400" />
                      <span>Case History</span>
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={appt.status}
                      disabled={isUpdating}
                      onChange={(e) =>
                        handleStatusChange(
                          appt.id,
                          e.target.value as AppointmentStatus
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No-Show</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prescription Viewer Modal */}
      {viewingPrescriptionUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setViewingPrescriptionUrl(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <FileText className="w-4 h-4 text-teal-400" />
                <span>{viewingDocTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewingPrescriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-xs text-teal-400 hover:text-white rounded-lg bg-slate-800"
                  title="Open full view"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setViewingPrescriptionUrl(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-black rounded-xl p-2 flex items-center justify-center min-h-[350px]">
              {viewingPrescriptionUrl.endsWith(".pdf") ? (
                <iframe
                  src={viewingPrescriptionUrl}
                  title="Prescription PDF"
                  className="w-full h-full min-h-[500px] rounded-lg"
                />
              ) : (
                <img
                  src={viewingPrescriptionUrl}
                  alt="Prescription document"
                  className="max-h-[65vh] max-w-full object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
