/**
 * Shared, PURE tracker helpers (no browser / no server APIs).
 * The server and browser both generate the default syllabus rows from the same source.
 */
import {
  MentorshipProgram,
  MentorshipLevel,
  MentorshipGroup,
  TrackerRow,
  MonthMentorshipRecord,
} from '../types/mentorship';
import { ICSI_OFFICIAL_SYLLABUS, OfficialSyllabusGroup } from '../data/icsiOfficialSyllabus';

export const CURRENT_SYLLABUS_VERSION = '2026_icsi_official_v1';

// Default 12 Months
const MONTHS: MonthMentorshipRecord['month'][] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function createDefault12MonthCalls(): MonthMentorshipRecord[] {
  return MONTHS.map((month) => ({
    month,
    call1: {
      callNumber: 1,
      agenda: 'Personal Syllabus Tracking',
      status: 'Pending',
      notes: 'Review syllabus coverage, pending backlogs & target setting.',
    },
    call2: {
      callNumber: 2,
      agenda: 'Study & Progress Mentorship',
      status: 'Pending',
      notes: 'Evaluate daily study hours, consistency and preparation strategy.',
    },
    call3: {
      callNumber: 3,
      agenda: 'Performance & Revision Review',
      status: 'Pending',
      notes: 'Analyze answer sheets, chapter test scores & identify weak spots.',
    },
    call4: {
      callNumber: 4,
      agenda: 'Anxiety Relief / Support Call',
      status: 'Pending',
      notes: 'Direct 1-on-1 calming session, exam stress and panic management.',
    },
  }));
}

// -------------------------------------------------------------
// Official ICSI 2026 Syllabus Seed Chapters Generator
// All 5 Groups / Levels: CSEET, Exec G1, Exec G2, Prof G1, Prof G2
// All columns default to 'Pending', Amendment empty & manually editable
// Red highlight toggle supported on Chapter No & Topic
// -------------------------------------------------------------

export function buildTrackerRowsFromSyllabusGroup(
  groupData: OfficialSyllabusGroup,
  assignedIndexId: string
): TrackerRow[] {
  const rows: TrackerRow[] = [];
  groupData.papers.forEach((paper, pIdx) => {
    paper.chapters.forEach((chapter, cIdx) => {
      rows.push({
        id: `${groupData.id}_p${pIdx + 1}_c${cIdx + 1}`,
        programGroup: assignedIndexId,
        subjectCode: paper.code,
        subjectName: paper.name,
        chapterNo: chapter.ch,
        isChapterRed: false,
        amendment: chapter.defaultAmendment || '',
        isAmendmentRed: false,
        topic: chapter.topic,
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
        remarks: chapter.part ? `[${chapter.part}]` : '',
      });
    });
  });
  return rows;
}

export function generateDefaultChapters(program: MentorshipProgram, group: MentorshipGroup): TrackerRow[] {
  // 1. CSEET
  if (program === 'CS EET') {
    return buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['cseet'], 'cseet');
  }

  // 2. CS EXECUTIVE - GROUP 1
  if (program === 'CS Executive' && group === 'Group 1') {
    return buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['exec-g1'], 'exec-g1');
  }

  if (program === 'CS Executive' && group === 'Group 2') {
    return buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['exec-g2'], 'exec-g2');
  }
  if (program === 'CS Executive' && group === 'Both') {
    const g1Rows = buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['exec-g1'], 'exec-both');
    const g2Rows = buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['exec-g2'], 'exec-both');
    return [...g1Rows, ...g2Rows];
  }

  // 3. CS PROFESSIONAL
  if (program === 'CS Professional') {
    if (group === 'Group 1') {
      return buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['prof-g1'], 'prof-g1');
    }
    if (group === 'Group 2') {
      return buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['prof-g2'], 'prof-g2');
    }
    // Both Groups
    const g1Rows = buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['prof-g1'], 'prof-both');
    const g2Rows = buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['prof-g2'], 'prof-both');
    return [...g1Rows, ...g2Rows];
  }

  // Fallback: Default to Executive Group 1
  return buildTrackerRowsFromSyllabusGroup(ICSI_OFFICIAL_SYLLABUS['exec-g1'], 'exec-g1');
}

export function resolveProgramAndGroup(rawInput: string): {
  program: MentorshipProgram;
  level: MentorshipLevel;
  group: MentorshipGroup;
  assignedIndexId: string;
} {
  const norm = (rawInput || '').toLowerCase();

  // CSEET
  if (norm.includes('eet') || norm.includes('cseet')) {
    return {
      program: 'CS EET',
      level: 'Level 1',
      group: 'General',
      assignedIndexId: 'cseet',
    };
  }

  // CS Professional
  if (norm.includes('prof') || norm.includes('level 3')) {
    if (norm.includes('g1') || norm.includes('group 1')) {
      return {
        program: 'CS Professional',
        level: 'Level 3',
        group: 'Group 1',
        assignedIndexId: 'prof-g1',
      };
    }
    if (norm.includes('g2') || norm.includes('group 2')) {
      return {
        program: 'CS Professional',
        level: 'Level 3',
        group: 'Group 2',
        assignedIndexId: 'prof-g2',
      };
    }
    return {
      program: 'CS Professional',
      level: 'Level 3',
      group: 'Both',
      assignedIndexId: 'prof-both',
    };
  }

  // Default: CS Executive (Level 2)
  if (norm.includes('group 2') || norm.includes('g2') || norm.includes('exec-g2')) {
    return {
      program: 'CS Executive',
      level: 'Level 2',
      group: 'Group 2',
      assignedIndexId: 'exec-g2',
    };
  }

  if (norm.includes('group 1') || norm.includes('g1') || norm.includes('exec-g1')) {
    return {
      program: 'CS Executive',
      level: 'Level 2',
      group: 'Group 1',
      assignedIndexId: 'exec-g1',
    };
  }

  // Both Groups
  return {
    program: 'CS Executive',
    level: 'Level 2',
    group: 'Both',
    assignedIndexId: 'exec-both',
  };
}


export type ProgramName = 'CS EET' | 'CS Executive' | 'CS Professional';
export type ProgramGroup = 'EET' | 'Group 1' | 'Group 2' | 'Both Groups';

export type AssignedIndexId = 'cseet' | 'exec-g1' | 'exec-g2' | 'exec-both' | 'prof-g1' | 'prof-g2' | 'prof-both';

/** Program + group -> assigned index id */
export function getAssignedIndexId(program: ProgramName, group: ProgramGroup): AssignedIndexId {
  if (program === 'CS EET' || group === 'EET') return 'cseet';
  if (program === 'CS Executive') {
    if (group === 'Both Groups' || (group as string) === 'Both') return 'exec-both';
    if (group === 'Group 2') return 'exec-g2';
    return 'exec-g1';
  }
  if (program === 'CS Professional') {
    if (group === 'Both Groups' || (group as string) === 'Both') return 'prof-both';
    if (group === 'Group 2') return 'prof-g2';
    return 'prof-g1';
  }
  return 'exec-g1';
}

export function toMentorshipGroup(group: ProgramGroup): MentorshipGroup {
  if (group === 'Group 2') return 'Group 2';
  if (group === 'Both Groups' || (group as string) === 'Both') return 'Both';
  return 'Group 1';
}
