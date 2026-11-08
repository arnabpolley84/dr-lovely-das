import React, { useState, useEffect } from "react";
import { Phone, Calendar, MessageCircle, Menu, X, Shield } from "lucide-react";
import { DOCTOR_INFO } from "../data/dentalData";

interface HeaderProps {
  onBookClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBengali, setShowBengali] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Treatments", href: "#treatments" },
    { label: "Root Canal", href: "#root-canal-care" },
    { label: "Reviews", href: "#reviews" },
    { label: "Gallery", href: "#gallery" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#location" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
          : "bg-white border-b border-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Identity Zone */}
          <a
            href="#home"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 max-w-[62%] sm:max-w-none text-left"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#home");
            }}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-teal-700 to-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
              <Shield className="w-5 h-5 text-teal-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 truncate">
                  {showBengali ? DOCTOR_INFO.bengaliName : DOCTOR_INFO.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBengali(!showBengali);
                  }}
                  className="hidden md:inline-flex text-[10px] font-medium text-teal-700 hover:text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/70 cursor-pointer"
                  title="Toggle Bengali script"
                >
                  {showBengali ? "English" : "বাংলা"}
                </button>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-teal-700 tracking-wider uppercase truncate">
                {showBengali
                  ? DOCTOR_INFO.bengaliTitle
                  : "MDS Endodontist · Root Canal Specialist"}
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links - Guaranteed single line */}
          <nav
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-6 lg:gap-7 text-sm font-medium text-slate-700"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="whitespace-nowrap shrink-0 hover:text-teal-700 transition-colors py-1 relative group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-600 transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {/* Call Now */}
            <a
              href={DOCTOR_INFO.phoneTel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 border border-slate-200/80"
              title="Call Dr. Lovely Das"
            >
              <Phone className="w-3.5 h-3.5 text-teal-700 shrink-0" />
              <span className="whitespace-nowrap">Call Now</span>
            </a>

            {/* WhatsApp Direct */}
            <a
              href={DOCTOR_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-9 h-9 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/80 shrink-0"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp with Dr. Lovely Das"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600/10" />
            </a>

            {/* Book Appointment CTA */}
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 active:scale-[0.98] rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap font-medium">
                Book Appointment
              </span>
            </button>
          </div>

          {/* Mobile Right Controls: Quick Call & Hamburger */}
          <div className="flex xl:hidden items-center gap-1.5 shrink-0">
            <a
              href={DOCTOR_INFO.phoneTel}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-md border border-teal-200/70 whitespace-nowrap"
              title="Call Doctor"
              aria-label="Call Dr. Lovely Das at 090071 62723"
            >
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              <span className="hidden xs:inline font-medium">Call</span>
            </a>

            <button
              onClick={onBookClick}
              className="hidden sm:inline-flex lg:hidden items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-md shadow-xs whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation: fully inside viewport, scrollable, zero clipping */}
      {mobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-slate-900/60 backdrop-blur-xs z-50 flex flex-col justify-start animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="bg-white border-b border-slate-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto w-full p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setShowBengali(!showBengali)}
                className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
              >
                {showBengali ? "English" : "বাংলা রূপান্তর"}
              </button>
            </div>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-teal-50 hover:text-teal-800 transition-colors flex items-center justify-between"
                >
                  <span className="whitespace-nowrap">{link.label}</span>
                  <span className="text-slate-300">→</span>
                </a>
              ))}
            </nav>

            <div className="mt-5 pt-4 border-t border-slate-200 space-y-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full py-3 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={DOCTOR_INFO.phoneTel}
                  className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                  <span>Call 090071 62723</span>
                </a>

                <a
                  href={DOCTOR_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="mt-4 pt-3 text-center border-t border-slate-100 text-[11px] text-slate-500">
              <p>Mukundapur, Kalikapur · Near Jyotirindra Nandi Metro</p>
              <p className="mt-0.5 font-medium text-teal-700">{DOCTOR_INFO.hours}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
