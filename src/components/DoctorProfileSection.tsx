import React from "react";
import { CheckCircle2, Shield, Calendar, Phone, Sparkles } from "lucide-react";
import { DOCTOR_INFO, IMAGE_B, LOCAL_HERO_1 } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";
import { SafeImage } from "./SafeImage";

interface DoctorProfileSectionProps {
  onBookClick: () => void;
}

export const DoctorProfileSection: React.FC<DoctorProfileSectionProps> = ({ onBookClick }) => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-teal-50/30 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text: Doctor Profile & Root Canal Highlight */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Specialist Profile</span>
              <span>·</span>
              <span>Dedicated Endodontic Care</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif mb-2">
              <TypingReveal text="Specialist Care by Dr. Lovely Das" speed={20} as="span" />
            </h2>

            <p className="text-lg font-medium text-teal-800 font-serif mb-2">
              MDS Endodontist & Root Canal Specialist
            </p>

            <p className="text-sm font-bengali text-slate-600 mb-6">
              {DOCTOR_INFO.bengaliName} — {DOCTOR_INFO.bengaliTitle}
            </p>

            <div className="prose text-slate-600 space-y-4 text-base leading-relaxed mb-8">
              <p>
                In modern dentistry, tooth extraction should be considered only when a tooth cannot be predictably preserved. As an <strong>MDS Endodontist</strong>, Dr. Lovely Das focuses her entire practice on treating complex canal anatomy, resolving acute and chronic tooth pain, and performing carefully planned root canal procedures.
              </p>
              <p>
                Patients visiting the Mukundapur clinic experience a supportive environment where treatment steps are thoroughly outlined before beginning. By pairing specialized clinical instruments with gentle anesthesia techniques, Dr. Das works to replace dental apprehension with clarity and calm confidence.
              </p>
            </div>

            {/* Specialist Focus Checklist */}
            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">
                  Focused exclusively on endodontic therapy, internal tooth disinfection, and natural tooth preservation.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">
                  Transparent discussions of single-visit vs multi-visit root canal protocols based on clinical indications.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">
                  Detailed post-procedure guidance and seamless coordination for definitive ceramic crown placement.
                </span>
              </div>
            </div>

            {/* Consultation Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onBookClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Root Canal Consultation</span>
              </button>
              <a
                href={DOCTOR_INFO.phoneTel}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm border border-slate-200 transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>Call 090071 62723</span>
              </a>
            </div>
          </div>

          {/* Right Image: Clinic & Treatment Visual with Soft Fade Mask */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                <SafeImage
                  src={IMAGE_B}
                  fallbackSrc={LOCAL_HERO_1}
                  alt="Dr. Lovely Das clinical endodontic care Mukundapur Kolkata"
                  aspectRatioClass="aspect-[4/5]"
                  objectPosition="center 25%"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                />

                {/* Lenus subtle bottom fade overlay */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Comfort-Focused Dentistry</span>
                    </div>
                    <p className="text-base font-bold font-serif">
                      Endodontic Treatment Suite
                    </p>
                    <p className="text-xs text-slate-300">
                      Mukundapur · Near Jyotirindra Nandi Metro
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
