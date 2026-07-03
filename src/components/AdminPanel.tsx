import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Lock, ShieldCheck, LayoutDashboard, Briefcase, Wrench, MessageSquare,
  BookOpen, Settings, Plus, Trash2, Edit, Save, Trash, AlertCircle, Copy, CheckCircle2, FileText
} from "lucide-react";
import { Service, Project, Testimonial, BlogPost, SocialPost, SEOSettings } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  initialData: {
    services: Service[];
    portfolio: Project[];
    testimonials: Testimonial[];
    blog: BlogPost[];
    socialPosts: SocialPost[];
    seoSettings: SEOSettings;
  };
  onDataUpdate: () => void; // Trigger page re-fetch
}

export default function AdminPanel({ onClose, initialData, onDataUpdate }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "services" | "portfolio" | "contact" | "testimonials" | "blog" | "seo">("dashboard");

  // Local CRUD states synced from initialData
  const [services, setServices] = useState<Service[]>(initialData.services);
  const [portfolio, setPortfolio] = useState<Project[]>(initialData.portfolio);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData.testimonials);
  const [blog, setBlog] = useState<BlogPost[]>(initialData.blog);
  const [seo, setSeo] = useState<SEOSettings>(initialData.seoSettings);

  // Form submissions from server
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Editing items states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // Saving state indicator
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
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
        showToast("Error al guardar cambios en el servidor");
      }
    } catch (err) {
      showToast("Error de conexión al guardar cambios");
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

  // 5. SUBMISSIONS DELETION
  const handleDeleteSubmission = async (id: string) => {
    if (!confirm("¿Seguro que deseas borrar este lead del historial?")) return;
    try {
      const response = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (response.ok) {
        setSubmissions(submissions.filter(s => s.id !== id));
        showToast("Lead comercial eliminado correctamente");
      }
    } catch (err) {
      showToast("Error de comunicación");
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
                  { id: "services", label: "Servicios (CRUD)", icon: Wrench },
                  { id: "portfolio", label: "Portafolio (CRUD)", icon: Briefcase },
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

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-gray-800 rounded-2xl">
                      <span className="text-xs text-gray-400 font-mono uppercase tracking-wide">Servicios Registrados</span>
                      <span className="block font-display font-bold text-3xl mt-2 text-black dark:text-white">{services.length}</span>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-gray-800 rounded-2xl">
                      <span className="text-xs text-gray-400 font-mono uppercase tracking-wide">Casos de Éxito</span>
                      <span className="block font-display font-bold text-3xl mt-2 text-black dark:text-white">{portfolio.length}</span>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-gray-800 rounded-2xl">
                      <span className="text-xs text-gray-400 font-mono uppercase tracking-wide">Leads Captados (Mensajes)</span>
                      <span className="block font-display font-bold text-3xl mt-2 text-primary dark:text-secondary">{submissions.length}</span>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-gray-800 rounded-2xl">
                      <span className="text-xs text-gray-400 font-mono uppercase tracking-wide">Artículos de Blog</span>
                      <span className="block font-display font-bold text-3xl mt-2 text-black dark:text-white">{blog.length}</span>
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
                    <h2 className="font-display font-extrabold text-2xl text-black dark:text-white">Leads Captados (Mensajes en tiempo real)</h2>
                    <p className="text-gray-500 font-light text-sm mt-1">Consultas y solicitudes de cotización enviadas por posibles clientes.</p>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 font-mono text-xs">
                      No se han recibido consultas comerciales por el momento.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((sub: any) => (
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
                              className="px-3 py-1.5 rounded bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-black dark:hover:text-white text-xs font-mono font-bold uppercase flex items-center gap-1"
                            >
                              <Copy size={12} /> Copiar Ficha
                            </button>
                            <button
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="px-3 py-1.5 rounded bg-red-100 dark:bg-neutral-900 text-red-500 hover:bg-red-200 text-xs font-mono font-bold uppercase flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
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

    </div>
  );
}
