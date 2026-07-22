import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: "¿Por qué elegir a Sinergia Agencia Creativa en lugar de una plantilla común?",
      answer: "Las plantillas comunes de WordPress o constructores visuales genéricos están sobrecargadas de código innecesario, cargan lento, carecen de optimización SEO y lucen idénticas a miles de webs en internet. En Sinergia Agencia Creativa diseñamos software a medida desde cero, garantizando diseños únicos de alta costura digital, cargas ultrarrápidas bajo el segundo, seguridad absoluta y embudos comerciales integrados directamente."
    },
    {
      question: "¿Cómo funciona la automatización comercial de WhatsApp?",
      answer: "Conectamos tu línea comercial mediante la API oficial de WhatsApp en la nube a un motor conversacional automatizado. El bot comprende el contexto de las consultas complejas, ofrece cotizaciones estimadas preliminares, recopila datos clave, responde preguntas frecuentes y agenda citas de forma autónoma, actualizando tu CRM en piloto automático."
    },
    {
      question: "¿Qué tecnologías utilizan en el desarrollo de páginas web y software?",
      answer: "Nos especializamos en el ecosistema Javascript y tecnologías ágiles modernas de vanguardia: React, Node.js, Express, TailwindCSS y TypeScript. Esto asegura el rendimiento óptimo del servidor, adaptabilidad responsive extrema y escalabilidad inmediata para cualquier volumen de tráfico."
    },
    {
      question: "¿El hosting y el dominio están incluidos en los servicios?",
      answer: "Sí, todos nuestros desarrollos premium e implementaciones llave en mano incluyen 3 meses de hosting corporativo de alta velocidad en servidores cloud redundantes con SSL certificado gratuito, configuración de dominios corporativos (.com, .net, etc.) y correos corporativos en suites colaborativas profesionales sin costes adicionales."
    },
    {
      question: "¿Cómo es el proceso de soporte y mantenimiento tras el lanzamiento?",
      answer: "Una vez completado el despliegue del software, entregamos un manual de autogestión y te brindamos soporte técnico prioritario dedicado por el periodo acordado en tu plan. El panel autoadministrable te permite editar contenidos de manera intuitiva sin requerir de programadores para tareas diarias."
    }
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-gray-50 dark:bg-transparent transition-colors relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Soporte & Dudas
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-4">
            Preguntas Frecuentes
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full"></div>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden shadow-sm transition-all"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#051a1b]/40 transition-colors"
                >
                  <span className="font-heading font-extrabold text-base sm:text-lg text-gray-900 dark:text-gray-100 flex items-center gap-3">
                    <HelpCircle size={18} className="text-primary dark:text-secondary shrink-0" />
                    {faq.question}
                  </span>
                  
                  {/* Rotating Arrow Indicator */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>

                {/* Accordion Answer Content (Animated height) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed border-t border-gray-50 dark:border-gray-800/40 pl-12">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
