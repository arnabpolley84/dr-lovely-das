import React, { useState } from "react";
import { DENTAL_ARTICLES, EducationalArticle } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";
import { BookOpen, Clock, ArrowRight, X, CheckCircle } from "lucide-react";

export const DentalEducationSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<EducationalArticle | null>(null);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Patient Education</span>
            <span>·</span>
            <span>Evidence-Based Information</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-4">
            <TypingReveal text="Dental Care Insights" speed={20} as="span" />
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Helpful, medically responsible guidance to help you understand tooth pain symptoms, root canal therapy, and long-term tooth preservation.
          </p>
        </div>

        {/* 6 Article Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {DENTAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-teal-400 hover:bg-white transition-all duration-200 shadow-2xs group cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="font-semibold text-teal-800">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 font-serif mb-3 group-hover:text-teal-700 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-teal-700 group-hover:text-teal-900">
                <span>Read Full Insight</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Close reading view"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <span className="font-bold text-teal-700">{selectedArticle.category}</span>
              <span>·</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mb-4 pr-8">
              {selectedArticle.title}
            </h3>

            <p className="text-base text-slate-700 leading-relaxed mb-6 font-medium bg-teal-50/50 p-4 rounded-xl border border-teal-100">
              {selectedArticle.summary}
            </p>

            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Clinical Takeaways:
              </h4>
              {selectedArticle.keyPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-6">
              <strong className="text-slate-800 block mb-1">Clinical Note from Dr. Lovely Das:</strong>
              {selectedArticle.clinicalNote}
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              Close Reading View
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
