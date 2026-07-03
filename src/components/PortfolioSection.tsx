import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, X, Briefcase, Award, Cpu, User } from "lucide-react";
import { Project } from "../types";

interface PortfolioSectionProps {
  projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portafolio" className="py-24 px-6 bg-white dark:bg-transparent transition-colors relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
              Casos de Éxito
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-4">
              Diseño de clase mundial, resultados tangibles
            </h2>
            <div className="w-16 h-1 bg-primary dark:bg-secondary rounded-full"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-light text-base max-w-md">
            Explora una selección exclusiva de productos digitales creados para marcas que se niegan a aceptar lo convencional.
          </p>
        </div>

        {/* Projects Grid (Behance Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container with zoom */}
              <div className="aspect-[1.5] overflow-hidden relative">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Tech Badges on Card Overlay */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-10">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-black/75 text-white backdrop-blur-md"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-primary text-white backdrop-blur-md">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                {/* Dark Hover Overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Text details */}
              <div className="p-6 flex justify-between items-center bg-white dark:bg-[#051a1b]/60 border-t dark:border-white/5">
                <div>
                  <span className="text-xs font-mono text-primary dark:text-secondary font-bold uppercase tracking-wider block mb-1">
                    {project.client}
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-black dark:text-white group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {project.title}
                  </h3>
                </div>
                
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-300 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-secondary dark:group-hover:text-black transition-all duration-300">
                  <ExternalLink size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Behance-Style Modal Lightbox */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              
              {/* Dark backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              ></motion.div>

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl relative z-10 border border-gray-100 dark:border-gray-800"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 hover:bg-black/25 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Cover Image */}
                <div className="aspect-[1.8] w-full relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                    <div>
                      <span className="text-xs font-mono text-secondary font-bold tracking-widest uppercase block mb-1">
                        Proyecto Destacado
                      </span>
                      <h3 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
                        {selectedProject.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8">
                  
                  {/* Left Column: Description & Result */}
                  <div className="md:col-span-8 space-y-6">
                    <div>
                      <h4 className="font-heading font-extrabold text-lg text-black dark:text-white flex items-center gap-2 mb-3">
                        <Briefcase size={18} className="text-primary dark:text-secondary" />
                        Descripción del Proyecto
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 font-light text-base leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-primary/5 dark:bg-primary/15 border border-primary/10">
                      <h4 className="font-heading font-extrabold text-lg text-primary dark:text-secondary flex items-center gap-2 mb-3">
                        <Award size={18} />
                        Impacto & Resultados
                      </h4>
                      <p className="text-gray-800 dark:text-gray-200 font-medium text-base">
                        {selectedProject.result}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Metadata & Action */}
                  <div className="md:col-span-4 space-y-6">
                    <div className="border-l-2 border-primary dark:border-secondary pl-4 py-1 space-y-4">
                      
                      {/* Cliente */}
                      <div>
                        <span className="text-xs text-gray-400 font-mono uppercase block">Cliente</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-1.5 mt-0.5">
                          <User size={14} className="text-primary dark:text-secondary" />
                          {selectedProject.client}
                        </span>
                      </div>

                      {/* Tecnologías */}
                      <div>
                        <span className="text-xs text-gray-400 font-mono uppercase block mb-2">Tecnologías</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-mono px-2 py-1 rounded bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Visit Site Button */}
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-full bg-primary text-white font-semibold text-center flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <ExternalLink size={16} />
                      Ver Proyecto Activo
                    </a>
                  </div>

                </div>
              </motion.div>

            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
