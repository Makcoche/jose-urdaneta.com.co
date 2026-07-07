import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Play, CheckCircle, Clock, Lock, Award, Sparkles,
  ChevronRight, GraduationCap, Search, PlayCircle, BookOpenCheck, ArrowRight,
  CreditCard, Smartphone, ShieldCheck, Copy, Check, Info, Calendar, DollarSign,
  User, UserCheck, LogOut, Key, Mail, ShieldAlert, X
} from "lucide-react";
import { Course, Lesson } from "../types";
import { useAuth } from "../context/AuthContext";

interface CoursesSectionProps {
  courses?: Course[];
}

export default function CoursesSection({ courses = [] }: CoursesSectionProps) {
  const { user, login: authLogin, register: authRegister, logout: authLogout, toggleLessonComplete: authToggleLessonComplete, hasAccessToLevel, updateUserMembership } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activePriceFilter, setActivePriceFilter] = useState("Todos"); // "Todos", "Gratis", "De Pago"
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth Dialog States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authRedirectAction, setAuthRedirectAction] = useState<{ type: "lms"; course: Course } | null>(null);
  const [accessDeniedCourse, setAccessDeniedCourse] = useState<Course | null>(null);

  // Sync logged in user profile with checkout fields
  useEffect(() => {
    if (user) {
      setFormName(user.name);
      setFormEmail(user.email);
    }
  }, [user]);

  // Membership & Checkout states
  const [checkoutMembership, setCheckoutMembership] = useState<{
    id: string;
    name: string;
    priceCop: string;
    priceUsd: string;
    level: "Principiante" | "Intermedio" | "Avanzado";
  } | null>(null);

  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<"Nequi" | "Bancolombia">("Nequi");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Gateway & Simulation states
  const [activeCheckoutTab, setActiveCheckoutTab] = useState<"gateway" | "manual">("gateway");
  const [isProcessingSimulated, setIsProcessingSimulated] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [simulatedStep, setSimulatedStep] = useState("");
  const [gatewayError, setGatewayError] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formVoucher, setFormVoucher] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formImage, setFormImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ["Todos", "Automatizacion", "Desarrollo", "Marketing"];

  const filteredCourses = courses.filter(course => {
    // Category filter
    const matchesCategory = activeCategory === "Todos" || course.category.toLowerCase() === activeCategory.toLowerCase();
    
    // Search filter
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price filter (Gratis vs Pago)
    const isFreeCourse = course.price.toLowerCase().includes("gratis") || course.price.toLowerCase().includes("gratuito") || course.price === "$0";
    let matchesPrice = true;
    if (activePriceFilter === "Gratis") {
      matchesPrice = isFreeCourse;
    } else if (activePriceFilter === "De Pago") {
      matchesPrice = !isFreeCourse;
    }

    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleOpenLms = (course: Course) => {
    const isFree = course.price.toLowerCase().includes("gratis") || course.price.toLowerCase().includes("gratuito") || course.price === "$0";
    if (!isFree) {
      if (!user) {
        setAuthRedirectAction({ type: "lms", course });
        setAuthMode("login");
        setAuthError("Para acceder a este curso de pago, debes iniciar sesión o registrarte primero.");
        setAuthModalOpen(true);
        return;
      }
      if (user.role !== "admin" && !hasAccessToLevel(course.level)) {
        setAccessDeniedCourse(course);
        return;
      }
    }

    setSelectedCourse(course);
    if (course.lessons && course.lessons.length > 0) {
      setActiveLesson(course.lessons[0]);
    } else {
      setActiveLesson(null);
    }
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const calculateProgress = (course: Course) => {
    if (!course.lessons || course.lessons.length === 0) return 0;
    const completedInCourse = course.lessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completedInCourse / course.lessons.length) * 100);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formVoucher) {
      alert("Por favor completa los campos requeridos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formName,
        email: formEmail,
        phone: formPhone || "No especificado",
        service: `Membresía ${checkoutMembership?.name}`,
        message: `[SOLICITUD DE MEMBRESÍA ACADÉMICA - AUTOADMINISTRABLE]
Nivel Solicitado: ${checkoutMembership?.level}
Precio: ${checkoutMembership?.priceCop} (${checkoutMembership?.priceUsd})
Método de Pago: ${checkoutPaymentMethod}
Número de Comprobante / Voucher: ${formVoucher}
Notas Adicionales: ${formNotes || "Ninguna"}
Fecha de Solicitud: ${new Date().toLocaleString()}`,
        userId: user?.id || null,
        requestedLevel: checkoutMembership?.level || null,
        voucher: formVoucher || null,
        voucherImage: formImage || null,
        isPaymentRequest: true,
        status: "pending"
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitSuccess(true);
        // Reset fields
        setFormName("");
        setFormEmail("");
        setFormPhone("");
        setFormVoucher("");
        setFormNotes("");
        setFormImage("");
      } else {
        alert("Ocurrió un error al registrar la solicitud. Intenta nuevamente.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión al procesar el pago.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGatewaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      alert("Por favor ingresa tu Nombre y Correo para iniciar el proceso de pago.");
      return;
    }

    setIsSubmitting(true);
    setGatewayError(null);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId: checkoutMembership?.id,
          level: checkoutMembership?.level,
          priceCop: checkoutMembership?.priceCop,
          priceUsd: checkoutMembership?.priceUsd,
          name: formName,
          email: formEmail,
          phone: formPhone || "No especificado",
          userId: user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error("No se pudo iniciar la sesión de pago. Intenta de nuevo.");
      }

      const data = await res.json();

      if (data.simulated) {
        // Run a gorgeous live interactive gate loader simulation!
        setIsProcessingSimulated(true);
        setSimulatedProgress(0);
        setSimulatedStep("Estableciendo conexión segura...");
        
        const steps = [
          { p: 15, msg: "Estableciendo conexión encriptada de 256-bits..." },
          { p: 40, msg: "Analizando canal de pago internacional..." },
          { p: 65, msg: "Verificando tokenización segura (Modo Sandbox)..." },
          { p: 85, msg: "Autorizando débitos y registrando matrícula..." },
          { p: 100, msg: "¡Transacción Aprobada con éxito!" }
        ];

        for (let i = 0; i < steps.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 850));
          setSimulatedProgress(steps[i].p);
          setSimulatedStep(steps[i].msg);
        }

        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsProcessingSimulated(false);
        setSubmitSuccess(true);
        
        // Update membership state locally for the logged in user
        if (checkoutMembership?.level) {
          updateUserMembership(checkoutMembership.level);
        }
      } else if (data.url) {
        // Redirect directly to secure Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error("Respuesta inválida del servidor.");
      }
    } catch (err: any) {
      console.error(err);
      setGatewayError(err.message || "Error al procesar la solicitud con la pasarela.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Membership Card Tiers config
  const memberships = [
    {
      id: "memb_beg",
      name: "Membresía Principiante",
      priceCop: "$49.000 COP",
      priceUsd: "$12 USD",
      period: "por mes",
      level: "Principiante" as const,
      description: "Perfecto para iniciar en el mundo digital y dominar conceptos clave de SEO y posicionamiento orgánico.",
      features: [
        "Acceso a cursos nivel Principiante",
        "Acceso ilimitado al Aula Virtual Básica",
        "Material de apoyo en PDF descargable",
        "Soporte comunitario por canal de Discord",
        "Cancela o cambia de plan en cualquier momento"
      ],
      popular: false,
      color: "border-gray-200 dark:border-white/10"
    },
    {
      id: "memb_int",
      name: "Membresía Intermedio",
      priceCop: "$99.000 COP",
      priceUsd: "$25 USD",
      period: "por mes",
      level: "Intermedio" as const,
      description: "El plan ideal para profesionales. Aprende a construir bots de WhatsApp reales con IA e integraciones CRM.",
      features: [
        "Acceso a cursos Principiante e Intermedio",
        "Acceso preferente al Aula Virtual",
        "Plantillas de código fuente listas para clonar",
        "Soporte directo por WhatsApp de soporte",
        "Certificados de finalización por curso",
        "Sincronización de Webhooks y APIs reales"
      ],
      popular: true,
      color: "border-[#0E5A5E] dark:border-[#F4B400] ring-1 ring-[#0E5A5E] dark:ring-[#F4B400] shadow-xl"
    },
    {
      id: "memb_adv",
      name: "Membresía Avanzada Elite",
      priceCop: "$199.000 COP",
      priceUsd: "$49 USD",
      period: "por mes",
      level: "Avanzado" as const,
      description: "Acceso absoluto e ilimitado para agencias y desarrolladores que buscan liderar con software de lujo.",
      features: [
        "Acceso ilimitado a TODOS los cursos",
        "Syllabus Avanzado de Desarrollo (Vite, React, SEO)",
        "Mentoría técnica 1-a-1 mensual con Jose Urdaneta",
        "Descarga libre de repositorios Git comerciales",
        "Soporte de desarrollo prioritario 24/7",
        "Certificación Elite avalada digitalmente"
      ],
      popular: false,
      color: "border-gray-200 dark:border-white/10"
    }
  ];

  return (
    <section id="academia" className="py-24 px-6 bg-white dark:bg-transparent transition-colors relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 dark:bg-secondary/15 border border-primary/20 dark:border-secondary/20 rounded-full mb-4">
            <GraduationCap size={14} className="text-primary dark:text-secondary" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-primary dark:text-secondary">
              LMS - Academia Virtual Autoadministrable
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            Aprende de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sistemas de Elite</span>
          </h2>
          <p className="text-base text-gray-500 dark:text-white/60 leading-relaxed">
            Plataforma educativa auto-administrada de alto nivel. Publica tus entrenamientos de pago o gratuitos, programa tus lecciones y ofrece membresías automatizadas con recaudo local en Colombia vía Nequi y Bancolombia.
          </p>
        </div>

        {/* ALUMNO ACCOUNT BAR (MULTI-USER ENGINE) */}
        <div className="mb-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4 z-10">
            <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-secondary/15 text-primary dark:text-secondary flex items-center justify-center shrink-0 border border-primary/20 dark:border-secondary/20">
              {user ? <UserCheck size={22} /> : <User size={22} />}
            </div>
            <div>
              {user ? (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Hola de nuevo, <span className="text-primary dark:text-secondary font-bold">{user.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-2">
                    <span>Nivel de Suscripción:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                      user.activeMembership?.level === "Principiante"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : user.activeMembership?.level === "Intermedio"
                        ? "bg-[#0E5A5E]/20 text-primary dark:text-secondary"
                        : user.activeMembership?.level === "Avanzado"
                        ? "bg-[#F4B400]/20 text-[#F4B400]"
                        : "bg-gray-100 dark:bg-white/5 text-gray-500"
                    }`}>
                      {user.activeMembership?.level ? `Membresía ${user.activeMembership.level}` : "Sin suscripción activa (Gratuito)"}
                    </span>
                    <span className="text-gray-300 dark:text-white/10">•</span>
                    <span>{user.completedLessons?.length || 0} Clases completadas</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Aula Virtual Autoadministrada - Multi-Usuario
                  </p>
                  <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                    Inicia sesión con tu cuenta para acceder a tus cursos comprados, ver tus videos y marcar lecciones como completadas.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 z-10 w-full md:w-auto shrink-0 justify-end">
            {user ? (
              <>
                {user.role === "admin" && (
                  <span className="px-2.5 py-1 text-[9px] font-mono font-bold bg-[#F4B400]/20 text-[#F4B400] border border-[#F4B400]/30 rounded-lg">
                    Rol: Administrador
                  </span>
                )}
                <button
                  onClick={authLogout}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  Cerrar Sesión <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError(null);
                    setAuthSuccessMsg(null);
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setAuthError(null);
                    setAuthSuccessMsg(null);
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-primary dark:bg-secondary text-white dark:text-black hover:bg-opacity-95 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  Registrarme Gratis
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- SECTION 1: CATALOGO DE CURSOS --- */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
          <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="text-primary dark:text-secondary" size={20} />
            Catálogo de Cursos Interactivos
          </h3>
          <span className="text-xs font-mono text-gray-400 hidden sm:inline">
            Mostrando {filteredCourses.length} de {courses.length} cursos
          </span>
        </div>

        {/* Filter Bar & Search bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary dark:bg-[#F4B400] text-white dark:text-black shadow-md"
                      : "bg-white dark:bg-[#051a1b] text-gray-600 dark:text-white/70 border border-gray-100 dark:border-white/5 hover:border-primary/30"
                  }`}
                >
                  {cat === "Automatizacion" ? "Automatización" : cat}
                </button>
              ))}
            </div>

            {/* Separator */}
            <span className="hidden sm:inline w-[1px] h-6 bg-gray-200 dark:bg-white/10"></span>

            {/* Price Filter (Gratis vs Pago) */}
            <div className="flex bg-white dark:bg-[#051a1b] p-1 rounded-xl border border-gray-100 dark:border-white/5">
              {["Todos", "Gratis", "De Pago"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivePriceFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activePriceFilter === filter
                      ? "bg-primary/10 dark:bg-[#F4B400]/15 text-primary dark:text-[#F4B400]"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <input
              type="text"
              placeholder="Buscar curso o tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#051a1b] text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Grid of Courses */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            <BookOpenCheck size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 dark:text-white/50 text-sm">No se encontraron cursos con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => {
              const progress = calculateProgress(course);
              const isFree = course.price.toLowerCase().includes("gratis") || course.price.toLowerCase().includes("gratuito") || course.price === "$0";

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group flex flex-col justify-between bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-primary/40 dark:hover:border-[#F4B400]/40 transition-all shadow-sm hover:shadow-lg"
                >
                  <div>
                    {/* Cover image */}
                    <div className="aspect-video relative overflow-hidden bg-neutral-800">
                      <img
                        src={course.image}
                        alt={course.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                      
                      {/* Price Badge */}
                      <span className={`absolute top-4 right-4 px-3 py-1 text-black text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md ${
                        isFree ? "bg-emerald-400" : "bg-[#F4B400]"
                      }`}>
                        {course.price}
                      </span>

                      {/* Level Badge */}
                      <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-black/60 border border-white/10 text-white text-[9px] font-mono rounded-md">
                        {course.level}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono text-primary dark:text-[#F4B400] uppercase font-bold tracking-widest">
                          {course.category === "Automatizacion" ? "Automatización" : course.category}
                        </span>
                        {isFree && (
                          <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                            Acceso Libre
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-heading font-extrabold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary dark:group-hover:text-[#F4B400] transition-colors mb-3">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-white/60 line-clamp-3 leading-relaxed mb-6">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs font-mono text-gray-400 border-t border-gray-50 dark:border-white/5 pt-4">
                        <span className="flex items-center gap-1.5">
                          <BookOpen size={12} className="text-primary dark:text-secondary" />
                          {course.lessons?.length || 0} Lecciones
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/20"></span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="text-primary dark:text-secondary" />
                          {course.lessons?.reduce((acc, curr) => {
                            const [m] = curr.duration.split(":").map(Number);
                            return acc + (m || 10);
                          }, 0)} Minutos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    {/* Progress tracking if user started */}
                    {progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1.5">
                          <span>Tu Progreso</span>
                          <span>{progress}% Completado</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F4B400] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenLms(course)}
                      className="w-full py-3 bg-[#0E5A5E]/10 dark:bg-[#0E5A5E]/20 hover:bg-[#0E5A5E] dark:hover:bg-[#F4B400] text-primary dark:text-[#F4B400] hover:text-white dark:hover:text-black border border-[#0E5A5E]/20 hover:border-transparent rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play size={12} />
                      {isFree ? "Iniciar Aprendizaje Gratis" : "Acceder al Aula Virtual"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* --- SECTION 2: MEMBRESÍAS DE ACCESO (NEQUI / BANCOLOMBIA) --- */}
        <div className="mt-28 mb-8 border-t border-gray-100 dark:border-white/10 pt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4B400]/10 border border-[#F4B400]/20 rounded-full mb-4">
              <Sparkles size={14} className="text-[#F4B400]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#F4B400]">
                Membresías de la Academia
              </span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 dark:text-white leading-tight">
              Suscríbete con <span className="text-[#F4B400]">Nequi</span> o <span className="text-[#0E5A5E]">Bancolombia</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed mt-4 max-w-2xl mx-auto">
              Desbloquea cursos exclusivos de acuerdo a tu nivel de entrenamiento. Recibimos transferencias directas locales con activación manual inmediata y autoadministrada por nuestro panel.
            </p>
          </div>

          {/* Memberships grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {memberships.map((memb) => (
              <motion.div
                key={memb.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`bg-white dark:bg-[#051a1b]/40 rounded-2xl p-8 border flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${memb.color} ${
                  memb.popular ? "scale-105 z-10" : "scale-100"
                }`}
              >
                {memb.popular && (
                  <div className="absolute top-4 right-4 bg-primary dark:bg-[#F4B400] text-white dark:text-black px-3 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles size={10} /> El más elegido
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono text-primary dark:text-[#F4B400] uppercase font-bold tracking-widest block mb-1">
                    Nivel {memb.level}
                  </span>
                  <h4 className="text-xl font-heading font-extrabold text-gray-900 dark:text-white mb-2">
                    {memb.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-white/60 font-light leading-relaxed mb-6">
                    {memb.description}
                  </p>

                  {/* Pricing block */}
                  <div className="mb-6">
                    <span className="block text-3xl font-display font-black text-gray-900 dark:text-white leading-none">
                      {memb.priceCop}
                    </span>
                    <span className="text-xs font-mono text-gray-400 block mt-1">
                      ~ {memb.priceUsd} USD / {memb.period}
                    </span>
                  </div>

                  <div className="h-[1px] bg-gray-100 dark:bg-white/5 mb-6"></div>

                  {/* Features list */}
                  <ul className="space-y-3.5 mb-8">
                    {memb.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-white/70">
                        <CheckCircle size={14} className="text-primary dark:text-[#F4B400] mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      setAuthError("Por favor, inicia sesión o regístrate primero para asociar tu membresía a tu cuenta de alumno.");
                      setAuthMode("login");
                      setAuthModalOpen(true);
                      return;
                    }
                    setCheckoutMembership(memb);
                    setSubmitSuccess(false);
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    memb.popular
                      ? "bg-primary dark:bg-[#F4B400] hover:bg-opacity-90 text-white dark:text-black shadow-lg shadow-primary/10"
                      : "bg-[#0E5A5E]/10 dark:bg-white/5 hover:bg-[#0E5A5E] dark:hover:bg-[#F4B400] text-primary dark:text-[#F4B400] hover:text-white dark:hover:text-black border border-primary/20 dark:border-white/5"
                  }`}
                >
                  <Smartphone size={13} />
                  Pagar con Nequi / Bancolombia
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Guarantee local payments */}
        <div className="mt-16 p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <ShieldCheck size={40} className="text-[#F4B400] shrink-0" />
            <div>
              <h5 className="font-heading font-extrabold text-sm text-gray-900 dark:text-white">Pago Seguro Certificado en Colombia</h5>
              <p className="text-xs text-gray-500 dark:text-white/60 leading-relaxed max-w-xl">
                Al enviar tu comprobante, nuestro sistema registra tu matrícula de forma inmediata. El administrador validará el voucher en el panel de control y habilitará la lecciones correspondientes.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <span className="px-3 py-1.5 bg-[#5b2482]/10 border border-[#5b2482]/20 text-[#5b2482] dark:text-[#a074c4] rounded-lg text-[10px] font-mono font-bold uppercase flex items-center gap-1">
              Nequi
            </span>
            <span className="px-3 py-1.5 bg-[#f4b400]/10 border border-[#f4b400]/20 text-[#ca9300] dark:text-[#f4b400] rounded-lg text-[10px] font-mono font-bold uppercase flex items-center gap-1">
              Bancolombia
            </span>
          </div>
        </div>

      </div>

      {/* MODAL: INTERACTIVE COLOMBIAN CHECKOUT (NEQUI & BANCOLOMBIA) */}
      <AnimatePresence>
        {checkoutMembership && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutMembership(null)}
              className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#051a1b] w-full max-w-lg rounded-2xl overflow-hidden relative z-10 flex flex-col border border-gray-100 dark:border-white/10 shadow-2xl max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-black/30 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Smartphone className="text-[#F4B400]" size={18} />
                  <div>
                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">Matrícula de Membresía</h4>
                    <p className="text-[10px] font-mono text-[#F4B400] uppercase font-bold">Recaudo Directo COP</p>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutMembership(null)}
                  className="p-1.5 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors rounded-lg text-xs font-mono font-bold"
                >
                  X
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {isProcessingSimulated ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 space-y-6"
                  >
                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-[#F4B400]/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-[#F4B400] rounded-full animate-spin"></div>
                      <CreditCard className="text-[#F4B400] animate-pulse" size={32} />
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">Procesando Transacción Segura</h5>
                      <p className="text-[11px] font-mono text-[#F4B400] uppercase font-bold tracking-wider">{simulatedProgress}%</p>
                      <p className="text-[10px] text-gray-500 dark:text-white/60 font-sans">{simulatedStep}</p>
                    </div>

                    <div className="w-full max-w-xs mx-auto h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#0E5A5E] to-[#F4B400] transition-all duration-300"
                        style={{ width: `${simulatedProgress}%` }}
                      ></div>
                    </div>

                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Por favor, no cierres esta ventana. Tu pago se está encriptando y validando con el procesador bancario de forma segura.
                    </p>
                  </motion.div>
                ) : submitSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={36} className="animate-bounce" />
                    </div>
                    
                    {activeCheckoutTab === "gateway" ? (
                      <>
                        <h5 className="font-heading font-extrabold text-xl text-gray-900 dark:text-white">¡Membresía Activada Instantáneamente!</h5>
                        <p className="text-xs text-gray-500 dark:text-white/70 leading-relaxed max-w-md mx-auto">
                          Tu pago mediante tarjeta de crédito ha sido validado y aprobado de forma inmediata por el procesador integrado.
                        </p>
                        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono text-left space-y-1 max-w-sm mx-auto">
                          <span className="block font-bold">📌 Próximos pasos:</span>
                          <span>1. Tu nivel de acceso ya está asignado.</span>
                          <span>2. Revisa tu bandeja de correo para las credenciales.</span>
                          <span>3. Ya puedes acceder a todas las lecciones de tu nivel.</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="font-heading font-extrabold text-xl text-gray-900 dark:text-white">¡Comprobante Registrado con Éxito!</h5>
                        <p className="text-xs text-gray-500 dark:text-white/70 leading-relaxed max-w-md mx-auto">
                          Hemos recibido los datos de tu transferencia con el comprobante ingresado. El sistema ha registrado la matrícula en la cola autoadministrable de Jose Urdaneta.
                        </p>
                        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono text-left space-y-1 max-w-sm mx-auto">
                          <span className="block font-bold">📌 Próximos pasos:</span>
                          <span>1. El administrador validará el voucher en el panel.</span>
                          <span>2. Recibirás un correo con tus credenciales de acceso.</span>
                          <span>3. Soporte te contactará al celular ingresado.</span>
                        </div>
                      </>
                    )}

                    <button
                      onClick={() => setCheckoutMembership(null)}
                      className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Comenzar mi Entrenamiento
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Invoice block */}
                    <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Suscripción</span>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{checkoutMembership.name}</span>
                        <span className="block text-[10px] font-mono text-gray-400 mt-0.5">Nivel: {checkoutMembership.level}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-black text-primary dark:text-[#F4B400]">{checkoutMembership.priceCop}</span>
                        <span className="text-[10px] font-mono text-gray-400">~ {checkoutMembership.priceUsd} USD</span>
                      </div>
                    </div>

                    {/* Tabs Selector: Gateway vs Manual Transfer */}
                    <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-black/30 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCheckoutTab("gateway");
                          setGatewayError(null);
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeCheckoutTab === "gateway"
                            ? "bg-primary dark:bg-[#F4B400] text-white dark:text-black shadow"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <CreditCard size={13} />
                        Pasarela Online (Tarjetas)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCheckoutTab("manual");
                          setGatewayError(null);
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeCheckoutTab === "manual"
                            ? "bg-primary dark:bg-[#F4B400] text-white dark:text-black shadow"
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        <Smartphone size={13} />
                        Transferencia COP (Nequi)
                      </button>
                    </div>

                    {activeCheckoutTab === "gateway" ? (
                      /* GATEWAY TAB: ONLINE SECURE PAYMENT */
                      <form onSubmit={handleGatewaySubmit} className="space-y-4">
                        <div className="p-4 bg-[#0E5A5E]/10 dark:bg-[#0E5A5E]/20 border border-[#0E5A5E]/20 dark:border-white/10 rounded-xl space-y-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="text-emerald-500 shrink-0" size={16} />
                            <span className="text-xs font-bold text-gray-900 dark:text-white">Pasarela Segura Integrada con Stripe</span>
                          </div>
                          <p className="text-[10px] text-gray-500 dark:text-white/60 leading-relaxed">
                            Procesa de forma instantánea con tarjeta de crédito de cualquier franquicia (Visa, MasterCard, Amex) o métodos digitales internacionales. Activación inmediata 24/7.
                          </p>
                        </div>

                        {gatewayError && (
                          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-[11px] text-red-600 dark:text-red-400">
                            {gatewayError}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex flex-col">
                            <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Nombre Completo *</label>
                            <input
                              type="text"
                              required
                              placeholder="Tu nombre..."
                              value={formName}
                              onChange={e => setFormName(e.target.value)}
                              className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Correo Electrónico *</label>
                            <input
                              type="email"
                              required
                              placeholder="ejemplo@correo.com"
                              value={formEmail}
                              onChange={e => setFormEmail(e.target.value)}
                              className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Teléfono Móvil (Opcional)</label>
                          <input
                            type="tel"
                            placeholder="ej. +57 300 000 0000"
                            value={formPhone}
                            onChange={e => setFormPhone(e.target.value)}
                            className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 bg-primary dark:bg-[#F4B400] text-white dark:text-black hover:opacity-95 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                        >
                          {isSubmitting ? (
                            <>Procesando...</>
                          ) : (
                            <>
                              <CreditCard size={14} />
                              Proceder al Pago Seguro ({checkoutMembership.priceUsd})
                            </>
                          )}
                        </button>
                      </form>
                    ) : (
                      /* MANUAL TAB: NEQUI / BANCOLOMBIA DIRECT TRANSFER */
                      <>
                        <div className="space-y-3">
                          <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Paso 1: Selecciona tu medio de transferencia</span>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setCheckoutPaymentMethod("Nequi")}
                              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                                checkoutPaymentMethod === "Nequi"
                                  ? "border-[#5b2482] bg-[#5b2482]/5 dark:bg-[#5b2482]/10"
                                  : "border-gray-200 dark:border-white/5 bg-white dark:bg-white/5"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                checkoutPaymentMethod === "Nequi" ? "border-[#5b2482]" : "border-gray-300"
                              }`}>
                                {checkoutPaymentMethod === "Nequi" && <div className="w-2.5 h-2.5 bg-[#5b2482] rounded-full"></div>}
                              </div>
                              <div>
                                <span className="text-xs font-bold block text-[#5b2482] dark:text-[#a074c4]">Nequi</span>
                                <span className="text-[9px] font-mono text-gray-400">Móvil en Colombia</span>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setCheckoutPaymentMethod("Bancolombia")}
                              className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                                checkoutPaymentMethod === "Bancolombia"
                                  ? "border-[#F4B400] bg-[#F4B400]/5 dark:bg-[#F4B400]/10"
                                  : "border-gray-200 dark:border-white/5 bg-white dark:bg-white/5"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                checkoutPaymentMethod === "Bancolombia" ? "border-[#F4B400]" : "border-gray-300"
                              }`}>
                                {checkoutPaymentMethod === "Bancolombia" && <div className="w-2.5 h-2.5 bg-[#F4B400] rounded-full"></div>}
                              </div>
                              <div>
                                <span className="text-xs font-bold block text-gray-900 dark:text-white">Bancolombia</span>
                                <span className="text-[9px] font-mono text-gray-400">Ahorros Tradicional</span>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Selected Bank Details */}
                        <div className="p-5 rounded-2xl border bg-[#051a1b] border-white/10 relative overflow-hidden space-y-4">
                          {checkoutPaymentMethod === "Nequi" ? (
                            <>
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[9px] font-mono text-gray-400 uppercase block">Celular Nequi</span>
                                  <span className="text-xl font-mono font-black text-[#a074c4] block tracking-wider">300 123 4567</span>
                                  <span className="text-[10px] text-gray-400 font-sans block mt-1">Beneficiario: Jose Urdaneta</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy("3001234567", "nequi")}
                                  className="px-2.5 py-1.5 bg-[#5b2482] hover:opacity-90 text-white rounded-lg text-[9px] font-mono font-bold flex items-center gap-1"
                                >
                                  {copiedText === "nequi" ? <Check size={10} /> : <Copy size={10} />}
                                  {copiedText === "nequi" ? "Copiado" : "Copiar"}
                                </button>
                              </div>
                              <p className="text-[10px] text-gray-400 leading-relaxed">
                                💡 Entra a tu App de Nequi, selecciona "Enviar plata" y transfiere el monto exacto: <span className="text-white font-bold">{checkoutMembership.priceCop}</span>. Toma una captura de pantalla al comprobante exitoso.
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[9px] font-mono text-gray-400 uppercase block">Cuenta de Ahorros Bancolombia</span>
                                  <span className="text-lg font-mono font-black text-white block tracking-wider">031-789456-12</span>
                                  <span className="text-[10px] text-gray-400 font-sans block mt-1">Beneficiario: Jose Urdaneta</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopy("031-789456-12", "bancolombia")}
                                  className="px-2.5 py-1.5 bg-[#F4B400] text-black hover:opacity-90 rounded-lg text-[9px] font-mono font-bold flex items-center gap-1"
                                >
                                  {copiedText === "bancolombia" ? <Check size={10} /> : <Copy size={10} />}
                                  {copiedText === "bancolombia" ? "Copiado" : "Copiar"}
                                </button>
                              </div>
                              <p className="text-[10px] text-gray-400 leading-relaxed">
                                💡 Transfiere por la App Bancolombia o corresponsal bancario. El monto exacto es <span className="text-white font-bold">{checkoutMembership.priceCop}</span>. Recuerda guardar el número de transacción.
                              </p>
                            </>
                          )}
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                          <span className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-wider block border-t border-gray-100 dark:border-white/5 pt-4">Paso 2: Registra tu Pago para Activación</span>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                              <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Nombre Completo *</label>
                              <input
                                type="text"
                                required
                                placeholder="Tu nombre..."
                                value={formName}
                                onChange={e => setFormName(e.target.value)}
                                className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Correo Electrónico *</label>
                              <input
                                type="email"
                                required
                                placeholder="ejemplo@correo.com"
                                value={formEmail}
                                onChange={e => setFormEmail(e.target.value)}
                                className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col">
                              <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Celular / WhatsApp *</label>
                              <input
                                type="tel"
                                required
                                placeholder="ej. +57 300 000 0000"
                                value={formPhone}
                                onChange={e => setFormPhone(e.target.value)}
                                className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                              />
                            </div>
                            <div className="flex flex-col">
                              <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Nro de Comprobante / Transacción *</label>
                              <input
                                type="text"
                                required
                                placeholder="ej. Nro 98765432"
                                value={formVoucher}
                                onChange={e => setFormVoucher(e.target.value)}
                                className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Mensaje / Notas para el Administrador (Opcional)</label>
                            <textarea
                              rows={2}
                              placeholder="Información adicional sobre tu transferencia..."
                              value={formNotes}
                              onChange={e => setFormNotes(e.target.value)}
                              className="px-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-lg bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label className="text-[10px] font-mono font-bold text-gray-400 mb-1">Cargar Comprobante desde PC (Captura de pantalla / Foto) *</label>
                            <div className="border border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 bg-gray-50/50 dark:bg-white/2 flex flex-col items-center justify-center gap-2 relative transition-all hover:border-primary/50 group">
                              {formImage ? (
                                <div className="w-full flex flex-col items-center gap-2">
                                  <div className="relative w-full max-h-40 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 bg-black/40 flex items-center justify-center">
                                    <img
                                      src={formImage}
                                      alt="Vista previa del comprobante"
                                      className="max-h-40 object-contain p-1"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setFormImage("")}
                                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer z-10"
                                      title="Quitar imagen"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                  <span className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1">✓ Comprobante cargado exitosamente</span>
                                </div>
                              ) : (
                                <>
                                  <Smartphone size={20} className="text-gray-400 group-hover:text-primary dark:group-hover:text-[#F4B400] transition-colors" />
                                  <div className="text-center pointer-events-none">
                                    <span className="text-[11px] text-gray-500 dark:text-white/70 block font-bold">Haz clic o arrastra tu imagen aquí</span>
                                    <span className="text-[9px] text-gray-400 block font-mono mt-0.5">Formatos soportados: JPG, PNG, WEBP</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          setFormImage(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-primary dark:bg-[#F4B400] text-white dark:text-black hover:opacity-95 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                          >
                            {isSubmitting ? (
                              <>Procesando Registro...</>
                            ) : (
                              <>
                                <CheckCircle size={14} />
                                Registrar Comprobante y Activar
                              </>
                            )}
                          </button>
                        </form>
                      </>
                    )}
                  </>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL - LMS CLASSROOM AULA VIRTUAL */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm"
            ></motion.div>

            {/* Main Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#051a1b] w-full h-full sm:max-w-6xl sm:h-[85vh] sm:rounded-2xl overflow-hidden relative z-10 flex flex-col border border-gray-100 dark:border-white/10 shadow-2xl"
            >
              {/* Top Bar header */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-black/30 border-b border-gray-100 dark:border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-secondary/15 flex items-center justify-center text-primary dark:text-secondary">
                    <GraduationCap size={16} />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                      Aula Virtual de Jose Urdaneta
                    </h4>
                    <p className="text-[10px] font-mono text-gray-400">
                      Curso: {selectedCourse.title}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-white/10 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors rounded-xl text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Cerrar Aula
                </button>
              </div>

              {/* Grid content split: 7 cols Video, 5 cols Syllabus */}
              {(() => {
                const activeCompleted = user ? (user.completedLessons || []) : completedLessons;
                return (
                  <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    
                    {/* Left section: Video view and lesson details */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col justify-between">
                      {activeLesson ? (
                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          {/* Interactive responsive player wrapper */}
                          <div>
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-gray-100 dark:border-white/10 relative group shadow-inner">
                              <video
                                key={activeLesson.id}
                                controls
                                src={activeLesson.videoUrl}
                                className="w-full h-full object-cover"
                                poster={selectedCourse.image}
                              />
                              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded text-[10px] font-mono text-white pointer-events-none">
                                Reproduciendo: {activeLesson.title}
                              </div>
                            </div>

                            {/* Title and details */}
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/10 dark:bg-secondary/15 text-primary dark:text-secondary rounded">
                                  Capítulo {selectedCourse.lessons.indexOf(activeLesson) + 1} de {selectedCourse.lessons.length}
                                </span>
                                <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                                  <Clock size={12} />
                                  Duración: {activeLesson.duration}
                                </span>
                              </div>
                              <h3 className="text-xl font-heading font-extrabold text-gray-900 dark:text-white">
                                {activeLesson.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-white/70 leading-relaxed mt-2">
                                {activeLesson.description || "En esta lección cubriremos los detalles de implementación técnica paso a paso con código real y mejores prácticas de optimización digital."}
                              </p>
                            </div>
                          </div>

                          {/* Lesson actions bottom box */}
                          <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleLessonComplete(activeLesson.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                                  activeCompleted.includes(activeLesson.id)
                                    ? "bg-emerald-500 text-white"
                                    : "bg-primary dark:bg-[#F4B400] text-white dark:text-black hover:opacity-90"
                                }`}
                              >
                                <CheckCircle size={14} />
                                {activeCompleted.includes(activeLesson.id) ? "Lección Completada" : "Marcar como Completada"}
                              </button>
                            </div>

                            <div className="text-[10px] font-mono text-gray-400 text-center sm:text-right">
                              Instructor: <span className="text-gray-900 dark:text-white font-bold">{selectedCourse.instructor || "Jose Urdaneta"}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                          <PlayCircle size={48} className="text-primary dark:text-secondary animate-pulse mb-3" />
                          <p className="text-gray-500 dark:text-white/60 text-sm">Selecciona una lección del programa de la derecha para iniciar la reproducción.</p>
                        </div>
                      )}
                    </div>

                {/* Right section: Syllabus / Lessons list */}
                <div className="w-full lg:w-[380px] bg-gray-50 dark:bg-black/20 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/10 flex flex-col">
                  
                  {/* Progress panel */}
                  <div className="p-4 bg-white dark:bg-black/30 border-b border-gray-100 dark:border-white/10 shrink-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-white/80 flex items-center gap-1">
                        <Award size={14} className="text-yellow-500" />
                        Tu Avance
                      </span>
                      <span className="text-xs font-mono font-bold text-[#F4B400]">
                        {calculateProgress(selectedCourse)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-[#F4B400] transition-all duration-300"
                        style={{ width: `${calculateProgress(selectedCourse)}%` }}
                      ></div>
                    </div>
                    <p className="text-[9px] font-mono text-gray-400 mt-1.5">
                      {selectedCourse.lessons.filter(l => completedLessons.includes(l.id)).length} de {selectedCourse.lessons.length} capítulos terminados.
                    </p>
                  </div>

                  {/* Lessons list viewport */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <h5 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold mb-3">
                      Contenido del Curso ({selectedCourse.lessons.length} Temas)
                    </h5>

                    {selectedCourse.lessons.map((lesson, idx) => {
                      const isCurrent = activeLesson?.id === lesson.id;
                      const isCompleted = completedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                            isCurrent
                              ? "bg-primary/10 dark:bg-[#F4B400]/10 border-primary/40 dark:border-[#F4B400]/40"
                              : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isCompleted ? (
                              <CheckCircle size={15} className="text-emerald-500" />
                            ) : isCurrent ? (
                              <Play size={15} className="text-primary dark:text-[#F4B400] animate-pulse" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-white/20 text-[9px] font-mono flex items-center justify-center text-gray-400">
                                {idx + 1}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className={`text-xs font-bold block truncate ${
                              isCurrent ? "text-primary dark:text-[#F4B400]" : "text-gray-900 dark:text-gray-200"
                            }`}>
                              {lesson.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                                <Clock size={10} />
                                {lesson.duration}
                              </span>
                              {lesson.description && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20"></span>
                                  <span className="text-[9px] font-mono text-gray-400 truncate">
                                    {lesson.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Call to action bottom */}
                  <div className="p-4 bg-white dark:bg-black/30 border-t border-gray-100 dark:border-white/10 shrink-0">
                    <a
                      href="#contacto"
                      onClick={() => setSelectedCourse(null)}
                      className="w-full py-2.5 bg-primary dark:bg-[#F4B400] hover:opacity-95 text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 text-center"
                    >
                      Consultar por Certificación
                      <ArrowRight size={12} />
                    </a>
                  </div>

                </div>

              </div>
            );
          })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL - MULTI-USER LOGIN & REGISTRATION */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#051a1b] w-full max-w-md rounded-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10 shadow-2xl p-6 sm:p-8"
            >
              <button
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-secondary/15 text-primary dark:text-secondary flex items-center justify-center mx-auto mb-3">
                  <Key size={22} />
                </div>
                <h4 className="font-heading font-extrabold text-xl text-gray-900 dark:text-white">
                  {authMode === "login" ? "Ingresa a tu Aula Virtual" : "Regístrate como Alumno"}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {authMode === "login"
                    ? "Inicia sesión con tus credenciales seguras"
                    : "Crea tu cuenta gratis en segundos para iniciar tus cursos"}
                </p>
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-start gap-2">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccessMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setAuthError(null);
                  setAuthSuccessMsg(null);
                  setAuthLoading(true);

                  try {
                    if (authMode === "login") {
                      const res = await authLogin(authEmail, authPassword);
                      if (res.success) {
                        setAuthSuccessMsg("¡Sesión iniciada con éxito!");
                        setTimeout(() => {
                          setAuthModalOpen(false);
                          // Handle redirect
                          if (authRedirectAction && authRedirectAction.type === "lms") {
                            handleOpenLms(authRedirectAction.course);
                          }
                          setAuthRedirectAction(null);
                        }, 800);
                      } else {
                        setAuthError(res.error || "Credenciales incorrectas.");
                      }
                    } else {
                      if (!authName) {
                        setAuthError("Por favor escribe tu nombre.");
                        setAuthLoading(false);
                        return;
                      }
                      const res = await authRegister(authName, authEmail, authPassword);
                      if (res.success) {
                        setAuthSuccessMsg("¡Cuenta creada e inicio de sesión completado!");
                        setTimeout(() => {
                          setAuthModalOpen(false);
                          if (authRedirectAction && authRedirectAction.type === "lms") {
                            handleOpenLms(authRedirectAction.course);
                          }
                          setAuthRedirectAction(null);
                        }, 800);
                      } else {
                        setAuthError(res.error || "Error al crear la cuenta.");
                      }
                    }
                  } catch (err: any) {
                    setAuthError(err.message || "Error en el servidor");
                  } finally {
                    setAuthLoading(false);
                  }
                }}
                className="space-y-4"
              >
                {authMode === "register" && (
                  <div className="flex flex-col">
                    <label className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Nombre Completo</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Escribe tu nombre..."
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                      />
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col">
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase mb-1">Contraseña</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres..."
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 dark:border-white/10 rounded-xl bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                    />
                    <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-primary dark:bg-secondary text-white dark:text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {authLoading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  ) : authMode === "login" ? (
                    "Ingresar"
                  ) : (
                    "Registrarse Gratis"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 text-center">
                <p className="text-[11px] text-gray-400">
                  {authMode === "login" ? "¿Aún no tienes cuenta?" : "¿Ya tienes una cuenta registrada?"}{" "}
                  <button
                    onClick={() => {
                      setAuthMode(authMode === "login" ? "register" : "login");
                      setAuthError(null);
                      setAuthSuccessMsg(null);
                    }}
                    className="text-primary dark:text-secondary font-bold hover:underline font-sans cursor-pointer bg-transparent border-0 p-0"
                  >
                    {authMode === "login" ? "Regístrate aquí" : "Inicia sesión aquí"}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL - ACCESS DENIED (TIERED RESTRICTION) */}
      <AnimatePresence>
        {accessDeniedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAccessDeniedCourse(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#051a1b] w-full max-w-md rounded-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10 shadow-2xl p-6 sm:p-8 text-center"
            >
              <button
                onClick={() => setAccessDeniedCourse(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Lock size={26} />
              </div>

              <h4 className="font-heading font-extrabold text-xl text-gray-900 dark:text-white">
                Membresía Requerida
              </h4>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-mono">
                Curso: {accessDeniedCourse.title}
              </p>

              <div className="my-6 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed text-left space-y-2">
                <p>
                  Este curso interactivo tiene contenido de nivel <span className="font-bold text-[#F4B400] font-mono">{accessDeniedCourse.level}</span>.
                </p>
                <p>
                  Para acceder, necesitas tener activa la <span className="font-bold text-primary dark:text-secondary font-sans">Membresía {accessDeniedCourse.level}</span> o superior.
                </p>
                <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-200 dark:border-white/5">
                  Tu nivel actual: <span className="font-bold">{user?.activeMembership?.level ? `Membresía ${user.activeMembership.level}` : "Ninguno / Gratuito"}</span>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAccessDeniedCourse(null)}
                  className="py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Regresar
                </button>
                <button
                  onClick={() => {
                    setAccessDeniedCourse(null);
                    // Smooth scroll down to plans/pricing section
                    const element = document.getElementById("academia");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="py-2.5 rounded-xl bg-[#F4B400] hover:bg-opacity-95 text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Ver Planes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
