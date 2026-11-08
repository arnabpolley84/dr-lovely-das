import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";
import { PATIENT_REVIEWS, DOCTOR_INFO } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";

export const PatientReviewsSection: React.FC = () => {
  const [activeReview, setActiveReview] = useState(0);

  const nextReview = () => {
    setActiveReview((prev) => (prev + 1) % PATIENT_REVIEWS.length);
  };

  const prevReview = () => {
    setActiveReview((prev) => (prev - 1 + PATIENT_REVIEWS.length) % PATIENT_REVIEWS.length);
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with 4.9 / 39 Google Reviews highlight */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950 text-teal-300 text-xs font-semibold mb-4 border border-teal-800">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>VERIFIED PATIENT EXPERIENCES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-serif mb-4">
            <TypingReveal text="What Patients Share About Their Care" speed={18} as="span" />
          </h2>

          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-lg mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-left border-l border-slate-700 pl-3">
              <p className="text-base font-bold text-white leading-none">
                4.9 / 5 Rating
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Based on 39 Google Reviews
              </p>
            </div>
          </div>
        </div>

        {/* Featured Testimonial Carousel */}
        <div className="max-w-4xl mx-auto relative mb-12">
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
            <Quote className="w-12 h-12 text-teal-500/25 absolute top-6 left-6 -z-0" />

            <div className="relative z-10">
              {/* Star rating of review */}
              <div className="flex items-center gap-1 text-amber-400 mb-6">
                {[...Array(PATIENT_REVIEWS[activeReview].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-semibold text-slate-300 ml-2">
                  {PATIENT_REVIEWS[activeReview].treatmentTag}
                </span>
              </div>

              {/* Exact Patient Quote */}
              <blockquote className="text-lg sm:text-2xl text-slate-100 font-serif leading-relaxed mb-8 italic">
                &ldquo;{PATIENT_REVIEWS[activeReview].reviewText}&rdquo;
              </blockquote>

              {/* Patient Attribution */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-slate-700/70">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-bold text-sm flex items-center justify-center shadow-md">
                    {PATIENT_REVIEWS[activeReview].reviewerInitials}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {PATIENT_REVIEWS[activeReview].reviewerName}
                    </h4>
                    <p className="text-xs text-teal-400">
                      {PATIENT_REVIEWS[activeReview].verifiedStatus} · {PATIENT_REVIEWS[activeReview].locationTag}
                    </p>
                  </div>
                </div>

                {/* Navigation controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevReview}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-teal-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs text-slate-400 font-mono px-2">
                    0{activeReview + 1} / 0{PATIENT_REVIEWS.length}
                  </span>
                  <button
                    onClick={nextReview}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-teal-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Review Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {PATIENT_REVIEWS.map((review, idx) => (
            <div
              key={review.id}
              onClick={() => setActiveReview(idx)}
              className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
                idx === activeReview
                  ? "bg-slate-800 border-teal-500 shadow-md ring-1 ring-teal-500/40"
                  : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-teal-400 font-medium">Google Review</span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 mb-4 italic">
                &ldquo;{review.reviewText}&rdquo;
              </p>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
                <div className="w-7 h-7 rounded-full bg-teal-900 text-teal-300 font-bold text-xs flex items-center justify-center">
                  {review.reviewerInitials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {review.reviewerName}
                  </p>
                  <p className="text-[10px] text-slate-400">{review.locationTag}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
