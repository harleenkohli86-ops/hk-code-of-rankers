import React, { useState, useEffect } from 'react';
import {
  StudentMentorshipProfile,
  TrackerRow,
  MonthMentorshipRecord,
  MonthlyMentorshipCall,
  MentorshipProgram,
  MentorshipLevel,
  MentorshipGroup,
} from '../types/mentorship';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  PhoneCall,
  Edit3,
  Plus,
  Trash2,
  Bookmark,
  BookOpen,
  ShieldCheck,
  Award,
  Sparkles,
  Save,
  MessageCircle,
  HelpCircle,
  Flame,
  Check,
  Upload,
  Download,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import {
  saveStudentMentorshipProfile,
  syncProfileToOfficialSyllabus,
  reassignStudentGroup,
  generateDefaultChapters,
  applyCustomIndexToStudent,
} from '../services/mentorshipTrackerService';
import { updateStudentStudyIndexRows } from '../services/centralStudentDatabase';

interface MentorshipTrackerViewProps {
  profile: StudentMentorshipProfile;
  isAdmin: boolean;
  isStudyProgressIndex?: boolean;
  onPurchaseStudyIndex?: () => void;
  onProfileUpdated?: (updated: StudentMentorshipProfile) => void;
  onExitAdminView?: () => void;
}

const formatStatusDisplay = (val: string) => {
  const str = (val || '').trim();
  if (!str || str.toLowerCase() === 'pending') return 'Pending';
  if (
    str.toLowerCase() === 'working' ||
    str.toLowerCase() === 'in progress' ||
    str.toLowerCase() === 'scheduled'
  )
    return 'Working';
  if (
    str.toLowerCase() === 'completed' ||
    str.toLowerCase() === 'done' ||
    str.toLowerCase().includes('evaluated')
  )
    return 'Completed';
  return str;
};

export const MentorshipTrackerView: React.FC<MentorshipTrackerViewProps> = ({
  profile: initialProfile,
  isAdmin,
  isStudyProgressIndex = false,
  onPurchaseStudyIndex,
  onProfileUpdated,
  onExitAdminView,
}) => {
  const [profile, setProfile] = useState<StudentMentorshipProfile>(initialProfile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const hasPurchasedIndex = Boolean(profile.studyIndexAccess);
  const canEdit = isAdmin || (Boolean(isStudyProgressIndex) && hasPurchasedIndex);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Synchronize internal state when prop changes
  useEffect(() => {
    setProfile(initialProfile);
    setSelectedPresetGroup(initialProfile.assignedIndexId || 'exec-g1');
  }, [initialProfile]);

  // Editing row modal or inline
  const [editingRow, setEditingRow] = useState<TrackerRow | null>(null);
  const [isAddingRow, setIsAddingRow] = useState(false);
  
  // Dedicated Quick Amendment Modal (Admin can write manually)
  const [editingAmendmentRow, setEditingAmendmentRow] = useState<{
    id: string;
    chapterNo: string;
    topic: string;
    amendment: string;
  } | null>(null);

  // 12-Month Mentorship View Mode: Table (default) vs Cards
  const [callsViewMode, setCallsViewMode] = useState<'table' | 'cards'>('table');

  const [newRowData, setNewRowData] = useState<Partial<TrackerRow>>({
    subjectName: '',
    chapterNo: '',
    amendment: '',
    topic: '',
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
    remarks: '',
  });

  // Editing call modal
  const [editingCall, setEditingCall] = useState<{
    month: MonthMentorshipRecord['month'];
    callNum: 1 | 2 | 3 | 4;
    callData: MonthlyMentorshipCall;
  } | null>(null);

  // Admin Index Upload state
  const [isUploadingIndex, setIsUploadingIndex] = useState(false);
  const [indexUploadTab, setIndexUploadTab] = useState<'preset' | 'file' | 'text'>('preset');
  const [pastedIndexText, setPastedIndexText] = useState('');
  const [selectedPresetGroup, setSelectedPresetGroup] = useState(profile.assignedIndexId || 'exec-g1');
  const [uploadedParsedRows, setUploadedParsedRows] = useState<TrackerRow[] | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Handle uploaded file (CSV / JSON)
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
              programGroup: item.programGroup || profile.assignedIndexId || 'exec-g1',
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

        // CSV parsing
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
              programGroup: profile.assignedIndexId || 'exec-g1',
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
          throw new Error('Could not parse valid chapters. Ensure format: Subject,Chapter No,Topic,Amendment');
        }
        setUploadedParsedRows(parsedRows);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse syllabus file.');
      }
    };
    reader.readAsText(file);
  };

  // Parse pasted text
  const handleParsePastedText = () => {
    setUploadError('');
    if (!pastedIndexText.trim()) {
      setUploadError('Please paste chapter lines or syllabus text.');
      return;
    }
    const lines = pastedIndexText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const parsedRows: TrackerRow[] = lines.map((line, idx) => {
      const pipeParts = line.split('|').map((p) => p.trim());
      let subjectName = `${profile.program} Paper`;
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
        programGroup: profile.assignedIndexId || 'exec-g1',
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

  // Load ICSI preset
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

  // Apply syllabus index to student profile
  const handleApplyIndex = () => {
    if (!uploadedParsedRows || uploadedParsedRows.length === 0) {
      setUploadError('Please select a preset, upload a file, or paste text to generate chapters first.');
      return;
    }
    const updated = applyCustomIndexToStudent(profile, uploadedParsedRows);
    persistChange(updated);
    setIsUploadingIndex(false);
    setUploadedParsedRows(null);
    setPastedIndexText('');
    setUploadError('');
  };

  // Download Sample CSV
  const handleDownloadSampleCsv = () => {
    const sample =
      'Subject,Chapter No,Topic Name,Amendment\n' +
      'Jurisprudence Interpretation and General Laws,Chapter 1,Sources of Law,Standard\n' +
      'Jurisprudence Interpretation and General Laws,Chapter 2,Constitution of India,2024 Landmark Cases\n' +
      'Company Law & Practice,Chapter 1,Introduction to Company Law,Notification No 14\n' +
      'Company Law & Practice,Chapter 2,Share Capital and Debentures,Amended Rules\n' +
      'Setting Up of Business,Chapter 1,Choice of Business Organization,Standard\n';
    const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'HK_Rankers_Syllabus_Index_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sync state if initialProfile changes
  React.useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const persistChange = async (updated: StudentMentorshipProfile) => {
    if (isStudyProgressIndex) {
      if (!canEdit) {
        alert('Index editing access is currently disabled. Please contact the Admin.');
        return;
      }
      const targetKey = profile.studentId || updated.studentId;
      if (targetKey) {
        const res = await updateStudentStudyIndexRows(targetKey, updated.trackerRows);
        if (!res.success) {
          alert(res.message || 'Index editing access is currently disabled. Please contact the Admin.');
          return;
        }
      }
      setProfile(updated);
      if (onProfileUpdated) onProfileUpdated(updated);
    } else {
      setProfile(updated);
      if (onProfileUpdated) onProfileUpdated(updated);
      await saveStudentMentorshipProfile(updated);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Toggle Red marking on Chapter No (Admin, Self-Study, or Mentorship student doubt flag)
  const handleToggleChapterRed = (rowId: string) => {
    if (!canEdit) {
      alert('Index editing access is currently disabled. Please contact the Admin.');
      return;
    }
    const updatedRows = profile.trackerRows.map((r) =>
      r.id === rowId ? { ...r, isChapterRed: !r.isChapterRed } : r
    );
    persistChange({ ...profile, trackerRows: updatedRows });
  };

  // Toggle Red marking on Topic (Admin, Self-Study, or Mentorship student doubt flag)
  const handleToggleTopicRed = (rowId: string) => {
    if (!canEdit) {
      alert('Index editing access is currently disabled. Please contact the Admin.');
      return;
    }
    const updatedRows = profile.trackerRows.map((r) =>
      r.id === rowId ? { ...r, isTopicRed: !r.isTopicRed } : r
    );
    persistChange({ ...profile, trackerRows: updatedRows });
  };

  // Quick cycle status in a column (Pending -> Working -> Completed -> Pending)
  const handleCycleStatus = (
    rowId: string,
    field: keyof TrackerRow,
    options: string[] = ['Pending', 'Working', 'Completed']
  ) => {
    if (!canEdit) {
      alert('Index editing access is currently disabled. Please contact the Admin.');
      return;
    }
    const updatedRows = profile.trackerRows.map((r) => {
      if (r.id !== rowId) return r;
      const current = (r[field] as string) || 'Pending';
      // Normalize legacy states
      let norm = current;
      if (norm === 'In Progress') norm = 'Working';
      if (norm === 'Done' || norm.startsWith('Evaluated')) norm = 'Completed';

      const currentIndex = options.indexOf(norm);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % options.length;
      return { ...r, [field]: options[nextIndex] };
    });
    persistChange({ ...profile, trackerRows: updatedRows });
  };

  // Set status directly
  const handleSetStatus = (
    rowId: string,
    field: keyof TrackerRow,
    status: 'Completed' | 'Working' | 'Pending'
  ) => {
    if (!canEdit) {
      alert('Index editing access is currently disabled. Please contact the Admin.');
      return;
    }
    const updatedRows = profile.trackerRows.map((r) =>
      r.id === rowId ? { ...r, [field]: status } : r
    );
    persistChange({ ...profile, trackerRows: updatedRows });
  };

  // Admin: Change all chapters and tracking columns to "Pending"
  const handleResetAllToPending = () => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to mark all chapters as Pending?')) {
      return;
    }

    const updatedRows = profile.trackerRows.map((r) => ({
      ...r,
      lectures: 'Pending' as const,
      firstDetailedReading: 'Pending' as const,
      chapterWiseTest: 'Pending' as const,
      firstMockTest: 'Pending' as const,
      secondMockTest: 'Pending' as const,
      fifthRevision: 'Pending' as const,
      fourthRevision: 'Pending' as const,
      thirdRevision: 'Pending' as const,
      secondRevision: 'Pending' as const,
      firstRevision: 'Pending' as const,
    }));
    persistChange({ ...profile, trackerRows: updatedRows });
  };

  // Admin: Change all chapters and tracking columns to "Completed"
  const handleMarkAllToCompleted = () => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to mark all chapters as Completed?')) {
      return;
    }

    const updatedRows = profile.trackerRows.map((r) => ({
      ...r,
      lectures: 'Completed' as const,
      firstDetailedReading: 'Completed' as const,
      chapterWiseTest: 'Completed' as const,
      firstMockTest: 'Completed' as const,
      secondMockTest: 'Completed' as const,
      fifthRevision: 'Completed' as const,
      fourthRevision: 'Completed' as const,
      thirdRevision: 'Completed' as const,
      secondRevision: 'Completed' as const,
      firstRevision: 'Completed' as const,
    }));
    persistChange({ ...profile, trackerRows: updatedRows });
  };

  // Admin: Sync with Official ICSI Syllabus
  const handleSyncOfficialSyllabus = () => {
    if (!isAdmin) return;
    const synced = syncProfileToOfficialSyllabus(profile, false);
    setProfile(synced);
    if (onProfileUpdated) onProfileUpdated(synced);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Admin: Switch Group-wise Index
  const handleReassignGroup = (newGroupKey: string) => {
    if (!isAdmin) return;
    let newProg: MentorshipProgram = profile.program;
    let newLvl: MentorshipLevel = profile.level;
    let newGrp: MentorshipGroup = profile.group;

    if (newGroupKey === 'cseet') {
      newProg = 'CS EET';
      newLvl = 'Level 1';
      newGrp = 'General';
    } else if (newGroupKey === 'exec-g1') {
      newProg = 'CS Executive';
      newLvl = 'Level 2';
      newGrp = 'Group 1';
    } else if (newGroupKey === 'exec-g2') {
      newProg = 'CS Executive';
      newLvl = 'Level 2';
      newGrp = 'Group 2';
    } else if (newGroupKey === 'exec-both') {
      newProg = 'CS Executive';
      newLvl = 'Level 2';
      newGrp = 'Both';
    } else if (newGroupKey === 'prof-g1') {
      newProg = 'CS Professional';
      newLvl = 'Level 3';
      newGrp = 'Group 1';
    } else if (newGroupKey === 'prof-g2') {
      newProg = 'CS Professional';
      newLvl = 'Level 3';
      newGrp = 'Group 2';
    } else if (newGroupKey === 'prof-both') {
      newProg = 'CS Professional';
      newLvl = 'Level 3';
      newGrp = 'Both';
    }

    const updated = reassignStudentGroup(profile, newProg, newLvl, newGrp);
    setProfile(updated);
    if (onProfileUpdated) onProfileUpdated(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Admin: Save Manual Amendment
  const handleSaveAmendment = (rowId: string, amendmentText: string) => {
    if (!isAdmin) return;
    const updatedRows = profile.trackerRows.map((r) =>
      r.id === rowId ? { ...r, amendment: amendmentText.trim() } : r
    );
    persistChange({ ...profile, trackerRows: updatedRows });
    setEditingAmendmentRow(null);
  };

  // Admin: Delete Row
  const handleDeleteRow = (rowId: string) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to remove this chapter from the student tracker?')) return;
    const updatedRows = profile.trackerRows.filter((r) => r.id !== rowId);
    persistChange({ ...profile, trackerRows: updatedRows });
  };

  // Admin: Save Added Row
  const handleSaveNewRow = () => {
    if (!isAdmin) return;
    if (!newRowData.chapterNo || !newRowData.topic) {
      alert('Please fill in Chapter Number and Topic.');
      return;
    }

    const newRow: TrackerRow = {
      id: `row_${Date.now()}`,
      programGroup: profile.assignedIndexId,
      subjectCode: newRowData.subjectCode || 'Paper',
      subjectName: newRowData.subjectName || 'General Subject',
      chapterNo: newRowData.chapterNo,
      isChapterRed: false,
      amendment: newRowData.amendment || '',
      isAmendmentRed: false,
      topic: newRowData.topic,
      isTopicRed: false,
      lectures: newRowData.lectures || 'Pending',
      firstDetailedReading: newRowData.firstDetailedReading || 'Pending',
      chapterWiseTest: newRowData.chapterWiseTest || 'Pending',
      firstMockTest: newRowData.firstMockTest || 'Pending',
      secondMockTest: newRowData.secondMockTest || 'Pending',
      fifthRevision: newRowData.fifthRevision || 'Pending',
      fourthRevision: newRowData.fourthRevision || 'Pending',
      thirdRevision: newRowData.thirdRevision || 'Pending',
      secondRevision: newRowData.secondRevision || 'Pending',
      firstRevision: newRowData.firstRevision || 'Pending',
      remarks: newRowData.remarks || '',
    };

    persistChange({
      ...profile,
      trackerRows: [...profile.trackerRows, newRow],
    });
    setIsAddingRow(false);
    setNewRowData({
      subjectName: '',
      chapterNo: '',
      amendment: '',
      topic: '',
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
      remarks: '',
    });
  };

  // Save Edit Row (Admin or Student in Self-Study mode)
  const handleSaveEditRow = () => {
    if (!canEdit || !editingRow) return;
    const updatedRows = profile.trackerRows.map((r) =>
      r.id === editingRow.id ? editingRow : r
    );
    persistChange({ ...profile, trackerRows: updatedRows });
    setEditingRow(null);
  };

  // Admin: Save Call
  const handleSaveCall = () => {
    if (!isAdmin || !editingCall) return;
    const updatedCalls = profile.monthlyCalls.map((m) => {
      if (m.month !== editingCall.month) return m;
      const key = `call${editingCall.callNum}` as 'call1' | 'call2' | 'call3' | 'call4';
      return {
        ...m,
        [key]: editingCall.callData,
      };
    });
    persistChange({ ...profile, monthlyCalls: updatedCalls });
    setEditingCall(null);
  };

  // Unique Subjects for filter
  const subjectsList = Array.from(
    new Set(profile.trackerRows.map((r) => r.subjectName || r.subjectCode))
  ).filter(Boolean);

  const filteredRows = profile.trackerRows.filter((r) => {
    const matchesSubject =
      activeSubjectFilter === 'all' ||
      r.subjectName === activeSubjectFilter ||
      r.subjectCode === activeSubjectFilter;
    const matchesSearch =
      !searchFilter ||
      r.chapterNo.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (r.amendment && r.amendment.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (r.remarks && r.remarks.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const redMarkedCount = profile.trackerRows.filter((r) => r.isChapterRed || r.isTopicRed).length;
  const completedChaptersCount = profile.trackerRows.filter(
    (r) => r.firstDetailedReading === 'Completed'
  ).length;

  return (
    <div className="space-y-8 font-poppins text-gray-900">
      {/* Save Toast */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold font-montserrat">
            Changes saved to database & reflected on student portal!
          </span>
        </div>
      )}

      {/* Admin Mode Bar */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-[#1C1917] via-[#2A231C] to-[#1C1917] border-2 border-[#C8A45D] rounded-2xl p-4 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#FFE3A0] border border-amber-500/40 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-widest text-[#FFE3A0] font-montserrat">
                  Master Admin Impersonation View
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/40">
                  Full Editing Access
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Viewing <strong>{profile.studentName}</strong> ({profile.studentEmail || profile.studentPhone}). Single-click to toggle RED markings, update statuses, or edit calls.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddingRow(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black text-xs font-montserrat font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Chapter / Topic</span>
            </button>
            {onExitAdminView && (
              <button
                onClick={onExitAdminView}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                Back to Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}

      {/* Access Mode Banner */}
      {isStudyProgressIndex ? (
        canEdit ? (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-400 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                ✓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-montserrat font-black text-[10px] text-emerald-950 uppercase tracking-wider bg-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Student-Controlled Product (₹999)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    Study Progress Index
                  </span>
                </div>
                <h3 className="font-cinzel font-bold text-lg text-emerald-950 mt-1">
                  Self-Study Tracker (Interactive Edit Mode Active)
                </h3>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  You have direct control to update your progress: select status for lectures, 1st detailed reading, chapter test, mock tests, all 5 revision cycles, and add personal remarks.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3 py-1.5 bg-white text-emerald-800 rounded-xl text-xs font-montserrat font-bold border border-emerald-200 shadow-xs">
                ✏️ Student Edit: Enabled
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border-2 border-[#C8A45D] rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#FFE3A0] flex items-center justify-center font-bold text-xl shrink-0 border border-[#C8A45D]/40 shadow-sm">
                🔒
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-montserrat font-bold text-[10px] text-[#8A651E] uppercase tracking-wider bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-[#C8A45D]/30">
                    Preview Mode (View-Only)
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-700">
                    CS Study Progress Index (₹999)
                  </span>
                </div>
                <h3 className="font-cinzel font-bold text-lg text-[#1C1917] mt-1">
                  Syllabus Outline Preview: {profile.program} ({profile.group})
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                  You are viewing the official ICSI syllabus index in read-only preview mode. Purchase the ₹999 CS Study Progress Index to unlock interactive checkboxes, live lecture tracking, chapter tests, 5 revision cycles, and personal notes.
                </p>
              </div>
            </div>
            {onPurchaseStudyIndex && (
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={onPurchaseStudyIndex}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl shadow cursor-pointer uppercase tracking-wider"
                >
                  Unlock Index for ₹999
                </button>
              </div>
            )}
          </div>
        )
      ) : !isAdmin ? (
        <div className="bg-gradient-to-r from-amber-50 via-[#FAF7F2] to-amber-100/70 border-2 border-[#C8A45D]/60 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1C1917] text-[#FFE3A0] flex items-center justify-center font-bold text-xl shrink-0 border border-[#C8A45D]/40 shadow-sm">
              🔒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-montserrat font-bold text-[10px] text-[#8A651E] uppercase tracking-wider bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-[#C8A45D]/30">
                  Mentorship Course
                </span>
                <span className="text-xs font-mono font-bold text-gray-700">
                  Strictly View Only
                </span>
              </div>
              <h3 className="font-cinzel font-bold text-lg text-[#1C1917] mt-1">
                Admin-Controlled Mentorship Tracker
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                As part of your 1-on-1 Mentorship with Harkiran Kaur (AIR 3), your progress, test reviews, and revision milestones are audited and updated by your mentor during monthly calls.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#1C1917] text-[#FFE3A0] rounded-xl text-xs font-montserrat font-bold border border-[#C8A45D]/40 shadow-xs">
              🔒 Student View-Only
            </span>
          </div>
        </div>
      ) : null}

      {/* Program & Group Enrolled Identity Card */}
      <div className="bg-white border border-[#C8A45D]/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#1C1917] text-[#FFE3A0] text-xs font-cinzel font-bold rounded-xl border border-[#C8A45D]/40 tracking-wider">
                {profile.program}
              </span>
              <span className="px-3 py-1 bg-amber-500/15 text-[#8A651E] text-xs font-montserrat font-bold rounded-xl border border-[#C8A45D]/30">
                {profile.level}
              </span>
              <span className="px-3 py-1 bg-emerald-500/15 text-emerald-800 text-xs font-montserrat font-bold rounded-xl border border-emerald-500/30">
                {profile.group === 'General' ? 'Single Group' : profile.group}
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-mono font-semibold rounded-lg">
                Attempt: {profile.targetAttempt}
              </span>
            </div>

            <h2 className="font-cinzel text-2xl font-bold text-[#1C1917] tracking-tight">
              {profile.program} — {profile.group === 'General' ? 'Syllabus Tracker' : `${profile.group} Mentorship Tracker`}
            </h2>

            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
              Strictly configured for your enrolled program and group. You have verified line-by-line coverage access with verified ICSI pattern checkpoints and amendments.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-3.5 min-w-[120px] text-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-montserrat">
                Total Chapters
              </div>
              <div className="text-xl font-cinzel font-black text-[#1C1917]">
                {profile.trackerRows.length}
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-3.5 min-w-[120px] text-center">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-montserrat">
                Detailed Reading
              </div>
              <div className="text-xl font-cinzel font-black text-emerald-700">
                {completedChaptersCount}/{profile.trackerRows.length}
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 min-w-[120px] text-center">
              <div className="text-[10px] text-rose-700 font-bold uppercase tracking-wider font-montserrat flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-rose-600" />
                <span>Red Marked</span>
              </div>
              <div className="text-xl font-cinzel font-black text-rose-700">
                {redMarkedCount}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: WHAT IS INCLUDED IN MONTHLY MENTORSHIP */}
        <div className="bg-gradient-to-br from-[#FAF7F2] via-white to-[#F6F2EA] border border-[#C8A45D]/50 rounded-3xl p-6 sm:p-7 shadow-inner space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#8A651E]" />
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C1917]">
                  What is Included in Your Monthly Mentorship
                </h3>
              </div>
              <p className="text-xs text-gray-600">
                Exclusive 25-Seat Personal Guidance Architecture curated by <strong>Harkiran Kaur (AIR 3)</strong>
              </p>
            </div>
            <span className="px-3 py-1 bg-[#C8A45D] text-black font-montserrat font-black text-xs rounded-xl shadow-sm">
              4 Mentor Calls Every Month
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Call 1 */}
            <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-[#8A651E] font-black text-xs flex items-center justify-center font-cinzel border border-[#C8A45D]/40">
                1
              </div>
              <h4 className="font-montserrat font-bold text-xs text-[#1C1917]">
                Personal Syllabus Tracking
              </h4>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li>• Track syllabus completion pace</li>
                <li>• Identify pending chapters & backlogs</li>
                <li>• Review preparation progress</li>
                <li>• Set targets accordingly</li>
              </ul>
            </div>

            {/* Call 2 */}
            <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <div className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-800 font-black text-xs flex items-center justify-center font-cinzel border border-blue-500/40">
                2
              </div>
              <h4 className="font-montserrat font-bold text-xs text-[#1C1917]">
                Study & Progress Mentorship
              </h4>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li>• Discuss daily study progress & routine</li>
                <li>• Review consistency & daily logs</li>
                <li>• Fine-tune preparation strategy</li>
                <li>• Optimize notes & bare act keywords</li>
              </ul>
            </div>

            {/* Call 3 */}
            <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-800 font-black text-xs flex items-center justify-center font-cinzel border border-emerald-500/40">
                3
              </div>
              <h4 className="font-montserrat font-bold text-xs text-[#1C1917]">
                Performance & Revision Review
              </h4>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li>• Review chapter-wise test evaluations</li>
                <li>• Scrutinize step-marking & presentation</li>
                <li>• Identify weak areas & conceptual gaps</li>
                <li>• Re-test improvement roadmap</li>
              </ul>
            </div>

            {/* Call 4 */}
            <div className="bg-white border border-[#EADBCE] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2">
              <div className="w-7 h-7 rounded-xl bg-rose-500/15 text-rose-800 font-black text-xs flex items-center justify-center font-cinzel border border-rose-500/40">
                4
              </div>
              <h4 className="font-montserrat font-bold text-xs text-[#1C1917]">
                Anxiety Relief / Support Call
              </h4>
              <ul className="text-[11px] text-gray-600 space-y-1">
                <li>• Direct 1-on-1 calming mentorship</li>
                <li>• Support whenever feeling anxious or panicked</li>
                <li>• Mental stamina & focus recovery</li>
                <li>• Can be scheduled whenever required</li>
              </ul>
            </div>
          </div>

          {/* Additional Benefits Bar */}
          <div className="pt-3 border-t border-[#EADBCE] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-montserrat font-bold text-[#8A651E] uppercase tracking-wider text-[11px]">
              Additional Mentorship Inclusions:
            </span>
            <div className="flex flex-wrap items-center gap-3 text-gray-700 text-[11px]">
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <Check className="w-3 h-3 text-[#8A651E]" /> 1-on-1 Mentor Guidance & Strategy Reviews
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <Check className="w-3 h-3 text-[#8A651E]" /> Personal syllabus tracking
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <Check className="w-3 h-3 text-[#8A651E]" /> Regular accountability
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <Check className="w-3 h-3 text-[#8A651E]" /> 4 mentor calls every month
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-[#EADBCE]">
                <Check className="w-3 h-3 text-[#8A651E]" /> Anxiety-relief/support on demand
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 & 3: STUDENT MENTORSHIP TRACKER TABLE (With Red Marking System & Amendment Column) */}
      <div className="bg-white border border-[#C8A45D]/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#8A651E]" />
              <h3 className="font-cinzel text-xl font-bold text-[#1C1917]">
                Student Mentorship Preparation Tracker
              </h3>
            </div>
            <p className="text-xs text-gray-600 pt-0.5">
              {isAdmin
                ? 'Admin: Click Chapter No or Topic to toggle RED highlight. Click statuses to cycle values.'
                : 'Strictly View-Only: Progress updated by Harkiran Kaur and evaluation panel.'}
            </p>
          </div>

          {/* Search & Subject filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              placeholder="Search chapter or topic..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#C8A45D] w-48"
            />
            {subjectsList.length > 1 && (
              <select
                value={activeSubjectFilter}
                onChange={(e) => setActiveSubjectFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#C8A45D] bg-white cursor-pointer"
              >
                <option value="all">All Subjects ({profile.trackerRows.length})</option>
                {subjectsList.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Legend & Admin Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EADBCE]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-[#8A651E] font-montserrat">Status & Highlight Legend:</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 bg-rose-600 rounded-full inline-block animate-pulse" />
              <span className="font-bold text-rose-700">Red Highlight</span> = High Priority / Weak Area (Admin Option)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full inline-block" />
              <span className="font-semibold text-emerald-800">Completed</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block" />
              <span className="font-semibold text-amber-900">Working</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 bg-gray-400 rounded-full inline-block" />
              <span>Pending (All Default)</span>
            </span>
            {isAdmin && (
              <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px]">
                ⚡ Admin Edit: Use dropdown in each cell to change status directly
              </span>
            )}
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Group Index Switcher */}
              <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-xl px-2 py-1 text-[11px]">
                <span className="font-bold text-gray-500 font-montserrat">Index:</span>
                <select
                  value={
                    profile.program === 'CS EET'
                      ? 'cseet'
                      : profile.program === 'CS Executive'
                      ? profile.group === 'Group 1'
                        ? 'exec-g1'
                        : profile.group === 'Group 2'
                        ? 'exec-g2'
                        : 'exec-both'
                      : profile.group === 'Group 1'
                      ? 'prof-g1'
                      : profile.group === 'Group 2'
                      ? 'prof-g2'
                      : 'prof-both'
                  }
                  onChange={(e) => handleReassignGroup(e.target.value)}
                  className="bg-transparent font-semibold text-gray-800 outline-none cursor-pointer"
                  title="Admin: Switch student's group-wise index"
                >
                  <option value="cseet">CS EET (All 4 Papers)</option>
                  <option value="exec-g1">CS Exec Group 1 (Paper 1-4)</option>
                  <option value="exec-g2">CS Exec Group 2 (Paper 5-7)</option>
                  <option value="exec-both">CS Exec Both Groups (Paper 1-7)</option>
                  <option value="prof-g1">CS Prof Group 1 (Paper 1-4)</option>
                  <option value="prof-g2">CS Prof Group 2 (Paper 5-7)</option>
                  <option value="prof-both">CS Prof Both Groups (Paper 1-7)</option>
                </select>
              </div>

              <button
                onClick={handleSyncOfficialSyllabus}
                className="px-2.5 py-1.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl font-montserrat font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                title="Update index to the latest official ICSI syllabus while preserving all student amendments & progress"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#8A651E]" />
                Update / Sort Syllabus
              </button>

              <button
                onClick={() => {
                  setIsUploadingIndex(true);
                  setUploadedParsedRows(profile.trackerRows || null);
                  setSelectedPresetGroup(profile.assignedIndexId || 'exec-g1');
                  setUploadError('');
                }}
                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#8A651E] border border-[#C8A45D]/50 rounded-xl font-montserrat font-bold text-[11px] flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                title="Upload custom syllabus file or choose official ICSI index presets"
              >
                <Upload className="w-3.5 h-3.5 text-[#C8A45D]" />
                Upload Index
              </button>

              <button
                onClick={handleResetAllToPending}
                className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl font-montserrat font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                title="Admin: Mark all chapters and revision columns as Pending"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Change All to Pending</span>
              </button>

              <button
                onClick={handleMarkAllToCompleted}
                className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl font-montserrat font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                title="Admin: Mark all chapters and revision columns as Completed"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Change All to Completed</span>
              </button>

              <button
                onClick={() => setIsAddingRow(true)}
                className="px-3 py-1.5 bg-[#C8A45D] hover:bg-[#b5924d] text-black rounded-xl font-montserrat font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Chapter
              </button>
            </div>
          )}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
          <table className="w-full text-left text-xs border-collapse min-w-[1400px]">
            <thead>
              <tr className="bg-[#1C1917] text-white font-montserrat font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 border-r border-white/10 sticky left-0 bg-[#1C1917] z-10 w-28">
                  Chapter No.
                </th>
                <th className="py-3 px-4 border-r border-white/10 w-80">
                  Topic
                </th>
                <th className="py-3 px-3 border-r border-white/10 text-center w-28">
                  Lectures
                </th>
                <th className="py-3 px-3 border-r border-white/10 text-center w-36">
                  1st Detailed Reading
                </th>
                <th className="py-3 px-3 border-r border-white/10 text-center w-36">
                  Chapter-wise Test
                </th>
                <th className="py-3 px-3 border-r border-white/10 text-center w-28">
                  1st Mock Test
                </th>
                <th className="py-3 px-3 border-r border-white/10 text-center w-28">
                  2nd Mock Test
                </th>
                <th className="py-3 px-2 border-r border-white/10 text-center w-20">
                  5th Rev
                </th>
                <th className="py-3 px-2 border-r border-white/10 text-center w-20">
                  4th Rev
                </th>
                <th className="py-3 px-2 border-r border-white/10 text-center w-20">
                  3rd Rev
                </th>
                <th className="py-3 px-2 border-r border-white/10 text-center w-20">
                  2nd Rev
                </th>
                <th className="py-3 px-2 border-r border-white/10 text-center w-20">
                  1st Rev
                </th>
                <th className="py-3 px-4 border-r border-white/10 w-64">
                  {isStudyProgressIndex ? 'My Notes / Remarks' : 'Admin Remarks'}
                </th>
                {canEdit && (
                  <th className="py-3 px-3 text-center w-28 bg-[#2A231C]">
                    {isAdmin ? 'Admin Action' : 'Edit Progress'}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 14 : 13} className="py-8 text-center text-gray-500 text-xs">
                    No chapters match the selected search/filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => {
                  const prevRow = index > 0 ? filteredRows[index - 1] : null;
                  const isNewSubject =
                    !prevRow ||
                    prevRow.subjectName !== row.subjectName ||
                    prevRow.subjectCode !== row.subjectCode;

                  // Compute summary statistics for this subject
                  const subjectRows = profile.trackerRows.filter(
                    (r) =>
                      (row.subjectName && r.subjectName === row.subjectName) ||
                      (row.subjectCode && r.subjectCode === row.subjectCode)
                  );
                  const subjectTotal = subjectRows.length;
                  const subjectCompletedReading = subjectRows.filter(
                    (r) => r.firstDetailedReading === 'Completed'
                  ).length;
                  const subjectCompletedTests = subjectRows.filter(
                    (r) => r.chapterWiseTest === 'Completed'
                  ).length;

                  const getStatusBadge = (val: string) => {
                    const str = (val || '').toLowerCase().trim();
                    if (str === 'completed' || str === 'done' || str.includes('evaluated')) {
                      return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
                    }
                    if (str === 'working' || str === 'in progress' || str === 'scheduled') {
                      return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                    }
                    if (str === 'n/a') {
                      return 'bg-gray-100 text-gray-400 border-gray-200';
                    }
                    return 'bg-gray-100 text-gray-600 border-gray-200 font-medium';
                  };

                  return (
                    <React.Fragment key={row.id}>
                      {/* SUBJECT NAME HEADER ROW (Shows before starting with other subject's chapters) */}
                      {isNewSubject && (
                        <tr className="border-t-4 border-t-[#C8A45D]">
                          <td
                            colSpan={isAdmin ? 15 : 14}
                            className="p-0 sticky left-0 z-20 shadow-sm"
                          >
                            <div className="bg-gradient-to-r from-[#1C1814] via-[#2D241C] to-[#1C1814] text-white px-4 py-3 border-b-2 border-[#C8A45D]/40 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E6C987] to-[#C8A45D] text-black flex items-center justify-center shadow shrink-0">
                                  <BookOpen className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-montserrat font-black uppercase tracking-wider bg-[#C8A45D]/25 text-[#FFE29C] px-2.5 py-0.5 rounded border border-[#C8A45D]/50 shadow-xs">
                                      {row.subjectCode || 'Subject'}
                                    </span>
                                    <span className="text-[11px] text-gray-300 font-medium hidden sm:inline">
                                      Official ICSI Syllabus
                                    </span>
                                  </div>
                                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-white tracking-wide mt-0.5">
                                    {row.subjectName}
                                  </h4>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-[11px] font-montserrat">
                                <span className="bg-white/10 px-3 py-1 rounded-xl text-gray-200 border border-white/15 font-semibold">
                                  <strong className="text-white">{subjectTotal}</strong> Chapters
                                </span>
                                <span className="bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-xl border border-emerald-500/40 font-semibold">
                                  <strong className="text-emerald-200">{subjectCompletedReading}</strong> / {subjectTotal} Reading Done
                                </span>
                                <span className="bg-amber-950/80 text-amber-200 px-3 py-1 rounded-xl border border-amber-500/40 font-semibold">
                                  <strong className="text-amber-100">{subjectCompletedTests}</strong> / {subjectTotal} Tests Done
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      <tr
                        className={`hover:bg-[#FAF8F5] transition-colors ${
                          row.isChapterRed || row.isTopicRed ? 'bg-rose-50/30' : ''
                        }`}
                      >
                      {/* Chapter No. (RED MARKING OPTION) */}
                      <td
                        className={`py-3 px-3 border-r border-gray-100 sticky left-0 z-10 font-montserrat ${
                          row.isChapterRed
                            ? 'bg-rose-100 text-rose-800 font-black shadow-inner border-l-4 border-l-rose-600'
                            : 'bg-white text-gray-900 font-bold'
                        }`}
                      >
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={row.isChapterRed ? 'text-rose-800 font-black' : 'text-gray-900'}>
                              {row.chapterNo}
                            </span>
                            {row.isChapterRed && (
                              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                            )}
                          </div>
                          {canEdit && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleChapterRed(row.id);
                              }}
                              className={`text-[9px] px-1.5 py-0.5 rounded font-montserrat font-bold transition-all cursor-pointer ${
                                row.isChapterRed
                                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700 border border-gray-200'
                              }`}
                              title={isAdmin ? "Admin: Click to toggle Chapter No in RED" : "Toggle chapter doubt / high-yield marker in RED"}
                            >
                              {row.isChapterRed ? '🔴 Marked Red' : '⚪ Turn Red'}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Topic (RED MARKING OPTION & AMENDMENT) */}
                      <td
                        className={`py-3 px-4 border-r border-gray-100 text-gray-800 ${
                          row.isTopicRed
                            ? 'text-rose-700 font-bold bg-rose-50/70 border-l-2 border-l-rose-500'
                            : 'font-normal'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              {row.isTopicRed && (
                                <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0 fill-rose-100" />
                              )}
                              <span className={row.isTopicRed ? 'font-bold text-rose-800' : 'text-gray-900'}>
                                {row.topic}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] text-gray-500 font-medium">
                                {row.subjectName}
                              </span>
                              {row.amendment &&
                                row.amendment.trim() !== '' &&
                                row.amendment.toLowerCase() !== 'no amendment' && (
                                  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-semibold">
                                    <span>Amd: {row.amendment}</span>
                                  </span>
                                )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  setEditingAmendmentRow({
                                    id: row.id,
                                    chapterNo: row.chapterNo,
                                    topic: row.topic,
                                    amendment: row.amendment || '',
                                  })
                                }
                                className="p-1 hover:bg-amber-100 text-gray-500 hover:text-amber-900 rounded transition-colors cursor-pointer"
                                title="Admin: Write / Edit Amendment manually"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {canEdit && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTopicRed(row.id);
                                }}
                                className={`text-[9px] px-2 py-0.5 rounded-full font-montserrat font-bold shrink-0 transition-all cursor-pointer ${
                                  row.isTopicRed
                                    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700 border border-gray-200'
                                }`}
                                title={isAdmin ? "Admin: Click to toggle Topic in RED" : "Toggle topic doubt / high-priority in RED"}
                              >
                                {row.isTopicRed ? '🔥 Topic Red' : '🔴 Turn Red'}
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Lectures */}
                      <td className="py-2 px-1.5 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.lectures)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'lectures', e.target.value as any);
                            }}
                            className={`w-full max-w-[95px] px-1.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer outline-none shadow-xs ${getStatusBadge(
                              row.lectures
                            )}`}
                            title="Update Lectures status"
                          >
                            <option value="Pending" className="bg-white text-gray-700 font-semibold">⏳ Pending</option>
                            <option value="Working" className="bg-white text-amber-800 font-bold">⚡ Working</option>
                            <option value="Completed" className="bg-white text-emerald-800 font-bold">✓ Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] border transition-colors ${getStatusBadge(
                              row.lectures
                            )}`}
                          >
                            {formatStatusDisplay(row.lectures)}
                          </span>
                        )}
                      </td>

                      {/* 1st Detailed Reading */}
                      <td className="py-2 px-1.5 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.firstDetailedReading)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'firstDetailedReading', e.target.value as any);
                            }}
                            className={`w-full max-w-[95px] px-1.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer outline-none shadow-xs ${getStatusBadge(
                              row.firstDetailedReading
                            )}`}
                            title="Update 1st Reading status"
                          >
                            <option value="Pending" className="bg-white text-gray-700 font-semibold">⏳ Pending</option>
                            <option value="Working" className="bg-white text-amber-800 font-bold">⚡ Working</option>
                            <option value="Completed" className="bg-white text-emerald-800 font-bold">✓ Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] border transition-colors ${getStatusBadge(
                              row.firstDetailedReading
                            )}`}
                          >
                            {formatStatusDisplay(row.firstDetailedReading)}
                          </span>
                        )}
                      </td>

                      {/* Chapter-wise Test */}
                      <td className="py-2 px-1.5 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.chapterWiseTest)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'chapterWiseTest', e.target.value as any);
                            }}
                            className={`w-full max-w-[95px] px-1.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer outline-none shadow-xs ${getStatusBadge(
                              row.chapterWiseTest
                            )}`}
                            title="Update Chapter Test status"
                          >
                            <option value="Pending" className="bg-white text-gray-700 font-semibold">⏳ Pending</option>
                            <option value="Working" className="bg-white text-amber-800 font-bold">⚡ Working</option>
                            <option value="Completed" className="bg-white text-emerald-800 font-bold">✓ Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] border transition-colors ${getStatusBadge(
                              row.chapterWiseTest
                            )}`}
                          >
                            {formatStatusDisplay(row.chapterWiseTest)}
                          </span>
                        )}
                      </td>

                      {/* 1st Mock Test */}
                      <td className="py-2 px-1.5 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.firstMockTest)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'firstMockTest', e.target.value as any);
                            }}
                            className={`w-full max-w-[95px] px-1.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer outline-none shadow-xs ${getStatusBadge(
                              row.firstMockTest
                            )}`}
                            title="Update 1st Mock Test status"
                          >
                            <option value="Pending" className="bg-white text-gray-700 font-semibold">⏳ Pending</option>
                            <option value="Working" className="bg-white text-amber-800 font-bold">⚡ Working</option>
                            <option value="Completed" className="bg-white text-emerald-800 font-bold">✓ Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] border transition-colors ${getStatusBadge(
                              row.firstMockTest
                            )}`}
                          >
                            {formatStatusDisplay(row.firstMockTest)}
                          </span>
                        )}
                      </td>

                      {/* 2nd Mock Test */}
                      <td className="py-2 px-1.5 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.secondMockTest)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'secondMockTest', e.target.value as any);
                            }}
                            className={`w-full max-w-[95px] px-1.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer outline-none shadow-xs ${getStatusBadge(
                              row.secondMockTest
                            )}`}
                            title="Update 2nd Mock Test status"
                          >
                            <option value="Pending" className="bg-white text-gray-700 font-semibold">⏳ Pending</option>
                            <option value="Working" className="bg-white text-amber-800 font-bold">⚡ Working</option>
                            <option value="Completed" className="bg-white text-emerald-800 font-bold">✓ Completed</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] border transition-colors ${getStatusBadge(
                              row.secondMockTest
                            )}`}
                          >
                            {formatStatusDisplay(row.secondMockTest)}
                          </span>
                        )}
                      </td>

                      {/* 5th Revision */}
                      <td className="py-2 px-1 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.fifthRevision)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'fifthRevision', e.target.value as any);
                            }}
                            className={`w-full px-1 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer outline-none ${getStatusBadge(
                              row.fifthRevision
                            )}`}
                            title="Update 5th Rev status"
                          >
                            <option value="Pending" className="bg-white text-gray-700">⏳ Pend</option>
                            <option value="Working" className="bg-white text-amber-800">⚡ Work</option>
                            <option value="Completed" className="bg-white text-emerald-800">✓ Done</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] border transition-colors ${getStatusBadge(
                              row.fifthRevision
                            )}`}
                          >
                            {formatStatusDisplay(row.fifthRevision)}
                          </span>
                        )}
                      </td>

                      {/* 4th Revision */}
                      <td className="py-2 px-1 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.fourthRevision)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'fourthRevision', e.target.value as any);
                            }}
                            className={`w-full px-1 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer outline-none ${getStatusBadge(
                              row.fourthRevision
                            )}`}
                            title="Update 4th Rev status"
                          >
                            <option value="Pending" className="bg-white text-gray-700">⏳ Pend</option>
                            <option value="Working" className="bg-white text-amber-800">⚡ Work</option>
                            <option value="Completed" className="bg-white text-emerald-800">✓ Done</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] border transition-colors ${getStatusBadge(
                              row.fourthRevision
                            )}`}
                          >
                            {formatStatusDisplay(row.fourthRevision)}
                          </span>
                        )}
                      </td>

                      {/* 3rd Revision */}
                      <td className="py-2 px-1 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.thirdRevision)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'thirdRevision', e.target.value as any);
                            }}
                            className={`w-full px-1 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer outline-none ${getStatusBadge(
                              row.thirdRevision
                            )}`}
                            title="Update 3rd Rev status"
                          >
                            <option value="Pending" className="bg-white text-gray-700">⏳ Pend</option>
                            <option value="Working" className="bg-white text-amber-800">⚡ Work</option>
                            <option value="Completed" className="bg-white text-emerald-800">✓ Done</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] border transition-colors ${getStatusBadge(
                              row.thirdRevision
                            )}`}
                          >
                            {formatStatusDisplay(row.thirdRevision)}
                          </span>
                        )}
                      </td>

                      {/* 2nd Revision */}
                      <td className="py-2 px-1 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.secondRevision)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'secondRevision', e.target.value as any);
                            }}
                            className={`w-full px-1 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer outline-none ${getStatusBadge(
                              row.secondRevision
                            )}`}
                            title="Update 2nd Rev status"
                          >
                            <option value="Pending" className="bg-white text-gray-700">⏳ Pend</option>
                            <option value="Working" className="bg-white text-amber-800">⚡ Work</option>
                            <option value="Completed" className="bg-white text-emerald-800">✓ Done</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] border transition-colors ${getStatusBadge(
                              row.secondRevision
                            )}`}
                          >
                            {formatStatusDisplay(row.secondRevision)}
                          </span>
                        )}
                      </td>

                      {/* 1st Revision */}
                      <td className="py-2 px-1 border-r border-gray-100 text-center">
                        {canEdit ? (
                          <select
                            value={formatStatusDisplay(row.firstRevision)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSetStatus(row.id, 'firstRevision', e.target.value as any);
                            }}
                            className={`w-full px-1 py-1 rounded text-[9px] font-bold border transition-colors cursor-pointer outline-none ${getStatusBadge(
                              row.firstRevision
                            )}`}
                            title="Update 1st Rev status"
                          >
                            <option value="Pending" className="bg-white text-gray-700">⏳ Pend</option>
                            <option value="Working" className="bg-white text-amber-800">⚡ Work</option>
                            <option value="Completed" className="bg-white text-emerald-800">✓ Done</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[9px] border transition-colors ${getStatusBadge(
                              row.firstRevision
                            )}`}
                          >
                            {formatStatusDisplay(row.firstRevision)}
                          </span>
                        )}
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4 border-r border-gray-100 text-gray-700 text-xs italic">
                        {canEdit ? (
                          <input
                            type="text"
                            placeholder={isStudyProgressIndex ? "Add study note / doubt..." : "Admin note..."}
                            value={row.remarks || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updatedRows = profile.trackerRows.map((r) =>
                                r.id === row.id ? { ...r, remarks: val } : r
                              );
                              persistChange({ ...profile, trackerRows: updatedRows });
                            }}
                            className="w-full text-xs p-1.5 bg-white border border-gray-200 rounded-lg focus:border-[#C8A45D] outline-none not-italic"
                          />
                        ) : (
                          <span>{row.remarks || '—'}</span>
                        )}
                      </td>

                      {/* Row Actions */}
                      {canEdit && (
                        <td className="py-3 px-3 text-center bg-gray-50">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingRow(row)}
                              className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors cursor-pointer"
                              title="Edit Chapter / Preparation Status"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteRow(row.id)}
                                className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition-colors cursor-pointer"
                                title="Delete Chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  </React.Fragment>
                );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5: MENTORSHIP INDEX & SECTION 6: 12-MONTH MENTORSHIP INDEX (CS Mentorship Program Only) */}
      {!isStudyProgressIndex && (
        <>
          <div id="mentorship-index" className="bg-white border border-[#C8A45D]/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-500/10 text-[#8A651E] rounded-xl border border-[#C8A45D]/30">
                <Calendar className="w-5 h-5" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1C1917]">
                    MENTORSHIP INDEX
                  </h2>
                  <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C8A45D]/20 text-[#8A651E] border border-[#C8A45D]/40">
                    {profile.program} — {profile.group}
                  </span>
                </div>
                <p className="text-xs text-gray-600 pt-1">
                  Enrolled Program & Group: <strong className="text-gray-900">{profile.program} ({profile.group}) — {profile.level}</strong>. 
                  {isAdmin
                    ? ' Admin Portal: You have full access to schedule, update call status, and record mentor diagnostic notes.'
                    : ' Student Portal: Strictly view-only. 48 1-on-1 personalized sessions across 12 months with Harkiran Kaur (AIR 3).'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Admin Switcher between 5 Indexes */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#EADBCE] rounded-xl px-2.5 py-1 text-xs">
                <span className="font-bold text-[#8A651E] text-[11px] font-montserrat">Index:</span>
                <select
                  value={
                    profile.program === 'CS EET'
                      ? 'cseet'
                      : profile.program === 'CS Executive'
                      ? profile.group === 'Group 1'
                        ? 'exec-g1'
                        : 'exec-g2'
                      : profile.group === 'Group 1'
                      ? 'prof-g1'
                      : 'prof-g2'
                  }
                  onChange={(e) => handleReassignGroup(e.target.value)}
                  className="bg-transparent font-semibold text-gray-800 text-xs outline-none cursor-pointer"
                  title="Admin: Switch between the 5 official program/group indexes"
                >
                  <option value="cseet">CS EET (Level 1)</option>
                  <option value="exec-g1">CS Executive — Group 1 (Level 2)</option>
                  <option value="exec-g2">CS Executive — Group 2 (Level 2)</option>
                  <option value="prof-g1">CS Professional — Group 1 (Level 3)</option>
                  <option value="prof-g2">CS Professional — Group 2 (Level 3)</option>
                </select>
              </div>
            )}

            {/* View Mode Toggle: Table vs Cards */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200 text-[11px] font-montserrat font-bold">
              <button
                onClick={() => setCallsViewMode('table')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  callsViewMode === 'table'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setCallsViewMode('cards')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  callsViewMode === 'cards'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Cards View
              </button>
            </div>

            <span className="text-xs font-montserrat font-bold text-gray-700 bg-[#FAF7F2] border border-[#EADBCE] px-3 py-1.5 rounded-xl">
              Annual: 48 Calls
            </span>
          </div>
        </div>

        {/* Access isolation notice */}
        <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-3.5 text-xs text-gray-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A651E] shrink-0" />
            <span>
              <strong>Program/Group Access Isolated:</strong> Only students enrolled in <strong>{profile.program} ({profile.group})</strong> can view this specific mentorship index.
            </span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-[#EADBCE] text-gray-500 shrink-0">
            {profile.assignedIndexId}
          </span>
        </div>

        {/* 12-MONTH MENTORSHIP INDEX TABLE VIEW: | Month | Mentorship 1 | Mentorship 2 | Mentorship 3 | Mentorship 4 | */}
        {callsViewMode === 'table' ? (
          <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#1C1917] text-white font-montserrat font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 border-r border-white/10 w-36 sticky left-0 bg-[#1C1917] z-10">
                    Month
                  </th>
                  <th className="py-3 px-4 border-r border-white/10 w-1/4">
                    Mentorship 1
                    <span className="block text-[9px] font-normal normal-case text-amber-200/90 pt-0.5">
                      Personal Syllabus Tracking
                    </span>
                  </th>
                  <th className="py-3 px-4 border-r border-white/10 w-1/4">
                    Mentorship 2
                    <span className="block text-[9px] font-normal normal-case text-amber-200/90 pt-0.5">
                      Study & Progress Mentorship
                    </span>
                  </th>
                  <th className="py-3 px-4 border-r border-white/10 w-1/4">
                    Mentorship 3
                    <span className="block text-[9px] font-normal normal-case text-amber-200/90 pt-0.5">
                      Performance & Revision Review
                    </span>
                  </th>
                  <th className="py-3 px-4 w-1/4">
                    Mentorship 4
                    <span className="block text-[9px] font-normal normal-case text-amber-200/90 pt-0.5">
                      Anxiety Relief / Support Call
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {profile.monthlyCalls.map((mRecord) => (
                  <tr key={mRecord.month} className="hover:bg-[#FAF8F5] transition-colors">
                    {/* Month Cell */}
                    <td className="py-3.5 px-4 border-r border-gray-200 sticky left-0 bg-white z-10 font-cinzel font-bold text-gray-900 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8A651E]" />
                        <span>{mRecord.month}</span>
                      </div>
                    </td>

                    {/* Mentorship 1 */}
                    <td
                      onClick={() =>
                        isAdmin &&
                        setEditingCall({
                          month: mRecord.month,
                          callNum: 1,
                          callData: { ...mRecord.call1 },
                        })
                      }
                      className={`p-3 border-r border-gray-200 text-xs align-top transition-colors ${
                        mRecord.call1.status === 'Completed'
                          ? 'bg-emerald-50/40'
                          : mRecord.call1.status === 'Scheduled'
                          ? 'bg-amber-50/40'
                          : 'bg-white'
                      } ${isAdmin ? 'cursor-pointer hover:bg-[#FAF5E6]' : ''}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-montserrat font-bold text-[10px] text-gray-700">Call 1</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              mRecord.call1.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : mRecord.call1.status === 'Scheduled'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {mRecord.call1.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-gray-900">Personal Syllabus Tracking</div>
                        {mRecord.call1.date ? (
                          <div className="text-[10px] text-gray-600 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#8A651E]" />
                            <span>{mRecord.call1.date} {mRecord.call1.time || ''}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic">Date not scheduled</div>
                        )}
                        {mRecord.call1.notes && (
                          <p className="text-[10px] text-gray-600 italic line-clamp-2 bg-white/90 p-1.5 rounded border border-gray-200">
                            "{mRecord.call1.notes}"
                          </p>
                        )}
                        {isAdmin && (
                          <div className="pt-0.5 flex justify-end">
                            <span className="text-[9px] font-bold text-[#8A651E] flex items-center gap-0.5 hover:underline">
                              <Edit3 className="w-2.5 h-2.5" /> Edit
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Mentorship 2 */}
                    <td
                      onClick={() =>
                        isAdmin &&
                        setEditingCall({
                          month: mRecord.month,
                          callNum: 2,
                          callData: { ...mRecord.call2 },
                        })
                      }
                      className={`p-3 border-r border-gray-200 text-xs align-top transition-colors ${
                        mRecord.call2.status === 'Completed'
                          ? 'bg-emerald-50/40'
                          : mRecord.call2.status === 'Scheduled'
                          ? 'bg-amber-50/40'
                          : 'bg-white'
                      } ${isAdmin ? 'cursor-pointer hover:bg-[#FAF5E6]' : ''}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-montserrat font-bold text-[10px] text-gray-700">Call 2</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              mRecord.call2.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : mRecord.call2.status === 'Scheduled'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {mRecord.call2.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-gray-900">Study & Progress Mentorship</div>
                        {mRecord.call2.date ? (
                          <div className="text-[10px] text-gray-600 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#8A651E]" />
                            <span>{mRecord.call2.date} {mRecord.call2.time || ''}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic">Date not scheduled</div>
                        )}
                        {mRecord.call2.notes && (
                          <p className="text-[10px] text-gray-600 italic line-clamp-2 bg-white/90 p-1.5 rounded border border-gray-200">
                            "{mRecord.call2.notes}"
                          </p>
                        )}
                        {isAdmin && (
                          <div className="pt-0.5 flex justify-end">
                            <span className="text-[9px] font-bold text-[#8A651E] flex items-center gap-0.5 hover:underline">
                              <Edit3 className="w-2.5 h-2.5" /> Edit
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Mentorship 3 */}
                    <td
                      onClick={() =>
                        isAdmin &&
                        setEditingCall({
                          month: mRecord.month,
                          callNum: 3,
                          callData: { ...mRecord.call3 },
                        })
                      }
                      className={`p-3 border-r border-gray-200 text-xs align-top transition-colors ${
                        mRecord.call3.status === 'Completed'
                          ? 'bg-emerald-50/40'
                          : mRecord.call3.status === 'Scheduled'
                          ? 'bg-amber-50/40'
                          : 'bg-white'
                      } ${isAdmin ? 'cursor-pointer hover:bg-[#FAF5E6]' : ''}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-montserrat font-bold text-[10px] text-gray-700">Call 3</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              mRecord.call3.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : mRecord.call3.status === 'Scheduled'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {mRecord.call3.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-gray-900">Performance & Revision Review</div>
                        {mRecord.call3.date ? (
                          <div className="text-[10px] text-gray-600 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#8A651E]" />
                            <span>{mRecord.call3.date} {mRecord.call3.time || ''}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic">Date not scheduled</div>
                        )}
                        {mRecord.call3.notes && (
                          <p className="text-[10px] text-gray-600 italic line-clamp-2 bg-white/90 p-1.5 rounded border border-gray-200">
                            "{mRecord.call3.notes}"
                          </p>
                        )}
                        {isAdmin && (
                          <div className="pt-0.5 flex justify-end">
                            <span className="text-[9px] font-bold text-[#8A651E] flex items-center gap-0.5 hover:underline">
                              <Edit3 className="w-2.5 h-2.5" /> Edit
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Mentorship 4 */}
                    <td
                      onClick={() =>
                        isAdmin &&
                        setEditingCall({
                          month: mRecord.month,
                          callNum: 4,
                          callData: { ...mRecord.call4 },
                        })
                      }
                      className={`p-3 text-xs align-top transition-colors ${
                        mRecord.call4.status === 'Completed'
                          ? 'bg-emerald-50/40'
                          : mRecord.call4.status === 'Scheduled'
                          ? 'bg-amber-50/40'
                          : 'bg-white'
                      } ${isAdmin ? 'cursor-pointer hover:bg-[#FAF5E6]' : ''}`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-montserrat font-bold text-[10px] text-gray-700">Call 4</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              mRecord.call4.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : mRecord.call4.status === 'Scheduled'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {mRecord.call4.status}
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-gray-900">Anxiety Relief / Support Call</div>
                        {mRecord.call4.date ? (
                          <div className="text-[10px] text-gray-600 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#8A651E]" />
                            <span>{mRecord.call4.date} {mRecord.call4.time || ''}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic">Date not scheduled</div>
                        )}
                        {mRecord.call4.notes && (
                          <p className="text-[10px] text-gray-600 italic line-clamp-2 bg-white/90 p-1.5 rounded border border-gray-200">
                            "{mRecord.call4.notes}"
                          </p>
                        )}
                        {isAdmin && (
                          <div className="pt-0.5 flex justify-end">
                            <span className="text-[9px] font-bold text-[#8A651E] flex items-center gap-0.5 hover:underline">
                              <Edit3 className="w-2.5 h-2.5" /> Edit
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.monthlyCalls.map((mRecord) => (
              <div
                key={mRecord.month}
                className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#EADBCE]">
                  <h4 className="font-cinzel font-bold text-sm text-[#1C1917] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#8A651E]" />
                    <span>{mRecord.month}</span>
                  </h4>
                  <span className="text-[10px] font-montserrat font-bold text-[#8A651E] bg-white px-2 py-0.5 rounded-md border border-[#EADBCE]">
                    4 Calls
                  </span>
                </div>

                <div className="space-y-2">
                  {[
                    { num: 1 as const, call: mRecord.call1, label: 'Mentorship 1: Personal Syllabus Tracking' },
                    { num: 2 as const, call: mRecord.call2, label: 'Mentorship 2: Study & Progress Mentorship' },
                    { num: 3 as const, call: mRecord.call3, label: 'Mentorship 3: Performance & Revision Review' },
                    { num: 4 as const, call: mRecord.call4, label: 'Mentorship 4: Anxiety Relief / Support Call' },
                  ].map(({ num, call, label }) => {
                    const isDone = call.status === 'Completed';
                    const isScheduled = call.status === 'Scheduled';

                    return (
                      <div
                        key={num}
                        onClick={() =>
                          isAdmin &&
                          setEditingCall({
                            month: mRecord.month,
                            callNum: num,
                            callData: { ...call },
                          })
                        }
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-200'
                            : isScheduled
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-gray-200'
                        } ${isAdmin ? 'cursor-pointer hover:border-[#C8A45D]' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-montserrat font-bold text-[11px] text-[#1C1917]">
                            {label}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-800'
                                : isScheduled
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {call.status}
                          </span>
                        </div>

                        {call.date && (
                          <div className="text-[10px] text-gray-500 flex items-center gap-1 pt-1">
                            <Clock className="w-3 h-3 text-[#8A651E]" />
                            <span>{call.date} {call.time || ''}</span>
                          </div>
                        )}

                        {call.notes && (
                          <p className="text-[10px] text-gray-600 line-clamp-1 italic pt-0.5">
                            "{call.notes}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 7: WHAT IS INCLUDED IN MONTHLY MENTORSHIP */}
        <div className="mt-8 pt-8 border-t border-gray-200 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8A651E]" />
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#1C1917]">
              WHAT IS INCLUDED IN MONTHLY MENTORSHIP
            </h3>
          </div>

          {/* 4 Mentor Calls Every Month Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#1C1917] text-[#FFE3A0] font-cinzel font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="font-montserrat font-bold text-sm text-[#1C1917]">
                  Personal Syllabus Tracking
                </h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Track the student's syllabus completion.</li>
                <li>Identify pending chapters/backlogs.</li>
                <li>Review preparation progress.</li>
                <li>Set targets accordingly.</li>
              </ul>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#1C1917] text-[#FFE3A0] font-cinzel font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="font-montserrat font-bold text-sm text-[#1C1917]">
                  Study & Progress Mentorship
                </h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Discuss study progress.</li>
                <li>Review consistency and preparation strategy.</li>
                <li>Monitor daily hours & routines.</li>
                <li>Address study hurdles immediately.</li>
              </ul>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#1C1917] text-[#FFE3A0] font-cinzel font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="font-montserrat font-bold text-sm text-[#1C1917]">
                  Performance & Revision Review
                </h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Review tests, revision and preparation.</li>
                <li>Identify weak areas and improvement points.</li>
                <li>Evaluate mock test papers & handwriting.</li>
                <li>Bare Act interpretation techniques.</li>
              </ul>
            </div>

            <div className="bg-[#FAF7F2] border border-[#EADBCE] rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-[#1C1917] text-[#FFE3A0] font-cinzel font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h4 className="font-montserrat font-bold text-sm text-[#1C1917]">
                  Anxiety Relief / Support Call
                </h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                <li>Support call whenever student feels anxious, panicked or overwhelmed.</li>
                <li>Can be taken whenever required.</li>
                <li>Mindset coaching and stress management.</li>
                <li>Unwavering moral and psychological support.</li>
              </ul>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="bg-[#1C1917] text-white rounded-2xl p-5 sm:p-6 space-y-3">
            <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#FFE3A0] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C8A45D]" />
              <span>Additional Program Benefits</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Unlimited WhatsApp Connect</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Personal syllabus tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Regular accountability</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>4 mentor calls every month</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Anxiety-relief/support on demand</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Overall Remarks Box */}
      <div className="bg-white border border-[#C8A45D]/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-lg font-bold text-[#1C1917] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#8A651E]" />
            <span>Mentor Feedback & Target Milestones</span>
          </h3>
          {isAdmin && (
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Admin Editable
            </span>
          )}
        </div>

        {isAdmin ? (
          <div className="space-y-3">
            <textarea
              rows={3}
              value={profile.adminOverallRemarks || ''}
              onChange={(e) =>
                setProfile({ ...profile, adminOverallRemarks: e.target.value })
              }
              placeholder="Add mentor overall notes, weekly targets, Bare Act guidance..."
              className="w-full p-3.5 text-xs border border-gray-300 rounded-2xl focus:outline-none focus:border-[#C8A45D] font-poppins"
            />
            <button
              onClick={() => persistChange(profile)}
              className="px-4 py-2 bg-[#1C1917] hover:bg-black text-[#FFE3A0] text-xs font-montserrat font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Mentor Feedback</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-700 leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCE]">
            {profile.adminOverallRemarks ||
              'Follow daily syllabus targets strictly. Attend all scheduled 4 mentor calls for personal evaluation.'}
          </p>
        )}
      </div>
        </>
      )}

      {/* MODAL: ADD CHAPTER (Admin Only) */}
      {isAdmin && isAddingRow && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#C8A45D] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold text-[#1C1917]">
              Add Chapter to Student Tracker
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Subject Name / Paper</label>
                <input
                  type="text"
                  placeholder="e.g. Paper 2: Company Law & Practice"
                  value={newRowData.subjectName}
                  onChange={(e) => setNewRowData({ ...newRowData, subjectName: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Chapter No.</label>
                  <input
                    type="text"
                    placeholder="e.g. Ch 14"
                    value={newRowData.chapterNo}
                    onChange={(e) => setNewRowData({ ...newRowData, chapterNo: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Amendment</label>
                  <input
                    type="text"
                    placeholder="e.g. 2026 MCA Rules"
                    value={newRowData.amendment}
                    onChange={(e) => setNewRowData({ ...newRowData, amendment: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Directors & KMP Appointment"
                  value={newRowData.topic}
                  onChange={(e) => setNewRowData({ ...newRowData, topic: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Admin Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. Important for June 2026"
                  value={newRowData.remarks}
                  onChange={(e) => setNewRowData({ ...newRowData, remarks: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setIsAddingRow(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewRow}
                className="px-5 py-2 bg-[#C8A45D] text-black rounded-xl text-xs font-bold font-montserrat"
              >
                Add Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CHAPTER */}
      {canEdit && editingRow && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#C8A45D] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold text-[#1C1917]">
              Edit Chapter: {editingRow.chapterNo} {isStudyProgressIndex ? '(Self-Study Update)' : ''}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Chapter No.</label>
                  <input
                    type="text"
                    value={editingRow.chapterNo}
                    onChange={(e) => setEditingRow({ ...editingRow, chapterNo: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Amendment</label>
                  <input
                    type="text"
                    value={editingRow.amendment}
                    onChange={(e) => setEditingRow({ ...editingRow, amendment: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Topic</label>
                <input
                  type="text"
                  value={editingRow.topic}
                  onChange={(e) => setEditingRow({ ...editingRow, topic: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  {isStudyProgressIndex ? 'My Study Notes / Remarks' : 'Admin Remarks'}
                </label>
                <input
                  type="text"
                  placeholder={isStudyProgressIndex ? "e.g. Completed notes, tricky illustration 4..." : "Admin remarks..."}
                  value={editingRow.remarks || ''}
                  onChange={(e) => setEditingRow({ ...editingRow, remarks: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              {/* Status Controls */}
              <div className="p-3 bg-amber-500/10 border border-[#C8A45D]/40 rounded-xl space-y-2">
                <div className="font-bold text-[#8A651E] text-xs font-montserrat">
                  Preparation Statuses ({isAdmin ? 'Admin Edit' : 'Self-Study Update'}):
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Lectures</label>
                    <select
                      value={formatStatusDisplay(editingRow.lectures)}
                      onChange={(e) => setEditingRow({ ...editingRow, lectures: e.target.value as any })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Working">⚡ Working</option>
                      <option value="Completed">✓ Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">1st Detailed Reading</label>
                    <select
                      value={formatStatusDisplay(editingRow.firstDetailedReading)}
                      onChange={(e) => setEditingRow({ ...editingRow, firstDetailedReading: e.target.value as any })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Working">⚡ Working</option>
                      <option value="Completed">✓ Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">Chapter-wise Test</label>
                    <select
                      value={formatStatusDisplay(editingRow.chapterWiseTest)}
                      onChange={(e) => setEditingRow({ ...editingRow, chapterWiseTest: e.target.value as any })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Working">⚡ Working</option>
                      <option value="Completed">✓ Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">1st Mock Test</label>
                    <select
                      value={formatStatusDisplay(editingRow.firstMockTest)}
                      onChange={(e) => setEditingRow({ ...editingRow, firstMockTest: e.target.value as any })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Working">⚡ Working</option>
                      <option value="Completed">✓ Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">2nd Mock Test</label>
                    <select
                      value={formatStatusDisplay(editingRow.secondMockTest)}
                      onChange={(e) => setEditingRow({ ...editingRow, secondMockTest: e.target.value as any })}
                      className="w-full p-1.5 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="Working">⚡ Working</option>
                      <option value="Completed">✓ Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Red Marking Toggles */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="font-bold text-gray-800">Red Marking Controls:</div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRow.isChapterRed}
                      onChange={(e) =>
                        setEditingRow({ ...editingRow, isChapterRed: e.target.checked })
                      }
                      className="accent-rose-600"
                    />
                    <span className="text-rose-700 font-bold">Mark Chapter No RED</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingRow.isTopicRed}
                      onChange={(e) =>
                        setEditingRow({ ...editingRow, isTopicRed: e.target.checked })
                      }
                      className="accent-rose-600"
                    />
                    <span className="text-rose-700 font-bold">Mark Topic RED</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setEditingRow(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditRow}
                className="px-5 py-2 bg-[#C8A45D] text-black rounded-xl text-xs font-bold font-montserrat"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT MENTORSHIP CALL (Admin Only) */}
      {isAdmin && editingCall && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#C8A45D] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="font-cinzel text-lg font-bold text-[#1C1917]">
              Update {editingCall.month} — Mentorship Call {editingCall.callNum}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Agenda</label>
                <input
                  type="text"
                  value={editingCall.callData.agenda}
                  onChange={(e) =>
                    setEditingCall({
                      ...editingCall,
                      callData: { ...editingCall.callData, agenda: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Status</label>
                  <select
                    value={editingCall.callData.status}
                    onChange={(e) =>
                      setEditingCall({
                        ...editingCall,
                        callData: {
                          ...editingCall.callData,
                          status: e.target.value as any,
                        },
                      })
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Rescheduled">Rescheduled</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Date & Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 15th Jan, 6:00 PM"
                    value={editingCall.callData.date || ''}
                    onChange={(e) =>
                      setEditingCall({
                        ...editingCall,
                        callData: { ...editingCall.callData, date: e.target.value },
                      })
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mentor Session Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record student backlogs, review notes, advice..."
                  value={editingCall.callData.notes || ''}
                  onChange={(e) =>
                    setEditingCall({
                      ...editingCall,
                      callData: { ...editingCall.callData, notes: e.target.value },
                    })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setEditingCall(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCall}
                className="px-5 py-2 bg-[#C8A45D] text-black rounded-xl text-xs font-bold font-montserrat"
              >
                Update Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD & CUSTOMIZE SYLLABUS INDEX (ADMIN ONLY) */}
      {isAdmin && isUploadingIndex && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#C8A45D] rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-amber-100 text-[#8A651E] font-bold text-[10px] rounded-full uppercase tracking-wider">
                    Admin Syllabus Index Manager
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    ID: {profile.studentId}
                  </span>
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#1C1917]">
                  Upload / Customize Syllabus Index for {profile.studentName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Students have view-only access in their portal. Any index changes or uploaded syllabus chapters publish directly to the student portal immediately.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsUploadingIndex(false);
                  setUploadedParsedRows(null);
                  setUploadError('');
                }}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs font-montserrat font-bold">
              <button
                onClick={() => setIndexUploadTab('preset')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  indexUploadTab === 'preset'
                    ? 'bg-[#1C1917] text-[#FFE3A0] shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                1. Official ICSI Presets
              </button>
              <button
                onClick={() => setIndexUploadTab('file')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  indexUploadTab === 'file'
                    ? 'bg-[#1C1917] text-[#FFE3A0] shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                2. Upload File (CSV / JSON)
              </button>
              <button
                onClick={() => setIndexUploadTab('text')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  indexUploadTab === 'text'
                    ? 'bg-[#1C1917] text-[#FFE3A0] shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                3. Paste Chapter Lines
              </button>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Tab 1: Official Preset */}
            {indexUploadTab === 'preset' && (
              <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-2xl border border-[#EADBCE]">
                <p className="text-xs text-gray-700 font-semibold">
                  Select an official ICSI syllabus preset:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleLoadPresetSyllabus('exec-g1')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPresetGroup === 'exec-g1'
                        ? 'border-[#C8A45D] bg-[#FFE3A0]/20 font-bold text-black shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-montserrat font-bold">CS Executive Group 1</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                      JIGL, Company Law, SBEC (4 Papers)
                    </div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetSyllabus('exec-g2')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPresetGroup === 'exec-g2'
                        ? 'border-[#C8A45D] bg-[#FFE3A0]/20 font-bold text-black shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-montserrat font-bold">CS Executive Group 2</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                      CMSL, ECIPL, Tax Laws (3 Papers)
                    </div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetSyllabus('exec-both')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPresetGroup === 'exec-both'
                        ? 'border-[#C8A45D] bg-[#FFE3A0]/20 font-bold text-black shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-montserrat font-bold">CS Executive Both Groups</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                      All 7 Papers complete syllabus
                    </div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetSyllabus('cseet')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPresetGroup === 'cseet'
                        ? 'border-[#C8A45D] bg-[#FFE3A0]/20 font-bold text-black shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-montserrat font-bold">CS EET (Level 1)</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                      Business Comm, Legal Aptitude, Economics
                    </div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetSyllabus('prof-g1')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPresetGroup === 'prof-g1'
                        ? 'border-[#C8A45D] bg-[#FFE3A0]/20 font-bold text-black shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-montserrat font-bold">CS Professional Group 1</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                      ESG, Drafting & Pleadings, Compliance
                    </div>
                  </button>

                  <button
                    onClick={() => handleLoadPresetSyllabus('prof-both')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPresetGroup === 'prof-both'
                        ? 'border-[#C8A45D] bg-[#FFE3A0]/20 font-bold text-black shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-montserrat font-bold">CS Professional Both Groups</div>
                    <div className="text-[11px] text-gray-500 font-normal mt-0.5">
                      All Level 3 Papers complete syllabus
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Upload File (CSV / JSON) */}
            {indexUploadTab === 'file' && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    Upload Custom Syllabus File (.csv or .json)
                  </span>
                  <button
                    onClick={handleDownloadSampleCsv}
                    className="text-[11px] font-montserrat font-bold text-[#8A651E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C8A45D]" />
                    Download Sample CSV Template
                  </button>
                </div>

                <div className="border-2 border-dashed border-gray-300 hover:border-[#C8A45D] rounded-2xl p-6 text-center transition-colors bg-white">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Choose or drag a CSV or JSON file here
                  </p>
                  <p className="text-[11px] text-gray-500 mb-3">
                    Columns required in CSV: <code className="bg-gray-100 px-1 py-0.5 rounded">Subject,Chapter No,Topic Name,Amendment</code>
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1917] hover:bg-black text-[#FFE3A0] text-xs font-montserrat font-bold rounded-xl cursor-pointer shadow-xs">
                    <span>Select File</span>
                    <input
                      type="file"
                      accept=".csv,.json"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProcessUploadedFile(file);
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Tab 3: Paste Text */}
            {indexUploadTab === 'text' && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <p className="text-xs text-gray-700 font-semibold">
                  Paste chapter list line by line. Format: <code className="bg-white px-1 py-0.5 rounded border border-gray-200">Subject | Chapter No | Topic Name | Amendment</code>
                </p>
                <textarea
                  rows={6}
                  value={pastedIndexText}
                  onChange={(e) => setPastedIndexText(e.target.value)}
                  placeholder={`Company Law & Practice | Chapter 1 | General Meetings & Postal Ballot | Act 2024\nCompany Law & Practice | Chapter 2 | Board Powers & Resolutions | Standard\nSetting Up of Business | Chapter 1 | Types of Companies | Notification 12`}
                  className="w-full p-3 text-xs border border-gray-300 rounded-xl bg-white font-mono"
                />
                <button
                  onClick={handleParsePastedText}
                  className="px-4 py-2 bg-[#1C1917] hover:bg-black text-[#FFE3A0] text-xs font-montserrat font-bold rounded-xl cursor-pointer"
                >
                  Parse Chapters Text
                </button>
              </div>
            )}

            {/* Parsed Rows Preview */}
            <div className="flex-1 overflow-y-auto min-h-[140px] border border-gray-200 rounded-2xl bg-white p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-800">
                  {uploadedParsedRows ? (
                    <span className="text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {uploadedParsedRows.length} Chapters Ready to Publish
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Currently loaded: {profile.trackerRows?.length || 0} chapters in student tracker
                    </span>
                  )}
                </span>
                {uploadedParsedRows && (
                  <button
                    onClick={() => setUploadedParsedRows(null)}
                    className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                  >
                    Clear Preview
                  </button>
                )}
              </div>

              {uploadedParsedRows && uploadedParsedRows.length > 0 && (
                <div className="max-h-48 overflow-y-auto text-[11px] border border-gray-100 rounded-xl divide-y divide-gray-100">
                  {uploadedParsedRows.slice(0, 30).map((row, idx) => (
                    <div key={row.id || idx} className="py-1.5 px-2 flex items-center justify-between gap-2 hover:bg-gray-50">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-gray-800 w-24 shrink-0 truncate">{row.chapterNo}</span>
                        <span className="text-gray-700 truncate">{row.topic}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{row.subjectName}</span>
                        <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">{row.amendment}</span>
                      </div>
                    </div>
                  ))}
                  {uploadedParsedRows.length > 30 && (
                    <div className="p-2 text-center text-gray-500 text-[10px] font-semibold bg-gray-50">
                      + {uploadedParsedRows.length - 30} more chapters...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-[11px] text-gray-500">
                Changes take effect in student portal immediately without reload.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsUploadingIndex(false);
                    setUploadedParsedRows(null);
                    setUploadError('');
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyIndex}
                  disabled={!uploadedParsedRows || uploadedParsedRows.length === 0}
                  className="px-5 py-2 bg-gradient-to-r from-[#FFE3A0] via-[#C8A45D] to-[#DFB96E] hover:from-[#FFEFA6] hover:to-[#C8A45D] text-black font-montserrat font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish Index to Student Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
