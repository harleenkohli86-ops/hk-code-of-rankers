import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';
import { PageId } from '../types';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  MessageCircle,
  KeyRound,
  ShieldCheck,
  ExternalLink,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import {
  ProgramName,
  ProgramLevel,
  ProgramGroup,
} from '../services/centralStudentDatabase';

interface AuthModalProps {
  onNavigate?: (page: PageId) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNavigate }) => {
  const {
    user,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authTab,
    setAuthTab,
    allowRegister,
    login,
    register,
    requestPasswordReset,
    completePasswordReset,
  } = useAuth();
  const { showSuccess } = usePopup();

  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regProgram, setRegProgram] = useState<ProgramName>('CS Executive');
  const [regLevel, setRegLevel] = useState<ProgramLevel>('Level 2');
  const [regGroup, setRegGroup] = useState<ProgramGroup>('Group 1');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Password Reset Link Flow
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [generatedResetUrl, setGeneratedResetUrl] = useState<string | null>(null);
  const [resetLinkDispatched, setResetLinkDispatched] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPendingNotice, setIsPendingNotice] = useState<string | null>(null);
  const [registrationSubmittedEmail, setRegistrationSubmittedEmail] = useState<string | null>(null);

  // Update Program, Level, and Group reactively
  const handleProgramChange = (prog: ProgramName) => {
    setRegProgram(prog);
    if (prog === 'CS EET') {
      setRegLevel('Level 1');
      setRegGroup('EET');
    } else if (prog === 'CS Executive') {
      setRegLevel('Level 2');
      setRegGroup('Group 1');
    } else if (prog === 'CS Professional') {
      setRegLevel('Level 3');
      setRegGroup('Group 1');
    }
  };

  // Check URL query parameters for ?resetToken=...
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenInUrl = urlParams.get('resetToken');
      if (tokenInUrl) {
        setResetToken(tokenInUrl);
        setAuthTab('forgot');
        setIsAuthModalOpen(true);
      }
    }
  }, [setIsAuthModalOpen, setAuthTab]);

  const canShowRegister = allowRegister && !user;

  useEffect(() => {
    if (!canShowRegister && authTab === 'register') {
      setAuthTab('login');
    }
  }, [canShowRegister, authTab, setAuthTab]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsPendingNotice(null);
    setIsSubmitting(true);

    const res = await login(loginInput, loginPassword);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg('Login successful! Directing to your Student Portal...');
      const firstName = user?.fullName ? user.fullName.split(' ')[0] : '';
      showSuccess(
        firstName ? `Welcome Back, ${firstName}!` : 'Welcome Back!',
        'You have logged in successfully. Your Student Portal is ready — keep tracking, keep ranking!'
      );
      setIsAuthModalOpen(false);
      if (onNavigate) {
        onNavigate('student-portal');
      }
    } else if (res.isPendingApproval) {
      setIsPendingNotice(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsPendingNotice(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters long.');
      return;
    }
    setIsSubmitting(true);

    const targetExam = `${regProgram} (${regGroup})`;
    const res = await register(
      regFullName,
      regEmail,
      regPhone,
      targetExam,
      regPassword,
      regLevel,
      regGroup
    );
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        if (onNavigate) {
          onNavigate('student-portal');
        }
      }, 500);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Stage 1: Request Password Reset Link via Email
  const handleRequestResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsPendingNotice(null);
    setIsSubmitting(true);

    const res = await requestPasswordReset(resetEmail);
    setIsSubmitting(false);
    if (res.success) {
      setResetLinkDispatched(true);
      setGeneratedResetUrl(res.resetUrl || null);
      if (res.token) {
        setResetToken(res.token);
      }
      setSuccessMsg(res.message);
    } else {
      setErrorMsg(res.message);
    }
  };

  // Stage 2: Complete Password Reset with Verified Token
  const handleCompleteResetWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!resetToken) {
      setErrorMsg('Reset token is missing.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('New passwords do not match. Please re-enter.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    setIsSubmitting(true);

    const res = await completePasswordReset(resetToken, newPassword);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setLoginInput(resetEmail);
      setTimeout(() => {
        setAuthTab('login');
        setResetToken(null);
        setResetLinkDispatched(false);
        setNewPassword('');
        setConfirmNewPassword('');
      }, 2000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const copyResetLink = () => {
    if (generatedResetUrl) {
      navigator.clipboard.writeText(generatedResetUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const openWhatsAppHelp = (email?: string) => {
    const text = `Hello Harkiran Kaur, I registered on HK Code of Rankers with email: ${email || loginInput || regEmail || 'my email'}. Please verify and approve my student portal access. Thank you!`;
    window.open(`https://wa.me/919284084523?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-poppins bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#0F0F0F] text-white border border-[#C8A45D]/40 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden my-8">
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#1A1815] to-[#0F0F0F] border-b border-[#C8A45D]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#C8A45D]/40 flex items-center justify-center text-[#C8A45D]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-white">
                HK Aspirant Portal
              </h2>
              <p className="text-[11px] text-gray-400 font-poppins">
                Unified Student & Mentorship System
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setErrorMsg('');
              setSuccessMsg('');
              setIsPendingNotice(null);
              setRegistrationSubmittedEmail(null);
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Registration Submitted Success Notice */}
          {registrationSubmittedEmail ? (
            <div className="space-y-4 text-center py-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-[#C8A45D] flex items-center justify-center mx-auto text-[#FFE3A0]">
                <Clock className="w-8 h-8 text-[#C8A45D] animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  Registration Awaiting Approval
                </span>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Application Submitted to Central Database
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                  Thank you, <strong>{regFullName}</strong>! Your registration is now listed in the Admin Portal for review by{' '}
                  <span className="text-[#FFE3A0] font-semibold">Harkiran Kaur Kohli</span>.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#FFE3A0] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#C8A45D]" />
                  <span>2-Step Verification Roadmap:</span>
                </div>
                <div className="text-[11px] text-gray-300 space-y-1.5 pl-6 list-decimal">
                  <p>1. <strong>Admin Approves Registration:</strong> Unlocks your Student Portal login.</p>
                  <p>2. <strong>Select Course & Submit Payment:</strong> Once approved, your Mentorship Tracker and 12-month roadmap activate!</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openWhatsAppHelp(registrationSubmittedEmail)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-montserrat font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Admission Desk for Fast Verification</span>
                </button>

                <button
                  onClick={() => {
                    setRegistrationSubmittedEmail(null);
                    setAuthTab('login');
                    setLoginInput(registrationSubmittedEmail);
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-montserrat font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Go to Login Window
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector Buttons */}
              <div className="flex p-1 bg-black/60 border border-white/10 rounded-2xl">
                <button
                  onClick={() => {
                    setAuthTab('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                    setIsPendingNotice(null);
                  }}
                  className={`flex-1 py-2 text-xs font-montserrat font-bold rounded-xl transition-all cursor-pointer ${
                    authTab === 'login'
                      ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Log In
                </button>

                {canShowRegister && (
                  <button
                    onClick={() => {
                      setAuthTab('register');
                      setErrorMsg('');
                      setSuccessMsg('');
                      setIsPendingNotice(null);
                    }}
                    className={`flex-1 py-2 text-xs font-montserrat font-bold rounded-xl transition-all cursor-pointer ${
                      authTab === 'register'
                        ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    New Registration
                  </button>
                )}

                <button
                  onClick={() => {
                    setAuthTab('forgot');
                    setErrorMsg('');
                    setSuccessMsg('');
                    setIsPendingNotice(null);
                  }}
                  className={`flex-1 py-2 text-xs font-montserrat font-bold rounded-xl transition-all cursor-pointer ${
                    authTab === 'forgot'
                      ? 'bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] text-black shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Reset Password
                </button>
              </div>

              {/* Status & Error Messages */}
              {errorMsg && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-2.5 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <div className="leading-relaxed">{errorMsg}</div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-start gap-2.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div className="leading-relaxed">{successMsg}</div>
                </div>
              )}

              {/* Pending Approval Notice */}
              {isPendingNotice && (
                <div className="p-4 bg-amber-500/15 border-2 border-[#C8A45D]/60 rounded-2xl text-amber-200 text-xs space-y-3 animate-fade-in">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 shrink-0 text-[#C8A45D] animate-pulse" />
                    <div>
                      <h4 className="font-bold text-white text-xs font-montserrat">
                        Registration Awaiting Admin Approval
                      </h4>
                      <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                        {isPendingNotice}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-1 border-t border-[#C8A45D]/30">
                    <button
                      type="button"
                      onClick={() => openWhatsAppHelp(loginInput)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-montserrat flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Admission Desk: +91 92840 84523</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LOGIN FORM */}
              {authTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="e.g. rior.patel@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-gray-300 font-montserrat font-bold">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('forgot');
                          setResetEmail(loginInput);
                          setErrorMsg('');
                          setSuccessMsg('');
                        }}
                        className="text-[11px] text-[#C8A45D] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-600 text-[#C8A45D] focus:ring-0"
                      />
                      <span>Remember on this device</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-xl shadow-lg shadow-[#C8A45D]/20 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>{isSubmitting ? 'Verifying with database…' : 'Log In To Student Portal'}</span>
                  </button>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-gray-400 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C8A45D] shrink-0 mt-0.5" />
                    <span>
                      <strong>Central Database Enforced:</strong> Only approved registrations can log in. New students must submit registration for Admin review.
                    </span>
                  </div>
                </form>
              )}

              {/* REGISTER FORM */}
              {authTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Rior Patel"
                        className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="rior.patel@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Program & Level Selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                        Program & Level *
                      </label>
                      <select
                        value={regProgram}
                        onChange={(e) => handleProgramChange(e.target.value as ProgramName)}
                        className="w-full px-2.5 py-2 bg-black/60 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                      >
                        <option value="CS EET">Level 1: CS EET</option>
                        <option value="CS Executive">Level 2: CS Executive</option>
                        <option value="CS Professional">Level 3: CS Professional</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                        Group *
                      </label>
                      <select
                        value={regGroup}
                        onChange={(e) => setRegGroup(e.target.value as ProgramGroup)}
                        className="w-full px-2.5 py-2 bg-black/60 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                      >
                        {regProgram === 'CS EET' ? (
                          <option value="EET">EET (1 group)</option>
                        ) : (
                          <>
                            <option value="Group 1">Group 1</option>
                            <option value="Group 2">Group 2</option>
                            <option value="Both Groups">Both Groups</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                        Create Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-extrabold text-xs rounded-xl shadow-lg shadow-[#C8A45D]/20 transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>{isSubmitting ? 'Saving to database…' : 'Create Account in Database'}</span>
                  </button>

                  <p className="text-[10px] text-gray-400 text-center">
                    Upon submission, your application appears automatically in Harkiran Kaur's Admin Portal.
                  </p>
                </form>
              )}

              {/* SECURE PASSWORD RESET FLOW */}
              {authTab === 'forgot' && (
                <div className="space-y-4">
                  {/* Token Reset Form (When token is active) */}
                  {resetToken ? (
                    <form onSubmit={handleCompleteResetWithToken} className="space-y-3 animate-fade-in">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-2">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <h3 className="font-cinzel text-base font-bold text-white">Create New Password</h3>
                        <p className="text-xs text-gray-400">
                          Secure Single-Use Reset Token Verified. Enter your new password below.
                        </p>
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                          New Password (min 6 characters) *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setResetToken(null);
                            setResetLinkDispatched(false);
                            setAuthTab('login');
                          }}
                          className="w-1/2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-montserrat font-bold rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="w-1/2 py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] hover:from-[#FFEFA6] hover:to-[#DFB96E] text-black text-xs font-montserrat font-bold rounded-xl cursor-pointer"
                        >
                          Save New Password
                        </button>
                      </div>
                    </form>
                  ) : resetLinkDispatched ? (
                    /* Link Dispatched Screen */
                    <div className="space-y-4 text-center py-2 animate-fade-in">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-300">
                        <Mail className="w-6 h-6 animate-bounce" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-cinzel text-base font-bold text-white">
                          Reset Request Received
                        </h3>
                        <p className="text-xs text-gray-300 max-w-xs mx-auto leading-relaxed">
                          If this email is registered, check Inbox and Spam for the single-use link sent to:
                          <br />
                          <strong className="text-[#FFE3A0]">{resetEmail}</strong>
                        </p>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-left text-[11px] text-gray-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Security Verification:</span>
                        </div>
                        <p>• Link expires in <strong>60 minutes</strong>.</p>
                        <p>• Only usable once. Stored securely in database.</p>
                      </div>

                      {/* Test simulation button for preview */}
                      {generatedResetUrl && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-amber-300 uppercase font-bold">
                              Preview / Quick Test Link:
                            </span>
                            <button
                              onClick={copyResetLink}
                              className="text-[10px] text-[#FFE3A0] flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              // Simulate clicking link
                              const url = new URL(generatedResetUrl);
                              const t = url.searchParams.get('resetToken');
                              if (t) setResetToken(t);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-montserrat font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:brightness-105"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Simulate Opening Reset Link</span>
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setResetLinkDispatched(false);
                          setAuthTab('login');
                        }}
                        className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-montserrat font-semibold rounded-xl cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </div>
                  ) : (
                    /* Initial Request Link Form */
                    <div className="space-y-4">
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#C8A45D]/40 flex items-center justify-center text-[#C8A45D] mx-auto mb-2">
                          <KeyRound className="w-5 h-5" />
                        </div>
                        <h3 className="font-cinzel text-base font-bold text-white">
                          Forgot Password?
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Enter your registered email address. We will send a secure, single-use password reset link to your email.
                        </p>
                      </div>

                      <form onSubmit={handleRequestResetLink} className="space-y-3">
                        <div>
                          <label className="text-[11px] text-gray-300 font-montserrat font-bold block mb-1">
                            Registered Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="email"
                              required
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              placeholder="e.g. rior.patel@gmail.com"
                              className="w-full pl-9 pr-3 py-2.5 bg-black/50 border border-white/10 focus:border-[#C8A45D] rounded-xl text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-gray-400 space-y-1">
                          <div className="flex items-center gap-1.5 text-[#FFE3A0] font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Strict Security Enforced:</span>
                          </div>
                          <p>• Passwords cannot be directly changed without link verification.</p>
                          <p>• Reset link is sent exclusively to the student's registered email address.</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setAuthTab('login');
                              setErrorMsg('');
                              setSuccessMsg('');
                              setIsPendingNotice(null);
                            }}
                            className="w-1/2 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-montserrat font-bold rounded-xl cursor-pointer"
                          >
                            Back to Login
                          </button>
                          <button
                            type="submit"
                            className="w-1/2 py-2.5 bg-gradient-to-r from-[#FFE3A0] to-[#C8A45D] hover:from-[#FFEFA6] hover:to-[#DFB96E] text-black text-xs font-montserrat font-bold rounded-xl cursor-pointer"
                          >
                            Send Reset Link
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
