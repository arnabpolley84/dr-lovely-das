import React, { useState, useEffect } from "react";
import { supabase, getKolkataDateString, formatReadableDate } from "../../lib/supabase";
import { checkDateCapacity } from "../../lib/appointmentService";
import { AdminAvailability } from "./AdminAvailability";
import { AdminAppointments } from "./AdminAppointments";
import { AdminPatients } from "./AdminPatients";
import { AdminCaseHistoryModal } from "./AdminCaseHistoryModal";
import { AdminDatabaseSetup } from "./AdminDatabaseSetup";
import {
  Shield,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  ArrowLeft,
  Settings,
  FileText,
  Activity,
  Layers,
  Database,
  BarChart3,
  Loader2,
} from "lucide-react";

interface AdminDashboardProps {
  onSignOut: () => void;
  onReturnToWebsite: () => void;
}

type AdminTab = "overview" | "appointments" | "availability" | "patients" | "database";

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSignOut,
  onReturnToWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [adminEmail, setAdminEmail] = useState<string>("admin@dr-lovelydas-clinic.com");

  // Metrics
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const [upcomingAppointmentsCount, setUpcomingAppointmentsCount] = useState(0);
  const [totalPatientsCount, setTotalPatientsCount] = useState(0);
  const [newPatientsCount, setNewPatientsCount] = useState(0);
  const [existingPatientsCount, setExistingPatientsCount] = useState(0);
  const [todayCapacityRemaining, setTodayCapacityRemaining] = useState<number | null>(null);
  const [todayMaxCapacity, setTodayMaxCapacity] = useState<number>(12);

  // Selected patient for Case History modal
  const [caseHistoryPatientId, setCaseHistoryPatientId] = useState<string | null>(null);
  const [caseHistoryAppointmentId, setCaseHistoryAppointmentId] = useState<string | null>(null);

  const todayStr = getKolkataDateString();

  useEffect(() => {
    async function loadAdminUserAndMetrics() {
      setLoadingMetrics(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email) {
          setAdminEmail(userData.user.email);
        }

        // 1. Today's appointments count
        const { count: todayCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("appointment_date", todayStr)
          .neq("status", "cancelled");

        setTodayAppointmentsCount(todayCount || 0);

        // 2. Upcoming appointments count (future dates)
        const { count: upcomingCount } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("appointment_date", todayStr)
          .neq("status", "cancelled");

        setUpcomingAppointmentsCount(upcomingCount || 0);

        // 3. Patients count & new vs existing
        const { data: patientsList } = await supabase
          .from("patients")
          .select("id, is_existing_patient");

        if (patientsList) {
          setTotalPatientsCount(patientsList.length);
          const existing = patientsList.filter((p) => p.is_existing_patient).length;
          setExistingPatientsCount(existing);
          setNewPatientsCount(patientsList.length - existing);
        }

        // 4. Today's capacity
        const cap = await checkDateCapacity(todayStr);
        setTodayCapacityRemaining(cap.remainingSlots);
        setTodayMaxCapacity(cap.maxPatients);
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoadingMetrics(false);
      }
    }

    loadAdminUserAndMetrics();
  }, [todayStr]);

  const handleOpenCaseHistory = (patientId: string, appointmentId?: string) => {
    setCaseHistoryPatientId(patientId);
    setCaseHistoryAppointmentId(appointmentId || null);
  };

  const handleCloseCaseHistory = () => {
    setCaseHistoryPatientId(null);
    setCaseHistoryAppointmentId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md">
                <Shield className="w-5 h-5 text-teal-100" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold font-serif text-white tracking-tight leading-tight">
                  Dr. Lovely Das, MDS
                </h1>
                <p className="text-[11px] font-semibold text-teal-400 tracking-wider uppercase">
                  Endodontic Clinic Admin Management
                </p>
              </div>
            </div>

            {/* Right Controls: User info, return to website, logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline-flex text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {adminEmail}
              </span>

              <button
                type="button"
                onClick={onReturnToWebsite}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                title="View patient website"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Website</span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-medium transition-colors cursor-pointer"
                title="Sign out of admin portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Tab Navigation Bar */}
      <div className="bg-slate-900/50 border-b border-slate-800 sticky top-16 sm:top-20 z-30 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-3 py-2.5">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "appointments"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments</span>
            </button>

            <button
              onClick={() => setActiveTab("availability")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "availability"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Doctor Availability</span>
            </button>

            <button
              onClick={() => setActiveTab("patients")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "patients"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patients & Case History</span>
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === "database"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database Setup & Health</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ================================================================ */}
        {/* TAB 1: OVERVIEW & ANALYTICS                                      */}
        {/* ================================================================ */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Today's Appointments */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Today&apos;s Appointments
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center border border-teal-800">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-white">
                  {loadingMetrics ? <Loader2 className="w-6 h-6 animate-spin text-teal-500" /> : todayAppointmentsCount}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Date: {formatReadableDate(todayStr)}
                </p>
              </div>

              {/* Remaining Slots Today */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Today&apos;s Slots Remaining
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-emerald-400">
                  {loadingMetrics ? (
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  ) : todayCapacityRemaining !== null ? (
                    `${todayCapacityRemaining} / ${todayMaxCapacity}`
                  ) : (
                    "Available"
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Max capacity: {todayMaxCapacity} patients/day
                </p>
              </div>

              {/* Upcoming Appointments */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Upcoming Bookings
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-800">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-white">
                  {loadingMetrics ? <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> : upcomingAppointmentsCount}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Scheduled across future active days
                </p>
              </div>

              {/* Total Patients */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Patients
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center border border-purple-800">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-bold font-serif text-white">
                  {loadingMetrics ? <Loader2 className="w-6 h-6 animate-spin text-purple-500" /> : totalPatientsCount}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {newPatientsCount} New · {existingPatientsCount} Existing
                </p>
              </div>
            </div>

            {/* Quick Action Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white mb-2">
                    Manage Today&apos;s Appointments
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Review patient arrivals, mark consultations as completed or cancelled, inspect uploaded prescriptions, and record diagnostic case notes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors cursor-pointer text-center"
                >
                  Go to Appointments Management →
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white mb-2">
                    Doctor Availability & Holiday Blocker
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    Adjust operating hours, increase or decrease daily patient caps, block holidays or emergency leaves, and prevent double bookings.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("availability")}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors cursor-pointer text-center"
                >
                  Configure Doctor Availability →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: APPOINTMENTS                                              */}
        {/* ================================================================ */}
        {activeTab === "appointments" && (
          <AdminAppointments onOpenCaseHistory={handleOpenCaseHistory} />
        )}

        {/* ================================================================ */}
        {/* TAB 3: DOCTOR AVAILABILITY & BLOCKED DATES                       */}
        {/* ================================================================ */}
        {activeTab === "availability" && <AdminAvailability />}

        {/* ================================================================ */}
        {/* TAB 4: PATIENTS DIRECTORY & CASE HISTORY                         */}
        {/* ================================================================ */}
        {activeTab === "patients" && (
          <AdminPatients onOpenCaseHistory={handleOpenCaseHistory} />
        )}

        {/* ================================================================ */}
        {/* TAB 5: DATABASE SETUP & HEALTH CHECK                             */}
        {/* ================================================================ */}
        {activeTab === "database" && <AdminDatabaseSetup />}
      </main>

      {/* Global Case History Modal */}
      {caseHistoryPatientId && (
        <AdminCaseHistoryModal
          patientId={caseHistoryPatientId}
          appointmentId={caseHistoryAppointmentId}
          onClose={handleCloseCaseHistory}
        />
      )}
    </div>
  );
};
