import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import founderImg from '../assets/images/regenerated_image_1785612225656.jpg';
import { ShoppingBag, ArrowRight, CheckCircle2, Sparkles, Check, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate?: (page: any) => void;
  instructorName?: string;
  badgeLabel?: string;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  instructorName = 'By Harkiran Kaur (CS & Mentor)',
  badgeLabel,
  className = '',
}) => {
  const { addToCart, buyNow } = useCart();
  const { hasPurchased } = useAuth();
  const [addedToast, setAddedToast] = useState(false);

  const isEnrolled = hasPurchased(product.id);

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Get top 2-3 feature bullets for header banner
  const bannerBullets =
    product.features && product.features.length > 0
      ? product.features.slice(0, 3)
      : [
          'Daily Target Schedules & Routine Mapping',
          'Line-by-Line Answer Sheet Evaluation',
          '1-on-1 Mentor Strategy Calls',
        ];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    buyNow(product);
  };

  const tagLabel =
    badgeLabel ||
    (product.type === 'mentorship'
      ? 'Mentorship'
      : product.type === 'test-series'
      ? 'Test Series'
      : product.type === 'combo'
      ? 'All-In-One Combo'
      : 'Program Batch');

  // Customize header gradient according to level
  const headerBgClass =
    product.level === 'cseet'
      ? 'from-[#0B2B1D] via-[#103826] to-[#0F0F0F]'
      : product.level === 'g1'
      ? 'from-[#2C1D05] via-[#1E170A] to-[#0F0F0F]'
      : product.level === 'g2'
      ? 'from-[#0A1E38] via-[#112440] to-[#0F0F0F]'
      : product.level === 'both'
      ? 'from-[#1A1303] via-[#2A1E06] to-[#0F0F0F]'
      : 'from-[#1E0F28] via-[#130B1C] to-[#0F0F0F]';

  const is2027Program =
    product.id.includes('2027') ||
    product.name.includes('2027') ||
    (badgeLabel && badgeLabel.includes('2027')) ||
    (product.badge && product.badge.includes('2027'));

  const headerTagLabel = is2027Program
    ? product.level === 'cseet'
      ? 'CSEET Feb 2027'
      : product.level === 'g1'
      ? 'CS Exec June 2027'
      : product.level === 'g2'
      ? 'CS Exec June 2027'
      : product.level === 'both'
      ? (product.id.includes('prof') ? 'CS Prof June 2027' : 'CS Exec June 2027')
      : 'CS Prof June 2027'
    : product.level === 'cseet'
    ? 'CSEET 2026 ICSI'
    : product.level === 'g1'
    ? 'CS Exec G1 ICSI'
    : product.level === 'g2'
    ? 'CS Exec G2 ICSI'
    : product.level === 'both'
    ? 'AIR Ranker Batch'
    : 'Professional Pass';

  return (
    <div
      className={`bg-white border border-gray-200/80 hover:border-[#C8A45D] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative ${className}`}
    >
      {/* Toast Notification when added to cart */}
      {addedToast && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30 bg-emerald-700 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5" /> Added to Cart!
        </div>
      )}

      <div>
        {/* HEADER AREA BANNER */}
        <div className={`w-full h-36 sm:h-40 bg-gradient-to-r ${headerBgClass} relative p-3 sm:p-4 flex items-center justify-between overflow-hidden`}>
          {/* Subtle Golden Backdrop Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C8A45D]/25 via-transparent to-transparent pointer-events-none" />

          {/* Ribbon Tag Top Right */}
          <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 text-white font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded-full shadow-md tracking-wider border border-white/20 flex items-center gap-1 animate-pulse">
            <Zap className="w-2.5 h-2.5 fill-white" />
            <span>{is2027Program ? '2027 Batch' : '2026 Batch'}</span>
          </div>

          {/* Banner Left Side: Bulleted Features */}
          <div className="flex-1 pr-3 z-10 space-y-1.5">
            <div className="inline-flex items-center gap-1 text-[9px] font-bold text-[#FFE3A0] uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md border border-[#C8A45D]/30">
              <Sparkles className="w-2.5 h-2.5 text-[#FFE3A0]" />
              <span>{headerTagLabel}</span>
            </div>
            <ul className="space-y-1 text-white">
              {bannerBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] font-medium leading-tight text-gray-200">
                  <span className="text-[#FFE3A0] font-bold shrink-0 mt-0.5">✓</span>
                  <span className="line-clamp-2">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Banner Right Side: Mentor Portrait Photo */}
          <div className="relative shrink-0 z-10 self-end sm:self-center">
            <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 border-[#C8A45D] shadow-lg bg-[#0F0F0F] relative group-hover:scale-105 transition-transform duration-300">
              <img
                src={founderImg}
                alt="Harkiran Kaur"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent py-0.5 px-1 text-center">
                <span className="text-[8px] font-bold text-[#FFE3A0] tracking-wider uppercase block">
                  Harkiran Kaur
                </span>
                <span className="text-[7px] text-gray-300 block -mt-0.5">Head Mentor</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT METADATA SECTION */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Pill-shaped Tag */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-[#8A651E] border border-[#C8A45D]/40 text-[10px] font-extrabold uppercase tracking-wider">
              {tagLabel}
            </span>
            {product.badge && (
              <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Course Title - Flexible font size to prevent any truncation or ellipsis */}
          <h3 className="font-cinzel font-extrabold text-[#0F0F0F] text-xs sm:text-sm md:text-base leading-tight min-h-[2.5rem] group-hover:text-[#8A651E] transition-colors">
            {product.name}
          </h3>

          {/* Subtext: Instructor Name */}
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45D]"></span>
            <span>{instructorName}</span>
          </p>

          {/* Short Description */}
          <p className="text-xs text-gray-600 font-poppins leading-relaxed">
            {product.description}
          </p>

          {/* Pricing Row */}
          <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-cinzel text-2xl font-black text-[#0F0F0F]">
                ₹{product.price.toLocaleString('en-IN')}/-
              </span>
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            {discountPercent > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTION ROW */}
      <div className="p-4 sm:p-5 pt-0 mt-auto">
        {isEnrolled ? (
          <button
            onClick={() => onNavigate && onNavigate('forum')}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-montserrat font-extrabold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enrolled • Join Aspirant Forum</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* Left side: Square button with shopping bag icon */}
            <button
              onClick={handleAddToCart}
              title="Add to Cart"
              className="w-11 h-11 bg-gray-100 hover:bg-[#FFE3A0]/30 active:scale-95 text-[#0F0F0F] hover:text-[#8A651E] border border-gray-300 hover:border-[#C8A45D] rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
            >
              <ShoppingBag className="w-5 h-5 text-[#0F0F0F]" />
            </button>

            {/* Right side: Pill-shaped CTA button with solid yellow background */}
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-4 bg-[#FFD700] hover:bg-[#FFE033] active:scale-95 text-black font-montserrat font-extrabold text-xs sm:text-sm rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg uppercase tracking-wider"
            >
              <span>Join Batch</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
