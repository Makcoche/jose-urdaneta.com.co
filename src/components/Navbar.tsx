import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon, Lock, ArrowRight } from "lucide-react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openAdmin: () => void;
}

export default function Navbar({ darkMode, setDarkMode, openAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Servicios", href: "#servicios" },
    { name: "Portafolio", href: "#portafolio" },
    { name: "Proceso", href: "#proceso" },
    { name: "Planes", href: "#planes" },
    { name: "Blog", href: "#blog" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 glass-panel shadow-md backdrop-blur-xl"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Elegant Logo */}
        <a href="#inicio" className="flex flex-col select-none group">
          <span className="font-display font-bold text-xl tracking-wider text-black dark:text-white flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 bg-primary rounded-xs transform rotate-45 group-hover:rotate-180 group-hover:bg-secondary transition-all duration-500"></span>
            JOSE URDANETA
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-primary dark:text-secondary font-semibold uppercase leading-none mt-0.5">
            DISEÑO WEB • AUTOMATIZACIÓN
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary transition-colors relative group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary dark:bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Utility Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            title="Cambiar tema"
          >
            {darkMode ? <Sun size={18} className="text-secondary" /> : <Moon size={18} className="text-primary" />}
          </button>

          {/* Secure Admin Button */}
          <button
            onClick={openAdmin}
            className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1.5"
            title="Panel de Administración"
          >
            <Lock size={16} className="text-primary dark:text-secondary" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider hidden xl:inline">ADMIN</span>
          </button>

          {/* Quote CTA Button */}
          <a
            href="#contacto"
            className="px-5 py-2.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group shadow-lg shadow-primary/20"
          >
            Solicitar Cotización
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Dark Mode Switch on Mobile */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {darkMode ? <Sun size={18} className="text-secondary" /> : <Moon size={18} className="text-primary" />}
          </button>

          {/* Lock icon on mobile */}
          <button
            onClick={openAdmin}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            <Lock size={18} className="text-primary dark:text-secondary" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full text-black dark:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-panel border-b border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-secondary transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-2"></div>
              <a
                href="#contacto"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-6 py-3 rounded-full bg-primary text-white font-medium text-sm flex items-center justify-center gap-2"
              >
                Solicitar Cotización
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
