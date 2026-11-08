import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { TopInfoStrip } from "./components/TopInfoStrip";
import { Header } from "./components/Header";
import { HeroSlideshow } from "./components/HeroSlideshow";
import { QuickContactCTA } from "./components/QuickContactCTA";
import { AboutSection } from "./components/AboutSection";
import { SpecialistRootCanalSection } from "./components/SpecialistRootCanalSection";
import { ServicesSection } from "./components/ServicesSection";
import { WhyChooseSection } from "./components/WhyChooseSection";
import { DoctorProfileSection } from "./components/DoctorProfileSection";
import { PatientReviewsSection } from "./components/PatientReviewsSection";
import { LocationSection } from "./components/LocationSection";
import { GallerySection } from "./components/GallerySection";
import { FaqSection } from "./components/FaqSection";
import { DentalEducationSection } from "./components/DentalEducationSection";
import { FinalCtaSection } from "./components/FinalCtaSection";
import { Footer } from "./components/Footer";
import { AppointmentModal } from "./components/AppointmentModal";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { Phone, MessageCircle } from "lucide-react";
import { DOCTOR_INFO } from "./data/dentalData";

type CurrentRoute = "home" | "admin" | "admin-login";

function getRouteFromLocation(): CurrentRoute {
  if (typeof window === "undefined") return "home";

  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();

  if (path === "/admin/login" || hash === "#/admin/login" || hash === "#admin/login") {
    return "admin-login";
  }
  if (path === "/admin" || path.startsWith("/admin/") || hash === "#/admin" || hash === "#admin") {
    return "admin";
  }
  return "home";
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<CurrentRoute>(getRouteFromLocation);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Monitor Supabase Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Monitor window navigation (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getRouteFromLocation());
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const navigateTo = (route: CurrentRoute) => {
    setCurrentRoute(route);
    let targetPath = "/";
    if (route === "admin") targetPath = "/admin";
    if (route === "admin-login") targetPath = "/admin/login";

    try {
      window.history.pushState({}, "", targetPath);
    } catch {
      window.location.hash = route === "home" ? "" : route;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigateTo("admin-login");
  };

  // 1. ADMIN LOGIN ROUTE (/admin/login)
  if (currentRoute === "admin-login") {
    return (
      <AdminLogin
        onLoginSuccess={() => navigateTo("admin")}
        onBackToWebsite={() => navigateTo("home")}
      />
    );
  }

  // 2. ADMIN DASHBOARD ROUTE (/admin)
  if (currentRoute === "admin") {
    // If not authenticated, prompt login
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => navigateTo("admin")}
          onBackToWebsite={() => navigateTo("home")}
        />
      );
    }

    return (
      <AdminDashboard
        onSignOut={handleSignOut}
        onReturnToWebsite={() => navigateTo("home")}
      />
    );
  }

  // 3. MAIN PATIENT WEBSITE ROUTE (Existing Design Preserved)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col relative selection:bg-teal-700 selection:text-white">
      {/* 1. Top Information Strip */}
      <TopInfoStrip
        onBookClick={() => setIsAppointmentModalOpen(true)}
        onAdminClick={() => navigateTo("admin")}
      />

      {/* 2. Main Sticky Navigation / Header */}
      <Header onBookClick={() => setIsAppointmentModalOpen(true)} />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* 3. Large Full-Width Hero Slideshow with Lenus-style Fade Effect */}
        <HeroSlideshow onBookClick={() => setIsAppointmentModalOpen(true)} />

        {/* 4. Quick Appointment / Contact CTA Section */}
        <QuickContactCTA onBookClick={() => setIsAppointmentModalOpen(true)} />

        {/* 5. About Dr. Lovely Das / About Clinic */}
        <AboutSection onBookClick={() => setIsAppointmentModalOpen(true)} />

        {/* 6. Specialized Root Canal / Endodontic Care Section */}
        <SpecialistRootCanalSection onBookClick={() => setIsAppointmentModalOpen(true)} />

        {/* 7. Dental & Endodontic Treatments Section */}
        <ServicesSection onBookClick={() => setIsAppointmentModalOpen(true)} />

        {/* 8. Why Patients Choose Dr. Lovely Das */}
        <WhyChooseSection />

        {/* 9 & 10. Specialist Doctor Profile & Root Canal Highlight */}
        <DoctorProfileSection onBookClick={() => setIsAppointmentModalOpen(true)} />

        {/* 11. Patient Reviews / Testimonials (4.9 / 39 Google Reviews) */}
        <PatientReviewsSection />

        {/* 12. Location & Areas Served Across South Kolkata */}
        <LocationSection onBookClick={() => setIsAppointmentModalOpen(true)} />

        {/* 13. Clinic & Specialist Gallery */}
        <GallerySection />

        {/* 14. FAQ Section */}
        <FaqSection />

        {/* 15. Dental Education / Helpful Information Section */}
        <DentalEducationSection />

        {/* 16. Final Appointment Call-To-Action */}
        <FinalCtaSection onBookClick={() => setIsAppointmentModalOpen(true)} />
      </main>

      {/* 17. Footer */}
      <Footer onAdminClick={() => navigateTo("admin")} />

      {/* Interactive Supabase-Powered Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />

      {/* Floating Speed Contact for Mobile & Quick Inquiries */}
      <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-2.5 sm:hidden">
        <a
          href={DOCTOR_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
        <a
          href={DOCTOR_INFO.phoneTel}
          className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Call clinic"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
