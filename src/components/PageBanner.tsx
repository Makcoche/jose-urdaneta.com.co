import { ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronRight, Sparkles } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
}

interface ActionBtn {
  text: string;
  onClick: () => void;
  primary?: boolean;
}

interface PageBannerProps {
  title: string;
  subtitle: string;
  badge?: string;
  icon?: ReactNode;
  stats?: StatItem[];
  actionBtn?: ActionBtn;
  secondaryActionBtn?: ActionBtn;
  onNavigateHome?: () => void;
}

export default function PageBanner({
  title,
  subtitle,
  badge = "Sinergia Agencia Creativa",
  icon,
  stats,
  actionBtn,
  secondaryActionBtn,
  onNavigateHome
}: PageBannerProps) {
  return (
    <div className="relative pt-28 pb-12 sm:pb-16 px-6 overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/15 dark:via-transparent dark:to-transparent border-b border-gray-100 dark:border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-primary/15 dark:bg-secondary/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-48 h-48 bg-secondary/10 blur-[90px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Breadcrumb / Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs font-mono text-gray-500 hover:text-primary dark:hover:text-secondary transition-colors cursor-pointer"
          >
            Inicio
          </button>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 dark:bg-secondary/10 border border-primary/20 dark:border-secondary/20 text-primary dark:text-secondary text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm">
            {icon || <Sparkles size={11} />}
            {badge}
          </span>
        </div>

        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-black dark:text-white tracking-tight mb-4 max-w-4xl mx-auto leading-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-6"
        >
          {subtitle}
        </motion.p>

        {/* Action Buttons if provided */}
        {(actionBtn || secondaryActionBtn) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            {actionBtn && (
              <button
                type="button"
                onClick={actionBtn.onClick}
                className="px-7 py-3 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-primary/25 cursor-pointer hover:scale-105 active:scale-95"
              >
                {actionBtn.text}
              </button>
            )}
            {secondaryActionBtn && (
              <button
                type="button"
                onClick={secondaryActionBtn.onClick}
                className="px-7 py-3 rounded-full bg-white dark:bg-black/60 text-black dark:text-white border border-gray-200 dark:border-gray-800 font-bold text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                {secondaryActionBtn.text}
              </button>
            )}
          </motion.div>
        )}

        {/* Stats Row if provided */}
        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="pt-6 border-t border-gray-200/50 dark:border-white/10 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-center"
          >
            {stats.map((st, i) => {
              const len = st.value.length;
              const fontCls =
                len > 14
                  ? "text-xs sm:text-sm font-bold"
                  : len > 10
                  ? "text-sm sm:text-base font-extrabold"
                  : len > 7
                  ? "text-base sm:text-lg font-black"
                  : "text-xl sm:text-2xl font-black";

              return (
                <div
                  key={i}
                  className="px-4 py-3.5 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 backdrop-blur-sm flex-1 min-w-[140px] sm:min-w-[175px] max-w-[240px] shadow-sm hover:border-primary/30 transition-all flex flex-col justify-center items-center"
                >
                  <span
                    className={`font-display text-primary dark:text-secondary block mb-1 text-center tracking-tight leading-tight ${fontCls}`}
                  >
                    {st.value}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-gray-600 dark:text-gray-400 uppercase tracking-wider block font-semibold leading-tight text-center">
                    {st.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

