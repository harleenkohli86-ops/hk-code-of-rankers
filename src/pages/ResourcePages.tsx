import React, { useState } from 'react';
import { PageId } from '../types';
import { saveEnrollment } from '../lib/backend';
import {
  Award,
  Star,
  Download,
  FileText,
  Search,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  BookOpen,
  Copy,
  MessageCircle,
  Sparkles,
  Percent,
  MessageSquare,
  FileCheck,
  Layers,
  GraduationCap,
  Database,
  Loader2,
} from 'lucide-react';

interface PageProps {
  onNavigate: (page: PageId) => void;
  onOpenJoinModal: () => void;
  onOpenCounsellingModal: () => void;
}

export const ResultsPage: React.FC<PageProps> = ({ onNavigate, onOpenCounsellingModal }) => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-poppins">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest bg-[#C8A45D]/20 px-3.5 py-1 rounded-full border border-[#C8A45D]/40">
          Our Raw & Transparent Pledge
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#0F0F0F] leading-tight">
          Zero Fake Results. <span className="text-[#8A651E]">100% Real Mentorship.</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          At HK Code of Rankers, we do not fabricate fake student scorecards, purchase topper pictures, or make unrealistic promises. We believe in complete transparency and real daily work under <strong>Harkiran Kaur Kohli (AIR 3 • CS Professional)</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[#C8A45D]/40 rounded-3xl space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">AIR 3 Verified Track Record</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Our Head Mentor Harkiran Kaur Kohli secured <strong>All India Rank 3 in CS Professional</strong> through pure self-discipline, structured notes, and statutory drafting techniques. She mentors you directly without intermediaries.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#C8A45D]/40 rounded-3xl space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">1st Call 100% Free Demo</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Don't trust marketing claims—test our mentorship yourself. Book your <strong>1st 1-on-1 Guidance Call completely free</strong>. If you feel value and clarity, only then consider enrolling in our capped 25-seat batch.
          </p>
        </div>

        <div className="p-6 bg-white border border-[#C8A45D]/40 rounded-3xl space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">Strictly 25 Aspirants Capped</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We refuse to run mass broadcast batches with hundreds of students. Every aspirant in our cohort gets their daily study targets checked, answer sheets reviewed line-by-line, and personal doubt calls.
          </p>
        </div>
      </div>

      {/* 25% Discount Highlight */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-[#1C1917] to-[#12100E] border-2 border-[#C8A45D] rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="px-3 py-1 bg-[#C8A45D] text-black font-montserrat font-extrabold text-[10px] rounded-full uppercase tracking-wider">
            Mentorship Offer Update
          </span>
          <h3 className="font-cinzel text-2xl font-bold text-[#FFE3A0]">
            1st 10 Got Their Offers! Next: 5% OFF on Mentorship
          </h3>
          <p className="text-xs text-gray-300 font-poppins">
            Apply code <span className="text-[#FFE3A0] font-mono font-bold bg-white/10 px-2 py-0.5 rounded">NEXT5</span> across CSEET, CS Executive, and CS Professional mentorship programs.
          </p>
        </div>
        <button
          onClick={onOpenCounsellingModal}
          className="px-6 py-3.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-full shadow-lg hover:brightness-110 uppercase cursor-pointer whitespace-nowrap"
        >
          Book Free 1st Demo Call
        </button>
      </div>
    </div>
  );
};

export const TestimonialsPage: React.FC<PageProps> = ({ onNavigate, onOpenCounsellingModal }) => {
  return <ResultsPage onNavigate={onNavigate} onOpenJoinModal={() => {}} onOpenCounsellingModal={onOpenCounsellingModal} />;
};

export const FreeResourcesPage: React.FC<PageProps> = () => {
  const upcomingNotes = [
    { title: 'Company Law Sec 149-172 Board Composition & Powers Summary Chart', category: 'Executive G1', status: 'Coming Soon' },
    { title: 'ICSI GST Amendment Tracker & Notification Digest (Dec 2026)', category: 'Executive G2', status: 'Coming Soon' },
    { title: 'JIGL Interpretation of Statutes & Deed Drafting Master Sheet', category: 'Executive G1', status: 'Coming Soon' },
    { title: 'CSEET Business Communication & Legal Aptitude Rapid Summary', category: 'Level 1 CSEET', status: 'Coming Soon' },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest">
          Study Materials
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0F0F0F]">Free Notes & Amendment Sheets</h1>
        <p className="text-xs sm:text-sm text-gray-600 font-poppins">
          Handwritten summary charts, statutory tables, and amendment trackers curated by AIR 3 Harkiran Kaur.
        </p>
      </div>

      {/* Starting Soon Announcement Banner */}
      <div className="p-8 bg-gradient-to-r from-[#FAF7F2] via-[#FFFDF9] to-[#FAF7F2] border-2 border-dashed border-[#C8A45D] rounded-3xl text-center space-y-4 shadow-sm max-w-3xl mx-auto">
        <span className="px-4 py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black text-xs font-montserrat font-extrabold uppercase tracking-wider rounded-full inline-block shadow-xs">
          ⚡ Will Be Launching Soon
        </span>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#0F0F0F]">
          Free Notes & Amendment Sheets — Launching Soon!
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-poppins max-w-xl mx-auto leading-relaxed">
          We are in the process of compiling high-yield statutory summary charts, case law digests, and revision tables curated by AIR 3 Harkiran Kaur. Free downloads will be launching soon.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F] text-center">
          Upcoming Notes Lineup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingNotes.map((res, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-[#C8A45D]/30 rounded-2xl flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/15 text-[#8A651E] flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F0F0F] text-xs leading-snug">{res.title}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{res.category}</p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-[#FAF5E9] text-[#8A651E] text-[10px] font-montserrat font-bold rounded-lg shrink-0 border border-[#C8A45D]/30">
                Starting Soon
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* NEW SECTION: Test Series for All Three Levels Launching Soon */}
      <div className="max-w-5xl mx-auto space-y-6 pt-6 border-t border-[#C8A45D]/30">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#C8A45D]/15 border border-[#C8A45D]/40 rounded-full text-[#8A651E] text-xs font-montserrat font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#8A651E]" />
            <span>High-Yield Evaluated Resource</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#0F0F0F]">
            Test Series for All Three Levels — Launching Soon!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-poppins max-w-2xl mx-auto">
            Rigorous, ICSI pattern test series with line-by-line evaluated answer sheet reviews and model answers curated by AIR 3 Harkiran Kaur Kohli. Launching soon across CSEET, CS Executive, and CS Professional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEVEL 1: CSEET */}
          <div className="p-6 bg-white border-2 border-emerald-500/40 rounded-3xl space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-emerald-500/15 text-emerald-800 font-montserrat font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                  Level 1 • CSEET
                </span>
                <span className="px-2 py-0.5 bg-amber-500/15 text-amber-800 font-bold text-[10px] rounded">
                  Launching Soon
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-black text-sm">
                <GraduationCap className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">
                CSEET Full Syllabus Test Series
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                Complete mock test papers covering all 4 subjects (Business Communication, Legal Aptitude, Economics, Current Affairs) with detailed answer key & instant score diagnostics.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700 font-poppins pt-2 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Timed CBT-pattern mock exam simulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Topic-wise high probability MCQs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Speed and accuracy optimization guide</span>
                </li>
              </ul>
            </div>
            <div className="pt-3">
              <div className="w-full py-2 bg-emerald-50 text-emerald-800 text-center rounded-xl text-xs font-montserrat font-bold border border-emerald-200">
                Level 1 • Launching Soon
              </div>
            </div>
          </div>

          {/* LEVEL 2: CS EXECUTIVE */}
          <div className="p-6 bg-white border-2 border-[#C8A45D] rounded-3xl space-y-4 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-[#C8A45D]/20 text-[#8A651E] font-montserrat font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                  Level 2 • CS Executive
                </span>
                <span className="px-2 py-0.5 bg-amber-500/15 text-amber-800 font-bold text-[10px] rounded">
                  Launching Soon
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center font-black text-sm">
                <FileCheck className="w-6 h-6 text-[#8A651E]" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">
                CS Executive Evaluated Test Series (G1 + G2)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                Chapter-wise unit tests and full 100-mark pre-exam simulated test papers for Group 1 and Group 2 with strict ICSI marking criteria and individual evaluated feedback.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700 font-poppins pt-2 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
                  <span>Company Law, JIGL, SBEC, CAFM, CMSL & ECIPL</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
                  <span>Step-by-step mark deduction reasons</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
                  <span>ICSI model answers & legal drafting checklist</span>
                </li>
              </ul>
            </div>
            <div className="pt-3">
              <div className="w-full py-2 bg-amber-50 text-[#8A651E] text-center rounded-xl text-xs font-montserrat font-bold border border-[#C8A45D]/40">
                Level 2 • Launching Soon
              </div>
            </div>
          </div>

          {/* LEVEL 3: CS PROFESSIONAL FIELD */}
          <div className="p-6 bg-white border-2 border-indigo-500/40 rounded-3xl space-y-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-indigo-500/15 text-indigo-800 font-montserrat font-extrabold text-[10px] rounded-full uppercase tracking-wider">
                  Level 3 • CS Professional
                </span>
                <span className="px-2 py-0.5 bg-amber-500/15 text-amber-800 font-bold text-[10px] rounded">
                  Launching Soon
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-800 flex items-center justify-center font-black text-sm">
                <Layers className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F]">
                CS Professional Evaluated Test Series (G1 + G2)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-poppins">
                Master-level case laws, drafting problems, and strategic case study analysis tests designed by AIR 3 to help you hit 60+ exemptions in professional finals.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-700 font-poppins pt-2 border-t border-gray-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Drafting, ESG, Due Diligence & Restructuring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Direct diagnostic review by AIR 3 Harkiran Kaur</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Statutory citation & legal drafting templates</span>
                </li>
              </ul>
            </div>
            <div className="pt-3">
              <div className="w-full py-2 bg-indigo-50 text-indigo-800 text-center rounded-xl text-xs font-montserrat font-bold border border-indigo-200">
                Level 3 • Launching Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BlogPage: React.FC<PageProps> = () => {
  const upcomingPosts = [
    {
      category: 'Company Law',
      title: 'How to Write ICSI Compliant Legal Answers in Company Law',
      desc: 'The 4-part legal answer structure: Facts of Case, Applicable Section & Rules, Legal Analysis, and Conclusion under ICSI valuation standards.',
      readTime: '5 min read',
    },
    {
      category: 'Time Management',
      title: 'Managing Both Groups in CS Executive Without Burnout',
      desc: 'A practical daily study timetable balancing law revision with practical subject CAFM calculations and 3 revision cycles.',
      readTime: '4 min read',
    },
    {
      category: 'Exam Strategy',
      title: 'Common Mistakes in ICSI Certified Copies & How to Avoid Them',
      desc: 'Analysis of why students lose step-marking in practical case problems and how concise statutory citations unlock exemptions.',
      readTime: '6 min read',
    },
    {
      category: 'Ranker Blueprint',
      title: 'From Syllabus Overwhelm to AIR 3: The Revision Method',
      desc: 'The exact note-making, target tracking, and mock exam review rhythms practiced by Harkiran Kaur.',
      readTime: '7 min read',
    },
  ];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest">
          Rankers Blog
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0F0F0F]">Exam Strategies & Law Insights</h1>
        <p className="text-xs sm:text-sm text-gray-600 font-poppins">
          Actionable advice on CS exam preparation, answer writing techniques, and time management.
        </p>
      </div>

      {/* Starting Soon Announcement Banner */}
      <div className="p-8 bg-gradient-to-r from-[#FAF7F2] via-[#FFFDF9] to-[#FAF7F2] border-2 border-dashed border-[#C8A45D] rounded-3xl text-center space-y-4 shadow-sm max-w-3xl mx-auto">
        <span className="px-4 py-1.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black text-xs font-montserrat font-extrabold uppercase tracking-wider rounded-full inline-block shadow-xs">
          ⚡ Will Be Launching Soon
        </span>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#0F0F0F]">
          Ranker Strategy Blog & Articles — Launching Soon!
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-poppins max-w-xl mx-auto leading-relaxed">
          We are currently writing detailed step-by-step guides, answer writing templates, and exam strategy breakdowns authored directly by AIR 3 Harkiran Kaur. New articles will be launching soon.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        <h3 className="font-cinzel text-lg font-bold text-[#0F0F0F] text-center">
          Upcoming Article Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingPosts.map((post, idx) => (
            <div key={idx} className="bg-white border border-[#C8A45D]/30 rounded-2xl p-6 space-y-3 shadow-sm hover:border-[#C8A45D] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#8A651E] bg-[#FAF5E9] px-2.5 py-1 rounded-full uppercase">
                  {post.category}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">Starting Soon</span>
              </div>
              <h4 className="font-cinzel text-lg font-bold text-[#0F0F0F]">
                {post.title}
              </h4>
              <p className="text-xs text-gray-600 font-poppins leading-relaxed">
                {post.desc}
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-poppins">
                <span>By Harkiran Kaur (AIR 3)</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FAQPage: React.FC<PageProps> = ({ onOpenCounsellingModal, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mentorship' | 'pricing' | 'calls' | 'counselling'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [copiedDiscount, setCopiedDiscount] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('NEXT5');
    setCopiedDiscount(true);
    setTimeout(() => setCopiedDiscount(false), 3000);
  };

  const allFaqs = [
    {
      category: 'mentorship',
      q: 'Why is each mentorship cohort strictly capped at 25 students per level?',
      a: 'Unlike mass-coaching factories with 300+ students in a single batch, Harkiran Kaur Kohli (AIR 3) personally monitors each student daily. A 25-seat cap ensures she can review your daily logged study hours, check your answer drafts line-by-line, and provide personalized voice-note guidance on WhatsApp whenever you feel stuck.',
    },
    {
      category: 'calls',
      q: 'How does the Free 1-on-1 Guidance Demo Call work?',
      a: 'Before paying a single rupee, any CS aspirant can book a 30-minute private 1-on-1 session directly with Harkiran Ma\'am. During this call, she will audit your current preparation status, identify weak subjects, create a realistic timetable for your attempt, and show you exactly how our mentorship works. There is zero obligation to enroll.',
    },
    {
      category: 'pricing',
      q: 'What discount offers are currently running?',
      a: 'The 1st 10 students have already received their early bird offers! For new enrollments, you can use coupon code NEXT5 at checkout to receive an instant 5% discount on all mentorship programs.',
    },
    {
      category: 'pricing',
      q: 'What is the price breakdown for all programs?',
      a: 'CSEET Oct 2026: ₹1,199 | CS Executive G1: ₹1,999 | CS Executive G2: ₹1,699 | CS Executive Both: ₹3,249 | CS Professional G1: ₹2,499 | CS Professional G2: ₹1,999 | CS Professional Both: ₹3,999 | 12th Career Counselling: ₹999 | Answersheet Analysis Report: ₹699 per subject.',
    },
    {
      category: 'counselling',
      q: 'What is the 12th CS Career Roadmap & Counselling program (₹999)?',
      a: 'Specially created for students who have passed 12th standard and are evaluating Company Secretary vs CA vs Law. Harkiran Ma\'am conducts a dedicated 1-on-1 career mapping session discussing compensation expectations, ICSI registration, college selection (regular vs correspondence), and a 3-year execution plan.',
    },
    {
      category: 'mentorship',
      q: 'What is the status of the evaluated Test Series?',
      a: 'To keep our launch completely focused and transparent, test series evaluations are built directly into our full 1-on-1 mentorship programs rather than sold as generic bulk paper packs. In our 25-seat batch, your answer presentations are evaluated line-by-line with ICSI examiner feedback within 48 hours.',
    },
    {
      category: 'calls',
      q: 'How frequently will 1-on-1 calls happen during the mentorship?',
      a: 'You get scheduled 1-on-1 strategy calls with Harkiran Ma\'am (weekly/bi-weekly depending on phase) plus 24/7 direct WhatsApp access for urgent doubts, mental stamina check-ins, and study milestones.',
    },
  ];

  const filteredFaqs = allFaqs.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-poppins">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest bg-[#C8A45D]/20 px-3.5 py-1 rounded-full border border-[#C8A45D]/40">
          Aspirant Help & Knowledge Base
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#0F0F0F] leading-tight">
          Frequently Asked Questions & <span className="text-[#8A651E]">Support</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Clear, honest, and transparent answers to everything about our 25-seat mentorship batches, pricing, demo calls, and ICSI exam strategies.
        </p>
      </div>

      {/* Discount Highlight Box */}
      <div className="p-6 bg-gradient-to-r from-[#1C1917] via-[#141210] to-[#0A0A0A] border-2 border-[#C8A45D] rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <span className="px-3 py-1 bg-[#C8A45D] text-black font-montserrat font-extrabold text-[10px] rounded-full uppercase tracking-wider">
            🔥 1st 10 Got Their Offers! Next Offer Live
          </span>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#FFE3A0]">
            Use Coupon Code: <span className="font-mono text-white underline">NEXT5</span>
          </h3>
          <p className="text-xs text-gray-300">
            Get <strong>5% OFF on Mentorship</strong> programs. Answersheet Analysis evaluated at ₹699/subject!
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleCopyCode}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-[#FFE3A0] border border-[#C8A45D]/60 rounded-xl text-xs font-bold font-montserrat transition-all cursor-pointer flex items-center gap-2"
          >
            {copiedDiscount ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedDiscount ? 'Copied: NEXT5' : 'Copy Discount Code'}</span>
          </button>
          <button
            onClick={onOpenCounsellingModal}
            className="px-5 py-3 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-xl hover:brightness-110 uppercase cursor-pointer"
          >
            Book Free Demo Call
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., 'batch size', 'pricing', 'demo call', 'test series')..."
            className="w-full bg-white border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] pl-12 pr-4 py-3.5 rounded-2xl text-xs sm:text-sm focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'mentorship', label: '25-Seat Mentorship' },
            { id: 'pricing', label: 'Pricing & 25% Discount' },
            { id: 'calls', label: 'Free Demo Guidance' },
            { id: 'counselling', label: '12th Career Counselling' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#C8A45D] text-black shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#C8A45D]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#C8A45D]/30 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-cinzel text-sm sm:text-base font-bold text-[#0F0F0F] hover:text-[#8A651E] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#C8A45D] shrink-0 transition-transform ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-700 leading-relaxed font-poppins border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 text-gray-500 text-xs">
            No questions found matching "{searchQuery}". Connect with our mentorship desk below!
          </div>
        )}
      </div>

      {/* Direct Help Desk Box */}
      <div className="bg-[#F8F6F2] border border-[#C8A45D]/50 rounded-3xl p-8 text-center space-y-4">
        <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">Still Have a Question?</h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Chat directly with Harkiran Kaur's support desk on WhatsApp or schedule your free 1-on-1 strategy call.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="https://wa.me/919284084523?text=Hi%20Harkiran%20Maam,%20I%20have%20a%20question%20about%20the%2025-seat%20CS%20Mentorship%20Batch."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-montserrat font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp (+91 92840 84523)</span>
          </a>
          <button
            onClick={onOpenCounsellingModal}
            className="px-6 py-3 bg-[#0F0F0F] hover:bg-[#222222] text-[#FFE3A0] font-montserrat font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#C8A45D]" />
            <span>Book Free 1:1 Guidance Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC<PageProps> = ({ onOpenCounsellingModal }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', course: 'CS Executive Both Groups', message: '' });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await saveEnrollment({
      name: form.name,
      phone: form.phone,
      program: `Inquiry: ${form.course}`,
      notes: form.message,
      productId: 'inquiry-lead',
    });
    setIsSubmitting(false);
    if (!result.success) {
      alert(result.message || 'Your message could not be saved. Check your internet connection and try again.');
      return;
    }
    setDbSaved(result.savedToDb);
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-poppins">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-widest bg-[#C8A45D]/20 px-3.5 py-1 rounded-full border border-[#C8A45D]/40">
          Mentorship Help Desk
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-[#0F0F0F] leading-tight">
          Direct Contact & <span className="text-[#8A651E]">Support</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          Have questions about the 25-student batch, syllabus planning, or early bird 25% discount? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white border border-[#C8A45D]/40 p-8 rounded-3xl space-y-6 shadow-md">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">Send an Inquiry</h3>
            <p className="text-xs text-gray-600 mt-1">
              Leave your details and Harkiran Ma'am or our mentorship team will reach out directly on WhatsApp within a few hours.
            </p>
          </div>

          {!submitted ? (
            <form
              onSubmit={handleContactSubmit}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Priornshu Sharma"
                  className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] p-3.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] p-3.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Target Exam Stage *</label>
                  <select
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] p-3.5 rounded-xl focus:outline-none"
                  >
                    <option value="CSEET Oct 2026">CSEET (Oct 2026)</option>
                    <option value="CS Executive Group 1">CS Executive (Group 1 - Dec 2026)</option>
                    <option value="CS Executive Group 2">CS Executive (Group 2 - Dec 2026)</option>
                    <option value="CS Executive Both Groups">CS Executive (Both Groups - Dec 2026)</option>
                    <option value="CS Professional Group 1">CS Professional (Group 1)</option>
                    <option value="CS Professional Group 2">CS Professional (Group 2)</option>
                    <option value="CS Professional Both Groups">CS Professional (Both Groups)</option>
                    <option value="12th Career Counselling">12th CS Career Roadmap</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Your Question or Attempt Status *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what stage of preparation you are at, which subjects feel challenging, or if you'd like the 25% discount code applied..."
                  className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] p-3.5 rounded-xl focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0F0F0F] hover:bg-[#222222] text-[#FFE3A0] font-montserrat font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FFE3A0]" />
                    <span>Saving Inquiry to Backend...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#C8A45D]" />
                    <span>Submit Inquiry to Harkiran's Desk</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-10 space-y-3 bg-[#F8F6F2] rounded-2xl border border-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">Inquiry Received!</h3>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#C8A45D]/40 rounded-full text-[11px] text-[#8A651E] font-medium mx-auto">
                <Database className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>
                  {dbSaved
                    ? 'Saved securely in our database'
                    : 'Inquiry Recorded & Synced to Backend'}
                </span>
              </div>

              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you, <strong>{form.name}</strong>. Harkiran Ma'am will connect with you directly on WhatsApp ({form.phone}) shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#8A651E] font-bold underline cursor-pointer pt-2"
              >
                Send another message
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#C8A45D]/40 p-8 rounded-3xl space-y-6 text-xs shadow-md">
            <h3 className="font-cinzel text-xl font-bold text-[#0F0F0F]">Official Contact Channels</h3>

            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#0F0F0F] font-montserrat font-bold">Direct Phone / WhatsApp</strong>
                  <a href="tel:+919284084523" className="text-gray-600 hover:text-[#8A651E]">
                    +91 92840 84523
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#0F0F0F] font-montserrat font-bold">Email Support</strong>
                  <a href="mailto:support.hkcodeofrankers@gmail.com" className="text-gray-600 hover:text-[#8A651E]">
                    support.hkcodeofrankers@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#0F0F0F] font-montserrat font-bold">Location</strong>
                  <span className="text-gray-600">Nashik, Maharashtra, India (Available Pan-India Online)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <a
                href="https://wa.me/919284084523?text=Hi%20Harkiran%20Maam,%20I%20would%20like%20to%20book%20my%20Free%201:1%20Guidance%20Call."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-montserrat font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Message</span>
              </a>
            </div>
          </div>

          <div className="bg-[#1C1917] border border-[#C8A45D]/40 p-6 rounded-3xl text-white space-y-3 shadow-md">
            <span className="text-[10px] font-montserrat font-bold uppercase text-[#FFE3A0]">
              Demo Session Available
            </span>
            <h4 className="font-cinzel text-lg font-bold text-white">Book Free 1-on-1 Guidance Call</h4>
            <p className="text-xs text-gray-300 font-poppins">
              30-minute strategic consultation with AIR 3 Harkiran Kaur Kohli to plan your syllabus roadmap before enrolling.
            </p>
            <button
              onClick={onOpenCounsellingModal}
              className="w-full py-3 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl hover:brightness-110 uppercase cursor-pointer"
            >
              Claim Free Demo Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LegalPages: React.FC<{ type: 'privacy' | 'terms' }> = ({ type }) => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs text-gray-300">
      <h1 className="font-cinzel text-3xl font-bold text-white">
        {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
      </h1>
      <div className="p-8 bg-[#141414] border border-gray-800 rounded-3xl space-y-4 leading-relaxed font-poppins">
        <p>
          Welcome to HK Code of Rankers. We prioritize your privacy and educational data security.
        </p>
        <p>
          All aspirant records, mock test scores, and 1-on-1 strategy discussions with Harkiran Kaur remain strictly confidential.
        </p>
      </div>
    </div>
  );
};
