import React from "react";
import { Phone, Clock, MapPin, AlertCircle } from "lucide-react";
import { DOCTOR_INFO } from "../data/dentalData";

interface TopInfoStripProps {
  onBookClick: () => void;
  onAdminClick?: () => void;
}

export const TopInfoStrip: React.FC<TopInfoStripProps> = ({ onBookClick, onAdminClick }) => {
  return (
    <aside aria-label="Clinic announcement and hours" className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
        {/* Left: Bengali support / Emergency note */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-teal-950 text-teal-300 border border-teal-800/60">
            <AlertCircle className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-bengali">জরুরী দাঁতের ব্যাথা?</span>
            <span>Tooth Pain Guidance Available</span>
          </span>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:inline text-slate-400 font-bengali">
            {DOCTOR_INFO.bengaliTitle}
          </span>
        </div>

        {/* Right: Hours, Location & Direct Call */}
        <div className="flex items-center gap-3 sm:gap-5 text-slate-300 font-normal">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{DOCTOR_INFO.hours}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{DOCTOR_INFO.location}</span>
          </div>

          <a
            href={DOCTOR_INFO.phoneTel}
            className="flex items-center gap-1.5 font-medium text-white hover:text-teal-300 transition-colors whitespace-nowrap"
            title="Call Dr. Lovely Das clinic"
          >
            <Phone className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20 shrink-0" />
            <span className="tracking-wide">{DOCTOR_INFO.phone}</span>
          </a>

          <button
            onClick={onBookClick}
            className="hidden xl:inline-flex items-center text-teal-300 hover:text-white underline underline-offset-2 font-medium transition-colors cursor-pointer"
          >
            Request Slot
          </button>

          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="text-[11px] font-medium text-slate-400 hover:text-teal-300 bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded border border-slate-700/80 transition-colors cursor-pointer"
              title="Doctor / Admin Login"
            >
              Doctor Portal
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
