import React from "react";
import { Phone, MapPin, Clock, Star, Shield, ArrowUp } from "lucide-react";
import { DOCTOR_INFO } from "../data/dentalData";

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand & Doctor Credentials Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-800 text-teal-200 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-serif text-white tracking-tight">
                  {DOCTOR_INFO.name}
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  {DOCTOR_INFO.title}
                </p>
              </div>
            </div>

            <p className="text-xs font-bengali text-slate-400 mb-4 leading-relaxed">
              {DOCTOR_INFO.bengaliName} — {DOCTOR_INFO.bengaliTitle}, {DOCTOR_INFO.bengaliLocation}
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              Specialized, comfort-focused root canal care, diagnostic pain evaluation, and natural tooth preservation in Mukundapur, Kolkata.
            </p>

            <div className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9 / 5</span>
              <span className="text-slate-500">· 39 Google Reviews</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-teal-400 transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {onAdminClick && (
                <li>
                  <button
                    onClick={onAdminClick}
                    className="text-xs text-teal-400 hover:text-teal-300 transition-colors cursor-pointer font-medium"
                  >
                    Doctor / Admin Portal →
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Location & Contact Column */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Clinic Contact & Hours
            </h4>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-1" />
                <div className="text-xs leading-relaxed text-slate-300">
                  <p className="font-semibold text-white">Metro Station - Jyotirindra Nandi</p>
                  <p>1/2 Nitai Nagar, Tara Bhavan, Mukundapur, Kalikapur,</p>
                  <p className="text-teal-400">Beside Metro Cash & Carry, Kolkata 700099</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500">Phone Consultation</p>
                  <a
                    href={DOCTOR_INFO.phoneTel}
                    className="text-sm font-bold text-white hover:text-teal-300 transition-colors"
                  >
                    {DOCTOR_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-500">Hours</p>
                  <p className="text-xs text-slate-300">{DOCTOR_INFO.operatingHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Doctor Portal & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Dr. Lovely Das. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            <p className="text-center sm:text-right">
              MDS Endodontist & Root Canal Specialist · Mukundapur
            </p>
            {onAdminClick && (
              <button
                onClick={onAdminClick}
                className="text-slate-400 hover:text-teal-300 transition-colors underline cursor-pointer text-[11px]"
              >
                Admin Login
              </button>
            )}
          </div>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
