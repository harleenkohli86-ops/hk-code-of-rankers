import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Lock,
  ArrowRight,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import {
  UPI_PAYEE_CONFIG,
  buildUpiUri,
  getUpiQrCodeUrl,
  validateUtrNumber,
} from '../services/upiPayment';
import { StudyTrackDetails } from '../services/studyTrackService';
import { CentralStudent, submitCoursePayment } from '../services/centralStudentDatabase';
import { useOrders } from '../context/OrderContext';

interface StudyProgressIndexCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: StudyTrackDetails;
  student: CentralStudent;
  onSuccess?: () => void;
}

export const StudyProgressIndexCheckoutModal: React.FC<StudyProgressIndexCheckoutModalProps> = ({
  isOpen,
  onClose,
  details,
  student,
  onSuccess,
}) => {
  const { refreshOrders } = useOrders();
  const [utrInput, setUtrInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const note = `HK StudyTrack Pro - ${details.applicableIndex}`;
  const qrUrl = getUpiQrCodeUrl(details.price, note);
  const upiUri = buildUpiUri(details.price, note);

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(UPI_PAYEE_CONFIG.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = validateUtrNumber(utrInput);
    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Please enter a valid 12-digit UPI UTR number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Payment is saved in the DB (the server verifies the UTR and discount).
      const courseName = `${details.productName} (${details.applicableIndex})`;
      const res = await submitCoursePayment({
        courseId: details.productId,
        courseName,
        amount: details.price,
        utrNumber: validation.cleanedUtr,
        items: [{ productId: details.productId, name: courseName, price: details.price, quantity: 1 }],
        paymentProofNotes: `Purchased ${details.applicableIndex} for ${student.program} (${student.group})`,
      });
      if (res.success) void refreshOrders();

      if (res.success) {
        setSubmittedSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.message || 'Payment submission could not be processed.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit payment reference. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-[#C8A45D]/60 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1C1917] text-white p-5 sm:p-6 border-b border-[#C8A45D]/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#FFE3A0] text-xs font-montserrat uppercase tracking-wider font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-[#C8A45D]" />
            <span>Official UPI Checkout</span>
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white leading-tight">
            {details.productName}
          </h2>
          <p className="text-xs text-[#FFE3A0] mt-0.5">
            Applicable: <strong className="text-white">{details.applicableIndex}</strong>
          </p>
        </div>

        {submittedSuccess ? (
          /* Payment Submitted Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <FileCheck2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gray-900">
                Payment Verification Pending
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Your payment reference (UTR: <span className="font-mono font-bold text-black">{utrInput.trim()}</span>) for{' '}
                <strong className="text-gray-900">{details.applicableIndex}</strong> has been received and submitted for verification.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>What happens next?</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Harkiran Kaur will verify the UTR against the bank statement. Once approved in the Admin Portal, your{' '}
                <strong>Study Progress Index Edit Access</strong> will automatically activate in this portal. Your index remains in <strong>View Only</strong> mode until approval.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
              >
                Back to Student Portal
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Student & Product Verification Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-[11px] font-montserrat uppercase tracking-wider text-gray-500 font-semibold">
                  Student Details
                </span>
                <span className="text-xs font-bold text-gray-900">{student.fullName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Registered Program</span>
                  <span className="font-bold text-gray-800">{student.program}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Assigned Group</span>
                  <span className="font-bold text-gray-800">{student.group}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Applicable Index</span>
                  <span className="font-bold text-[#8A651E]">{details.applicableIndex}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Paorble Amount</span>
                  <span className="font-mono text-base font-extrabold text-emerald-700">
                    ₹{details.price.toLocaleString('en-IN')}/-
                  </span>
                </div>
              </div>
            </div>

            {/* UPI QR & Details Section */}
            <div className="bg-gradient-to-b from-[#FFFDF8] to-[#FDF8EE] border-2 border-[#C8A45D]/50 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Official QR Code */}
                <div className="bg-white p-2.5 rounded-2xl border-2 border-[#C8A45D] shadow-md shrink-0 flex flex-col items-center">
                  <img
                    src={qrUrl}
                    alt="Official UPI QR Code"
                    className="w-36 h-36 object-contain rounded-lg"
                  />
                  <span className="text-[10px] font-bold text-gray-700 mt-1 flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#C8A45D]" /> Scan with Any UPI App
                  </span>
                </div>

                {/* UPI Account Information */}
                <div className="flex-1 space-y-2.5 w-full text-center sm:text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      Payee Name
                    </span>
                    <span className="text-sm font-extrabold text-gray-900 font-cinzel">
                      {UPI_PAYEE_CONFIG.accountName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                      Official UPI ID
                    </span>
                    <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#C8A45D]/50 shadow-xs">
                      <span className="font-mono font-bold text-xs text-black select-all">
                        {UPI_PAYEE_CONFIG.upiId}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="text-[#8A651E] hover:text-black transition-colors p-1"
                        title="Copy UPI ID"
                      >
                        {copiedUpi ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 1-Tap Mobile UPI Link */}
                  <div className="pt-1">
                    <a
                      href={upiUri}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1C1917] hover:bg-black text-[#FFE3A0] text-xs font-montserrat font-bold rounded-xl transition-all shadow-xs"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span>Tap to Pay on Mobile App</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* UTR Input Form */}
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-montserrat font-bold text-gray-800">
                  Enter 12-Digit UPI Reference / UTR Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={16}
                    value={utrInput}
                    onChange={(e) => {
                      setUtrInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="e.g., 425619873421"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 focus:border-[#C8A45D] focus:ring-2 focus:ring-[#C8A45D]/30 rounded-xl text-sm font-mono tracking-wider text-black outline-none transition-all shadow-xs"
                    required
                  />
                  <div className="absolute right-3 top-3.5 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500">
                  After completing payment in Google Pay, PhonePe, Paytm, or BHIM, copy the 12-digit UTR/UPI Transaction ID and paste here.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !utrInput.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span>Submitting Payment Reference...</span>
                ) : (
                  <>
                    <span>Submit Payment Reference</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-gray-500">
                🔒 Verified manually by Admin Harkiran Kaur. Edit access is activated upon verification.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
