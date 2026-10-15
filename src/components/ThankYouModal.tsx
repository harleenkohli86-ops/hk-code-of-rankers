import React, { useState } from 'react';
import { useOrders } from '../context/OrderContext';
import {
  CheckCircle2,
  X,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Mail,
  MessageCircle,
  FileText,
  Clock,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { PageId } from '../types';
import { formatUtrDisplay } from '../services/upiPayment';
import { getWhatsAppPaymentProofUrl } from '../services/whatsappLinks';

interface ThankYouModalProps {
  onNavigate: (page: PageId) => void;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({ onNavigate }) => {
  const { isThankYouModalOpen, setIsThankYouModalOpen, latestOrder, downloadInvoicePDF } = useOrders();
  const [invoiceNote, setInvoiceNote] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPreparingInvoice, setIsPreparingInvoice] = useState(false);

  if (!isThankYouModalOpen || !latestOrder) return null;

  const handleGoToStudentPortal = () => {
    setIsThankYouModalOpen(false);
    onNavigate('student-portal');
  };

  const whatsAppManualUrl = `https://wa.me/919284084523?text=${encodeURIComponent(
    `*ENROLLMENT CONFIRMATION — HK CODE OF RANKERS*\n\n` +
    `Hello Harkiran Kaur ma'am,\n` +
    `I have completed my enrollment on HK Code of Rankers.\n\n` +
    `• Student Name: ${latestOrder.billingDetails.fullName}\n` +
    `• Registered Mobile: ${latestOrder.billingDetails.phone}\n` +
    `• Order Number: ${latestOrder.orderNumber}\n` +
    `• Program: ${latestOrder.items.map((i) => i.name).join(' + ')}\n` +
    `• Amount: ₹${latestOrder.totalAmount}\n` +
    (latestOrder.utrNumber ? `• Verified UTR: ${latestOrder.utrNumber}\n\n` : '\n') +
    `I have logged into my Student Portal and look forward to my 1-on-1 diagnostic call!`
  )}`;

  const handleManualWhatsApp = () => {
    const url = getWhatsAppPaymentProofUrl({
      studentName: latestOrder.billingDetails.fullName,
      studentPhone: latestOrder.billingDetails.phone,
      programName: latestOrder.items.map((i) => i.name).join(' + '),
      amount: latestOrder.totalAmount,
      utrNumber: latestOrder.utrNumber || '',
      orderNumber: latestOrder.orderNumber,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGoToCommunity = () => {
    setIsThankYouModalOpen(false);
    onNavigate('forum');
  };

  const handleGoHome = () => {
    setIsThankYouModalOpen(false);
    onNavigate('home');
  };

  /** Downloads the official Tax Invoice and reports the real outcome. */
  const handleInvoiceDownload = () => {
    if (isPreparingInvoice) return;
    setIsPreparingInvoice(true);
    setInvoiceNote(null);
    window.setTimeout(() => {
      const result = downloadInvoicePDF(latestOrder);
      setIsPreparingInvoice(false);
      setInvoiceNote({ type: result.success ? 'success' : 'error', message: result.message });
      window.setTimeout(() => setInvoiceNote(null), 7000);
    }, 60);
  };

  const isPendingApproval = latestOrder.status === 'PENDING_APPROVAL';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-poppins bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#0F0F0F] text-white border border-[#C8A45D]/50 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8 text-center">
        {/* Banner */}
        <div
          className={`p-8 ${
            isPendingApproval
              ? 'bg-gradient-to-b from-amber-950/40 via-[#141210] to-[#0F0F0F]'
              : 'bg-gradient-to-b from-emerald-950/40 via-[#141210] to-[#0F0F0F]'
          } space-y-4 border-b border-[#C8A45D]/30 relative`}
        >
          <button
            onClick={() => setIsThankYouModalOpen(false)}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className={`w-16 h-16 rounded-full ${
              isPendingApproval
                ? 'bg-amber-500/15 border-2 border-amber-500/60 text-amber-400'
                : 'bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-400'
            } flex items-center justify-center mx-auto animate-bounce`}
          >
            {isPendingApproval ? (
              <Clock className="w-9 h-9" />
            ) : (
              <CheckCircle2 className="w-10 h-10" />
            )}
          </div>

          <div className="space-y-1">
            <span
              className={`text-xs font-montserrat font-bold ${
                isPendingApproval ? 'text-amber-400' : 'text-emerald-400'
              } uppercase tracking-widest`}
            >
              {isPendingApproval
                ? '12-Digit UTR Submitted • Under Verification'
                : 'Enrollment Confirmed • Payment Successful'}
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              {isPendingApproval ? 'Seat Logged & Reserved!' : 'Welcome To HK Rankers!'}
            </h2>
            <p className="text-xs text-gray-300 font-poppins max-w-sm mx-auto">
              {isPendingApproval ? (
                <>
                  Your 12-digit UTR reference has been logged. Our admissions desk is verifying it with the bank statement.
                </>
              ) : (
                <>
                  Your seat in the <strong>25-Aspirant Mentorship Batch</strong> is locked. Harkiran Kaur Kohli will contact you directly.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Direct Email & 24-Hour Contact Notice */}
        <div className="p-4 mx-6 mt-5 bg-gradient-to-r from-amber-500/15 via-[#C8A45D]/10 to-amber-500/15 border border-[#C8A45D]/40 rounded-2xl text-left space-y-2">
          <div className="flex items-center gap-2 text-[#FFE3A0] font-montserrat font-bold text-xs">
            <Mail className="w-4 h-4 text-[#C8A45D]" />
            <span>Automatic Confirmation Email & 24-Hour Contact</span>
          </div>
          <p className="text-xs text-gray-300 font-poppins leading-relaxed">
            {isPendingApproval ? (
              <>
                Once our team approves your payment in the admin panel:
              </>
            ) : (
              <>
                We operate with complete personal transparency. Within <strong>2 hours</strong>, you will receive an email and WhatsApp message with:
              </>
            )}
          </p>
          <ul className="text-[11px] text-gray-300 space-y-1.5 font-poppins list-disc list-inside">
            <li>
              <strong>Official Email with Logo:</strong> An automated confirmation email will be sent to{' '}
              <strong className="text-white">{latestOrder.billingDetails.email}</strong>.
            </li>
            <li>
              <strong>Contacted within 24 Hours:</strong> Harkiran Kaur's team will contact you on WhatsApp / call ({latestOrder.billingDetails.phone}) to schedule your 1-on-1 strategy session.
            </li>
            <li>
              <strong>Study Roadmap & Tests:</strong> You will receive chapter test dates, tracker spreadsheets, and syllabus breakdown.
            </li>
          </ul>
        </div>

        {/* Order Details Grid */}
        <div className="p-6 space-y-5 text-left bg-[#12100E]">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
              <span className="text-gray-400 font-montserrat">Order Number:</span>
              <span className="font-bold text-[#FFE3A0] font-montserrat">{latestOrder.orderNumber}</span>
            </div>

            {latestOrder.utrNumber && (
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="text-gray-400 font-montserrat">12-Digit UTR:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                  {formatUtrDisplay(latestOrder.utrNumber)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
              <span className="text-gray-400 font-montserrat">Payee Account:</span>
              <span className="font-bold text-white text-[11px]">
                Harkiran kaur jatinder singh kohli
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
              <span className="text-gray-400 font-montserrat">Verification Status:</span>
              <span
                className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                  isPendingApproval
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isPendingApproval ? '🟡 Pending Admin Approval' : '🟢 Verified & Active'}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-gray-400 font-montserrat">Total Amount:</span>
              <span className="font-bold text-[#FFE3A0] text-base font-montserrat">
                ₹{latestOrder.totalAmount.toLocaleString('en-IN')}/-
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2">
            <h4 className="font-cinzel text-xs font-bold text-gray-300 uppercase tracking-wider">
              Enrolled Program:
            </h4>
            <div className="space-y-1.5">
              {latestOrder.items.map((it) => (
                <div
                  key={it.productId}
                  className="p-2.5 bg-amber-500/10 border border-[#C8A45D]/30 rounded-xl text-xs text-[#FFE3A0] font-bold flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#C8A45D] shrink-0" />
                  <span className="line-clamp-1">{it.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {invoiceNote && (
              <div
                className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-[11px] font-montserrat font-semibold text-left ${
                  invoiceNote.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/40 text-red-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{invoiceNote.message}</span>
              </div>
            )}
            <button
              onClick={handleGoToStudentPortal}
              className="w-full py-3.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-xl shadow-lg shadow-[#C8A45D]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-black" />
              <span>Go to Student Portal</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <button
              onClick={handleManualWhatsApp}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Manual: Send to WhatsApp Desk</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleInvoiceDownload}
                disabled={isPreparingInvoice}
                title="Download official Tax Invoice (PDF)"
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-60 disabled:cursor-wait text-white border border-white/20 text-xs font-montserrat font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#C8A45D]" />
                <span>{isPreparingInvoice ? 'Preparing…' : 'Download Invoice (PDF)'}</span>
              </button>

              <button
                onClick={handleGoHome}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-montserrat font-semibold rounded-xl transition-all cursor-pointer"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
