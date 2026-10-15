import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  Flag,
  RotateCcw,
  Smartphone,
  Maximize2,
  Minimize2,
  ChevronRight,
  Award,
  Layers,
  FileSpreadsheet,
  Check,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product, PageId } from '../types';
import studyTrackGraphicImg from '../assets/images/hk_studytrack_pro_graphic_1789259325801.jpg';

interface HKStudyTrackProSelectorProps {
  onNavigate?: (page: PageId) => void;
  defaultIndexId?: string;
  initialPortableMode?: boolean;
}

interface IndexSubject {
  code: string;
  name: string;
  totalChapters: number;
  sampleChapters: {
    id: number;
    title: string;
    weightage: string;
    revCount: number;
    hasDoubt?: boolean;
  }[];
}

interface IndexConfig {
  id: string;
  productId: string;
  stageName: string;
  groupName: string;
  badge: string;
  price: number;
  originalPrice: number;
  highlight: string;
  subjects: IndexSubject[];
}

const STUDYTRACK_INDEX_CONFIGS: Record<string, IndexConfig> = {
  'cseet': {
    id: 'cseet',
    productId: 'hk-studytrack-cseet',
    stageName: 'CSEET',
    groupName: 'All 4 Papers',
    badge: 'CSEET All-in-One Index',
    price: 699,
    originalPrice: 1499,
    highlight: 'Complete 4-Paper Foundation Tracker with Reading & Revision Milestone Audit',
    subjects: [
      {
        code: 'Paper 1',
        name: 'Business Communication',
        totalChapters: 8,
        sampleChapters: [
          { id: 1, title: 'Essentials of Good English & Grammar', weightage: '10-12 M', revCount: 2 },
          { id: 2, title: 'Business Messages & Correspondence', weightage: '12-15 M', revCount: 1 },
          { id: 3, title: 'Common Business Terms & Vocabulary', weightage: '8-10 M', revCount: 3 },
          { id: 4, title: 'Digital Communication & Email Etiquette', weightage: '10 M', revCount: 1, hasDoubt: true },
        ],
      },
      {
        code: 'Paper 2',
        name: 'Legal Aptitude & Logical Reasoning',
        totalChapters: 12,
        sampleChapters: [
          { id: 1, title: 'Constitution of India (Preamble & Fundamental Rights)', weightage: '15 M', revCount: 2 },
          { id: 2, title: 'Elements of Company Law & CS Act', weightage: '18 M', revCount: 3 },
          { id: 3, title: 'Elements of Law of Torts & Contracts', weightage: '12 M', revCount: 1 },
        ],
      },
      {
        code: 'Paper 3',
        name: 'Economic & Business Environment',
        totalChapters: 9,
        sampleChapters: [
          { id: 1, title: 'Basics of Demand, Supply & National Income', weightage: '14 M', revCount: 2 },
          { id: 2, title: 'Union Budget & Key Financial Institutions', weightage: '12 M', revCount: 1 },
          { id: 3, title: 'Entrepreneurship Scenario & Make in India', weightage: '10 M', revCount: 2 },
        ],
      },
      {
        code: 'Paper 4',
        name: 'Current Affairs & Quantitative Aptitude',
        totalChapters: 10,
        sampleChapters: [
          { id: 1, title: 'National & International Current Affairs', weightage: '15 M', revCount: 1 },
          { id: 2, title: 'Number Systems, Percentages & Averages', weightage: '10 M', revCount: 2 },
          { id: 3, title: 'Data Interpretation & Logical Puzzles', weightage: '10 M', revCount: 1 },
        ],
      },
    ],
  },
  'exec-g1': {
    id: 'exec-g1',
    productId: 'hk-studytrack-exec-g1',
    stageName: 'CS Executive',
    groupName: 'Group 1 (4 Papers)',
    badge: 'Executive Group 1 Flagship',
    price: 899,
    originalPrice: 1999,
    highlight: 'Includes Full ICSI JIGL, Company Law, SBILL & CAFM Chapter-by-Chapter Index',
    subjects: [
      {
        code: 'Paper 1',
        name: 'Jurisprudence, Interpretation & General Laws (JIGL)',
        totalChapters: 18,
        sampleChapters: [
          { id: 1, title: 'Sources of Law & Jurisprudence Schools', weightage: '8-10 M', revCount: 2 },
          { id: 2, title: 'Constitution of India (Writs, Directives, Judiciary)', weightage: '14-16 M', revCount: 3 },
          { id: 3, title: 'Interpretation of Statutes (Literal, Golden, Mischief)', weightage: '10-12 M', revCount: 2 },
          { id: 4, title: 'Code of Civil Procedure, 1908 (CPC Res Judicata)', weightage: '12 M', revCount: 1, hasDoubt: true },
          { id: 5, title: 'Indian Penal Code & Criminal Procedure Code', weightage: '14 M', revCount: 2 },
        ],
      },
      {
        code: 'Paper 2',
        name: 'Company Law & Practice',
        totalChapters: 20,
        sampleChapters: [
          { id: 1, title: 'Introduction to Company Law & Types of Companies', weightage: '8 M', revCount: 3 },
          { id: 2, title: 'Share Capital, Debentures & Alteration of Capital', weightage: '16 M', revCount: 2 },
          { id: 3, title: 'Directors: Appointment, Disqualifications & Powers', weightage: '18-20 M', revCount: 3 },
          { id: 4, title: 'Board Meetings, Virtual Meetings & Quorum Rules', weightage: '12-14 M', revCount: 2 },
          { id: 5, title: 'Accounts of Companies, CSR & Internal Audit', weightage: '12 M', revCount: 1, hasDoubt: true },
        ],
      },
      {
        code: 'Paper 3',
        name: 'Setting Up of Business, Industrial & Labour Laws (SBILL)',
        totalChapters: 21,
        sampleChapters: [
          { id: 1, title: 'Selection of Business Entity & Startup Formations', weightage: '10 M', revCount: 2 },
          { id: 2, title: 'Licenses, Registrations & MSME Formalities', weightage: '12 M', revCount: 1 },
          { id: 3, title: 'Code on Wages, 2019 & Industrial Relations Code', weightage: '18 M', revCount: 2 },
          { id: 4, title: 'Social Security Code & Occupational Safety Code', weightage: '14 M', revCount: 1 },
        ],
      },
      {
        code: 'Paper 4',
        name: 'Corporate Accounting & Financial Management (CAFM)',
        totalChapters: 19,
        sampleChapters: [
          { id: 1, title: 'Corporate Financial Reporting & Ind AS Overview', weightage: '12 M', revCount: 2 },
          { id: 2, title: 'Accounting for Corporate Restructuring & Amalgamation', weightage: '16 M', revCount: 1, hasDoubt: true },
          { id: 3, title: 'Working Capital Management & Cash Flow Analysis', weightage: '14 M', revCount: 3 },
          { id: 4, title: 'Cost of Capital, Capital Budgeting & Leverage', weightage: '16 M', revCount: 2 },
        ],
      },
    ],
  },
  'exec-g2': {
    id: 'exec-g2',
    productId: 'hk-studytrack-exec-g2',
    stageName: 'CS Executive',
    groupName: 'Group 2 (3 Papers)',
    badge: 'Executive Group 2 High-Yield',
    price: 799,
    originalPrice: 1799,
    highlight: 'Comprehensive Capital Markets (CMSL), Economic Laws (ECIPL) & Tax Law Index',
    subjects: [
      {
        code: 'Paper 5',
        name: 'Capital Market & Securities Laws (CMSL)',
        totalChapters: 16,
        sampleChapters: [
          { id: 1, title: 'SEBI (ICDR) Regulations & Public Issues', weightage: '18 M', revCount: 3 },
          { id: 2, title: 'SEBI (LODR) Regulations & Governance Norms', weightage: '16 M', revCount: 2 },
          { id: 3, title: 'SEBI (PIT) Insider Trading Regulations', weightage: '12 M', revCount: 2, hasDoubt: true },
          { id: 4, title: 'Mutual Funds & Collective Investment Schemes', weightage: '10 M', revCount: 1 },
        ],
      },
      {
        code: 'Paper 6',
        name: 'Economic, Commercial & Intellectual Property Laws (ECIPL)',
        totalChapters: 17,
        sampleChapters: [
          { id: 1, title: 'Foreign Exchange Management Act (FEMA Current & Capital A/c)', weightage: '18 M', revCount: 3 },
          { id: 2, title: 'Foreign Direct Investment (FDI Policy & Approvals)', weightage: '12 M', revCount: 2 },
          { id: 3, title: 'Competition Act, 2002 & Anticompetitive Agreements', weightage: '14 M', revCount: 2 },
          { id: 4, title: 'Intellectual Property Rights (Patents, Trademarks, Copyrights)', weightage: '16 M', revCount: 1 },
        ],
      },
      {
        code: 'Paper 7',
        name: 'Tax Laws & Practice (GST, Customs & Direct Tax)',
        totalChapters: 20,
        sampleChapters: [
          { id: 1, title: 'Direct Tax: PGBP & Capital Gains Computations', weightage: '20 M', revCount: 2, hasDoubt: true },
          { id: 2, title: 'GST: Concept of Supply, Input Tax Credit (ITC)', weightage: '24 M', revCount: 3 },
          { id: 3, title: 'Customs Law: Valuation & Import Procedures', weightage: '12 M', revCount: 1 },
        ],
      },
    ],
  },
  'exec-both': {
    id: 'exec-both',
    productId: 'hk-studytrack-exec-both',
    stageName: 'CS Executive',
    groupName: 'Both Groups Combined (7 Papers)',
    badge: 'Best Value • 50% OFF',
    price: 1499,
    originalPrice: 2999,
    highlight: 'All 7 Executive Papers (G1 + G2) Complete Master Index Tracker with Cross-Group Planning',
    subjects: [
      {
        code: 'G1 • P1-4',
        name: 'Group 1 Core Papers (JIGL, Co Law, SBILL, CAFM)',
        totalChapters: 78,
        sampleChapters: [
          { id: 1, title: 'Company Law: Board Powers & KMP', weightage: '20 M', revCount: 3 },
          { id: 2, title: 'JIGL: Constitutional Writs & CPC', weightage: '16 M', revCount: 2 },
          { id: 3, title: 'SBILL: Labour Codes & MSME', weightage: '16 M', revCount: 2 },
          { id: 4, title: 'CAFM: Corporate Restructuring Accounts', weightage: '16 M', revCount: 1, hasDoubt: true },
        ],
      },
      {
        code: 'G2 • P5-7',
        name: 'Group 2 Core Papers (CMSL, ECIPL, Tax Laws)',
        totalChapters: 53,
        sampleChapters: [
          { id: 1, title: 'CMSL: SEBI ICDR & Takeover Code', weightage: '20 M', revCount: 3 },
          { id: 2, title: 'ECIPL: FEMA & Competition Act', weightage: '18 M', revCount: 2 },
          { id: 3, title: 'Tax: GST Input Tax Credit & Direct Tax PGBP', weightage: '25 M', revCount: 2, hasDoubt: true },
        ],
      },
    ],
  },
  'prof-g1': {
    id: 'prof-g1',
    productId: 'hk-studytrack-prof-g1',
    stageName: 'CS Professional',
    groupName: 'Group 1 (3 Papers)',
    badge: 'Professional Group 1',
    price: 999,
    originalPrice: 2299,
    highlight: 'Advanced ESG Governance, Drafting & Pleadings, and Compliance Risk Index',
    subjects: [
      {
        code: 'Paper 1',
        name: 'Environmental, Social & Governance (ESG) & Sustainability',
        totalChapters: 15,
        sampleChapters: [
          { id: 1, title: 'ESG Framework, BRSR Reporting & Stakeholder Governance', weightage: '18 M', revCount: 3 },
          { id: 2, title: 'Global Reporting Initiatives (GRI) & Carbon Footprinting', weightage: '14 M', revCount: 2 },
          { id: 3, title: 'Board Diversity, Stewardship Codes & CSR Audits', weightage: '16 M', revCount: 2 },
        ],
      },
      {
        code: 'Paper 2',
        name: 'Drafting, Pleadings & Appearances (DPA)',
        totalChapters: 14,
        sampleChapters: [
          { id: 1, title: 'General Principles of Legal Drafting & Conveorncing', weightage: '15 M', revCount: 3 },
          { id: 2, title: 'Drafting of Commercial Contracts, Deeds & Agreements', weightage: '22 M', revCount: 2 },
          { id: 3, title: 'Pleadings, Appeals & Applications before NCLT / SAT', weightage: '25 M', revCount: 1, hasDoubt: true },
        ],
      },
      {
        code: 'Paper 3',
        name: 'Compliance Management, Audit & Due Diligence (CMADD)',
        totalChapters: 16,
        sampleChapters: [
          { id: 1, title: 'Comprehensive Compliance Framework & Secretarial Audit', weightage: '20 M', revCount: 3 },
          { id: 2, title: 'Due Diligence for Mergers, Takeovers & IPOs', weightage: '20 M', revCount: 2 },
          { id: 3, title: 'Peer Review & Quality Review of CS Practices', weightage: '12 M', revCount: 1 },
        ],
      },
    ],
  },
  'prof-g2': {
    id: 'prof-g2',
    productId: 'hk-studytrack-prof-g2',
    stageName: 'CS Professional',
    groupName: 'Group 2 (3 Papers)',
    badge: 'Professional Group 2',
    price: 899,
    originalPrice: 1999,
    highlight: 'Strategic Management, Corporate Restructuring (CRVI) & Open Book Elective Tracker',
    subjects: [
      {
        code: 'Paper 4',
        name: 'Strategic Management & Corporate Finance (SMCF)',
        totalChapters: 15,
        sampleChapters: [
          { id: 1, title: 'Strategic Analysis, Portfolio Models & Corporate Valuation', weightage: '18 M', revCount: 2 },
          { id: 2, title: 'Mergers, Acquisitions & International Finance Strategies', weightage: '18 M', revCount: 2 },
        ],
      },
      {
        code: 'Paper 5',
        name: 'Corporate Restructuring, Valuation & Insolvency (CRVI)',
        totalChapters: 18,
        sampleChapters: [
          { id: 1, title: 'Cross-Border Mergers, Fast Track Schemes & Stamp Duty', weightage: '22 M', revCount: 3 },
          { id: 2, title: 'Insolvency & Bankruptcy Code, 2016 (CIRP & Liquidation)', weightage: '30 M', revCount: 3, hasDoubt: true },
          { id: 3, title: 'Business Valuation Techniques & Registered Valuer Norms', weightage: '15 M', revCount: 1 },
        ],
      },
    ],
  },
  'prof-both': {
    id: 'prof-both',
    productId: 'hk-studytrack-prof-both',
    stageName: 'CS Professional',
    groupName: 'Both Groups Combined',
    badge: 'Ultimate Professional Master',
    price: 1699,
    originalPrice: 3499,
    highlight: 'All Professional Papers Combined with Case Law Tracker & Draft Clause Checklist',
    subjects: [
      {
        code: 'G1 + G2',
        name: 'Comprehensive Professional Suite (All 6 Papers)',
        totalChapters: 85,
        sampleChapters: [
          { id: 1, title: 'CRVI: Insolvency & Cross Border M&A', weightage: '30 M', revCount: 3 },
          { id: 2, title: 'Drafting: NCLT Petitions & Commercial Deeds', weightage: '25 M', revCount: 3 },
          { id: 3, title: 'ESG: Sustainability Disclosures & CSR Audits', weightage: '20 M', revCount: 2 },
          { id: 4, title: 'CMADD: Secretarial Audit Checklists & Due Diligence', weightage: '22 M', revCount: 2, hasDoubt: true },
        ],
      },
    ],
  },
};

export const HKStudyTrackProSelector: React.FC<HKStudyTrackProSelectorProps> = ({
  onNavigate,
  defaultIndexId = 'exec-g1',
  initialPortableMode = false,
}) => {
  const { buyNow, addToCart } = useCart();
  const [selectedIndexKey, setSelectedIndexKey] = useState<string>(defaultIndexId);
  const [activeSubjectTab, setActiveSubjectTab] = useState<number>(0);
  const [isPortablePocketMode, setIsPortablePocketMode] = useState<boolean>(initialPortableMode);

  // Interactive chapter simulator state for demonstration
  const [checkedChapters, setCheckedChapters] = useState<Record<string, boolean>>({
    '1-lecture': true,
    '1-read': true,
    '1-rev1': true,
    '2-lecture': true,
    '2-read': true,
  });
  const [flaggedDoubt, setFlaggedDoubt] = useState<Record<string, boolean>>({
    '4-doubt': true,
  });

  const activeConfig = STUDYTRACK_INDEX_CONFIGS[selectedIndexKey] || STUDYTRACK_INDEX_CONFIGS['exec-g1'];
  const activeSubject = activeConfig.subjects[activeSubjectTab] || activeConfig.subjects[0];
  const currentProduct: Product = PRODUCTS.find((p) => p.id === activeConfig.productId) || {
    id: activeConfig.productId,
    name: `HK StudyTrack Pro – CS Progress Index (${activeConfig.badge})`,
    category: 'Mentorship',
    price: activeConfig.price,
    originalPrice: activeConfig.originalPrice,
    badge: activeConfig.badge,
    type: 'mentorship',
    level: activeConfig.stageName.toLowerCase().includes('eet') ? 'cseet' : activeConfig.stageName.toLowerCase().includes('prof') ? 'professional' : 'executive',
    description: activeConfig.highlight,
    features: ['Official ICSI Syllabus Index', '100% Student-Editable in Portal', 'Revision Milestone Tracking', 'Red Doubt Prioritization'],
    modules: [],
  };

  const toggleCheck = (key: string) => {
    setCheckedChapters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDoubt = (key: string) => {
    setFlaggedDoubt((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getWhatsAppQueryUrl = () => {
    const text = encodeURIComponent(
      `Hello Harkiran Ma'am! I am checking out HK StudyTrack Pro for ${activeConfig.stageName} (${activeConfig.groupName}).\n\n` +
      `Could you guide me on how the Student Portal access works after purchasing this index? Thank you!`
    );
    return `https://wa.me/919284084523?text=${text}`;
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Top Banner: Dual Mode Switcher & Portable Index Hub Header */}
      <div className="bg-gradient-to-br from-[#1A1815] via-[#12100E] to-[#0A0A0A] border-2 border-[#C8A45D]/50 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Gold Glow Background */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C8A45D]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#C8A45D]/20 text-[#FFE3A0] border border-[#C8A45D]/40 text-[11px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>HK StudyTrack Pro™ • CS Progress Index</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded-full">
                Live Interactive Index Selector
              </span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              Select Your Official <span className="gold-gradient-text">ICSI Chapter Index</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Never study in the dark again. Choose your exact exam stage below to preview the syllabus breakdown, lecture completion milestones, revision cycles, and high-weightage ICSI mark brackets.
            </p>
          </div>

          {/* Portable View Mode Toggle Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-stretch lg:self-center">
            <button
              onClick={() => setIsPortablePocketMode(!isPortablePocketMode)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-[#C8A45D]/40 text-xs font-montserrat font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:border-[#C8A45D]"
              title="Toggle between full console layout and portable pocket card view"
            >
              <Smartphone className="w-4 h-4 text-[#C8A45D]" />
              <span>{isPortablePocketMode ? 'Expand to Full Deck' : 'Portable Pocket View'}</span>
              {isPortablePocketMode ? (
                <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <Minimize2 className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>

            <a
              href={getWhatsAppQueryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-montserrat font-bold flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Level Tabs: CSEET | CS Executive | CS Professional */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => {
              setSelectedIndexKey('cseet');
              setActiveSubjectTab(0);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-2 transition-all cursor-pointer ${
              selectedIndexKey === 'cseet'
                ? 'gold-gradient-bg text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>CSEET (₹699)</span>
          </button>

          <div className="h-8 w-px bg-white/10 self-center hidden sm:block" />

          {/* Executive Buttons */}
          <button
            onClick={() => {
              setSelectedIndexKey('exec-g1');
              setActiveSubjectTab(0);
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedIndexKey === 'exec-g1'
                ? 'gold-gradient-bg text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>Executive G1 (₹899)</span>
          </button>

          <button
            onClick={() => {
              setSelectedIndexKey('exec-g2');
              setActiveSubjectTab(0);
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedIndexKey === 'exec-g2'
                ? 'gold-gradient-bg text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>Executive G2 (₹799)</span>
          </button>

          <button
            onClick={() => {
              setSelectedIndexKey('exec-both');
              setActiveSubjectTab(0);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedIndexKey === 'exec-both'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg scale-[1.02] border border-emerald-300'
                : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE3A0]" />
            <span>Exec Combined (₹1,499)</span>
            <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-emerald-200">50% OFF</span>
          </button>

          <div className="h-8 w-px bg-white/10 self-center hidden sm:block" />

          {/* Professional Buttons */}
          <button
            onClick={() => {
              setSelectedIndexKey('prof-g1');
              setActiveSubjectTab(0);
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedIndexKey === 'prof-g1'
                ? 'gold-gradient-bg text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>Prof G1 (₹999)</span>
          </button>

          <button
            onClick={() => {
              setSelectedIndexKey('prof-g2');
              setActiveSubjectTab(0);
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedIndexKey === 'prof-g2'
                ? 'gold-gradient-bg text-black shadow-lg scale-[1.02]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>Prof G2 (₹899)</span>
          </button>

          <button
            onClick={() => {
              setSelectedIndexKey('prof-both');
              setActiveSubjectTab(0);
            }}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedIndexKey === 'prof-both'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-[1.02]'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>Prof Both (₹1,699)</span>
          </button>
        </div>
      </div>

      {/* Main Display: Interactive Portable Console vs Pocket Card */}
      <div className={`grid grid-cols-1 ${isPortablePocketMode ? 'lg:grid-cols-1 max-w-2xl mx-auto' : 'lg:grid-cols-12'} gap-6 items-start`}>
        {/* Left Column: Graphic Artwork Showcase & Quick Buy Card (lg:col-span-5) */}
        <div className={`${isPortablePocketMode ? 'w-full' : 'lg:col-span-5'} space-y-5`}>
          {/* Futuristic Graphic Artwork Card */}
          <div className="bg-gradient-to-br from-[#1C1917] via-[#141210] to-[#0A0A0A] border-2 border-[#C8A45D]/60 rounded-3xl p-4 shadow-xl text-white relative overflow-hidden group">
            {/* Glowing Accent Border & Watermark */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
              <img
                src={studyTrackGraphicImg}
                alt="HK StudyTrack Pro Futuristic ICSI Progress Index Console"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Holographic Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-[#C8A45D]/60 rounded-full text-[10px] font-bold text-[#FFE3A0] flex items-center gap-1.5 shadow-lg">
                <Award className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>AIR 3 Structured Tracker</span>
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-emerald-950/85 backdrop-blur-md border border-emerald-400/50 rounded-lg text-[10px] font-bold text-emerald-200">
                100% Student-Editable
              </div>
            </div>

            {/* Graphic Description & Capabilities */}
            <div className="p-2 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8A45D]">
                    {activeConfig.stageName}
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    {activeConfig.groupName}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-cinzel font-black text-[#FFE3A0]">
                    ₹{activeConfig.price}
                  </div>
                  <div className="text-[11px] text-gray-400 line-through">
                    ₹{activeConfig.originalPrice}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 font-poppins leading-relaxed">
                {activeConfig.highlight}
              </p>

              {/* Feature Checklist Pills */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300 pt-1">
                <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 Revision Cycles</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Exam Weightage (M)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>🚩 Doubt Prioritizer</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 p-2 rounded-xl border border-white/5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Portal Sync</span>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-3">
                <button
                  onClick={() => addToCart(currentProduct)}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-montserrat font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#FFE3A0]" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => buyNow(currentProduct)}
                  className="flex-1 py-3 gold-gradient-bg hover:brightness-110 text-black text-xs font-montserrat font-black uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Buy Index Now</span>
                  <Zap className="w-3.5 h-3.5 fill-black" />
                </button>
              </div>

              <div className="text-center pt-1 text-[10.5px] text-gray-400">
                ⚡ Instant access in your personal Student Portal right after payment.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Portable Index Inspector / Chapter Simulator (lg:col-span-7) */}
        <div className={`${isPortablePocketMode ? 'w-full' : 'lg:col-span-7'} space-y-4`}>
          <div className="bg-white border-2 border-[#C8A45D]/40 rounded-3xl p-5 sm:p-6 shadow-xl relative">
            {/* Portable Index Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-wider">
                  <FileSpreadsheet className="w-4 h-4 text-[#C8A45D]" />
                  <span>Interactive Portable Index Previewer</span>
                </div>
                <h3 className="font-cinzel text-xl font-bold text-gray-900 mt-0.5">
                  {activeConfig.stageName} – {activeConfig.groupName}
                </h3>
              </div>

              <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800 flex items-center gap-1.5 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{activeConfig.subjects.length} Official Papers Included</span>
              </div>
            </div>

            {/* Subject Selector Pills for Selected Index */}
            <div className="py-3 flex flex-wrap gap-2 border-b border-gray-100">
              {activeConfig.subjects.map((sub, idx) => (
                <button
                  key={sub.code}
                  onClick={() => setActiveSubjectTab(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer ${
                    activeSubjectTab === idx
                      ? 'bg-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-75 mr-1">{sub.code}:</span>
                  <span className="truncate max-w-[140px] inline-block align-bottom">{sub.name}</span>
                </button>
              ))}
            </div>

            {/* Active Subject Details Strip */}
            <div className="py-3 flex items-center justify-between text-xs bg-[#FAF8F5] px-3.5 rounded-xl border border-[#C8A45D]/20 my-3">
              <div className="font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8A651E]" />
                <span>{activeSubject.name}</span>
              </div>
              <div className="text-gray-500 font-mono text-[11px]">
                Total: <strong>{activeSubject.totalChapters} Chapters</strong>
              </div>
            </div>

            {/* Interactive Simulator Guidance */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 mb-4">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Try the live simulation:</strong> Tap any checkbox or the red doubt flag (🚩) below to test how your student dashboard lets you track lectures, self-reading, revisions, and doubts!
              </div>
            </div>

            {/* Chapter Checklist Matrix Table */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-[#1C1917] text-white p-3 text-xs font-montserrat font-bold uppercase tracking-wider grid grid-cols-12 gap-2 items-center">
                <span className="col-span-6 sm:col-span-5">Chapter Title & Weightage</span>
                <span className="col-span-2 text-center">Lectures</span>
                <span className="col-span-2 text-center">Reading</span>
                <span className="col-span-2 sm:col-span-2 text-center">Rev 1</span>
                <span className="hidden sm:inline-block sm:col-span-1 text-center">🚩</span>
              </div>

              <div className="divide-y divide-gray-100 bg-white text-xs">
                {activeSubject.sampleChapters.map((ch) => {
                  const lecKey = `${ch.id}-lecture`;
                  const readKey = `${ch.id}-read`;
                  const revKey = `${ch.id}-rev1`;
                  const doubtKey = `${ch.id}-doubt`;

                  const isLecDone = !!checkedChapters[lecKey];
                  const isReadDone = !!checkedChapters[readKey];
                  const isRevDone = !!checkedChapters[revKey];
                  const isDoubt = flaggedDoubt[doubtKey] !== undefined ? flaggedDoubt[doubtKey] : !!ch.hasDoubt;

                  return (
                    <div
                      key={ch.id}
                      className="p-3 grid grid-cols-12 gap-2 items-center hover:bg-amber-50/30 transition-colors"
                    >
                      {/* Title & Weightage */}
                      <div className="col-span-6 sm:col-span-5 space-y-0.5 pr-2">
                        <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                          <span className="font-mono text-gray-400 text-[11px]">Ch {ch.id}.</span>
                          <span className="line-clamp-1">{ch.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-semibold font-mono">
                            {ch.weightage}
                          </span>
                          <span className="text-gray-400">Target: 3 Revs</span>
                        </div>
                      </div>

                      {/* Lectures Checkbox */}
                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => toggleCheck(lecKey)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isLecDone
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Lecture Completed"
                        >
                          {isLecDone ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Reading Checkbox */}
                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => toggleCheck(readKey)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isReadDone
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Self Reading Completed"
                        >
                          {isReadDone ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Rev 1 Checkbox */}
                      <div className="col-span-2 sm:col-span-2 flex justify-center">
                        <button
                          onClick={() => toggleCheck(revKey)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isRevDone
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle 1st Revision Completed"
                        >
                          {isRevDone ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Doubt Flag (Desktop) */}
                      <div className="hidden sm:flex col-span-1 justify-center">
                        <button
                          onClick={() => toggleDoubt(doubtKey)}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isDoubt
                              ? 'bg-rose-100 text-rose-700 border border-rose-300'
                              : 'bg-gray-50 text-gray-300 hover:text-rose-400'
                          }`}
                          title="Toggle Red Doubt Priority Marker"
                        >
                          <Flag className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Permanent lifetime access to this index in your Student Portal.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => buyNow(currentProduct)}
                  className="px-4 py-2 gold-gradient-bg hover:brightness-110 text-black font-montserrat font-extrabold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Select &amp; Buy ({activeConfig.badge.split('•')[0].trim()})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
