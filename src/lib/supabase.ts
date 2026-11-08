import { createClient } from "@supabase/supabase-js";

// Supabase configuration provided by the user
export const SUPABASE_URL = "https://qjwoucimkeizxgogszvv.supabase.co";
export const SUPABASE_ANON_KEY =
  "sb_publishable_AXqKajhzbiBJR-rjKmw4ug_OMcrQXmN4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database Entity Types
export interface DoctorAvailability {
  id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  start_time: string; // "10:00"
  end_time: string; // "21:00"
  max_patients: number;
  is_active: boolean;
  updated_at?: string;
}

export interface BlockedDate {
  id: string;
  blocked_date: string; // "YYYY-MM-DD"
  reason?: string;
  created_at?: string;
}

export interface Patient {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
  gender?: string | null;
  age?: number | null;
  city?: string | null;
  is_existing_patient: boolean;
  created_at?: string;
  updated_at?: string;
}

export type AppointmentStatus = "confirmed" | "completed" | "cancelled" | "no-show";

export interface Appointment {
  id: string;
  booking_id: string; // e.g. "LD-20260927-0001"
  patient_id: string;
  appointment_date: string; // "YYYY-MM-DD"
  appointment_time: string; // "10:30 AM"
  service_type: string;
  status: AppointmentStatus;
  patient_type: "new" | "existing";
  symptoms_note?: string | null;
  prescription_file_url?: string | null;
  prescription_file_path?: string | null;
  created_at?: string;
  updated_at?: string;
  patient?: Patient;
}

export interface PatientCaseHistory {
  id: string;
  patient_id: string;
  appointment_id?: string | null;
  visit_date: string;
  diagnosis: string;
  treatment: string;
  surgery_details?: string | null;
  doctor_advice?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PatientDocument {
  id: string;
  patient_id: string;
  appointment_id?: string | null;
  document_name: string;
  file_path: string;
  file_type?: string | null;
  file_size?: number | null;
  uploaded_at?: string;
}

// Timezone helper for Asia/Kolkata (IST = UTC+5:30)
export function getKolkataDateString(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function getKolkataDayOfWeek(dateStr: string): number {
  // Parse YYYY-MM-DD in UTC to avoid local timezone offset skews
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  return date.getUTCDay(); // 0 is Sunday, 1 is Monday ...
}

export function formatReadableDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Default standard doctor weekly schedule for Dr. Lovely Das in Mukundapur
export const DEFAULT_SCHEDULE: Omit<DoctorAvailability, "id">[] = [
  { day_of_week: 1, start_time: "10:00", end_time: "21:00", max_patients: 12, is_active: true }, // Monday
  { day_of_week: 2, start_time: "10:00", end_time: "21:00", max_patients: 12, is_active: true }, // Tuesday
  { day_of_week: 3, start_time: "10:00", end_time: "21:00", max_patients: 12, is_active: true }, // Wednesday
  { day_of_week: 4, start_time: "10:00", end_time: "21:00", max_patients: 12, is_active: true }, // Thursday
  { day_of_week: 5, start_time: "10:00", end_time: "21:00", max_patients: 12, is_active: true }, // Friday
  { day_of_week: 6, start_time: "10:00", end_time: "21:00", max_patients: 12, is_active: true }, // Saturday
  { day_of_week: 0, start_time: "10:00", end_time: "14:00", max_patients: 5, is_active: false }, // Sunday (Inactive / by prior appointment)
];

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
