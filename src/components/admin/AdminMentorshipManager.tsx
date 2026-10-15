import React, { useState, useEffect } from 'react';
import {
  StudentMentorshipProfile,
  MentorshipProgram,
  MentorshipLevel,
  MentorshipGroup,
  TrackerRow,
} from '../../types/mentorship';
import {
  getAllStudentMentorshipProfiles,
  saveStudentMentorshipProfile,
  reassignStudentGroup,
  setAdminViewingStudentId,
  getOrCreateStudentMentorship,
  deleteStudentMentorshipProfile,
  applyCustomIndexToStudent,
  generateDefaultChapters,
} from '../../services/mentorshipTrackerService';
import { AppointmentRecord } from '../../lib/backend';
import { MentorshipTrackerView } from '../MentorshipTrackerView';
import {
  getAllStudents,
  getAllInquiries,
  refreshAdminData,
  getDiscountCodes,
  getAllSlotBookings,
  getAllFreeSlotBookings,
  subscribeToDatabaseChanges,
  CentralStudent,
  DiscountCodeRecord,
  SlotBookingRecord,
  FreeSlotBookingRecord,
} from '../../services/centralStudentDatabase';
import { PaymentApprovalsTab } from './PaymentApprovalsTab';
import { DiscountCodesTab } from './DiscountCodesTab';
import { SyllabusIndexTab } from './SyllabusIndexTab';
import { ManageStudentModal } from './ManageStudentModal';
import {
  Search,
  Filter,
  User,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Flame,
  Plus,
  RefreshCw,
  Layers,
  Sparkles,
  MessageSquare,
  Trash2,
  AlertTriangle,
  Clock,
  Loader2,
  Check,
  Upload,
  Download,
  Bookmark,
  Tag,
  CreditCard,
  SlidersHorizontal,
  FileDown,
} from 'lucide-react';
import { PageId } from '../../types';
import { downloadMentorshipReportPDF } from '../../services/mentorshipReportService';

interface AdminMentorshipManagerProps {
  onNavigate: (page: PageId) => void;
  initialStudentId?: string | null;
}

export const AdminMentorshipManager: React.FC<AdminMentorshipManagerProps> = ({
  onNavigate,
  initialStudentId,
}) => {
  const [centralStudents, setCentralStudents] = useState<CentralStudent[]>(() => getAllStudents());
  const [discountCodes, setDiscountCodes] = useState<DiscountCodeRecord[]>(() => getDiscountCodes());
  const [slotBookings, setSlotBookings] = useState<SlotBookingRecord[]>(() => getAllSlotBookings());
  const [freeSlotBookings, setFreeSlotBookings] = useState<FreeSlotBookingRecord[]>(() => getAllFreeSlotBookings());
  const [students, setStudents] = useState<StudentMentorshipProfile[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [activeStudent, setActiveStudent] = useState<StudentMentorshipProfile | null>(null);
  const [managingStudent, setManagingStudent] = useState<CentralStudent | null>(null);
  const [managerTab, setManagerTab] = useState<
    'chart' | 'directory' | 'payment_approvals' | 'syllabus_index' | 'discount_codes'
  >('chart');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [directoryType, setDirectoryType] = useState<'mentorship' | 'self_paced'>('mentorship');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<StudentMentorshipProfile | null>(null);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [actionToast, setActionToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    waUrl?: string;
  } | null>(null);

  // Syllabus Index Upload & Custom Editing state (Admin Only)
  const [uploadingIndexStudent, setUploadingIndexStudent] = useState<StudentMentorshipProfile | null>(null);
  const [indexUploadTab, setIndexUploadTab] = useState<'preset' | 'file' | 'text'>('preset');
  const [pastedIndexText, setPastedIndexText] = useState('');
  const [selectedPresetGroup, setSelectedPresetGroup] = useState('exec-g1');
  const [uploadedParsedRows, setUploadedParsedRows] = useState<TrackerRow[] | null>(null);
  const [uploadError, setUploadError] = useState('');

  const loadCentralData = async () => {
    await refreshAdminData();
    syncFromCache();
  };

  const syncFromCache = () => {
    const cs = getAllStudents();
    setCentralStudents([...cs]);
    setDiscountCodes([...getDiscountCodes()]);
    setSlotBookings([...getAllSlotBookings()]);
    setFreeSlotBookings([...getAllFreeSlotBookings()]);
    setStudents(getAllStudentMentorshipProfiles());
    setAppointments([...getAllInquiries()] as AppointmentRecord[]);
    setManagingStudent((prev) => (prev ? cs.find((s) => s.studentId === prev.studentId) || null : prev));
  };

  const handleDownloadMentorshipReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await downloadMentorshipReportPDF();
      if (res.success) {
        setActionToast({
          message: res.message,
          type: 'success',
        });
      } else {
        setActionToast({
          message: res.message || 'Could not generate report.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setActionToast({
        message: err?.message || 'Failed to generate PDF dossier.',
        type: 'error',
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  useEffect(() => {
    void loadCentralData();
    const unsubscribe = subscribeToDatabaseChanges(syncFromCache);
    syncFromCache();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      if (initialStudentId) {
        const found = students.find(
          (s) =>
            s.studentId === initialStudentId ||
            s.studentEmail?.toLowerCase() === initialStudentId.toLowerCase() ||
            s.studentPhone?.replace(/\D/g, '') === initialStudentId.replace(/\D/g, '')
        );
        if (found) {
          setActiveStudent(found);
          setManagerTab('chart');
          return;
        }
      }
      if (!activeStudent) {
        setActiveStudent(students[0]);
      }
    }
  }, [students, initialStudentId]);

  const getMatchedAppointment = (s: StudentMentorshipProfile): AppointmentRecord | undefined => {
    const cleanPhone = (s.studentPhone || '').replace(/\D/g, '');
    const cleanEmail = (s.studentEmail || '').trim().toLowerCase();

    return appointments.find((a) => {
      const aPhone = (a.phone || '').replace(/\D/g, '');
      const aEmail = (a.email || '').trim().toLowerCase();
      if (cleanPhone && aPhone && (cleanPhone === aPhone || cleanPhone.slice(-10) === aPhone.slice(-10))) return true;
      if (cleanEmail && aEmail && cleanEmail === aEmail) return true;
      return false;
    });
  };

  const handleDirectWhatsApp = (student: StudentMentorshipProfile) => {
    const phone = (student.studentPhone || '').replace(/\D/g, '');
    if (!phone) {
      setActionToast({
        message: `No phone number available for ${student.studentName}.`,
        type: 'error',
      });
      setTimeout(() => setActionToast(null), 4000);
      return;
    }
    const cleanPhone = phone.startsWith('91') && phone.length === 12 ? phone : `91${phone.slice(-10)}`;
    let message = '';
    if (student.isApproved) {
      message = `Hello ${student.studentName}! Your HK Code of Rankers registration has been approved by Harkiran Kaur! 🎉\n\nYou can now log in to your Student Portal using your registered email address: ${student.studentEmail || 'your email'}.\n\nAll the best for your ${student.program} (${student.group}) journey!`;
    } else {
      message = `Hello ${student.studentName}! This is Harkiran Kaur from HK Code of Rankers regarding your ${student.program} (${student.group}) mentorship registration. We are verifying your details for student portal approval.`;
    }
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDirectEmail = (student: StudentMentorshipProfile) => {
    if (!student.studentEmail) {
      setActionToast({
        message: `No email address recorded for ${student.studentName}.`,
        type: 'error',
      });
      setTimeout(() => setActionToast(null), 4000);
      return;
    }
    const subject = student.isApproved
      ? `Registration Approved - Student Portal Access: ${student.studentName}`
      : `HK Code of Rankers - Registration Verification for ${student.studentName}`;
    const body = student.isApproved
      ? `Hello ${student.studentName},\n\nYour registration has been approved by Harkiran Kaur!\n\nYou can now log in to the HK Code of Rankers portal with your registered email: ${student.studentEmail}.\n\nWarm regards,\nHarkiran Kaur\nHK Code of Rankers`
      : `Hello ${student.studentName},\n\nWe are reviewing your enrollment details for ${student.program} (${student.group}).\n\nWarm regards,\nHarkiran Kaur\nHK Code of Rankers`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(student.studentEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeletingStudent(true);
    try {
      await deleteStudentMentorshipProfile(studentToDelete.studentId);
      setStudents((prev) => prev.filter((p) => p.studentId !== studentToDelete.studentId));
      if (activeStudent?.studentId === studentToDelete.studentId) {
        setActiveStudent(null);
      }
      setActionToast({
        message: `Student "${studentToDelete.studentName}" was permanently deleted from the database.`,
        type: 'info',
      });
      setTimeout(() => setActionToast(null), 5000);
    } catch (err) {
      console.error('Delete error:', err);
      setActionToast({
        message: 'Could not complete student deletion.',
        type: 'error',
      });
      setTimeout(() => setActionToast(null), 4000);
    } finally {
      setIsDeletingStudent(false);
      setStudentToDelete(null);
    }
  };

  const handleProfileUpdated = (updated: StudentMentorshipProfile) => {
    setActiveStudent(updated);
    setStudents((prev) => prev.map((s) => (s.studentId === updated.studentId ? updated : s)));
    saveStudentMentorshipProfile(updated);
  };

  const handleReassignGroup = (student: StudentMentorshipProfile, newGroupVal: string) => {
    let newProg: MentorshipProgram = student.program;
    let newLvl: MentorshipLevel = student.level;
    let newGrp: MentorshipGroup = student.group;

    if (newGroupVal === 'cseet') {
      newProg = 'CS EET';
      newLvl = 'Level 1';
      newGrp = 'General';
    } else if (newGroupVal === 'exec-g1') {
      newProg = 'CS Executive';
      newLvl = 'Level 2';
      newGrp = 'Group 1';
    } else if (newGroupVal === 'exec-g2') {
      newProg = 'CS Executive';
      newLvl = 'Level 2';
      newGrp = 'Group 2';
    } else if (newGroupVal === 'exec-both') {
      newProg = 'CS Executive';
      newLvl = 'Level 2';
      newGrp = 'Both';
    } else if (newGroupVal === 'prof-g1') {
      newProg = 'CS Professional';
      newLvl = 'Level 3';
      newGrp = 'Group 1';
    } else if (newGroupVal === 'prof-g2') {
      newProg = 'CS Professional';
      newLvl = 'Level 3';
      newGrp = 'Group 2';
    } else if (newGroupVal === 'prof-both') {
      newProg = 'CS Professional';
      newLvl = 'Level 3';
      newGrp = 'Both';
    }

    if (confirm(`Reassign ${student.studentName} to ${newProg} (${newGrp})?`)) {
      const updated = reassignStudentGroup(student, newProg, newLvl, newGrp);
      setStudents((prev) => prev.map((s) => (s.studentId === updated.studentId ? updated : s)));
      if (activeStudent && activeStudent.studentId === updated.studentId) {
        setActiveStudent(updated);
      }
      loadCentralData();
      syncFromCache();
    }
  };

  const handleLaunchImpersonation = (student: StudentMentorshipProfile) => {
    const studentKey = (student.studentEmail || student.studentPhone || student.studentId)
      .trim()
      .toLowerCase();
    setAdminViewingStudentId(studentKey);
    onNavigate('student-portal');
  };

  const handleProcessUploadedFile = (file: File) => {
    setUploadError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = (e.target?.result as string) || '';
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            const parsedRows: TrackerRow[] = json.map((item, idx) => ({
              id: item.id || `custom_row_${idx}_${Date.now()}`,
              programGroup: item.programGroup || uploadingIndexStudent?.assignedIndexId || 'exec-g1',
              subjectCode: item.subjectCode || 'SUB',
              subjectName: item.subjectName || item.subject || 'Subject',
              chapterNo: item.chapterNo || `Chapter ${idx + 1}`,
              isChapterRed: Boolean(item.isChapterRed),
              amendment: item.amendment || 'Standard',
              isAmendmentRed: Boolean(item.isAmendmentRed),
              topic: item.topic || item.topicName || item.name || `Topic ${idx + 1}`,
              isTopicRed: Boolean(item.isTopicRed),
              lectures: item.lectures || 'Pending',
              firstDetailedReading: item.firstDetailedReading || 'Pending',
              chapterWiseTest: item.chapterWiseTest || 'Pending',
              firstMockTest: item.firstMockTest || 'Pending',
              secondMockTest: item.secondMockTest || 'Pending',
              fifthRevision: item.fifthRevision || 'Pending',
              fourthRevision: item.fourthRevision || 'Pending',
              thirdRevision: item.thirdRevision || 'Pending',
              secondRevision: item.secondRevision || 'Pending',
              firstRevision: item.firstRevision || 'Pending',
              remarks: item.remarks || '',
            }));
            setUploadedParsedRows(parsedRows);
            return;
          }
          throw new Error('JSON file must contain an array of syllabus chapter objects.');
        }

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          throw new Error('CSV file is empty or contains only headers.');
        }
        const parsedRows: TrackerRow[] = [];
        const startIndex =
          lines[0].toLowerCase().includes('subject') || lines[0].toLowerCase().includes('chapter')
            ? 1
            : 0;

        for (let i = startIndex; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
          if (parts.length >= 2) {
            const subjectName = parts[0] || 'Company Law & Practice';
            const chapterNo = parts[1] || `Chapter ${i}`;
            const topic = parts[2] || parts[1] || 'Chapter Overview';
            const amendment = parts[3] || 'Standard';

            parsedRows.push({
              id: `csv_row_${i}_${Date.now()}`,
              programGroup: uploadingIndexStudent?.assignedIndexId || 'exec-g1',
              subjectCode: subjectName.slice(0, 3).toUpperCase(),
              subjectName,
              chapterNo,
              isChapterRed: false,
              amendment,
              isAmendmentRed: false,
              topic,
              isTopicRed: false,
              lectures: 'Pending',
              firstDetailedReading: 'Pending',
              chapterWiseTest: 'Pending',
              firstMockTest: 'Pending',
              secondMockTest: 'Pending',
              fifthRevision: 'Pending',
              fourthRevision: 'Pending',
              thirdRevision: 'Pending',
              secondRevision: 'Pending',
              firstRevision: 'Pending',
            });
          }
        }
        if (parsedRows.length === 0) {
          throw new Error('Could not parse valid chapters. Format: Subject,Chapter No,Topic,Amendment');
        }
        setUploadedParsedRows(parsedRows);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse syllabus file.');
      }
    };
    reader.readAsText(file);
  };

  const handleParsePastedText = () => {
    setUploadError('');
    if (!pastedIndexText.trim()) {
      setUploadError('Please paste chapter lines or syllabus text.');
      return;
    }
    const lines = pastedIndexText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const parsedRows: TrackerRow[] = lines.map((line, idx) => {
      const pipeParts = line.split('|').map((p) => p.trim());
      let subjectName = uploadingIndexStudent?.program ? `${uploadingIndexStudent.program} Paper` : 'General Subject';
      let chapterNo = `Chapter ${idx + 1}`;
      let topic = line.trim();
      let amendment = 'Standard';

      if (pipeParts.length >= 4) {
        subjectName = pipeParts[0];
        chapterNo = pipeParts[1];
        topic = pipeParts[2];
        amendment = pipeParts[3];
      } else if (pipeParts.length === 3) {
        subjectName = pipeParts[0];
        chapterNo = pipeParts[1];
        topic = pipeParts[2];
      } else if (pipeParts.length === 2) {
        chapterNo = pipeParts[0];
        topic = pipeParts[1];
      } else if (line.includes('-')) {
        const dashParts = line.split('-');
        chapterNo = dashParts[0].trim();
        topic = dashParts.slice(1).join('-').trim();
      }

      return {
        id: `pasted_row_${idx}_${Date.now()}`,
        programGroup: uploadingIndexStudent?.assignedIndexId || 'exec-g1',
        subjectCode: 'SUB',
        subjectName,
        chapterNo,
        isChapterRed: false,
        amendment,
        isAmendmentRed: false,
        topic,
        isTopicRed: false,
        lectures: 'Pending',
        firstDetailedReading: 'Pending',
        chapterWiseTest: 'Pending',
        firstMockTest: 'Pending',
        secondMockTest: 'Pending',
        fifthRevision: 'Pending',
        fourthRevision: 'Pending',
        thirdRevision: 'Pending',
        secondRevision: 'Pending',
        firstRevision: 'Pending',
      };
    });
    setUploadedParsedRows(parsedRows);
  };

  const handleLoadPresetSyllabus = (presetKey: string) => {
    setUploadError('');
    setSelectedPresetGroup(presetKey);
    let prog: MentorshipProgram = 'CS Executive';
    let grp: MentorshipGroup = 'Group 1';
    if (presetKey === 'cseet') {
      prog = 'CS EET';
      grp = 'General';
    } else if (presetKey === 'exec-g1') {
      prog = 'CS Executive';
      grp = 'Group 1';
    } else if (presetKey === 'exec-g2') {
      prog = 'CS Executive';
      grp = 'Group 2';
    } else if (presetKey === 'exec-both') {
      prog = 'CS Executive';
      grp = 'Both';
    } else if (presetKey === 'prof-g1') {
      prog = 'CS Professional';
      grp = 'Group 1';
    } else if (presetKey === 'prof-g2') {
      prog = 'CS Professional';
      grp = 'Group 2';
    } else if (presetKey === 'prof-both') {
      prog = 'CS Professional';
      grp = 'Both';
    }
    const freshRows = generateDefaultChapters(prog, grp);
    setUploadedParsedRows(freshRows);
  };

  const handleApplyIndexToStudent = () => {
    if (!uploadingIndexStudent) return;
    if (!uploadedParsedRows || uploadedParsedRows.length === 0) {
      setUploadError('Please select a preset, upload a file, or paste text to generate chapters first.');
      return;
    }
    const updated = applyCustomIndexToStudent(uploadingIndexStudent, uploadedParsedRows);
    setStudents((prev) => prev.map((s) => (s.studentId === updated.studentId ? updated : s)));
    if (activeStudent && activeStudent.studentId === updated.studentId) {
      setActiveStudent(updated);
    }
    setActionToast({
      message: `Syllabus Index updated! ${uploadedParsedRows.length} chapters loaded for ${updated.studentName}.`,
      type: 'success',
    });
    setUploadingIndexStudent(null);
    setUploadedParsedRows(null);
    setPastedIndexText('');
    setUploadError('');
  };

  const handleDownloadSampleCsv = () => {
    const sample =
      'Subject,Chapter No,Topic Name,Amendment\n' +
      'Jurisprudence Interpretation and General Laws,Chapter 1,Sources of Law,Standard\n' +
      'Company Law & Practice,Chapter 1,Introduction to Company Law,Notification No 14\n';
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'HK_Rankers_Syllabus_Index_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isSelfPacedStudent = (s: StudentMentorshipProfile) => {
    const centralMatch = centralStudents.find(
      (cs) =>
        cs.studentId === s.studentId ||
        cs.email.toLowerCase() === (s.studentEmail || '').toLowerCase()
    );
    return Boolean(
      s.isStudyProgressIndex ||
      s.studyIndexAccess ||
      centralMatch?.studyIndexAccess ||
      centralMatch?.enrolledProductIds?.some((id) => id.includes('index') || id.includes('progress')) ||
      centralMatch?.registeredVia === 'study_index' ||
      s.assignedIndexId?.includes('index')
    );
  };

  const mentorshipStudents = students.filter((s) => !isSelfPacedStudent(s));
  const selfPacedStudents = students.filter((s) => isSelfPacedStudent(s));
  const currentDirectoryPool = directoryType === 'mentorship' ? mentorshipStudents : selfPacedStudents;

  const filteredStudents = currentDirectoryPool.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentEmail && s.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.studentPhone && s.studentPhone.includes(searchQuery)) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup =
      groupFilter === 'all' ||
      (groupFilter === 'cseet' && s.program === 'CS EET') ||
      (groupFilter === 'exec-g1' && s.program === 'CS Executive' && s.group === 'Group 1') ||
      (groupFilter === 'exec-g2' && s.program === 'CS Executive' && s.group === 'Group 2') ||
      (groupFilter === 'exec-both' && s.program === 'CS Executive' && s.group === 'Both') ||
      (groupFilter === 'prof-g1' && s.program === 'CS Professional' && s.group === 'Group 1') ||
      (groupFilter === 'prof-g2' && s.program === 'CS Professional' && s.group === 'Group 2') ||
      (groupFilter === 'prof-both' && s.program === 'CS Professional' && s.group === 'Both');

    const matchesApproval =
      approvalFilter === 'all' ||
      (approvalFilter === 'approved' && s.isApproved) ||
      (approvalFilter === 'pending' && !s.isApproved);

    return matchesSearch && matchesGroup && matchesApproval;
  });

  const totalMentorshipCount = mentorshipStudents.length;
  const pendingMentorshipCount = mentorshipStudents.filter((s) => !s.isApproved).length;
  const approvedMentorshipCount = mentorshipStudents.filter((s) => s.isApproved).length;
  const execG1MentorshipCount = mentorshipStudents.filter((s) => s.program === 'CS Executive' && (s.group === 'Group 1' || s.group === 'Both')).length;
  const profMentorshipCount = mentorshipStudents.filter((s) => s.program === 'CS Professional').length;

  const totalSelfPacedCount = selfPacedStudents.length;
  const cseetSelfPacedCount = selfPacedStudents.filter((s) => s.program === 'CS EET').length;
  const execSelfPacedCount = selfPacedStudents.filter((s) => s.program === 'CS Executive').length;
  const profSelfPacedCount = selfPacedStudents.filter((s) => s.program === 'CS Professional').length;

  return (
    <div className="space-y-6 font-poppins">
      {/* Top Admin Controls Bar */}
      <div className="bg-white border-2 border-[#C8A45D]/40 p-2 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setManagerTab('chart')}
            className={`py-2 px-3 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              managerTab === 'chart'
                ? 'gold-gradient-bg text-black shadow-sm font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-[#8A651E]" />
            <span>📊 Mentorship Chart</span>
          </button>

          <button
            onClick={() => setManagerTab('directory')}
            className={`py-2 px-3 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              managerTab === 'directory'
                ? 'gold-gradient-bg text-black shadow-sm font-bold'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>👥 Student Directory ({centralStudents.length})</span>
          </button>

          <button
            onClick={() => setManagerTab('syllabus_index')}
            className={`py-2 px-3 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              managerTab === 'syllabus_index'
                ? 'bg-[#1C1917] text-[#FFE3A0] border border-[#C8A45D] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>📚 ICSI Syllabus Indexes</span>
          </button>

          <button
            onClick={() => setManagerTab('discount_codes')}
            className={`py-2 px-3 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              managerTab === 'discount_codes'
                ? 'bg-[#1C1917] text-[#FFE3A0] border border-[#C8A45D] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-[#C8A45D]" />
            <span>🏷️ Promo Codes</span>
          </button>

          <button
            onClick={() => setManagerTab('payment_approvals')}
            className={`py-2 px-3 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              managerTab === 'payment_approvals'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm font-bold'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>💳 Direct UPI Approvals</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadMentorshipReport}
            disabled={isGeneratingReport}
            className="px-3.5 py-2 bg-gradient-to-r from-[#1C1917] to-[#2E2419] hover:brightness-110 text-[#FFE3A0] border border-[#C8A45D]/60 rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isGeneratingReport ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C8A45D]" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-[#C8A45D]" />
            )}
            <span>📄 Mentorship Report PDF</span>
          </button>

          <button
            onClick={() => {
              const target = activeStudent || students[0];
              if (target) {
                handleLaunchImpersonation(target);
              } else {
                onNavigate('student-portal');
              }
            }}
            className="px-3.5 py-2 gold-gradient-bg hover:brightness-105 text-black rounded-xl text-xs font-montserrat font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>🎓 Launch Student Portal</span>
          </button>
        </div>
      </div>

      {/* TABS RENDER */}
      {managerTab === 'payment_approvals' && (
        <PaymentApprovalsTab
          students={centralStudents}
          onRefresh={loadCentralData}
          onOpenMentorshipChart={() => setManagerTab('chart')}
        />
      )}

      {managerTab === 'syllabus_index' && <SyllabusIndexTab />}

      {managerTab === 'discount_codes' && <DiscountCodesTab discountCodes={discountCodes} />}

      {managerTab === 'chart' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-[#C8A45D]/40 rounded-2xl p-3.5 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-montserrat font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#C8A45D]" />
                <span>Select Student:</span>
              </span>

              <select
                value={activeStudent?.studentId || (students[0]?.studentId ?? '')}
                onChange={(e) => {
                  const s = students.find((x) => x.studentId === e.target.value);
                  if (s) setActiveStudent(s);
                }}
                className="px-3 py-2 bg-[#FAF5E9] border border-[#C8A45D]/60 rounded-xl text-xs font-montserrat font-bold text-[#8A651E] outline-none cursor-pointer min-w-[260px] shadow-xs"
              >
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.studentName} — {s.program} ({s.group}) [{s.isApproved ? 'Approved' : 'Pending'}]
                  </option>
                ))}
              </select>

              {activeStudent && (
                <span className="text-xs text-gray-500 font-medium">
                  Attempt: <strong className="text-gray-900">{activeStudent.targetAttempt}</strong>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeStudent && (
                <button
                  onClick={() => handleLaunchImpersonation(activeStudent)}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#1C1917] to-[#2E2419] hover:bg-black text-[#FFE3A0] border border-[#C8A45D]/60 text-xs font-montserrat font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Access Student Portal</span>
                </button>
              )}

              <button
                onClick={() => setManagerTab('directory')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Students Directory</span>
              </button>
            </div>
          </div>

          {activeStudent || students[0] ? (
            <MentorshipTrackerView
              profile={activeStudent || students[0]}
              isAdmin={true}
              onProfileUpdated={handleProfileUpdated}
              onExitAdminView={() => setManagerTab('directory')}
            />
          ) : (
            <div className="p-8 bg-white border border-gray-200 rounded-2xl text-center space-y-3">
              <p className="text-gray-600 text-sm">No student enrolled yet.</p>
              <button
                onClick={() => setManagerTab('directory')}
                className="px-4 py-2 gold-gradient-bg text-black rounded-xl font-bold text-xs"
              >
                Open Student Directory
              </button>
            </div>
          )}
        </div>
      )}

      {managerTab === 'directory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-stone-100 rounded-2xl border border-stone-200">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setDirectoryType('mentorship')}
                className={`px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  directoryType === 'mentorship'
                    ? 'bg-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                    : 'text-gray-700 hover:text-black hover:bg-white/80'
                }`}
              >
                <Users className="w-4 h-4 text-[#C8A45D]" />
                <span>👥 Mentorship Directory</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8A45D]/20 text-[#FFE3A0]">
                  {totalMentorshipCount}
                </span>
              </button>

              <button
                onClick={() => setDirectoryType('self_paced')}
                className={`px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  directoryType === 'self_paced'
                    ? 'bg-[#1C1917] text-[#FFE3A0] shadow-md border border-[#C8A45D]'
                    : 'text-gray-700 hover:text-black hover:bg-white/80'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#C8A45D]" />
                <span>📑 Self-Paced Index Directory</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8A45D]/20 text-[#FFE3A0]">
                  {totalSelfPacedCount}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          {directoryType === 'mentorship' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] font-montserrat font-bold text-gray-500 uppercase tracking-wider">
                  Total Mentorship
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#1C1917] pt-1">
                  {totalMentorshipCount}
                </div>
              </div>

              <div
                onClick={() => setApprovalFilter(approvalFilter === 'pending' ? 'all' : 'pending')}
                className={`border p-4 rounded-2xl shadow-sm cursor-pointer transition-all ${
                  pendingMentorshipCount > 0
                    ? 'bg-amber-500/10 border-amber-500/50 hover:bg-amber-500/20'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-[11px] font-montserrat font-bold text-amber-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Pending Approvals</span>
                  {pendingMentorshipCount > 0 && <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
                </div>
                <div className="text-2xl font-cinzel font-bold text-amber-700 pt-1">
                  {pendingMentorshipCount}
                </div>
              </div>

              <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] font-montserrat font-bold text-[#8A651E] uppercase tracking-wider">
                  Executive
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#8A651E] pt-1">
                  {execG1MentorshipCount}
                </div>
              </div>

              <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] font-montserrat font-bold text-emerald-800 uppercase tracking-wider">
                  Professional
                </div>
                <div className="text-2xl font-cinzel font-bold text-emerald-800 pt-1">
                  {profMentorshipCount}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] font-montserrat font-bold text-gray-500 uppercase tracking-wider">
                  Total Self-Paced
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#1C1917] pt-1">
                  {totalSelfPacedCount}
                </div>
              </div>
              <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] font-montserrat font-bold text-[#8A651E] uppercase tracking-wider">
                  CSEET Index
                </div>
                <div className="text-2xl font-cinzel font-bold text-[#8A651E] pt-1">
                  {cseetSelfPacedCount}
                </div>
              </div>
              <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] font-montserrat font-bold text-amber-700 uppercase tracking-wider">
                  Executive Index
                </div>
                <div className="text-2xl font-cinzel font-bold text-amber-700 pt-1">
                  {execSelfPacedCount}
                </div>
              </div>
              <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] font-montserrat font-bold text-emerald-800 uppercase tracking-wider">
                  Professional Index
                </div>
                <div className="text-2xl font-cinzel font-bold text-emerald-800 pt-1">
                  {profSelfPacedCount}
                </div>
              </div>
            </div>
          )}

          {/* Search, Filter Bar */}
          <div className="bg-white border border-[#C8A45D]/30 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student by name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#C8A45D]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                <select
                  value={approvalFilter}
                  onChange={(e) => setApprovalFilter(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="approved">✓ Approved</option>
                </select>
              </div>

              <button
                onClick={syncFromCache}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {actionToast && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md border ${
                actionToast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : actionToast.type === 'error'
                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <span>{actionToast.message}</span>
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-[#C8A45D]/30 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1C1917] text-white font-montserrat font-bold text-[11px] uppercase">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4">Group</th>
                    <th className="py-3 px-4 text-center">Progress</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500 text-xs">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const completedCount = s.trackerRows.filter(
                        (r) => r.firstDetailedReading === 'Completed'
                      ).length;

                      return (
                        <tr key={s.studentId} className="hover:bg-[#FAF8F5]">
                          <td className="py-3.5 px-4 font-semibold text-gray-900">
                            {s.studentName}
                          </td>
                          <td className="py-3.5 px-4 text-gray-600">
                            <div>{s.studentEmail || '—'}</div>
                            <div className="text-[11px] text-gray-500">{s.studentPhone || '—'}</div>
                          </td>
                          <td className="py-3.5 px-4">{s.program}</td>
                          <td className="py-3.5 px-4">{s.group}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-emerald-700">
                            {completedCount} / {s.trackerRows.length}
                          </td>
                          <td className="py-3.5 px-4">
                            {s.isApproved ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                                <Check className="w-3.5 h-3.5" /> Approved
                              </span>
                            ) : (
                              <span className="text-amber-700 font-bold">Pending</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => handleDirectWhatsApp(s)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs rounded-lg font-bold"
                            >
                              WhatsApp
                            </button>
                            <button
                              onClick={() => setStudentToDelete(s)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs rounded-lg font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-bold text-gray-900">Confirm Student Deletion</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to permanently delete <strong>{studentToDelete.studentName}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 border rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStudent}
                disabled={isDeletingStudent}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                {isDeletingStudent ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE STUDENT MODAL */}
      {managingStudent && (
        <ManageStudentModal
          student={managingStudent}
          slotBookings={slotBookings}
          onClose={() => setManagingStudent(null)}
          onRefresh={loadCentralData}
          onOpenTracker={(studentId) => {
            const prof = students.find((st) => st.studentId === studentId);
            if (prof) {
              setActiveStudent(prof);
              setManagerTab('chart');
              setManagingStudent(null);
            }
          }}
          onLaunchPortal={(studentEmail) => {
            const prof = students.find((st) => st.studentEmail.toLowerCase() === studentEmail.toLowerCase());
            if (prof) {
              handleLaunchImpersonation(prof);
            }
          }}
        />
      )}
    </div>
  );
};