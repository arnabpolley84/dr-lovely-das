import React from "react";
import { ShieldCheck, MessageSquare, HeartHandshake, Stethoscope, UserCheck, MapPin } from "lucide-react";
import { WHY_CHOOSE_ITEMS } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";

export const WhyChooseSection: React.FC = () => {
  const iconMap: Record<string, React.ElementType> = {
    ShieldCheck,
    MessageSquare,
    HeartHandshake,
    Stethoscope,
    UserCheck,
    MapPin,
  };

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Specialist Standards</span>
            <span>·</span>
            <span>Patient Commitment</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-4">
            <TypingReveal text="Why Patients Trust Dr. Lovely Das" speed={20} as="span" />
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Delivering thoughtful endodontic care grounded in thorough diagnosis, transparent communication, and patient comfort.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {WHY_CHOOSE_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <div
                key={item.title}
                className="p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-teal-400/80 transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-serif mb-2.5 group-hover:text-teal-800 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
