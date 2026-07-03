import { motion } from "motion/react";
import { Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface PlanesSectionProps {
  onSelectPlan: (planName: string) => void;
}

export default function PlanesSection({ onSelectPlan }: PlanesSectionProps) {
  const plans = [
    {
      name: "Landing Page",
      price: "$799",
      description: "Diseñada exclusivamente para campañas de marketing de alto rendimiento y captación masiva de leads.",
      features: [
        "Diseño Premium personalizado",
        "Estructura orientada a conversión (CRO)",
        "Integración de Formulario & WhatsApp",
        "Optimización de velocidad (A+ Performance)",
        "SEO Técnico básico",
        "1 Mes de soporte & hosting incluido"
      ],
      popular: false,
      cta: "Solicitar Cotización",
      accent: "border-gray-100 dark:border-gray-800"
    },
    {
      name: "Página Corporativa",
      price: "$1,499",
      description: "La solución definitiva para marcas consolidadas que exigen transmitir autoridad, elegancia e innovación.",
      features: [
        "Estructura Multi-sección (hasta 6 páginas)",
        "Panel de administración integrado (CMS)",
        "Automatización de WhatsApp & Calendly",
        "SEO avanzado en motores de búsqueda",
        "Diseño UX/UI interactivo a medida",
        "Análisis de analíticas & KPIs integrados",
        "3 Meses de hosting premium incluido"
      ],
      popular: true,
      cta: "Plan Más Elegido",
      accent: "border-primary dark:border-secondary shadow-lg shadow-primary/10"
    },
    {
      name: "Tienda Virtual",
      price: "$2,499",
      description: "Plataforma de comercio electrónico de alto nivel, robusta y escalable para automatizar tus ventas 24/7.",
      features: [
        "E-commerce robusto autoadministrable",
        "Panel de control para inventario y pedidos",
        "Integración de pasarelas de pago (Stripe/PayPal)",
        "Asistente chatbot de IA (Gemini integrado)",
        "Embudo de Checkout optimizado sin fricciones",
        "Emails transaccionales automáticos",
        "3 Meses de soporte premium total"
      ],
      popular: false,
      cta: "Solicitar Cotización",
      accent: "border-gray-100 dark:border-gray-800"
    }
  ];

  return (
    <section id="planes" className="py-24 px-6 bg-white dark:bg-transparent transition-colors relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Inversión Inteligente
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-5">
            Planes a la medida de tu marca
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full mb-5"></div>
          <p className="text-gray-600 dark:text-gray-400 font-light text-base">
            Ofrecemos transparencia total y soluciones enfocadas al retorno de inversión rápida. Selecciona el pilar ideal para el estado actual de tu negocio.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`glass-card rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden border ${plan.accent} ${
                plan.popular ? "scale-105 z-10" : "scale-100"
              }`}
            >
              {/* Popular Flag */}
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-primary dark:bg-secondary text-white dark:text-black px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                  <Zap size={8} /> Popular
                </div>
              )}

              <div>
                {/* Plan Name */}
                <h3 className="font-heading font-extrabold text-2xl text-black dark:text-white mb-2">
                  {plan.name}
                </h3>
                
                {/* Description */}
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Price tag */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-display font-black text-primary dark:text-secondary">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-xs font-mono">USD / Pago Único</span>
                </div>

                <div className="h-[1px] bg-gray-100 dark:bg-neutral-800 mb-8"></div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 font-light">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={12} />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-opacity-95 shadow-xl shadow-primary/20"
                    : "bg-transparent border border-gray-200 dark:border-gray-800 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-900"
                }`}
              >
                <span>{plan.cta}</span>
                <ArrowRight size={14} />
              </button>

            </motion.div>
          ))}
        </div>

        {/* Security / Quality guarantee banner */}
        <div className="mt-16 p-6 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-center gap-4 border border-gray-100 dark:border-gray-800 text-center sm:text-left">
          <ShieldCheck size={32} className="text-primary dark:text-secondary shrink-0" />
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-light max-w-xl">
            Todos nuestros desarrollos incluyen auditoría de seguridad SSL certificada, optimización completa de bases de datos, código fuente transferido bajo licencia exclusiva y soporte técnico premium garantizado.
          </p>
        </div>

      </div>
    </section>
  );
}
