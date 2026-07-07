import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesSection from "./components/ServicesSection";
import PortfolioSection from "./components/PortfolioSection";
import ProcessSection from "./components/ProcessSection";
import StatsSection from "./components/StatsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PlanesSection from "./components/PlanesSection";
import CoursesSection from "./components/CoursesSection";
import SocialSection from "./components/SocialSection";
import AutomationSection from "./components/AutomationSection";
import BlogSection from "./components/BlogSection";
import FaqSection from "./components/FaqSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import AiChatbot from "./components/AiChatbot";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedServicePreset, setSelectedServicePreset] = useState("");
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Customized cursor position tracking
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // Enable dark mode as default
    const isDark = localStorage.getItem("theme") !== "light";
    setDarkMode(isDark);

    // Track cursor movements
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Fetch primary database contents from Server
    fetchData();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Watch dark mode shifts
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      if (res.ok) {
        const data = await res.json();
        setAppData(data);
      }
    } catch (err) {
      console.error("Error loading application data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planName: string) => {
    let presetLabel = "";
    if (planName === "Landing Page") presetLabel = "Landing Pages";
    else if (planName === "Página Corporativa") presetLabel = "Diseño de páginas web profesionales";
    else if (planName === "Tienda Virtual") presetLabel = "Tiendas Virtuales (E-commerce)";

    setSelectedServicePreset(presetLabel);
    // Smooth scroll to contact form
    const contactSec = document.getElementById("contacto");
    if (contactSec) {
      contactSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading || !appData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono text-xs gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
        <span>Sincronizando con Servidor de Jose Urdaneta...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#051a1b] text-black dark:text-white min-h-screen font-sans selection:bg-primary selection:text-white dark:selection:bg-secondary dark:selection:text-black relative transition-colors duration-300 overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="hidden dark:block absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-[#0E5A5E] rounded-full blur-[130px] opacity-25 pointer-events-none z-0"></div>
      <div className="hidden dark:block absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#F4B400] rounded-full blur-[150px] opacity-10 pointer-events-none z-0"></div>
      <div className="hidden dark:block absolute top-[40%] left-[20%] w-[450px] h-[450px] bg-[#0E5A5E] rounded-full blur-[130px] opacity-15 pointer-events-none z-0"></div>

      {/* 1. CUSTOM SYSTEM CURSOR (Lag trails) */}
      <div
        className="hidden lg:block fixed w-8 h-8 rounded-full border border-primary dark:border-secondary pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 mix-blend-difference"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      ></div>
      <div
        className="hidden lg:block fixed w-2.5 h-2.5 rounded-full bg-primary dark:bg-secondary pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 mix-blend-difference"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      ></div>

      {/* 2. NAVIGATION BAR */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openAdmin={() => setAdminOpen(true)}
      />

      {/* 3. HERO SHOWCASE HEADER */}
      <Hero />

      {/* 4. STATISTICS OVERVIEW */}
      <StatsSection />

      {/* 5. CORE SOLUTIONS (SERVICES GRID) */}
      <ServicesSection services={appData.services} />

      {/* 6. AUTOMATION GRAPH (CLIENT -> WHATSAPP -> IA -> CRM -> SALE) */}
      <AutomationSection />

      {/* 7. PORTFOLIO SHOWCASE */}
      <PortfolioSection projects={appData.portfolio} />

      {/* 8. WORK METHODOLOGY (Timeline Process) */}
      <ProcessSection />

      {/* 9. TESTIMONIALS */}
      <TestimonialsSection testimonials={appData.testimonials} />

      {/* 9b. COURSES ACADEMY (LMS) */}
      <CoursesSection courses={appData.courses} />

      {/* 10. PACKAGES & ESTIMATES COMPARISON */}
      <PlanesSection onSelectPlan={handleSelectPlan} />

      {/* 11. SOCIAL INTEGRATIONS */}
      <SocialSection posts={appData.socialPosts} />

      {/* 12. KNOWLEDGE / INSIGHTS (BLOG) */}
      <BlogSection posts={appData.blog} />

      {/* 13. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <FaqSection />

      {/* 14. INTAKE FORM & GOOGLE MAPS */}
      <ContactSection selectedServicePreset={selectedServicePreset} />

      {/* 15. FOOTER */}
      <Footer />

      {/* 16. CHATBOT CONVERSATIONAL ASSISTANT */}
      <AiChatbot />

      {/* 17. COMPREHENSIVE CONTROL DESK PANEL */}
      <AnimatePresence>
        {adminOpen && (
          <AdminPanel
            initialData={appData}
            onClose={() => setAdminOpen(false)}
            onDataUpdate={fetchData}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
