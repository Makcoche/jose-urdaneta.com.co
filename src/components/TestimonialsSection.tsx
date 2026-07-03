import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slider setup
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds interval
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <section id="testimonios" className="py-24 px-6 bg-gray-50 dark:bg-transparent transition-colors relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute left-10 bottom-10 text-primary/[0.03] dark:text-primary/[0.05] pointer-events-none">
        <Quote size={200} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-primary dark:text-secondary uppercase">
            Opiniones de Clientes
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-black dark:text-white leading-tight mt-3 mb-4">
            Lo que dicen nuestros socios comerciales
          </h2>
          <div className="w-16 h-1 bg-primary dark:bg-secondary mx-auto rounded-full"></div>
        </div>

        {/* Testimonials Slider Area */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.4 }}
              className="text-center px-4 sm:px-12 flex flex-col items-center"
            >
              
              {/* Star Rating Panel */}
              <div className="flex items-center gap-1 text-[#F4B400] mb-6">
                {[...Array(current.stars)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" className="text-secondary" />
                ))}
              </div>

              {/* Client Review Content Quote */}
              <blockquote className="text-gray-700 dark:text-gray-200 font-light text-base sm:text-lg md:text-xl leading-relaxed italic mb-8 max-w-2xl">
                “{current.content}”
              </blockquote>

              {/* Client Bio Section */}
              <div className="flex items-center gap-4 text-left">
                <img
                  src={current.avatar}
                  alt={current.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary dark:border-secondary"
                />
                <div>
                  <h4 className="font-heading font-extrabold text-base text-black dark:text-white">
                    {current.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono">
                    {current.role} — <span className="text-primary dark:text-secondary">{current.company}</span>
                  </p>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

        {/* Carousel Controls Panel */}
        <div className="flex items-center justify-center gap-6 mt-12">
          {/* Arrow Left */}
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black hover:border-transparent text-gray-600 dark:text-gray-300 transition-all active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Indicators dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-6 bg-primary dark:bg-secondary"
                    : "bg-gray-300 dark:bg-neutral-800"
                }`}
              ></button>
            ))}
          </div>

          {/* Arrow Right */}
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-black hover:border-transparent text-gray-600 dark:text-gray-300 transition-all active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
