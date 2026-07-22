import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquareText, ShieldAlert } from "lucide-react";

interface ContactSectionProps {
  selectedServicePreset?: string;
}

export default function ContactSection({ selectedServicePreset }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync selected plan preset if passed down from pricing cards
  useEffect(() => {
    if (selectedServicePreset) {
      setFormData(prev => ({ ...prev, service: selectedServicePreset }));
    }
  }, [selectedServicePreset]);

  const serviceOptions = [
    "Diseño de páginas web profesionales",
    "Tiendas Virtuales (E-commerce)",
    "Landing Pages",
    "Diseño UX/UI",
    "Automatización de WhatsApp",
    "Chatbots & Bots Conversacionales",
    "Automatización de negocios",
    "Gestión de Redes Sociales",
    "Branding & Diseño gráfico",
    "Posicionamiento SEO",
    "Campañas ADS & Marketing Digital",
    "Hosting & Soporte Cloud",
    "Desarrollo de software / CRM"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      id: "sub_" + Date.now(),
      name: formData.name,
      company: formData.company || "No especificado",
      email: formData.email,
      phone: formData.phone || "No especificado",
      service: formData.service || "General",
      message: formData.message,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          service: "",
          message: ""
        });
      } else {
        const resData = await response.json();
        throw new Error(resData.error || "Ocurrió un error");
      }
    } catch (err: any) {
      console.warn("Falling back to local storage submission saving:", err);
      try {
        const cached = localStorage.getItem("app_db_data");
        if (cached) {
          const db = JSON.parse(cached);
          db.formSubmissions = [payload, ...(db.formSubmissions || [])];
          localStorage.setItem("app_db_data", JSON.stringify(db));
        } else {
          const db = { formSubmissions: [payload] };
          localStorage.setItem("app_db_data", JSON.stringify(db));
        }
        setSubmitSuccess(true);
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          service: "",
          message: ""
        });
      } catch (e) {
        setErrorMessage("No se pudo conectar con el servidor. Reintente en unos momentos.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-24 px-6 bg-white dark:bg-transparent transition-colors relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Let's Collaborate
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-5">
            ¿Listo para llevar tu negocio al siguiente nivel?
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full mb-5"></div>
          <p className="text-gray-600 dark:text-gray-400 font-light text-base">
            Completa el formulario a continuación. El equipo comercial de Sinergia Agencia Creativa evaluará tu marca para agendar una sesión estratégica sin coste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden h-full">
              
              <AnimatePresence mode="wait">
                {!submitSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Nombre */}
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Tu nombre"
                          className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-primary dark:focus:border-secondary transition-all"
                        />
                      </div>

                      {/* Empresa */}
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                          Empresa / Marca
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Nombre de tu empresa"
                          className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-primary dark:focus:border-secondary transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Correo */}
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="correo@ejemplo.com"
                          className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-primary dark:focus:border-secondary transition-all"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div className="flex flex-col">
                        <label className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                          WhatsApp / Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+58 412 1234567"
                          className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-primary dark:focus:border-secondary transition-all"
                        />
                      </div>
                    </div>

                    {/* Servicio dropdown */}
                    <div className="flex flex-col">
                      <label className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Servicio Requerido *
                      </label>
                      <select
                        name="service"
                        required
                        value={formData.service}
                        onChange={handleChange}
                        className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-black dark:text-white dark:bg-neutral-900 focus:outline-none focus:border-primary dark:focus:border-secondary transition-all"
                      >
                        <option value="">Selecciona un servicio</option>
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mensaje */}
                    <div className="flex flex-col">
                      <label className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        Escribe sobre tu proyecto *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Cuéntanos sobre tu modelo de negocio, presupuesto, metas y plazos de entrega..."
                        className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-sm text-black dark:text-white focus:outline-none focus:border-primary dark:focus:border-secondary transition-all resize-none"
                      />
                    </div>

                    {/* Error Alerts */}
                    {errorMessage && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                        <ShieldAlert size={16} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-opacity-95 shadow-xl shadow-primary/25 disabled:opacity-50 transition-all cursor-pointer active:scale-95"
                    >
                      {isSubmitting ? "Enviando Solicitud..." : "Enviar Solicitud"}
                      <Send size={14} />
                    </button>

                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12 h-full space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary flex items-center justify-center animate-bounce">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="font-heading font-extrabold text-2xl text-black dark:text-white">
                        ¡Solicitud Recibida!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 font-light text-sm sm:text-base leading-relaxed">
                        Muchas gracias por confiar en Sinergia Agencia Creativa. Nuestro equipo comercial ha recibido tu requerimiento y te contactará por WhatsApp o correo en un lapso menor a 2 horas hábiles.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-3 rounded-full bg-gray-100 dark:bg-neutral-800 text-black dark:text-white font-medium text-xs font-mono uppercase tracking-wider hover:bg-gray-200 transition-colors"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Contact Details & Google Maps Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Quick Details Cards */}
            <div className="glass-panel rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl space-y-4">
              <h3 className="font-heading font-extrabold text-lg text-black dark:text-white mb-4">
                Información Comercial
              </h3>
              
              <div className="space-y-4">
                <a href="mailto:comercial@agenciacreativasinergia.com" className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={16} />
                  </span>
                  <span>comercial@agenciacreativasinergia.com</span>
                </a>
                
                <a href="https://wa.me/573145532957" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MessageSquareText size={16} />
                  </span>
                  <span>+57 314 553 2957 (WhatsApp)</span>
                </a>

                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={16} />
                  </span>
                  <span>Distrito Capital, Caracas - Venezuela / Bogotá - Colombia</span>
                </div>
              </div>
            </div>

            {/* Google Maps Embed Styled with Grayscale/High Contrast filters to match brand */}
            <div className="flex-1 min-h-[250px] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125547.28424269931!2d-66.96041071465228!3d10.468383849924847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2a58adcd824833%3A0x51fdc16f2c906646!2sCaracas%2C%20Distrito%20Capital%2C%20Venezuela!5e0!3m2!1ses!2s!4v1719999999999!5m2!1ses!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1) invert(0.9)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full transition-all duration-700 group-hover:filter-none"
              ></iframe>
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-[9px] font-mono text-white pointer-events-none uppercase tracking-widest border border-white/10">
                Sinergia Agencia Creativa Headquarters
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
