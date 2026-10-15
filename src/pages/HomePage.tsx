import React, { useState } from 'react';
import founderImg from '../assets/images/regenerated_image_1785612225656.jpg';
import studyTrackGraphicImg from '../assets/images/hk_studytrack_pro_graphic_1789259325801.jpg';
import { PageId } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { AnswersheetSubjectModal } from '../components/Modals';
import {
  Sparkles,
  Award,
  BookOpen,
  Users,
  Clock,
  CheckCircle2,
  ChevronRight,
  Star,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Target,
  Brain,
  GraduationCap,
  FileCheck,
  Zap,
  HelpCircle,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Send,
  UserCheck,
  BarChart3,
  Calendar,
  PhoneCall,
  ShoppingBag,
  Percent,
  Compass,
  Check,
  MessageSquareText,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenJoinModal: () => void;
  onOpenCounsellingModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenJoinModal,
  onOpenCounsellingModal,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAnswersheetModalOpen, setIsAnswersheetModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<'june2027' | 'current'>('june2027');

  const { addToCart, buyNow } = useCart();
  const { hasPurchased } = useAuth();

  const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const testimonials = [
    {
      name: 'Riddhi Sharma',
      rank: 'CS Executive High Scorer',
      course: 'CS Executive Both Groups',
      quote:
        "Harkiran Ma'am's 25-seat batch model changed everything for me. Her 1-on-1 daily target checking kept me disciplined and accountable when I felt overwhelmed with Company Law amendments. I cleared Both Groups with complete confidence!",
      rating: 5,
      score: 'Score: 482 / 800 (Exemption in Company Law)',
    },
    {
      name: 'Devansh Verma',
      rank: 'CSEET First Attempt Scorer',
      course: 'CSEET Master Batch',
      quote:
        "Clearing CSEET in my very first attempt with 178/200 was possible because Ma'am guided me on exact answer writing patterns, mock test evaluation techniques, and instant doubt resolution whenever I got stuck.",
      rating: 5,
      score: 'Score: 178 / 200',
    },
    {
      name: 'Pooja Agarwal',
      rank: 'CS Executive Group 1 Clearer',
      course: 'CS Executive Group 1',
      quote:
        "The personal attention is unmatched. Every schedule was customized to my work routine. Her 1-on-1 guidance gave me the legal drafting clarity that converted my attempt into exemptions!",
      rating: 5,
      score: 'Cleared 1st Attempt with Exemptions',
    },
    {
      name: 'Ananor Malhotra',
      rank: 'CS Executive High Scorer',
      course: 'CS Executive Group 2',
      quote:
        "The voice note support and personalized schedule mapping took away all my exam anxiety. Whenever I hit a roadblock in CMSL, Ma'am explained concepts in minutes with clear real-world legal examples.",
      rating: 5,
      score: 'Score: 68+ in Capital Markets',
    },
    {
      name: 'Rohan Mehra',
      rank: 'CSEET Top Achiever',
      course: 'CSEET Combined Mentorship',
      quote:
        "Harkiran Ma'am doesn't just teach syllabus—she teaches you how to think like a future Company Secretary. The structured revision cycles and mental stamina guidance helped me score 172/200!",
      rating: 5,
      score: 'Score: 172 / 200',
    },
    {
      name: 'Sneha Kapoor',
      rank: 'CS Executive First Attempt',
      course: 'CS Executive Both Groups',
      quote:
        "The level of personal attention in the 25-aspirant batch is unmatched. The structured day-by-day roadmap ensured I completed 3 revision cycles before the final exam paper.",
      rating: 5,
      score: 'Cleared Both Groups First Attempt',
    },
  ];

  const faqs = [
    {
      q: 'How does the 1st Free Guidance Call (Demo Session) work?',
      a: 'Just like a demo lecture in coaching institutes, our 1st 1-on-1 guidance call is 100% free with zero obligation. You get 30 minutes directly with AIR 3 Harkiran Kaur to review your syllabus status, daily routine, and attempt strategy.',
    },
    {
      q: 'Why does HK Code of Rankers restrict batches to 25 aspirants per level?',
      a: 'Unlike mass coaching institutes with hundreds of aspirants per batch, Harkiran Kaur personally tracks every aspirant\'s daily schedule, micro targets, and weak chapters. Restricting to 25 seats ensures genuine, undivided 1-on-1 mentorship.',
    },
    {
      q: 'What discount offers are currently available on HK Code of Rankers?',
      a: 'The 1st 10 students got their offers! The next offer is 5% OFF on Mentorship programs by applying coupon code NEXT5 at checkout.',
    },
    {
      q: 'Can I join HK Code of Rankers if I already have video lectures from other faculties?',
      a: 'Absolutely! Over 65% of our aspirants take video lectures elsewhere but join HK Code of Rankers for personalized strategy, day-to-day discipline, routine tracking, and direct mentorship.',
    },
    {
      q: 'What is covered under Career Counselling for 12th passing students?',
      a: 'Under our ₹999 Career Roadmap session, 12th pass students get an in-depth 1-on-1 consultation on whether CS is the right career for them, CS vs CA vs Law comparison, college management advice, and a step-by-step 3-year clearance plan.',
    },
    {
      q: 'How does daily WhatsApp and Voice Note support work?',
      a: 'Mentorship aspirants receive direct access to Harkiran Ma\'am via personal WhatsApp channels. Your daily progress is logged, and doubts or motivation dips are addressed with personalized voice notes.',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F3EFE6] to-[#F8F6F2] border-b border-[#C8A45D]/20">
        {/* Subtle Ambient Gold Radiance */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(200,164,93,0.15)_0%,transparent_70%)] pointer-events-none rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="animate-drop-slide relative overflow-hidden inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FFE3A0]/30 via-[#C8A45D]/20 to-[#FFE3A0]/30 border border-[#C8A45D]/60 text-[#7A5816] text-xs font-montserrat font-extrabold tracking-wider uppercase shadow-sm backdrop-blur-sm group hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
                <span className="relative z-10">Exclusive 1-on-1 Mentorship • Strictly 25 Seats</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-gold-shimmer pointer-events-none" />
              </div>

              <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F0F0F] leading-[1.2] tracking-tight">
                From the deepest anxiety to your{' '}
                <span className="block mt-1">
                  <span className="text-[#8A651E] drop-shadow-sm">last fight</span> in the exam hall.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#333333] leading-relaxed max-w-2xl font-poppins">
                HK Code of Rankers is an elite mentorship platform for Company Secretary aspirants. We combine high-precision <strong>25-seat batch guidance</strong>, daily schedule mapping, and direct 1-on-1 mentorship with <strong>Harkiran Kaur Kohli (AIR 3 • CS Professional)</strong> to transform preparation into complete exam composure.
              </p>

              {/* Founder Highlight Pill */}
              <div
                onClick={() => onNavigate('founder')}
                className="p-3 bg-white border border-[#C8A45D]/40 hover:border-[#C8A45D] rounded-xl flex items-center gap-3 max-w-xl shadow-sm transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE3A0] to-[#C8A45D] p-0.5 shrink-0 shadow-md overflow-hidden">
                  <img
                    src={founderImg}
                    alt="Harkiran Kaur Kohli"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform"
                  />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#0F0F0F] font-montserrat flex items-center gap-1.5 flex-wrap">
                    <span>Harkiran Kaur Kohli</span>
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-extrabold text-[9px] rounded-full uppercase tracking-wider shadow-xs">
                      AIR 3 • CS Professional
                    </span>
                  </p>
                  <p className="text-[#8A651E] font-montserrat font-bold text-[11px] mt-0.5">
                    Founder & Head Mentor • All India Rank 3 Achiever
                  </p>
                </div>
              </div>

              {/* Next Offer Banner */}
              <div className="p-3 bg-[#FAF5E9] border border-[#C8A45D]/60 rounded-xl flex items-center justify-between gap-2 max-w-xl text-xs">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#8A651E] shrink-0" />
                  <span className="text-[#7A5816] font-medium">
                    1st 10 got their offers! Next offer: <strong>5% OFF on Mentorship</strong> with code <strong className="text-black font-mono">NEXT5</strong>
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#C8A45D] text-black font-extrabold text-[10px] rounded uppercase shrink-0">
                  CODE: NEXT5
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={onOpenCounsellingModal}
                  className="px-6 py-3.5 text-xs font-montserrat font-bold text-black gold-gradient-bg hover:brightness-110 rounded-xl shadow-xl shadow-[#C8A45D]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-black" />
                  <span>Book Free Session</span>
                  <ChevronRight className="w-4 h-4 text-black" />
                </button>

                <button
                  onClick={() => onNavigate('programs')}
                  className="px-6 py-3.5 text-xs font-montserrat font-bold text-[#0F0F0F] bg-white hover:bg-[#F8F6F2] border border-[#C8A45D] hover:border-[#8A651E] rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#8A651E]" />
                  <span>View Mentorship Batches</span>
                </button>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8A651E]" /> 1st Call 100% Free Demo Session
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8A651E]" /> Max 25 Students Per Level
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8A651E]" /> Direct Mentorship with AIR 3
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl p-1 bg-gradient-to-b from-[#C8A45D]/60 via-[#C8A45D]/20 to-transparent shadow-xl">
                <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-[#C8A45D]/30">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#8A651E] uppercase tracking-widest">
                        Live Mentorship Batches
                      </span>
                      <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">October & December 2026</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 rounded-md text-[10px] font-bold">
                      Seats Active
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0F0F0F] block font-montserrat">CSEET (Oct 2026)</span>
                        <span className="text-gray-500 text-[11px]">All 4 Papers Mentorship</span>
                      </div>
                      <span className="font-cinzel font-bold text-base text-[#8A651E]">₹1,199/-</span>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0F0F0F] block font-montserrat">CS Exec G1 / G2 (Dec 2026)</span>
                        <span className="text-gray-500 text-[11px]">G1: ₹1,999 | G2: ₹1,699 | Both: ₹3,249</span>
                      </div>
                      <span className="font-cinzel font-bold text-sm text-[#8A651E]">From ₹1,699/-</span>
                    </div>

                    <div className="p-3.5 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#0F0F0F] block font-montserrat">CS Prof G1 / G2 (Dec 2026)</span>
                        <span className="text-gray-500 text-[11px]">G1: ₹2,499 | G2: ₹1,999 | Both: ₹3,999</span>
                      </div>
                      <span className="font-cinzel font-bold text-sm text-[#8A651E]">From ₹1,999/-</span>
                    </div>

                    <div className="p-3.5 bg-gradient-to-r from-[#1A1815] to-[#12100E] border border-[#C8A45D]/40 rounded-xl flex items-center justify-between text-xs text-white">
                      <div>
                        <span className="font-bold text-[#FFE3A0] block font-montserrat">Career Roadmap After 12th</span>
                        <span className="text-gray-300 text-[11px]">CS Career Decision Session</span>
                      </div>
                      <span className="font-cinzel font-bold text-base text-[#FFE3A0]">₹999/-</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={onOpenCounsellingModal}
                      className="w-full py-3 text-xs font-montserrat font-bold text-black gold-gradient-bg hover:brightness-110 rounded-xl shadow-md cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-black" />
                      <span>Book Free 1:1 Demo Guidance Call</span>
                    </button>
                    <p className="text-[10px] text-center text-gray-500">
                      ★ 100% Free Demo Session • No credit card or pre-payment needed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 bg-white border border-[#C8A45D]/40 rounded-2xl text-center group hover:border-[#C8A45D] transition-all shadow-sm">
            <p className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#C8A45D] group-hover:scale-105 transition-transform">
              AIR 3
            </p>
            <p className="text-xs font-montserrat font-bold text-[#0F0F0F] mt-1 uppercase tracking-wider">
              CS Professional Ranker
            </p>
            <p className="text-[11px] text-gray-600 mt-1">Founder Harkiran Kaur Kohli</p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/40 rounded-2xl text-center group hover:border-[#C8A45D] transition-all shadow-sm">
            <p className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#C8A45D] group-hover:scale-105 transition-transform">
              25 Seats
            </p>
            <p className="text-xs font-montserrat font-bold text-[#0F0F0F] mt-1 uppercase tracking-wider">
              Strict Batch Limit
            </p>
            <p className="text-[11px] text-gray-600 mt-1">Dedicated 1-on-1 focus per level</p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/40 rounded-2xl text-center group hover:border-[#C8A45D] transition-all shadow-sm">
            <p className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#C8A45D] group-hover:scale-105 transition-transform">
              100% Free
            </p>
            <p className="text-xs font-montserrat font-bold text-[#0F0F0F] mt-1 uppercase tracking-wider">
              1st Guidance Call
            </p>
            <p className="text-[11px] text-gray-600 mt-1">Demo session before enrollment</p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/40 rounded-2xl text-center group hover:border-[#C8A45D] transition-all shadow-sm">
            <p className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[#C8A45D] group-hover:scale-105 transition-transform">
              25% OFF
            </p>
            <p className="text-xs font-montserrat font-bold text-[#0F0F0F] mt-1 uppercase tracking-wider">
              Early Bird Discount
            </p>
            <p className="text-[11px] text-gray-600 mt-1">For first 10 students on all 3 exams</p>
          </div>
        </div>
      </section>



      {/* 4. ALL 3 LEVEL PROGRAMS & PRICING SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header & Session Switch */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest block">
              1-on-1 Mentorship Programs (Strictly 25 Students Per Level)
            </span>
            <h2 className="font-cinzel text-3xl font-bold text-[#0F0F0F] mt-1">
              Select Your Target Examination Session &amp; Level
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              2027 Launch Codes: <strong className="text-emerald-900 font-mono">FEB2027</strong> (CSEET) &bull; <strong className="text-emerald-900 font-mono">JUNE2027</strong> (Exec &amp; Prof)
            </span>
          </div>
        </div>

        {/* High-Visibility Session Switch Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 bg-[#FAF8F5] border-2 border-[#C8A45D]/60 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedSession('june2027')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-montserrat font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                selectedSession === 'june2027'
                  ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                  : 'text-gray-700 hover:text-black hover:bg-white/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE3A0] fill-[#FFE3A0]" />
              <span>2027 Sessions (Feb &amp; June Launch Offer)</span>
              <span className="px-1.5 py-0.2 bg-[#C8A45D] text-black text-[9px] font-black rounded uppercase">7 New</span>
            </button>
            <button
              onClick={() => setSelectedSession('current')}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                selectedSession === 'current'
                  ? 'bg-gradient-to-r from-[#1C1917] via-[#2A241A] to-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                  : 'text-gray-700 hover:text-black hover:bg-white/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Current Session (Oct / Dec 2026)</span>
            </button>
          </div>

          <div className="text-right text-xs text-gray-500 font-poppins px-2 hidden md:block">
            {selectedSession === 'june2027' ? (
              <span className="text-[#8A651E] font-bold">
                Early Bird Mentorship Enrolling Now • Direct AIR 3 Guidance
              </span>
            ) : (
              <span>Oct 2026 (CSEET) &amp; Dec 2026 (Exec / Prof)</span>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {selectedSession === 'june2027' ? (
          <div className="space-y-6">
            {/* Launch Announcement Banner */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1C1917] via-[#251E16] to-[#12100E] border-2 border-[#C8A45D] rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE3A0] to-[#C8A45D] flex items-center justify-center text-black font-extrabold shadow-sm shrink-0">
                  <Sparkles className="w-5 h-5 text-black fill-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#C8A45D] text-black text-[10px] font-extrabold uppercase rounded tracking-wider">
                      OFFICIAL 2027 BATCHES
                    </span>
                    <span className="font-cinzel font-bold text-white text-sm sm:text-base">
                      All 7 Level-Wise Programs Live
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 font-poppins mt-0.5">
                    CSEET (Feb 2027) &amp; CS Executive / Professional (June 2027). Code <strong className="text-[#FFE3A0] font-mono">FEB2027</strong> or <strong className="text-[#FFE3A0] font-mono">JUNE2027</strong> for 5% OFF!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigate('programs')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#FFE3A0] border border-[#C8A45D]/50 rounded-xl text-xs font-montserrat font-bold cursor-pointer transition-colors"
                >
                  View Full Directory
                </button>
              </div>
            </div>

            {/* 7 2027 Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <ProductCard
                product={getProduct('june2027-cseet')}
                onNavigate={onNavigate}
                badgeLabel="FEB 2027 • CSEET"
              />
              <ProductCard
                product={getProduct('june2027-exec-both')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Exec Both Groups"
              />
              <ProductCard
                product={getProduct('june2027-prof-both')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Prof Both Groups"
              />
              <ProductCard
                product={getProduct('june2027-exec-g1')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Exec Group 1"
              />
              <ProductCard
                product={getProduct('june2027-exec-g2')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Exec Group 2"
              />
              <ProductCard
                product={getProduct('june2027-prof-g1')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Prof Group 1"
              />
              <ProductCard
                product={getProduct('june2027-prof-g2')}
                onNavigate={onNavigate}
                badgeLabel="JUNE 2027 • Prof Group 2"
              />
              <ProductCard
                product={getProduct('career-counselling-12th')}
                onNavigate={onNavigate}
                badgeLabel="Career Roadmap (Post 12th)"
              />
            </div>
          </div>
        ) : (
          /* Primary Current Session Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
              product={getProduct('cseet-mentorship')}
              onNavigate={onNavigate}
              badgeLabel="Level 1 • Oct 2026"
            />
            <ProductCard
              product={getProduct('exec-both-mentorship')}
              onNavigate={onNavigate}
              badgeLabel="Level 2 • Dec 2026"
            />
            <ProductCard
              product={getProduct('prof-both-mentorship')}
              onNavigate={onNavigate}
              badgeLabel="Level 3 • Dec 2026"
            />
            <ProductCard
              product={getProduct('career-counselling-12th')}
              onNavigate={onNavigate}
              badgeLabel="Career Roadmap"
            />
          </div>
        )}

        {/* Direct Mentorship Fee Matrix */}
        <div className="mt-8 p-6 sm:p-8 bg-[#0F0F0F] rounded-3xl border border-[#C8A45D]/40 text-white space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C8A45D]/30 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest block">
                  Instant Enrollment Portal
                </span>
                <span className="px-2 py-0.2 bg-[#C8A45D]/20 text-[#FFE3A0] border border-[#C8A45D]/40 rounded text-[9px] font-extrabold uppercase">
                  {selectedSession === 'june2027' ? '2027 Sessions Active' : 'Current Session Active'}
                </span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-0.5">
                {selectedSession === 'june2027'
                  ? '2027 Examination Mentorship Directory'
                  : 'Direct Stage & Program Directory'}
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-[#C8A45D]/10 border border-[#C8A45D]/30 px-3 py-1.5 rounded-xl">
              <Percent className="w-3.5 h-3.5 text-[#FFE3A0]" />
              <span className="text-xs text-[#FFE3A0] font-poppins font-medium">
                {selectedSession === 'june2027' ? (
                  <>Codes: <strong className="text-white font-mono">FEB2027</strong> (CSEET) &bull; <strong className="text-white font-mono">JUNE2027</strong> (Exec &amp; Prof)</>
                ) : (
                  <>Use code <strong className="text-white font-mono">NEXT5</strong> for 5% OFF on Mentorship</>
                )}
              </span>
            </div>
          </div>

          {/* 3 Main Examination Columns */}
          {selectedSession === 'june2027' ? (
            /* =================== FEBRUARY 2027 COLUMNS =================== */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* COLUMN 1: CSEET FEBRUARY 2027 */}
              <div className="p-5 bg-[#161616] border-2 border-emerald-500/40 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-montserrat font-bold uppercase">
                      LEVEL 1 • FEBRUARY 2027
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Launch Offer</span>
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-lg text-white">CSEET Mentorship — FEBRUARY 2027</h4>
                    <p className="text-xs text-gray-400 font-poppins">Comprehensive Foundation 4-Paper Mentorship</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl space-y-1.5 text-xs text-gray-300 font-poppins">
                    <div className="text-[11px] font-bold text-[#C8A45D] uppercase tracking-wider">All 4 Foundation Papers:</div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 1: Business Communication</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 2: Fundamentals of Accounting</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 3: Economics &amp; Business Env.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 4: Business Laws &amp; Management</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-cinzel text-3xl font-black text-[#FFE3A0]">₹3,000/-</span>
                      <span className="text-xs text-gray-400 line-through">₹6,000</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded">50% OFF</span>
                    </div>
                    <p className="text-[10px] text-gray-400">Target February 2027 examination with AIR 3 Harkiran Kaur.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => addToCart(getProduct('june2027-cseet'))}
                    className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => buyNow(getProduct('june2027-cseet'))}
                    className="py-2.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-montserrat font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase cursor-pointer hover:brightness-110 shadow-md transition-all"
                  >
                    <span>Instant Buy</span>
                    <Zap className="w-3.5 h-3.5 fill-black" />
                  </button>
                </div>
              </div>

              {/* COLUMN 2: CS EXECUTIVE JUNE 2027 (G1, G2, Both) */}
              <div className="p-5 bg-[#161616] border-2 border-amber-500/40 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-montserrat font-bold uppercase">
                      LEVEL 2 • JUNE 2027
                    </span>
                    <span className="text-[10px] text-[#FFE3A0] font-semibold">June '27 CS Exam</span>
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-lg text-white">CS Executive — JUNE 2027</h4>
                    <p className="text-xs text-gray-400 font-poppins">Specialized 1-on-1 mentorship for June 2027</p>
                  </div>

                  {/* Sub-options for Exec June 2027 */}
                  <div className="space-y-2.5">
                    {/* Exec Group 1 June 2027 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 1 — JUNE 2027</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[10px] text-gray-400 line-through">₹6,999</span>
                          <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹3,099/-</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        JIGL, Company Law, SBLL, CAFM (All 4 Papers)
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('june2027-exec-g1'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('june2027-exec-g1'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G1</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Exec Group 2 June 2027 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 2 — JUNE 2027</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[10px] text-gray-400 line-through">₹6,499</span>
                          <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹2,899/-</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        CMSL, ECIPL, Tax Laws &amp; Practice (All 3 Papers)
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('june2027-exec-g2'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('june2027-exec-g2'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G2</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Exec Both Groups June 2027 */}
                    <div className="p-3 bg-gradient-to-r from-[#2A241A] to-[#1C1813] border-2 border-[#C8A45D] rounded-xl space-y-1.5 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#FFE3A0]">Both Groups — JUNE 2027</span>
                          <span className="px-1.5 py-0.5 bg-[#C8A45D] text-black text-[9px] font-extrabold rounded">50% OFF</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[10px] text-gray-400 line-through">₹9,999</span>
                          <span className="font-cinzel text-lg font-black text-[#FFE3A0]">₹5,000/-</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-300 leading-tight">
                        Complete 7-Paper Dual Group Mastery for June 2027
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('june2027-exec-both'))}
                          className="py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add Both
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('june2027-exec-both'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-black rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy Both</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 3: CS PROFESSIONAL JUNE 2027 (G1, G2, Both) */}
              <div className="p-5 bg-[#161616] border-2 border-purple-500/40 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-montserrat font-bold uppercase">
                      LEVEL 3 • JUNE 2027
                    </span>
                    <span className="text-[10px] text-[#FFE3A0] font-semibold">AIR 3 Mentorship</span>
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-lg text-white">CS Professional — JUNE 2027</h4>
                    <p className="text-xs text-gray-400 font-poppins">Direct mentorship by AIR 3 Harkiran Kaur</p>
                  </div>

                  {/* Sub-options for Prof June 2027 */}
                  <div className="space-y-2.5">
                    {/* Prof Group 1 June 2027 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 1 — JUNE 2027</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[10px] text-gray-400 line-through">₹7,999</span>
                          <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹3,499/-</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        ESG, Drafting, Compliance &amp; Elective 1 (4 Papers)
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('june2027-prof-g1'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('june2027-prof-g1'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G1</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Prof Group 2 June 2027 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 2 — JUNE 2027</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[10px] text-gray-400 line-through">₹6,999</span>
                          <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹2,999/-</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        Strategic Mgmt, Restructuring &amp; IBC, Elective 2
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('june2027-prof-g2'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('june2027-prof-g2'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G2</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Prof Both Groups June 2027 */}
                    <div className="p-3 bg-gradient-to-r from-[#2A241A] to-[#1C1813] border-2 border-[#C8A45D] rounded-xl space-y-1.5 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#FFE3A0]">Both Groups — JUNE 2027</span>
                          <span className="px-1.5 py-0.5 bg-[#C8A45D] text-black text-[9px] font-extrabold rounded">50% OFF</span>
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[10px] text-gray-400 line-through">₹11,999</span>
                          <span className="font-cinzel text-lg font-black text-[#FFE3A0]">₹6,000/-</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-300 leading-tight">
                        All 7 Papers direct master mentorship with AIR 3 Ranker for June 2027
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('june2027-prof-both'))}
                          className="py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add Both
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('june2027-prof-both'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-black rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy Both</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =================== CURRENT SESSION COLUMNS (OCT/DEC 2026) =================== */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* COLUMN 1: CSEET */}
              <div className="p-5 bg-[#161616] border border-emerald-500/30 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[10px] font-montserrat font-bold uppercase">
                      Level 1 • Oct 2026
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">1st Call Free Demo</span>
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-lg text-white">CSEET Mentorship</h4>
                    <p className="text-xs text-gray-400 font-poppins">Complete ICSI Foundation 4-Paper Mentorship</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl space-y-1.5 text-xs text-gray-300 font-poppins">
                    <div className="text-[11px] font-bold text-[#C8A45D] uppercase tracking-wider">Subjects Covered:</div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 1: Business Communication</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 2: Fundamentals of Accounting</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 3: Economics &amp; Business Env.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11.5px] text-gray-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Paper 4: Business Laws &amp; Management</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-cinzel text-3xl font-black text-[#FFE3A0]">₹1,199/-</span>
                      <span className="text-xs text-gray-400 line-through">₹2,000</span>
                    </div>
                    <p className="text-[10px] text-gray-400">Includes daily study timetable, doubt solving &amp; routine check-ins.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => addToCart(getProduct('cseet-mentorship'))}
                    className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => buyNow(getProduct('cseet-mentorship'))}
                    className="py-2.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-montserrat font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase cursor-pointer hover:brightness-110 shadow-md transition-all"
                  >
                    <span>Instant Buy</span>
                    <Zap className="w-3.5 h-3.5 fill-black" />
                  </button>
                </div>
              </div>

              {/* COLUMN 2: CS EXECUTIVE (Group 1, Group 2, Both Groups) */}
              <div className="p-5 bg-[#161616] border border-amber-500/30 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md text-[10px] font-montserrat font-bold uppercase">
                      Level 2 • Dec 2026
                    </span>
                    <span className="text-[10px] text-[#FFE3A0] font-semibold">Dec '26 Exam Attempt</span>
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-lg text-white">CS Executive Mentorship</h4>
                    <p className="text-xs text-gray-400 font-poppins">Choose your specific group or enroll for both</p>
                  </div>

                  {/* Sub-options in Executive */}
                  <div className="space-y-2.5">
                    {/* Exec Group 1 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 1 (4 Subjects)</span>
                        <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹1,999/-</span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-tight">
                        JIGL, Company Law, SBLL, CAFM
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('exec-g1-mentorship'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('exec-g1-mentorship'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G1</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Exec Group 2 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 2 (3 Subjects)</span>
                        <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹1,699/-</span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-tight">
                        CMSL, ECIPL, Tax Laws &amp; Practice
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('exec-g2-mentorship'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('exec-g2-mentorship'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G2</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Exec Both Groups */}
                    <div className="p-3 bg-gradient-to-r from-[#2A241A] to-[#1C1813] border-2 border-[#C8A45D] rounded-xl space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#FFE3A0]">Both Groups (Whole)</span>
                          <span className="px-1.5 py-0.5 bg-[#C8A45D] text-black text-[9px] font-extrabold rounded">Save ₹449</span>
                        </div>
                        <span className="font-cinzel text-lg font-black text-[#FFE3A0]">₹3,249/-</span>
                      </div>
                      <p className="text-[10.5px] text-gray-300 leading-tight">
                        Complete 7-Paper Dual Group Mastery &amp; Mock Plan
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('exec-both-mentorship'))}
                          className="py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add Both
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('exec-both-mentorship'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-black rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy Both</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 3: CS PROFESSIONAL (Group 1, Group 2, Both Groups) */}
              <div className="p-5 bg-[#161616] border border-purple-500/30 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md text-[10px] font-montserrat font-bold uppercase">
                      Level 3 • AIR 3 Flagship
                    </span>
                    <span className="text-[10px] text-[#FFE3A0] font-semibold">Dec '26 Attempt</span>
                  </div>
                  <div>
                    <h4 className="font-cinzel font-bold text-lg text-white">CS Professional Mentorship</h4>
                    <p className="text-xs text-gray-400 font-poppins">Direct mentorship by AIR 3 Harkiran Kaur</p>
                  </div>

                  {/* Sub-options in Professional */}
                  <div className="space-y-2.5">
                    {/* Prof Group 1 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 1 (4 Subjects)</span>
                        <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹2,499/-</span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-tight">
                        ESG, Drafting &amp; Pleadings, Compliance &amp; Audit, Elective 1
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('prof-g1-mentorship'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('prof-g1-mentorship'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G1</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Prof Group 2 */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">Group 2 (3 Subjects)</span>
                        <span className="font-cinzel text-base font-bold text-[#FFE3A0]">₹1,999/-</span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 leading-tight">
                        Strategic Management, Restructuring &amp; IBC, Elective 2
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('prof-g2-mentorship'))}
                          className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('prof-g2-mentorship'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy G2</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>

                    {/* Prof Both Groups */}
                    <div className="p-3 bg-gradient-to-r from-[#2A241A] to-[#1C1813] border-2 border-[#C8A45D] rounded-xl space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#FFE3A0]">Both Groups (Whole)</span>
                          <span className="px-1.5 py-0.5 bg-[#C8A45D] text-black text-[9px] font-extrabold rounded">AIR 3 Elite</span>
                        </div>
                        <span className="font-cinzel text-lg font-black text-[#FFE3A0]">₹3,999/-</span>
                      </div>
                      <p className="text-[10.5px] text-gray-300 leading-tight">
                        All 7 Papers direct mentorship with AIR 3 Ranker
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => addToCart(getProduct('prof-both-mentorship'))}
                          className="py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add Both
                        </button>
                        <button
                          onClick={() => buyNow(getProduct('prof-both-mentorship'))}
                          className="py-1.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-black rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Buy Both</span>
                          <Zap className="w-3 h-3 fill-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Aligned Row: 12th Career Roadmap & Counselling */}
          <div className="pt-4 border-t border-[#C8A45D]/30 space-y-3">
            <div className="text-[11px] font-montserrat font-bold text-[#C8A45D] uppercase tracking-wider">
              Specialized 1-on-1 Strategic Guidance
            </div>

            <div className="p-6 bg-gradient-to-r from-[#221E19] via-[#1A1815] to-[#151412] border border-[#C8A45D]/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-md text-[10px] font-montserrat font-bold uppercase">
                    Post 12th Strategy Session
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded font-bold text-[10px]">
                    1-on-1 45 Min Private Call
                  </span>
                </div>
                <div>
                  <h4 className="font-cinzel font-bold text-xl text-white">
                    12th Career Counselling & Strategy Session
                  </h4>
                  <p className="text-xs text-gray-300 font-poppins">
                    Personal 1-on-1 roadmap session to build your 3-year CS execution blueprint directly with AIR 3 Harkiran Kaur.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-300 font-poppins pt-1">
                  <div className="flex items-center gap-1.5 text-[11.5px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>CS vs CA vs Law comparison</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11.5px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>College + CS balance strategy</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11.5px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Articleship & Big 4 career roadmap</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 shrink-0 w-full md:w-auto">
                <div className="flex items-baseline gap-2">
                  <span className="font-cinzel text-3xl font-black text-[#FFE3A0]">₹999/-</span>
                  <span className="text-xs text-gray-400 line-through">₹1,800</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">Save 45%</span>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => addToCart(getProduct('career-counselling-12th'))}
                    className="flex-1 md:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => buyNow(getProduct('career-counselling-12th'))}
                    className="flex-1 md:flex-initial px-6 py-2.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-montserrat font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 uppercase cursor-pointer hover:brightness-110 shadow-md transition-all whitespace-nowrap"
                  >
                    <span>Instant Buy</span>
                    <Zap className="w-3.5 h-3.5 fill-black" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* HK StudyTrack Pro – CS Progress Index (Self-Study Tracking Product) */}
          <div className="pt-6 border-t border-[#C8A45D]/30 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest block">
                  Self-Study Syllabus &amp; Revision Index
                </span>
                <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  HK StudyTrack Pro – CS Progress Index
                </h4>
              </div>
              <span className="text-xs bg-amber-500/20 text-[#FFE3A0] border border-amber-500/40 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                100% Student-Editable in Portal &bull; From ₹699/-
              </span>
            </div>

            {/* Featured Graphic Spotlight */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171512] to-[#0D0C0A] border-2 border-[#C8A45D]/50 rounded-2xl flex flex-col md:flex-row items-center gap-5 shadow-xl">
              <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden border border-[#C8A45D]/40 shrink-0 relative group">
                <img
                  src={studyTrackGraphicImg}
                  alt="HK StudyTrack Pro Console Graphic"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[#FFE3A0] border border-[#C8A45D]/50 text-[9px] font-bold rounded-full">
                  AIR 3 Pro Tracker
                </div>
              </div>

              <div className="space-y-2 flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-2.5 py-0.5 bg-[#C8A45D]/20 text-[#FFE3A0] text-[10px] font-extrabold rounded-full uppercase">
                    Interactive Syllabus Mapping
                  </span>
                  <span className="text-[11px] text-gray-400">Official ICSI Syllabus Mapping</span>
                </div>
                <h5 className="font-cinzel text-base sm:text-lg font-bold text-white">
                  Portable Index Simulator &amp; Revision Console
                </h5>
                <p className="text-xs text-gray-300 font-poppins leading-relaxed">
                  Audit your lectures, verify 3-stage revision milestones, check chapter weightage, and flag tricky doubts. Available for instant tracking in your personal Student Portal.
                </p>
              </div>
            </div>

            {/* 7 Official Product Cards for HK StudyTrack Pro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
              {/* 1. CSEET */}
              <div className="p-4 bg-gradient-to-b from-[#1C1A16] to-[#12110F] border border-emerald-500/30 rounded-2xl flex flex-col justify-between space-y-3 shadow-md">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded uppercase">
                    CSEET (Level 1)
                  </span>
                  <h5 className="font-cinzel text-sm font-bold text-white">Full CSEET Index</h5>
                  <p className="text-[11px] text-gray-400">All 4 ICSI Foundation Papers with full chapter index &amp; revision milestones.</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-cinzel text-xl font-extrabold text-[#FFE3A0]">₹699/-</span>
                    <span className="text-[10px] text-gray-400 line-through">₹1,499</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(getProduct('hk-studytrack-cseet'))}
                      className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                    </button>
                    <button
                      onClick={() => buyNow(getProduct('hk-studytrack-cseet'))}
                      className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[10.5px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy ₹699</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Executive Group 1 */}
              <div className="p-4 bg-gradient-to-b from-[#1C1A16] to-[#12110F] border border-amber-500/30 rounded-2xl flex flex-col justify-between space-y-3 shadow-md">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded uppercase">
                    CS Executive Group 1
                  </span>
                  <h5 className="font-cinzel text-sm font-bold text-white">Executive Group 1 Index</h5>
                  <p className="text-[11px] text-gray-400">JIGL, Company Law, SBLL, CAFM complete chapter tracker.</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-cinzel text-xl font-extrabold text-[#FFE3A0]">₹899/-</span>
                    <span className="text-[10px] text-gray-400 line-through">₹1,999</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(getProduct('hk-studytrack-exec-g1'))}
                      className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                    </button>
                    <button
                      onClick={() => buyNow(getProduct('hk-studytrack-exec-g1'))}
                      className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[10.5px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy ₹899</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. Executive Group 2 */}
              <div className="p-4 bg-gradient-to-b from-[#1C1A16] to-[#12110F] border border-amber-500/30 rounded-2xl flex flex-col justify-between space-y-3 shadow-md">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded uppercase">
                    CS Executive Group 2
                  </span>
                  <h5 className="font-cinzel text-sm font-bold text-white">Executive Group 2 Index</h5>
                  <p className="text-[11px] text-gray-400">CMSL, ECIPL, Tax Laws complete chapter tracker.</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-cinzel text-xl font-extrabold text-[#FFE3A0]">₹799/-</span>
                    <span className="text-[10px] text-gray-400 line-through">₹1,799</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(getProduct('hk-studytrack-exec-g2'))}
                      className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                    </button>
                    <button
                      onClick={() => buyNow(getProduct('hk-studytrack-exec-g2'))}
                      className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[10.5px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy ₹799</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Executive Both Groups */}
              <div className="p-4 bg-gradient-to-b from-[#241F16] to-[#16130E] border-2 border-[#C8A45D] rounded-2xl flex flex-col justify-between space-y-3 shadow-lg">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#C8A45D] text-black text-[9px] font-extrabold rounded uppercase">
                      Executive Both Groups
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">Best Value</span>
                  </div>
                  <h5 className="font-cinzel text-sm font-bold text-[#FFE3A0]">Combined Index (G1+G2)</h5>
                  <p className="text-[11px] text-gray-300">All 7 Executive papers combined tracker with dual group mastery index.</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-cinzel text-xl font-extrabold text-[#FFE3A0]">₹1,499/-</span>
                    <span className="text-[10px] text-gray-400 line-through">₹2,999</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(getProduct('hk-studytrack-exec-both'))}
                      className="py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                    </button>
                    <button
                      onClick={() => buyNow(getProduct('hk-studytrack-exec-both'))}
                      className="py-1.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-black rounded-lg text-[10.5px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy ₹1,499</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Professional Group 1 */}
              <div className="p-4 bg-gradient-to-b from-[#1C1A16] to-[#12110F] border border-purple-500/30 rounded-2xl flex flex-col justify-between space-y-3 shadow-md">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded uppercase">
                    Professional Group 1
                  </span>
                  <h5 className="font-cinzel text-sm font-bold text-white">Professional Group 1 Index</h5>
                  <p className="text-[11px] text-gray-400">ESG, Drafting &amp; Pleadings, Compliance &amp; Audit, Elective 1.</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-cinzel text-xl font-extrabold text-[#FFE3A0]">₹999/-</span>
                    <span className="text-[10px] text-gray-400 line-through">₹2,199</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(getProduct('hk-studytrack-prof-g1'))}
                      className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                    </button>
                    <button
                      onClick={() => buyNow(getProduct('hk-studytrack-prof-g1'))}
                      className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[10.5px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy ₹999</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 6. Professional Group 2 */}
              <div className="p-4 bg-gradient-to-b from-[#1C1A16] to-[#12110F] border border-purple-500/30 rounded-2xl flex flex-col justify-between space-y-3 shadow-md">
                <div className="space-y-1.5">
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded uppercase">
                    Professional Group 2
                  </span>
                  <h5 className="font-cinzel text-sm font-bold text-white">Professional Group 2 Index</h5>
                  <p className="text-[11px] text-gray-400">Strategic Management, Corporate Restructuring &amp; IBC, Elective 2.</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-cinzel text-xl font-extrabold text-[#FFE3A0]">₹899/-</span>
                    <span className="text-[10px] text-gray-400 line-through">₹1,999</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => addToCart(getProduct('hk-studytrack-prof-g2'))}
                      className="py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add
                    </button>
                    <button
                      onClick={() => buyNow(getProduct('hk-studytrack-prof-g2'))}
                      className="py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-extrabold rounded-lg text-[10.5px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy ₹899</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 7. Professional Both Groups */}
              <div className="p-4 bg-gradient-to-b from-[#241F16] to-[#16130E] border-2 border-[#C8A45D] rounded-2xl flex flex-col justify-between space-y-3 shadow-lg sm:col-span-2 lg:col-span-2">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#C8A45D] text-black text-[9px] font-extrabold rounded uppercase">
                      Professional Both Groups
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">Comprehensive Ranker Blueprint</span>
                  </div>
                  <h5 className="font-cinzel text-sm font-bold text-[#FFE3A0]">Professional Combined Index (Both Groups)</h5>
                  <p className="text-[11px] text-gray-300">All 7 Professional syllabus papers combined with complete revision tracking.</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-baseline justify-between">
                    <span className="font-cinzel text-xl font-extrabold text-[#FFE3A0]">₹1,699/-</span>
                    <span className="text-[10px] text-gray-400 line-through">₹3,499</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(getProduct('hk-studytrack-prof-both'))}
                      className="py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A45D]" /> Add Both
                    </button>
                    <button
                      onClick={() => buyNow(getProduct('hk-studytrack-prof-both'))}
                      className="py-1.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-black rounded-lg text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Buy Combined ₹1,699</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT HK & FOUNDER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F0F0F] border border-[#C8A45D]/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl text-white">
          <div className="max-w-4xl mx-auto space-y-5 text-left sm:text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#C8A45D]/20 border border-[#C8A45D]/60 rounded-full text-[#FFE3A0] text-xs font-bold font-montserrat mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>CS Qualified at the Age of 19 Years • AIR 3 Ranker</span>
            </div>
            <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest block">
              Why I Started "The Code" & My Promise
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              From Struggle to Complete Calmness
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-poppins">
              I carved my path through the CS syllabus entirely on my own, guided by just a single mentor, and went on to <strong>qualify as a Company Secretary at the young age of 19 years</strong> with <strong>All India Rank 3 (AIR 3) in CS Professional</strong>. Because I walked this road independently, I have faced the exact on-ground realities, overwhelming syllabus volumes, and intense pressures that you are facing right now.
            </p>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-poppins">
              I didn't launch this to build a massive, distant coaching institute. I created HK Code of Rankers because aspirants don't need another generic video lecture player—they need an anchor who understands the mental battle and guides them from deep anxiety to complete calmness.
            </p>
            <div className="p-5 bg-[#181818] border-l-4 border-l-[#C8A45D] border border-[#C8A45D]/30 rounded-r-2xl space-y-3 text-xs sm:text-sm text-gray-300 leading-relaxed font-poppins text-left">
              <p className="font-semibold text-white">
                At HK Code of Rankers, we believe success in Company Secretary examinations is not achieved through mindless rote learning, but through disciplined execution, structured target planning, and continuous personal mentoring.
              </p>
              <p>
                Every aspirant receives focused guidance through daily preparation schedules, habit tracking, and 1-on-1 performance review calls designed to build unwavering confidence before entering the examination hall.
              </p>
            </div>
            <div className="pt-2 flex justify-start sm:justify-center">
              <button
                onClick={() => onNavigate('founder')}
                className="px-6 py-3 bg-[#C8A45D] hover:bg-[#FFE3A0] text-black rounded-xl text-xs font-montserrat font-bold transition-colors cursor-pointer inline-flex items-center gap-2 shadow-md"
              >
                <span>Read Full Founder's Story & Promise</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US - 6 CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest">
            Unmatched Advantages
          </span>
          <h2 className="font-cinzel text-3xl font-bold text-[#0F0F0F]">
            Why Choose HK Code of Rankers?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-3 hover:border-[#C8A45D] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">Personal Mentorship</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Direct guidance from Harkiran Kaur Kohli (AIR 3) with customized study schedules crafted for your speed.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-3 hover:border-[#C8A45D] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">Structured Study Plans</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Day-by-day micro targets so you never sit confused wondering what chapter to read next.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-3 hover:border-[#C8A45D] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">Performance Analysis</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Weekly progress audits highlighting your strong and weak topics in Company Law, Tax, and Drafting.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-3 hover:border-[#C8A45D] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">1st Call 100% Free Demo</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Schedule your first 30-minute guidance call with Harkiran Ma'am completely free before choosing any paid program.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-3 hover:border-[#C8A45D] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">One-to-One Support</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Schedule direct voice calls or send WhatsApp notes whenever you face conceptual blocks or exam stress.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-3 hover:border-[#C8A45D] transition-all shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">Motivation & Accountability</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Daily check-ins ensure you maintain consistency right up to the final exam paper.
            </p>
          </div>
        </div>
      </section>



      {/* 8. RAW & TRANSPARENT MENTORSHIP CHARTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest bg-[#C8A45D]/20 px-3.5 py-1 rounded-full border border-[#C8A45D]/40">
            Our Authenticity & Transparency Charter
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0F0F0F]">
            Zero Fake Results. No Marketing Gimmicks. <br className="hidden sm:inline" />
            <span className="text-[#8A651E]">100% Real Guidance from AIR 3 Harkiran Kaur</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 font-poppins leading-relaxed">
            In an industry filled with purchased ranker posters and fabricated claims, HK Code of Rankers stands for raw transparency. We are starting our personal mentorship cohorts with honest facts, direct accountability, and a free demo call.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[#C8A45D]/40 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-[#8A651E] flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">
              Direct AIR 3 Mentorship
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-poppins leading-relaxed">
              Harkiran Kaur Kohli secured <strong>All India Rank 3 in CS Professional</strong> through self-study, disciplined routines, and statutory answer drafting. You will learn directly from her without third-party tutors.
            </p>
          </div>

          <div className="bg-white border-2 border-[#C8A45D]/40 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">
              1st Call Free Demo Session
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-poppins leading-relaxed">
              We never ask you to buy blindly. Book a <strong>100% Free 1-on-1 Guidance Call</strong> to experience the mentorship depth, review your preparation status, and receive a customized roadmap before enrolling.
            </p>
          </div>

          <div className="bg-white border-2 border-[#C8A45D]/40 rounded-3xl p-8 space-y-4 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-800 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">
              Max 25 Students Per Level
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-poppins leading-relaxed">
              Mass coaching with hundreds of students leaves aspirants invisible. Our cohort is strictly capped at 25 seats so your daily logs, answer sheets, and doubts receive genuine individual attention.
            </p>
          </div>
        </div>

        {/* Highlight 5% Next Offer Banner */}
        <div className="bg-gradient-to-r from-[#1A1816] via-[#121110] to-[#1A1816] border-2 border-[#C8A45D] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A45D] text-black font-montserrat font-extrabold text-[10px] rounded-full uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5" />
              <span>OFFER UPDATE: 1ST 10 GOT THEIR OFFERS</span>
            </div>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#FFE3A0]">
              Next Offer: 5% Off Mentorship with Code <span className="font-mono text-white underline">NEXT5</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 font-poppins max-w-xl">
              1st 10 got their offers! Next offer: Get 5% OFF on all 1-on-1 Mentorship programs. Answersheet Analysis Report available at flat ₹699 per subject.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText('NEXT5');
                alert('Discount Code "NEXT5" copied to clipboard! Apply at checkout.');
              }}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-[#FFE3A0] border border-[#C8A45D]/60 rounded-xl text-xs font-bold font-montserrat transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C8A45D]" />
              <span>Copy Code: NEXT5</span>
            </button>
            <button
              onClick={onOpenCounsellingModal}
              className="px-6 py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:brightness-110 text-black font-montserrat font-extrabold text-xs rounded-xl shadow-lg uppercase cursor-pointer tracking-wider"
            >
              Book Free Demo Call
            </button>
          </div>
        </div>
      </section>

      {/* 9. FAQ & HELP CENTER SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest bg-[#C8A45D]/20 px-3.5 py-1 rounded-full border border-[#C8A45D]/40">
            Aspirant FAQs & Help Desk
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0F0F0F]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-poppins">
            Everything you need to know about our mentorship batches, pricing, demo calls, and support.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#C8A45D]/30 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-cinzel text-sm sm:text-base font-bold text-[#0F0F0F] hover:text-[#8A651E] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C8A45D] shrink-0 transition-transform ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-700 leading-relaxed font-poppins border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dedicated Help & WhatsApp Assistance Block */}
        <div className="bg-[#F8F6F2] border border-[#C8A45D]/40 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">
            Need Immediate Help or Guidance?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto font-poppins">
            Speak directly with Harkiran Kaur Kohli's desk or message us on WhatsApp for any inquiries regarding syllabus, schedule, or batch registration.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://wa.me/919284084523?text=Hi%20Harkiran%20Maam,%20I%20have%20a%20query%20about%20the%2025-seat%20CS%20Mentorship%20Batch."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-montserrat font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 92840 84523)</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#0F0F0F] border border-gray-300 font-montserrat font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-[#8A651E]" />
              <span>Contact Mentorship Desk</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1C1917] via-[#141210] to-[#0A0A0A] border-2 border-[#C8A45D] rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A45D]/15 rounded-full blur-3xl pointer-events-none" />
          <span className="inline-block px-4 py-1.5 bg-[#C8A45D]/20 border border-[#C8A45D]/40 rounded-full text-xs font-montserrat font-bold text-[#FFE3A0] uppercase tracking-wider">
            October & December 2026 Mentorship Batches
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto leading-tight">
            Take Your First Step Today with a <span className="text-[#FFE3A0]">Free 1-on-1 Guidance Call</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto font-poppins leading-relaxed">
            Strictly limited to 25 aspirants per level. Experience our mentorship demo call with Harkiran Kaur Kohli (AIR 3) and unlock your path to becoming a qualified Company Secretary.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenCounsellingModal}
              className="px-8 py-4 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-full shadow-xl shadow-[#C8A45D]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-black" />
              <span>Claim Free 1:1 Demo Guidance Call</span>
            </button>
            <button
              onClick={() => onNavigate('programs')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-montserrat font-bold text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore All 3 Level Programs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Answersheet Subject Selection Modal */}
      <AnswersheetSubjectModal
        isOpen={isAnswersheetModalOpen}
        onClose={() => setIsAnswersheetModalOpen(false)}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />
    </div>
  );
};
