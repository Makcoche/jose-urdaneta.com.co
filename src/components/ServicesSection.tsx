import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import { Service } from "../types";

interface ServicesSectionProps {
  services: Service[];
}

// Icon mapper helper
const IconHelper = ({ name, size = 24, className = "" }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Globe size={size} className={className} />;
  return <IconComponent size={size} className={className} />;
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const categories = ["Todos", "Desarrollo", "Diseño", "Automatizacion", "Marketing", "Soporte"];

  const filteredServices = selectedCategory === "Todos"
    ? services
    : services.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "todos": return "Todos";
      case "desarrollo": return "Desarrollo & Software";
      case "diseno": return "Diseño UX/UI & Branding";
      case "automatizacion": return "Automatización e IA";
      case "marketing": return "Marketing & Tráfico";
      case "soporte": return "Cloud & Soporte";
      default: return cat;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="servicios" className="py-24 px-6 bg-gray-50 dark:bg-neutral-950 transition-colors relative">
      {/* Decorative Blur Background Element */}
      <div className="absolute right-0 top-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Nuestras Soluciones
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-6">
            Servicios Digitales de Extremo a Extremo
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 dark:text-gray-300 font-light text-base sm:text-lg">
            No somos implementadores ordinarios. Integramos diseño disruptivo con sistemas inteligentes y automatización avanzada para multiplicar la eficiencia y el volumen de conversión de tu marca.
          </p>
        </div>

        {/* Categories Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-primary/40 dark:hover:border-secondary/40"
              }`}
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>

        {/* Services Grid with Framer Motion AnimatePresence */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-8 hover:scale-[1.02] cursor-pointer flex flex-col justify-between group h-full relative overflow-hidden"
              >
                {/* Glowing border accent on hover */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div>
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-secondary group-hover:bg-primary group-hover:text-white dark:group-hover:bg-secondary dark:group-hover:text-black transition-all duration-300 mb-6">
                    <IconHelper name={service.icon} />
                  </div>

                  {/* Service Title */}
                  <h3 className="font-heading font-bold text-xl text-black dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-secondary transition-colors">
                    {service.name}
                  </h3>

                  {/* Service Description */}
                  <p className="text-gray-600 dark:text-gray-300 font-light text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Arrow indicator */}
                <div className="flex items-center gap-1 text-xs font-mono font-bold tracking-wider text-primary dark:text-secondary mt-auto group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>SABER MÁS</span>
                  <Icons.ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
