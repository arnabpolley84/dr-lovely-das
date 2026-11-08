import React, { useState } from "react";
import { ShieldCheck, Stethoscope, AlertTriangle, FileText, Activity, Heart, ArrowRight } from "lucide-react";
import { ROOT_CANAL_STEPS, DOCTOR_INFO } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";

interface SpecialistRootCanalSectionProps {
  onBookClick: () => void;
}

export const SpecialistRootCanalSection: React.FC<SpecialistRootCanalSectionProps> = ({ onBookClick }) => {
  const [activeStep, setActiveStep] = useState(0);

  const endodonticCards = [
    {
      title: "Root Canal Treatment",
      desc: "Carefully planned procedure to remove inflamed or infected pulp tissue, disinfect the canal spaces, and seal them with biocompatible materials.",
      icon: ShieldCheck,
      highlight: "Tooth Preservation",
    },
    {
      title: "Tooth Pain Evaluation",
      desc: "Methodical assessment using digital imaging and vitality tests to identify the precise origin of severe, throbbing, or intermittent dental pain.",
      icon: Stethoscope,
      highlight: "Accurate Diagnosis",
    },
    {
      title: "Sensitivity & Infection Assessment",
      desc: "Detailed evaluation of lingering temperature sensitivity, localized swelling, or gum tenderness indicating potential pulpal involvement.",
      icon: AlertTriangle,
      highlight: "Early Intervention",
    },
    {
      title: "Endodontic Consultation",
      desc: "Comprehensive specialist second opinions and clinical evaluations for complex, calcified, or difficult-to-treat canal anatomy.",
      icon: FileText,
      highlight: "Specialist Expertise",
    },
    {
      title: "Follow-up & Recovery Care",
      desc: "Post-treatment monitoring to confirm periapical tissue healing, restoration integrity, and comfortable chewing dynamics.",
      icon: Activity,
      highlight: "Long-term Health",
    },
    {
      title: "Emergency Dental Guidance",
      desc: "Responsive clinical guidance for acute toothaches and acute pulp inflammation to provide prompt comfort and protect adjacent tissues.",
      icon: Heart,
      highlight: "Prompt Support",
    },
  ];

  return (
    <section id="root-canal-care" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 text-teal-400 text-xs font-semibold uppercase tracking-widest border border-teal-800/60 mb-3">
            <span>ROOT CANAL SPECIALIST</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-serif mb-5 leading-tight">
            <TypingReveal
              text="Specialized Endodontic Care Focused On Saving Natural Teeth"
              speed={18}
              as="span"
            />
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Endodontic treatment focuses on diagnosing and treating conditions involving the delicate inside of the tooth. Under the specialized care of Dr. Lovely Das, the primary goal is to resolve infection, alleviate discomfort, and help patients retain their natural biological teeth whenever clinically appropriate.
          </p>
        </div>

        {/* 6 Specialist Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {endodonticCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500/60 rounded-2xl p-6 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-900/60 text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform border border-teal-700/40">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-teal-400">
                      {card.highlight}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-serif group-hover:text-teal-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Specialist Protocol</span>
                  <span className="text-teal-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Clinical Journey */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Transparent Care Process
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mt-1">
              What to Expect During Your Endodontic Care
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Every procedure follows rigorous sterilization, gentle anesthesia protocols, and patient-first pacing.
            </p>
          </div>

          {/* Steps navigation tab strip */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {ROOT_CANAL_STEPS.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  activeStep === idx
                    ? "bg-teal-700 text-white shadow-sm border border-teal-500"
                    : "bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700"
                }`}
              >
                <span className="font-bold text-teal-300">{step.step}</span>
                <span>{step.title.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="bg-slate-900 border border-slate-700/70 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">
                <span>Phase {ROOT_CANAL_STEPS[activeStep].step}</span>
                <span>·</span>
                <span>Endodontic Protocol</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white font-serif mb-3">
                {ROOT_CANAL_STEPS[activeStep].title}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {ROOT_CANAL_STEPS[activeStep].description}
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                Schedule Consultation
              </button>
              <a
                href={DOCTOR_INFO.phoneTel}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors whitespace-nowrap text-center"
              >
                Call Clinic
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
