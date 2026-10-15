import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import {
  UPI_PAYEE_CONFIG,
  buildUpiUri,
  getUpiQrCodeUrl,
  validateUtrNumber,
} from '../services/upiPayment';
import {
  TEST_SERIES_PROGRAMS,
  TEST_SERIES_PRICE_PER_SUBJECT,
  createConfiguredTestSeriesProduct,
} from '../data/testSeriesCatalog';
import {
  ShieldCheck,
  X,
  QrCode,
  Lock,
  CheckCircle2,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Smartphone,
  Sparkles,
  FileCheck2,
  Edit3,
  GraduationCap,
  Clock,
  Tag,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cartItems,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    totalAmount,
    subtotal,
    discountAmount,
    couponCode,
    discountPercentage,
    applyCoupon,
    removeCoupon,
    updateProductInCart,
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const { createOrder } = useOrders();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!couponInput.trim()) return;
    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  // Test Series Program & Subject selection while paying
  const testSeriesItem = cartItems.find(
    (ci) =>
      ci.product.type === 'test-series' ||
      ci.product.id.includes('test-series') ||
      ci.product.id.includes('answersheet')
  );

  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState('exec-g1');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Synchronize with cart item
  useEffect(() => {
    if (testSeriesItem) {
      if (
        testSeriesItem.product.selectedSubjects &&
        testSeriesItem.product.selectedSubjects.length > 0
      ) {
        setSelectedSubjects(testSeriesItem.product.selectedSubjects);
        const found = TEST_SERIES_PROGRAMS.find(
          (p) =>
            testSeriesItem.product.selectedProgram?.includes(p.name) ||
            p.name.includes(testSeriesItem.product.selectedProgram || '')
        );
        if (found) setSelectedProgramId(found.id);
      } else {
        // Needs configuration: open selector immediately so student picks program & subjects
        setShowSubjectPicker(true);
        const defProg = TEST_SERIES_PROGRAMS[0];
        setSelectedProgramId(defProg.id);
        const defSubs = defProg.subjects.map((s) => s.name);
        setSelectedSubjects(defSubs);
        const configured = createConfiguredTestSeriesProduct(defProg.id, defSubs);
        updateProductInCart(testSeriesItem.product.id, configured);
      }
    }
  }, [testSeriesItem?.product.id, isCheckoutModalOpen]);

  const currentProgram =
    TEST_SERIES_PROGRAMS.find((p) => p.id === selectedProgramId) ||
    TEST_SERIES_PROGRAMS[0];

  const handleProgramSelect = (progId: string) => {
    setSelectedProgramId(progId);
    const prog =
      TEST_SERIES_PROGRAMS.find((p) => p.id === progId) ||
      TEST_SERIES_PROGRAMS[0];
    const newSubs = prog.subjects.map((s) => s.name);
    setSelectedSubjects(newSubs);

    if (testSeriesItem) {
      const configured = createConfiguredTestSeriesProduct(progId, newSubs);
      updateProductInCart(testSeriesItem.product.id, configured);
    }
  };

  const handleToggleSubject = (subName: string) => {
    let updated: string[];
    if (selectedSubjects.includes(subName)) {
      if (selectedSubjects.length === 1) return; // Keep at least 1
      updated = selectedSubjects.filter((s) => s !== subName);
    } else {
      updated = [...selectedSubjects, subName];
    }
    setSelectedSubjects(updated);

    if (testSeriesItem) {
      const configured = createConfiguredTestSeriesProduct(selectedProgramId, updated);
      updateProductInCart(testSeriesItem.product.id, configured);
    }
  };

  const handleSelectAllSubjects = () => {
    const allSubs = currentProgram.subjects.map((s) => s.name);
    setSelectedSubjects(allSubs);
    if (testSeriesItem) {
      const configured = createConfiguredTestSeriesProduct(selectedProgramId, allSubs);
      updateProductInCart(testSeriesItem.product.id, configured);
    }
  };

  // Direct UPI Form States
  const [utrInput, setUtrInput] = useState('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showUtrGuide, setShowUtrGuide] = useState(true);
  const [guideApp, setGuideApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');

  // Student Billing Information
  const [billing, setBilling] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: 'CS Aspirant Desk',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isCheckoutModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCheckoutModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutModalOpen, setIsCheckoutModalOpen]);

  useEffect(() => {
    if (isCheckoutModalOpen) {
      setBilling({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: 'CS Aspirant Desk',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      });
      setPaymentError(null);
      setUtrError(null);
      setUtrInput('');
    }
  }, [isCheckoutModalOpen, user]);

  if (!isCheckoutModalOpen) return null;

  // If user is not logged in, prompt to register first per admissions policy
  if (!user) {
    return (
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsCheckoutModalOpen(false);
        }}
        className="fixed inset-0 z-50 overflow-y-auto font-poppins bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      >
        <div className="bg-[#0F0F0F] text-white border-2 border-[#C8A45D]/60 rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-6 text-center relative font-poppins">
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-[#C8A45D]/20 border border-[#C8A45D]/50 text-[#FFE3A0] flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8 text-[#C8A45D]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-montserrat px-3 py-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 rounded-full font-bold uppercase tracking-wider">
              Instant Access • No Approval Required
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Sign In or Register to Enroll
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
              Create your student account with <strong>instant access</strong> — no waiting for registration approval! Once logged in, complete your payment via UPI to link your course and access your personalized ICSI Mentorship Index.
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-[#1A1815] to-[#12100E] border border-[#C8A45D]/40 rounded-2xl text-left text-xs space-y-2 text-gray-300">
            <div className="font-bold text-[#FFE3A0] font-montserrat uppercase text-[11px]">
              How the Enrollment Flow Works:
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#C8A45D] text-black font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span><strong>Instant Register:</strong> Enter Name, Email, Mobile & Target Program — you are logged in immediately!</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#C8A45D] text-black font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span><strong>Pay via UPI:</strong> Scan the official QR code and enter your 12-digit UTR reference number.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-[#C8A45D] text-black font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span><strong>Portal Active:</strong> Admin verifies payment and unlocks your 1-on-1 mentorship calls & tracker.</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                openAuthModal('register');
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl shadow-md uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Create Free Account / Register</span>
            </button>

            <button
              onClick={() => {
                setIsCheckoutModalOpen(false);
                openAuthModal('login');
              }}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-montserrat font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Already Registered? Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(UPI_PAYEE_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Submit Direct UPI payment with 12-Digit UTR
  const handleSubmitDirectUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setUtrError(null);

    if (!billing.fullName.trim() || !billing.email.trim() || !billing.phone.trim()) {
      setPaymentError('Please fill in your full name, email, and contact phone number.');
      return;
    }

    const validation = validateUtrNumber(utrInput);
    if (!validation.isValid) {
      setUtrError(validation.errorMessage || 'Please enter a valid 12-digit UTR number.');
      return;
    }

    setIsProcessing(true);

    try {
      // Payment is saved on the server (in the database)
      const res = await createOrder('UPI', billing, {
        utrNumber: validation.cleanedUtr,
      });

      setIsProcessing(false);

      if (res.success) {
        setIsCheckoutModalOpen(false);
      } else {
        setPaymentError(res.message);
      }
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const courseTitle = cartItems.map((ci) => ci.product.name).join(' + ') || 'CS Mentorship Batch';
  const upiUri = buildUpiUri(totalAmount, courseTitle);
  const qrCodeUrl = getUpiQrCodeUrl(totalAmount, courseTitle);
  const cleanDigitsOnly = utrInput.replace(/\D/g, '');

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCheckoutModalOpen(false);
      }}
      className="fixed inset-0 z-50 overflow-y-auto font-poppins bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      {/* Viewport Floating Close Button - Always visible & easily reachable */}
      <button
        onClick={() => setIsCheckoutModalOpen(false)}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[80] p-2.5 sm:px-4 sm:py-2 rounded-full bg-black/85 hover:bg-black text-white hover:text-[#FFE3A0] shadow-2xl border border-white/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-montserrat font-bold"
        title="Close Window (Esc)"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
        <span className="hidden sm:inline">Close</span>
      </button>

      <div className="bg-[#0F0F0F] text-white border-2 border-[#C8A45D]/60 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col font-poppins relative">
        {/* Sticky Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#1A1815] via-[#141210] to-[#0F0F0F] border-b border-[#C8A45D]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-[#C8A45D]/50 flex items-center justify-center text-[#C8A45D] shadow-inner">
              <Lock className="w-5 h-5 text-[#FFE3A0]" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Enrollment & Seat Payment</span>
                <span className="text-[10px] font-montserrat px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold uppercase tracking-wider">
                  Direct UPI Payment
                </span>
              </h2>
              <p className="text-[11px] text-gray-400 font-poppins">
                HK Code of Rankers • Verified Payee: Harkiran kaur jatinder singh kohli (AIR 3)
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-full font-montserrat font-bold text-xs transition-colors cursor-pointer border border-white/20 shadow-xs"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Global Error Notice */}
        {paymentError && (
          <div className="mx-4 sm:mx-6 mt-3 p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{paymentError}</span>
          </div>
        )}

        {/* Main Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          <form onSubmit={handleSubmitDirectUpi} className="space-y-5">
            {/* Security Note Box */}
            <div className="p-4 bg-gradient-to-r from-[#C8A45D]/15 via-[#1A1713] to-[#C8A45D]/10 border border-[#C8A45D]/40 rounded-2xl flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-[#C8A45D]/20 text-[#FFE3A0] shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-[#C8A45D]" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="font-montserrat font-bold text-[#FFE3A0] flex items-center gap-2">
                  <span>100% Secure Direct Bank Transfer Guarantee</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold">
                    0% Gateway Fee
                  </span>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  Your fee is transferred <strong>directly</strong> to the verified personal bank account of{' '}
                  <strong className="text-white">Harkiran kaur jatinder singh kohli</strong> (Founder & Head Mentor, AIR 3).
                  Zero intermediary commissions, no extra surcharge, and instant direct verification.
                </p>
              </div>
            </div>

            {/* Program & Subject Selection / Order Summary Box */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-[#1A1815] via-[#141210] to-[#1A1815] border-2 border-[#C8A45D]/50 rounded-2xl space-y-4 shadow-lg text-white font-poppins">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#C8A45D]/20 text-[#FFE3A0] flex items-center justify-center shrink-0 border border-[#C8A45D]/30">
                    <FileCheck2 className="w-4 h-4 text-[#C8A45D]" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>Order Items & Subject Breakdown</span>
                    </h3>
                    <p className="text-[11px] text-gray-300">
                      {testSeriesItem
                        ? 'Select program and subjects below. Fee automatically bills at ₹699/- per subject.'
                        : 'Review your enrolled mentorship / course program before completing payment.'}
                    </p>
                  </div>
                </div>

                {testSeriesItem && (
                  <button
                    type="button"
                    onClick={() => setShowSubjectPicker(!showSubjectPicker)}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-[#C8A45D]/20 hover:bg-[#C8A45D]/30 text-[#FFE3A0] border border-[#C8A45D]/40 text-xs font-montserrat font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{showSubjectPicker ? 'Done Selecting' : 'Change Program / Subjects'}</span>
                    {showSubjectPicker ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-3">
                {cartItems.map((item, idx) => {
                  const isTestSeries =
                    item.product.type === 'test-series' ||
                    item.product.id.includes('test-series') ||
                    item.product.id.includes('answersheet');

                  return (
                    <div
                      key={`${item.product.id}-${idx}`}
                      className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-cinzel font-bold text-white text-sm">
                              {item.product.name}
                            </span>
                            {item.product.selectedProgram && (
                              <span className="px-2 py-0.5 rounded-full bg-[#C8A45D]/20 text-[#FFE3A0] border border-[#C8A45D]/30 text-[10px] font-montserrat font-bold">
                                {item.product.selectedProgram}
                              </span>
                            )}
                          </div>
                          {isTestSeries && (
                            <p className="text-[11px] text-gray-400">
                              Line-by-line mark deduction & statutory drafting audit by AIR 3 Harkiran Kaur Kohli
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="font-cinzel font-bold text-base sm:text-lg text-[#FFE3A0]">
                            ₹{item.product.price.toLocaleString('en-IN')}/-
                          </div>
                          {isTestSeries && (
                            <span className="text-[10px] text-[#C8A45D] font-bold block">
                              ₹699 × {item.product.selectedSubjects?.length || selectedSubjects.length} subject(s)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Display Selected Subject Badges */}
                      {isTestSeries && (
                        <div className="space-y-1.5 pt-1 border-t border-white/5">
                          <div className="flex items-center justify-between text-[11px] text-gray-300 font-medium">
                            <span>Selected Subjects ({selectedSubjects.length}):</span>
                            <span className="text-[#FFE3A0] font-bold">
                              ₹699 per subject
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {(item.product.selectedSubjects || selectedSubjects).map((sub, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2.5 py-1 rounded-lg bg-[#C8A45D]/15 border border-[#C8A45D]/40 text-[#FFE3A0] text-[11px] font-medium flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3 text-[#C8A45D] shrink-0" />
                                <span>{sub}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Interactive Program & Subject Selector (If testSeriesItem is present & toggle is open) */}
              {testSeriesItem && (showSubjectPicker || selectedSubjects.length === 0) && (
                <div className="p-4 bg-black/40 border border-[#C8A45D]/40 rounded-xl space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#FFE3A0] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
                      Step 1: Choose Your Program
                    </span>
                    <p className="text-[11px] text-gray-400">
                      Subjects change according to the program selected:
                    </p>
                  </div>

                  {/* 6 Program Switcher Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TEST_SERIES_PROGRAMS.map((prog) => {
                      const isActive = selectedProgramId === prog.id;
                      return (
                        <button
                          key={prog.id}
                          type="button"
                          onClick={() => handleProgramSelect(prog.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#C8A45D]/20 border-[#C8A45D] text-white shadow-sm ring-1 ring-[#C8A45D]'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] font-montserrat font-bold uppercase tracking-wider text-[#C8A45D]">
                              {prog.badge}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {prog.subjects.length} Subs
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white mt-1 leading-snug">
                            {prog.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Step 2: Subject Checkboxes for this Program */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#FFE3A0]">
                        Step 2: Choose Subjects for {currentProgram.name} (₹699/sub)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSelectAllSubjects}
                          className="text-[11px] text-[#FFE3A0] hover:underline font-semibold cursor-pointer"
                        >
                          Select All ({currentProgram.subjects.length})
                        </button>
                        <span className="text-gray-600">•</span>
                        <span className="text-[11px] text-gray-300 font-bold">
                          {selectedSubjects.length} Selected = ₹{(selectedSubjects.length * TEST_SERIES_PRICE_PER_SUBJECT).toLocaleString('en-IN')}/-
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {currentProgram.subjects.map((sub) => {
                        const isChecked = selectedSubjects.includes(sub.name);
                        return (
                          <div
                            key={sub.code + sub.name}
                            onClick={() => handleToggleSubject(sub.name)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 select-none ${
                              isChecked
                                ? 'bg-[#C8A45D]/20 border-[#C8A45D] text-white ring-1 ring-[#C8A45D]/40'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                isChecked
                                  ? 'bg-[#C8A45D] border-[#C8A45D] text-black font-black'
                                  : 'bg-black/40 border-gray-500'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-mono text-[#C8A45D] font-bold">
                                  {sub.code}
                                </span>
                                <span className="text-[10px] font-bold text-[#FFE3A0]">
                                  ₹699/-
                                </span>
                              </div>
                              <span className="text-[11.5px] font-medium leading-snug block truncate text-white">
                                {sub.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Billing Calculation Summary Callout */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-[#C8A45D]/20 to-transparent border border-[#C8A45D]/40 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div>
                      <span className="text-gray-300">Live Fee Calculation:</span>{' '}
                      <strong className="text-white">
                        {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} × ₹699
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-semibold">
                        Paorble for Test Series
                      </span>
                      <strong className="text-base font-cinzel text-[#FFE3A0]">
                        ₹{(selectedSubjects.length * TEST_SERIES_PRICE_PER_SUBJECT).toLocaleString('en-IN')}/-
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coupon / Promo Code & Live Price Breakdown Box */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#171512] to-[#12100E] border-2 border-[#C8A45D]/50 rounded-2xl space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#C8A45D]/20 text-[#FFE3A0] flex items-center justify-center border border-[#C8A45D]/40">
                    <Tag className="w-3.5 h-3.5 text-[#C8A45D]" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Have a Coupon Code?
                    </h3>
                    <p className="text-[10.5px] text-gray-400">
                      Apply your one-time 15% Ranker code or 5% code (HK5). Only 1 coupon per order (no stacking).
                    </p>
                  </div>
                </div>

                {couponCode && (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] text-red-400 hover:text-red-300 underline font-medium cursor-pointer"
                  >
                    Remove Code
                  </button>
                )}
              </div>

              {couponCode ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Coupon <strong>{couponCode}</strong> applied successfully! ({discountPercentage}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs text-emerald-400 hover:text-white underline cursor-pointer shrink-0 font-medium"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponMessage) setCouponMessage(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyCoupon(e);
                        }
                      }}
                      placeholder="ENTER COUPON CODE"
                      className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/15 focus:border-[#C8A45D] rounded-xl text-xs text-white placeholder-gray-500 uppercase tracking-wider focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim()}
                    className="px-5 py-2.5 bg-[#C8A45D] hover:bg-[#DFB96E] disabled:opacity-40 disabled:hover:bg-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl shadow transition-all cursor-pointer uppercase tracking-wider shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}

              {couponMessage && (
                <p
                  className={`text-xs font-poppins flex items-center gap-1.5 ${
                    couponMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {couponMessage.type === 'success' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{couponMessage.text}</span>
                </p>
              )}

              {/* Price Calculation Summary */}
              <div className="p-3 bg-black/40 border border-white/10 rounded-xl space-y-1.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Original Price:</span>
                  <span className="font-montserrat font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}/-</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span>Discount ({discountPercentage}%):</span>
                      <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        {couponCode}
                      </span>
                    </span>
                    <span className="font-montserrat">-₹{discountAmount.toLocaleString('en-IN')}/-</span>
                  </div>
                )}
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="font-cinzel font-bold text-white uppercase tracking-wider">
                    Final Paorble Amount:
                  </span>
                  <span className="font-montserrat font-extrabold text-base sm:text-lg text-[#FFE3A0]">
                    ₹{totalAmount.toLocaleString('en-IN')}/-
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Account & UPI Credentials Box with Dynamic QR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 bg-[#141210] border border-white/10 rounded-2xl p-4 sm:p-5">
              {/* QR Code Column */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-3 sm:p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-2.5">
                <span className="text-[11px] font-montserrat font-bold uppercase tracking-wider text-[#FFE3A0] flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-[#C8A45D]" />
                  Scan QR with Any UPI App
                </span>

                <div className="p-2 bg-white rounded-xl shadow-lg border-2 border-[#C8A45D]">
                  <img
                    src={qrCodeUrl}
                    alt="UPI QR Code - Harkiran Kaur Kohli"
                    className="w-40 h-40 object-contain rounded-lg"
                  />
                </div>

                <div className="text-[11px] text-gray-300">
                  Total Paorble: <strong className="text-[#FFE3A0] font-montserrat text-sm">₹{totalAmount.toLocaleString('en-IN')}/-</strong>
                </div>

                {/* 1-Tap Mobile UPI launch */}
                <a
                  href={upiUri}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-montserrat font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md md:hidden"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Tap to Pay in Installed UPI App</span>
                </a>
              </div>

              {/* Account & Payee Information */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-3.5">
                <div className="space-y-2.5">
                  <h3 className="font-cinzel text-xs sm:text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
                    Verified Payee Bank Credentials
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          Bank Account Holder Name
                        </div>
                        <div className="font-bold text-white font-montserrat text-xs sm:text-sm mt-0.5">
                          Harkiran kaur jatinder singh kohli
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold shrink-0">
                        ✓ Verified
                      </span>
                    </div>

                    <div className="p-3 bg-black/50 border border-white/10 rounded-xl flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          Official Direct UPI ID
                        </div>
                        <div className="font-mono font-bold text-[#FFE3A0] text-sm mt-0.5 truncate">
                          harkirankaurr@ibl
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="px-3 py-1.5 bg-[#C8A45D]/20 hover:bg-[#C8A45D]/30 text-[#FFE3A0] border border-[#C8A45D]/50 rounded-lg text-xs font-bold font-montserrat flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[11px] text-gray-300 flex items-center justify-between">
                      <span className="text-gray-400">Total Enrollment Amount:</span>
                      <span className="font-montserrat font-extrabold text-base text-[#FFE3A0]">
                        ₹{totalAmount.toLocaleString('en-IN')}/-
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick App Launchers */}
                <div className="pt-2 border-t border-white/10">
                  <span className="text-[11px] text-gray-400 block mb-1.5 font-medium">
                    Pay using any installed UPI application:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs">
                    {[
                      { name: 'Google Pay', color: 'border-blue-500/30 text-blue-300' },
                      { name: 'PhonePe', color: 'border-purple-500/30 text-purple-300' },
                      { name: 'Paytm', color: 'border-corn-500/30 text-corn-300' },
                      { name: 'BHIM / Cred', color: 'border-amber-500/30 text-amber-300' },
                    ].map((app) => (
                      <a
                        key={app.name}
                        href={upiUri}
                        className={`p-2 bg-black/40 rounded-xl border ${app.color} font-montserrat font-bold text-[11px] hover:bg-white/10 transition-colors block`}
                      >
                        {app.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 12-Digit UTR Input Box (Prominent & Clear) */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#171512] to-[#12100E] border-2 border-[#C8A45D]/60 rounded-2xl space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label htmlFor="utr-input" className="font-cinzel text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8A45D] animate-ping" />
                  <span>Enter 12-Digit UPI Reference (UTR) Number *</span>
                </label>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                  cleanDigitsOnly.length === 12
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {cleanDigitsOnly.length}/12 Digits
                </span>
              </div>

              <p className="text-xs text-gray-300 font-poppins">
                After paying from your UPI app (GPay, PhonePe, Paytm, etc.), enter the <strong>12-digit UTR or Reference Number</strong> from your payment receipt:
              </p>

              <div className="relative">
                <input
                  id="utr-input"
                  type="text"
                  maxLength={14}
                  placeholder="e.g. 4248 1029 4821"
                  value={utrInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setUtrInput(val);
                    if (utrError) setUtrError(null);
                  }}
                  className={`w-full px-4 py-3.5 bg-black/60 border rounded-xl text-base font-mono text-white tracking-widest placeholder-gray-600 focus:outline-none transition-all ${
                    cleanDigitsOnly.length === 12
                      ? 'border-emerald-500/70 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400'
                      : 'border-[#C8A45D]/50 focus:border-[#FFE3A0] focus:ring-1 focus:ring-[#C8A45D]'
                  }`}
                />

                {cleanDigitsOnly.length === 12 && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-emerald-400 text-xs font-bold font-montserrat">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>12 Digits Verified</span>
                  </div>
                )}
              </div>

              {utrError && (
                <div className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{utrError}</span>
                </div>
              )}
            </div>

            {/* Explainer: Where to Find Your 12-Digit UTR Number */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <div
                onClick={() => setShowUtrGuide(!showUtrGuide)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2 font-montserrat font-bold text-xs text-[#FFE3A0]">
                  <HelpCircle className="w-4 h-4 text-[#C8A45D]" />
                  <span>Where to Find Your 12-Digit UTR / Reference Number?</span>
                </div>
                <button type="button" className="text-gray-400 hover:text-white">
                  {showUtrGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {showUtrGuide && (
                <div className="pt-2 space-y-3 animate-in fade-in duration-200 text-xs">
                  {/* App Tabs */}
                  <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm' },
                      { id: 'other', label: 'BHIM / Bank SMS' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setGuideApp(tab.id as any)}
                        className={`px-3 py-1 rounded-lg text-xs font-montserrat font-semibold transition-all cursor-pointer ${
                          guideApp === tab.id
                            ? 'bg-[#C8A45D] text-black font-bold'
                            : 'bg-black/40 text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* App-specific guidance */}
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2 text-gray-300">
                    {guideApp === 'gpay' && (
                      <div>
                        <p className="font-bold text-white mb-1">In Google Pay (GPay):</p>
                        <ol className="list-decimal list-inside space-y-1 text-[11px]">
                          <li>Open Google Pay &gt; Scroll to the bottom &gt; Tap <strong>"See transaction history"</strong>.</li>
                          <li>Tap on the payment made to <strong>Harkiran kaur jatinder singh kohli</strong>.</li>
                          <li>Scroll down to the bottom of the transaction screen.</li>
                          <li>Copy the 12-digit number labeled <strong>"UPI transaction ID"</strong> (usually starts with 3, 4, or 5).</li>
                        </ol>
                      </div>
                    )}

                    {guideApp === 'phonepe' && (
                      <div>
                        <p className="font-bold text-white mb-1">In PhonePe:</p>
                        <ol className="list-decimal list-inside space-y-1 text-[11px]">
                          <li>Open PhonePe &gt; Tap the <strong>"History"</strong> tab at the bottom right.</li>
                          <li>Tap on the payment to <strong>Harkiran kaur jatinder singh kohli</strong>.</li>
                          <li>Look for the 12-digit number listed beside <strong>"UTR"</strong>.</li>
                          <li>Tap the copy icon or type the 12 digits directly into the box above.</li>
                        </ol>
                      </div>
                    )}

                    {guideApp === 'paytm' && (
                      <div>
                        <p className="font-bold text-white mb-1">In Paytm:</p>
                        <ol className="list-decimal list-inside space-y-1 text-[11px]">
                          <li>Open Paytm &gt; Tap <strong>"Balance & History"</strong>.</li>
                          <li>Tap on the transfer made to <strong>harkirankaurr@ibl</strong>.</li>
                          <li>Look for the 12-digit number beside <strong>"UPI Ref No."</strong>.</li>
                        </ol>
                      </div>
                    )}

                    {guideApp === 'other' && (
                      <div>
                        <p className="font-bold text-white mb-1">In BHIM, Cred, or Mobile Bank SMS:</p>
                        <ol className="list-decimal list-inside space-y-1 text-[11px]">
                          <li>Open your bank's debited SMS (e.g. HDFC, ICICI, SBI).</li>
                          <li>The SMS states: <em>"Your A/C ... debited by Rs {totalAmount} on ... Ref/RRN <strong>[12 Digits]</strong>"</em>.</li>
                          <li>In BHIM/Cred, tap transaction receipt and copy the 12-digit <strong>Reference / RRN number</strong>.</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Student Billing & Contact Form */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Student Contact Details (For Automatic Confirmation Email & Onboarding)</span>
                </h3>
                <span className="text-[10px] text-amber-400 font-semibold">
                  *Contacted within 24 Hours
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={billing.fullName}
                    onChange={(e) => setBilling({ ...billing, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">Student Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="Where confirmation email will be sent"
                    value={billing.email}
                    onChange={(e) => setBilling({ ...billing, email: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-semibold mb-1">WhatsApp / Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={billing.phone}
                    onChange={(e) => setBilling({ ...billing, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FAF5E9]/10 border border-[#C8A45D]/30 rounded-xl text-[11px] text-gray-300 flex items-start gap-2 mt-2">
                <Info className="w-4 h-4 text-[#FFE3A0] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Automatic Confirmation Email:</strong> Once our admin approves your UTR from the admin panel, an official confirmation email featuring the HK Code of Rankers logo, your course syllabus, and receipt will be sent automatically to <strong>{billing.email || 'your email'}</strong>, and our team will contact you within the next <strong>24 hours</strong> to set up your 1-on-1 mentorship.
                </p>
              </div>
            </div>

            {/* Bottom Actions: Cancel / Close and Submit */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-full sm:w-auto py-3 px-6 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white font-montserrat font-bold text-xs rounded-2xl uppercase tracking-wider transition-colors cursor-pointer border border-white/15"
              >
                Close Window
              </button>

              <button
                type="submit"
                disabled={isProcessing || cleanDigitsOnly.length !== 12}
                className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-[#C8A45D]/25 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Submitting UTR & Registering...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-black" />
                    <span>Submit 12-Digit UTR & Complete Enrollment (₹{totalAmount.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
