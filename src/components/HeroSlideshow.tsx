import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Phone, Calendar, Star, Pause, Play } from "lucide-react";
import { HERO_SLIDES, DOCTOR_INFO, HeroSlide } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";
import { SafeImage } from "./SafeImage";

interface HeroSlideshowProps {
  onBookClick: () => void;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({ onBookClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = HERO_SLIDES.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const currentSlide: HeroSlide = HERO_SLIDES[currentIndex];

  const handleCtaClick = (action: string) => {
    if (action === "#appointment") {
      onBookClick();
    } else if (action.startsWith("#")) {
      const el = document.querySelector(action);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      aria-label="Doctor and Clinic Hero Showcase"
      className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] xl:min-h-[740px] bg-slate-950 overflow-hidden select-none flex items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides with Lenus-style Fade Effect */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Right-aligned Image: Never distorted, strictly proportional, clear at right */}
            <div className="absolute inset-0 w-full h-full flex justify-end">
              <div className="w-full lg:w-[68%] xl:w-[62%] h-full relative">
                <SafeImage
                  src={slide.image}
                  fallbackSrc={slide.fallbackImage}
                  alt={slide.imageAlt}
                  className="w-full h-full object-cover"
                  objectPosition="center 30%"
                />
              </div>
            </div>

            {/* Lenus-inspired Horizontal Gradient Overlay:
                Darker on left behind text, gradually fading to 0% transparent at right.
                Patient/doctor and clinic elements remain bright and clearly visible on the right. */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.88) 32%, rgba(15, 23, 42, 0.55) 58%, rgba(15, 23, 42, 0.15) 80%, rgba(15, 23, 42, 0) 100%)",
              }}
            />

            {/* Mobile Vertical Gradient Fallback */}
            <div
              className="absolute inset-0 z-20 pointer-events-none lg:hidden"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.82) 42%, rgba(15, 23, 42, 0.96) 85%)",
              }}
            />
          </div>
        );
      })}

      {/* Hero Foreground Content: Left-aligned over shaded gradient */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-2xl lg:max-w-xl xl:max-w-2xl text-left">
          {/* Eyebrow Label with Typing effect */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
            <TypingReveal
              key={`eyebrow-${currentSlide.id}`}
              text={currentSlide.eyebrow}
              speed={20}
              className="text-xs sm:text-sm font-semibold tracking-widest text-teal-300 uppercase drop-shadow-xs font-sans"
            />
          </div>

          {/* Large Headline with Typing Effect */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18] sm:leading-[1.15] mb-4 sm:mb-5 font-serif text-balance drop-shadow-md min-h-[3.6em] sm:min-h-[2.8em] flex items-center">
            <TypingReveal
              key={`headline-${currentSlide.id}`}
              text={currentSlide.heading}
              speed={16}
              delay={80}
              showCursor={false}
              className="font-serif"
            />
          </h1>

          {/* Short Supporting Paragraph */}
          <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed mb-7 sm:mb-8 font-normal max-w-xl drop-shadow-xs min-h-[3.2em]">
            {currentSlide.description}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            {/* Primary CTA */}
            {currentSlide.primaryCtaAction.startsWith("tel:") ? (
              <a
                href={currentSlide.primaryCtaAction}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-teal-950/40 transition-all cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>{currentSlide.primaryCtaText}</span>
              </a>
            ) : (
              <button
                onClick={() => handleCtaClick(currentSlide.primaryCtaAction)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-teal-950/40 transition-all cursor-pointer whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>{currentSlide.primaryCtaText}</span>
              </button>
            )}

            {/* Secondary CTA */}
            <a
              href={DOCTOR_INFO.phoneTel}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-medium text-sm border border-white/25 backdrop-blur-xs transition-all whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-teal-300" />
              <span>{currentSlide.secondaryCtaText}</span>
            </a>
          </div>

          {/* Trust Marker Strip */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-white">4.9 / 5</span>
              <span className="text-slate-400">· 39 Google Reviews</span>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Mukundapur Clinic · Closes 9 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-5 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center gap-3">
        {/* Play / Pause */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center justify-center transition-colors cursor-pointer"
          aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-teal-700 text-white border border-slate-700/80 flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Slide Indicators / Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {HERO_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? "w-7 h-2 bg-teal-400"
                  : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-teal-700 text-white border border-slate-700/80 flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
