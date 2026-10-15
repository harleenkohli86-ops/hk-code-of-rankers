import React, { useState } from 'react';
import {
  CentralStudent,
  SlotBookingRecord,
  updateStudentAccessDetails,
  approveStudentPayment,
  isStudyIndexProduct,
  ProgramName,
  ProgramGroup,
  ProgramLevel,
} from '../../services/centralStudentDatabase';
import {
  X,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  BookOpen,
  CreditCard,
  Layers,
  Sparkles,
  MessageSquare,
  Check,
} from 'lucide-react';

interface ManageStudentModalProps {
  student: CentralStudent;
  slotBookings: SlotBookingRecord[];
  onClose: () => void;
  onRefresh: () => void;
  onOpenTracker: (studentProfileId: string) => void;
  onLaunchPortal: (studentEmail: string) => void;
}

export const ManageStudentModal: React.FC<ManageStudentModalProps> = ({
  student,
  slotBookings,
  onClose,
  onRefresh,
  onOpenTracker,
  onLaunchPortal,
}) => {
  const [fullName, setFullName] = useState(student.fullName);
  const [email, setEmail] = useState(student.email);
  const [phone, setPhone] = useState(student.phone);
  const [targetExam, setTargetExam] = useState(student.targetExam || `${student.program} — ${student.group}`);
  const [program, setProgram] = useState<ProgramName>(student.program);
  const [group, setGroup] = useState<ProgramGroup>(student.group);
  const [level, setLevel] = useState<ProgramLevel>(student.level);
  const [mentorshipAccess, setMentorshipAccess] = useState(student.mentorshipAccess);
  const [studyIndexAccess, setStudyIndexAccess] = useState(student.studyIndexAccess);
  const [paymentStatus, setPaymentStatus] = useState(student.paymentStatus);
  const [adminNotes, setAdminNotes] = useState(student.adminNotes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Student's personal booked slots
  const studentCleanPhone = student.phone.replace(/\D/g, '');
  const studentEmailLower = student.email.toLowerCase();
  const studentSlots = slotBookings.filter(
    (b) =>
      b.studentId === student.studentId ||
      b.email.toLowerCase() === studentEmailLower ||
      b.phone.replace(/\D/g, '') === studentCleanPhone
  );

  const handleSaveChanges = async () => {
    const res = await updateStudentAccessDetails(student.studentId, {
      fullName,
      email,
      phone,
      targetExam,
      program,
      group,
      level,
      mentorshipAccess,
      studyIndexAccess,
      paymentStatus,
      adminNotes,
    });
    if (!res.success) {
      alert(res.message || 'Could not save changes.');
      return;
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefresh();
  };

  const handleOneClickApprovePayment = async () => {
    const res = await approveStudentPayment(student.studentId);
    if (!res.success) {
      alert(res.message || 'Approval could not be completed.');
      return;
    }
    setPaymentStatus('approved');
    const isStudyIndex = isStudyIndexProduct(
      student.purchasedCourse?.courseId,
      student.purchasedCourse?.courseName
    );
    if (isStudyIndex) {
      setStudyIndexAccess(true);
    } else {
      setMentorshipAccess(true);
    }
    onRefresh();
  };

  const openWhatsApp = () => {
    const cleanPhone = student.phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Hello ${student.fullName}! This is Harkiran Kaur from HK Code of Rankers. I am checking in regarding your CS preparation.`
    );
    window.open(`https://wa.me/${phoneWithCountry}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-poppins animate-fade-in">
      <div className="bg-[#141210] border-2 border-[#C8A45D]/60 rounded-3xl max-w-3xl w-full text-white shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1E1A15] to-[#12100E] p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/20 border border-[#C8A45D]/50 flex items-center justify-center text-[#FFE3A0] font-cinzel font-bold text-lg">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-montserrat font-bold text-[#FFE3A0] tracking-wider px-2 py-0.5 bg-[#C8A45D]/20 rounded-md border border-[#C8A45D]/30">
                  Manage Student
                </span>
                <span className="font-mono text-xs text-gray-400">
                  {student.studentId}
                </span>
              </div>
              <h2 className="font-cinzel text-xl font-bold text-white mt-0.5">
                {student.fullName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Student Profile Info Strip & Edit */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#C8A45D]" />
                <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
                  Student Profile Details
                </h3>
              </div>
              <span className="text-[11px] text-gray-400">
                Joined: <strong className="text-gray-200">{new Date(student.registeredAt).toLocaleDateString('en-IN')}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-montserrat font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/20 focus:border-[#C8A45D] rounded-xl text-xs text-white outline-none"
                  placeholder="Student Full Name"
                />
              </div>

              <div>
                <label className="text-[10px] font-montserrat font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/20 focus:border-[#C8A45D] rounded-xl text-xs text-white outline-none"
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-montserrat font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-black/60 border border-white/20 focus:border-[#C8A45D] rounded-xl text-xs text-white outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenTracker(student.studentId)}
              className="px-4 py-2.5 bg-gradient-to-r from-[#1C1917] to-[#2E2419] text-[#FFE3A0] border border-[#C8A45D] hover:border-white font-montserrat font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-[#C8A45D]" />
              <span>Open Mentorship Tracker (Full Edit)</span>
            </button>

            <button
              onClick={() => onLaunchPortal(student.email)}
              className="px-4 py-2.5 bg-[#C8A45D] hover:bg-[#DFB96E] text-black font-montserrat font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch Student Portal</span>
            </button>

            <button
              onClick={openWhatsApp}
              className="px-3.5 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-montserrat font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Section: Program & Group Reassignment */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C8A45D]" />
                <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
                  Program &amp; Group Reassignment
                </h3>
              </div>
              <span className="text-[11px] text-gray-400">
                Index: <strong className="text-[#FFE3A0]">{student.assignedIndexId}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-montserrat font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
                  Program Level
                </label>
                <select
                  value={program}
                  onChange={(e) => {
                    const p = e.target.value as ProgramName;
                    setProgram(p);
                    if (p === 'CS EET') {
                      setLevel('Foundation');
                      setGroup('Single');
                    } else if (p === 'CS Executive') {
                      setLevel('Executive');
                      if (group === 'Single') setGroup('Group 1');
                    } else if (p === 'CS Professional') {
                      setLevel('Professional');
                      if (group === 'Single') setGroup('Group 1');
                    }
                  }}
                  className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-[#C8A45D] rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  <option value="CS Executive">CS Executive</option>
                  <option value="CS Professional">CS Professional</option>
                  <option value="CS EET">CS EET</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-montserrat font-bold text-gray-300 block mb-1.5 uppercase tracking-wider">
                  Enrolled Group / Track
                </label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value as ProgramGroup)}
                  className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-[#C8A45D] rounded-xl text-xs text-white outline-none cursor-pointer"
                >
                  {program === 'CS EET' ? (
                    <option value="Single">Single (EET Track)</option>
                  ) : (
                    <>
                      <option value="Group 1">Group 1</option>
                      <option value="Group 2">Group 2</option>
                      <option value="Both">Both Groups</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Access Controls & Toggles */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C8A45D]" />
              <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
                Access Entitlements &amp; Permissions
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mentorship Access Toggle */}
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Mentorship Access</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    1-on-1 calls &amp; weekly review
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMentorshipAccess(!mentorshipAccess)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    mentorshipAccess ? 'bg-emerald-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      mentorshipAccess ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Study Index Access Toggle */}
              <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-white flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Study Progress Index Access</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Student can view &amp; edit syllabus rows
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStudyIndexAccess(!studyIndexAccess)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    studyIndexAccess ? 'bg-emerald-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      studyIndexAccess ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Payment Status & Direct Approve */}
            <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Course Payment Status:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      paymentStatus === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </div>
                {student.purchasedCourse && (
                  <p className="text-[11px] text-gray-400">
                    Product: {student.purchasedCourse.courseName} • UTR: {student.purchasedCourse.utrNumber || 'N/A'}
                  </p>
                )}
              </div>

              {paymentStatus !== 'approved' && (
                <button
                  type="button"
                  onClick={handleOneClickApprovePayment}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-montserrat font-bold text-xs rounded-xl shadow cursor-pointer transition-all flex items-center gap-1 shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Payment Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Section: Admin Notes & Remarks */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
              <Bookmark className="w-4 h-4 text-[#C8A45D]" />
              <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
                Admin Notes &amp; Strategy Remarks
              </h3>
            </div>
            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Private notes on student progress, weak subjects, call discussions, or custom targets..."
              className="w-full px-3 py-2.5 bg-black/60 border border-white/20 focus:border-[#C8A45D] rounded-xl text-xs text-white outline-none resize-none leading-relaxed placeholder-gray-500"
            />
          </div>

          {/* Section: Student's Booked Slots */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C8A45D]" />
                <h3 className="font-cinzel text-sm font-bold text-white uppercase tracking-wider">
                  Booked 1-on-1 Mentorship Slots ({studentSlots.length})
                </h3>
              </div>
            </div>

            {studentSlots.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">
                This student has not booked any 1-on-1 mentorship call slots yet.
              </p>
            ) : (
              <div className="space-y-2">
                {studentSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{slot.bookingDate}</strong>
                        <span className="text-[#FFE3A0] font-semibold">{slot.bookingTime}</span>
                        <span className="text-[10px] font-mono text-gray-400">({slot.id})</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {slot.callType} • {slot.program} ({slot.group})
                      </p>
                      {slot.notes && (
                        <p className="text-[10px] text-gray-500 italic">"{slot.notes}"</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        slot.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : slot.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black/60 border-t border-white/10 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Student changes saved successfully!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-montserrat font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleSaveChanges}
              className="px-5 py-2 bg-[#C8A45D] hover:bg-[#DFB96E] text-black font-montserrat font-bold text-xs rounded-xl shadow transition-all cursor-pointer uppercase tracking-wider"
            >
              Save All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
