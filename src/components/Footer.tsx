import { motion } from "motion/react";
import { Instagram, Facebook, Youtube, Linkedin, ArrowUp, Send, Heart } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-50 dark:bg-transparent transition-colors border-t border-gray-100 dark:border-white/5 py-16 px-6 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <a href="#inicio" className="flex flex-col select-none group">
            <span className="font-display font-bold text-xl tracking-wider text-black dark:text-white flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 bg-primary rounded-xs transform rotate-45 group-hover:rotate-180 transition-all duration-500"></span>
              JOSE URDANETA
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] text-primary dark:text-secondary font-semibold uppercase leading-none mt-0.5">
              DISEÑO WEB • AUTOMATIZACIÓN
            </span>
          </a>
          <p className="text-gray-500 dark:text-gray-400 font-light text-sm max-w-sm leading-relaxed">
            Creamos marcas digitales de clase mundial, integrando diseño disruptivo, chatbots de inteligencia artificial y automatizaciones comerciales de alta gama.
          </p>
          
          {/* Social Platforms Row */}
          <div className="flex items-center gap-3 pt-2">
            {[
              { icon: Instagram, href: "https://instagram.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
              { icon: Facebook, href: "https://facebook.com" },
              { icon: Youtube, href: "https://youtube.com" }
            ].map((social, idx) => {
              const IconComp = social.icon;
              return (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary dark:hover:text-secondary hover:border-primary dark:hover:border-secondary flex items-center justify-center transition-all"
                >
                  <IconComp size={15} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-heading font-extrabold text-sm text-black dark:text-white uppercase tracking-wider font-mono">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-light">
            <li><a href="#inicio" className="hover:text-primary dark:hover:text-secondary transition-colors">Inicio</a></li>
            <li><a href="#servicios" className="hover:text-primary dark:hover:text-secondary transition-colors">Servicios</a></li>
            <li><a href="#portafolio" className="hover:text-primary dark:hover:text-secondary transition-colors">Portafolio</a></li>
            <li><a href="#proceso" className="hover:text-primary dark:hover:text-secondary transition-colors">Proceso comercial</a></li>
            <li><a href="#planes" className="hover:text-primary dark:hover:text-secondary transition-colors">Nuestros Planes</a></li>
          </ul>
        </div>

        {/* Legal/Resources Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-heading font-extrabold text-sm text-black dark:text-white uppercase tracking-wider font-mono">
            Información & Legal
          </h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400 font-light">
            <li><a href="#blog" className="hover:text-primary dark:hover:text-secondary transition-colors">Blog & Noticias</a></li>
            <li><a href="#faq" className="hover:text-primary dark:hover:text-secondary transition-colors">Preguntas Frecuentes</a></li>
            <li><span className="cursor-not-allowed opacity-50">Términos de Servicio</span></li>
            <li><span className="cursor-not-allowed opacity-50">Políticas de Privacidad</span></li>
          </ul>
        </div>

        {/* Back to top Column */}
        <div className="md:col-span-1 flex justify-end">
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md"
            title="Volver Arriba"
          >
            <ArrowUp size={18} />
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto h-[1px] bg-gray-100 dark:bg-neutral-800 my-10"></div>

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 font-mono gap-4">
        <div>
          <span>© 2026 JOSE URDANETA. Todos los derechos reservados.</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Hecho con</span>
          <Heart size={10} className="text-red-500 animate-pulse fill-red-500" />
          <span>para el Mundo Corporativo Internacional.</span>
        </div>
      </div>
    </footer>
  );
}
