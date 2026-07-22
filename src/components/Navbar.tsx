import { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sun, Moon, Lock, ArrowRight } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openAdmin: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ darkMode, setDarkMode, openAdmin, activePage, onNavigate }: NavbarProps) {
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
    { name: "Inicio", id: "inicio" },
    { name: "Servicios", id: "servicios" },
    { name: "Portafolio", id: "portafolio" },
    { name: "Proceso", id: "proceso" },
    { name: "Academia", id: "academia" },
    { name: "Planes", id: "planes" },
    { name: "Blog", id: "blog" },
    { name: "Contacto", id: "contacto" },
  ];

  const handleLinkClick = (id: string, e: MouseEvent) => {
    e.preventDefault();
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 glass-panel shadow-md backdrop-blur-xl"
          : "py-5 sm:py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Elegant Logo with clear right separation to avoid colliding with Inicio */}
        <div className="flex items-center shrink-0 mr-6 lg:mr-12 xl:mr-16">
          <a href="#inicio" onClick={(e) => handleLinkClick("inicio", e)} className="shrink-0">
            <Logo size="md" />
          </a>
          {/* Subtle Vertical Divider between Logo and Navigation */}
          <div className="hidden lg:block h-6 w-[1px] bg-gray-200/80 dark:bg-gray-800 ml-6 xl:ml-10 shrink-0"></div>
        </div>

        {/* Desktop Links with generous breathing room */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-9">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(link.id, e)}
                className={`text-xs xl:text-sm font-semibold transition-colors relative group py-1 ${
                  isActive
                    ? "text-primary dark:text-secondary font-extrabold"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-secondary"
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-primary dark:bg-secondary transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </a>
            );
          })}
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
            onClick={(e) => handleLinkClick("contacto", e)}
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
                  href={`#${link.id}`}
                  onClick={(e) => handleLinkClick(link.id, e)}
                  className={`text-base font-semibold transition-colors ${
                    activePage === link.id
                      ? "text-primary dark:text-secondary font-extrabold"
                      : "text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-secondary"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-2"></div>
              <a
                href="#contacto"
                onClick={(e) => handleLinkClick("contacto", e)}
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
