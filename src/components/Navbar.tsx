import React, { useState, useEffect } from 'react';
import { HKLogo } from './HKLogo';
import { PageId } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  User,
  Award,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  MessageSquare,
  FileText,
  Search,
  HelpCircle,
  ShoppingBag,
  Percent,
  Phone,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenJoinModal: () => void;
  onOpenCounsellingModal: () => void;
  onOpenSystemGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenJoinModal,
  onOpenCounsellingModal,
  onOpenSystemGuide,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, openAuthModal } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<'about' | 'programs' | 'resources' | 'user' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setDropdownOpen(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Unique Top Announcement Ribbon */}
      <div className="bg-[#0A0A0A] text-[#FFE3A0] border-b border-[#C8A45D]/40 text-[11px] font-montserrat py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C8A45D] text-black font-extrabold text-[10px] uppercase tracking-wider">
              <Percent className="w-3 h-3" />
              5% OFF MENTORSHIP
            </span>
            <span className="text-[#E0E0E0]">
              1st 10 got their offers! Next: Use code <strong className="text-[#FFE3A0] font-mono underline">NEXT5</strong> for 5% OFF on Mentorship • Answersheet Analysis Report at ₹699/subject
            </span>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider uppercase">
            {onOpenSystemGuide && (
              <button
                onClick={onOpenSystemGuide}
                className="text-[#FFE3A0] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer bg-white/10 px-2.5 py-1 rounded-md border border-[#C8A45D]/40"
              >
                <Sparkles className="w-3 h-3 text-[#FFE3A0]" />
                <span>Student Guide &amp; Infographic</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F6F2] py-2.5 border-b border-[#C8A45D]/50 shadow-lg shadow-[#C8A45D]/10'
            : 'bg-[#F8F6F2]/95 backdrop-blur-md py-3.5 border-b border-[#C8A45D]/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo with Sleek Interface Branding */}
            <button
              onClick={() => handleNavClick('home')}
              className="text-left focus:outline-none cursor-pointer group flex items-center gap-3"
            >
              <HKLogo size="md" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 uppercase text-xs tracking-widest font-semibold">
              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen('about')}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-full ${
                    ['about-hk', 'founder', 'vision-mission', 'why-choose'].includes(currentPage)
                      ? 'text-black font-extrabold bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] shadow-sm'
                      : 'text-[#1C1917] hover:text-[#8A651E] hover:bg-[#C8A45D]/10'
                  }`}
                >
                  About HK <ChevronDown className="w-3.5 h-3.5 text-[#C8A45D]" />
                </button>

                {dropdownOpen === 'about' && (
                  <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="py-2 bg-white border border-[#C8A45D]/50 rounded-lg shadow-2xl backdrop-blur-xl">
                      <button
                        onClick={() => handleNavClick('about-hk')}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center gap-2.5 cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-[#C8A45D]" /> About HK Code of Rankers
                      </button>
                      <button
                        onClick={() => handleNavClick('founder')}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center gap-2.5 cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#C8A45D]" /> Meet Founder Harkiran Kaur
                      </button>
                      <button
                        onClick={() => handleNavClick('vision-mission')}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center gap-2.5 cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#C8A45D]" /> Our Vision & Mission
                      </button>
                      <button
                        onClick={() => handleNavClick('why-choose')}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center gap-2.5 cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                      >
                        <Award className="w-4 h-4 text-[#C8A45D]" /> Why Choose HK
                      </button>
                    </div>
                  </div>
                )}
              </div>

            {/* Programs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen('programs')}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <button
                onClick={() => handleNavClick('programs')}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-full ${
                  ['programs', 'cseet', 'cs-executive', 'cs-professional', 'test-series'].includes(currentPage)
                    ? 'text-black font-extrabold bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] shadow-sm'
                    : 'text-[#1C1917] hover:text-[#8A651E] hover:bg-[#C8A45D]/10'
                }`}
              >
                Programs &amp; Pricing <ChevronDown className="w-3.5 h-3.5 text-[#C8A45D]" />
              </button>

              {dropdownOpen === 'programs' && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="py-2 bg-white border border-[#C8A45D]/50 rounded-lg shadow-2xl backdrop-blur-xl">
                    <button
                      onClick={() => handleNavClick('programs')}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer border-b border-[#C8A45D]/20"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> All Programs &amp; Pricing
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#C8A45D]/20 text-[#8A651E] rounded font-bold">Directory</span>
                    </button>
                    <button
                      onClick={() => {
                        sessionStorage.setItem('hk_programs_tab', 'june2027');
                        handleNavClick('programs');
                        window.dispatchEvent(new CustomEvent('switch-programs-tab', { detail: 'june2027' }));
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent hover:bg-amber-500/25 flex items-center justify-between cursor-pointer font-bold border-l-2 border-[#C8A45D] transition-colors"
                    >
                      <span className="flex items-center gap-2 text-[#7A5816]">
                        <Sparkles className="w-4 h-4 text-[#C8A45D] fill-[#C8A45D]" />
                        <span>2027 Batches (CSEET Feb • Exec & Prof June)</span>
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-[#C8A45D] text-black rounded font-black uppercase shadow-xs">
                        50% OFF
                      </span>
                    </button>
                    <button
                      onClick={() => handleNavClick('programs')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span className="flex items-center gap-2 font-bold text-amber-900">
                        <BookOpen className="w-4 h-4 text-[#C8A45D]" /> HK StudyTrack Pro Index
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-amber-500/15 text-amber-800 rounded font-bold">₹699+</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('cseet')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span>CSEET Mentorship</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-800 rounded font-bold">Active</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('cs-executive')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span>CS Executive (Mod 1 &amp; 2)</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#C8A45D]/25 text-[#8A651E] rounded font-bold">Popular</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('cs-professional')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span>CS Professional</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#C8A45D]/25 text-[#8A651E] rounded font-bold">Available</span>
                    </button>
                    <button
                      onClick={() => handleNavClick('test-series')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-t border-[#C8A45D]/20 border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span>Test Series &amp; Copy Audit</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-800 rounded font-bold">Active</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Resources & Content Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen('resources')}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded-full ${
                  ['resources', 'blog', 'contact'].includes(currentPage)
                    ? 'text-black font-extrabold bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] shadow-sm'
                    : 'text-[#1C1917] hover:text-[#8A651E] hover:bg-[#C8A45D]/10'
                }`}
              >
                <span>Resources</span>
                <span className="text-[9px] px-2 py-0.5 bg-amber-500/20 text-[#8A651E] border border-[#C8A45D]/40 rounded-full font-bold normal-case tracking-normal">
                  Launching Soon
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#C8A45D]" />
              </button>

              {dropdownOpen === 'resources' && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="py-2 bg-white border border-[#C8A45D]/50 rounded-lg shadow-2xl backdrop-blur-xl">
                    <button
                      onClick={() => handleNavClick('resources')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#C8A45D]" /> Free Notes & Amendments
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/15 text-amber-800 rounded font-bold">
                        Launching Soon
                      </span>
                    </button>
                    <button
                      onClick={() => handleNavClick('test-series')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#C8A45D]" /> Test Series (All 3 Levels)
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/15 text-emerald-800 rounded font-bold">
                        Available
                      </span>
                    </button>
                    <button
                      onClick={() => handleNavClick('blog')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center justify-between cursor-pointer font-medium border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#C8A45D]" /> Strategy Articles & Blog
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/15 text-amber-800 rounded font-bold">
                        Launching Soon
                      </span>
                    </button>
                    <button
                      onClick={() => handleNavClick('contact')}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#2D2D2D] hover:text-[#8A651E] hover:bg-[#F8F6F2] flex items-center gap-2.5 cursor-pointer font-medium border-t border-[#C8A45D]/20 border-l-2 border-transparent hover:border-[#C8A45D] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#C8A45D]" /> Direct Contact Desk
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Single Elegant FAQ Tab */}
            <button
              onClick={() => handleNavClick('faq')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs uppercase tracking-widest font-semibold rounded-full transition-all cursor-pointer ${
                currentPage === 'faq'
                  ? 'text-black font-extrabold bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] shadow-sm'
                  : 'text-[#1C1917] hover:text-[#8A651E] hover:bg-[#C8A45D]/10'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#8A651E]" />
              <span>FAQs</span>
            </button>
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Student Portal Button */}
            <button
              onClick={() => {
                if (user) {
                  onNavigate('student-portal');
                } else {
                  openAuthModal('login');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-montserrat font-bold rounded-full transition-all cursor-pointer border ${
                currentPage === 'student-portal'
                  ? 'bg-black text-[#FFE3A0] border-[#C8A45D] shadow-md ring-2 ring-[#C8A45D]/40'
                  : user
                  ? 'bg-[#C8A45D]/15 text-[#6B4E15] hover:bg-[#C8A45D]/25 border-[#C8A45D]/60'
                  : 'bg-white hover:bg-gray-100 text-[#1C1917] border-gray-300 shadow-sm'
              }`}
              title="Access Enrolled Courses, Tax Invoices & Launches"
            >
              <GraduationCap className="w-4 h-4 text-[#8A651E]" />
              <span>{user ? `Portal (${user.fullName.split(' ')[0]})` : 'Student Portal'}</span>
            </button>

            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-800 hover:text-black hover:bg-[#C8A45D]/10 rounded-full transition-all cursor-pointer border border-[#C8A45D]/40"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#8A651E]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-montserrat font-black text-[10px] rounded-full flex items-center justify-center border border-black shadow-sm animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions Header Bar */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-800 bg-white border border-[#C8A45D]/40 rounded-lg"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#8A651E]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8A45D] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-800 hover:text-black focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-[#C8A45D]/30 px-4 pt-3 pb-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            {/* Top Student Portal Banner Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (user) {
                  onNavigate('student-portal');
                } else {
                  openAuthModal('login');
                }
              }}
              className="w-full py-2.5 px-3.5 bg-gradient-to-r from-[#FFE3A0]/30 via-[#C8A45D]/25 to-[#DFB96E]/30 border border-[#C8A45D]/60 rounded-xl text-xs font-bold text-[#6B4E15] flex items-center justify-between shadow-sm cursor-pointer mb-2"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#8A651E]" />
                <span>{user ? `Student Portal (${user.fullName})` : 'Student Portal / Login'}</span>
              </div>
              <span className="text-[10px] uppercase font-extrabold text-black bg-[#C8A45D] px-2 py-0.5 rounded-full">
                Open
              </span>
            </button>

            <div className="pt-1 pb-1">
              <span className="text-[10px] font-semibold text-[#8A651E] uppercase tracking-widest px-3">
                About HK
              </span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleNavClick('about-hk')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  About HK Platform
                </button>
                <button
                  onClick={() => handleNavClick('founder')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  Founder Harkiran Kaur
                </button>
                <button
                  onClick={() => handleNavClick('vision-mission')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  Vision & Mission
                </button>
                <button
                  onClick={() => handleNavClick('why-choose')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  Why Choose HK
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2 my-1">
              <span className="text-[10px] font-semibold text-[#8A651E] uppercase tracking-widest px-3">
                Programs & Courses
              </span>
              <div className="mt-1 mb-2 px-1">
                <button
                  onClick={() => {
                    sessionStorage.setItem('hk_programs_tab', 'june2027');
                    handleNavClick('programs');
                    window.dispatchEvent(new CustomEvent('switch-programs-tab', { detail: 'june2027' }));
                  }}
                  className="w-full text-left px-3 py-2 bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-[#C8A45D]/50 rounded-lg text-amber-950 text-xs font-extrabold flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A45D] fill-[#C8A45D]" />
                    <span>2027 Batches (Feb &amp; June)</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#C8A45D] text-black font-black rounded uppercase">
                    50% OFF
                  </span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <button
                  onClick={() => handleNavClick('programs')}
                  className="text-left px-3 py-2 text-xs text-[#8A651E] font-medium"
                >
                  All Programs
                </button>
                <button
                  onClick={() => handleNavClick('cseet')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  CSEET Batch
                </button>
                <button
                  onClick={() => handleNavClick('cs-executive')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  CS Executive
                </button>
                <button
                  onClick={() => handleNavClick('cs-professional')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  CS Professional
                </button>
                <button
                  onClick={() => handleNavClick('test-series')}
                  className="text-left px-3 py-2 text-xs text-gray-700 hover:text-[#8A651E]"
                >
                  Answersheet Analysis Report
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-2 my-1">
              <span className="text-[10px] font-semibold text-[#8A651E] uppercase tracking-widest px-3">
                Guidance &amp; Support
              </span>
              <div className="grid grid-cols-1 gap-2 mt-1">
                {onOpenSystemGuide && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSystemGuide();
                    }}
                    className="text-left px-3 py-2 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" /> Student Workflow &amp; Infographic Guide
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('faq')}
                    className="text-left px-3 py-2 bg-white text-[#1C1917] border border-[#C8A45D]/50 rounded-lg text-xs font-bold flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#8A651E]" /> FAQs &amp; Help
                  </button>
                  <button
                    onClick={() => handleNavClick('contact')}
                    className="text-left px-3 py-2 bg-white text-[#8A651E] border border-[#C8A45D]/40 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C8A45D]" /> Contact Desk
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 border-t border-gray-200 pt-2 text-xs text-gray-700">
              <button onClick={() => handleNavClick('resources')} className="text-left py-1.5 px-3 hover:text-[#8A651E] flex items-center justify-between">
                <span>Free Notes</span>
                <span className="text-[9px] px-1 bg-amber-500/15 text-amber-800 rounded font-bold">Soon</span>
              </button>
              <button onClick={() => handleNavClick('test-series')} className="text-left py-1.5 px-3 hover:text-[#8A651E] flex items-center justify-between">
                <span>Test Series (3 Levels)</span>
                <span className="text-[9px] px-1 bg-emerald-500/15 text-emerald-800 rounded font-bold">Available</span>
              </button>
              <button onClick={() => handleNavClick('blog')} className="text-left py-1.5 px-3 hover:text-[#8A651E] flex items-center justify-between">
                <span>Articles & Blog</span>
                <span className="text-[9px] px-1 bg-amber-500/15 text-amber-800 rounded font-bold">Soon</span>
              </button>
              <button onClick={() => handleNavClick('contact')} className="text-left py-1.5 px-3 hover:text-[#8A651E]">
                Contact Info
              </button>
            </div>

            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) {
                    onNavigate('student-portal');
                  } else {
                    openAuthModal('login');
                  }
                }}
                className="w-full py-2.5 text-xs font-montserrat font-bold text-white bg-black hover:bg-neutral-900 border border-[#C8A45D] rounded-lg text-center uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#C8A45D]" />
                <span>{user ? `Student Portal (${user.fullName.split(' ')[0]})` : 'Student Portal Login / Register'}</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoinModal();
                }}
                className="w-full py-3 text-xs font-montserrat font-bold text-black gold-gradient-bg rounded-lg text-center uppercase tracking-wider shadow-md cursor-pointer"
              >
                Join 25-Seat Mentorship Batch
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCounsellingModal();
                }}
                className="w-full py-2.5 text-xs font-montserrat font-semibold text-gray-800 bg-white border border-[#C8A45D]/50 rounded-lg text-center"
              >
                Book Free Counselling Session
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
