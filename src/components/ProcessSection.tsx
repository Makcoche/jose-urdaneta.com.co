import { motion } from "motion/react";
import { Search, PenTool, Code2, Gauge, Rocket } from "lucide-react";

export default function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Investigación",
      subtitle: "Comprensión & Estrategia",
      description: "Analizamos tu mercado, estudiamos tu competencia directa y definimos los objetivos clave de conversión y experiencia de usuario.",
      icon: Search,
      color: "from-[#0E5A5E]/20 to-[#0E5A5E]/10"
    },
    {
      number: "02",
      title: "Diseño",
      subtitle: "UI/UX & Prototipado",
      description: "Creamos interfaces personalizadas en Figma que comunican valor y lujo. Diseñamos flujos interactivos de alta conversión sin fricciones.",
      icon: PenTool,
      color: "from-[#F4B400]/20 to-[#F4B400]/5"
    },
    {
      number: "03",
      title: "Desarrollo",
      subtitle: "Código Limpio & Robusto",
      description: "Programamos la web con tecnologías modernas (React, Express, TailwindCSS) asegurando código modular, escalable e inmune a fallos.",
      icon: Code2,
      color: "from-[#0E5A5E]/20 to-[#0E5A5E]/10"
    },
    {
      number: "04",
      title: "Optimización",
      subtitle: "Velocidad & SEO Técnico",
      description: "Realizamos auditorías de rendimiento extremo para cargar en menos de un segundo y optimizamos la arquitectura de datos para indexar en Google.",
      icon: Gauge,
      color: "from-[#F4B400]/20 to-[#F4B400]/5"
    },
    {
      number: "05",
      title: "Lanzamiento",
      subtitle: "Despliegue & Producción",
      description: "Desplegamos tu sitio web en contenedores Cloud redundantes de alta disponibilidad, conectando dominios, SSL y analíticas avanzadas.",
      icon: Rocket,
      color: "from-[#0E5A5E]/20 to-[#0E5A5E]/10"
    }
  ];

  return (
    <section id="proceso" className="py-24 px-6 bg-gray-50 dark:bg-transparent transition-colors relative overflow-hidden">
      {/* Visual background lines */}
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-gray-200 dark:bg-white/10 hidden lg:block"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Metodología
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-5">
            Nuestro Proceso de Trabajo
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full mb-5"></div>
          <p className="text-gray-600 dark:text-gray-300 font-light text-base">
            Garantizamos resultados sobresalientes mediante un flujo ordenado y milimétricamente planificado de cinco fases clave.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="space-y-12 lg:space-y-0 lg:relative">
          
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={step.number} className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 relative">
                
                {/* Horizontal connection line on desktop */}
                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-8 h-[2px] bg-primary dark:bg-secondary hidden lg:block z-0"
                  style={{ left: isEven ? '50%' : 'calc(50% - 32px)' }}
                ></div>

                {/* Left Side (Shows details for Even, empty space or spacer for Odd) */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-3 lg:text-right'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="glass-card rounded-2xl p-8 relative hover:border-primary/50 dark:hover:border-secondary/50"
                  >
                    {/* Floating Glow Indicator */}
                    <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-1.5 h-full rounded-r bg-gradient-to-b from-primary to-secondary`}></div>

                    <div className={`flex flex-col ${isEven ? 'items-start' : 'items-start lg:items-end'}`}>
                      <span className="text-sm font-mono text-primary dark:text-secondary font-bold uppercase tracking-wider mb-1">
                        {step.subtitle}
                      </span>
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-black dark:text-white mb-4">
                        {step.number}. {step.title}
                      </h3>
                      <p className={`text-gray-600 dark:text-gray-300 font-light text-sm leading-relaxed ${!isEven && 'lg:text-right'}`}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Center Badge (Step number & icon) */}
                <div className="lg:col-span-2 flex justify-center lg:order-2 relative z-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} border-2 border-primary dark:border-secondary text-primary dark:text-secondary flex items-center justify-center shadow-lg relative`}
                  >
                    <IconComponent size={22} />
                  </motion.div>
                </div>

                {/* Right Side (Spacer/Opposite structure to layout column nicely) */}
                <div className={`lg:col-span-5 hidden lg:block ${isEven ? 'lg:order-3' : 'lg:order-1'}`}></div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
