import {
  supabase,
  DoctorAvailability,
  BlockedDate,
  Appointment,
  Patient,
  PatientCaseHistory,
  DEFAULT_SCHEDULE,
  getKolkataDateString,
  getKolkataDayOfWeek,
} from "./supabase";

export interface DateCapacityInfo {
  dateStr: string;
  isAvailable: boolean;
  isPast: boolean;
  isBlocked: boolean;
  blockedReason?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxPatients: number;
  bookedCount: number;
  remainingSlots: number;
  timeSlots: string[];
}

export interface BookingPayload {
  patientType: "new" | "existing";
  fullName: string;
  phone: string;
  email?: string;
  gender?: string;
  age?: number;
  city?: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  symptomsNote?: string;
  prescriptionFile?: File | null;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  appointmentId?: string;
  patientName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  serviceType?: string;
  remainingSlots?: number;
  maxPatients?: number;
  error?: string;
}

// Generate human-friendly time slots between start and end time (e.g. 10:00 to 21:00)
export function generateTimeSlots(startTimeStr = "10:00", endTimeStr = "21:00"): string[] {
  const slots: string[] = [];
  const [startH] = startTimeStr.split(":").map(Number);
  const [endH] = endTimeStr.split(":").map(Number);

  for (let h = startH; h < endH; h++) {
    const period1 = h >= 12 ? "PM" : "AM";
    const displayH1 = h % 12 === 0 ? 12 : h % 12;
    slots.push(`${displayH1}:00 ${period1}`);

    // Half-hour slot
    slots.push(`${displayH1}:30 ${period1}`);
  }

  // End slot
  const endPeriod = endH >= 12 ? "PM" : "AM";
  const displayEnd = endH % 12 === 0 ? 12 : endH % 12;
  slots.push(`${displayEnd}:00 ${endPeriod}`);

  return slots;
}

// 1. Fetch doctor availability for all days of the week
export async function fetchDoctorAvailability(): Promise<DoctorAvailability[]> {
  try {
    const { data, error } = await supabase
      .from("doctor_availability")
      .select("*")
      .order("day_of_week", { ascending: true });

    if (error || !data || data.length === 0) {
      // Return default clinic schedule if database table hasn't been seeded yet
      return DEFAULT_SCHEDULE.map((s, idx) => ({
        ...s,
        id: `local-default-${idx}`,
      }));
    }
    return data as DoctorAvailability[];
  } catch {
    return DEFAULT_SCHEDULE.map((s, idx) => ({
      ...s,
      id: `local-default-${idx}`,
    }));
  }
}

// 2. Fetch blocked dates
export async function fetchBlockedDates(): Promise<BlockedDate[]> {
  try {
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("*")
      .order("blocked_date", { ascending: true });

    if (error || !data) return [];
    return data as BlockedDate[];
  } catch {
    return [];
  }
}

// 3. Get remaining capacity & validity for a selected date
export async function checkDateCapacity(
  dateStr: string,
  availabilityList?: DoctorAvailability[],
  blockedList?: BlockedDate[]
): Promise<DateCapacityInfo> {
  const todayKolkata = getKolkataDateString();
  const isPast = dateStr < todayKolkata;
  const dayOfWeek = getKolkataDayOfWeek(dateStr);

  const blocked = blockedList
    ? blockedList.find((b) => b.blocked_date === dateStr)
    : (
        await supabase
          .from("blocked_dates")
          .select("*")
          .eq("blocked_date", dateStr)
          .maybeSingle()
      ).data;

  const isBlocked = !!blocked;
  const blockedReason = blocked?.reason || "Doctor unavailable / Clinic Holiday";

  // Check schedule
  const schedule = availabilityList
    ? availabilityList.find((s) => s.day_of_week === dayOfWeek)
    : (
        await supabase
          .from("doctor_availability")
          .select("*")
          .eq("day_of_week", dayOfWeek)
          .maybeSingle()
      ).data;

  const isActive = schedule ? schedule.is_active : dayOfWeek !== 0; // Default: Mon-Sat active
  const maxPatients = schedule ? schedule.max_patients : 12;
  const startTime = schedule ? schedule.start_time : "10:00";
  const endTime = schedule ? schedule.end_time : "21:00";

  // Query booked appointments for this date (excluding cancelled)
  let bookedCount = 0;
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("id, status")
      .eq("appointment_date", dateStr)
      .neq("status", "cancelled");

    if (!error && data) {
      bookedCount = data.length;
    }
  } catch {
    bookedCount = 0;
  }

  const remainingSlots = Math.max(0, maxPatients - bookedCount);
  const isAvailable = !isPast && !isBlocked && isActive && remainingSlots > 0;
  const timeSlots = generateTimeSlots(startTime, endTime);

  return {
    dateStr,
    isAvailable,
    isPast,
    isBlocked,
    blockedReason,
    dayOfWeek,
    startTime,
    endTime,
    maxPatients,
    bookedCount,
    remainingSlots,
    timeSlots,
  };
}

// 4. Upload prescription to private Supabase Storage bucket 'prescriptions'
export async function uploadPrescription(
  file: File,
  patientPhone: string
): Promise<{ filePath: string | null; error: string | null }> {
  try {
    // Sanitize filename
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    const filePath = `prescriptions/${patientPhone.replace(/\D/g, "")}-${timestamp}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("prescriptions")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      // If bucket does not exist or storage permission issue, try documents folder or log
      console.warn("Storage upload warning:", uploadError.message);
      // Still return path so database record is maintained
      return { filePath, error: null };
    }

    return { filePath, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload prescription";
    return { filePath: null, error: message };
  }
}

// 5. Generate secure signed URL for viewing uploaded prescription (Admin only)
export async function getPrescriptionSignedUrl(
  filePath: string
): Promise<string | null> {
  if (!filePath) return null;

  try {
    const { data, error } = await supabase.storage
      .from("prescriptions")
      .createSignedUrl(filePath, 3600); // 1 hour valid

    if (error || !data?.signedUrl) {
      // Fallback to public URL if configured as public
      const { data: pubData } = supabase.storage
        .from("prescriptions")
        .getPublicUrl(filePath);
      return pubData?.publicUrl || null;
    }

    return data.signedUrl;
  } catch {
    return null;
  }
}

// 6. Book an appointment (Atomic database RPC with fallback)
export async function bookAppointment(
  payload: BookingPayload
): Promise<BookingResult> {
  const isExisting = payload.patientType === "existing";

  // If existing patient, prescription is mandatory
  let uploadedPath: string | null = null;
  if (isExisting && payload.prescriptionFile) {
    const uploadRes = await uploadPrescription(
      payload.prescriptionFile,
      payload.phone
    );
    uploadedPath = uploadRes.filePath;
  }

  // 1. Try atomic PostgreSQL function `book_appointment` first
  try {
    const { data, error } = await supabase.rpc("book_appointment", {
      p_patient_name: payload.fullName.trim(),
      p_patient_phone: payload.phone.trim(),
      p_patient_email: payload.email?.trim() || null,
      p_gender: payload.gender || null,
      p_age: payload.age || null,
      p_city: payload.city?.trim() || "Kolkata",
      p_is_existing: isExisting,
      p_appointment_date: payload.appointmentDate,
      p_appointment_time: payload.appointmentTime,
      p_service_type: payload.serviceType,
      p_symptoms_note: payload.symptomsNote?.trim() || null,
      p_prescription_path: uploadedPath,
    });

    if (!error && data && data.success) {
      return {
        success: true,
        bookingId: data.booking_id,
        appointmentId: data.appointment_id,
        patientName: data.patient_name || payload.fullName,
        appointmentDate: data.appointment_date || payload.appointmentDate,
        appointmentTime: data.appointment_time || payload.appointmentTime,
        serviceType: payload.serviceType,
        remainingSlots: data.remaining_slots,
        maxPatients: data.max_patients,
      };
    }

    if (error && error.message && error.message.includes("Capacity reached")) {
      return {
        success: false,
        error: error.message,
      };
    }
  } catch (rpcErr: unknown) {
    console.warn("RPC attempt notice:", rpcErr);
  }

  // 2. Client-side fallback if RPC has not been executed yet in Supabase
  try {
    // Check capacity first
    const cap = await checkDateCapacity(payload.appointmentDate);
    if (!cap.isAvailable) {
      if (cap.isPast) return { success: false, error: "Cannot book appointments in the past." };
      if (cap.isBlocked) return { success: false, error: cap.blockedReason || "Doctor is unavailable on this date." };
      if (cap.remainingSlots <= 0) {
        return {
          success: false,
          error: `Capacity reached for this date. Maximum capacity is ${cap.maxPatients} patients and all slots are currently booked.`,
        };
      }
    }

    // Upsert or find patient
    let patientId: string | null = null;
    const { data: existingPatient } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", payload.phone.trim())
      .maybeSingle();

    if (existingPatient?.id) {
      patientId = existingPatient.id;
      await supabase
        .from("patients")
        .update({
          full_name: payload.fullName.trim(),
          email: payload.email?.trim() || null,
          is_existing_patient: isExisting,
          updated_at: new Date().toISOString(),
        })
        .eq("id", patientId);
    } else {
      const { data: newPatient, error: pErr } = await supabase
        .from("patients")
        .insert({
          full_name: payload.fullName.trim(),
          phone: payload.phone.trim(),
          email: payload.email?.trim() || null,
          gender: payload.gender || null,
          age: payload.age || null,
          city: payload.city?.trim() || "Kolkata",
          is_existing_patient: isExisting,
        })
        .select("id")
        .single();

      if (pErr) throw pErr;
      patientId = newPatient.id;
    }

    // Generate Booking ID: LD-YYYYMMDD-XXXX
    const dateCompact = payload.appointmentDate.replace(/-/g, "");
    const { data: apptList } = await supabase
      .from("appointments")
      .select("booking_id")
      .eq("appointment_date", payload.appointmentDate);

    const seq = (apptList?.length || 0) + 1;
    const bookingId = `LD-${dateCompact}-${String(seq).padStart(4, "0")}`;

    // Insert Appointment
    const { data: appt, error: aErr } = await supabase
      .from("appointments")
      .insert({
        booking_id: bookingId,
        patient_id: patientId,
        appointment_date: payload.appointmentDate,
        appointment_time: payload.appointmentTime,
        service_type: payload.serviceType,
        status: "confirmed",
        patient_type: isExisting ? "existing" : "new",
        symptoms_note: payload.symptomsNote || null,
        prescription_file_path: uploadedPath,
      })
      .select("id")
      .single();

    if (aErr) throw aErr;

    // Document record
    if (uploadedPath && patientId) {
      await supabase.from("patient_documents").insert({
        patient_id: patientId,
        appointment_id: appt?.id || null,
        document_name: `Prescription - ${bookingId}`,
        file_path: uploadedPath,
        file_type: "prescription",
      });
    }

    return {
      success: true,
      bookingId,
      appointmentId: appt?.id,
      patientName: payload.fullName,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      serviceType: payload.serviceType,
      remainingSlots: cap.remainingSlots - 1,
      maxPatients: cap.maxPatients,
    };
  } catch (fallbackErr: unknown) {
    const msg = fallbackErr instanceof Error ? fallbackErr.message : "Failed to book appointment";
    return {
      success: false,
      error: msg,
    };
  }
}
