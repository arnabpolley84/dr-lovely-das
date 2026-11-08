import React from "react";
import { Phone, Calendar, MessageCircle, MapPin, Clock } from "lucide-react";
import { DOCTOR_INFO } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";

interface FinalCtaSectionProps {
  onBookClick: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onBookClick }) => {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-900/60 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-teal-700/60">
          <span>Dr. Lovely Das, MDS</span>
          <span>·</span>
          <span>Mukundapur, Kolkata</span>
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white mb-4 tracking-tight leading-tight">
          <TypingReveal
            text="Ready To Take The Next Step For Your Dental Health?"
            speed={18}
            as="span"
          />
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Speak with Dr. Lovely Das about your dental concern and find the right treatment approach for your needs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
          {/* Primary CTA */}
          <button
            onClick={onBookClick}
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-semibold text-sm shadow-xl shadow-teal-950/50 transition-all cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-4 h-4" />
            <span>Book an Appointment</span>
          </button>

          {/* Secondary Call */}
          <a
            href={DOCTOR_INFO.phoneTel}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-[0.98] text-white font-medium text-sm border border-slate-700 transition-all whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-teal-300" />
            <span>Call 090071 62723</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={DOCTOR_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium text-sm shadow-md transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Location & Open Hours Footer Note */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <span>Tara Bhavan, 1/2 Nitai Nagar, Beside Metro Cash & Carry</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{DOCTOR_INFO.hours}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
