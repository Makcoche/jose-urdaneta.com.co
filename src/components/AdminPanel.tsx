import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Lock, ShieldCheck, LayoutDashboard, Briefcase, Wrench, MessageSquare,
  BookOpen, Settings, Plus, Trash2, Edit, Save, Trash, AlertCircle, Copy, CheckCircle2, FileText, Users, Eye
} from "lucide-react";
import { Service, Project, Testimonial, BlogPost, SocialPost, SEOSettings, Course, Lesson } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  initialData: {
    services: Service[];
    portfolio: Project[];
    testimonials: Testimonial[];
    blog: BlogPost[];
    socialPosts: SocialPost[];
    seoSettings: SEOSettings;
    courses?: Course[];
  };
  onDataUpdate: () => void; // Trigger page re-fetch
}

export default function AdminPanel({ onClose, initialData, onDataUpdate }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "services" | "portfolio" | "contact" | "testimonials" | "blog" | "courses" | "seo" | "users">("dashboard");

  // Local CRUD states synced from initialData
  const [services, setServices] = useState<Service[]>(initialData.services);
  const [portfolio, setPortfolio] = useState<Project[]>(initialData.portfolio);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData.testimonials);
  const [blog, setBlog] = useState<BlogPost[]>(initialData.blog);
  const [seo, setSeo] = useState<SEOSettings>(initialData.seoSettings);
  const [courses, setCourses] = useState<Course[]>(initialData.courses || []);

  // Form submissions from server
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [selectedVoucherImg, setSelectedVoucherImg] = useState<string | null>(null);

  // Editing items states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Saving state indicator
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchRegisteredUsers();
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        throw new Error("Server response was not OK");
      }
    } catch (err) {
      console.warn("Falling back to local submissions data:", err);
      const cached = localStorage.getItem("app_db_data");
      const db = cached ? JSON.parse(cached) : initialData;
      setSubmissions(db.formSubmissions || []);
    }
  };

  const fetchRegisteredUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setRegisteredUsers(data);
      } else {
        throw new Error("Server response was not OK");
      }
    } catch (err) {
      console.warn("Falling back to local registered users:", err);
      const cached = localStorage.getItem("app_db_data");
      const db = cached ? JSON.parse(cached) : initialData;
      setRegisteredUsers(db.users || []);
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcode === "1234") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Passcode incorrecto. Intenta con '1234'.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSaveData = async (key: string, updatedData: any) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, data: updatedData })
      });

      if (response.ok) {
        showToast(`Datos de ${key} guardados con éxito`);
        onDataUpdate(); // Reload main app state
      } else {
        throw new Error("Server response was not OK");
      }
    } catch (err) {
      console.warn("Fallback to local storage saving:", err);
      try {
        const cached = localStorage.getItem("app_db_data");
        const currentDb = cached ? JSON.parse(cached) : initialData;
        const newDb = {
          ...currentDb,
          [key]: updatedData
        };
        localStorage.setItem("app_db_data", JSON.stringify(newDb));
        showToast(`Guardado en LocalStorage (Modo Demo)`);
        onDataUpdate(); // Trigger App's fetchData to reload from localStorage
      } catch (e) {
        showToast("Error de conexión al guardar cambios");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // 1. SERVICES CRUD
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    let updatedList;
    if (services.some(s => s.id === editingService.id)) {
      updatedList = services.map(s => s.id === editingService.id ? editingService : s);
    } else {
      updatedList = [...services, editingService];
    }

    setServices(updatedList);
    handleSaveData("services", updatedList);
    setEditingService(null);
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este servicio?")) return;
    const updatedList = services.filter(s => s.id !== id);
    setServices(updatedList);
    handleSaveData("services", updatedList);
  };

  // 2. PORTFOLIO CRUD
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    let updatedList;
    if (portfolio.some(p => p.id === editingProject.id)) {
      updatedList = portfolio.map(p => p.id === editingProject.id ? editingProject : p);
    } else {
      updatedList = [...portfolio, editingProject];
    }

    setPortfolio(updatedList);
    handleSaveData("portfolio", updatedList);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este caso del portafolio?")) return;
    const updatedList = portfolio.filter(p => p.id !== id);
    setPortfolio(updatedList);
    handleSaveData("portfolio", updatedList);
  };

  // 3. TESTIMONIALS CRUD
  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    let updatedList;
    if (testimonials.some(t => t.id === editingTestimonial.id)) {
      updatedList = testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t);
    } else {
      updatedList = [...testimonials, editingTestimonial];
    }

    setTestimonials(updatedList);
    handleSaveData("testimonials", updatedList);
    setEditingTestimonial(null);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este testimonio?")) return;
    const updatedList = testimonials.filter(t => t.id !== id);
    setTestimonials(updatedList);
    handleSaveData("testimonials", updatedList);
  };

  // 4. BLOG CRUD
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    let updatedList;
    if (blog.some(b => b.id === editingBlog.id)) {
      updatedList = blog.map(b => b.id === editingBlog.id ? editingBlog : b);
    } else {
      updatedList = [...blog, editingBlog];
    }

    setBlog(updatedList);
    handleSaveData("blog", updatedList);
    setEditingBlog(null);
  };

  const handleDeleteBlog = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este artículo de blog?")) return;
    const updatedList = blog.filter(b => b.id !== id);
    setBlog(updatedList);
    handleSaveData("blog", updatedList);
  };

  // 4b. COURSES CRUD
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    let updatedList;
    const preparedCourse = {
      ...editingCourse,
      lessonsCount: editingCourse.lessons?.length || 0
    };

    if (courses.some(c => c.id === preparedCourse.id)) {
      updatedList = courses.map(c => c.id === preparedCourse.id ? preparedCourse : c);
    } else {
      updatedList = [...courses, preparedCourse];
    }

    setCourses(updatedList);
    handleSaveData("courses", updatedList);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este curso de la academia?")) return;
    const updatedList = courses.filter(c => c.id !== id);
    setCourses(updatedList);
    handleSaveData("courses", updatedList);
  };

  // 5. SUBMISSIONS DELETION & PAYMENT APPROVAL
  const handleDeleteSubmission = async (id: string) => {
    if (!confirm("¿Seguro que deseas borrar este lead del historial?")) return;
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (response.ok) {
        setSubmissions(submissions.filter(s => s.id !== id));
        showToast("Lead comercial eliminado correctamente");
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Falling back to local deletion of submission:", err);
      try {
        const cached = localStorage.getItem("app_db_data");
        const db = cached ? JSON.parse(cached) : initialData;
        const updatedSubmissions = (db.formSubmissions || []).filter((s: any) => s.id !== id);
        const newDb = { ...db, formSubmissions: updatedSubmissions };
        localStorage.setItem("app_db_data", JSON.stringify(newDb));
        setSubmissions(updatedSubmissions);
        showToast("Lead eliminado localmente (Modo Demo)");
        onDataUpdate();
      } catch (e) {
        showToast("Error de comunicación");
      }
    }
  };

  const handleApproveSubmission = async (id: string) => {
    if (!confirm("¿Seguro que deseas APROBAR este pago? Se activará la membresía del alumno de manera inmediata.")) return;
    try {
      const response = await fetch(`/api/admin/submissions/${id}/approve`, { method: "POST" });
      if (response.ok) {
        const data = await response.json(); // Wait, in the target code it said "const data = await response.json();" (response was response, not res).
        if (data.success) {
          setSubmissions(submissions.map(s => s.id === id ? data.submission : s));
          showToast("Pago aprobado con éxito y membresía activada");
          fetchRegisteredUsers();
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Falling back to local approval of submission:", err);
      try {
        const cached = localStorage.getItem("app_db_data");
        const db = cached ? JSON.parse(cached) : initialData;
        
        let approvedSub: any = null;
        const updatedSubmissions = (db.formSubmissions || []).map((s: any) => {
          if (s.id === id) {
            approvedSub = { ...s, status: "approved" };
            return approvedSub;
          }
          return s;
        });

        if (!approvedSub) {
          showToast("No se encontró la solicitud");
          return;
        }

        // Activate membership for user
        const updatedUsers = (db.users || []).map((u: any) => {
          if (u.id === approvedSub.userId) {
            return {
              ...u,
              activeMembership: {
                level: approvedSub.requestedLevel,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
              }
            };
          }
          return u;
        });

        const newDb = { ...db, formSubmissions: updatedSubmissions, users: updatedUsers };
        localStorage.setItem("app_db_data", JSON.stringify(newDb));
        
        setSubmissions(updatedSubmissions);
        setRegisteredUsers(updatedUsers);
        showToast("Pago aprobado y membresía activada localmente");
        onDataUpdate();
      } catch (e) {
        showToast("Error de conexión");
      }
    }
  };

  const handleRejectSubmission = async (id: string) => {
    if (!confirm("¿Seguro que deseas RECHAZAR este pago?")) return;
    try {
      const response = await fetch(`/api/admin/submissions/${id}/reject`, { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubmissions(submissions.map(s => s.id === id ? data.submission : s));
          showToast("Solicitud rechazada con éxito");
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      console.warn("Falling back to local rejection of submission:", err);
      try {
        const cached = localStorage.getItem("app_db_data");
        const db = cached ? JSON.parse(cached) : initialData;
        
        const updatedSubmissions = (db.formSubmissions || []).map((s: any) => {
          if (s.id === id) {
            return { ...s, status: "rejected" };
          }
          return s;
        });

        const newDb = { ...db, formSubmissions: updatedSubmissions };
        localStorage.setItem("app_db_data", JSON.stringify(newDb));
        
        setSubmissions(updatedSubmissions);
        showToast("Solicitud rechazada localmente");
        onDataUpdate();
      } catch (e) {
        showToast("Error de conexión");
      }
    }
  };

  // 6. SEO SAVE
  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveData("seoSettings", seo);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-0 md:p-6">
      
      {/* Background dark glass blur */}
      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" onClick={onClose}></div>

      {/* Main Admin Workstation Container */}
      <div className="bg-white dark:bg-[#051a1b] w-full h-full md:max-w-7xl md:h-[90vh] md:rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden border border-gray-100 dark:border-white/10">
        
        {/* TOP STATUS BAR */}
        <header className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-black/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary dark:bg-secondary animate-pulse"></span>
            <span className="font-display font-bold text-base text-black dark:text-white">
              JOSE URDANETA <span className="font-mono text-xs text-primary dark:text-secondary font-bold uppercase ml-2">Panel de Administración</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isSaving && (
              <span className="text-xs font-mono text-gray-400 animate-pulse">Guardando cambios...</span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* AUTHENTICATION ROUTE */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-transparent">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-100 dark:border-white/10 shadow-xl space-y-6"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center mb-4">
                  <Lock size={22} />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-black dark:text-white">
                  Ingreso Seguro de Ingeniería
                </h3>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">
                  Acceso restringido a Jose Urdaneta
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Código de Acceso (Passcode)
                  </label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Escribe el código..."
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>

                {loginError && (
                  <p className="text-xs text-red-500 font-mono">{loginError}</p>
                )}

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-95"
                  >
                    Ingresar <ShieldCheck size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPasscode("1234");
                      setIsAuthenticated(true);
                    }}
                    className="w-full py-3 rounded-xl bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-black dark:text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                  >
                    Autocompletar Prueba (1234)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : (
          /* MAIN WORKSPACE WRAPPER */
          <div className="flex-1 flex overflow-hidden">
            
            {/* SIDEBAR TABS SELECTION */}
            <aside className="w-64 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between shrink-0 bg-gray-50 dark:bg-neutral-950 p-4 overflow-y-auto">
              <nav className="space-y-1.5">
                {[
                  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { id: "users", label: "Alumnos y Membresías", icon: Users, count: registeredUsers.length },
                  { id: "services", label: "Servicios (CRUD)", icon: Wrench },
                  { id: "portfolio", label: "Portafolio (CRUD)", icon: Briefcase },
                  { id: "courses", label: "Cursos (LMS)", icon: BookOpen },
                  { id: "contact", label: "Leads de Contacto", icon: FileText, count: submissions.length },
                  { id: "testimonials", label: "Testimonios (CRUD)", icon: MessageSquare },
                  { id: "blog", label: "Blog de Contenidos", icon: BookOpen },
                  { id: "seo", label: "SEO & Config", icon: Settings }
                ].map((tab) => {
                  const IconComp = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        // reset editing views on change
                        setEditingService(null);
                        setEditingProject(null);
                        setEditingTestimonial(null);
                        setEditingBlog(null);
                        setEditingCourse(null);
                      }}
                      className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp size={16} />
                        <span>{tab.label}</span>
                      </div>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${isActive ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 text-[10px] font-mono text-gray-400">
                <p>AUTENTICACIÓN MÁXIMA ACTIVE</p>
                <p className="text-primary dark:text-secondary mt-1">Host ID: {window.location.host}</p>
              </div>
            </aside>

            {/* TAB WORKSPACE CONTENT BODY */}
            <main className="flex-1 p-8 overflow-y-auto bg-white dark:bg-neutral-900">
              
              {/* Dashboard Tab */}
              {activeTab === "dashboard" && (
                <div className="space-y-8">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Panel de Resumen Comercial</h2>
                    <p className="text-gray-500 font-light text-sm mt-1">Resumen general de las métricas comerciales y conversiones.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-[#051a1b]/40 border border-gray-100 dark:border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide">Servicios</span>
                      <span className="block font-display font-bold text-2xl mt-1 text-black dark:text-white">{services.length}</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#051a1b]/40 border border-gray-100 dark:border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide">Casos de Éxito</span>
                      <span className="block font-display font-bold text-2xl mt-1 text-black dark:text-white">{portfolio.length}</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#051a1b]/40 border border-gray-100 dark:border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide font-bold text-primary dark:text-secondary">Leads (Consultas)</span>
                      <span className="block font-display font-bold text-2xl mt-1 text-primary dark:text-secondary">{submissions.length}</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#051a1b]/40 border border-gray-100 dark:border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide">Artículos Blog</span>
                      <span className="block font-display font-bold text-2xl mt-1 text-black dark:text-white">{blog.length}</span>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-[#051a1b]/40 border border-gray-100 dark:border-white/5 rounded-2xl">
                      <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wide font-bold text-secondary">Cursos LMS</span>
                      <span className="block font-display font-bold text-2xl mt-1 text-[#F4B400]">{courses.length}</span>
                    </div>
                  </div>

                  <div className="p-6 border border-primary/20 dark:border-secondary/20 rounded-2xl bg-primary/5 dark:bg-primary/10">
                    <h4 className="font-heading font-extrabold text-black dark:text-white text-lg">Nota de Acceso Directo de Jose</h4>
                    <p className="text-gray-600 dark:text-gray-300 font-light text-sm mt-2 leading-relaxed">
                      Este panel sincroniza todos los cambios directamente al archivo local <span className="font-mono bg-white dark:bg-neutral-950 px-1.5 py-0.5 rounded border">src/db.json</span> de tu servidor. Cualquier modificación realizada aquí modificará los datos de la web en tiempo real sin requerir recompilación del backend.
                    </p>
                  </div>
                </div>
              )}

              {/* Users & Memberships Tab */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-gray-800 pb-4 gap-4">
                    <div>
                      <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Alumnos y Membresías</h2>
                      <p className="text-gray-500 font-light text-sm mt-1">
                        Controla las cuentas de alumnos, sus lecciones completadas y sus niveles de suscripción de pago (Nequi / Bancolombia / Stripe).
                      </p>
                    </div>
                    <button
                      onClick={fetchRegisteredUsers}
                      className="px-4 py-2 self-start rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-black dark:text-white font-mono text-xs font-bold uppercase transition-colors"
                    >
                      Actualizar Alumnos
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-sans text-emerald-800 dark:text-emerald-400">Asignación de Registros y Accesos Gratuitos</h4>
                      <p className="text-[11px] text-gray-500 dark:text-emerald-300/70 leading-relaxed">
                        Como administrador, tú decides quiénes tienen acceso gratis y quiénes deben pagar. Utiliza los botones de nivel de la tabla inferior para otorgar membresías de forma 100% gratuita a los alumnos que tú elijas. Esto activa su acceso al aula virtual de forma inmediata sin que tengan que realizar transferencias.
                      </p>
                    </div>
                  </div>

                  {/* Users Table */}
                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                      <Users size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 dark:text-white/50 text-sm">No hay alumnos registrados en la plataforma.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-black/10">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-black/30 border-b border-gray-100 dark:border-white/5 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                            <th className="p-4">Alumno</th>
                            <th className="p-4">Contacto</th>
                            <th className="p-4">Membresía Activa</th>
                            <th className="p-4 text-center">Progreso (Clases)</th>
                            <th className="p-4 text-right">Acciones de Suscripción (Nequi/Bancolombia)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs text-gray-700 dark:text-gray-300">
                          {registeredUsers.map((u: any) => {
                            const isUserAdmin = u.role === "admin";
                            const level = u.activeMembership?.level;
                            
                            // Color badge for memberships
                            let badgeColor = "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400";
                            if (level === "Principiante") badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
                            else if (level === "Intermedio") badgeColor = "bg-[#0E5A5E]/15 text-primary dark:text-secondary dark:bg-[#0E5A5E]/30";
                            else if (level === "Avanzado") badgeColor = "bg-[#F4B400]/15 text-amber-700 dark:text-[#F4B400] dark:bg-[#F4B400]/25";

                            const changeMembership = async (newLevel: string | null) => {
                              try {
                                const res = await fetch(`/api/admin/users/${u.id}/membership`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ level: newLevel })
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.success) {
                                    showToast(`Membresía de ${u.name} actualizada con éxito`);
                                    // Update locally
                                    setRegisteredUsers(prev => prev.map(item => item.id === u.id ? data.user : item));
                                  }
                                } else {
                                  throw new Error();
                                }
                              } catch (err) {
                                console.warn("Fallback to local membership change:", err);
                                try {
                                  const cached = localStorage.getItem("app_db_data");
                                  const db = cached ? JSON.parse(cached) : initialData;
                                  
                                  const updatedUser = {
                                    ...u,
                                    activeMembership: {
                                      level: newLevel,
                                      expiresAt: newLevel ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
                                    }
                                  };
                                  
                                  const updatedUsers = (db.users || []).map((item: any) => item.id === u.id ? updatedUser : item);
                                  const newDb = { ...db, users: updatedUsers };
                                  localStorage.setItem("app_db_data", JSON.stringify(newDb));
                                  
                                  setRegisteredUsers(updatedUsers);
                                  showToast(`Membresía de ${u.name} actualizada localmente`);
                                  onDataUpdate();
                                } catch (e) {
                                  showToast("Error de conexión");
                                }
                              }
                            };

                            const toggleRole = async () => {
                              const newRole = isUserAdmin ? "student" : "admin";
                              try {
                                const res = await fetch(`/api/admin/users/${u.id}/role`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ role: newRole })
                                });
                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.success) {
                                    showToast(`Rol de ${u.name} actualizado a ${newRole === "admin" ? "Administrador" : "Alumno"}`);
                                    setRegisteredUsers(prev => prev.map(item => item.id === u.id ? data.user : item));
                                  }
                                } else {
                                  throw new Error();
                                }
                              } catch (err) {
                                console.warn("Fallback to local role change:", err);
                                try {
                                  const cached = localStorage.getItem("app_db_data");
                                  const db = cached ? JSON.parse(cached) : initialData;
                                  
                                  const updatedUser = {
                                    ...u,
                                    role: newRole
                                  };
                                  
                                  const updatedUsers = (db.users || []).map((item: any) => item.id === u.id ? updatedUser : item);
                                  const newDb = { ...db, users: updatedUsers };
                                  localStorage.setItem("app_db_data", JSON.stringify(newDb));
                                  
                                  setRegisteredUsers(updatedUsers);
                                  showToast(`Rol de ${u.name} cambiado a ${newRole === "admin" ? "Administrador" : "Alumno"} localmente`);
                                  onDataUpdate();
                                } catch (e) {
                                  showToast("Error de conexión");
                                }
                              }
                            };

                            return (
                              <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                  <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                                    <span>{u.name}</span>
                                    <button
                                      onClick={toggleRole}
                                      className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold tracking-wide uppercase cursor-pointer transition-all ${
                                        isUserAdmin
                                          ? "bg-[#F4B400] hover:bg-red-500 hover:text-white text-black"
                                          : "bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-500"
                                      }`}
                                      title={isUserAdmin ? "Haz clic para cambiar a Alumno" : "Haz clic para hacer Administrador"}
                                    >
                                      {isUserAdmin ? "ADMINISTRADOR" : "HACER ADMIN"}
                                    </button>
                                  </div>
                                  <div className="text-[10px] font-mono text-gray-400 mt-0.5">ID: {u.id}</div>
                                </td>
                                <td className="p-4">
                                  <div className="font-mono text-gray-900 dark:text-gray-200">{u.email}</div>
                                  <div className="text-[10px] text-gray-400 mt-0.5">Registrado: {new Date(u.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="p-4">
                                  <div className="flex flex-col items-start gap-1">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeColor}`}>
                                      {level ? `Nivel ${level}` : "Sin suscripción activa"}
                                    </span>
                                    {level && u.activeMembership?.expiresAt && (
                                      <span className="text-[9px] font-mono text-gray-400">
                                        Expira: {new Date(u.activeMembership.expiresAt).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <span className="font-mono font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                    {u.completedLessons?.length || 0} completadas
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                    <button
                                      onClick={() => changeMembership(null)}
                                      className="px-2 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-100 dark:border-white/5 dark:hover:bg-white/10 text-[10px] font-mono font-bold uppercase text-gray-500"
                                      title="Quitar membresía"
                                    >
                                      Remover
                                    </button>
                                    <button
                                      onClick={() => changeMembership("Principiante")}
                                      className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase ${
                                        level === "Principiante"
                                          ? "bg-blue-600 text-white"
                                          : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                      }`}
                                    >
                                      Principiante
                                    </button>
                                    <button
                                      onClick={() => changeMembership("Intermedio")}
                                      className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase ${
                                        level === "Intermedio"
                                          ? "bg-[#0E5A5E] text-white"
                                          : "bg-[#0E5A5E]/10 text-[#0E5A5E] hover:bg-[#0E5A5E]/20"
                                      }`}
                                    >
                                      Intermedio
                                    </button>
                                    <button
                                      onClick={() => changeMembership("Avanzado")}
                                      className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase ${
                                        level === "Avanzado"
                                          ? "bg-[#F4B400] text-black"
                                          : "bg-[#F4B400]/10 text-[#F4B400] hover:bg-[#F4B400]/20"
                                      }`}
                                    >
                                      Avanzado
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Services CRUD Tab */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                      <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Servicios de la Agencia</h2>
                      <p className="text-gray-500 font-light text-sm mt-1">Crea, edita o elimina las ofertas de servicios de Jose Urdaneta.</p>
                    </div>
                    <button
                      onClick={() => setEditingService({ id: "service_" + Date.now(), name: "", description: "", icon: "Globe", category: "Desarrollo" })}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-opacity-95"
                    >
                      <Plus size={14} /> Nuevo Servicio
                    </button>
                  </div>

                  {editingService ? (
                    <form onSubmit={handleSaveService} className="bg-gray-50 dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                      <h4 className="font-heading font-bold text-black dark:text-white">Formulario de Servicio</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Nombre del Servicio</label>
                          <input type="text" required value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Categoría</label>
                          <select value={editingService.category} onChange={e => setEditingService({...editingService, category: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm dark:bg-neutral-950">
                            <option value="Desarrollo">Desarrollo</option>
                            <option value="Diseño">Diseño</option>
                            <option value="Automatizacion">Automatizacion</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Soporte">Soporte</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Icono (Nombre Lucide, ej. Globe, ShoppingBag, Code, Cpu)</label>
                          <input type="text" required value={editingService.icon} onChange={e => setEditingService({...editingService, icon: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Descripción</label>
                        <textarea required rows={3} value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-xs font-mono uppercase font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary text-white text-xs font-mono uppercase font-bold flex items-center gap-1"><Save size={12} /> Guardar</button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(s => (
                        <div key={s.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex items-start justify-between bg-white dark:bg-neutral-950">
                          <div>
                            <span className="text-[10px] font-mono bg-primary/10 text-primary dark:text-secondary px-2 py-0.5 rounded uppercase">{s.category}</span>
                            <h4 className="font-heading font-extrabold text-base text-black dark:text-white mt-2">{s.name}</h4>
                            <p className="text-gray-500 font-light text-xs mt-1 line-clamp-2">{s.description}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingService(s)} className="p-1.5 rounded bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-primary"><Edit size={14} /></button>
                            <button onClick={() => handleDeleteService(s.id)} className="p-1.5 rounded bg-red-100 dark:bg-neutral-900 text-red-500 hover:bg-red-200"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Portfolio CRUD Tab */}
              {activeTab === "portfolio" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                      <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Casos de Éxito del Portafolio</h2>
                      <p className="text-gray-500 font-light text-sm mt-1">Sincroniza proyectos premium con fotos y métricas de resultados.</p>
                    </div>
                    <button
                      onClick={() => setEditingProject({ id: "project_" + Date.now(), title: "", client: "", description: "", result: "", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600", technologies: ["React", "CSS"], link: "#" })}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-opacity-95"
                    >
                      <Plus size={14} /> Nuevo Proyecto
                    </button>
                  </div>

                  {editingProject ? (
                    <form onSubmit={handleSaveProject} className="bg-gray-50 dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                      <h4 className="font-heading font-bold text-black dark:text-white">Formulario de Proyecto</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Título del Proyecto</label>
                          <input type="text" required value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Cliente</label>
                          <input type="text" required value={editingProject.client} onChange={e => setEditingProject({...editingProject, client: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">URL de Imagen de Portada</label>
                          <input type="text" required value={editingProject.image} onChange={e => setEditingProject({...editingProject, image: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Link del sitio activo</label>
                          <input type="text" value={editingProject.link} onChange={e => setEditingProject({...editingProject, link: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Tecnologías (separadas por coma)</label>
                        <input type="text" required value={editingProject.technologies.join(", ")} onChange={e => setEditingProject({...editingProject, technologies: e.target.value.split(",").map(t => t.trim())})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Descripción Completa</label>
                        <textarea required rows={3} value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Resultado del Caso (Ej. +320% Leads orgánicos)</label>
                        <input type="text" required value={editingProject.result} onChange={e => setEditingProject({...editingProject, result: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-xs font-mono uppercase font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary text-white text-xs font-mono uppercase font-bold flex items-center gap-1"><Save size={12} /> Guardar</button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {portfolio.map(p => (
                        <div key={p.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex items-start gap-4 bg-white dark:bg-neutral-950">
                          <img src={p.image} referrerPolicy="no-referrer" className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <span className="text-[9px] font-mono text-primary dark:text-secondary uppercase">{p.client}</span>
                            <h4 className="font-heading font-extrabold text-base text-black dark:text-white">{p.title}</h4>
                            <p className="text-[11px] text-gray-400 mt-1">Impacto: {p.result}</p>
                            <div className="flex gap-1 mt-2">
                              <button onClick={() => setEditingProject(p)} className="p-1 rounded bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-primary text-xs flex items-center gap-1 px-2"><Edit size={12} /> Editar</button>
                              <button onClick={() => handleDeleteProject(p.id)} className="p-1 rounded bg-red-100 dark:bg-neutral-900 text-red-500 hover:bg-red-200 text-xs flex items-center gap-1 px-2"><Trash2 size={12} /> Eliminar</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Form submissions Tab */}
              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Leads Captados y Solicitudes</h2>
                    <p className="text-gray-500 font-light text-sm mt-1">Sincroniza y aprueba transferencias manuales (Nequi/Bancolombia) y mensajes de contacto.</p>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 font-mono text-xs">
                      No se han recibido consultas comerciales ni solicitudes por el momento.
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Section 1: Membership Payment Approvals */}
                      {submissions.some((sub: any) => sub.isPaymentRequest) && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-mono font-bold text-[#F4B400] uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck size={16} /> Solicitudes de Matrícula y Pago (Transferencia Bancaria)
                          </h3>
                          <div className="grid grid-cols-1 gap-4">
                            {submissions
                              .filter((sub: any) => sub.isPaymentRequest)
                              .map((sub: any) => {
                                const status = sub.status || "pending";
                                let statusBadgeColor = "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30";
                                let statusText = "Pendiente de Validación";
                                if (status === "approved") {
                                  statusBadgeColor = "bg-green-100 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/30";
                                  statusText = "Aprobado y Activo";
                                } else if (status === "rejected") {
                                  statusBadgeColor = "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30";
                                  statusText = "Rechazado";
                                }

                                return (
                                  <div key={sub.id} className={`p-6 border rounded-2xl bg-white dark:bg-neutral-950 shadow-sm flex flex-col justify-between gap-4 transition-all ${
                                    status === "pending" ? "border-amber-300 dark:border-amber-500/20 shadow-amber-500/5" : "border-gray-100 dark:border-gray-800"
                                  }`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800/40 pb-3">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-heading font-extrabold text-base text-black dark:text-white block">{sub.name}</span>
                                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeColor}`}>
                                            {statusText}
                                          </span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">Plan solicitado: <strong className="text-primary dark:text-secondary">{sub.requestedLevel}</strong> | Voucher: <code className="bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded font-bold">{sub.voucher || "Sin Comprobante"}</code></span>
                                        
                                        {sub.voucherImage && (
                                          <div className="mt-2.5 flex items-center gap-2">
                                            <span className="text-[10px] text-gray-400 font-mono uppercase font-bold">Comprobante PC:</span>
                                            <button
                                              onClick={() => setSelectedVoucherImg(sub.voucherImage)}
                                              className="px-2 py-1 bg-primary/10 hover:bg-primary/20 dark:bg-[#F4B400]/10 dark:hover:bg-[#F4B400]/20 text-primary dark:text-[#F4B400] rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-all border border-primary/20 dark:border-[#F4B400]/20"
                                            >
                                              <Eye size={10} /> Ver Imagen Adjunta
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-right">
                                        <span className="text-[10px] font-mono bg-[#0E5A5E]/10 text-[#0E5A5E] px-2.5 py-1 rounded">
                                          {sub.service}
                                        </span>
                                        <span className="block text-[9px] text-gray-400 font-mono mt-1">
                                          {new Date(sub.date).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap font-light">{sub.message}</p>
                                      <div className="flex flex-wrap gap-4 text-xs font-mono pt-2 text-gray-400">
                                        <span>Email: <a href={`mailto:${sub.email}`} className="text-primary hover:underline">{sub.email}</a></span>
                                        {sub.phone && sub.phone !== "N/A" && (
                                          <span>WhatsApp: <a href={`https://wa.me/${sub.phone.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{sub.phone}</a></span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex gap-2 justify-end pt-2 border-t border-gray-100 dark:border-gray-800/20 mt-2">
                                      {status === "pending" && (
                                        <>
                                          <button
                                            onClick={() => handleRejectSubmission(sub.id)}
                                            className="px-4 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-xs font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                                          >
                                            Rechazar
                                          </button>
                                          <button
                                            onClick={() => handleApproveSubmission(sub.id)}
                                            className="px-4 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-lg shadow-green-600/10 transition-all"
                                          >
                                            <CheckCircle2 size={12} /> Aprobar Pago y Activar
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => handleDeleteSubmission(sub.id)}
                                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-500 hover:text-red-500 text-xs font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                                        title="Eliminar del historial"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* Section 2: Standard Contact Enquiries */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-mono font-bold text-gray-400 uppercase tracking-wider">
                          📬 Mensajes y Consultas de la Agencia
                        </h3>
                        <div className="space-y-4">
                          {submissions
                            .filter((sub: any) => !sub.isPaymentRequest)
                            .map((sub: any) => (
                              <div key={sub.id} className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-neutral-950 flex flex-col justify-between gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800/40 pb-3">
                                  <div>
                                    <span className="font-heading font-extrabold text-base text-black dark:text-white block">{sub.name}</span>
                                    <span className="text-xs text-gray-400 font-mono">Empresa: {sub.company}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] font-mono bg-primary/10 text-primary dark:text-secondary px-2.5 py-1 rounded">
                                      {sub.service}
                                    </span>
                                    <span className="block text-[9px] text-gray-400 font-mono mt-1">
                                      {new Date(sub.date).toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <p className="text-gray-700 dark:text-gray-200 text-sm whitespace-pre-wrap font-light">{sub.message}</p>
                                  <div className="flex flex-wrap gap-4 text-xs font-mono pt-2 text-gray-400">
                                    <span>Email: <a href={`mailto:${sub.email}`} className="text-primary hover:underline">{sub.email}</a></span>
                                    {sub.phone && sub.phone !== "N/A" && (
                                      <span>WhatsApp: <a href={`https://wa.me/${sub.phone.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{sub.phone}</a></span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2 justify-end pt-2">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`Cliente: ${sub.name}\nCorreo: ${sub.email}\nWhatsApp: ${sub.phone}\nServicio: ${sub.service}\nMensaje: ${sub.message}`);
                                      showToast("Ficha copiada al portapapeles");
                                    }}
                                    className="px-3 py-1.5 rounded bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-black dark:hover:text-white text-xs font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Copy size={12} /> Copiar Ficha
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubmission(sub.id)}
                                    className="px-3 py-1.5 rounded bg-red-100 dark:bg-neutral-900 text-red-500 hover:bg-red-200 text-xs font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <Trash2 size={12} /> Eliminar
                                  </button>
                                </div>
                              </div>
                            ))}
                          {submissions.filter((sub: any) => !sub.isPaymentRequest).length === 0 && (
                            <div className="py-8 text-center text-gray-400 font-mono text-xs">
                              No hay consultas de clientes en esta sección.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                      <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Testimonios de Socios</h2>
                      <p className="text-gray-500 font-light text-sm mt-1">Administra las opiniones con fotos y estrellas de satisfacción.</p>
                    </div>
                    <button
                      onClick={() => setEditingTestimonial({ id: "test_" + Date.now(), name: "", role: "", company: "", content: "", stars: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300" })}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-opacity-95"
                    >
                      <Plus size={14} /> Nuevo Testimonio
                    </button>
                  </div>

                  {editingTestimonial ? (
                    <form onSubmit={handleSaveTestimonial} className="bg-gray-50 dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                      <h4 className="font-heading font-bold text-black dark:text-white">Formulario de Testimonio</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Nombre Autor</label>
                          <input type="text" required value={editingTestimonial.name} onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Puesto / Cargo</label>
                          <input type="text" required value={editingTestimonial.role} onChange={e => setEditingTestimonial({...editingTestimonial, role: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Empresa</label>
                          <input type="text" required value={editingTestimonial.company} onChange={e => setEditingTestimonial({...editingTestimonial, company: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Calificación Estrellas (1-5)</label>
                          <input type="number" min={1} max={5} required value={editingTestimonial.stars} onChange={e => setEditingTestimonial({...editingTestimonial, stars: Number(e.target.value)})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Foto Avatar URL</label>
                        <input type="text" required value={editingTestimonial.avatar} onChange={e => setEditingTestimonial({...editingTestimonial, avatar: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Contenido Opinión</label>
                        <textarea required rows={3} value={editingTestimonial.content} onChange={e => setEditingTestimonial({...editingTestimonial, content: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-xs font-mono uppercase font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary text-white text-xs font-mono uppercase font-bold flex items-center gap-1"><Save size={12} /> Guardar</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {testimonials.map(t => (
                        <div key={t.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between bg-white dark:bg-neutral-950">
                          <div className="flex items-center gap-4">
                            <img src={t.avatar} referrerPolicy="no-referrer" className="w-10 h-10 rounded-full object-cover border" />
                            <div>
                              <h4 className="font-heading font-extrabold text-sm text-black dark:text-white">{t.name}</h4>
                              <p className="text-xs text-gray-400 font-mono">{t.role} — {t.company} ({t.stars} ★)</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingTestimonial(t)} className="p-1.5 rounded bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-primary"><Edit size={14} /></button>
                            <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1.5 rounded bg-red-100 dark:bg-neutral-900 text-red-500 hover:bg-red-200"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Blog CRUD Tab */}
              {activeTab === "blog" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                      <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Artículos de Blog</h2>
                      <p className="text-gray-500 font-light text-sm mt-1">Sincroniza noticias, guías y tendencias para captación orgánica SEO.</p>
                    </div>
                    <button
                      onClick={() => setEditingBlog({ id: "blog_" + Date.now(), title: "", category: "IA", excerpt: "", content: "", date: new Date().toLocaleDateString(), readTime: "5 min read", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600" })}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-opacity-95"
                    >
                      <Plus size={14} /> Nuevo Artículo
                    </button>
                  </div>

                  {editingBlog ? (
                    <form onSubmit={handleSaveBlog} className="bg-gray-50 dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                      <h4 className="font-heading font-bold text-black dark:text-white">Formulario de Artículo</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Título del Post</label>
                          <input type="text" required value={editingBlog.title} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Categoría</label>
                          <select value={editingBlog.category} onChange={e => setEditingBlog({...editingBlog, category: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm dark:bg-neutral-950">
                            <option value="IA">IA</option>
                            <option value="SEO">SEO</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Diseño">Diseño</option>
                            <option value="Noticias">Noticias</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Imagen URL</label>
                          <input type="text" required value={editingBlog.image} onChange={e => setEditingBlog({...editingBlog, image: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Tiempo de Lectura (ej. 4 min read)</label>
                          <input type="text" required value={editingBlog.readTime} onChange={e => setEditingBlog({...editingBlog, readTime: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Resumen / Excerpt corto</label>
                        <input type="text" required value={editingBlog.excerpt} onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Cuerpo Completo del Artículo</label>
                        <textarea required rows={6} value={editingBlog.content} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setEditingBlog(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-xs font-mono uppercase font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary text-white text-xs font-mono uppercase font-bold flex items-center gap-1"><Save size={12} /> Guardar</button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {blog.map(b => (
                        <div key={b.id} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-between bg-white dark:bg-neutral-950">
                          <div className="flex items-center gap-4">
                            <img src={b.image} referrerPolicy="no-referrer" className="w-16 h-12 object-cover rounded" />
                            <div>
                              <span className="text-[9px] font-mono bg-primary/10 text-primary px-2 rounded">{b.category}</span>
                              <h4 className="font-heading font-extrabold text-sm text-black dark:text-white mt-1">{b.title}</h4>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingBlog(b)} className="p-1.5 rounded bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-primary"><Edit size={14} /></button>
                            <button onClick={() => handleDeleteBlog(b.id)} className="p-1.5 rounded bg-red-100 dark:bg-neutral-900 text-red-500 hover:bg-red-200"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Courses (LMS) Tab */}
              {activeTab === "courses" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div>
                      <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Academia LMS y Cursos</h2>
                      <p className="text-gray-500 font-light text-sm mt-1">Sube tus entrenamientos, planifica capítulos y haz que tus cursos sean 100% autoadministrables.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({
                        id: "course_" + Date.now(),
                        title: "",
                        description: "",
                        category: "Automatizacion",
                        level: "Principiante",
                        lessonsCount: 0,
                        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
                        price: "$199 USD",
                        instructor: "Jose Urdaneta",
                        lessons: []
                      })}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-opacity-95 cursor-pointer"
                    >
                      <Plus size={14} /> Nuevo Curso
                    </button>
                  </div>

                  {editingCourse ? (
                    <form onSubmit={handleSaveCourse} className="bg-gray-50 dark:bg-black/35 p-6 rounded-2xl border border-gray-100 dark:border-white/10 space-y-6">
                      <div className="border-b border-gray-200 dark:border-white/5 pb-3">
                        <h4 className="font-heading font-extrabold text-base text-gray-900 dark:text-white">Detalles Principales del Curso</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Título del Curso</label>
                          <input
                            type="text"
                            required
                            value={editingCourse.title}
                            onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                            className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded bg-transparent text-sm text-black dark:text-white focus:border-primary"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Categoría</label>
                          <select
                            value={editingCourse.category}
                            onChange={e => setEditingCourse({...editingCourse, category: e.target.value})}
                            className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded bg-transparent text-sm text-black dark:text-white dark:bg-[#051a1b]"
                          >
                            <option value="Automatizacion">Automatización</option>
                            <option value="Desarrollo">Desarrollo Web</option>
                            <option value="Marketing">Marketing Digital</option>
                            <option value="Diseño">Branding & Diseño</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Dificultad / Nivel</label>
                          <select
                            value={editingCourse.level}
                            onChange={e => setEditingCourse({...editingCourse, level: e.target.value as any})}
                            className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded bg-transparent text-sm text-black dark:text-white dark:bg-[#051a1b]"
                          >
                            <option value="Principiante">Principiante</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Avanzado">Avanzado</option>
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Precio (ej. $199 USD)</label>
                          <input
                            type="text"
                            required
                            value={editingCourse.price}
                            onChange={e => setEditingCourse({...editingCourse, price: e.target.value})}
                            className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded bg-transparent text-sm text-black dark:text-white focus:border-primary"
                          />
                        </div>
                        <div className="flex flex-col md:col-span-2">
                          <label className="text-xs font-mono font-bold text-gray-400 mb-1">Instructor Principal</label>
                          <input
                            type="text"
                            required
                            value={editingCourse.instructor || ""}
                            onChange={e => setEditingCourse({...editingCourse, instructor: e.target.value})}
                            className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded bg-transparent text-sm text-black dark:text-white focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Imagen URL del Curso (Cover)</label>
                        <input
                          type="text"
                          required
                          value={editingCourse.image}
                          onChange={e => setEditingCourse({...editingCourse, image: e.target.value})}
                          className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded bg-transparent text-sm text-black dark:text-white focus:border-primary"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-400 mb-1">Sinopsis / Descripción General</label>
                        <textarea
                          required
                          rows={3}
                          value={editingCourse.description}
                          onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                          className="px-3 py-2 border border-gray-200 dark:border-white/10 rounded bg-transparent text-sm text-black dark:text-white focus:border-primary"
                        />
                      </div>

                      {/* SYLLABUS LESSONS BUILDER */}
                      <div className="border-t border-gray-200 dark:border-white/10 pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-heading font-extrabold text-sm text-gray-900 dark:text-white">Capítulos / Programa de Lecciones ({editingCourse.lessons?.length || 0})</h5>
                        </div>

                        {/* Lessons List inside Course */}
                        {(!editingCourse.lessons || editingCourse.lessons.length === 0) ? (
                          <p className="text-xs text-gray-400 font-mono italic">Aún no has agregado lecciones a este curso. Agrega una abajo.</p>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {editingCourse.lessons.map((lesson, index) => (
                              <div key={lesson.id} className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center text-[10px] font-mono">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h6 className="text-xs font-bold text-gray-900 dark:text-white">{lesson.title}</h6>
                                    <span className="text-[10px] font-mono text-gray-400">Duración: {lesson.duration} | Video: {lesson.videoUrl ? "Sí" : "No"}</span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const filtered = editingCourse.lessons.filter(l => l.id !== lesson.id);
                                    setEditingCourse({ ...editingCourse, lessons: filtered });
                                  }}
                                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
                                  title="Eliminar Lección"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ADD LESSON MINI-FORM */}
                        <div className="p-4 bg-white dark:bg-white/5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 space-y-3">
                          <span className="text-xs font-mono font-bold text-primary dark:text-secondary block">➕ Agregar Nueva Lección al Programa</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              id="new-lesson-title"
                              placeholder="Título del capítulo..."
                              className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded bg-transparent text-xs text-black dark:text-white"
                            />
                            <input
                              type="text"
                              id="new-lesson-duration"
                              placeholder="Duración (ej. 15:40)..."
                              className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded bg-transparent text-xs text-black dark:text-white"
                            />
                            <input
                              type="text"
                              id="new-lesson-video"
                              placeholder="Video URL (opcional)..."
                              className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded bg-transparent text-xs text-black dark:text-white"
                            />
                          </div>
                          <input
                            type="text"
                            id="new-lesson-desc"
                            placeholder="Breve descripción o tareas de la lección (opcional)..."
                            className="w-full px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded bg-transparent text-xs text-black dark:text-white"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const titleInput = document.getElementById("new-lesson-title") as HTMLInputElement;
                                const durationInput = document.getElementById("new-lesson-duration") as HTMLInputElement;
                                const videoInput = document.getElementById("new-lesson-video") as HTMLInputElement;
                                const descInput = document.getElementById("new-lesson-desc") as HTMLInputElement;

                                if (!titleInput?.value) {
                                  alert("El título de la lección es obligatorio");
                                  return;
                                }

                                const newLesson: Lesson = {
                                  id: "lesson_" + Date.now() + "_" + Math.floor(Math.random() * 100),
                                  title: titleInput.value,
                                  duration: durationInput?.value || "10:00",
                                  videoUrl: videoInput?.value || "https://www.w3schools.com/html/mov_bbb.mp4",
                                  description: descInput?.value || ""
                                };

                                const updatedLessons = [...(editingCourse.lessons || []), newLesson];
                                setEditingCourse({
                                  ...editingCourse,
                                  lessons: updatedLessons
                                });

                                // Clear inputs
                                titleInput.value = "";
                                durationInput.value = "";
                                videoInput.value = "";
                                if (descInput) descInput.value = "";
                              }}
                              className="px-3 py-1.5 bg-secondary text-black hover:opacity-95 font-mono font-bold text-[10px] uppercase rounded-md cursor-pointer"
                            >
                              Insertar Lección
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Course actions */}
                      <div className="flex gap-2 justify-end border-t border-gray-200 dark:border-white/5 pt-4">
                        <button
                          type="button"
                          onClick={() => setEditingCourse(null)}
                          className="px-4 py-2 rounded bg-gray-200 text-gray-800 text-xs font-mono uppercase font-bold cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded bg-primary text-white text-xs font-mono uppercase font-bold flex items-center gap-1.5 hover:bg-opacity-95 cursor-pointer shadow-md"
                        >
                          <Save size={12} /> Guardar Curso
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {courses.map(course => (
                        <div key={course.id} className="p-4 border border-gray-100 dark:border-white/10 rounded-xl flex items-center justify-between bg-white dark:bg-white/5">
                          <div className="flex items-center gap-4">
                            <img src={course.image} referrerPolicy="no-referrer" className="w-16 h-12 object-cover rounded bg-neutral-900" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono bg-primary/10 dark:bg-[#F4B400]/15 text-primary dark:text-[#F4B400] px-2 rounded font-bold uppercase">{course.category}</span>
                                <span className="text-[9px] font-mono bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 rounded">{course.level}</span>
                              </div>
                              <h4 className="font-heading font-extrabold text-sm text-black dark:text-white mt-1.5">{course.title}</h4>
                              <p className="text-[10px] font-mono text-gray-400 mt-0.5">{course.lessons?.length || 0} lecciones cargadas | Precio: {course.price}</p>
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button onClick={() => setEditingCourse(course)} className="p-2 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-white/70 hover:text-primary dark:hover:text-[#F4B400] cursor-pointer"><Edit size={13} /></button>
                            <button onClick={() => handleDeleteCourse(course.id)} className="p-2 rounded bg-red-100 dark:bg-red-950/40 text-red-500 hover:bg-red-200 cursor-pointer"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SEO & Config Tab */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">SEO & Configuración Global</h2>
                    <p className="text-gray-500 font-light text-sm mt-1">Configura las etiquetas de indexación y el posicionamiento de tu web.</p>
                  </div>

                  <form onSubmit={handleSaveSeo} className="bg-gray-50 dark:bg-neutral-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-mono font-bold text-gray-400 mb-1">Título de tu Web (SEO Meta Title)</label>
                      <input type="text" required value={seo.title} onChange={e => setSeo({...seo, title: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-mono font-bold text-gray-400 mb-1">Descripción de Búsqueda (Meta Description)</label>
                      <textarea required rows={3} value={seo.description} onChange={e => setSeo({...seo, description: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-mono font-bold text-gray-400 mb-1">Palabras Clave (SEO Keywords, separadas por coma)</label>
                      <input type="text" required value={seo.keywords} onChange={e => setSeo({...seo, keywords: e.target.value})} className="px-3 py-2 border rounded bg-transparent dark:border-gray-800 text-sm" />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button type="submit" className="px-6 py-3 rounded-xl bg-primary text-white text-xs font-mono uppercase font-bold flex items-center gap-1.5 hover:bg-opacity-95 shadow-md"><Save size={14} /> Guardar Configuración</button>
                    </div>
                  </form>
                </div>
              )}

            </main>

          </div>
        )}

      </div>

      {/* Mini Toast Notification layer */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-mono border border-gray-800"
          >
            <CheckCircle2 size={16} className="text-secondary" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal for Voucher image preview */}
      <AnimatePresence>
        {selectedVoucherImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVoucherImg(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] z-10 bg-white dark:bg-[#051a1b] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col p-4"
            >
              <button
                onClick={() => setSelectedVoucherImg(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-all z-20 cursor-pointer"
                title="Cerrar"
              >
                <X size={16} />
              </button>
              
              <div className="flex-1 overflow-auto flex items-center justify-center max-h-[75vh]">
                <img
                  src={selectedVoucherImg}
                  alt="Comprobante de pago"
                  className="max-w-full max-h-[70vh] object-contain rounded"
                />
              </div>
              
              <div className="text-center pt-3 text-xs font-mono text-gray-500">
                <span>Comprobante cargado por el Alumno desde PC</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
