import React, { useState } from 'react';
import {
  TEST_SERIES_PROGRAMS,
  TEST_SERIES_PRICE_PER_SUBJECT,
  TEST_SERIES_ORIGINAL_PRICE_PER_SUBJECT,
  createConfiguredTestSeriesProduct,
} from '../data/testSeriesCatalog';
import { useCart } from '../context/CartContext';
import {
  Check,
  CheckCircle2,
  FileCheck2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';

interface TestSeriesProgramSelectorProps {
  initialProgramId?: string;
  onSuccess?: () => void;
  isCompact?: boolean;
  onSelectAndCheckout?: (product: any) => void;
  className?: string;
}

export const TestSeriesProgramSelector: React.FC<TestSeriesProgramSelectorProps> = ({
  initialProgramId = 'exec-g1',
  onSuccess,
  isCompact = false,
  onSelectAndCheckout,
  className = '',
}) => {
  const { addToCart, buyNow } = useCart();
  const [selectedProgramId, setSelectedProgramId] = useState(initialProgramId);
  const currentProgram =
    TEST_SERIES_PROGRAMS.find((p) => p.id === selectedProgramId) ||
    TEST_SERIES_PROGRAMS[0];

  // Default to selecting all subjects of the initial program
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    currentProgram.subjects.map((s) => s.name)
  );

  const [addedToast, setAddedToast] = useState(false);

  // Switch program handler: auto-selects all subjects for the newly chosen program
  const handleSelectProgram = (programId: string) => {
    setSelectedProgramId(programId);
    const prog =
      TEST_SERIES_PROGRAMS.find((p) => p.id === programId) ||
      TEST_SERIES_PROGRAMS[0];
    setSelectedSubjects(prog.subjects.map((s) => s.name));
  };

  const handleToggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length === 1) {
        // Keep at least one subject selected
        return;
      }
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const handleSelectAll = () => {
    setSelectedSubjects(currentProgram.subjects.map((s) => s.name));
  };

  const handleClearAll = () => {
    // Keep first subject selected
    setSelectedSubjects([currentProgram.subjects[0].name]);
  };

  const subjectCount = selectedSubjects.length;
  const totalPrice = subjectCount * TEST_SERIES_PRICE_PER_SUBJECT;
  const originalTotalPrice = subjectCount * TEST_SERIES_ORIGINAL_PRICE_PER_SUBJECT;

  const currentConfiguredProduct = createConfiguredTestSeriesProduct(
    selectedProgramId,
    selectedSubjects
  );

  const handleAddToCart = () => {
    addToCart(currentConfiguredProduct);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  const handleBuyNow = () => {
    if (onSelectAndCheckout) {
      onSelectAndCheckout(currentConfiguredProduct);
    } else {
      buyNow(currentConfiguredProduct);
    }
    if (onSuccess) onSuccess();
  };

  return (
    <div
      className={`bg-[#0F0F0F] text-white border-2 border-[#C8A45D]/60 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden font-poppins ${className}`}
    >
      {/* Toast notification */}
      {addedToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>Added {subjectCount} Subject(s) to Cart!</span>
        </div>
      )}

      {/* Header Area */}
      <div className="border-b border-[#C8A45D]/30 pb-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C8A45D]/20 text-[#FFE3A0] border border-[#C8A45D]/40 text-[10px] font-montserrat font-extrabold uppercase tracking-wider">
              <FileCheck2 className="w-3.5 h-3.5 text-[#C8A45D]" />
              June 2026 Certified Copy Evaluation
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              ₹699 / Subject
            </span>
          </div>
          <h2 className="font-cinzel text-lg sm:text-xl md:text-2xl font-bold text-white mt-1">
            Configure Your Program &amp; Subject Selection
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Select your syllabus program, tick the specific subject(s) you need audited, and get instant dynamic billing at ₹699/subject.
          </p>
        </div>

        <div className="bg-[#1A1815] border border-[#C8A45D]/40 px-3.5 py-2 rounded-2xl flex items-center gap-3 shrink-0">
          <Award className="w-6 h-6 text-[#FFE3A0] shrink-0" />
          <div>
            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
              Evaluator
            </span>
            <span className="text-xs font-bold text-white font-montserrat">
              Harkiran Kaur (AIR 3 Achiever)
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: CHOOSE PROGRAM */}
      <div className="space-y-2.5 mb-5">
        <label className="text-xs font-montserrat font-bold text-[#FFE3A0] uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#C8A45D] text-black text-[11px] font-black flex items-center justify-center">
            1
          </span>
          <span>Select Your Target Program Syllabus:</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {TEST_SERIES_PROGRAMS.map((prog) => {
            const isSelected = prog.id === selectedProgramId;
            return (
              <button
                key={prog.id}
                type="button"
                onClick={() => handleSelectProgram(prog.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#2A2316] to-[#1A1712] border-[#C8A45D] shadow-md shadow-[#C8A45D]/20 ring-1 ring-[#C8A45D]'
                    : 'bg-[#151515] border-white/10 hover:border-white/30 text-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                        isSelected
                          ? 'bg-[#C8A45D] text-black border-[#C8A45D]'
                          : 'bg-white/5 text-gray-400 border-white/10'
                      }`}
                    >
                      {prog.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FFE3A0]" />
                    )}
                  </div>
                  <span className="font-montserrat font-bold text-xs text-white block leading-tight">
                    {prog.name.replace(' - ', '\n')}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 mt-2 block font-medium">
                  {prog.subjects.length} Subjects
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: SELECT SUBJECTS ACCORDING TO PROGRAM */}
      <div className="space-y-2.5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-montserrat font-bold text-[#FFE3A0] uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#C8A45D] text-black text-[11px] font-black flex items-center justify-center">
              2
            </span>
            <span>
              Select Subject(s) under <strong className="text-white">{currentProgram.name}</strong>:
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[11px] font-montserrat font-semibold text-[#FFE3A0] hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              Select All ({currentProgram.subjects.length})
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-montserrat font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors cursor-pointer"
            >
              Reset to 1
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {currentProgram.subjects.map((subject) => {
            const isChecked = selectedSubjects.includes(subject.name);
            return (
              <div
                key={subject.name}
                onClick={() => handleToggleSubject(subject.name)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isChecked
                    ? 'bg-gradient-to-r from-[#201C15] to-[#171512] border-[#C8A45D] shadow-sm'
                    : 'bg-[#151515] border-white/10 hover:border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isChecked
                        ? 'bg-[#C8A45D] border-[#C8A45D] text-black'
                        : 'border-white/30 bg-black/40'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-[#FFE3A0] uppercase bg-[#C8A45D]/20 px-1.5 py-0.5 rounded border border-[#C8A45D]/30">
                        {subject.code}
                      </span>
                      <span className="text-[10px] font-bold text-gray-300">
                        ({subject.shortName})
                      </span>
                      {subject.isElective && (
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                          Elective Paper
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-white mt-1 leading-snug">
                      {subject.name}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#FFE3A0] font-montserrat block">
                    ₹699/-
                  </span>
                  <span className="text-[10px] text-gray-500 line-through block">
                    ₹1,200
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 3: LIVE BILLING BREAKDOWN */}
      <div className="bg-gradient-to-r from-[#1E1B16] via-[#171512] to-[#13110E] border border-[#C8A45D]/40 rounded-2xl p-4 sm:p-5 mb-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-montserrat font-bold text-gray-400 uppercase tracking-wider block">
              Configured Selection Summary
            </span>
            <div className="text-sm font-bold text-white font-montserrat flex items-center gap-2 mt-0.5">
              <span>{currentProgram.name}</span>
              <span className="px-2 py-0.5 bg-[#C8A45D]/20 text-[#FFE3A0] rounded-full text-xs border border-[#C8A45D]/40">
                {subjectCount} Subject{subjectCount > 1 ? 's' : ''} Selected
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              Total Paorble Amount
            </span>
            <div className="flex items-baseline justify-end gap-2">
              <span className="font-cinzel text-2xl sm:text-3xl font-black text-[#FFE3A0]">
                ₹{totalPrice.toLocaleString('en-IN')}/-
              </span>
              <span className="text-xs text-gray-500 line-through">
                ₹{originalTotalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE3A0]" />
            <span>
              Dynamic Billing Calculation: <strong className="text-white">₹699</strong> ×{' '}
              <strong className="text-[#FFE3A0]">{subjectCount}</strong> subject{subjectCount > 1 ? 's' : ''} ={' '}
              <strong className="text-white font-mono">₹{totalPrice.toLocaleString('en-IN')}/-</strong>
            </span>
          </div>

          <span className="text-[11px] text-emerald-400 font-semibold">
            ✓ Line-by-Line Copy Audit &amp; ICSI Step Deduction Report
          </span>
        </div>
      </div>

      {/* STEP 4: ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full sm:w-auto py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-montserrat font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20"
        >
          <ShoppingBag className="w-4 h-4 text-[#FFE3A0]" />
          <span>Add {subjectCount} Subject(s) to Cart (₹{totalPrice.toLocaleString('en-IN')})</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-black text-xs sm:text-sm rounded-xl shadow-xl shadow-[#C8A45D]/25 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <span>Enroll &amp; Pay Now • ₹{totalPrice.toLocaleString('en-IN')}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
