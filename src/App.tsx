import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code2, Briefcase, Layers, GraduationCap, Tag, Newspaper, PhoneCall } from "lucide-react";
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
import PageBanner from "./components/PageBanner";
import defaultDb from "./db.json";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [selectedServicePreset, setSelectedServicePreset] = useState("");
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Router page state
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const validPages = ["inicio", "servicios", "portafolio", "proceso", "academia", "planes", "blog", "contacto"];
    return validPages.includes(hash) ? hash : "inicio";
  });

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

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      const validPages = ["inicio", "servicios", "portafolio", "proceso", "academia", "planes", "blog", "contacto"];
      if (validPages.includes(hash)) {
        setActivePage(hash);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
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
        localStorage.setItem("app_db_data", JSON.stringify(data));
      } else {
        throw new Error("API response was not OK");
      }
    } catch (err) {
      console.warn("Using offline / local storage database fallback:", err);
      const cached = localStorage.getItem("app_db_data");
      if (cached) {
        try {
          setAppData(JSON.parse(cached));
        } catch {
          setAppData(defaultDb);
        }
      } else {
        setAppData(defaultDb);
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page: string) => {
    const validPages = ["inicio", "servicios", "portafolio", "proceso", "academia", "planes", "blog", "contacto"];
    const target = validPages.includes(page) ? page : "inicio";
    setActivePage(target);
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectPlan = (planName: string) => {
    let presetLabel = "";
    if (planName === "Landing Page") presetLabel = "Landing Pages";
    else if (planName === "Página Corporativa") presetLabel = "Diseño de páginas web profesionales";
    else if (planName === "Tienda Virtual") presetLabel = "Tiendas Virtuales (E-commerce)";

    setSelectedServicePreset(presetLabel);
    navigateTo("contacto");
  };

  if (loading || !appData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-mono text-xs gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>
        <span>Sincronizando con Servidor de Sinergia Agencia Creativa...</span>
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
        activePage={activePage}
        onNavigate={navigateTo}
      />

      {/* 3. INDIVIDUAL PAGE CONTENT WITH ANIMATE PRESENCE */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activePage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="min-h-[70vh]"
        >
          {/* PAGE 1: INICIO */}
          {activePage === "inicio" && (
            <div>
              <Hero onNavigate={navigateTo} />
              <StatsSection />
              
              {/* Quick Services Overview on Home */}
              <div className="py-16 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                  <div>
                    <span className="text-primary dark:text-secondary font-mono text-xs uppercase font-bold tracking-widest block mb-2">
                      Nuestros Pilares
                    </span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white">
                      Soluciones Destacadas
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo("servicios")}
                    className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-mono font-bold uppercase hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    Ver Todos los Servicios →
                  </button>
                </div>
                <ServicesSection services={appData.services.slice(0, 3)} />
              </div>

              {/* Automation Teaser */}
              <AutomationSection />

              {/* Featured Portfolio Preview */}
              <div className="py-16 px-6 max-w-7xl mx-auto border-t border-gray-100 dark:border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                  <div>
                    <span className="text-primary dark:text-secondary font-mono text-xs uppercase font-bold tracking-widest block mb-2">
                      Casos de Éxito
                    </span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white">
                      Proyectos Recientes
                    </h2>
                  </div>
                  <button
                    onClick={() => navigateTo("portafolio")}
                    className="px-6 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 text-xs font-mono font-bold uppercase hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    Explorar Portafolio Completo →
                  </button>
                </div>
                <PortfolioSection projects={appData.portfolio.slice(0, 3)} />
              </div>

              {/* Call to Action Banner */}
              <div className="py-20 px-6 max-w-7xl mx-auto text-center relative overflow-hidden my-12 rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20">
                <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-black dark:text-white mb-4">
                  ¿Listo para impulsar la presencia digital de tu marca?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-sm sm:text-base font-light mb-8">
                  Consulta nuestros planes en pesos colombianos o solicita una sesión estratégica sin costo de 15 minutos.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => navigateTo("planes")}
                    className="px-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-primary/20"
                  >
                    Ver Planes & Tarifas
                  </button>
                  <button
                    onClick={() => navigateTo("contacto")}
                    className="px-8 py-3.5 rounded-full bg-white dark:bg-black text-black dark:text-white font-bold text-sm border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer"
                  >
                    Contactar un Asesor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: SERVICIOS */}
          {activePage === "servicios" && (
            <div>
              <PageBanner
                title="Servicios & Soluciones Digitales"
                subtitle="Creamos experiencias web de lujo, sistemas de e-commerce de alto rendimiento y automatizaciones conversacionales impulsadas por IA."
                badge="Lujo & Rendimiento"
                icon={<Code2 size={12} />}
                stats={[
                  { value: "99.8%", label: "Uptime Servidores" },
                  { value: "3x", label: "Velocidad de Carga" },
                  { value: "24/7", label: "Atención IA WhatsApp" },
                  { value: "100%", label: "Código Responsive" }
                ]}
                actionBtn={{
                  text: "Ver Planes & Precios",
                  onClick: () => navigateTo("planes")
                }}
                secondaryActionBtn={{
                  text: "Solicitar Cotización",
                  onClick: () => navigateTo("contacto")
                }}
                onNavigateHome={() => navigateTo("inicio")}
              />
              <ServicesSection services={appData.services} />
              <AutomationSection />
              <FaqSection />
            </div>
          )}

          {/* PAGE 3: PORTAFOLIO */}
          {activePage === "portafolio" && (
            <div>
              <PageBanner
                title="Portafolio & Casos de Éxito"
                subtitle="Explora nuestra colección de proyectos destacados en diseño web, plataformas e-commerce y desarrollo de software a medida."
                badge="Proyectos Reales"
                icon={<Briefcase size={12} />}
                stats={[
                  { value: "+50", label: "Marcas Digitalizadas" },
                  { value: "100%", label: "Clientes Satisfechos" },
                  { value: "12", label: "Países de Alcance" },
                  { value: "4.9★", label: "Calificación Promedio" }
                ]}
                actionBtn={{
                  text: "Iniciar Mi Proyecto",
                  onClick: () => navigateTo("contacto")
                }}
                secondaryActionBtn={{
                  text: "Ver Tarifas",
                  onClick: () => navigateTo("planes")
                }}
                onNavigateHome={() => navigateTo("inicio")}
              />
              <PortfolioSection projects={appData.portfolio} />
              <TestimonialsSection testimonials={appData.testimonials} />
            </div>
          )}

          {/* PAGE 4: PROCESO */}
          {activePage === "proceso" && (
            <div>
              <PageBanner
                title="Metodología de Trabajo"
                subtitle="Un proceso estructurado, transparente y orientado a resultados en 4 fases claves, garantizando entregas ágiles y estándares internacionales."
                badge="Metodología Ágil"
                icon={<Layers size={12} />}
                stats={[
                  { value: "5-7 Días", label: "Entrega Landing Page" },
                  { value: "100%", label: "Código Propio" },
                  { value: "3 Meses", label: "Soporte Incluido" },
                  { value: "4 Fases", label: "Proceso Claro" }
                ]}
                actionBtn={{
                  text: "Agendar Consultoría",
                  onClick: () => navigateTo("contacto")
                }}
                onNavigateHome={() => navigateTo("inicio")}
              />
              <ProcessSection />
              <FaqSection />
            </div>
          )}

          {/* PAGE 5: ACADEMIA */}
          {activePage === "academia" && (
            <div>
              <PageBanner
                title="Academia Sinergia"
                subtitle="Plataforma de aprendizaje interactivo. Capacítate en desarrollo web, bots de WhatsApp Cloud API e integración de IA para negocios."
                badge="Aulas Virtuales & Certificados"
                icon={<GraduationCap size={12} />}
                stats={[
                  { value: "100%", label: "Acceso Interactivo" },
                  { value: "4.9★", label: "Calificación Alumnos" },
                  { value: "Certificados", label: "Al Finalizar" },
                  { value: "24/7", label: "Aula Virtual" }
                ]}
                actionBtn={{
                  text: "Ver Cursos Disponibles",
                  onClick: () => {
                    const el = document.getElementById("cursos");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                onNavigateHome={() => navigateTo("inicio")}
              />
              <CoursesSection courses={appData.courses} />
            </div>
          )}

          {/* PAGE 6: PLANES */}
          {activePage === "planes" && (
            <div>
              <PageBanner
                title="Planes & Cotizaciones"
                subtitle="Inversión transparente en Pesos Colombianos (COP) para impulsar tu marca con resultados medibles y sin costos ocultos."
                badge="Inversión Transparente"
                icon={<Tag size={12} />}
                stats={[
                  { value: "$990.000 COP", label: "Landing Page" },
                  { value: "$1.980.000 COP", label: "Página Corporativa" },
                  { value: "$2.990.000 COP", label: "Tienda Promo" },
                  { value: "0%", label: "Costos Ocultos" }
                ]}
                actionBtn={{
                  text: "Solicitar Cotización",
                  onClick: () => navigateTo("contacto")
                }}
                secondaryActionBtn={{
                  text: "Hablar por WhatsApp",
                  onClick: () => window.open("https://wa.me/573145532957", "_blank")
                }}
                onNavigateHome={() => navigateTo("inicio")}
              />
              <PlanesSection onSelectPlan={handleSelectPlan} />
              <FaqSection />
            </div>
          )}

          {/* PAGE 7: BLOG */}
          {activePage === "blog" && (
            <div>
              <PageBanner
                title="Blog, Noticias & Comunidad"
                subtitle="Estrategias de marketing digital, automatización de WhatsApp, agentes de IA y tendencias tecnológicas para líderes de negocios."
                badge="Conocimiento & Insights"
                icon={<Newspaper size={12} />}
                stats={[
                  { value: "Semanal", label: "Artículos Nuevos" },
                  { value: "100%", label: "Contenido Gratuito" },
                  { value: "WhatsApp & IA", label: "Estrategias Reales" },
                  { value: "Guías PDF", label: "Recursos Gratis" }
                ]}
                actionBtn={{
                  text: "Unirme a la Comunidad",
                  onClick: () => navigateTo("contacto")
                }}
                onNavigateHome={() => navigateTo("inicio")}
              />
              <BlogSection posts={appData.blog} />
              <SocialSection posts={appData.socialPosts} />
            </div>
          )}

          {/* PAGE 8: CONTACTO */}
          {activePage === "contacto" && (
            <div>
              <PageBanner
                title="Contacto & Agendamiento"
                subtitle="Hablemos de tu proyecto. Completa el formulario de requerimientos o contáctanos directamente vía WhatsApp o correo electrónico."
                badge="Respuesta en < 24 Horas"
                icon={<PhoneCall size={12} />}
                stats={[
                  { value: "+57 314 553 2957", label: "WhatsApp Directo" },
                  { value: "comercial@", label: "Correo Comercial" },
                  { value: "24 Horas", label: "Respuesta Estimada" },
                  { value: "15 Min", label: "Sesión Sin Costo" }
                ]}
                actionBtn={{
                  text: "Escribir por WhatsApp",
                  onClick: () => window.open("https://wa.me/573145532957", "_blank")
                }}
                onNavigateHome={() => navigateTo("inicio")}
              />
              <ContactSection selectedServicePreset={selectedServicePreset} />
              <FaqSection />
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      {/* FOOTER */}
      <Footer onNavigate={navigateTo} />

      {/* CHATBOT CONVERSATIONAL ASSISTANT */}
      <AiChatbot />

      {/* COMPREHENSIVE CONTROL DESK PANEL */}
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
