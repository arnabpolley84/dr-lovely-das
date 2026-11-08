import React, { useState, useEffect } from "react";
import {
  supabase,
  DoctorAvailability,
  BlockedDate,
  DAY_NAMES,
  getKolkataDateString,
  formatReadableDate,
} from "../../lib/supabase";
import {
  fetchDoctorAvailability,
  fetchBlockedDates,
} from "../../lib/appointmentService";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  Save,
} from "lucide-react";

export const AdminAvailability: React.FC = () => {
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // New blocked date form state
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const [newBlockedReason, setNewBlockedReason] = useState("");
  const [addingBlocked, setAddingBlocked] = useState(false);

  const minDate = getKolkataDateString();

  const loadData = async () => {
    setLoading(true);
    try {
      const [avail, blocked] = await Promise.all([
        fetchDoctorAvailability(),
        fetchBlockedDates(),
      ]);
      setAvailability(avail);
      setBlockedDates(blocked);
    } catch (err) {
      console.error("Failed to load availability data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSchedule = async (daySchedule: DoctorAvailability) => {
    setSavingDay(daySchedule.day_of_week);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("doctor_availability")
        .upsert(
          {
            day_of_week: daySchedule.day_of_week,
            start_time: daySchedule.start_time,
            end_time: daySchedule.end_time,
            max_patients: Number(daySchedule.max_patients),
            is_active: daySchedule.is_active,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "day_of_week" }
        );

      if (error) throw error;

      setStatusMessage(`Updated schedule for ${DAY_NAMES[daySchedule.day_of_week]} successfully.`);
      setTimeout(() => setStatusMessage(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update schedule";
      setErrorMessage(msg);
    } finally {
      setSavingDay(null);
    }
  };

  const handleFieldChange = (
    dayIndex: number,
    field: keyof DoctorAvailability,
    value: string | number | boolean
  ) => {
    setAvailability((prev) =>
      prev.map((item) =>
        item.day_of_week === dayIndex ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate) return;

    setAddingBlocked(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const { error } = await supabase.from("blocked_dates").insert({
        blocked_date: newBlockedDate,
        reason: newBlockedReason.trim() || "Doctor unavailable / Holiday",
      });

      if (error) throw error;

      setStatusMessage(`Blocked date ${formatReadableDate(newBlockedDate)} added.`);
      setNewBlockedDate("");
      setNewBlockedReason("");
      loadData();
      setTimeout(() => setStatusMessage(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to block date";
      setErrorMessage(msg);
    } finally {
      setAddingBlocked(false);
    }
  };

  const handleDeleteBlockedDate = async (id: string, dateStr: string) => {
    if (!window.confirm(`Unblock ${formatReadableDate(dateStr)}?`)) return;

    try {
      const { error } = await supabase
        .from("blocked_dates")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStatusMessage(`Date ${formatReadableDate(dateStr)} is now available again.`);
      setBlockedDates((prev) => prev.filter((b) => b.id !== id));
      setTimeout(() => setStatusMessage(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to unblock date";
      setErrorMessage(msg);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-2" />
        <p className="text-sm">Loading clinic schedule configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Notifications */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* SECTION 1: WEEKLY SCHEDULE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold font-serif text-white">
              Weekly Doctor Availability & Capacity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set hours, daily patient capacity limits, and active status per day.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-teal-400 bg-teal-950/60 px-3 py-1.5 rounded-xl border border-teal-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Clinic Timezone: Asia/Kolkata (IST)</span>
          </div>
        </div>

        <div className="space-y-3">
          {DAY_NAMES.map((dayName, dayIndex) => {
            const dayConfig = availability.find(
              (a) => a.day_of_week === dayIndex
            ) || {
              id: `fallback-${dayIndex}`,
              day_of_week: dayIndex,
              start_time: "10:00",
              end_time: "21:00",
              max_patients: 12,
              is_active: dayIndex !== 0,
            };

            const isSaving = savingDay === dayIndex;

            return (
              <div
                key={dayIndex}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  dayConfig.is_active
                    ? "bg-slate-950 border-slate-800 hover:border-slate-700"
                    : "bg-slate-950/50 border-slate-900 opacity-60"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Day Name & Toggle */}
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = {
                          ...dayConfig,
                          is_active: !dayConfig.is_active,
                        };
                        handleFieldChange(
                          dayIndex,
                          "is_active",
                          !dayConfig.is_active
                        );
                        handleUpdateSchedule(updated);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                        dayConfig.is_active
                          ? "bg-teal-900/80 text-teal-300"
                          : "bg-slate-800 text-slate-500"
                      }`}
                      title={
                        dayConfig.is_active ? "Mark Inactive" : "Mark Active"
                      }
                    >
                      {dayConfig.is_active ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>

                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {dayName}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {dayConfig.is_active ? "Open / Available" : "Closed / Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Hours and Capacity Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-2xl">
                    {/* Start Time */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={dayConfig.start_time.slice(0, 5)}
                        disabled={!dayConfig.is_active}
                        onChange={(e) =>
                          handleFieldChange(dayIndex, "start_time", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 disabled:opacity-40"
                      />
                    </div>

                    {/* End Time */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={dayConfig.end_time.slice(0, 5)}
                        disabled={!dayConfig.is_active}
                        onChange={(e) =>
                          handleFieldChange(dayIndex, "end_time", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 disabled:opacity-40"
                      />
                    </div>

                    {/* Maximum Capacity Per Day */}
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Max Capacity (Patients)
                      </label>
                      <div className="relative">
                        <Users className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={dayConfig.max_patients}
                          disabled={!dayConfig.is_active}
                          onChange={(e) =>
                            handleFieldChange(
                              dayIndex,
                              "max_patients",
                              Number(e.target.value)
                            )
                          }
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 disabled:opacity-40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleUpdateSchedule(dayConfig)}
                      className="w-full lg:w-auto px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: BLOCKED DATES & HOLIDAYS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="pb-6 mb-6 border-b border-slate-800">
          <h3 className="text-xl font-bold font-serif text-white">
            Blocked Dates & Clinic Closures
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Block specific dates for national holidays, doctor conference leaves, or clinic maintenance.
          </p>
        </div>

        {/* Add Blocked Date Form */}
        <form
          onSubmit={handleAddBlockedDate}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-8 p-4 rounded-2xl bg-slate-950 border border-slate-800"
        >
          <div className="sm:col-span-4">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Select Date to Block *
            </label>
            <input
              type="date"
              required
              min={minDate}
              value={newBlockedDate}
              onChange={(e) => setNewBlockedDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-6">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Reason / Note
            </label>
            <input
              type="text"
              placeholder="e.g. Durga Puja Holiday, Endodontic Conference"
              value={newBlockedReason}
              onChange={(e) => setNewBlockedReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={addingBlocked || !newBlockedDate}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {addingBlocked ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Block Date</span>
            </button>
          </div>
        </form>

        {/* List of currently blocked dates */}
        {blockedDates.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No upcoming dates are currently blocked. The clinic operates according to the weekly schedule.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {blockedDates.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatReadableDate(item.blocked_date)}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {item.reason || "Doctor unavailable"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteBlockedDate(item.id, item.blocked_date)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Unblock date"
                  aria-label="Unblock date"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
