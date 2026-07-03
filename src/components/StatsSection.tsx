import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Trophy, Users, Award, Smile } from "lucide-react";

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stats = [
    {
      id: "proyectos",
      icon: Trophy,
      label: "Proyectos Entregados",
      target: 350,
      suffix: "+",
    },
    {
      id: "clientes",
      icon: Users,
      label: "Clientes Felices",
      target: 900,
      suffix: "+",
    },
    {
      id: "anos",
      icon: Award,
      label: "Años de Experiencia",
      target: 15,
      suffix: "+",
    },
    {
      id: "satisfaccion",
      icon: Smile,
      label: "Satisfacción Cliente",
      target: 98,
      suffix: "%",
    },
  ];

  return (
    <section ref={containerRef} className="py-20 px-6 bg-white dark:bg-transparent transition-colors relative border-y border-gray-100 dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="flex flex-col items-center text-center p-6 glass-card rounded-2xl relative">
                
                {/* Floating graphic accent */}
                <div className="absolute top-4 right-4 text-primary/10 dark:text-secondary/10">
                  <IconComponent size={44} />
                </div>

                {/* Animated Number Counter wrapper */}
                <div className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-primary dark:text-secondary mb-3">
                  <Counter target={stat.target} startTrigger={isInView} />
                  <span>{stat.suffix}</span>
                </div>

                {/* Label details */}
                <span className="text-gray-400 font-mono text-[10px] uppercase tracking-widest block mb-2">
                  Metas Alcanzadas
                </span>
                <span className="font-heading font-extrabold text-sm sm:text-base text-gray-800 dark:text-gray-200">
                  {stat.label}
                </span>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Micro Counter component to animate digits
function Counter({ target, startTrigger }: { target: number; startTrigger: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startTrigger) return;

    let start = 0;
    const end = target;
    const duration = 2000; // 2 seconds animation
    const incrementTime = Math.max(Math.floor(duration / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, startTrigger]);

  return <span>{count}</span>;
}
