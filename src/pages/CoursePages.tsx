import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { AnswersheetSubjectModal } from '../components/Modals';
import { TestSeriesProgramSelector } from '../components/TestSeriesProgramSelector';
import { HKStudyTrackProSelector } from '../components/HKStudyTrackProSelector';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  FileCheck,
  ShieldAlert,
  Award,
  HelpCircle,
  BarChart3,
  UserCheck,
  Zap,
  Target,
  ChevronRight,
  FileText,
  Star,
  Layers,
  PhoneCall,
  Check,
  CheckSquare,
  BadgeCheck,
  ShoppingBag,
  Compass,
  Users,
  MessageSquareText,
  Percent,
  Download,
  Calendar,
  TrendingUp,
} from 'lucide-react';

interface PageProps {
  onNavigate: (page: PageId) => void;
  onOpenJoinModal: () => void;
  onOpenCounsellingModal: () => void;
}

export const ProgramsPage: React.FC<PageProps> = ({
  onNavigate,
  onOpenJoinModal,
  onOpenCounsellingModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'june2027' | 'cseet' | 'executive' | 'professional' | 'counselling' | 'study-track' | 'test-series'>('all');
  const [pricingSession, setPricingSession] = useState<'june2027' | 'current'>('june2027');
  const { addToCart, buyNow } = useCart();
  const { hasPurchased } = useAuth();

  useEffect(() => {
    // Check if session storage requested june2027
    const requested = sessionStorage.getItem('hk_programs_tab');
    if (requested === 'june2027') {
      setActiveTab('june2027');
      setPricingSession('june2027');
      sessionStorage.removeItem('hk_programs_tab');
      setTimeout(() => {
        document.getElementById('programs-selector-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }

    const handleSwitch = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail as any);
        if (customEvent.detail === 'june2027') {
          setPricingSession('june2027');
          setTimeout(() => {
            document.getElementById('programs-selector-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };
    window.addEventListener('switch-programs-tab', handleSwitch);
    return () => window.removeEventListener('switch-programs-tab', handleSwitch);
  }, []);

  const handleSelectJune2027 = () => {
    setActiveTab('june2027');
    setPricingSession('june2027');
    const el = document.getElementById('programs-selector-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  return (
    <div className="w-full pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <div className="w-full text-center space-y-6 max-w-5xl mx-auto px-2 sm:px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFE3A0]/30 via-[#C8A45D]/20 to-[#FFE3A0]/30 border border-[#C8A45D]/60 text-[#7A5816] text-xs font-montserrat font-extrabold tracking-wider uppercase shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
          <span>Exclusive 1-on-1 Mentorship • Strictly 25 Students Per Level</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#0F0F0F] leading-tight">
          Mentorship Crafted for <span className="text-[#8A651E]">Ranker Excellence</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-700 font-poppins max-w-4xl mx-auto leading-relaxed">
          Learn directly under <strong>Harkiran Kaur Kohli (AIR 3 • CS Professional)</strong>. Start with a <strong>100% Free 1-on-1 Guidance Call</strong> (Demo Session) and unlock personalized daily target tracking, answer presentation mastery, and continuous handholding.
        </p>

        {/* Early Bird Highlight Banner */}
        <div className="p-4 bg-gradient-to-r from-[#1A1815] via-[#121110] to-[#1A1815] border border-[#C8A45D]/50 rounded-2xl w-full max-w-4xl mx-auto text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-[#C8A45D]/20 text-[#FFE3A0] flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-montserrat font-extrabold text-[#FFE3A0] block">
                MENTORSHIP OFFER: 1ST 10 GOT THEIR OFFERS!
              </span>
              <span className="text-xs text-gray-300">
                Next offer: <strong>5% OFF on Mentorship</strong> with coupon code <span className="text-[#FFE3A0] font-bold font-mono">NEXT5</span> • Test Series at ₹699/subject
              </span>
            </div>
          </div>
          <span className="px-3.5 py-1.5 bg-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-full uppercase shrink-0">
            Code: NEXT5
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenCounsellingModal}
            className="px-7 py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-full shadow-lg shadow-[#C8A45D]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-black" />
            <span>Book 1st Guidance Call (Free Demo)</span>
          </button>
        </div>
      </div>

      {/* Free Demo Guidance Banner */}
      <div className="bg-gradient-to-br from-[#1C1917] via-[#141210] to-[#0A0A0A] border-2 border-[#C8A45D] rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-56 h-56 bg-[#C8A45D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              100% Free Demo Session
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              1st 1-on-1 Guidance Call with AIR 3 Harkiran Kaur
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 font-poppins leading-relaxed max-w-2xl">
              Experience our mentorship just like a demo lecture. Before you enroll in any paid program, schedule an honest 1-on-1 guidance call to review your current syllabus preparation, daily schedule, and exam roadmap.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" /> 30-Minute In-Depth Call
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" /> Syllabus Readiness Audit
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" /> Zero Obligation / 100% Free
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <button
              onClick={onOpenCounsellingModal}
              className="w-full py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-montserrat font-extrabold text-xs rounded-xl hover:brightness-110 shadow-lg cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-black" />
              <span>Claim Free 1st Guidance Call</span>
            </button>
            <div className="text-center text-[11px] text-[#FFE3A0] font-montserrat">
              ★ Price: <strong className="text-emerald-400">₹0 Free Demo</strong> (Regular: ₹999)
            </div>
          </div>
        </div>
      </div>

      {/* FEBRUARY 2027 Launch Alert Banner */}
      <div className="p-6 bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#12100E] border-2 border-[#C8A45D] rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A45D]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE3A0] to-[#C8A45D] flex items-center justify-center text-black font-extrabold shadow-md shrink-0">
            <Sparkles className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#C8A45D] text-black text-[10px] font-black uppercase rounded tracking-wider">
                2027 BATCHES OPEN
              </span>
              <span className="text-xs text-[#FFE3A0] font-montserrat font-bold">
                Coupons: <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/20">FEB2027</span> (CSEET) &bull; <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/20">JUNE2027</span> (Exec &amp; Prof)
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
              7 New 2027 Mentorship Programs Now Available
            </h3>
            <p className="text-xs text-gray-300 font-poppins mt-0.5 max-w-2xl">
              Comprehensive full-syllabus mentoring with AIR 3 Harkiran Kaur Kohli for CSEET (Feb 2027), CS Executive (June 2027), and CS Professional (June 2027).
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            id="view-june-2027-batches-btn"
            onClick={handleSelectJune2027}
            className="px-6 py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#DFB96E] to-[#C8A45D] hover:from-[#FFEFA6] hover:to-[#DFB96E] text-black font-montserrat font-extrabold text-xs rounded-xl flex items-center gap-2.5 shadow-xl shadow-[#C8A45D]/25 hover:shadow-2xl hover:shadow-[#C8A45D]/40 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer ring-2 ring-[#FFE3A0]/60 ring-offset-2 ring-offset-[#1C1917]"
            title="Explore all 7 2027 Mentorship Batches"
          >
            <Sparkles className="w-4 h-4 text-black fill-black shrink-0" />
            <span>View 7 2027 Batches</span>
            <ArrowRight className="w-4 h-4 text-black shrink-0" />
          </button>
        </div>
      </div>

      {/* Program Selector Tabs */}
      <div id="programs-selector-section" className="space-y-8 scroll-mt-28">
        <div className="text-center space-y-2">
          <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest">
            Level-Wise Mentorship Offerings
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#0F0F0F]">
            Choose Your Level Mentorship Batch
          </h2>
          <p className="text-xs text-gray-600 font-poppins">
            Strictly limited to 25 students per level to maintain supreme 1-on-1 focus.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white border border-[#C8A45D]/40 rounded-full max-w-5xl mx-auto shadow-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                : 'text-gray-700 hover:text-[#8A651E] hover:bg-[#F8F6F2]'
            }`}
          >
            All Programs
          </button>
          <button
            onClick={() => {
              setActiveTab('june2027');
              setPricingSession('june2027');
            }}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'june2027'
                ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border-2 border-[#C8A45D]'
                : 'text-amber-950 bg-amber-500/20 hover:bg-amber-500/30 border-2 border-[#C8A45D]/70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D] fill-[#C8A45D]" />
            <span>2027 Batches (7 Programs)</span>
            <span className="px-1.5 py-0.2 bg-[#C8A45D] text-black text-[9px] font-black rounded uppercase shadow-xs">
              50% OFF
            </span>
          </button>
          <button
            onClick={() => setActiveTab('cseet')}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
              activeTab === 'cseet'
                ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                : 'text-gray-700 hover:text-[#8A651E] hover:bg-[#F8F6F2]'
            }`}
          >
            Level 1: CSEET (Oct 2026)
          </button>
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
              activeTab === 'executive'
                ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                : 'text-gray-700 hover:text-[#8A651E] hover:bg-[#F8F6F2]'
            }`}
          >
            Level 2: CS Executive (Dec 2026)
          </button>
          <button
            onClick={() => setActiveTab('professional')}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
              activeTab === 'professional'
                ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                : 'text-gray-700 hover:text-[#8A651E] hover:bg-[#F8F6F2]'
            }`}
          >
            Level 3: CS Professional (Dec 2026)
          </button>
          <button
            onClick={() => setActiveTab('counselling')}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
              activeTab === 'counselling'
                ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                : 'text-gray-700 hover:text-[#8A651E] hover:bg-[#F8F6F2]'
            }`}
          >
            Career Counselling (After 12th)
          </button>
          <button
            onClick={() => setActiveTab('study-track')}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
              activeTab === 'study-track'
                ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                : 'text-amber-900 hover:text-[#8A651E] hover:bg-[#F8F6F2]'
            }`}
          >
            HK StudyTrack Pro (CS Index)
          </button>
          <button
            onClick={() => setActiveTab('test-series')}
            className={`px-4 py-2 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
              activeTab === 'test-series'
                ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                : 'text-gray-700 hover:text-[#8A651E] hover:bg-[#F8F6F2]'
            }`}
          >
            Test Series &amp; Answersheet Report
          </button>
        </div>

        {/* Content Display: Dedicated Selector for Test Series, HK StudyTrack Pro, vs Grid for Other Programs */}
        {activeTab === 'test-series' ? (
          <div className="space-y-10">
            <TestSeriesProgramSelector onNavigate={onNavigate} />

            {/* Test Series Starting Soon Notice Card */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1C1917] via-[#141210] to-[#0A0A0A] border-2 border-[#C8A45D]/60 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#C8A45D]/20 text-[#FFE3A0] text-[10px] font-bold uppercase rounded-full inline-block">
                    Full Evaluation System
                  </span>
                  <span className="text-xs text-gray-400">All 3 Levels (CSEET, Exec, Prof)</span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">Full Chapter-Wise Test Series</h3>
                <p className="text-xs sm:text-sm text-gray-300 font-poppins max-w-2xl leading-relaxed">
                  Comprehensive evaluated chapter-wise test series with suggested answers, ICSI step-marking schemes, and AIR 3 review comments will be starting soon for all CS modules.
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center shrink-0 w-full md:w-auto">
                <span className="text-xs font-montserrat font-extrabold text-[#FFE3A0] uppercase tracking-wider block">
                  Full Series Starting Soon
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">Currently Enrolling June 2026 Certified Copy Audits</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'study-track' ? (
          <div className="space-y-10">
            {/* Dedicated Portable HK StudyTrack Pro Selector with Futuristic Graphic */}
            <HKStudyTrackProSelector onNavigate={onNavigate} />

            {/* Standalone Product Cards Directory */}
            <div className="border-t border-[#C8A45D]/30 pt-8">
              <div className="text-center space-y-2 mb-8">
                <span className="px-3 py-1 bg-[#C8A45D]/15 text-[#8A651E] text-xs font-bold uppercase rounded-full">
                  Instant Checkout Directory
                </span>
                <h3 className="font-cinzel text-2xl font-bold text-gray-900">
                  All 7 Official HK StudyTrack Pro Packages
                </h3>
                <p className="text-xs text-gray-500 max-w-xl mx-auto">
                  One-time payment • Lifetime access • 100% student-editable within your personal Student Portal
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  product={getProduct('hk-studytrack-cseet')}
                  onNavigate={onNavigate}
                  badgeLabel="CSEET Index • ₹699"
                />
                <ProductCard
                  product={getProduct('hk-studytrack-exec-g1')}
                  onNavigate={onNavigate}
                  badgeLabel="Exec Group 1 • ₹899"
                />
                <ProductCard
                  product={getProduct('hk-studytrack-exec-g2')}
                  onNavigate={onNavigate}
                  badgeLabel="Exec Group 2 • ₹799"
                />
                <ProductCard
                  product={getProduct('hk-studytrack-exec-both')}
                  onNavigate={onNavigate}
                  badgeLabel="Exec Combined (G1+G2) • ₹1,499"
                />
                <ProductCard
                  product={getProduct('hk-studytrack-prof-g1')}
                  onNavigate={onNavigate}
                  badgeLabel="Prof Group 1 • ₹999"
                />
                <ProductCard
                  product={getProduct('hk-studytrack-prof-g2')}
                  onNavigate={onNavigate}
                  badgeLabel="Prof Group 2 • ₹899"
                />
                <ProductCard
                  product={getProduct('hk-studytrack-prof-both')}
                  onNavigate={onNavigate}
                  badgeLabel="Prof Combined • ₹1,699"
                />
              </div>
            </div>
          </div>
        ) : activeTab === 'june2027' ? (
          /* Dedicated February 2027 Mentorship Programs Directory */
          <div className="space-y-8">
            <div className="p-6 bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#12100E] border-2 border-[#C8A45D] rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#C8A45D] text-black text-[10px] font-black uppercase rounded tracking-wider">
                    2027 BATCHES
                  </span>
                  <span className="text-xs text-amber-300 font-montserrat font-bold">
                    Official Launch Special
                  </span>
                </div>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  7 Official 2027 Mentorship Programs
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 font-poppins max-w-2xl leading-relaxed">
                  Start your long-term disciplined preparation with AIR 3 Harkiran Kaur Kohli. Apply coupon code <strong className="text-[#FFE3A0] font-mono">FEB2027</strong> (CSEET) or <strong className="text-[#FFE3A0] font-mono">JUNE2027</strong> (Exec &amp; Prof) at checkout for an extra 5% OFF!
                </p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center shrink-0 w-full md:w-auto">
                <span className="text-xs font-montserrat font-extrabold text-[#FFE3A0] uppercase tracking-wider block">
                  Limited to 25 Students
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">1-on-1 Personalized Mentoring</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCard
                product={getProduct('june2027-cseet')}
                onNavigate={onNavigate}
                badgeLabel="FEB 2027 • ₹3,000"
              />
              <ProductCard
                product={getProduct('june2027-exec-g1')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Exec G1 • ₹3,099"
              />
              <ProductCard
                product={getProduct('june2027-exec-g2')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Exec G2 • ₹2,899"
              />
              <ProductCard
                product={getProduct('june2027-exec-both')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Exec Both • ₹5,000"
              />
              <ProductCard
                product={getProduct('june2027-prof-g1')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Prof G1 • ₹3,499"
              />
              <ProductCard
                product={getProduct('june2027-prof-g2')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Prof G2 • ₹2,999"
              />
              <ProductCard
                product={getProduct('june2027-prof-both')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Prof Both • ₹6,000"
              />
            </div>
          </div>
        ) : (
          /* Dynamic Level Cards Grid for Mentorship & All */
          <div className="space-y-12">
            {/* When All Programs is selected, highlight the February 2027 Batches First */}
            {activeTab === 'all' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C8A45D]/30 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black text-[10px] font-black uppercase rounded tracking-wider">
                        NEW BATCHES
                      </span>
                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gray-900">
                        2027 Mentorship Programs
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-poppins mt-0.5">
                      CSEET (Feb 2027) &bull; CS Executive &amp; Professional (June 2027) • Code <span className="font-mono text-amber-900 font-bold">FEB2027</span> / <span className="font-mono text-amber-900 font-bold">JUNE2027</span> for 5% OFF
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('june2027')}
                    className="text-xs font-montserrat font-bold text-[#8A651E] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>View 2027 Batches Only</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductCard
                    product={getProduct('june2027-cseet')}
                    onNavigate={onNavigate}
                    badgeLabel="FEB 2027 • ₹3,000"
                  />
                  <ProductCard
                    product={getProduct('june2027-exec-g1')}
                    onNavigate={onNavigate}
                    badgeLabel="JUNE 2027 • Exec G1 • ₹3,099"
                  />
                  <ProductCard
                    product={getProduct('june2027-exec-g2')}
                    onNavigate={onNavigate}
                    badgeLabel="JUNE 2027 • Exec G2 • ₹2,899"
                  />
                  <ProductCard
                    product={getProduct('june2027-exec-both')}
                    onNavigate={onNavigate}
                    badgeLabel="JUNE 2027 • Exec Both • ₹5,000"
                  />
                  <ProductCard
                    product={getProduct('june2027-prof-g1')}
                    onNavigate={onNavigate}
                    badgeLabel="JUNE 2027 • Prof G1 • ₹3,499"
                  />
                  <ProductCard
                    product={getProduct('june2027-prof-g2')}
                    onNavigate={onNavigate}
                    badgeLabel="JUNE 2027 • Prof G2 • ₹2,999"
                  />
                  <ProductCard
                    product={getProduct('june2027-prof-both')}
                    onNavigate={onNavigate}
                    badgeLabel="JUNE 2027 • Prof Both • ₹6,000"
                  />
                </div>
              </div>
            )}

            {/* Other Courses & Level-Filtered Cards */}
            <div className="space-y-6">
              {activeTab === 'all' && (
                <div className="border-b border-[#C8A45D]/30 pb-3">
                  <h3 className="font-cinzel text-xl font-bold text-gray-900">
                    Current Batches, Evaluations &amp; Study Tools
                  </h3>
                  <p className="text-xs text-gray-500 font-poppins mt-0.5">
                    October 2026 / December 2026 examination batches and self-study trackers
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* June 2026 Answersheet Analysis Report */}
                {activeTab === 'all' && (
                  <ProductCard
                    product={getProduct('june-2026-answersheet-analysis')}
                    onNavigate={onNavigate}
                    badgeLabel="June 2026 Certified Copy Analysis"
                  />
                )}

                {/* Level 1: CSEET Products */}
                {activeTab === 'cseet' && (
                  <ProductCard
                    product={getProduct('june2027-cseet')}
                    onNavigate={onNavigate}
                    badgeLabel="FEB 2027 Batch • ₹3,000"
                  />
                )}
                {(activeTab === 'all' || activeTab === 'cseet') && (
                  <ProductCard
                    product={getProduct('cseet-mentorship')}
                    onNavigate={onNavigate}
                    badgeLabel="October 2026 Batch • ₹1,199"
                  />
                )}

                {/* Level 2: Executive Products */}
                {activeTab === 'executive' && (
                  <>
                    <ProductCard
                      product={getProduct('june2027-exec-g1')}
                      onNavigate={onNavigate}
                      badgeLabel="JUNE 2027 • Group 1 • ₹3,099"
                    />
                    <ProductCard
                      product={getProduct('june2027-exec-g2')}
                      onNavigate={onNavigate}
                      badgeLabel="JUNE 2027 • Group 2 • ₹2,899"
                    />
                    <ProductCard
                      product={getProduct('june2027-exec-both')}
                      onNavigate={onNavigate}
                      badgeLabel="JUNE 2027 • Both Groups • ₹5,000"
                    />
                  </>
                )}
                {(activeTab === 'all' || activeTab === 'executive') && (
                  <>
                    <ProductCard
                      product={getProduct('exec-g1-mentorship')}
                      onNavigate={onNavigate}
                      badgeLabel="Dec 2026 • Group 1 • ₹1,999"
                    />
                    <ProductCard
                      product={getProduct('exec-g2-mentorship')}
                      onNavigate={onNavigate}
                      badgeLabel="Dec 2026 • Group 2 • ₹1,699"
                    />
                    <ProductCard
                      product={getProduct('exec-both-mentorship')}
                      onNavigate={onNavigate}
                      badgeLabel="Dec 2026 • Both Groups • ₹3,249"
                    />
                  </>
                )}

                {/* Level 3: Professional Products */}
                {activeTab === 'professional' && (
                  <>
                    <ProductCard
                      product={getProduct('june2027-prof-g1')}
                      onNavigate={onNavigate}
                      badgeLabel="JUNE 2027 • Group 1 • ₹3,499"
                    />
                    <ProductCard
                      product={getProduct('june2027-prof-g2')}
                      onNavigate={onNavigate}
                      badgeLabel="JUNE 2027 • Group 2 • ₹2,999"
                    />
                    <ProductCard
                      product={getProduct('june2027-prof-both')}
                      onNavigate={onNavigate}
                      badgeLabel="JUNE 2027 • Both Groups • ₹6,000"
                    />
                  </>
                )}
                {(activeTab === 'all' || activeTab === 'professional') && (
                  <>
                    <ProductCard
                      product={getProduct('prof-g1-mentorship')}
                      onNavigate={onNavigate}
                      badgeLabel="Dec 2026 • Prof Group 1 • ₹2,499"
                    />
                    <ProductCard
                      product={getProduct('prof-g2-mentorship')}
                      onNavigate={onNavigate}
                      badgeLabel="Dec 2026 • Prof Group 2 • ₹1,999"
                    />
                    <ProductCard
                      product={getProduct('prof-both-mentorship')}
                      onNavigate={onNavigate}
                      badgeLabel="Dec 2026 • Prof Both • ₹3,999"
                    />
                  </>
                )}

                {/* Career Roadmap & Counselling */}
                {(activeTab === 'all' || activeTab === 'counselling') && (
                  <ProductCard
                    product={getProduct('career-counselling-12th')}
                    onNavigate={onNavigate}
                    badgeLabel="Career Roadmap (Post 12th)"
                  />
                )}

                {/* HK StudyTrack Pro Cards */}
                {activeTab === 'all' && (
                  <>
                    <ProductCard
                      product={getProduct('hk-studytrack-cseet')}
                      onNavigate={onNavigate}
                      badgeLabel="CSEET Index • ₹699"
                    />
                    <ProductCard
                      product={getProduct('hk-studytrack-exec-g1')}
                      onNavigate={onNavigate}
                      badgeLabel="Exec Group 1 • ₹899"
                    />
                    <ProductCard
                      product={getProduct('hk-studytrack-exec-g2')}
                      onNavigate={onNavigate}
                      badgeLabel="Exec Group 2 • ₹799"
                    />
                    <ProductCard
                      product={getProduct('hk-studytrack-exec-both')}
                      onNavigate={onNavigate}
                      badgeLabel="Exec Combined (G1+G2) • ₹1,499"
                    />
                    <ProductCard
                      product={getProduct('hk-studytrack-prof-g1')}
                      onNavigate={onNavigate}
                      badgeLabel="Prof Group 1 • ₹999"
                    />
                    <ProductCard
                      product={getProduct('hk-studytrack-prof-g2')}
                      onNavigate={onNavigate}
                      badgeLabel="Prof Group 2 • ₹899"
                    />
                    <ProductCard
                      product={getProduct('hk-studytrack-prof-both')}
                      onNavigate={onNavigate}
                      badgeLabel="Prof Combined • ₹1,699"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Pricing & Level Matrix Breakdown */}
      <div className="bg-white border border-[#C8A45D]/40 rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
        <div className="border-b border-[#C8A45D]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest block">
              Official Program Directory
            </span>
            <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">
              Transparent Mentorship Fee Structure
            </h3>
          </div>

          {/* Session Switcher Pill */}
          <div className="flex items-center p-1 bg-[#F8F6F2] border border-[#C8A45D]/50 rounded-full">
            <button
              onClick={() => setPricingSession('june2027')}
              className={`px-4 py-1.5 rounded-full text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                pricingSession === 'june2027'
                  ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-sm border border-[#C8A45D]/60'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#C8A45D]" />
              <span>2027 Batches (Feb &bull; June)</span>
              <span className="px-1.5 py-0.2 bg-[#C8A45D] text-black text-[9px] font-black rounded uppercase">50% Off</span>
            </button>
            <button
              onClick={() => setPricingSession('current')}
              className={`px-4 py-1.5 rounded-full text-xs font-montserrat font-bold transition-all cursor-pointer ${
                pricingSession === 'current'
                  ? 'bg-white text-black shadow-sm border border-gray-300'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span>Current Session (Oct/Dec 2026)</span>
            </button>
          </div>
        </div>

        {/* Pricing Matrix: 2027 vs Current Session */}
        {pricingSession === 'june2027' ? (
          <div className="space-y-6">
            <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-[#C8A45D]/15 to-amber-500/10 border border-[#C8A45D]/40 rounded-2xl flex items-center justify-between gap-3 text-xs text-[#7A5816] font-montserrat">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8A651E]" />
                2027 Launch Offer: Use codes <strong className="font-mono text-black font-extrabold bg-white/80 px-2 py-0.5 rounded border border-[#C8A45D]/40">FEB2027</strong> (CSEET) &amp; <strong className="font-mono text-black font-extrabold bg-white/80 px-2 py-0.5 rounded border border-[#C8A45D]/40">JUNE2027</strong> (Exec &amp; Prof) for extra 5% OFF!
              </span>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
                Limited to 25 Students/Level
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Level 1: CSEET - FEBRUARY 2027 */}
              <div className="p-6 bg-gradient-to-b from-[#FAF8F5] to-white border-2 border-[#C8A45D]/60 rounded-2xl space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-800 text-[10px] font-bold uppercase rounded-md">
                      Level 1 • FEBRUARY 2027
                    </span>
                    <span className="text-[10px] font-montserrat font-bold text-gray-400 line-through">₹6,000</span>
                  </div>
                  <h4 className="font-cinzel text-lg font-bold text-[#0F0F0F]">CSEET Mentorship</h4>
                  <p className="text-xs text-gray-600 font-poppins leading-relaxed">
                    Complete 4-subject guidance, daily micro-targets, syllabus coverage, and motivation calls with AIR 3 Ranker.
                  </p>
                  <div className="pt-2">
                    <span className="text-xs text-gray-500 block">FEBRUARY 2027 Program Fee</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-cinzel text-3xl font-extrabold text-[#8A651E]">₹3,000/-</span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">50% OFF</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                      ★ 1st Guidance Call is 100% Free Demo!
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => buyNow(getProduct('june2027-cseet'))}
                  className="w-full py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:brightness-105 cursor-pointer transition-all"
                >
                  <span>Join February 2027 Batch (₹3,000)</span>
                  <Zap className="w-3.5 h-3.5 fill-black" />
                </button>
              </div>

              {/* Level 2: CS Executive - JUNE 2027 */}
              <div className="p-6 bg-gradient-to-b from-[#FAF8F5] to-white border-2 border-[#C8A45D] rounded-2xl space-y-4 flex flex-col justify-between relative shadow-md">
                <div className="absolute -top-3 right-4 px-3 py-0.5 bg-[#C8A45D] text-black font-montserrat font-extrabold text-[10px] uppercase rounded-full shadow-sm">
                  JUNE 2027 Batch
                </div>
                <div className="space-y-3">
                  <span className="px-2.5 py-1 bg-amber-500/15 text-amber-800 text-[10px] font-bold uppercase rounded-md">
                    Level 2 • JUNE 2027
                  </span>
                  <h4 className="font-cinzel text-lg font-bold text-[#0F0F0F]">CS Executive Mentorship</h4>
                  <ul className="text-xs text-gray-700 space-y-2 pt-1 font-poppins">
                    <li className="flex justify-between border-b border-gray-200 pb-1">
                      <span>Group 1 Only:</span>
                      <span className="space-x-1.5">
                        <span className="text-gray-400 line-through text-[11px]">₹6,999</span>
                        <strong className="text-[#8A651E]">₹3,099/-</strong>
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 pb-1">
                      <span>Group 2 Only:</span>
                      <span className="space-x-1.5">
                        <span className="text-gray-400 line-through text-[11px]">₹6,499</span>
                        <strong className="text-[#8A651E]">₹2,899/-</strong>
                      </span>
                    </li>
                    <li className="flex justify-between font-bold text-black pt-0.5">
                      <span>Both Groups (G1+G2):</span>
                      <span className="space-x-1.5">
                        <span className="text-gray-400 line-through text-[11px]">₹9,999</span>
                        <span className="text-[#8A651E] font-extrabold">₹5,000/-</span>
                      </span>
                    </li>
                  </ul>
                  <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                    Special 50% discount active for June 2027!
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <button
                    onClick={() => buyNow(getProduct('june2027-exec-g1'))}
                    className="py-2 bg-white hover:bg-gray-100 text-[#0F0F0F] border border-[#C8A45D] font-bold text-[11px] rounded-xl text-center cursor-pointer transition-colors"
                  >
                    G1 (₹3,099)
                  </button>
                  <button
                    onClick={() => buyNow(getProduct('june2027-exec-g2'))}
                    className="py-2 bg-white hover:bg-gray-100 text-[#0F0F0F] border border-[#C8A45D] font-bold text-[11px] rounded-xl text-center cursor-pointer transition-colors"
                  >
                    G2 (₹2,899)
                  </button>
                  <button
                    onClick={() => buyNow(getProduct('june2027-exec-both'))}
                    className="py-2 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold text-[11px] rounded-xl text-center cursor-pointer hover:brightness-105 shadow-sm transition-all"
                  >
                    Both (₹5,000)
                  </button>
                </div>
              </div>

              {/* Level 3: CS Professional - JUNE 2027 */}
              <div className="p-6 bg-gradient-to-b from-[#FAF8F5] to-white border-2 border-[#C8A45D]/60 rounded-2xl space-y-4 flex flex-col justify-between shadow-sm">
                <div className="space-y-3">
                  <span className="px-2.5 py-1 bg-purple-500/15 text-purple-800 text-[10px] font-bold uppercase rounded-md">
                    Level 3 • JUNE 2027
                  </span>
                  <h4 className="font-cinzel text-lg font-bold text-[#0F0F0F]">CS Professional Mentorship</h4>
                  <ul className="text-xs text-gray-700 space-y-2 pt-1 font-poppins">
                    <li className="flex justify-between border-b border-gray-200 pb-1">
                      <span>Group 1 Only:</span>
                      <span className="space-x-1.5">
                        <span className="text-gray-400 line-through text-[11px]">₹7,999</span>
                        <strong className="text-[#8A651E]">₹3,499/-</strong>
                      </span>
                    </li>
                    <li className="flex justify-between border-b border-gray-200 pb-1">
                      <span>Group 2 Only:</span>
                      <span className="space-x-1.5">
                        <span className="text-gray-400 line-through text-[11px]">₹6,999</span>
                        <strong className="text-[#8A651E]">₹2,999/-</strong>
                      </span>
                    </li>
                    <li className="flex justify-between font-bold text-black pt-0.5">
                      <span>Both Groups:</span>
                      <span className="space-x-1.5">
                        <span className="text-gray-400 line-through text-[11px]">₹11,999</span>
                        <span className="text-[#8A651E] font-extrabold">₹6,000/-</span>
                      </span>
                    </li>
                  </ul>
                  <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                    Direct mentorship with AIR 3 Harkiran Kaur Kohli for June 2027!
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <button
                    onClick={() => buyNow(getProduct('june2027-prof-g1'))}
                    className="py-2 bg-white hover:bg-gray-100 text-[#0F0F0F] border border-[#C8A45D] font-bold text-[11px] rounded-xl text-center cursor-pointer transition-colors"
                  >
                    G1 (₹3,499)
                  </button>
                  <button
                    onClick={() => buyNow(getProduct('june2027-prof-g2'))}
                    className="py-2 bg-white hover:bg-gray-100 text-[#0F0F0F] border border-[#C8A45D] font-bold text-[11px] rounded-xl text-center cursor-pointer transition-colors"
                  >
                    G2 (₹2,999)
                  </button>
                  <button
                    onClick={() => buyNow(getProduct('june2027-prof-both'))}
                    className="py-2 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold text-[11px] rounded-xl text-center cursor-pointer hover:brightness-105 shadow-sm transition-all"
                  >
                    Both (₹6,000)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level 1: CSEET */}
            <div className="p-6 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-800 text-[10px] font-bold uppercase rounded-md">
                  Level 1 • Oct 2026
                </span>
                <h4 className="font-cinzel text-lg font-bold text-[#0F0F0F]">CSEET Mentorship</h4>
                <p className="text-xs text-gray-600">
                  Complete 4-subject guidance, daily micro-targets, and continuous motivation with AIR 3 Ranker.
                </p>
                <div className="pt-2">
                  <span className="text-xs text-gray-500 block">Full Program Fee</span>
                  <div className="font-cinzel text-3xl font-extrabold text-[#8A651E]">₹1,199/-</div>
                  <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                    With Early Bird (25% OFF): ₹899/- only
                  </span>
                </div>
              </div>
              <button
                onClick={() => buyNow(getProduct('cseet-mentorship'))}
                className="w-full py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Join CSEET Batch (₹1,199)</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>

            {/* Level 2: CS Executive */}
            <div className="p-6 bg-[#FAF8F5] border-2 border-[#C8A45D] rounded-2xl space-y-4 flex flex-col justify-between relative shadow-md">
              <div className="absolute -top-3 right-4 px-3 py-0.5 bg-[#C8A45D] text-black font-montserrat font-extrabold text-[10px] uppercase rounded-full shadow-sm">
                December 2026 Batch
              </div>
              <div className="space-y-3">
                <span className="px-2.5 py-1 bg-amber-500/15 text-amber-800 text-[10px] font-bold uppercase rounded-md">
                  Level 2 • Dec 2026
                </span>
                <h4 className="font-cinzel text-lg font-bold text-[#0F0F0F]">CS Executive Mentorship</h4>
                <ul className="text-xs text-gray-700 space-y-2 pt-1 font-poppins">
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Group 1 Only:</span>
                    <strong className="text-[#8A651E]">₹1,999/-</strong>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Group 2 Only:</span>
                    <strong className="text-[#8A651E]">₹1,699/-</strong>
                  </li>
                  <li className="flex justify-between font-bold text-black pt-0.5">
                    <span>Both Groups (G1+G2):</span>
                    <span className="text-[#8A651E] font-extrabold">₹3,249/-</span>
                  </li>
                </ul>
                <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                  Early Bird 25% OFF applies on all options!
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => buyNow(getProduct('exec-g1-mentorship'))}
                  className="py-2 bg-white hover:bg-gray-100 text-[#0F0F0F] border border-[#C8A45D] font-bold text-xs rounded-xl text-center"
                >
                  G1 (₹1,999)
                </button>
                <button
                  onClick={() => buyNow(getProduct('exec-both-mentorship'))}
                  className="py-2 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold text-xs rounded-xl text-center"
                >
                  Both (₹3,249)
                </button>
              </div>
            </div>

            {/* Level 3: CS Professional */}
            <div className="p-6 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-1 bg-purple-500/15 text-purple-800 text-[10px] font-bold uppercase rounded-md">
                  Level 3 • Dec 2026
                </span>
                <h4 className="font-cinzel text-lg font-bold text-[#0F0F0F]">CS Professional Mentorship</h4>
                <ul className="text-xs text-gray-700 space-y-2 pt-1 font-poppins">
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Group 1 Only:</span>
                    <strong className="text-[#8A651E]">₹2,499/-</strong>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-1">
                    <span>Group 2 Only:</span>
                    <strong className="text-[#8A651E]">₹1,999/-</strong>
                  </li>
                  <li className="flex justify-between font-bold text-black pt-0.5">
                    <span>Both Groups:</span>
                    <span className="text-[#8A651E] font-extrabold">₹3,999/-</span>
                  </li>
                </ul>
                <span className="text-[11px] text-emerald-700 font-bold block pt-1">
                  Learn directly from AIR 3 Harkiran Kaur!
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => buyNow(getProduct('prof-g1-mentorship'))}
                  className="py-2 bg-white hover:bg-gray-100 text-[#0F0F0F] border border-[#C8A45D] font-bold text-xs rounded-xl text-center"
                >
                  G1 (₹2,499)
                </button>
                <button
                  onClick={() => buyNow(getProduct('prof-both-mentorship'))}
                  className="py-2 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold text-xs rounded-xl text-center"
                >
                  Both (₹3,999)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Career Counselling & Guidance After 12th */}
        <div className="p-6 bg-gradient-to-r from-[#1A1815] to-[#12100E] border border-[#C8A45D]/40 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-[#C8A45D]/20 text-[#FFE3A0] text-[10px] font-bold uppercase rounded border border-[#C8A45D]/30">
              Career Counselling
            </span>
            <h4 className="font-cinzel text-xl font-bold text-white">
              Career Roadmap & Counselling After 12th (₹999/-)
            </h4>
            <p className="text-xs text-gray-300 max-w-2xl font-poppins">
              Confused about whether to choose Company Secretary (CS) after 12th? Get an in-depth 1-on-1 decision session with AIR 3 Harkiran Kaur comparing CS vs CA vs Law, regular vs correspondence graduation, and step-by-step career path.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => addToCart(getProduct('career-counselling-12th'))}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Add to Cart
            </button>
            <button
              onClick={() => buyNow(getProduct('career-counselling-12th'))}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-montserrat font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase cursor-pointer"
            >
              <span>Book Session (₹999)</span>
              <Zap className="w-3.5 h-3.5 fill-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CSEETPage: React.FC<PageProps> = ({ onNavigate, onOpenCounsellingModal, onOpenJoinModal }) => {
  const [selectedBatch, setSelectedBatch] = useState<'oct2026' | 'june2027'>('june2027');
  const { buyNow, addToCart } = useCart();
  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const currentProduct = selectedBatch === 'june2027'
    ? getProduct('june2027-cseet')
    : getProduct('cseet-mentorship');

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Session Switcher Pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-[#FAF8F5] border-2 border-[#C8A45D]/60 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedBatch('june2027')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedBatch === 'june2027'
                ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                : 'text-gray-700 hover:text-black hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D] fill-[#C8A45D]" />
            <span>FEBRUARY 2027 Mentorship Batch</span>
            <span className="px-1.5 py-0.2 bg-[#C8A45D] text-black text-[9px] font-black rounded uppercase">50% OFF</span>
          </button>
          <button
            onClick={() => setSelectedBatch('oct2026')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedBatch === 'oct2026'
                ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                : 'text-gray-700 hover:text-black hover:bg-white/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>October 2026 Batch</span>
          </button>
        </div>
        <div className="text-xs text-[#8A651E] font-poppins font-bold px-2">
          {selectedBatch === 'june2027' ? '★ Early Bird February 2027 Batch with AIR 3 Harkiran Kaur' : '★ Immediate October 2026 Session'}
        </div>
      </div>

      <div className="bg-[#0F0F0F] border border-[#C8A45D]/50 rounded-3xl p-8 sm:p-12 space-y-6 text-white shadow-xl">
        <span className="text-xs font-montserrat font-bold text-emerald-400 uppercase tracking-widest">
          {selectedBatch === 'june2027' ? 'LEVEL 1 — CSEET FEBRUARY 2027 Mentorship Batch' : 'LEVEL 1 — CSEET October 2026 Batch'}
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
          {selectedBatch === 'june2027' ? 'CSEET FEBRUARY 2027 1-on-1 Mentorship Batch' : 'CSEET October 2026 1-on-1 Mentorship Batch'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-poppins leading-relaxed">
          Target 170+ marks in CSEET! Get direct 1-on-1 guidance from Harkiran Kaur Kohli (AIR 3). Daily target tracking, schedule routine planning, and doubt support across all 4 subjects.
        </p>

        {/* Papers Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl pt-2">
          <div className="p-4 bg-white/5 border border-[#C8A45D]/30 rounded-2xl">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Paper 1</span>
            <span className="text-sm font-bold text-white">Business Communication</span>
          </div>
          <div className="p-4 bg-white/5 border border-[#C8A45D]/30 rounded-2xl">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Paper 2</span>
            <span className="text-sm font-bold text-white">Fundamentals of Accounting</span>
          </div>
          <div className="p-4 bg-white/5 border border-[#C8A45D]/30 rounded-2xl">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Paper 3</span>
            <span className="text-sm font-bold text-white">Economic & Business Env.</span>
          </div>
          <div className="p-4 bg-white/5 border border-[#C8A45D]/30 rounded-2xl">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Paper 4</span>
            <span className="text-sm font-bold text-white">Business Law & Mgmt</span>
          </div>
        </div>

        {/* Pricing & Enrollment Card */}
        <div className="p-6 bg-white/5 border-2 border-[#C8A45D] rounded-2xl max-w-xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase rounded">
                Only 25 Seats Per Batch
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white mt-1">
                {currentProduct.name}
              </h3>
              <p className="text-xs text-gray-400 mt-1">1st Guidance Call is 100% Free (Demo)</p>
            </div>
            <div className="text-right">
              <span className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">
                ₹{currentProduct.price.toLocaleString('en-IN')}/-
              </span>
              <span className="text-xs text-emerald-400 block font-bold">
                {selectedBatch === 'june2027' ? 'Code: JUNE2027 (5% OFF)' : 'Code: NEXT5 (5% OFF)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => addToCart(currentProduct)}
              className="py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#C8A45D]" /> Add to Cart
            </button>
            <button
              onClick={() => buyNow(currentProduct)}
              className="py-3 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase cursor-pointer"
            >
              <span>Join Batch</span>
              <Zap className="w-4 h-4 fill-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CSExecutivePage: React.FC<PageProps> = ({ onNavigate, onOpenCounsellingModal, onOpenJoinModal }) => {
  const [selectedSession, setSelectedSession] = useState<'june2027' | 'dec2026'>('june2027');
  const { addToCart, buyNow } = useCart();
  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const g1Product = selectedSession === 'june2027' ? getProduct('june2027-exec-g1') : getProduct('exec-g1-mentorship');
  const g2Product = selectedSession === 'june2027' ? getProduct('june2027-exec-g2') : getProduct('exec-g2-mentorship');
  const bothProduct = selectedSession === 'june2027' ? getProduct('june2027-exec-both') : getProduct('exec-both-mentorship');

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Session Switcher Pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-[#FAF8F5] border-2 border-[#C8A45D]/60 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedSession('june2027')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedSession === 'june2027'
                ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                : 'text-gray-700 hover:text-black hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D] fill-[#C8A45D]" />
            <span>JUNE 2027 Mentorship Session</span>
            <span className="px-1.5 py-0.2 bg-[#C8A45D] text-black text-[9px] font-black rounded uppercase">50% OFF</span>
          </button>
          <button
            onClick={() => setSelectedSession('dec2026')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedSession === 'dec2026'
                ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                : 'text-gray-700 hover:text-black hover:bg-white/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>December 2026 Batch</span>
          </button>
        </div>
        <div className="text-xs text-[#8A651E] font-poppins font-bold px-2">
          {selectedSession === 'june2027' ? '★ Early Bird June 2027 Enrolling • Code JUNE2027' : '★ Immediate December 2026 Session'}
        </div>
      </div>

      <div className="bg-[#0F0F0F] border border-[#C8A45D]/50 rounded-3xl p-8 sm:p-12 space-y-6 text-white shadow-xl">
        <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest">
          {selectedSession === 'june2027' ? 'LEVEL 2 — CS Executive JUNE 2027 Batch' : 'LEVEL 2 — CS Executive December 2026 Batch'}
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
          CS Executive 1-on-1 Mentorship Programs
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-poppins leading-relaxed">
          Master Group 1 (JIGL, Company Law, SBLL, CAFM) and Group 2 (CMSL, ECIPL, Tax Laws) with Harkiran Kaur Kohli's personal mentorship system. Strictly capped to 25 students per level.
        </p>

        {/* 3 Executive Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl pt-4">
          {/* Group 1 */}
          <div className="p-6 bg-white/5 border border-[#C8A45D]/40 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-[#FFE3A0] uppercase font-bold block">Group 1 (JIGL, CLAW, SBLL, CAFM)</span>
              <h3 className="font-cinzel text-lg font-bold text-white">{g1Product.name}</h3>
              <div className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">₹{g1Product.price.toLocaleString('en-IN')}/-</div>
              <p className="text-xs text-gray-400">Daily routine planning, answer writing techniques, and doubt calls.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(g1Product)}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Add
              </button>
              <button
                onClick={() => buyNow(g1Product)}
                className="py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 uppercase cursor-pointer"
              >
                <span>Buy</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>
          </div>

          {/* Group 2 */}
          <div className="p-6 bg-white/5 border border-[#C8A45D]/40 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-[#FFE3A0] uppercase font-bold block">Group 2 (CMSL, ECIPL, TAX)</span>
              <h3 className="font-cinzel text-lg font-bold text-white">{g2Product.name}</h3>
              <div className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">₹{g2Product.price.toLocaleString('en-IN')}/-</div>
              <p className="text-xs text-gray-400">SEBI regulations, Tax laws strategy, and daily milestone tracking.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(g2Product)}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Add
              </button>
              <button
                onClick={() => buyNow(g2Product)}
                className="py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 uppercase cursor-pointer"
              >
                <span>Buy</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>
          </div>

          {/* Both Groups */}
          <div className="p-6 bg-white/5 border-2 border-[#C8A45D] rounded-2xl flex flex-col justify-between space-y-4 relative shadow-lg">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#C8A45D] text-black text-[9px] font-bold uppercase rounded-full">
              Most Popular
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Both Groups (G1 + G2)</span>
              <h3 className="font-cinzel text-lg font-bold text-white">{bothProduct.name}</h3>
              <div className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">₹{bothProduct.price.toLocaleString('en-IN')}/-</div>
              <p className="text-xs text-gray-400">Complete 7-paper dual group mastery roadmap for {selectedSession === 'june2027' ? 'June 2027' : 'December 2026'}.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(bothProduct)}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Add
              </button>
              <button
                onClick={() => buyNow(bothProduct)}
                className="py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 uppercase cursor-pointer"
              >
                <span>Buy</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CSProfessionalPage: React.FC<PageProps> = ({ onNavigate, onOpenCounsellingModal, onOpenJoinModal }) => {
  const [selectedSession, setSelectedSession] = useState<'june2027' | 'dec2026'>('june2027');
  const { addToCart, buyNow } = useCart();
  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const g1Product = selectedSession === 'june2027' ? getProduct('june2027-prof-g1') : getProduct('prof-g1-mentorship');
  const g2Product = selectedSession === 'june2027' ? getProduct('june2027-prof-g2') : getProduct('prof-g2-mentorship');
  const bothProduct = selectedSession === 'june2027' ? getProduct('june2027-prof-both') : getProduct('prof-both-mentorship');

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Session Switcher Pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-[#FAF8F5] border-2 border-[#C8A45D]/60 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setSelectedSession('june2027')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedSession === 'june2027'
                ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                : 'text-gray-700 hover:text-black hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A45D] fill-[#C8A45D]" />
            <span>JUNE 2027 Mentorship Session</span>
            <span className="px-1.5 py-0.2 bg-[#C8A45D] text-black text-[9px] font-black rounded uppercase">50% OFF</span>
          </button>
          <button
            onClick={() => setSelectedSession('dec2026')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              selectedSession === 'dec2026'
                ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                : 'text-gray-700 hover:text-black hover:bg-white/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>December 2026 Batch</span>
          </button>
        </div>
        <div className="text-xs text-[#8A651E] font-poppins font-bold px-2">
          {selectedSession === 'june2027' ? '★ Early Bird June 2027 Enrolling • Code JUNE2027' : '★ Immediate December 2026 Session'}
        </div>
      </div>

      <div className="bg-[#0F0F0F] border border-[#C8A45D]/50 rounded-3xl p-8 sm:p-12 space-y-6 text-white shadow-xl">
        <span className="text-xs font-montserrat font-bold text-purple-400 uppercase tracking-widest">
          {selectedSession === 'june2027' ? 'LEVEL 3 — CS Professional JUNE 2027 Batch' : 'LEVEL 3 — CS Professional December 2026 Batch'}
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
          CS Professional Mentorship by AIR 3 Harkiran Kaur
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-poppins leading-relaxed">
          Learn directly under Harkiran Kaur Kohli who achieved All India Rank 3 in CS Professional. Master complex corporate restructuring, drafting, governance, and scoring techniques.
        </p>

        {/* 3 Professional Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl pt-4">
          {/* Group 1 */}
          <div className="p-6 bg-white/5 border border-[#C8A45D]/40 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-[#FFE3A0] uppercase font-bold block">Group 1 (Governance & Drafting)</span>
              <h3 className="font-cinzel text-lg font-bold text-white">{g1Product.name}</h3>
              <div className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">₹{g1Product.price.toLocaleString('en-IN')}/-</div>
              <p className="text-xs text-gray-400">Legal drafting frameworks and governance exemption roadmap.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(g1Product)}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Add
              </button>
              <button
                onClick={() => buyNow(g1Product)}
                className="py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 uppercase cursor-pointer"
              >
                <span>Buy</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>
          </div>

          {/* Group 2 */}
          <div className="p-6 bg-white/5 border border-[#C8A45D]/40 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] text-[#FFE3A0] uppercase font-bold block">Group 2 (Restructuring & IBC)</span>
              <h3 className="font-cinzel text-lg font-bold text-white">{g2Product.name}</h3>
              <div className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">₹{g2Product.price.toLocaleString('en-IN')}/-</div>
              <p className="text-xs text-gray-400">Corporate valuation, IBC case studies, and strategic answer structuring.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(g2Product)}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Add
              </button>
              <button
                onClick={() => buyNow(g2Product)}
                className="py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 uppercase cursor-pointer"
              >
                <span>Buy</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>
          </div>

          {/* Both Groups */}
          <div className="p-6 bg-white/5 border-2 border-[#C8A45D] rounded-2xl flex flex-col justify-between space-y-4 relative shadow-lg">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 bg-[#C8A45D] text-black text-[9px] font-bold uppercase rounded-full">
              AIR 3 Flagship
            </div>
            <div className="space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Both Professional Groups</span>
              <h3 className="font-cinzel text-lg font-bold text-white">{bothProduct.name}</h3>
              <div className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">₹{bothProduct.price.toLocaleString('en-IN')}/-</div>
              <p className="text-xs text-gray-400">Comprehensive Ranker Blueprint for all papers with weekly review calls.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addToCart(bothProduct)}
                className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" /> Add
              </button>
              <button
                onClick={() => buyNow(bothProduct)}
                className="py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 uppercase cursor-pointer"
              >
                <span>Buy</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CareerCounsellingPage: React.FC<PageProps> = ({ onNavigate, onOpenCounsellingModal }) => {
  const { addToCart, buyNow } = useCart();
  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="bg-[#0F0F0F] border border-[#C8A45D]/50 rounded-3xl p-8 sm:p-12 space-y-6 text-white shadow-xl">
        <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest">
          Career Guidance & Decision Framework
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
          CS Career Counselling & Roadmap After 12th
        </h1>
        <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-poppins leading-relaxed">
          Passed your 12th board exams and deciding on your future? Get clear, honest guidance from All India Rank 3 CS Professional Harkiran Kaur Kohli on Company Secretary career scope, compensation, college management, and study blueprints.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl pt-2">
          <div className="p-5 bg-white/5 border border-[#C8A45D]/30 rounded-2xl space-y-2">
            <Compass className="w-6 h-6 text-[#C8A45D]" />
            <h3 className="font-cinzel text-base font-bold text-white">CS vs CA vs Law</h3>
            <p className="text-xs text-gray-400">Discover which professional path matches your personality, skillset, and long-term goals.</p>
          </div>

          <div className="p-5 bg-white/5 border border-[#C8A45D]/30 rounded-2xl space-y-2">
            <GraduationCap className="w-6 h-6 text-[#C8A45D]" />
            <h3 className="font-cinzel text-base font-bold text-white">College Selection Advice</h3>
            <p className="text-xs text-gray-400">Regular B.Com vs Distance Learning vs Law school balance with CS preparations.</p>
          </div>

          <div className="p-5 bg-white/5 border border-[#C8A45D]/30 rounded-2xl space-y-2">
            <Target className="w-6 h-6 text-[#C8A45D]" />
            <h3 className="font-cinzel text-base font-bold text-white">Step-by-Step 3 Year Plan</h3>
            <p className="text-xs text-gray-400">Clear milestones from CSEET entry to executive, professional, and management training.</p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="p-6 bg-white/5 border-2 border-[#C8A45D] rounded-2xl max-w-xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="px-2.5 py-0.5 bg-[#C8A45D]/20 text-[#FFE3A0] text-[10px] font-bold uppercase rounded">
                1-on-1 Guidance Session
              </span>
              <h3 className="font-cinzel text-xl font-bold text-white mt-1">12th Career Decision Roadmap</h3>
            </div>
            <div className="text-right">
              <span className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">₹999/-</span>
              <span className="text-xs text-emerald-400 block font-bold">Code: NEXT5 (5% OFF)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => addToCart(getProduct('career-counselling-12th'))}
              className="py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#C8A45D]" /> Add to Cart
            </button>
            <button
              onClick={() => buyNow(getProduct('career-counselling-12th'))}
              className="py-3 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase cursor-pointer"
            >
              <span>Book Session</span>
              <Zap className="w-4 h-4 fill-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TestSeriesPage: React.FC<PageProps> = ({
  onNavigate,
  onOpenJoinModal,
  onOpenCounsellingModal,
}) => {
  const { addToCart, buyNow } = useCart();
  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const [selectedSubject, setSelectedSubject] = useState('Company Law & Practice');
  const [isAnswersheetModalOpen, setIsAnswersheetModalOpen] = useState(false);

  const subjects = [
    { name: 'Company Law & Practice', level: 'Executive G1' },
    { name: 'Jurisprudence, Interpretation & General Laws (JIGL)', level: 'Executive G1' },
    { name: 'Setting Up of Business, Industrial & Labour Laws (SBLL)', level: 'Executive G1' },
    { name: 'Corporate Accounting & Financial Management (CAFM)', level: 'Executive G1' },
    { name: 'Capital Markets & Securities Laws (CMSL)', level: 'Executive G2' },
    { name: 'Economic, Commercial & Intellectual Property Laws (ECIPL)', level: 'Executive G2' },
    { name: 'Tax Laws & Practice (TLP)', level: 'Executive G2' },
    { name: 'Environmental, Social and Governance (ESG) - Principles & Practice', level: 'Professional G1' },
    { name: 'Drafting, Pleadings and Appearances', level: 'Professional G1' },
    { name: 'Compliance Management, Audit & Due Diligence', level: 'Professional G1' },
    { name: 'Corporate Restructuring, Valuation & Insolvency', level: 'Professional G2' },
  ];

  const handleSingleAdd = () => {
    const customProduct = {
      ...getProduct('june-2026-answersheet-analysis'),
      name: `June 2026 Answersheet Analysis (${selectedSubject})`,
      description: `June 2026 ICSI Certified Answersheet Analysis & Step-Marking Report by AIR 3 Harkiran Kaur Kohli for ${selectedSubject}.`,
      features: [
        `Selected Subject: ${selectedSubject}`,
        'Line-by-line mark deduction & statutory drafting audit',
        'ICSI step-marking breakdown against official model answers',
        'Personal audio/video feedback breakdown by AIR 3 Harkiran Kaur',
        'Personalized score-boosting action plan for next attempt',
        'Turnaround time: 48-72 hours via WhatsApp / Email',
      ],
    };
    addToCart(customProduct);
  };

  const handleSingleBuy = () => {
    const customProduct = {
      ...getProduct('june-2026-answersheet-analysis'),
      name: `June 2026 Answersheet Analysis (${selectedSubject})`,
      description: `June 2026 ICSI Certified Answersheet Analysis & Step-Marking Report by AIR 3 Harkiran Kaur Kohli for ${selectedSubject}.`,
      features: [
        `Selected Subject: ${selectedSubject}`,
        'Line-by-line mark deduction & statutory drafting audit',
        'ICSI step-marking breakdown against official model answers',
        'Personal audio/video feedback breakdown by AIR 3 Harkiran Kaur',
        'Personalized score-boosting action plan for next attempt',
        'Turnaround time: 48-72 hours via WhatsApp / Email',
      ],
    };
    buyNow(customProduct);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFE3A0]/30 via-[#C8A45D]/20 to-[#FFE3A0]/30 border border-[#C8A45D]/60 text-[#7A5816] text-xs font-montserrat font-extrabold tracking-wider uppercase shadow-sm">
          <FileCheck className="w-3.5 h-3.5 text-[#C8A45D]" />
          <span>June 2026 Attempt Evaluation • 1-on-1 Certified Copy Audit</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#0F0F0F] leading-tight">
          June 2026 Answersheet <span className="text-[#8A651E]">Analysis Report</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 font-poppins max-w-2xl mx-auto leading-relaxed">
          Don't repeat the same mistakes in your next attempt. Get your ICSI certified answersheet evaluated line-by-line by <strong>AIR 3 Harkiran Kaur Kohli</strong> to uncover step-marking deductions, statutory drafting flaws, and receive an actionable score-booster roadmap.
        </p>

        {/* Pricing Badge Banner */}
        <div className="p-4 bg-gradient-to-r from-[#1A1815] via-[#121110] to-[#1A1815] border border-[#C8A45D]/50 rounded-2xl max-w-2xl mx-auto text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#C8A45D]/20 text-[#FFE3A0] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-montserrat font-extrabold text-[#FFE3A0] block">
                JUNE 2026 REPORT: ₹699/- EACH SUBJECT
              </span>
              <span className="text-[11px] text-gray-300">
                1st 10 got their offers! Next offer: Use code <strong className="text-[#FFE3A0]">NEXT5</strong> for 5% OFF on Mentorship
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsAnswersheetModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-montserrat font-extrabold text-xs rounded-xl uppercase shrink-0 shadow-md hover:brightness-110 cursor-pointer"
          >
            Select All / Multiple Subjects
          </button>
        </div>
      </div>

      {/* Interactive Program & Subject Selector Section */}
      <TestSeriesProgramSelector onNavigate={onNavigate} />

      {/* Starting Soon Announcement Card */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FAF7F2] via-[#FFFDF9] to-[#FAF7F2] border-2 border-dashed border-[#C8A45D] rounded-3xl text-center space-y-4 shadow-sm">
        <span className="px-3 py-1 bg-[#C8A45D]/20 text-[#8A651E] text-xs font-montserrat font-extrabold uppercase tracking-wider rounded-full inline-block">
          Upcoming Major Release
        </span>
        <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">
          Full Evaluated Test Series for All 3 Levels — Launching Soon!
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 font-poppins max-w-2xl mx-auto">
          We are currently preparing full evaluated test series with step-marking assessments and model solutions for <strong>Level 1 (CSEET)</strong>, <strong>Level 2 (CS Executive)</strong>, and <strong>Level 3 (CS Professional)</strong>, curated directly by AIR 3 Harkiran Kaur Kohli!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-montserrat font-bold">
            Level 1: CSEET Test Series (Soon)
          </span>
          <span className="px-3 py-1 bg-amber-50 text-[#8A651E] border border-[#C8A45D]/40 rounded-full text-xs font-montserrat font-bold">
            Level 2: CS Executive G1 + G2 (Soon)
          </span>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-full text-xs font-montserrat font-bold">
            Level 3: CS Professional G1 + G2 (Soon)
          </span>
        </div>
      </div>

      {/* Main Answersheet Analysis Product & Subject Booking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: What the Analysis Report Includes */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 bg-white border border-[#C8A45D]/40 rounded-3xl space-y-6 shadow-md">
            <div>
              <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest block">
                Comprehensive Diagnostic
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-[#0F0F0F] mt-1">
                What the June 2026 Answersheet Report Covers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F5] border border-[#C8A45D]/30 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-cinzel text-sm font-bold text-[#0F0F0F]">Step-Marking & Deduction Audit</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                  Question-by-question breakdown of why marks were withheld under ICSI guidelines and where step marks were lost.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#C8A45D]/30 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-cinzel text-sm font-bold text-[#0F0F0F]">Legal Drafting & Citation Review</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                  Detailed check of section number citations, relevant case law references, and legal phrasing required for high scores.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#C8A45D]/30 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-cinzel text-sm font-bold text-[#0F0F0F]">Voice / Video Feedback by AIR 3</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                  Personal audio/video notes from Harkiran Kaur pointing out exact presentation flaws and time management issues.
                </p>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#C8A45D]/30 rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center font-bold">
                  4
                </div>
                <h4 className="font-cinzel text-sm font-bold text-[#0F0F0F]">Action Plan for Next Attempt</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                  Clear, subject-specific revision priorities and drafting guidelines to convert your attempt into 60+ exemption marks.
                </p>
              </div>
            </div>

            {/* Submission Steps */}
            <div className="pt-4 border-t border-[#C8A45D]/20 space-y-3">
              <h4 className="font-cinzel text-sm font-bold text-[#0F0F0F] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8A651E]" /> Simple 3-Step Process:
              </h4>
              <div className="text-xs text-gray-700 font-poppins space-y-2">
                <p><strong>Step 1:</strong> Enroll below at ₹699/- for your required subject(s).</p>
                <p><strong>Step 2:</strong> Send your ICSI certified answersheet PDF on WhatsApp or Email.</p>
                <p><strong>Step 3:</strong> Receive your thorough marks deduction audit & improvement report within 48 to 72 hours.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Booking Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 bg-[#0F0F0F] border-2 border-[#C8A45D] rounded-3xl text-white space-y-6 shadow-2xl sticky top-28">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-[#C8A45D]/20 text-[#FFE3A0] text-[10px] font-bold uppercase rounded-full">
                  June 2026 Analysis
                </span>
                <span className="text-xs text-[#FFE3A0] font-bold">₹699 / Subject</span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-white pt-1">
                Answersheet Analysis Report
              </h3>
              <p className="text-xs text-gray-300 font-poppins">
                Understand your mistakes & transform your score for the next attempt.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-montserrat font-bold text-[#FFE3A0] uppercase">
                  Select Subject:
                </label>
                <button
                  type="button"
                  onClick={() => setIsAnswersheetModalOpen(true)}
                  className="text-[11px] font-bold text-[#C8A45D] hover:underline cursor-pointer"
                >
                  Choose Multiple Subjects →
                </button>
              </div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#181818] border border-[#C8A45D]/40 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8A45D]"
              >
                {subjects.map((sub, idx) => (
                  <option key={idx} value={sub.name} className="bg-[#181818] text-white">
                    {sub.name} ({sub.level})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400">
                Selected: <strong className="text-white">{selectedSubject}</strong>
              </p>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
              <div>
                <span className="text-xs text-gray-400 block">Fee per subject:</span>
                <div className="font-cinzel text-3xl font-extrabold text-[#FFE3A0]">
                  ₹699/-
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 line-through">₹1,200</span>
                <span className="text-xs text-[#FFE3A0] block font-bold">Standard ₹699</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleSingleAdd}
                className="py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#C8A45D]" /> Add to Cart
              </button>
              <button
                onClick={handleSingleBuy}
                className="py-3 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase cursor-pointer hover:brightness-110 shadow-lg transition-all"
              >
                <span>Get Report</span>
                <Zap className="w-4 h-4 fill-black" />
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAnswersheetModalOpen(true)}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/15 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <FileCheck className="w-4 h-4 text-[#C8A45D]" />
                <span>Need Audit for Multiple Subjects? Click here</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <span className="text-[11px] text-gray-400">
                1-on-1 Evaluation by AIR 3 Harkiran Kaur • 48-72h Turnaround
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED JUNE 2026 STRATEGIC ANALYSIS & PREPARATION BLUEPRINT */}
      <div className="space-y-12 pt-8 border-t-2 border-[#C8A45D]/20">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C8A45D]/50 text-[#8A651E] text-xs font-montserrat font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>EXECUTIVE & PROFESSIONAL PREPARATION ROADMAP</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-[#0F0F0F]">
            June 2026 Strategic Guidance & <span className="text-[#8A651E]">Scoring Blueprint</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-poppins max-w-2xl mx-auto">
            A comprehensive diagnostic by <strong>AIR 3 Harkiran Kaur Kohli</strong> breaking down the ICSI evaluation criteria, statutory presentation standards, and the 4-phase timeline to secure 60+ exemptions in June 2026.
          </p>
        </div>

        {/* 3 Key Diagnostic Findings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-3xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold text-base">
              78%
            </div>
            <h3 className="font-cinzel text-base font-bold text-gray-900">
              The 35–39 "Danger Zone" Trap
            </h3>
            <p className="text-xs text-gray-600 font-poppins leading-relaxed">
              Most students fail not from lack of study, but because answers lack statutory precision. Evaluators deduct 1–2 marks per question when section numbers, sub-rules, and legal case principles are missing.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-3xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-[#8A651E] flex items-center justify-center font-bold text-base">
              4-Part
            </div>
            <h3 className="font-cinzel text-base font-bold text-gray-900">
              Mandatory ICSI Drafting Structure
            </h3>
            <p className="text-xs text-gray-600 font-poppins leading-relaxed">
              To score 4/5 or 5/5, answers must strictly follow: <strong>(1) Applicable Legal Provisions</strong>, <strong>(2) Relevant Landmark Precedents</strong>, <strong>(3) Factual Correlation</strong>, and <strong>(4) Final Legal Conclusion</strong>.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-3xl shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-base">
              60+
            </div>
            <h3 className="font-cinzel text-base font-bold text-gray-900">
              Exemption Target Strategy
            </h3>
            <p className="text-xs text-gray-600 font-poppins leading-relaxed">
              Aim for 60+ exemption in at least two papers per module to offset aggregate shortfalls. Focus heavily on high-weightage chapters representing 65% of paper marks.
            </p>
          </div>
        </div>

        {/* 4-Phase Milestone Timeline for June 2026 */}
        <div className="p-6 sm:p-8 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-3xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-wider block">
                Preparation Calendar
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
                4-Phase Milestone Roadmap for June 2026
              </h3>
            </div>
            <button
              onClick={() => {
                const text = `HK RANKERS - JUNE 2026 STRATEGY BLUEPRINT\n\n` +
                  `Phase 1 (Months 1-2): Foundation & ICSI Study Material Alignment\n` +
                  `- 100% syllabus reading using the official ICSI module\n` +
                  `- Prepare short statutory definition cards and section charts\n\n` +
                  `Phase 2 (Month 3): High-Yield Chapter Deep Dive & Scanner Practice\n` +
                  `- Solve 5 past exam scanner questions per chapter\n` +
                  `- Practice drafted case law questions under timed conditions\n\n` +
                  `Phase 3 (Month 4): Certified Copy Audit & Remedial Action\n` +
                  `- Submit previous attempt answersheets for line-by-line mark audit\n` +
                  `- Fix mark loss in step-marking, sub-clauses, and presentation\n\n` +
                  `Phase 4 (Final 30 Days): 3-Hour Exam Simulation & Revision\n` +
                  `- Write 3 full 100-mark mock tests per subject\n` +
                  `- Review ICSI model answers and benchmark time management`;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'June_2026_ICSI_Preparation_Blueprint.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-white hover:bg-stone-50 border border-[#C8A45D] text-[#8A651E] rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer w-fit"
            >
              <Download className="w-4 h-4 text-[#C8A45D]" />
              <span>Download Preparation Blueprint</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#8A651E]">
                <span>Phase 1</span>
                <span className="px-2 py-0.5 bg-amber-50 rounded-md border border-[#C8A45D]/30">Months 1 & 2</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Module Alignment & Concept Deep-Dive</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed font-poppins">
                Complete thorough 1st reading of ICSI study material. Mark key statutory definitions and prepare handwritten formula/section charts.
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#8A651E]">
                <span>Phase 2</span>
                <span className="px-2 py-0.5 bg-amber-50 rounded-md border border-[#C8A45D]/30">Month 3</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Scanner Solving & Legal Drafting</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed font-poppins">
                Solve past 5 examination papers topic-by-topic. Transition from passive reading to active statutory drafting of case problem answers.
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#8A651E]">
                <span>Phase 3</span>
                <span className="px-2 py-0.5 bg-amber-50 rounded-md border border-[#C8A45D]/30">Month 4</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Certified Copy Audit & Remedial Plan</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed font-poppins">
                Get your ICSI answersheets evaluated line-by-line by AIR 3 to diagnose exact deduction causes and implement targeted drafting fixes.
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#8A651E]">
                <span>Phase 4</span>
                <span className="px-2 py-0.5 bg-amber-50 rounded-md border border-[#C8A45D]/30">Final 30 Days</span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Full 3-Hour Simulated Mock Tests</h4>
              <p className="text-[11px] text-gray-600 leading-relaxed font-poppins">
                Simulate 3 real exam-condition 100-mark mock tests. Perfect speed, section indexing, handwriting legibility, and aggregate optimization.
              </p>
            </div>
          </div>
        </div>

        {/* High-Yield Chapter Weightage Matrix */}
        <div className="p-6 sm:p-8 bg-white border border-[#C8A45D]/40 rounded-3xl space-y-6 shadow-sm">
          <div>
            <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-wider block">
              Syllabus 2022 Focus
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
              High-Yield Subjects & Chapter Weightage Guide
            </h3>
            <p className="text-xs text-gray-600 mt-1 font-poppins">
              Prioritize these core scoring chapters carrying between 60% and 70% of total examination weightage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F0F0F]">Company Law & Practice</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Executive G1</span>
              </div>
              <p className="text-xs text-gray-600 font-poppins">
                Focus: General Meetings (SS-2), Board Meetings (SS-1), Directors & KMP, Accounts & Audit, Compromises & Arrangements.
              </p>
              <div className="text-[11px] font-bold text-[#8A651E] pt-1">
                Typical Weightage: 65+ marks from core corporate governance chapters.
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F0F0F]">Jurisprudence & Legal Laws (JIGL)</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">Executive G1</span>
              </div>
              <p className="text-xs text-gray-600 font-poppins">
                Focus: Interpretation of Statutes, Constitution of India (Fundamental Rights), CPC, CrPC, Law of Torts, Limitation Act.
              </p>
              <div className="text-[11px] font-bold text-[#8A651E] pt-1">
                Typical Weightage: 50+ marks from administrative & statutory interpretation.
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F0F0F]">Capital Markets & Securities (CMSL)</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">Executive G2</span>
              </div>
              <p className="text-xs text-gray-600 font-poppins">
                Focus: SEBI (ICDR) Regulations, SEBI (LODR), SEBI (PIT) Insider Trading, Takeover Code (SAST), Depositories Act.
              </p>
              <div className="text-[11px] font-bold text-[#8A651E] pt-1">
                Typical Weightage: 60+ marks from SEBI regulations & listed entity compliance.
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F0F0F]">Tax Laws & Practice</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">Executive G2</span>
              </div>
              <p className="text-xs text-gray-600 font-poppins">
                Focus: Heads of Income (Profits from Business/Profession & Capital Gains), TDS/TCS, GST Input Tax Credit & Time of Supply.
              </p>
              <div className="text-[11px] font-bold text-[#8A651E] pt-1">
                Typical Weightage: 50 marks Direct Tax + 50 marks Indirect Tax (GST & Customs).
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F0F0F]">Drafting, Pleadings & Appearances</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] font-bold rounded-full">Professional G1</span>
              </div>
              <p className="text-xs text-gray-600 font-poppins">
                Focus: General Principles of Drafting, Commercial Contracts, Company Law Petitions before NCLT, Writ Petitions, Appeals.
              </p>
              <div className="text-[11px] font-bold text-[#8A651E] pt-1">
                Typical Weightage: 70+ marks on drafting precision & clause architecture.
              </div>
            </div>

            <div className="p-4 bg-[#FAF8F5] border border-gray-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#0F0F0F]">Corporate Restructuring & Insolvency</span>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] font-bold rounded-full">Professional G2</span>
              </div>
              <p className="text-xs text-gray-600 font-poppins">
                Focus: Mergers & Amalgamations, Demergers, Cross-Border Mergers, IBC 2016 (CIRP, Liquidation, Resolution Plans).
              </p>
              <div className="text-[11px] font-bold text-[#8A651E] pt-1">
                Typical Weightage: 50 marks M&A + 50 marks Insolvency Code.
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Guidance Call to Action Bar */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#1C1917] via-[#2A241C] to-[#1C1917] border-2 border-[#C8A45D] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="px-3 py-0.5 bg-[#C8A45D]/20 text-[#FFE3A0] text-xs font-montserrat font-bold rounded-full inline-block">
              Free 1-on-1 Guidance
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Not Sure Which Subjects to Prioritize for June 2026?
            </h3>
            <p className="text-xs text-gray-300 font-poppins max-w-xl">
              Book a complimentary diagnostic session with AIR 3 Harkiran Kaur to review your target groups, syllabus status, and create a customized daily study schedule.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenCounsellingModal}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:brightness-105 text-black font-montserrat font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-black" />
              <span>Book Free Strategy Call</span>
            </button>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-montserrat font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Audit Certified Copy (₹699)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject Multi-Select Modal */}
      <AnswersheetSubjectModal
        isOpen={isAnswersheetModalOpen}
        onClose={() => setIsAnswersheetModalOpen(false)}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />
    </div>
  );
};

