import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Phone,
  Clock,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  Upload,
  FileText,
  User,
  Shield,
  Printer,
  Download,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { DOCTOR_INFO, DENTAL_SERVICES } from "../data/dentalData";
import {
  fetchDoctorAvailability,
  fetchBlockedDates,
  checkDateCapacity,
  bookAppointment,
  DateCapacityInfo,
  BookingResult,
} from "../lib/appointmentService";
import {
  DoctorAvailability,
  BlockedDate,
  getKolkataDateString,
  formatReadableDate,
} from "../lib/supabase";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Booking Form State
  const [patientType, setPatientType] = useState<"new" | "existing">("new");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("Not specified");
  const [age, setAge] = useState<number | "">("");
  const [city, setCity] = useState("Kolkata");
  const [serviceType, setServiceType] = useState("Root Canal Treatment");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [symptomsNote, setSymptomsNote] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

  // System & Availability State
  const [availabilityList, setAvailabilityList] = useState<DoctorAvailability[]>([]);
  const [blockedDatesList, setBlockedDatesList] = useState<BlockedDate[]>([]);
  const [capacityInfo, setCapacityInfo] = useState<DateCapacityInfo | null>(null);
  const [loadingCapacity, setLoadingCapacity] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Booking Result State
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  // Initial minimum date: Today in Asia/Kolkata
  const minDate = getKolkataDateString();

  // Load schedule configuration on mount
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadConfig() {
      try {
        const [avail, blocked] = await Promise.all([
          fetchDoctorAvailability(),
          fetchBlockedDates(),
        ]);
        if (isMounted) {
          setAvailabilityList(avail);
          setBlockedDatesList(blocked);

          // Default to tomorrow or earliest open day
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const defaultDateStr = getKolkataDateString(tomorrow);
          setAppointmentDate(defaultDateStr);
        }
      } catch (err) {
        console.error("Failed to load availability config:", err);
      }
    }

    loadConfig();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Whenever appointment date changes, check capacity and time slots
  useEffect(() => {
    if (!appointmentDate) {
      setCapacityInfo(null);
      return;
    }

    let isMounted = true;
    async function updateCapacity() {
      setLoadingCapacity(true);
      setErrorMessage("");
      try {
        const info = await checkDateCapacity(
          appointmentDate,
          availabilityList,
          blockedDatesList
        );
        if (isMounted) {
          setCapacityInfo(info);
          if (info.timeSlots.length > 0) {
            setAppointmentTime(info.timeSlots[0]);
          }
        }
      } catch (err) {
        console.error("Capacity check error:", err);
      } finally {
        if (isMounted) setLoadingCapacity(false);
      }
    }

    updateCapacity();
    return () => {
      isMounted = false;
    };
  }, [appointmentDate, availabilityList, blockedDatesList]);

  if (!isOpen) return null;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validations
    if (!fullName.trim()) {
      setErrorMessage("Please enter patient's full name.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!appointmentDate) {
      setErrorMessage("Please select a date for your appointment.");
      return;
    }
    if (appointmentDate < minDate) {
      setErrorMessage("Cannot book appointments for past dates.");
      return;
    }
    if (capacityInfo && !capacityInfo.isAvailable) {
      if (capacityInfo.isBlocked) {
        setErrorMessage(
          capacityInfo.blockedReason || "Doctor is unavailable on this date."
        );
      } else if (capacityInfo.remainingSlots <= 0) {
        setErrorMessage(
          `All ${capacityInfo.maxPatients} appointment slots for this date are fully booked. Please select another date.`
        );
      } else {
        setErrorMessage("Clinic is closed or unavailable on this day.");
      }
      return;
    }
    if (!appointmentTime) {
      setErrorMessage("Please select an appointment time slot.");
      return;
    }

    // Existing patient mandatory prescription validation
    if (patientType === "existing" && !prescriptionFile) {
      setErrorMessage(
        "Existing patients must upload their latest prescription (PDF, JPG, or PNG)."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await bookAppointment({
        patientType,
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        gender,
        age: age ? Number(age) : undefined,
        city: city.trim() || "Kolkata",
        appointmentDate,
        appointmentTime,
        serviceType,
        symptomsNote: symptomsNote.trim() || undefined,
        prescriptionFile,
      });

      if (!result.success) {
        setErrorMessage(result.error || "Unable to confirm booking. Please try again.");
      } else {
        setBookingResult(result);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Booking failed";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  const handleDownloadConfirmation = () => {
    if (!bookingResult) return;
    const content = `========================================================
DR. LOVELY DAS, MDS ENDODONTIST & ROOT CANAL SPECIALIST
OFFICIAL APPOINTMENT CONFIRMATION
========================================================

BOOKING ID: ${bookingResult.bookingId}
Patient Name: ${bookingResult.patientName}
Consultation / Service: ${bookingResult.serviceType}
Appointment Date: ${formatReadableDate(bookingResult.appointmentDate || "")}
Time Slot: ${bookingResult.appointmentTime}
Doctor: Dr. Lovely Das (MDS Endodontist)
Status: Confirmed

Clinic Location:
Metro Station - Jyotirindra Nandi,
1/2 Nitai Nagar, Tara Bhavan,
Mukundapur, Kalikapur, Beside Metro Cash & Carry,
Kolkata, West Bengal 700099
Phone: 090071 62723

IMPORTANT PATIENT NOTICE:
Please save your Booking ID (${bookingResult.bookingId}) and bring it
when visiting the clinic. Please arrive 10 minutes prior to your slot.
========================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Booking-${bookingResult.bookingId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!bookingResult) return;
    const msg = encodeURIComponent(
      `Hello Dr. Lovely Das Clinic,\n\nI have confirmed my appointment:\n*Booking ID:* ${bookingResult.bookingId}\n*Patient Name:* ${bookingResult.patientName}\n*Date:* ${formatReadableDate(bookingResult.appointmentDate || "")}\n*Time:* ${bookingResult.appointmentTime}\n*Service:* ${bookingResult.serviceType}\n\nClinic: Mukundapur, Kolkata`
    );
    window.open(`https://wa.me/919007162723?text=${msg}`, "_blank");
  };

  const handleResetAndClose = () => {
    setBookingResult(null);
    setErrorMessage("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================================================================ */}
        {/* VIEW 1: SUCCESSFUL BOOKING CONFIRMATION SCREEN                   */}
        {/* ================================================================ */}
        {bookingResult ? (
          <div className="py-2">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Appointment Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-2">
                Your Booking Is Reserved
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Dr. Lovely Das · MDS Endodontist & Root Canal Specialist
              </p>
            </div>

            {/* Official Booking Card (Printed / Saved) */}
            <div
              id="printable-booking-card"
              className="bg-slate-50 border-2 border-dashed border-teal-600/40 rounded-2xl p-5 sm:p-6 mb-6 shadow-xs relative"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Official Booking ID
                  </span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-teal-800 tracking-wider">
                    {bookingResult.bookingId}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-teal-100/80 text-teal-900 font-semibold text-xs border border-teal-200">
                  Status: Confirmed
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700 mb-4">
                <div>
                  <span className="text-slate-400 block text-xs">Patient Name</span>
                  <span className="font-bold text-slate-900 text-base">
                    {bookingResult.patientName}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs">Doctor</span>
                  <span className="font-bold text-slate-900">
                    Dr. Lovely Das, MDS Endodontist
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs">Date</span>
                  <span className="font-semibold text-slate-900">
                    {formatReadableDate(bookingResult.appointmentDate || "")}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-xs">Time Slot</span>
                  <span className="font-semibold text-slate-900">
                    {bookingResult.appointmentTime}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-400 block text-xs">Service</span>
                  <span className="font-medium text-slate-800">
                    {bookingResult.serviceType}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                <p className="font-medium text-slate-700">Clinic Location:</p>
                <p>Metro Station - Jyotirindra Nandi, 1/2 Nitai Nagar, Tara Bhavan, Mukundapur, Kalikapur, Kolkata 700099</p>
                <p className="text-teal-700 font-semibold mt-0.5">Phone: 090071 62723</p>
              </div>
            </div>

            {/* Critical Patient Instruction Box */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs sm:text-sm mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  Please save your Booking ID and bring it when visiting the clinic.
                </p>
                <p className="text-amber-800 text-xs mt-0.5">
                  Show this Booking ID (<strong>{bookingResult.bookingId}</strong>) at reception for priority check-in.
                </p>
              </div>
            </div>

            {/* Action Buttons: Print, Download, WhatsApp, Done */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handlePrintConfirmation}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Confirmation</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadConfirmation}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Pass</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsAppConfirmation}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* VIEW 2: BOOKING FORM                                             */
          /* ================================================================ */
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <Shield className="w-4 h-4 text-teal-600" />
                <span>Verified Endodontic Clinic</span>
                <span>·</span>
                <span>Mukundapur, Kolkata</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
                Book an Appointment
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Real-time booking with Dr. Lovely Das, MDS Endodontist & Root Canal Specialist.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* STEP 1: PATIENT TYPE (New vs. Existing) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Have you visited Dr. Lovely Das before? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPatientType("new");
                      setPrescriptionFile(null);
                    }}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer flex items-center justify-center gap-2 ${
                      patientType === "new"
                        ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>New Patient</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPatientType("existing")}
                    className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer flex items-center justify-center gap-2 ${
                      patientType === "existing"
                        ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Existing Patient</span>
                  </button>
                </div>

                {patientType === "existing" && (
                  <p className="text-[11px] text-teal-800 mt-2 font-medium">
                    Welcome back! As an existing patient, please attach your previous prescription below for reference.
                  </p>
                )}
              </div>

              {/* MANDATORY PRESCRIPTION UPLOAD (ONLY FOR EXISTING PATIENT) */}
              {patientType === "existing" && (
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider">
                      Upload Your Latest Prescription *
                    </label>
                    <span className="text-[10px] text-teal-700 font-medium">
                      PDF, JPG, JPEG, PNG (Max 10MB)
                    </span>
                  </div>

                  <div className="relative border-2 border-dashed border-teal-300 rounded-xl p-4 text-center bg-white hover:bg-teal-50/20 transition-colors">
                    <input
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setPrescriptionFile(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <Upload className="w-6 h-6 text-teal-600 mb-1" />
                      {prescriptionFile ? (
                        <div className="text-xs font-semibold text-emerald-800">
                          Selected: {prescriptionFile.name} ({(prescriptionFile.size / 1024).toFixed(0)} KB)
                        </div>
                      ) : (
                        <p className="text-xs text-slate-600">
                          <span className="font-semibold text-teal-700">Click to upload</span> or drag and drop prescription
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5">
                    Your prescription is securely uploaded to private medical storage and accessible only by Dr. Lovely Das.
                  </p>
                </div>
              )}

              {/* STEP 2: PATIENT CONTACT & DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Ghosh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit number (e.g. 9007162723)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition-all text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-slate-900"
                    >
                      <option value="Not specified">Optional</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 35"
                      min={1}
                      max={120}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                      className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: SERVICE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Treatment / Consultation Category *
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-slate-900"
                >
                  {DENTAL_SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Severe Tooth Pain & Emergency Consultation">
                    Severe Tooth Pain & Emergency Consultation
                  </option>
                  <option value="Second Opinion & Re-treatment Evaluation">
                    Second Opinion & Re-treatment Evaluation
                  </option>
                </select>
              </div>

              {/* STEP 4: DATE & CAPACITY METER */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Select Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={minDate}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Select Time Slot *
                    </label>
                    <select
                      value={appointmentTime}
                      disabled={!capacityInfo?.isAvailable}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-slate-900 disabled:opacity-50"
                    >
                      {capacityInfo?.timeSlots && capacityInfo.timeSlots.length > 0 ? (
                        capacityInfo.timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))
                      ) : (
                        <option value="">No slots available</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Real-time Capacity Status Indicator */}
                {loadingCapacity ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                    <span>Checking doctor&apos;s live schedule and remaining capacity...</span>
                  </div>
                ) : capacityInfo ? (
                  <div className="pt-2 border-t border-slate-200/80">
                    {capacityInfo.isBlocked ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Date Blocked: {capacityInfo.blockedReason}</span>
                      </div>
                    ) : !capacityInfo.isAvailable && capacityInfo.remainingSlots <= 0 ? (
                      <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Fully Booked! Maximum {capacityInfo.maxPatients} patients reached. Please choose another date.</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>
                            <strong>{capacityInfo.remainingSlots}</strong> slots remaining
                            (Cap: {capacityInfo.maxPatients} patients/day)
                          </span>
                        </div>
                        <span className="text-[11px] text-teal-800 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {capacityInfo.startTime} – {capacityInfo.endTime}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* STEP 5: SYMPTOMS NOTE (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Symptoms & Dental Concern (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Lingering pain when drinking hot tea, sensitivity in lower molar, previous root canal needing check..."
                  value={symptomsNote}
                  onChange={(e) => setSymptomsNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || (capacityInfo ? !capacityInfo.isAvailable : false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming With Clinic Database...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Confirm & Generate Booking ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400">
                Clinic: Metro Station - Jyotirindra Nandi, Tara Bhavan, Mukundapur · Call 090071 62723
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
