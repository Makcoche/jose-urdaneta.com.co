import { motion } from "motion/react";
import { ArrowUpRight, ChevronRight, Laptop, Tablet, Smartphone, Sparkles } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden gradient-bg px-6"
    >
      {/* Decorative background grids & gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-[40%] right-[30%] w-60 h-60 rounded-full bg-primary/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Copy / Content Side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left"
        >
          {/* Tagline Badge */}
          <motion.div variants={itemVariants} className="inline-flex self-center lg:self-start items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary dark:text-secondary font-mono text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles size={12} className="text-secondary" />
            <span>Agencia Digital Premium</span>
          </motion.div>

          {/* Giant Header */}
          <motion.h1
            variants={itemVariants}
            className="font-display font-extrabold text-4xl sm:text-5xl xl:text-6xl tracking-tight text-black dark:text-white leading-tight mb-6"
          >
            Creamos páginas <br />
            <span className="text-primary dark:text-secondary relative inline-block">
              web que venden
              <span className="absolute -bottom-2 left-0 w-full h-[6px] bg-secondary/30 rounded-full"></span>
            </span>
            .
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl font-light leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10"
          >
            Transformamos negocios tradicionales en marcas digitales mediante diseño web, automatización de WhatsApp e inteligencia artificial.
          </motion.p>

          {/* Call-to-actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <a
              href="#contacto"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-white font-semibold text-base hover:bg-opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-primary/25"
            >
              Solicitar Cotización
              <ChevronRight size={18} />
            </a>
            <a
              href="#portafolio"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-transparent border-2 border-gray-200 dark:border-gray-800 text-black dark:text-white font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-900 transition-all text-center flex items-center justify-center gap-2"
            >
              Ver Portafolio
              <ArrowUpRight size={18} />
            </a>
          </motion.div>

          {/* High-profile Trust indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-900 grid grid-cols-3 gap-6 text-center lg:text-left"
          >
            <div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-primary dark:text-secondary">+350</div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Proyectos</div>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-primary dark:text-secondary">+900</div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Clientes</div>
            </div>
            <div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-primary dark:text-secondary">98%</div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Satisfacción</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Showcase Side (Laptop, Tablet, Mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="lg:col-span-6 relative flex items-center justify-center h-[350px] sm:h-[450px] lg:h-[500px]"
        >
          {/* Device Mockup Wrapper */}
          <div className="relative w-full h-full max-w-lg flex items-center justify-center">
            
            {/* 1. LAPTOP MOCKUP (Background Center) */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute w-[80%] aspect-[1.6] bg-slate-900 dark:bg-black rounded-xl p-2 shadow-2xl border border-gray-700/50 z-10 flex flex-col overflow-hidden"
            >
              {/* Screen Header */}
              <div className="flex items-center gap-1.5 pb-1.5 px-1 border-b border-gray-800">
                <span className="w-2 h-2 rounded-full bg-red-500/80"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-500/80"></span>
                <span className="w-2 h-2 rounded-full bg-green-500/80"></span>
                <span className="text-[8px] font-mono text-gray-500 ml-2">joseurdaneta.com/preview</span>
              </div>
              
              {/* Screen Content - Mock Website Dashboard */}
              <div className="flex-1 bg-neutral-950 p-2 flex flex-col justify-between relative">
                <div className="flex justify-between items-center pb-2 border-b border-gray-900">
                  <span className="text-[10px] font-bold text-white tracking-wide font-display">URDANETA AI</span>
                  <span className="text-[7px] px-2 py-0.5 rounded-full bg-primary/20 text-secondary border border-secondary/30 font-mono">CORE V5.1</span>
                </div>
                
                {/* Simulated charts/metrics on screen */}
                <div className="grid grid-cols-3 gap-2 my-2">
                  <div className="bg-neutral-900 rounded p-1.5 border border-gray-900">
                    <span className="text-[6px] text-gray-500 block uppercase">Conversion</span>
                    <span className="text-[10px] font-extrabold text-green-400 font-mono">+18.4%</span>
                  </div>
                  <div className="bg-neutral-900 rounded p-1.5 border border-gray-900">
                    <span className="text-[6px] text-gray-500 block uppercase">Chats Activos</span>
                    <span className="text-[10px] font-extrabold text-primary font-mono">1,402</span>
                  </div>
                  <div className="bg-neutral-900 rounded p-1.5 border border-gray-900">
                    <span className="text-[6px] text-gray-500 block uppercase">Ventas Directas</span>
                    <span className="text-[10px] font-extrabold text-secondary font-mono">$12,850</span>
                  </div>
                </div>

                {/* Animated progress bar mockups */}
                <div className="bg-neutral-900 rounded p-2 border border-gray-900 flex-1 flex flex-col justify-center">
                  <div className="h-1 w-[80%] bg-primary rounded-full mb-1"></div>
                  <div className="h-1 w-[40%] bg-secondary rounded-full"></div>
                  <div className="mt-2 text-[6px] text-gray-500 font-mono">Sincronizando WhatsApp & CRM...</div>
                </div>

                <div className="absolute right-2 bottom-2 p-1 bg-secondary rounded text-black text-[7px] font-bold flex items-center gap-1 animate-pulse">
                  <Laptop size={8} /> Active Server
                </div>
              </div>
            </motion.div>

            {/* 2. TABLET MOCKUP (Overlapping Left) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute left-[-5%] bottom-[10%] w-[38%] aspect-[0.7] bg-slate-800 dark:bg-black rounded-lg p-1.5 shadow-2xl border border-gray-700/50 z-20 flex flex-col overflow-hidden"
            >
              <div className="flex-1 bg-neutral-900 p-1.5 rounded flex flex-col justify-between">
                <div className="flex justify-between items-center mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                  <div className="h-1 w-8 bg-gray-800 rounded"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-700"></div>
                </div>

                {/* Simulated Content Card on Tablet */}
                <div className="flex-1 flex flex-col justify-start">
                  <div className="aspect-[1.5] bg-primary/20 rounded relative mb-1.5 flex items-center justify-center border border-primary/20 overflow-hidden">
                    <Tablet size={24} className="text-primary" />
                    <span className="absolute bottom-1 right-1 text-[5px] text-gray-400 font-mono">UI KIT</span>
                  </div>
                  <div className="h-1.5 w-[90%] bg-gray-800 rounded mb-1"></div>
                  <div className="h-1.5 w-[70%] bg-gray-800 rounded mb-1"></div>
                  <div className="h-1.5 w-[40%] bg-gray-800 rounded"></div>
                </div>

                <span className="text-[6px] font-bold text-primary font-mono tracking-widest mt-2">UX RESEARCH</span>
              </div>
            </motion.div>

            {/* 3. SMARTPHONE MOCKUP (Overlapping Right Front) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
              className="absolute right-[0%] bottom-[5%] w-[24%] aspect-[0.5] bg-slate-900 dark:bg-black rounded-xl p-1.5 shadow-2xl border border-gray-700/50 z-30 flex flex-col overflow-hidden"
            >
              {/* Dynamic Island style header */}
              <div className="flex justify-center pb-1">
                <div className="w-6 h-1.5 bg-black rounded-full border border-gray-800"></div>
              </div>
              
              <div className="flex-1 bg-neutral-950 p-1.5 rounded flex flex-col justify-between">
                <div className="flex items-center gap-1 border-b border-gray-900 pb-1">
                  <span className="w-1 h-1 rounded-full bg-green-500"></span>
                  <span className="text-[5px] text-gray-400 font-mono font-bold leading-none">WhatsApp Bot</span>
                </div>

                {/* Automated chat message items */}
                <div className="flex-1 flex flex-col gap-1 justify-center my-1.5">
                  <div className="self-start bg-neutral-900 rounded-sm p-1 text-[4.5px] max-w-[85%] text-gray-300">
                    Quiero una cotización de web e-commerce por favor.
                  </div>
                  <div className="self-end bg-primary/30 rounded-sm p-1 text-[4.5px] max-w-[85%] text-secondary border border-secondary/10">
                    ¡Por supuesto! Analizando requerimientos y presupuesto... 🤖⚡
                  </div>
                </div>

                <div className="h-2 rounded bg-neutral-900 border border-gray-900 flex items-center px-1">
                  <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse mr-1"></div>
                  <span className="text-[4px] text-gray-500 font-mono">IA pensando respuestas...</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Glass Accent Particles */}
            <div className="absolute top-10 right-10 z-40 p-2 glass-card rounded-lg flex items-center gap-1 text-[10px] text-black dark:text-white font-mono shadow-xl border border-white/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              98ms load-time
            </div>

            <div className="absolute left-[10%] top-[70%] z-40 p-2 glass-card rounded-lg flex items-center gap-1.5 text-[10px] text-black dark:text-white font-mono shadow-xl border border-white/20">
              <Smartphone size={10} className="text-primary" />
              100% Mobile Ready
            </div>
            
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
