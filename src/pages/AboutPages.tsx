import React from 'react';
import founderImg from '../assets/images/regenerated_image_1785612225656.jpg';
import { PageId } from '../types';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Users,
  Target,
  ShieldCheck,
  Brain,
  GraduationCap,
  ArrowRight,
  Heart,
  Star,
  Quote,
} from 'lucide-react';

interface PageProps {
  onNavigate: (page: PageId) => void;
  onOpenJoinModal: () => void;
  onOpenCounsellingModal: () => void;
}

export const AboutHKPage: React.FC<PageProps> = ({
  onNavigate,
  onOpenJoinModal,
  onOpenCounsellingModal,
}) => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest">
          About HK Code of Rankers
        </span>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#FFE3A0]/40 via-[#C8A45D]/20 to-[#FFE3A0]/40 border border-[#C8A45D] rounded-full text-black text-xs font-montserrat font-extrabold shadow-sm">
          <Award className="w-3.5 h-3.5 text-[#8A651E]" />
          <span>Founded by Harkiran Kaur Kohli • CS Qualified at the Age of 19 Years (AIR 3)</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-[#0F0F0F] leading-tight">
          Your Personal Anchor in Your CS Journey
        </h1>
        <p className="text-xs sm:text-sm text-[#444444] leading-relaxed font-poppins">
          Founded by <strong>Harkiran Kaur Kohli</strong>, who <strong>qualified as a Company Secretary at the young age of 19 years</strong> and achieved <strong>All India Rank 3 (AIR 3) in the CS Professional Examination</strong>. We built HK Code of Rankers with a simple, warm mission: to make sure no CS aspirant ever feels lost, overwhelmed, or left behind in crowded classrooms. By keeping our batches intimate—just 25 seats per level—we give you personal 1-on-1 guidance, line-by-line test paper evaluation, and genuine daily encouragement.
        </p>
      </div>

      {/* Core Philosophy Section */}
      <div className="bg-white border-l-4 border-l-[#C8A45D] border border-[#C8A45D]/40 rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-md">
        <div className="space-y-4">
          <h2 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">Max 25 Aspirants Per Level Mentorship Batch</h2>
          <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-poppins">
            In standard coaching centers, teachers present lectures to hundreds of faces without knowing who understood the concept or who is falling behind.
          </p>
          <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-poppins">
            At HK Code of Rankers, we strictly maintain a Max 25 aspirants per level mentorship batch limit. This allows Harkiran Kaur to personally review every aspirant's daily study hours, grade their test papers line-by-line, and conduct weekly 1-on-1 strategy calls.
          </p>
        </div>
        <div className="space-y-3 bg-[#F8F6F2] p-6 rounded-2xl border border-[#C8A45D]/30 text-xs text-[#222222]">
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#C8A45D]/30 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0" />
            <span className="font-medium">Direct Access to Founder Mentor</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#C8A45D]/30 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0" />
            <span className="font-medium">Customized Daily Targets for Both Groups</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#C8A45D]/30 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0" />
            <span className="font-medium">ICSI Pattern Test Paper Evaluation within 48 Hrs</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center bg-[#0F0F0F] text-white border border-[#C8A45D]/40 p-8 rounded-3xl space-y-4 shadow-xl">
        <h3 className="font-cinzel text-2xl font-bold text-white">Experience The Rankers Difference</h3>
        <p className="text-xs text-gray-300">Book a free 1-on-1 session with Harkiran Kaur today.</p>
        <button
          onClick={onOpenCounsellingModal}
          className="px-6 py-3 bg-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl hover:bg-[#FFE3A0] transition-colors cursor-pointer"
        >
          Book Free Counselling Call
        </button>
      </div>
    </div>
  );
};

export const FounderPage: React.FC<PageProps> = ({
  onNavigate,
  onOpenJoinModal,
  onOpenCounsellingModal,
}) => {
  const [showCvModal, setShowCvModal] = React.useState(false);

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Founder Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 text-center space-y-4">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl bg-gradient-to-br from-[#FFE3A0] via-[#C8A45D] to-[#8A651E] p-1.5 mx-auto shadow-2xl overflow-hidden group">
            <img
              src={founderImg}
              alt="Harkiran Kaur Kohli - Founder & Head Mentor"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[22px] transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div>
            <h2 className="font-cinzel text-3xl font-bold text-[#0F0F0F]">Harkiran Kaur Kohli</h2>
            <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
              <span className="px-3 py-1 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] text-black font-montserrat font-extrabold text-[11px] rounded-full uppercase tracking-wider shadow-sm">
                CS Qualified at 19 Years • AIR 3 Ranker • CS Professional
              </span>
            </div>
            <p className="text-xs font-montserrat font-bold text-[#8A651E] uppercase mt-1">
              Founder & Head Mentor
            </p>
          </div>

          <button
            onClick={() => setShowCvModal(true)}
            className="px-4 py-2 bg-[#F8F6F2] hover:bg-[#C8A45D] hover:text-black border border-[#C8A45D]/40 text-[#0F0F0F] rounded-xl text-xs font-montserrat font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-[#8A651E]" />
            <span>View Harkiran's Verified AIR 3 Profile & CV</span>
          </button>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest">
            A Personal Note From Harkiran
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#0F0F0F] leading-tight">
            Hi! I'm Harkiran Kaur Kohli
          </h1>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100/80 border border-[#C8A45D]/50 rounded-full text-[#8A651E] text-xs font-bold font-montserrat shadow-xs">
            <Award className="w-4 h-4 text-[#8A651E]" />
            <span>CS Qualified at 19 Years • All India Rank 3 (AIR 3) – CS Professional Achiever</span>
          </div>
          <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-poppins">
            Having <strong>qualified as a Company Secretary at the young age of just 19 years</strong> and achieving <strong>All India Rank 3 (AIR 3) in the CS Professional Exam</strong> (clearing CSEET & CS Executive with top exemptions on first attempts), I know firsthand the exact strategic blueprint, revision cycles, and answer-drafting precision needed to turn preparation into ranker-level execution.
          </p>
          <p className="text-xs sm:text-sm text-[#333333] leading-relaxed font-poppins">
            I didn't launch HK Code of Rankers to build another massive, impersonal coaching factory. I created an elite, high-touch mentorship sanctuary capped strictly at 25 aspirants per batch. My mission is to give you genuine 1-on-1 guidance, line-by-line evaluated test paper feedback, and battle-tested revision routines so you can face the ICSI exams with absolute calm and ranker confidence!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenJoinModal}
              className="px-6 py-3 bg-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl hover:bg-[#FFE3A0] transition-colors cursor-pointer shadow-md"
            >
              Apply For Harkiran's Mentorship Batch
            </button>
            <button
              onClick={onOpenCounsellingModal}
              className="px-6 py-3 bg-white text-[#0F0F0F] border border-[#C8A45D]/40 hover:border-[#C8A45D] font-montserrat font-semibold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              Book 1-on-1 Call With Harkiran (AIR 3)
            </button>
          </div>
        </div>
      </div>

      {/* Accomplishments Grid from CV */}
      <div className="space-y-6">
        <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F] text-center">
          Verified Academic, Ranker & Competition Honors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-5 bg-gradient-to-br from-amber-50/80 to-white border-2 border-[#C8A45D] rounded-2xl space-y-2 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
            <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-[#C8A45D] text-black font-extrabold text-[9px] rounded-full uppercase tracking-wider">
              Top Rank
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 text-[#8A651E] flex items-center justify-center font-black text-sm">
              AIR 3
            </div>
            <p className="font-cinzel text-base font-bold text-[#0F0F0F]">All India Rank 3 (AIR 3)</p>
            <p className="text-xs text-gray-700 font-medium">
              <strong>CS Qualified at the young age of 19 Years</strong> with All India Rank 3 in CS Professional Examination, securing <strong>413/700 Marks & 4 Exemptions</strong> (Corporate Drafting, Governance, Compliance & Restructuring).
            </p>
          </div>

          <div className="p-5 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-2 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              1st Try
            </div>
            <p className="font-cinzel text-base font-bold text-[#0F0F0F]">First Attempt CS Executive</p>
            <p className="text-xs text-gray-600">
              Cleared Both Group I (211/400) & Group II (177/300) in First Attempt. Felicitated by ICSI Nashik Chapter.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-2 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-bold">
              1st Try
            </div>
            <p className="font-cinzel text-base font-bold text-[#0F0F0F]">First Attempt CSEET</p>
            <p className="text-xs text-gray-600">
              Cleared CSEET on First Attempt with 153/200 score in July 2024.
            </p>
          </div>

          <div className="p-5 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-2 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#8A651E] flex items-center justify-center font-bold">
              Rank 1
            </div>
            <p className="font-cinzel text-base font-bold text-[#0F0F0F]">Moot Court Champion</p>
            <p className="text-xs text-gray-600">
              Rank 1 – 24th ICSI Moot Court Competition 2026 (Chapter Level).
            </p>
          </div>

          <div className="p-5 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-2 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-bold">
              84%
            </div>
            <p className="font-cinzel text-base font-bold text-[#0F0F0F]">Academic Distinction</p>
            <p className="text-xs text-gray-600">
              Passed 12th Board ISC (84% - 420/500) and 10th ICSE (72% - 432/600).
            </p>
          </div>

          <div className="p-5 bg-white border border-[#C8A45D]/30 rounded-2xl space-y-2 shadow-sm hover:border-[#C8A45D] transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-bold">
              MUN
            </div>
            <p className="font-cinzel text-base font-bold text-[#0F0F0F]">Leadership & Writing</p>
            <p className="text-xs text-gray-600">
              Former USG & Vice-Chairperson at AMUN. Published writer and poet.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive CV Modal */}
      {showCvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative border border-[#C8A45D]/40">
            <button
              onClick={() => setShowCvModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#C8A45D]/20 p-1 shrink-0 overflow-hidden">
                <img
                  src={founderImg}
                  alt="Harkiran Kaur Kohli"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">Harkiran Kaur Kohli</h3>
                <p className="text-xs text-[#8A651E] font-montserrat font-bold">
                  CS Qualified at Age 19 • All India Rank 3 (AIR 3) • CS Professional | Founder & Head Mentor
                </p>
              </div>
            </div>

            {/* Qualifications breakdown */}
            <div className="space-y-4 text-xs font-poppins">
              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-[#C8A45D]/50 rounded-xl flex items-center justify-between text-xs font-montserrat font-bold text-[#8A651E]">
                <span>⭐ Key Milestone: CS Qualified at the Age of 19 Years</span>
                <span className="px-2 py-0.5 bg-[#C8A45D] text-black rounded text-[10px]">AIR 3 Ranker</span>
              </div>

              <h4 className="font-montserrat font-bold text-sm text-[#0F0F0F] uppercase tracking-wider text-[#8A651E]">
                Professional Qualifications
              </h4>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-[#141414] text-[#C8A45D] font-bold p-2.5 grid grid-cols-12">
                  <div className="col-span-4">Course</div>
                  <div className="col-span-4">Group / Level</div>
                  <div className="col-span-4 text-right">Result / Distinction</div>
                </div>
                <div className="p-2.5 grid grid-cols-12 border-b border-gray-100 bg-amber-50/70 font-semibold text-[#0F0F0F]">
                  <div className="col-span-4 flex items-center gap-1.5 font-bold">
                    <Award className="w-3.5 h-3.5 text-[#8A651E]" />
                    <span>CS Professional</span>
                  </div>
                  <div className="col-span-4 text-[#8A651E] font-bold">Final Professional Exam</div>
                  <div className="col-span-4 text-right font-black text-amber-800">AIR 3 (413/700 • 4 Exemptions)</div>
                </div>
                <div className="p-2.5 grid grid-cols-12 border-b border-gray-100 bg-white">
                  <div className="col-span-4 font-semibold">CS Executive</div>
                  <div className="col-span-4 text-gray-600">Group I (Dec 2024)</div>
                  <div className="col-span-4 text-right font-bold text-emerald-700">211 / 400 (First Attempt)</div>
                </div>
                <div className="p-2.5 grid grid-cols-12 border-b border-gray-100 bg-gray-50">
                  <div className="col-span-4 font-semibold">CS Executive</div>
                  <div className="col-span-4 text-gray-600">Group II (June 2025)</div>
                  <div className="col-span-4 text-right font-bold text-emerald-700">177 / 300 (First Attempt)</div>
                </div>
                <div className="p-2.5 grid grid-cols-12 bg-white">
                  <div className="col-span-4 font-semibold">CSEET</div>
                  <div className="col-span-4 text-gray-600">July 2024</div>
                  <div className="col-span-4 text-right font-bold text-emerald-700">153 / 200 (First Attempt)</div>
                </div>
              </div>

              <h4 className="font-montserrat font-bold text-sm text-[#0F0F0F] uppercase tracking-wider text-[#8A651E] pt-2">
                Educational Qualifications
              </h4>

              <div className="space-y-2 text-gray-700">
                <p className="flex justify-between border-b border-gray-100 pb-1">
                  <span><strong>B.Com:</strong> SPPU Nashik (Pursuing - Batch 2027)</span>
                  <span className="text-gray-500">Nashik</span>
                </p>
                <p className="flex justify-between border-b border-gray-100 pb-1">
                  <span><strong>12th ISC (Higher Secondary):</strong> Passed March 2024</span>
                  <span className="font-semibold text-emerald-700">420 / 500 (84%)</span>
                </p>
                <p className="flex justify-between border-b border-gray-100 pb-1">
                  <span><strong>10th ICSE (Secondary):</strong> Passed May 2022</span>
                  <span className="font-semibold text-emerald-700">432 / 600 (72%)</span>
                </p>
              </div>

              <h4 className="font-montserrat font-bold text-sm text-[#0F0F0F] uppercase tracking-wider text-[#8A651E] pt-2">
                Key Accomplishments
              </h4>

              <ul className="space-y-2 list-disc list-inside text-gray-700">
                <li><strong className="text-[#0F0F0F]">All India Rank 3 (AIR 3)</strong> in CS Professional Examination.</li>
                <li><strong>Rank 1</strong> – 24th ICSI Moot Court Competition 2026 (Nashik Chapter Level).</li>
                <li><strong>First Attempt Clearance</strong> in CSEET & CS Executive (Felicitated by ICSI Nashik Chapter).</li>
                <li><strong>Under Secretary General (USG) & Vice-Chairperson</strong> – Ashoka Model United Nations.</li>
                <li><strong>Published Writer & Poet</strong> – Authoring under pen name "Kaur Writes".</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowCvModal(false)}
                className="px-5 py-2.5 bg-[#141414] text-white font-montserrat font-bold text-xs rounded-xl hover:bg-[#C8A45D] hover:text-black transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promise to Aspirants */}
      <div className="bg-[#0F0F0F] text-white border border-[#C8A45D]/40 rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
        <h3 className="font-cinzel text-2xl font-bold text-white text-center">
          My Promise to the 25
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-poppins text-center max-w-3xl mx-auto">
          "Because I keep my batches strictly limited to 25 seats per level, I am bringing my exact first-attempt strategies, advanced answer-writing techniques, and custom-engineered test papers directly to you. I am not just a mentor; I am the person in the trenches with you. I will personally review your presentation gaps, design questions that sharpen your analytical skills, and stand by you until the final finish line."
        </p>
        <div className="text-center pt-2">
          <button
            onClick={onOpenJoinModal}
            className="px-6 py-3 bg-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl hover:bg-[#FFE3A0] transition-colors cursor-pointer"
          >
            Apply For Harkiran's Mentorship Batch
          </button>
        </div>
      </div>
    </div>
  );
};

export const VisionMissionPage: React.FC<PageProps> = ({ onNavigate, onOpenJoinModal }) => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest">
          Vision & Mission
        </span>
        <h1 className="font-cinzel text-4xl font-bold text-[#0F0F0F]">The Foundation of HK Code of Rankers</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white border border-[#C8A45D]/40 rounded-3xl space-y-4 shadow-sm">
          <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-wider">
            Our Vision
          </span>
          <h2 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">From Exam Anxiety to Absolute Calmness</h2>
          <p className="text-sm sm:text-base text-[#333333] leading-relaxed font-poppins italic border-l-4 border-[#C8A45D] pl-4 py-1">
            "To walk with every CS aspirant through every single phase, from their deepest anxiety to absolute calmness, right up to their very last fight in the exam hall."
          </p>
        </div>

        <div className="p-8 bg-white border border-[#C8A45D]/40 rounded-3xl space-y-4 shadow-sm">
          <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-wider">
            Our Mission
          </span>
          <h2 className="font-cinzel text-2xl font-bold text-[#0F0F0F]">Our Three Pillars</h2>
          <ul className="space-y-4 text-xs sm:text-sm text-[#333333] font-poppins">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-[#0F0F0F] font-montserrat block text-sm">25-Seat Personal Focus</strong>
                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
                  Keeping my first batch strictly limited to 25 seats so we can dedicate my full energy to each individual. No student under the Code will ever feel lonely, invisible, or left behind.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-[#0F0F0F] font-montserrat block text-sm">24/7 Availability</strong>
                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
                  Standing shoulder-to-shoulder with my students day and night. Whether it is a late-night conceptual doubt or a sudden moment of exam panic, we are always just a voice note away.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-[#0F0F0F] font-montserrat block text-sm">Next-Level Quality</strong>
                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
                  Designing highly advanced, analytical mock papers that challenge the mind, making the actual exam feel smooth, natural, and completely stress-free.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const WhyChoosePage: React.FC<PageProps> = ({ onNavigate, onOpenJoinModal }) => {
  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-montserrat font-bold text-[#C8A45D] uppercase tracking-widest">
          Why Choose HK
        </span>
        <h1 className="font-cinzel text-4xl font-bold text-[#0F0F0F]">
          Comparing HK Code of Rankers vs Conventional Coaching
        </h1>
      </div>

      <div className="bg-white border border-[#C8A45D]/40 rounded-3xl overflow-hidden text-xs shadow-md">
        <div className="grid grid-cols-12 bg-[#0F0F0F] p-4 font-montserrat font-bold text-[#C8A45D]">
          <div className="col-span-4">Feature</div>
          <div className="col-span-4 text-gray-300">Conventional Coaching</div>
          <div className="col-span-4 text-emerald-400">HK Code of Rankers</div>
        </div>

        <div className="grid grid-cols-12 p-4 border-b border-gray-100 text-[#333333]">
          <div className="col-span-4 font-semibold text-[#0F0F0F]">Batch Size</div>
          <div className="col-span-4 text-gray-500">200 - 500 Aspirants</div>
          <div className="col-span-4 text-emerald-700 font-bold">Strictly 25 Aspirants</div>
        </div>

        <div className="grid grid-cols-12 p-4 border-b border-gray-100 text-[#333333]">
          <div className="col-span-4 font-semibold text-[#0F0F0F]">Teacher Access</div>
          <div className="col-span-4 text-gray-500">Impersonal / Rare Calls</div>
          <div className="col-span-4 text-emerald-700 font-bold">Direct WhatsApp & 1-on-1 Phone Calls</div>
        </div>

        <div className="grid grid-cols-12 p-4 border-b border-gray-100 text-[#333333]">
          <div className="col-span-4 font-semibold text-[#0F0F0F]">Test Evaluation</div>
          <div className="col-span-4 text-gray-500">Generic Mark Slips</div>
          <div className="col-span-4 text-emerald-700 font-bold">Line-by-Line Feedback by Harkiran</div>
        </div>

        <div className="grid grid-cols-12 p-4 text-[#333333]">
          <div className="col-span-4 font-semibold text-[#0F0F0F]">Daily Tracking</div>
          <div className="col-span-4 text-gray-500">None (Self Study)</div>
          <div className="col-span-4 text-emerald-700 font-bold">Daily Study Hours & Chapter Logging</div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onOpenJoinModal}
          className="px-6 py-3 bg-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl hover:bg-[#FFE3A0] transition-colors cursor-pointer shadow-md"
        >
          Join The 25-Aspirant Mentorship Batch
        </button>
      </div>
    </div>
  );
};
