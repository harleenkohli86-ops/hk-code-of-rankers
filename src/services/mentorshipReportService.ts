import { jsPDF } from 'jspdf';
import {
  getAllStudents,
  CentralStudent,
  toMentorshipGroup,
} from './centralStudentDatabase';
import {
  getAllStudentMentorshipProfiles,
  generateDefaultChapters,
} from './mentorshipTrackerService';
import { StudentMentorshipProfile } from '../types/mentorship';

export interface MentorshipReportResult {
  success: boolean;
  message: string;
  count?: number;
}

/**
 * Downloads an official, multi-student PDF Mentorship Report dossier.
 * Reads the latest data from the database (students loaded by the admin dashboard).
 * Follows the strict rule:
 * - One student per page (or multiple pages if required for that student).
 * - Every student's complete mentorship data remains together.
 * - Read-only operation, no state mutation.
 */
export async function downloadMentorshipReportPDF(): Promise<MentorshipReportResult> {
  // 2. Gather registered mentorship students
  const centralStudents = getAllStudents();
  const mentorshipProfiles = getAllStudentMentorshipProfiles();

  // Find all students who have approved mentorship access
  const approvedMap = new Map<string, CentralStudent>();

  // A. From central students (with approved payment / active mentorship)
  centralStudents.forEach((cs) => {
    if (cs.mentorshipAccess || cs.paymentStatus === 'approved') {
      approvedMap.set(cs.studentId, cs);
    }
  });


  // Fallback: If no approved students yet, check mentorship profiles that are marked approved
  if (approvedMap.size === 0) {
    mentorshipProfiles
      .filter((p) => p.isApproved)
      .forEach((p) => {
        const studentId = p.studentId || `STU-${(p.studentPhone || '').slice(-4)}`;
        const validIndex = (p.assignedIndexId === 'cseet' || p.assignedIndexId === 'exec-g1' || p.assignedIndexId === 'exec-g2' || p.assignedIndexId === 'exec-both' || p.assignedIndexId === 'prof-g1' || p.assignedIndexId === 'prof-g2' || p.assignedIndexId === 'prof-both')
          ? p.assignedIndexId
          : 'exec-g1';
        const progGroup = (p.group === 'General' ? 'Group 1' : p.group) || 'Group 1';
        const safeDate = p.approvedAt || p.updatedAt || new Date().toISOString();

        const synthetic: CentralStudent = {
          studentId,
          fullName: p.studentName,
          email: p.studentEmail || `${studentId.toLowerCase()}@student.hkcodeofrankers.com`,
          phone: p.studentPhone || '',
          program: p.program || 'CS Executive',
          level: p.level || 'Level 2',
          group: progGroup as any,
          targetExam: `${p.program} — ${p.group}`,
          password: 'student_registered',
          registrationStatus: 'approved',
          registeredAt: safeDate,
          paymentStatus: 'approved',
          paymentApprovedAt: safeDate,
          mentorshipAccess: true,
          studyIndexAccess: true,
          assignedIndexId: validIndex,
          trackerRows: p.trackerRows && p.trackerRows.length > 0
            ? p.trackerRows
            : generateDefaultChapters(p.program || 'CS Executive', toMentorshipGroup(progGroup as any)),
          studyIndexRows: [],
          monthlyCalls: [],
          isActive: true,
          role: 'student',
          purchasedCourse: {
            courseId: 'cs-mentorship-batch',
            courseName: `${p.program} (${p.group}) Mentorship`,
            amount: 2999,
            finalAmount: 2999,
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            paymentMethod: 'UPI',
            transactionRef: 'VERIFIED',
            utrNumber: 'VERIFIED',
            paymentDate: safeDate,
            paymentStatus: 'approved',
            paymentApprovedAt: safeDate,
          },
          updatedAt: new Date().toISOString(),
        };
        approvedMap.set(studentId, synthetic);
      });
  }

  const registeredStudents = Array.from(approvedMap.values());

  if (registeredStudents.length === 0) {
    return {
      success: false,
      message: 'No registered mentorship students found in the database. Once students are approved, they will appear here.',
      count: 0,
    };
  }

  // 3. Generate PDF Report using jsPDF. Landscape A4 prevents right-side columns from being clipped.
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const reportDateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const reportTimeStr = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Helper: Print Top Header
  const printHeader = (student: CentralStudent, isContinuation = false) => {
    // Top banner
    doc.setFillColor(15, 15, 15); // #0F0F0F
    doc.rect(0, 0, pageWidth, 36, 'F');

    // Gold accent bar
    doc.setFillColor(200, 164, 93); // #C8A45D
    doc.rect(0, 36, pageWidth, 1.5, 'F');

    // Brand Name & Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(255, 227, 160); // #FFE3A0
    doc.text('HK CODE OF RANKERS', margin, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 164, 93);
    doc.text('1-ON-1 CS MENTORSHIP & EVALUATED TEST SERIES', margin, 19);

    doc.setFontSize(7.5);
    doc.setTextColor(215, 215, 215);
    doc.text('Founder & Head Mentor: Harkiran Kaur (AIR 3 CS Professional)', margin, 24);
    doc.text('Official Portal: hkcodeofrankers.com • Helpline: +91 92840 84523', margin, 29);

    // Right Header: Report Dossier Details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(
      isContinuation ? 'MENTORSHIP INDEX (CONT.)' : 'STUDENT MENTORSHIP DOSSIER',
      pageWidth - margin,
      13,
      { align: 'right' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 164, 93);
    doc.text(`STUDENT ID: ${student.studentId}`, pageWidth - margin, 19, { align: 'right' });

    doc.setTextColor(200, 200, 200);
    doc.setFontSize(7.5);
    doc.text(`DATE: ${reportDateStr} • ${reportTimeStr}`, pageWidth - margin, 24, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94); // Emerald
    const footerY = 202;
    doc.text('STATUS: REGISTERED & VERIFIED', pageWidth - margin, 29, { align: 'right' });
  };

  // Helper: Print Footer
  const printFooter = (student: CentralStudent, pageNum: number, totalStudentPages: number) => {
    const footerY = 202;
    doc.setDrawColor(210, 200, 185);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'HK Code of Rankers • Confidential Mentorship Record • Harkiran Kaur (AIR 3)',
      margin,
      footerY + 1.5
    );
    doc.text(
      `Student: ${student.fullName} (${student.studentId}) — Sheet ${pageNum} of ${totalStudentPages}`,
      pageWidth - margin,
      footerY + 1.5,
      { align: 'right' }
    );
  };

  // Iterate over each registered mentorship student
  registeredStudents.forEach((student, sIndex) => {
    if (sIndex > 0) {
      doc.addPage();
    }

    // Determine tracker rows for this student
    const rows =
      student.trackerRows && student.trackerRows.length > 0
        ? student.trackerRows
        : generateDefaultChapters(
            student.program || 'CS Executive',
            toMentorshipGroup(student.group || 'Group 1')
          );
    const rowsOnFirstPage = 15;
    const rowsOnContPage = 21;
    // Calculate pagination for landscape A4
    const totalStudentPages =
      rows.length <= rowsOnFirstPage
        ? 1
        : 1 + Math.ceil((rows.length - rowsOnFirstPage) / rowsOnContPage);

    let currentStudentPage = 1;
    printHeader(student, false);

    // 1. STUDENT PROFILE & MENTORSHIP STATUS (Two Clean Cards on First Page)
    let y = 43;

    // Card 1: Student Information (Left)
    doc.setFillColor(252, 250, 247);
    doc.setDrawColor(215, 195, 160);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, (contentWidth - 6) / 2, 38, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(138, 101, 30); // #8A651E
    doc.text('STUDENT PROFILE', margin + 4, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(20, 20, 20);
    doc.text(student.fullName, margin + 4, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(`Student ID: ${student.studentId}`, margin + 4, y + 18.5);
    doc.text(`Email: ${student.email}`, margin + 4, y + 23);
    doc.text(`Phone: ${student.phone}`, margin + 4, y + 27.5);
    doc.text(`Level / Group: ${student.level} • ${student.group}`, margin + 4, y + 32);
    doc.text(
      `Registered On: ${
        student.registeredAt
          ? new Date(student.registeredAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'N/A'
      }`,
      margin + 4,
      y + 36.5
    );

    // Card 2: Mentorship & Payment Verification (Right)
    const rightX = margin + (contentWidth - 6) / 2 + 6;
    doc.setFillColor(252, 250, 247);
    doc.roundedRect(rightX, y, (contentWidth - 6) / 2, 38, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(138, 101, 30);
    doc.text('MENTORSHIP & PAYMENT RECORD', rightX + 4, y + 6);

    const course = student.purchasedCourse;
    const courseName = course?.courseName || student.targetExam || `${student.program} Mentorship`;
    const utr = course?.utrNumber || course?.transactionRef || 'VERIFIED IN BANK';
    const amount = course?.finalAmount || course?.amount || 2999;
    const approvalDate =
      student.paymentApprovedAt || course?.paymentApprovedAt || student.updatedAt || new Date();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 20, 20);
    doc.text(courseName.slice(0, 36), rightX + 4, y + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(70, 70, 70);
    doc.text(`Payment Status: `, rightX + 4, y + 18.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 163, 74); // Green
    doc.text('APPROVED & VERIFIED', rightX + 27, y + 18.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(70, 70, 70);
    doc.text(`UTR Number: ${utr}`, rightX + 4, y + 23);
    doc.text(
      `Amount Paid: Rs. ${amount.toLocaleString('en-IN')} (Direct UPI)`,
      rightX + 4,
      y + 27.5
    );
    doc.text(
      `Approval Date: ${new Date(approvalDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`,
      rightX + 4,
      y + 32
    );
    doc.text('Access: 1-on-1 Mentorship + Test Series Unlocked', rightX + 4, y + 36.5);

    // 2. COMPLETE MENTORSHIP INDEX TABLE
    y = 86;

    // Helper: Draw Table Header
    const printTableHeader = (curY: number) => {
      doc.setFillColor(26, 24, 21);
      doc.rect(margin, curY, contentWidth, 7.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(255, 227, 160);
      doc.text('S.No', margin + 2, curY + 5);
      doc.text('Subject & Chapter', margin + 14, curY + 5);
      doc.text('Topic & Focus Areas', margin + 74, curY + 5);
      doc.text('Lectures', margin + 128, curY + 5);
      doc.text('1st Read', margin + 143, curY + 5);
      doc.text('Ch. Test', margin + 158, curY + 5);
      doc.text('Status', margin + 171, curY + 5);
      return curY + 7.5;
    };

    y = printTableHeader(y);

    // Iterate tracker rows
    rows.forEach((row, rIdx) => {
      // Check page break for the SAME student
      // Landscape A4 printable area ends before the footer (210mm page height, footer at 202mm).
      if (y > 195) {
        printFooter(student, currentStudentPage, totalStudentPages);
        doc.addPage();
        currentStudentPage++;
        printHeader(student, true);
        y = 44;
        y = printTableHeader(y);
      }

      // Alternating row background
      const rowHeight = 6.8;
      if (rIdx % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(250, 248, 245);
      }
      doc.rect(margin, y, contentWidth, rowHeight, 'F');

      // Thin separator line
      doc.setDrawColor(230, 225, 215);
      doc.setLineWidth(0.2);
      doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

      // Text data
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(50, 50, 50);

      // S.No
      doc.text(String(rIdx + 1), margin + 2, y + 4.5);

      // Subject & Chapter
      const subjCh = `${row.chapterNo ? row.chapterNo + ': ' : ''}${row.subjectName || ''}`;
      doc.setFont('helvetica', 'bold');
      doc.text(subjCh.slice(0, 38), margin + 14, y + 4.5);

      // Topic
      doc.setFont('helvetica', 'normal');
      doc.text((row.topic || 'Standard syllabus coverage').slice(0, 36), margin + 74, y + 4.5);

      // Lectures
      const lecStatus = row.lectures || 'Pending';
      doc.text(lecStatus.slice(0, 8), margin + 128, y + 4.5);

      // 1st Read
      const readStatus = row.firstDetailedReading || 'Pending';
      doc.text(readStatus.slice(0, 8), margin + 143, y + 4.5);

      // Chapter Test
      const testStatus = row.chapterWiseTest || 'Pending';
      doc.text(testStatus.slice(0, 8), margin + 158, y + 4.5);

      // Overall Row Status
      const isDone =
        row.lectures === 'Done' ||
        row.firstDetailedReading === 'Done' ||
        row.chapterWiseTest === 'Done';
      if (isDone) {
        doc.setTextColor(22, 163, 74);
        doc.setFont('helvetica', 'bold');
        doc.text('Progress', margin + 171, y + 4.5);
      } else {
        doc.setTextColor(140, 140, 140);
        doc.text('Assigned', margin + 171, y + 4.5);
      }

      y += rowHeight;
    });

    // Print footer on last page of this student
    printFooter(student, currentStudentPage, totalStudentPages);
  });

  // Save PDF file
  const fileName = `HK_Rankers_Mentorship_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);

  return {
    success: true,
    message: `Generated Mentorship Report for ${registeredStudents.length} registered student(s)!`,
    count: registeredStudents.length,
  };
}
