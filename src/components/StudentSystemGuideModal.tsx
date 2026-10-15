import React, { useEffect } from 'react';
import { X, Download, Share2, CheckCircle2, BookOpen, Layers, Award, Sparkles, ArrowRight, Check } from 'lucide-react';
import studentGuideImg from '../assets/images/student_system_guide_1789258518243.jpg';

interface StudentSystemGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const StudentSystemGuideModal: React.FC<StudentSystemGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = studentGuideImg;
    link.download = 'HarkiranKaur_CS_System_Guide.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Welcome to Harkiran Kaur CS Mentorship & HK StudyTrack Pro! Complete guidance, index tracking, and certified copy reviews. Visit: ${window.location.origin}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12110F] border border-[#C8A45D]/50 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl text-white">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#1A1815]/95 backdrop-blur-md px-6 py-4 border-b border-[#C8A45D]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C8A45D]/20 rounded-xl border border-[#C8A45D]/40">
              <Sparkles className="w-5 h-5 text-[#FFE3A0]" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white">
                Student Workflow &amp; System Guide
              </h3>
              <p className="text-[11px] text-gray-300">
                How the Website, Mentorship &amp; HK StudyTrack Pro Work
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-[#C8A45D]/20 hover:bg-[#C8A45D]/30 text-[#FFE3A0] border border-[#C8A45D]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download Infographic Image"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download Image</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy link to share with students"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Infographic Image Showcase */}
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden border-2 border-[#C8A45D]/40 shadow-2xl bg-black">
              <img
                src={studentGuideImg}
                alt="Harkiran Kaur CS Mentorship & HK StudyTrack Pro Student Workflow Guide"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Infographic: Harkiran Kaur CS Mentorship &amp; HK StudyTrack Pro Workflow</span>
              <button
                onClick={handleDownload}
                className="text-[#FFE3A0] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> Save to send to students
              </button>
            </div>
          </div>

          {/* 4-Step Breakdown Details */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#FFE3A0] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#C8A45D]" />
              How the System Works for CS Students (4 Steps)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Step 1 */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A45D] text-black font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h5 className="font-bold text-sm text-white">Choose Your Program or Index</h5>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Students choose their level: <strong>CSEET</strong>, <strong>CS Executive</strong> (Group 1, 2, or Both), or <strong>CS Professional</strong> (Group 1, 2, or Both). They can enroll in <strong>1-on-1 Mentorship</strong>, purchase standalone <strong>HK StudyTrack Pro CS Progress Index</strong> (from ₹699), or submit certified copies for <strong>Answersheet Analysis</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A45D] text-black font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h5 className="font-bold text-sm text-white">Instant Verification &amp; Login</h5>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Students complete their order via UPI or QR code. Verification happens automatically via the Central Admin Panel. Students log into their <strong>Student Portal</strong> using their registered mobile number or email with instant OTP.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A45D] text-black font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h5 className="font-bold text-sm text-white">Interactive HK StudyTrack Pro</h5>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  100% Student-Editable: Students track lectures watched, textbook readings, test completion, and 3 rounds of revision. Mark tricky concepts with the Red Doubt Flag (🚩) to prioritize during revision and mentor calls.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C8A45D] text-black font-extrabold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h5 className="font-bold text-sm text-white">1-on-1 Strategy &amp; AIR 3 Reviews</h5>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Mentorship students receive weekly customized study schedules, daily routine accountability checks, doubt resolution, and step-by-step ICSI presentation analysis directly from AIR 3 Harkiran Kaur.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="p-5 bg-gradient-to-r from-[#1C1813] to-[#252019] border border-[#C8A45D]/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-[#FFE3A0] block">Ready to explore programs and pricing?</span>
              <p className="text-[11px] text-gray-300">View all mentorship batches, StudyTrack Pro indexes, and test series.</p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {onNavigate && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('programs');
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
                >
                  <span>View All Programs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>Save Infographic</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
