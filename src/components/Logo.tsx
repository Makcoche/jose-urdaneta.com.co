import React from "react";
import officialLogoImg from "../assets/images/sinergia_official_logo_1784756544650.jpg";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showSubtitle = true, className = "" }: LogoProps) {
  const iconSizeClass =
    size === "sm"
      ? "w-8 h-8"
      : size === "lg"
      ? "w-12 h-12"
      : "w-10 h-10";

  const titleSizeClass =
    size === "sm"
      ? "text-sm sm:text-base"
      : size === "lg"
      ? "text-xl sm:text-2xl"
      : "text-base sm:text-lg";

  const subtitleSizeClass =
    size === "sm"
      ? "text-[8px]"
      : size === "lg"
      ? "text-[10px]"
      : "text-[9px]";

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* High-DPI Retina Logo Image Container with luxury border frame */}
      <div className={`relative ${iconSizeClass} shrink-0 rounded-xl overflow-hidden p-[1.5px] bg-gradient-to-br from-[#0B4632] via-[#2DD4BF] to-[#D09A1E] shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300`}>
        <img
          src={officialLogoImg}
          alt="Sinergia Agencia Creativa Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[10px] bg-white dark:bg-neutral-900"
          style={{ imageRendering: "-webkit-optimize-contrast" }}
        />
      </div>

      {/* Brand Name & Subtitle */}
      <div className="flex flex-col">
        <span className={`font-display font-extrabold tracking-wider text-[#0B4632] dark:text-white flex items-center gap-1.5 ${titleSizeClass} leading-tight group-hover:text-primary dark:group-hover:text-secondary transition-colors`}>
          SINERGIA
        </span>
        {showSubtitle && (
          <span className={`font-mono tracking-[0.22em] text-[#D09A1E] dark:text-secondary font-bold uppercase leading-none mt-0.5 ${subtitleSizeClass}`}>
            AGENCIA CREATIVA
          </span>
        )}
      </div>
    </div>
  );
}

