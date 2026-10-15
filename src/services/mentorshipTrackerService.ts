/**
 * Mentorship tracker helpers (client).
 *
 * Tracker / call / index data is now in the DATABASE (students table). There is no localStorage
 * profile store — profiles are always built from students received from the server.
 */
import {
  MentorshipProgram,
  MentorshipLevel,
  MentorshipGroup,
  TrackerRow,
  StudentMentorshipProfile,
} from '../types/mentorship';
import {
  CURRENT_SYLLABUS_VERSION,
  createDefault12MonthCalls,
  buildTrackerRowsFromSyllabusGroup,
  generateDefaultChapters,
  resolveProgramAndGroup,
} from '../shared/tracker';
import {
  getAllStudents,
  getStudentById,
  getStudentByEmail,
  toMentorshipProfile,
  patchStudentInCache,
  updateStudentAccessDetails,
  refreshAdminData,
  CentralStudent,
} from './centralStudentDatabase';
import { reportSaveError, getActiveAdminSession } from '../lib/backend';

export {
  CURRENT_SYLLABUS_VERSION,
  createDefault12MonthCalls,
  buildTrackerRowsFromSyllabusGroup,
  generateDefaultChapters,
  resolveProgramAndGroup,
};

const ACTIVE_ADMIN_VIEW_KEY = 'hk_admin_viewing_student_id';

/**
 * Synchronizes any student's profile to the official sorted ICSI syllabus.
 * Preserves existing student progress/amendments where chapter number/topic match,
 * while ensuring all newly updated chapters are populated in 'Pending' status.
 */
export function syncProfileToOfficialSyllabus(
  profile: StudentMentorshipProfile,
  forceResetToPending: boolean = false
): StudentMentorshipProfile {
  const freshRows = generateDefaultChapters(profile.program, profile.group);

  let mergedRows: TrackerRow[];

  if (forceResetToPending || !profile.trackerRows || profile.trackerRows.length === 0) {
    mergedRows = freshRows;
  } else {
    // Preserve existing status/amendments by matching chapter number and topic/subject
    const existingMap = new Map<string, TrackerRow>();
    profile.trackerRows.forEach((r) => {
      const key1 = `${r.subjectName}_${r.chapterNo}`.toLowerCase();
      const key2 = `${r.chapterNo}_${r.topic}`.toLowerCase();
      const key3 = r.chapterNo.toLowerCase().trim();
      existingMap.set(key1, r);
      existingMap.set(key2, r);
      if (!existingMap.has(key3)) {
        existingMap.set(key3, r);
      }
    });

    mergedRows = freshRows.map((fresh) => {
      const matchKey1 = `${fresh.subjectName}_${fresh.chapterNo}`.toLowerCase();
      const matchKey2 = `${fresh.chapterNo}_${fresh.topic}`.toLowerCase();
      const matchKey3 = fresh.chapterNo.toLowerCase().trim();
      const existing = existingMap.get(matchKey1) || existingMap.get(matchKey2) || existingMap.get(matchKey3);

      if (existing) {
        return {
          ...fresh,
          isChapterRed: existing.isChapterRed ?? false,
          isTopicRed: existing.isTopicRed ?? false,
          isAmendmentRed: existing.isAmendmentRed ?? false,
          amendment: existing.amendment || fresh.amendment || '',
          lectures: existing.lectures || 'Pending',
          firstDetailedReading: existing.firstDetailedReading || 'Pending',
          chapterWiseTest: existing.chapterWiseTest || 'Pending',
          firstMockTest: existing.firstMockTest || 'Pending',
          secondMockTest: existing.secondMockTest || 'Pending',
          fifthRevision: existing.fifthRevision || 'Pending',
          fourthRevision: existing.fourthRevision || 'Pending',
          thirdRevision: existing.thirdRevision || 'Pending',
          secondRevision: existing.secondRevision || 'Pending',
          firstRevision: existing.firstRevision || 'Pending',
          remarks: existing.remarks || fresh.remarks || '',
        };
      }
      return fresh;
    });
  }

  const updatedProfile: StudentMentorshipProfile = {
    ...profile,
    syllabusVersion: CURRENT_SYLLABUS_VERSION,
    trackerRows: mergedRows,
    updatedAt: new Date().toISOString(),
  };

  saveStudentMentorshipProfile(updatedProfile);
  return updatedProfile;
}


// -------------------------------------------------------------
// Profiles = view of the students stored in the database
// -------------------------------------------------------------

function findStudent(profileOrStudent: { studentId?: string; studentEmail?: string; email?: string; id?: string }): CentralStudent | null {
  const id = profileOrStudent.studentId || profileOrStudent.id;
  const email = profileOrStudent.studentEmail || profileOrStudent.email;
  return (id ? getStudentById(id) : null) || (email ? getStudentByEmail(email) : null);
}

/** email -> profile, built from students loaded from the database. */
export function loadAllStoredProfiles(): Record<string, StudentMentorshipProfile> {
  const out: Record<string, StudentMentorshipProfile> = {};
  getAllStudents().forEach((s) => {
    out[s.email.toLowerCase()] = toMentorshipProfile(s);
  });
  return out;
}

/**
 * Profile for a student. If the student exists in the database their real data is returned;
 * otherwise a temporary (unsaved) default profile is built so the UI can still render.
 */
export function getOrCreateStudentMentorship(student: {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  targetExam?: string;
  isApproved?: boolean;
}): StudentMentorshipProfile {
  const match = findStudent({ id: student.id, email: student.email });
  if (match) return toMentorshipProfile(match);

  const { program, level, group, assignedIndexId } = resolveProgramAndGroup(student.targetExam || 'CS Executive Group 1');
  return {
    studentId: student.id || '',
    studentName: student.fullName || 'Student',
    studentEmail: (student.email || '').trim().toLowerCase(),
    studentPhone: student.phone || '',
    program,
    level,
    group,
    assignedIndexId,
    targetAttempt: student.targetExam || '',
    syllabusVersion: CURRENT_SYLLABUS_VERSION,
    trackerRows: generateDefaultChapters(program, group),
    monthlyCalls: createDefault12MonthCalls(),
    adminOverallRemarks: '',
    isApproved: student.isApproved ?? false,
    approvalStatus: student.isApproved ? 'approved' : 'pending',
    updatedAt: new Date().toISOString(),
  };
}

/** Approval is decided by the server when the admin approves a payment — nothing to store here. */
export function setStudentApprovalStatus(_studentEmailOrId: string, _approved: boolean): void {
  /* intentionally empty: approval lives in the database */
}

/**
 * Saves tracker rows / monthly calls / remarks of a profile to the DATABASE.
 * The UI is updated instantly (optimistic); if the server refuses, the change is rolled back and an error banner is shown.
 */
export async function saveStudentMentorshipProfile(profile: StudentMentorshipProfile): Promise<boolean> {
  const student = findStudent(profile);
  if (!student) return false;
  if (!getActiveAdminSession()) return false; // students save their index through updateStudentStudyIndexRows()

  const patch = {
    trackerRows: profile.trackerRows,
    monthlyCalls: profile.monthlyCalls,
    mentorRemarks: profile.adminOverallRemarks ?? student.mentorRemarks ?? '',
  };
  patchStudentInCache(student.studentId, patch);
  const res = await updateStudentAccessDetails(student.studentId, patch);
  if (!res.success) {
    reportSaveError(res.message || 'Changes could not be saved. Please try again.');
    await refreshAdminData();
    return false;
  }
  return true;
}

export function getAllStudentProfilesForAdmin(): StudentMentorshipProfile[] {
  return getAllStudents().map(toMentorshipProfile);
}

export const getAllStudentMentorshipProfiles = getAllStudentProfilesForAdmin;

export async function deleteStudentMentorshipProfile(studentId: string): Promise<boolean> {
  const { deleteStudentFromCentralDb } = await import('./centralStudentDatabase');
  return deleteStudentFromCentralDb(studentId);
}


/**
 * Re-allocates student's Program, Level, and Group (Admin operation).
 * Tracker is regenerated for the new group; saved to the database.
 */
export function reassignStudentGroup(
  profile: StudentMentorshipProfile,
  newProgram: MentorshipProgram,
  newLevel: MentorshipLevel,
  newGroup: MentorshipGroup
): StudentMentorshipProfile {
  let assignedIndexId = 'exec-g1';
  if (newProgram === 'CS EET') assignedIndexId = 'cseet';
  else if (newProgram === 'CS Executive') {
    assignedIndexId = newGroup === 'Group 1' ? 'exec-g1' : newGroup === 'Group 2' ? 'exec-g2' : 'exec-both';
  } else if (newProgram === 'CS Professional') {
    assignedIndexId = newGroup === 'Group 1' ? 'prof-g1' : newGroup === 'Group 2' ? 'prof-g2' : 'prof-both';
  }

  const updatedTracker = generateDefaultChapters(newProgram, newGroup);
  const updatedProfile: StudentMentorshipProfile = {
    ...profile,
    program: newProgram,
    level: newLevel,
    group: newGroup,
    assignedIndexId,
    trackerRows: updatedTracker,
    updatedAt: new Date().toISOString(),
  };

  const student = findStudent(profile);
  if (student) {
    const centralGroup = newProgram === 'CS EET' ? 'EET' : newGroup === 'Both' ? 'Both Groups' : (newGroup as any);
    const patch = {
      program: newProgram as any,
      level: newLevel as any,
      group: centralGroup,
      targetExam: `${newProgram} — ${centralGroup}`,
      assignedIndexId: assignedIndexId as any,
      trackerRows: updatedTracker,
    };
    patchStudentInCache(student.studentId, patch);
    void updateStudentAccessDetails(student.studentId, patch).then(async (res) => {
      if (!res.success) {
        reportSaveError(res.message || 'Group change save not hua.');
        await refreshAdminData();
      }
    });
  }
  return updatedProfile;
}

/**
 * Sets all tracking columns of all chapters to 'Pending' for a student profile.
 * Used when initializing or resetting index data as requested by Admin.
 */
export function setAllTrackerRowsToPending(
  profile: StudentMentorshipProfile,
  resetRedFlags: boolean = false
): StudentMentorshipProfile {
  const updatedRows = profile.trackerRows.map((r) => ({
    ...r,
    isChapterRed: resetRedFlags ? false : r.isChapterRed,
    isTopicRed: resetRedFlags ? false : r.isTopicRed,
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
  }));

  const updatedProfile: StudentMentorshipProfile = {
    ...profile,
    trackerRows: updatedRows,
    updatedAt: new Date().toISOString(),
  };

  saveStudentMentorshipProfile(updatedProfile);
  return updatedProfile;
}

export function applyCustomIndexToStudent(
  profile: StudentMentorshipProfile,
  newRows: TrackerRow[]
): StudentMentorshipProfile {
  const updatedProfile: StudentMentorshipProfile = {
    ...profile,
    trackerRows: newRows,
    updatedAt: new Date().toISOString(),
  };
  saveStudentMentorshipProfile(updatedProfile);
  return updatedProfile;
}


// -------------------------------------------------------------
// Admin "view this student's portal" selection (UI navigation state only — not data)
// -------------------------------------------------------------

export function setAdminViewingStudentId(studentKey: string | null): void {
  try {
    if (studentKey) sessionStorage.setItem(ACTIVE_ADMIN_VIEW_KEY, studentKey);
    else sessionStorage.removeItem(ACTIVE_ADMIN_VIEW_KEY);
  } catch {
    /* ignore */
  }
}

export function getAdminViewingStudentId(): string | null {
  try {
    return sessionStorage.getItem(ACTIVE_ADMIN_VIEW_KEY);
  } catch {
    return null;
  }
}
