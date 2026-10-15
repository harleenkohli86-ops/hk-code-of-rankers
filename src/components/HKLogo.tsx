import React from 'react';
import hdLogoImg from '../assets/images/hk_hd_logo_1789259112912.jpg';

interface HKLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const HKLogo: React.FC<HKLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-36 sm:h-36',
  };

  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
      <div
        className={`relative rounded-full ${sizeClasses[size]} shrink-0 p-[2px] bg-gradient-to-tr from-[#C8A45D] via-[#FFE3A0] to-[#8A651E] shadow-md group-hover:scale-105 group-hover:shadow-[0_4px_24px_rgba(200,164,93,0.6)] transition-all duration-300`}
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Full HD Crystal Clear Logo Emblem */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#FAF7F0] flex items-center justify-center">
          <img
            src={hdLogoImg}
            alt="HK Code of Rankers Logo"
            className="w-full h-full object-cover rounded-full select-none scale-[1.12] transform-gpu drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
            loading="eager"
            decoding="sync"
            referrerPolicy="no-referrer"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col justify-center items-start">
          <div className="flex items-center gap-1.5">
            <span className="font-cinzel text-xl md:text-2xl font-black text-[#0F0F0F] tracking-wider leading-none">
              HK
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] shadow-sm" />
          </div>

          {/* Luxury Metallic Golden Badge with Shimmer Sweep & Ranker Star */}
          <div className="mt-1 relative overflow-hidden rounded-md bg-gradient-to-r from-[#FFF0C3] via-[#D8B25C] to-[#AA8221] p-[1px] shadow-[0_2px_10px_rgba(200,164,93,0.3)] group-hover:shadow-[0_4px_14px_rgba(200,164,93,0.5)] transition-all duration-300">
            <div className="relative flex items-center justify-center px-2.5 py-0.5 rounded-[5px] bg-gradient-to-r from-[#FFEFA6] via-[#E2BA62] to-[#C8A45D] text-black">
              <span className="text-[9px] md:text-[11px] font-montserrat font-black tracking-[0.2em] text-[#0F0F0F] uppercase block whitespace-nowrap drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                CODE OF RANKERS
              </span>
              
              {/* Continuous Light Beam Sweep Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-gold-shimmer pointer-events-none" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



