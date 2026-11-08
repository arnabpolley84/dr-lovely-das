import React from "react";
import { MapPin, Phone, Calendar, Clock, Navigation, CheckCircle, ExternalLink } from "lucide-react";
import { DOCTOR_INFO, AREAS_SERVED } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";

interface LocationSectionProps {
  onBookClick: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onBookClick }) => {
  return (
    <section id="location" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Clinic Location & Accessibility</span>
            <span>·</span>
            <span>South Kolkata</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-4">
            <TypingReveal text="Endodontic Care in Mukundapur, Kolkata" speed={20} as="span" />
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Conveniently situated right beside Metro Cash & Carry, near Jyotirindra Nandi Metro Station on EM Bypass.
          </p>
        </div>

        {/* Location & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16">
          {/* Left Column: Address Card & Details */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950 text-teal-300 text-xs font-semibold mb-6 border border-teal-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{DOCTOR_INFO.hours}</span>
              </div>

              <h3 className="text-2xl font-bold font-serif text-white mb-2">
                Dr. Lovely Das
              </h3>
              <p className="text-xs text-teal-400 uppercase tracking-wider font-semibold mb-6">
                MDS Endodontist & Root Canal Specialist
              </p>

              {/* Address details */}
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div className="text-slate-300 leading-relaxed">
                    <p className="font-semibold text-white">Metro Station - Jyotirindra Nandi</p>
                    <p>1/2 Nitai Nagar, Tara Bhavan,</p>
                    <p>Mukundapur, Kalikapur,</p>
                    <p className="text-teal-300 font-medium">Beside Metro Cash & Carry,</p>
                    <p>Kolkata, West Bengal 700099</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Direct Contact & Appointments</p>
                    <a
                      href={DOCTOR_INFO.phoneTel}
                      className="text-base font-bold text-white hover:text-teal-300 transition-colors"
                    >
                      {DOCTOR_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Clock className="w-5 h-5 text-teal-400 shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400">Operating Hours</p>
                    <p className="text-slate-300 font-medium">{DOCTOR_INFO.operatingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 relative z-10 pt-4 border-t border-slate-800">
              <a
                href={DOCTOR_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions (Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onBookClick}
                  className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>Book Appointment</span>
                </button>

                <a
                  href={DOCTOR_INFO.phoneTel}
                  className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Map Embed / Location Card */}
          <div className="lg:col-span-7 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 shadow-inner flex flex-col min-h-[420px] relative">
            {/* Embedded interactive Google Map centering on Mukundapur Kolkata / Metro Cash & Carry */}
            <iframe
              title="Dr Lovely Das Endodontist Clinic Location Mukundapur Kolkata"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.8340643729965!2d88.3954203!3d22.4938634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02713f0449557b%3A0x6b10706c9a41926c!2sMukundapur%2C%20Kolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1711000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "380px" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="flex-1 w-full h-full"
            />

            {/* Map Bottom Bar */}
            <div className="bg-white p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="font-medium">
                  Landmark: Beside Metro Cash & Carry, Mukundapur / Kalikapur
                </span>
              </div>
              <a
                href={DOCTOR_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
              >
                Open in Maps App <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Section 18: Areas Served */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Local Accessibility
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
              Serving Patients Across South Kolkata
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Our clinic is conveniently located for patients traveling from surrounding neighborhoods and EM Bypass:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {AREAS_SERVED.map((area) => (
              <div
                key={area.name}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-teal-400 hover:bg-teal-50/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                  <h4 className="text-sm font-bold text-slate-900 font-serif">
                    {area.name}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  {area.distance}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            Conveniently located for patients from Mukundapur, Kalikapur, Purbalok, Santoshpur, Garia, Jadavpur, EM Bypass, and surrounding South Kolkata localities.
          </p>
        </div>
      </div>
    </section>
  );
};
