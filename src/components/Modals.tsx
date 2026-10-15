import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Sparkles, AlertCircle, Award, Send, HelpCircle, BookOpen, Target, Brain, FileCheck, ShoppingBag, Zap, Check, Loader2, Database, MessageSquare } from 'lucide-react';
import founderImg from '../assets/images/regenerated_image_1785612225656.jpg';
import { Product } from '../types';
import { saveEnrollment, saveCounsellingBooking } from '../lib/backend';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinMentorshipModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'LEVEL 1: CSEET October 2026 Mentorship Batch (All 4 Subjects) — ₹1,199',
    attempt: 'October 2026 (CSEET Attempt)',
    subjectMode: 'all',
    selectedSubjects: [
      'Paper 1: Business Communication',
      'Paper 2: Fundamentals of Accounting',
      'Paper 3: Economics and Business Environment',
      'Paper 4: Business Laws and Management',
    ],
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbSaved, setDbSaved] = useState<boolean>(false);

  // Close with Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cseetSubjects = [
    'Paper 1: Business Communication',
    'Paper 2: Fundamentals of Accounting',
    'Paper 3: Economics and Business Environment',
    'Paper 4: Business Laws and Management',
  ];

  const execG1Subjects = [
    'Jurisprudence, Interpretation & General Laws (JIGL)',
    'Company Law & Practice',
    'Setting Up of Business, Industrial & Labour Laws',
    'Corporate Accounting & Financial Management',
  ];

  const execG2Subjects = [
    'Capital Market & Securities Laws',
    'Economic, Commercial and Intellectual Property Laws',
    'Tax Laws & Practice',
  ];

  const profG1Subjects = [
    'Environmental, Social and Governance (ESG) – Principles & Practice',
    'Drafting, Pleadings and Appearances',
    'Compliance Management, Audit & Due Diligence',
    'Elective 1 (Open-Book Exam: CSR / Forensic Audit / IPR / AI & Cyber Security)',
  ];

  const profG2Subjects = [
    'Strategic Management & Corporate Finance',
    'Corporate Restructuring, Valuation & Insolvency',
    'Elective 2 (Open-Book Exam: Arbitration / GST & Tax / Labour / Banking / IBC)',
  ];

  const isCounselling = formData.program.includes('Counselling') || formData.program.includes('Career Roadmap') || formData.program.includes('12th');
  const isCSEET = !isCounselling && (formData.program.includes('CSEET') || formData.program.includes('LEVEL 1'));
  const isExecG1 = formData.program.includes('Executive Group 1');
  const isExecG2 = formData.program.includes('Executive Group 2');
  const isExecBoth = formData.program.includes('Executive Both');
  const isProfG1 = formData.program.includes('Professional Group 1');
  const isProfG2 = formData.program.includes('Professional Group 2');
  const isProfBoth = formData.program.includes('Professional Both');

  const currentAvailableSubjects = isCounselling
    ? []
    : isCSEET
    ? cseetSubjects
    : isExecG1
    ? execG1Subjects
    : isExecG2
    ? execG2Subjects
    : isExecBoth
    ? [...execG1Subjects, ...execG2Subjects]
    : isProfG1
    ? profG1Subjects
    : isProfG2
    ? profG2Subjects
    : isProfBoth
    ? [...profG1Subjects, ...profG2Subjects]
    : cseetSubjects;

  const handleProgramChange = (newProg: string) => {
    let defaultSubs: string[] = [];
    if (newProg.includes('Counselling') || newProg.includes('Career Roadmap') || newProg.includes('12th')) {
      defaultSubs = [];
    } else if (newProg.includes('CSEET') || newProg.includes('LEVEL 1')) {
      defaultSubs = cseetSubjects;
    } else if (newProg.includes('Executive Group 1')) {
      defaultSubs = execG1Subjects;
    } else if (newProg.includes('Executive Group 2')) {
      defaultSubs = execG2Subjects;
    } else if (newProg.includes('Executive Both')) {
      defaultSubs = [...execG1Subjects, ...execG2Subjects];
    } else if (newProg.includes('Professional Group 1')) {
      defaultSubs = profG1Subjects;
    } else if (newProg.includes('Professional Group 2')) {
      defaultSubs = profG2Subjects;
    } else if (newProg.includes('Professional Both')) {
      defaultSubs = [...profG1Subjects, ...profG2Subjects];
    } else {
      defaultSubs = cseetSubjects;
    }

    setFormData({
      ...formData,
      program: newProg,
      subjectMode: 'all',
      selectedSubjects: defaultSubs,
    });
  };

  const toggleSubject = (sub: string) => {
    if (formData.selectedSubjects.includes(sub)) {
      if (formData.selectedSubjects.length === 1) return;
      const updated = formData.selectedSubjects.filter((s) => s !== sub);
      setFormData({
        ...formData,
        subjectMode: 'custom',
        selectedSubjects: updated,
      });
    } else {
      const updated = [...formData.selectedSubjects, sub];
      setFormData({
        ...formData,
        subjectMode: updated.length === currentAvailableSubjects.length ? 'all' : 'custom',
        selectedSubjects: updated,
      });
    }
  };

  const selectAllSubjects = () => {
    setFormData({
      ...formData,
      subjectMode: 'all',
      selectedSubjects: currentAvailableSubjects,
    });
  };

  const mentorshipPillars = [
    { icon: '📚', title: 'Study strategy', desc: 'How to plan preparation subject-wise.' },
    { icon: '⏰', title: 'Time management', desc: 'How to divide time between classes, self-study and revision.' },
    { icon: '📝', title: 'Revision strategy', desc: 'How and when to revise for long-term retention.' },
    { icon: '✍️', title: 'Answer writing', desc: 'How to structure answers and present them effectively.' },
    { icon: '🎯', title: 'Exam strategy', desc: 'How to approach the paper and manage 3-hour exam time.' },
    { icon: '❓', title: 'Doubt guidance', desc: 'Helping students understand difficult statutory concepts.' },
    { icon: '📊', title: 'Progress guidance', desc: 'Helping them identify weak areas and systematically improve.' },
    { icon: '🏆', title: 'Rank-oriented tips', desc: 'Mistakes to avoid & habits that secured AIR 3.' },
    { icon: '💬', title: 'Motivation & accountability', desc: 'Regular WhatsApp check-ins & consistency tracking.' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let prodId = 'mentorship-program';
    if (isCounselling) prodId = 'career-counselling-roadmap';
    else if (isCSEET) prodId = 'cseet-cohort-oct-2026';
    else if (isExecG1) prodId = 'exec-g1-cohort-dec-2026';
    else if (isExecG2) prodId = 'exec-g2-cohort-dec-2026';
    else if (isExecBoth) prodId = 'exec-both-cohort-dec-2026';
    else if (isProfG1) prodId = 'prof-g1-cohort-dec-2026';
    else if (isProfG2) prodId = 'prof-g2-cohort-dec-2026';
    else if (isProfBoth) prodId = 'prof-both-cohort-dec-2026';

    const result = await saveEnrollment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      program: formData.program,
      attempt: formData.attempt,
      subjectMode: formData.subjectMode,
      selectedSubjects: formData.selectedSubjects,
      notes: formData.notes,
      productId: prodId,
    });

    setIsSubmitting(false);
    if (!result.success) {
      alert(result.message || 'Your details could not be saved. Check your internet connection and try again.');
      return;
    }
    setDbSaved(result.savedToDb);
    setSubmitted(true);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Viewport Floating Close Button - Always visible & accessible */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[80] p-2.5 sm:px-4 sm:py-2 rounded-full bg-black/85 hover:bg-black text-white hover:text-[#FFE3A0] shadow-2xl border border-white/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-montserrat font-bold"
        title="Close Window (Esc)"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Close</span>
      </button>

      <div className="bg-white border-2 border-[#C8A45D]/60 rounded-3xl w-full max-w-2xl p-5 sm:p-7 relative shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-poppins">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A45D]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Sticky Header with AIR 3 Founder Highlight & Distinct Close Button */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3.5 shrink-0 pr-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFE3A0] via-[#C8A45D] to-[#8A651E] p-0.5 shrink-0 shadow-md">
              <img
                src={founderImg}
                alt="Harkiran Kaur Kohli"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-montserrat font-bold text-[#8A651E] uppercase tracking-wider">
                  Harkiran Kaur Kohli
                </span>
                <span className="px-2 py-0.5 bg-[#C8A45D] text-black font-extrabold text-[9px] rounded-full uppercase tracking-wider shadow-xs">
                  AIR 3 • 413/700 (4 Exemptions)
                </span>
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#0F0F0F]">
                Join Mentorship Program
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-block px-2.5 py-1 bg-amber-500/10 text-amber-900 border border-amber-500/30 rounded-lg text-[10px] font-bold">
              Strictly 25 Seats
            </span>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-black rounded-full font-montserrat font-bold text-xs transition-colors cursor-pointer border border-gray-300 shadow-xs"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {!submitted ? (
          <div className="overflow-y-auto flex-1 pr-1 space-y-5 pt-3">

            {/* 9 Core Mentorship Pillars Showcase Box */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-montserrat font-extrabold text-[#7A5816] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
                  What You Get in 1-on-1 Mentorship:
                </span>
                <span className="text-[10px] text-gray-500 font-medium">9 Dedicated Pillars</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                {mentorshipPillars.map((pillar, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-xl border border-[#C8A45D]/20 text-[10px] space-y-0.5 shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#0F0F0F]">
                      <span>{pillar.icon}</span>
                      <span className="truncate">{pillar.title}</span>
                    </div>
                    <p className="text-gray-500 text-[9.5px] leading-tight line-clamp-2">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananor Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2 rounded-xl focus:outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2 rounded-xl focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="ananor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2 rounded-xl focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Select Mentorship Program *</label>
                  <select
                    value={formData.program}
                    onChange={(e) => handleProgramChange(e.target.value)}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3 py-2 rounded-xl focus:outline-none text-xs font-medium"
                  >
                    <option value="LEVEL 1: CSEET October 2026 Mentorship Batch (All 4 Subjects) — ₹1,199">
                      LEVEL 1: CSEET Oct 2026 Mentorship (All 4 Subjects) — ₹1,199
                    </option>
                    <option value="LEVEL 2: CS Executive Group 1 Mentorship (Dec 2026) — ₹1,999">
                      LEVEL 2: CS Exec Group 1 Mentorship (Dec 2026) — ₹1,999
                    </option>
                    <option value="LEVEL 2: CS Executive Group 2 Mentorship (Dec 2026) — ₹1,699">
                      LEVEL 2: CS Exec Group 2 Mentorship (Dec 2026) — ₹1,699
                    </option>
                    <option value="LEVEL 2: CS Executive Both Groups (G1 + G2) Mentorship (Dec 2026) — ₹3,249">
                      LEVEL 2: CS Exec Both Groups Mentorship (Dec 2026) — ₹3,249
                    </option>
                    <option value="LEVEL 3: CS Professional Group 1 Mentorship (Dec 2026) — ₹2,499">
                      LEVEL 3: CS Prof Group 1 Mentorship (Dec 2026) — ₹2,499
                    </option>
                    <option value="LEVEL 3: CS Professional Group 2 Mentorship (Dec 2026) — ₹1,999">
                      LEVEL 3: CS Prof Group 2 Mentorship (Dec 2026) — ₹1,999
                    </option>
                    <option value="LEVEL 3: CS Professional Both Groups Mentorship (Dec 2026) — ₹3,999">
                      LEVEL 3: CS Prof Both Groups Mentorship (Dec 2026) — ₹3,999
                    </option>
                    <option value="Career Roadmap & Counselling After 12th — ₹999">
                      Career Roadmap & Counselling After 12th — ₹999
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Target Attempt *</label>
                  <select
                    value={formData.attempt}
                    onChange={(e) => setFormData({ ...formData, attempt: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3 py-2 rounded-xl focus:outline-none text-xs font-medium"
                  >
                    <option value="October 2026 (CSEET Attempt)">October 2026 (CSEET Attempt)</option>
                    <option value="December 2026 (CS Executive / Professional)">December 2026 (CS Executive / Professional)</option>
                    <option value="February 2027">February 2027</option>
                  </select>
                </div>
              </div>

              {/* Subject Selection Box with Full Subject Names - Not shown for counselling */}
              {isCounselling ? (
                <div className="p-3.5 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#8A651E]" />
                    <span className="text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-wider">
                      CS Career Counselling & Roadmap After 12th
                    </span>
                  </div>
                  <p className="text-[11.5px] text-gray-700 font-poppins leading-relaxed">
                    This is an exclusive 1-on-1 personalized guidance session for students deciding to pursue Company Secretary (CS) after 12th. <strong>No subjects required</strong> — Harkiran Ma'am will directly guide you on CS scope, CS vs CA vs Law, college options, and a step-by-step roadmap to qualify.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-gray-600 font-medium">
                    <span className="px-2 py-0.5 bg-white border border-[#C8A45D]/30 rounded-md">✓ 1-on-1 Strategy Session</span>
                    <span className="px-2 py-0.5 bg-white border border-[#C8A45D]/30 rounded-md">✓ CS vs CA vs Law</span>
                    <span className="px-2 py-0.5 bg-white border border-[#C8A45D]/30 rounded-md">✓ College Balance</span>
                    <span className="px-2 py-0.5 bg-white border border-[#C8A45D]/30 rounded-md">✓ 3-Year Clearance Roadmap</span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-800 font-bold text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8A651E]" />
                      <span>Included Full Subjects:</span>
                    </label>
                    <button
                      type="button"
                      onClick={selectAllSubjects}
                      className="text-[10px] font-bold text-[#8A651E] bg-[#FFE3A0]/50 hover:bg-[#FFE3A0] px-2 py-0.5 rounded cursor-pointer transition-colors"
                    >
                      Select All {currentAvailableSubjects.length} Subjects
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
                    {currentAvailableSubjects.map((sub) => {
                      const isChecked = formData.selectedSubjects.includes(sub);
                      return (
                        <label
                          key={sub}
                          onClick={() => toggleSubject(sub)}
                          className={`flex items-start gap-2 p-2 rounded-lg text-[11px] font-medium cursor-pointer transition-all border ${
                            isChecked
                              ? 'bg-white border-[#C8A45D] text-[#0F0F0F] shadow-xs font-semibold'
                              : 'bg-[#F3EFEA] border-transparent text-gray-500 hover:bg-white'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-3.5 h-3.5 accent-[#8A651E] rounded cursor-pointer mt-0.5 shrink-0"
                          />
                          <span className="leading-snug">{sub}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-gray-500 font-poppins flex items-center justify-between pt-0.5">
                    <span>Selected: <strong>{formData.selectedSubjects.length} of {currentAvailableSubjects.length} Subjects</strong></span>
                    {formData.selectedSubjects.length === currentAvailableSubjects.length && (
                      <span className="text-emerald-700 font-bold">✓ Full Group / Batch Package Included</span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-1">Any Specific Doubt / Challenge?</label>
                <textarea
                  rows={2}
                  placeholder="Share your current preparation stage or any specific subject difficulties..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2 rounded-xl focus:outline-none text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black font-montserrat font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer border border-gray-200"
                >
                  Close Window
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 font-montserrat font-bold text-black gold-gradient-bg rounded-xl uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-[#C8A45D]/20 cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2 text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Saving to Backend...</span>
                    </>
                  ) : (
                    <span>Submit Application & Hold Seat</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4 my-auto overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">Application Received!</h3>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF5E9] border border-[#C8A45D]/40 rounded-full text-[11px] text-[#8A651E] font-medium mx-auto">
              <Database className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>
                {dbSaved
                  ? 'Saved securely in our database'
                  : 'Received by our admissions desk'}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
              Thank you, <span className="text-[#8A651E] font-bold">{formData.name}</span>! Harkiran Kaur & the HK Rankers Desk will contact you on WhatsApp ({formData.phone}) within 2 hours to confirm your enrollment for:
            </p>
            <div className="p-3.5 bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-xl text-xs text-left max-w-sm mx-auto space-y-1.5 text-gray-700 font-poppins">
              <p><strong>Program:</strong> {formData.program.split('—')[0]}</p>
              {isCounselling ? (
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  ✓ <strong>1-on-1 CS Career Counselling & 3-Year Roadmap Session</strong> (No subjects required). We will reach out on WhatsApp to schedule your personal call slot with AIR 3 Harkiran Kaur Kohli.
                </p>
              ) : (
                <>
                  <p><strong>Included Subjects ({formData.selectedSubjects.length}):</strong></p>
                  <ul className="list-disc list-inside text-[11px] text-gray-600 pl-1 space-y-0.5">
                    {formData.selectedSubjects.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-2.5 bg-black text-[#FFE3A0] hover:bg-gray-800 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface CounsellingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookCounsellingModal: React.FC<CounsellingModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    examLevel: 'Class 12th Pass (CS Career Roadmap)',
    date: 'Tomorrow at 4:00 PM',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close with Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please provide your name, email address, and WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await saveCounsellingBooking({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      examLevel: formData.examLevel,
      date: formData.date,
      notes: formData.notes.trim(),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(
        result.message || 'Unable to confirm your slot in the database right now. Please check your connection and retry.'
      );
      return;
    }

    const generatedId = result.booking?.id || `FREE-${Date.now().toString().slice(-4)}`;
    setBookingId(generatedId);
    setDbSaved(true);
    setSubmitted(true);
  };

  const getWhatsAppStudentUrl = () => {
    const text = encodeURIComponent(
      `Hello Harkiran Ma'am! I have just booked a Free 1-on-1 Guidance Call on your website.\n\n` +
      `👤 Name: ${formData.name}\n` +
      `📧 Email: ${formData.email}\n` +
      `📱 WhatsApp: ${formData.phone}\n` +
      `📚 Exam Target: ${formData.examLevel}\n` +
      `⏰ Preferred Slot: ${formData.date}\n` +
      (formData.notes ? `📝 Query: ${formData.notes}\n` : '') +
      `\nKindly confirm my call slot. Thank you!`
    );
    return `https://wa.me/919284084523?text=${text}`; // admin desk
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Viewport Floating Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[80] p-2.5 sm:px-4 sm:py-2 rounded-full bg-black/85 hover:bg-black text-white hover:text-[#FFE3A0] shadow-2xl border border-white/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-montserrat font-bold"
        title="Close (Esc)"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Close</span>
      </button>

      <div className="bg-white border-2 border-[#C8A45D]/60 rounded-3xl w-full max-w-lg p-6 sm:p-7 relative shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-poppins">
        {/* Top Header with Close Pill */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-montserrat font-bold text-[#8A651E] uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> 1-on-1 Free Strategy Call
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0F0F0F]">
              Book Free Counselling Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-montserrat font-bold text-xs transition-colors cursor-pointer border border-gray-200 shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {!submitted ? (
          <div className="overflow-y-auto flex-1 pt-3 pr-0.5 space-y-4">
            <p className="text-xs text-gray-600 font-poppins leading-relaxed">
              Get an honest 15-minute 1-on-1 session with Harkiran Kaur (AIR 3 • 413/700 with 4 exemptions) to review your study plan, exam strategy, and subject approach.
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2.5 rounded-xl focus:outline-none"
                  />
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Call slot confirmation will be sent here</span>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">WhatsApp ID / Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2.5 rounded-xl focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-600 font-medium mt-0.5 block">For 1-on-1 call & WhatsApp update</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Exam Level / Stage *</label>
                  <select
                    value={formData.examLevel}
                    onChange={(e) => setFormData({ ...formData, examLevel: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="Class 12th Pass (CS Career Roadmap)">Class 12th Pass (CS Career Roadmap & Counselling)</option>
                    <option value="CSEET">CSEET Aspirant</option>
                    <option value="CS Executive Group 1">CS Executive Group 1</option>
                    <option value="CS Executive Group 2">CS Executive Group 2</option>
                    <option value="CS Executive Both Groups">CS Executive Both Groups</option>
                    <option value="CS Professional Group 1">CS Professional Group 1</option>
                    <option value="CS Professional Group 2">CS Professional Group 2</option>
                    <option value="CS Professional Both Groups">CS Professional Both Groups</option>
                    <option value="Parent Inquiry">Parent / Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Preferred Time Slot *</label>
                  <select
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="Today Evening (6:00 PM - 8:00 PM)">Today Evening (6:00 PM - 8:00 PM)</option>
                    <option value="Tomorrow Morning (10:00 AM - 12:00 PM)">Tomorrow Morning (10:00 AM - 12:00 PM)</option>
                    <option value="Tomorrow Evening (4:00 PM - 6:00 PM)">Tomorrow Evening (4:00 PM - 6:00 PM)</option>
                    <option value="Tomorrow Night (8:00 PM - 9:30 PM)">Tomorrow Night (8:00 PM - 9:30 PM)</option>
                    <option value="Weekend Special Slot">Weekend Special Slot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Your Key Question or Goal (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Preparing for Dec 2026 attempt, need daily study timetable and Company Law strategy"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#F8F6F2] border border-gray-300 focus:border-[#C8A45D] text-[#0F0F0F] px-3.5 py-2 rounded-xl focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-montserrat font-bold text-xs rounded-xl uppercase tracking-wider transition-colors cursor-pointer border border-gray-200"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 font-montserrat font-bold text-black gold-gradient-bg rounded-xl uppercase tracking-wider hover:brightness-110 transition-all shadow-lg cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Booking Slot...</span>
                    </>
                  ) : (
                    <span>Confirm Free Session Slot</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">Free Session Confirmed!</h3>

            <div className="bg-[#FAF8F5] border border-[#C8A45D]/40 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">Student Name:</span>
                <span className="font-bold text-black">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">Email Address:</span>
                <span className="font-bold text-[#8A651E]">{formData.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">WhatsApp ID:</span>
                <span className="font-bold text-emerald-800">{formData.phone}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500">Preferred Slot:</span>
                <span className="font-bold text-black">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Exam Target:</span>
                <span className="font-bold text-black">{formData.examLevel}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 leading-relaxed font-poppins max-w-sm mx-auto">
              Harkiran Kaur will connect with you at your chosen slot. You can also directly chat with Harkiran on WhatsApp now:
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={getWhatsAppStudentUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-montserrat font-bold transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Harkiran on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-black text-[#FFE3A0] hover:bg-gray-800 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface AnswersheetSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customProduct: Product) => void;
  onBuyNow: (customProduct: Product) => void;
}

export const AnswersheetSubjectModal: React.FC<AnswersheetSubjectModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Paper 2: Company Law & Practice',
  ]);

  // Close with Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const PRICE_PER_SUBJECT = 699;
  const ORIGINAL_PRICE_PER_SUBJECT = 1200;

  const subjectCatalog = [
    {
      group: 'CS Executive - Group 1',
      badge: 'Exec G1',
      badgeColor: 'bg-amber-500/20 text-amber-900 border-amber-500/30',
      subjects: [
        'Paper 1: Jurisprudence, Interpretation & General Laws (JIGL)',
        'Paper 2: Company Law & Practice',
        'Paper 3: Setting Up of Business, Industrial & Labour Laws (SBLL)',
        'Paper 4: Corporate Accounting & Financial Management (CAFM)',
      ],
    },
    {
      group: 'CS Executive - Group 2',
      badge: 'Exec G2',
      badgeColor: 'bg-blue-500/20 text-blue-900 border-blue-500/30',
      subjects: [
        'Paper 5: Capital Market & Securities Laws (CMSL)',
        'Paper 6: Economic, Commercial and Intellectual Property Laws (ECIPL)',
        'Paper 7: Tax Laws & Practice (TLP)',
      ],
    },
    {
      group: 'CS Professional - Group 1',
      badge: 'Prof G1',
      badgeColor: 'bg-purple-500/20 text-purple-900 border-purple-500/30',
      subjects: [
        'Paper 1: Environmental, Social and Governance (ESG) – Principles & Practice',
        'Paper 2: Drafting, Pleadings and Appearances',
        'Paper 3: Compliance Management, Audit & Due Diligence',
        'Paper 4: Elective 1 (Open-Book Exam: CSR / Forensic Audit / IPR / AI & Cyber Security)',
      ],
    },
    {
      group: 'CS Professional - Group 2',
      badge: 'Prof G2',
      badgeColor: 'bg-purple-500/20 text-purple-900 border-purple-500/30',
      subjects: [
        'Paper 5: Strategic Management & Corporate Finance',
        'Paper 6: Corporate Restructuring, Valuation & Insolvency',
        'Paper 7: Elective 2 (Open-Book Exam: Arbitration / GST & Tax / Labour / Banking / IBC)',
      ],
    },
  ];

  const allSubjectsList = subjectCatalog.flatMap((g) => g.subjects);

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length === 1) return; // keep at least 1
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const selectGroup = (groupSubjects: string[]) => {
    const allInGroupSelected = groupSubjects.every((s) => selectedSubjects.includes(s));
    if (allInGroupSelected) {
      const remaining = selectedSubjects.filter((s) => !groupSubjects.includes(s));
      setSelectedSubjects(remaining.length > 0 ? remaining : [groupSubjects[0]]);
    } else {
      const merged = Array.from(new Set([...selectedSubjects, ...groupSubjects]));
      setSelectedSubjects(merged);
    }
  };

  const selectAll = () => {
    setSelectedSubjects(allSubjectsList);
  };

  const clearToSingle = () => {
    setSelectedSubjects(['Paper 2: Company Law & Practice']);
  };

  const count = selectedSubjects.length;
  const totalPrice = count * PRICE_PER_SUBJECT;
  const totalOriginalPrice = count * ORIGINAL_PRICE_PER_SUBJECT;

  const buildProductObject = (): Product => {
    const isSingle = count === 1;
    const cleanNames = selectedSubjects.map((s) => s.split(': ')[1] || s);
    const shortTitle = isSingle
      ? `June 2026 Answersheet Analysis (${cleanNames[0]})`
      : `June 2026 Answersheet Analysis - ${count} Subjects`;

    return {
      id: `june-2026-answersheet-${Date.now()}`,
      name: shortTitle,
      category: 'Test Series',
      price: totalPrice,
      originalPrice: totalOriginalPrice,
      badge: `${count} Subject${count > 1 ? 's' : ''} • ₹699/sub`,
      type: 'test-series',
      level: 'executive',
      selectedProgram: 'ICSI Answersheet Evaluation',
      selectedSubjects: cleanNames,
      pricePerSubject: PRICE_PER_SUBJECT,
      description: `June 2026 ICSI Certified Answersheet Analysis & Step-Marking Report by AIR 3 Harkiran Kaur Kohli for ${count} subject(s): ${cleanNames.join(', ')}.`,
      features: [
        `Selected Subjects (${count}): ${cleanNames.join(', ')}`,
        `Billing: ₹699 × ${count} subject${count > 1 ? 's' : ''} = ₹${totalPrice.toLocaleString('en-IN')}/-`,
        'Line-by-line mark deduction & statutory drafting audit',
        'ICSI step-marking breakdown against official model answers',
        'Personal audio/video feedback breakdown by AIR 3 Harkiran Kaur',
        'Personalized score-boosting action plan for next attempt',
        'Turnaround time: 48-72 hours via WhatsApp / Email',
      ],
      modules: [],
    };
  };

  const handleAdd = () => {
    const prod = buildProductObject();
    onAddToCart(prod);
    onClose();
  };

  const handleBuy = () => {
    const prod = buildProductObject();
    onBuyNow(prod);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Viewport Floating Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[80] p-2.5 sm:px-4 sm:py-2 rounded-full bg-black/85 hover:bg-black text-white hover:text-[#FFE3A0] shadow-2xl border border-white/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-montserrat font-bold"
        title="Close (Esc)"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Close</span>
      </button>

      <div className="bg-white border-2 border-[#C8A45D]/60 rounded-3xl w-full max-w-2xl p-5 sm:p-7 relative shadow-2xl overflow-hidden max-h-[92vh] flex flex-col font-poppins">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center shrink-0 border border-[#C8A45D]/40">
              <FileCheck className="w-6 h-6 text-[#8A651E]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-montserrat font-bold text-[#8A651E] uppercase tracking-wider">
                  June 2026 ICSI Certified Copy Evaluation
                </span>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-900 border border-amber-500/30 rounded-full font-bold text-[9.5px]">
                  ₹699 / Subject
                </span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#0F0F0F] leading-tight">
                Select Subjects for Answersheet Audit
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-montserrat font-bold text-xs transition-colors cursor-pointer border border-gray-200 shrink-0"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Informational Subtext */}
        <div className="py-2 text-xs text-gray-600 border-b border-gray-100 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Choose the exact subject(s) you appeared for in June 2026:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="text-[10px] font-bold text-[#8A651E] hover:underline cursor-pointer"
            >
              Select All
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={clearToSingle}
              className="text-[10px] font-bold text-gray-500 hover:underline cursor-pointer"
            >
              Reset to 1
            </button>
          </div>
        </div>

        {/* Scrollable Subject Grid */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {subjectCatalog.map((catalogGroup, gIdx) => {
            const allSelectedInGroup = catalogGroup.subjects.every((s) =>
              selectedSubjects.includes(s)
            );
            return (
              <div key={gIdx} className="p-3.5 bg-[#FAF8F5] border border-[#C8A45D]/30 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-montserrat font-bold border ${catalogGroup.badgeColor}`}>
                      {catalogGroup.badge}
                    </span>
                    <h4 className="font-cinzel font-bold text-xs text-[#0F0F0F]">
                      {catalogGroup.group}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectGroup(catalogGroup.subjects)}
                    className="text-[10px] font-semibold text-[#8A651E] hover:underline cursor-pointer"
                  >
                    {allSelectedInGroup ? 'Deselect Group' : 'Select All in Group'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catalogGroup.subjects.map((subjectName) => {
                    const isChecked = selectedSubjects.includes(subjectName);
                    return (
                      <div
                        key={subjectName}
                        onClick={() => toggleSubject(subjectName)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                          isChecked
                            ? 'bg-white border-[#C8A45D] shadow-xs text-[#0F0F0F] font-medium ring-1 ring-[#C8A45D]/40'
                            : 'bg-[#F4EFEA] border-transparent text-gray-500 hover:bg-white'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-[#8A651E] border-[#8A651E] text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="leading-snug">
                          <span className="text-xs">{subjectName}</span>
                          <span className="block text-[10px] text-[#8A651E] font-bold mt-0.5">₹699/-</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Total & Actions Bar */}
        <div className="pt-4 border-t border-[#C8A45D]/30 shrink-0 bg-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gradient-to-r from-[#181818] to-[#101010] rounded-2xl text-white">
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-[#C8A45D] block">
                Total for {count} Subject{count > 1 ? 's' : ''} Evaluation:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-cinzel text-2xl font-black text-[#FFE3A0]">
                  ₹{totalPrice.toLocaleString('en-IN')}/-
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{totalOriginalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#FFE3A0] font-bold bg-[#C8A45D]/20 px-2 py-0.5 rounded border border-[#C8A45D]/40">
                  ₹699 / Subject • 1st 10 Got Offers (Next: 5% Off Mentorship)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:w-auto w-full">
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-montserrat font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-[#C8A45D]" />
                <span>Add ({count})</span>
              </button>
              <button
                type="button"
                onClick={handleBuy}
                className="px-5 py-2.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black text-xs font-montserrat font-extrabold rounded-xl flex items-center justify-center gap-1.5 uppercase cursor-pointer hover:brightness-110 shadow-lg transition-all whitespace-nowrap"
              >
                <span>Instant Buy</span>
                <Zap className="w-3.5 h-3.5 fill-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

