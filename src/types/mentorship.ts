export type MentorshipProgram = 'CS EET' | 'CS Executive' | 'CS Professional';
export type MentorshipLevel = 'Level 1' | 'Level 2' | 'Level 3';
export type MentorshipGroup = 'Group 1' | 'Group 2' | 'Both' | 'General';

export type StatusValue = 'Completed' | 'Working' | 'Pending';

export interface TrackerRow {
  id: string;
  programGroup: string; // e.g. 'cseet', 'exec-g1', 'exec-g2', 'prof-g1', 'prof-g2'
  subjectCode: string;
  subjectName: string;
  chapterNo: string;
  isChapterRed: boolean;
  amendment: string;
  isAmendmentRed?: boolean;
  topic: string;
  isTopicRed: boolean;
  lectures: string;
  firstDetailedReading: string;
  chapterWiseTest: string;
  firstMockTest: string;
  secondMockTest: string;
  fifthRevision: string;
  fourthRevision: string;
  thirdRevision: string;
  secondRevision: string;
  firstRevision: string;
  remarks?: string;
}

export interface MonthlyMentorshipCall {
  callNumber: 1 | 2 | 3 | 4;
  agenda: string;
  status: 'Scheduled' | 'Completed' | 'Pending' | 'Rescheduled';
  date?: string;
  time?: string;
  notes?: string;
}

export interface MonthMentorshipRecord {
  month:
    | 'January'
    | 'February'
    | 'March'
    | 'April'
    | 'May'
    | 'June'
    | 'July'
    | 'August'
    | 'September'
    | 'October'
    | 'November'
    | 'December';
  call1: MonthlyMentorshipCall;
  call2: MonthlyMentorshipCall;
  call3: MonthlyMentorshipCall;
  call4: MonthlyMentorshipCall;
}

export interface StudentMentorshipProfile {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  program: MentorshipProgram;
  level: MentorshipLevel;
  group: MentorshipGroup;
  assignedIndexId: string; // 'cseet' | 'exec-g1' | 'exec-g2' | 'exec-both' | 'prof-g1' | 'prof-g2' | 'prof-both'
  targetAttempt: string;
  syllabusVersion?: string;
  trackerRows: TrackerRow[];
  studyIndexRows?: TrackerRow[];
  monthlyCalls: MonthMentorshipRecord[];
  adminOverallRemarks?: string;
  lastUpdatedByAdmin?: string;
  isApproved?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  isStudyProgressIndex?: boolean;
  studyIndexAccess?: boolean;
  updatedAt: string;
}

export interface FreeSlotBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  preferredSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  adminRemarks?: string;
}

export interface MentorshipSlotBooking {
  id: string;
  studentId?: string;
  studentName: string;
  email: string;
  phone: string;
  program: string;
  group: string;
  bookingDate: string;
  bookingTime: string;
  callType: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  adminRemarks?: string;
}

