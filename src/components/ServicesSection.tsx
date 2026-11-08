import React, { useState } from "react";
import { DENTAL_SERVICES, DentalService } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";
import { Calendar, Phone, CheckCircle, ArrowRight, X } from "lucide-react";

interface ServicesSectionProps {
  onBookClick: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookClick }) => {
  const [selectedService, setSelectedService] = useState<DentalService | null>(null);

  return (
    <section id="treatments" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Specialized Clinical Scope</span>
            <span>·</span>
            <span>Mukundapur Clinic</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-4">
            <TypingReveal text="Dental & Endodontic Treatments" speed={20} as="span" />
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Targeted consultations and specialized treatments designed around careful diagnosis, biological tooth preservation, and patient comfort.
          </p>
        </div>

        {/* Services Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DENTAL_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:border-teal-300"
            >
              <div>
                {/* Index & Category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold font-mono text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                    0{index + 1}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-serif mb-3 group-hover:text-teal-700 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Common Indications */}
                <div className="space-y-1.5 mb-6">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Common Evaluation Signs:
                  </p>
                  {service.indications.map((ind) => (
                    <div key={ind} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedService(service)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  Clinical Details <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onBookClick}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-700 text-teal-800 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Consult
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Reassurance Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-teal-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold font-serif mb-1 text-teal-200">
              Unsure which consultation your symptoms require?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak directly with our clinic. We provide prompt triage to help you choose the right clinical evaluation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onBookClick}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              Request Assessment
            </button>
            <a
              href="tel:+919007162723"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-colors whitespace-nowrap"
            >
              Call 090071 62723
            </a>
          </div>
        </div>
      </div>

      {/* Clinical Details Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              {selectedService.category}
            </span>

            <h3 className="text-2xl font-bold font-serif text-slate-900 mt-1 mb-3">
              {selectedService.title}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {selectedService.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Clinical Focus & Methodology
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedService.clinicalFocus}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedService(null);
                  onBookClick();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs text-center transition-colors cursor-pointer"
              >
                Book This Consultation
              </button>

              <button
                onClick={() => setSelectedService(null)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
