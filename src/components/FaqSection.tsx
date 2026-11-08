import React, { useState } from "react";
import { FAQS } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";
import { ChevronDown, HelpCircle, Phone } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Patient Information</span>
            <span>·</span>
            <span>Questions & Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-4">
            <TypingReveal text="Frequently Asked Questions" speed={20} as="span" />
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Medically responsible answers to common patient questions regarding endodontic procedures, tooth pain, and root canal care.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 mb-12">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4.5 px-6 sm:px-7 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer hover:bg-slate-50/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-serif">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-teal-100 text-teal-800" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extra question helper */}
        <div className="text-center p-6 rounded-2xl bg-white border border-slate-200 text-sm text-slate-600 max-w-xl mx-auto shadow-xs">
          <p className="font-semibold text-slate-900 mb-1">
            Have a question about your specific symptoms?
          </p>
          <p className="text-xs text-slate-500 mb-3">
            Dr. Lovely Das and our clinical team are available to guide you.
          </p>
          <a
            href="tel:+919007162723"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-4 py-2 rounded-xl transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Clinic: 090071 62723</span>
          </a>
        </div>
      </div>
    </section>
  );
};
