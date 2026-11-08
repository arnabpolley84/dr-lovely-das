import React from "react";
import { Phone, Calendar, MessageCircle, MapPin, Clock } from "lucide-react";
import { DOCTOR_INFO } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";

interface QuickContactCTAProps {
  onBookClick: () => void;
}

export const QuickContactCTA: React.FC<QuickContactCTAProps> = ({ onBookClick }) => {
  return (
    <section className="relative z-20 -mt-2 bg-gradient-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* Left: Heading & description */}
        <div className="text-center lg:text-left max-w-xl">
          <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <span>Specialist Consultation</span>
            <span>·</span>
            <span>Mukundapur, Kolkata</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif mb-2">
            <TypingReveal text="Expert Dental Care When You Need It" speed={22} as="span" />
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Speak directly with Dr. Lovely Das regarding severe tooth pain, sensitivity, or root canal evaluation.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Beside Metro Cash & Carry, Mukundapur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{DOCTOR_INFO.hours}</span>
            </div>
          </div>
        </div>

        {/* Right: Three Clear Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
          {/* Book Appointment */}
          <button
            onClick={onBookClick}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-semibold text-sm shadow-md transition-all whitespace-nowrap cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>

          {/* Call Now */}
          <a
            href={DOCTOR_INFO.phoneTel}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-white font-semibold text-sm border border-slate-700 transition-all whitespace-nowrap"
          >
            <Phone className="w-4 h-4 text-teal-400" />
            <span>Call 090071 62723</span>
          </a>

          {/* WhatsApp */}
          <a
            href={DOCTOR_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
