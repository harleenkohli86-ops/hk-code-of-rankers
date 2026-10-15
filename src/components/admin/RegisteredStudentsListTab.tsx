import React, { useState } from 'react';
import {
  CentralStudent,
  addStudentManually,
  approveStudentPayment,
  rejectStudentPayment,
  deleteStudentFromCentralDb,
  toggleStudentStudyIndexAccess,
  ProgramName,
  ProgramLevel,
  ProgramGroup,
} from '../../services/centralStudentDatabase';
import {
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Phone,
  Mail,
  Trash2,
  AlertTriangle,
  Loader2,
  Bookmark,
  Users,
  ExternalLink,
  Filter,
  FileDown,
  X,
} from 'lucide-react';
import { downloadMentorshipReportPDF } from '../../services/mentorshipReportService';

interface RegisteredStudentsListTabProps {
  students: CentralStudent[];
  onRefresh: () => void;
  onOpenMentorshipChart?: (student: CentralStudent) => void;
  onOpenStudentPortal?: (student: CentralStudent) => void;
}

export const RegisteredStudentsListTab: React.FC<RegisteredStudentsListTabProps> = ({
  students,
  onRefresh,
  onOpenMentorshipChart,
  onOpenStudentPortal,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'unpaid' | 'rejected'>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Action states
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingStudent, setRejectingStudent] = useState<CentralStudent | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deletingStudent, setDeletingStudent] = useState<CentralStudent | null>(null);

  // Direct toggle for StudyTrack Pro Index Access
  const handleToggleIndexAccess = async (student: CentralStudent) => {
    const newStatus = !student.studyIndexAccess;
    const ok = await toggleStudentStudyIndexAccess(student.studentId, newStatus);
    if (!ok) alert('Could not save the index access change. Please try again.');
    onRefresh();
  };

  // Manual Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [manualFormError, setManualFormError] = useState('');
  const [manualSuccessMsg, setManualSuccessMsg] = useState('');

  // Mentorship Report PDF state
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportNotice, setReportNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);
    setReportNotice(null);
    try {
      const res = await downloadMentorshipReportPDF();
      if (res.success) {
        setReportNotice({ message: res.message, type: 'success' });
      } else {
        setReportNotice({ message: res.message || 'Report generation failed.', type: 'error' });
      }
      setTimeout(() => setReportNotice(null), 5000);
    } catch (err: any) {
      setReportNotice({ message: err?.message || 'Report generation failed.', type: 'error' });
      setTimeout(() => setReportNotice(null), 5000);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: 'CS Executive' as ProgramName,
    level: 'Level 2' as ProgramLevel,
    group: 'Group 1' as ProgramGroup,
    initialPaymentStatus: 'unpaid' as 'unpaid' | 'approved',
    courseName: 'CS Executive (Group 1) Mentorship',
    amount: '2999',
    utrNumber: '',
  });

  const pendingCount = students.filter((s) => s.paymentStatus === 'pending_approval').length;
  const approvedCount = students.filter((s) => s.paymentStatus === 'approved').length;
  const unpaidCount = students.filter((s) => s.paymentStatus === 'unpaid').length;
  const rejectedCount = students.filter((s) => s.paymentStatus === 'rejected').length;

  // Filtered students
  const filteredStudents = students.filter((s) => {
    if (statusFilter === 'pending' && s.paymentStatus !== 'pending_approval') return false;
    if (statusFilter === 'approved' && s.paymentStatus !== 'approved') return false;
    if (statusFilter === 'unpaid' && s.paymentStatus !== 'unpaid') return false;
    if (statusFilter === 'rejected' && s.paymentStatus !== 'rejected') return false;

    if (programFilter !== 'all' && !s.program?.toLowerCase().includes(programFilter.toLowerCase())) {
      return false;
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const utr = (s.purchasedCourse?.utrNumber || s.purchasedCourse?.transactionRef || '').toLowerCase();
      const matchName = s.fullName?.toLowerCase().includes(q);
      const matchEmail = s.email?.toLowerCase().includes(q);
      const matchPhone = s.phone?.includes(q);
      const matchUtr = utr.includes(q);
      const matchCourse = s.purchasedCourse?.courseName?.toLowerCase().includes(q);
      const matchId = s.studentId?.toLowerCase().includes(q);
      const matchProgram = s.targetExam?.toLowerCase().includes(q);

      return matchName || matchEmail || matchPhone || matchUtr || matchCourse || matchId || matchProgram;
    }

    return true;
  });

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2500);
  };

  const handleApprove = async (student: CentralStudent) => {
    setApprovingId(student.studentId);
    try {
      const res = await approveStudentPayment(student.studentId);
      if (res.success) {
        onRefresh();
      } else {
        alert(res.message || 'Approval could not be completed.');
      }
    } finally {
      setApprovingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingStudent) return;
    await rejectStudentPayment(
      rejectingStudent.studentId,
      rejectionReason || 'UPI UTR transaction could not be verified in bank records.'
    );
    setRejectingStudent(null);
    setRejectionReason('');
    onRefresh();
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    await deleteStudentFromCentralDb(deletingStudent.studentId);
    setDeletingStudent(null);
    onRefresh();
  };

  const handleManualAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualFormError('');
    setManualSuccessMsg('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setManualFormError('Student Name, Email, and Phone number are required.');
      return;
    }

    setIsSubmittingManual(true);
    try {
      const res = await addStudentManually({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        program: formData.program,
        level: formData.level,
        group: formData.group,
        initialPaymentStatus: formData.initialPaymentStatus,
        courseName: formData.courseName.trim(),
        amount: Number(formData.amount) || 0,
        utrNumber: formData.utrNumber.trim() || undefined,
      });

      if (res.success) {
        setManualSuccessMsg(res.message);
        if (res.setPasswordUrl) {
          // The student currently has no password set; the admin can send this link to the student by WhatsApp/email.
          window.prompt('Student ka "Set Password" link (copy karke student ko bhejein, 7 din valid):', res.setPasswordUrl);
        }
        setTimeout(() => {
          setIsAddModalOpen(false);
          setManualSuccessMsg('');
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            program: 'CS Executive',
            level: 'Level 2',
            group: 'Group 1',
            initialPaymentStatus: 'unpaid',
            courseName: 'CS Executive (Group 1) Mentorship',
            amount: '2999',
            utrNumber: '',
          });
          onRefresh();
        }, 800);
      } else {
        setManualFormError(res.message);
      }
    } catch (err: any) {
      setManualFormError(err.message || 'Failed to add student.');
    } finally {
      setIsSubmittingManual(false);
    }
  };

  return (
    <div className="space-y-6 bg-slate-50/50 p-2 rounded-3xl border border-slate-200/80">
      {/* Top Banner & Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Users className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <div className="text-[11px] uppercase font-semibold text-slate-500 tracking-wider flex items-center gap-2">
              <span>Registered Students</span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                Cloud Sync Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Registered Students & Purchase Tracker
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Central database for real student accounts, UPI UTR verifications, and instant payment actions.
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadReport}
            disabled={isGeneratingReport}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            title="Download Mentorship Report PDF"
          >
            {isGeneratingReport ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <FileDown className="w-4 h-4 text-slate-600" />
            )}
            <span>Mentorship Report PDF</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
            title="Refresh List"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Report Notice Alert */}
      {reportNotice && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            reportNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{reportNotice.message}</span>
          <button
            onClick={() => setReportNotice(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({students.length})
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending ({pendingCount})</span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved ({approvedCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'unpaid'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unpaid ({unpaidCount})
            </button>

            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          {/* Program Filter Select */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <option value="all">All Programs</option>
              <option value="CS Executive">CS Executive</option>
              <option value="CS Professional">CS Professional</option>
              <option value="CS EET">CS EET</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, email, phone, 12-digit UTR, course name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white placeholder:text-slate-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Program & Group</th>
                <th className="py-3.5 px-4">Reg. Date</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Course / Details</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">12-Digit UTR</th>
                <th className="py-3.5 px-4 text-center">Index Access</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">No students found</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        No students match the current filters or search query. Try resetting filters or add a student manually.
                      </p>
                      <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-all cursor-pointer mt-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Student Manually</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const course = s.purchasedCourse;
                  const utr = course?.utrNumber || course?.transactionRef || '';
                  const isPending = s.paymentStatus === 'pending_approval';
                  const isApproved = s.paymentStatus === 'approved';
                  const isRejected = s.paymentStatus === 'rejected';
                  const isUnpaid = s.paymentStatus === 'unpaid';

                  const regDate = s.registeredAt
                    ? new Date(s.registeredAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A';

                  const amountVal = course?.finalAmount || course?.amount || 0;

                  return (
                    <tr
                      key={s.studentId}
                      className={`transition-colors ${
                        isPending ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Student Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                            {s.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{s.fullName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({s.studentId})</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="w-2.5 h-2.5 text-slate-400" />
                              <span>{s.email}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Phone className="w-2.5 h-2.5 text-slate-400" />
                              <span>{s.phone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Program & Group */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-xs">
                          {course?.courseName || s.program}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {s.level} • <span className="font-semibold text-slate-700">{s.group}</span>
                        </div>
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {regDate}
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Pending Approval
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-800 border border-red-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            <XCircle className="w-3 h-3 text-red-600" />
                            Rejected
                          </span>
                        )}
                        {isUnpaid && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            Unpaid
                          </span>
                        )}
                      </td>

                      {/* Course / Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-xs max-w-[180px] truncate" title={course?.courseName || 'None'}>
                          {course?.courseName || (isUnpaid ? 'Awaiting purchase' : s.targetExam)}
                        </div>
                        {course?.discountCodeUsed && (
                          <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                            Promo: {course.discountCodeUsed}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-semibold whitespace-nowrap text-slate-900">
                        {amountVal > 0 ? (
                          `₹${amountVal.toLocaleString('en-IN')}`
                        ) : (
                          <span className="text-slate-400 font-normal">—</span>
                        )}
                      </td>

                      {/* 12-Digit UTR */}
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        {utr ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-800 text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {utr}
                            </span>
                            <button
                              onClick={() => handleCopyUtr(utr)}
                              className="p-1 hover:bg-slate-200 text-slate-500 rounded transition-colors cursor-pointer"
                              title="Copy UTR"
                            >
                              {copiedUtr === utr ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-sans text-xs">No UTR</span>
                        )}
                      </td>

                      {/* Index Access Control */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleToggleIndexAccess(s)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                              s.studyIndexAccess
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                s.studyIndexAccess ? 'bg-emerald-600' : 'bg-slate-400'
                              }`}
                            />
                            <span>Index: {s.studyIndexAccess ? 'ON' : 'OFF'}</span>
                          </button>
                          <span className="text-[9px] text-slate-400">
                            {s.studyIndexAccess ? 'Edit Access' : 'View Only'}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {onOpenStudentPortal && (
                            <button
                              onClick={() => onOpenStudentPortal(s)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              title="View Student Portal"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                              <span>Portal</span>
                            </button>
                          )}

                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(s)}
                                disabled={approvingId === s.studentId}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                              >
                                {approvingId === s.studentId ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => setRejectingStudent(s)}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5 text-red-600" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <div className="flex items-center gap-1">
                              {onOpenMentorshipChart && (
                                <button
                                  onClick={() => onOpenMentorshipChart(s)}
                                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                  title="Open Mentorship Tracker"
                                >
                                  <Bookmark className="w-3 h-3 text-amber-600" />
                                  <span>Tracker</span>
                                </button>
                              )}
                              <button
                                onClick={() => setRejectingStudent(s)}
                                className="px-2 py-1 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded text-[11px] transition-all cursor-pointer"
                                title="Revoke Approval"
                              >
                                Revoke
                              </button>
                            </div>
                          )}

                          {isRejected && (
                            <button
                              onClick={() => handleApprove(s)}
                              disabled={approvingId === s.studentId}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <span>Re-Approve</span>
                            </button>
                          )}

                          {isUnpaid && (
                            <button
                              onClick={() => handleApprove(s)}
                              disabled={approvingId === s.studentId}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <span>Approve</span>
                            </button>
                          )}

                          <button
                            onClick={() => setDeletingStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer ml-1"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: Add Student Manually                                              */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Student Manually</h3>
                  <p className="text-xs text-slate-500">Create a direct student record in database.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {manualFormError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{manualFormError}</span>
              </div>
            )}

            {manualSuccessMsg && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{manualSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleManualAddSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prior Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Program</label>
                  <select
                    value={formData.program}
                    onChange={(e) => {
                      const prog = e.target.value as ProgramName;
                      setFormData({
                        ...formData,
                        program: prog,
                        level: prog === 'CS EET' ? 'Level 1' : prog === 'CS Professional' ? 'Level 3' : 'Level 2',
                        group: prog === 'CS EET' ? 'EET' : 'Group 1',
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    <option value="CS Executive">CS Executive</option>
                    <option value="CS Professional">CS Professional</option>
                    <option value="CS EET">CS EET</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Level</label>
                  <input
                    type="text"
                    disabled
                    value={formData.level}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Group</label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value as ProgramGroup })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    {formData.program === 'CS EET' ? (
                      <option value="EET">Complete EET</option>
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

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-slate-800 font-semibold">Initial Payment Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="initialPaymentStatus"
                      value="unpaid"
                      checked={formData.initialPaymentStatus === 'unpaid'}
                      onChange={() => setFormData({ ...formData, initialPaymentStatus: 'unpaid' })}
                      className="accent-slate-800"
                    />
                    <span>Unpaid</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-emerald-800">
                    <input
                      type="radio"
                      name="initialPaymentStatus"
                      value="approved"
                      checked={formData.initialPaymentStatus === 'approved'}
                      onChange={() => setFormData({ ...formData, initialPaymentStatus: 'approved' })}
                      className="accent-emerald-600"
                    />
                    <span>Approved (Unlock Course)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Course / Index Name</label>
                  <input
                    type="text"
                    placeholder="e.g. CS Executive Group 1 Mentorship"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="2999"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">12-Digit UTR (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 928408123456"
                      value={formData.utrNumber}
                      onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmittingManual ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Add Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Reject Payment Modal                                               */}
      {/* ========================================================================= */}
      {rejectingStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-3">
              <XCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Reject Payment for {rejectingStudent.fullName}?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Payment status will be updated to "REJECTED". The student will be prompted to submit valid payment details.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. UTR number not found in bank records. Please re-submit."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setRejectingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Delete Student Modal                                               */}
      {/* ========================================================================= */}
      {deletingStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Remove Student Record?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to remove <span className="font-semibold text-slate-900">{deletingStudent.fullName}</span> ({deletingStudent.email})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};