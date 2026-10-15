import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp, Calendar, Sparkles } from 'lucide-react';

interface FloatingButtonsProps {
  currentPage?: string;
  onOpenCounsellingModal: () => void;
  onOpenJoinModal: () => void;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  currentPage,
  onOpenCounsellingModal,
  onOpenJoinModal,
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStudentOrAdmin = currentPage === 'student-portal' || currentPage === 'admin';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white border border-[#C8A45D]/60 text-[#8A651E] hover:bg-[#C8A45D] hover:text-black shadow-lg flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Join Mentorship Pill */}
      {!isStudentOrAdmin && (
        <button
          onClick={onOpenJoinModal}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full gold-gradient-bg text-black text-xs font-montserrat font-bold shadow-lg hover:brightness-110 transition-all transform hover:-translate-x-1 cursor-pointer group uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
          <span>Join Mentorship</span>
        </button>
      )}

      {/* Book Counselling Pill */}
      {!isStudentOrAdmin && (
        <button
          onClick={onOpenCounsellingModal}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#C8A45D]/60 text-[#0F0F0F] text-xs font-montserrat font-semibold shadow-lg hover:border-[#C8A45D] hover:bg-[#FAF8F5] transition-all transform hover:-translate-x-1 cursor-pointer group"
        >
          <Calendar className="w-4 h-4 text-[#8A651E] group-hover:rotate-12 transition-transform" />
          <span>Free Session</span>
        </button>
      )}

      {/* WhatsApp Floating Button - Hidden on student portal per directive */}
      {!isStudentOrAdmin && (
        <a
          href="https://wa.me/919284084523?text=Hi%20Harkiran!%20I%20want%20to%20know%20more%20about%20HK%20Code%20of%20Rankers%20CS%20Mentorship"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-900/50 font-montserrat font-bold text-xs transition-all transform hover:scale-105 cursor-pointer group"
          aria-label="WhatsApp Us"
        >
          <MessageCircle className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">WhatsApp Mentorship Desk</span>
          <span className="sm:hidden">WhatsApp</span>
        </a>
      )}
    </div>
  );
};
