import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, UserCheck, MessageSquare, Cpu, Database, Award, Sparkles, CheckCircle2 } from "lucide-react";

export default function AutomationSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      title: "Cliente",
      subtitle: "Captación del Lead",
      icon: UserCheck,
      desc: "El usuario visita tu sitio web, escanea un código QR o hace clic en un anuncio, ingresando al embudo listo para interactuar.",
      tech: "Traffic Source (Facebook/Google Ads, Organic SEO)",
      metric: "Atención inmediata 0s de espera"
    },
    {
      id: 1,
      title: "WhatsApp",
      subtitle: "Canal Inmediato",
      icon: MessageSquare,
      desc: "Se inicia un chat de WhatsApp de manera automática con un saludo personalizado y contextualizado según la procedencia del usuario.",
      tech: "WhatsApp Cloud API, Webhooks",
      metric: "+85% de Tasa de Apertura"
    },
    {
      id: 2,
      title: "IA (Gemini)",
      subtitle: "Cerebro Cognitivo",
      icon: Cpu,
      desc: "Nuestra Inteligencia Artificial avanzada analiza la consulta, responde con precisión técnica, califica el presupuesto y recopila datos clave.",
      tech: "Gemini 3.5 Flash Model",
      metric: "Cierre de citas autónomo"
    },
    {
      id: 3,
      title: "CRM",
      subtitle: "Sincronización Total",
      icon: Database,
      desc: "La IA clasifica el cliente en tu pipeline comercial del CRM en tiempo real, agendando tareas de seguimiento y alertando a tu equipo.",
      tech: "Hubspot / Salesforce / Custom DB",
      metric: "Cero pérdida de Leads"
    },
    {
      id: 4,
      title: "Venta",
      subtitle: "Conversión Exitosa",
      icon: Award,
      desc: "Se emite el link de pago o cotización y se concreta la venta. Tu equipo solo interviene para firmar contratos o coordinar logística.",
      tech: "Stripe, PayPal, Automations",
      metric: "Retorno de Inversión (ROI) Exponencial"
    }
  ];

  return (
    <section id="automatizacion" className="py-24 px-6 bg-white dark:bg-transparent transition-colors relative overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-secondary/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Ingeniería de Ventas
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-5">
            Flujo de Automatización Inteligente
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full mb-5"></div>
          <p className="text-gray-600 dark:text-gray-400 font-light text-base">
            Diseñamos ecosistemas hiper-eficientes donde la inteligencia artificial y los disparadores en la nube operan como tus vendedores de élite las 24 horas del día.
          </p>
        </div>

        {/* Visual Node-Flow Diagram (Interactive Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Node Graph */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-8 glass-panel rounded-2xl relative border border-gray-100 dark:border-gray-800">
              
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isActive = activeStep === idx;

                return (
                  <div key={step.id} className="flex flex-col sm:flex-row items-center w-full sm:w-auto relative">
                    
                    {/* Node Circle */}
                    <button
                      onClick={() => setActiveStep(idx)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center relative cursor-pointer z-10 transition-all duration-300 ${
                        isActive
                          ? "bg-primary dark:bg-secondary text-white dark:text-black scale-110 shadow-xl shadow-primary/20 ring-4 ring-primary/10 dark:ring-secondary/20"
                          : "bg-gray-100 dark:bg-neutral-900 text-gray-500 hover:text-primary dark:hover:text-secondary border border-gray-200 dark:border-gray-800"
                      }`}
                    >
                      <IconComponent size={24} />
                      
                      {/* Active Indicator Pulse */}
                      {isActive && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F4B400] dark:bg-primary border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[8px] text-white font-mono font-bold">
                          ✓
                        </span>
                      )}
                    </button>

                    {/* Node Title on Node */}
                    <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-8 sm:left-1/2 sm:-translate-x-1/2 text-center">
                      <span className={`text-xs font-mono font-bold tracking-wider ${isActive ? 'text-primary dark:text-secondary' : 'text-gray-400'}`}>
                        {step.title}
                      </span>
                    </div>

                    {/* Connector Arrow (Hidden on last step) */}
                    {idx < steps.length - 1 && (
                      <div className="my-3 sm:my-0 sm:mx-4 text-gray-300 dark:text-neutral-800 flex justify-center rotate-90 sm:rotate-0">
                        <ArrowRight size={20} className={isActive ? "text-primary dark:text-secondary animate-pulse" : ""} />
                      </div>
                    )}

                  </div>
                );
              })}

            </div>

            {/* Simulated Live Action Terminal */}
            <div className="bg-neutral-950 p-6 rounded-2xl font-mono text-xs text-green-400 border border-gray-900 shadow-xl">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-900 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-gray-500 text-[10px] uppercase font-bold">AI Workflow Live Monitoring Terminal</span>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">[2026-07-03T10:33:18] CORE_SERVICE_ACTIVE: Integración WhatsApp Cloud v18 ready.</p>
                <p className="text-primary-light font-bold text-[#F4B400]">
                  &gt; Siguiente estado sugerido: <span className="underline">{steps[activeStep].title}</span> ({steps[activeStep].subtitle})
                </p>
                <p className="text-gray-300">&gt; Webhook recibido desde WhatsApp API. Ejecutando análisis cognitivo con Gemini.</p>
                <p className="text-[#0E5A5E] dark:text-[#2dd4bf]">&gt; {steps[activeStep].desc}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Step Feature Breakdown Card */}
          <div className="lg:col-span-4">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-2xl p-8 relative border-2 border-primary/20 dark:border-secondary/20 h-full flex flex-col justify-between"
            >
              <div>
                {/* Micro Tagline */}
                <div className="flex items-center gap-1.5 text-primary dark:text-secondary font-mono text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Sparkles size={12} />
                  <span>Fase del Embudo Automático</span>
                </div>

                {/* Card Title */}
                <h3 className="font-heading font-extrabold text-2xl text-black dark:text-white mb-2">
                  {steps[activeStep].title}
                </h3>
                <h4 className="font-sans font-medium text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {steps[activeStep].subtitle}
                </h4>

                <p className="text-gray-600 dark:text-gray-300 font-light text-base leading-relaxed mb-6">
                  {steps[activeStep].desc}
                </p>

                <div className="h-[1px] bg-gray-100 dark:bg-neutral-800 mb-6"></div>

                {/* Technical detail & metrics list */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase block">Soporte Tecnológico</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm block mt-0.5">
                      {steps[activeStep].tech}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase block">Métrica Clave</span>
                    <span className="font-mono text-primary dark:text-secondary text-sm font-bold flex items-center gap-1.5 mt-0.5">
                      <CheckCircle2 size={14} />
                      {steps[activeStep].metric}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Next trigger */}
              <button
                onClick={() => setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))}
                className="w-full mt-8 py-3.5 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all"
              >
                Siguiente Paso <ArrowRight size={14} />
              </button>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
