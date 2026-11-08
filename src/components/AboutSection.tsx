import React from "react";
import { CheckCircle2, Shield, HeartHandshake, Eye, Sparkles, Phone, Calendar } from "lucide-react";
import { DOCTOR_INFO, IMAGE_A, LOCAL_HERO_3 } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";
import { SafeImage } from "./SafeImage";

interface AboutSectionProps {
  onBookClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onBookClick }) => {
  const corePrinciples = [
    {
      title: "Careful Diagnosis",
      desc: "Detailed clinical and radiographic assessment to identify the true origin of tooth discomfort before any procedure begins.",
      icon: Eye,
    },
    {
      title: "Patient Communication",
      desc: "Transparent discussions explaining your diagnosis, procedural stages, and options so you remain fully at ease.",
      icon: HeartHandshake,
    },
    {
      title: "Comfort-Focused Treatment",
      desc: "Modern local anesthesia protocols and gentle handling aimed at providing a calm, stress-free clinical experience.",
      icon: Shield,
    },
    {
      title: "Clinical Precision",
      desc: "Methodical disinfection and three-dimensional filling of delicate root canal systems using specialized endodontic instruments.",
      icon: Sparkles,
    },
    {
      title: "Preserving Natural Teeth",
      desc: "Prioritizing the conservation of your biological tooth structure to maintain natural chewing dynamics and jawbone health.",
      icon: CheckCircle2,
    },
    {
      title: "Personalized Care Plans",
      desc: "Tailoring every consultation to your specific health history, comfort preferences, and anatomical tooth requirements.",
      icon: Shield,
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Doctor Portrait with Soft Lenus-inspired Fade Treatment */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft decorative glow */}
              <div className="absolute -inset-4 bg-teal-100/60 rounded-3xl blur-2xl -z-10" />

              {/* Portrait container with smooth soft edges */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-150 bg-slate-50">
                <SafeImage
                  src={IMAGE_A}
                  fallbackSrc={LOCAL_HERO_3}
                  alt="Dr. Lovely Das MDS Endodontist & Root Canal Specialist Mukundapur Kolkata"
                  aspectRatioClass="aspect-[4/5]"
                  objectPosition="center 20%"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                />

                {/* Soft gradient bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent flex items-end p-5">
                  <div className="text-white">
                    <p className="font-bold text-lg leading-tight font-serif">
                      Dr. Lovely Das
                    </p>
                    <p className="text-xs text-teal-300 font-medium tracking-wide">
                      MDS Endodontist & Root Canal Specialist
                    </p>
                    <p className="text-[11px] text-slate-300 font-bengali mt-0.5">
                      ডাঃ লাভলি দাস · মুকুন্দপুর, কলকাতা
                    </p>
                  </div>
                </div>
              </div>

              {/* Verified Practice Float Tag */}
              <div className="absolute -top-4 -right-3 sm:-right-4 bg-white rounded-xl shadow-lg border border-slate-200/80 p-3 sm:p-4 max-w-[210px]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                    4.9★
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      Google Rating
                    </p>
                    <p className="text-[11px] text-slate-500">Based on 39 Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Clinical Pillars */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span>About The Specialist</span>
              <span>·</span>
              <span>Mukundapur, Kolkata</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif mb-2">
              <TypingReveal text="Meet Dr. Lovely Das" speed={24} as="span" />
            </h2>

            <p className="text-lg font-medium text-teal-800 mb-6 font-serif">
              MDS Endodontist & Root Canal Specialist in Mukundapur, Kolkata
            </p>

            <div className="prose text-slate-600 space-y-4 text-base leading-relaxed mb-8">
              <p>
                Dr. Lovely Das is an <strong>MDS Endodontist</strong> specializing in dedicated endodontic care and root canal therapy. Her clinical approach centers on understanding the precise nature of each patient&apos;s symptoms, providing clear communication, and delivering comfort-focused treatment with meticulous precision.
              </p>
              <p>
                Believing strongly that saving a patient&apos;s natural tooth is almost always the superior biological choice, Dr. Das utilizes modern diagnostic evaluation and conservative techniques to resolve tooth pain, clear internal infections, and restore functional oral health.
              </p>
            </div>

            {/* Core Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {corePrinciples.map((principle) => {
                const Icon = principle.icon;
                return (
                  <div
                    key={principle.title}
                    className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:border-teal-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-7 h-7 rounded-md bg-teal-100/70 text-teal-800 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {principle.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal pl-9">
                      {principle.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Direct Action Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onBookClick}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with Dr. Das</span>
              </button>

              <a
                href={DOCTOR_INFO.phoneTel}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm border border-slate-200 transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4 text-teal-700" />
                <span>Call 090071 62723</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
