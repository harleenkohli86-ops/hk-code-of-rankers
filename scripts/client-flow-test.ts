// Tests the BROWSER-side data modules (src/lib/backend.ts, centralStudentDatabase, mentorshipTrackerService)
// against a running server + database.   Usage:
//   BASE=http://localhost:3000 ADMIN_EMAIL=.. ADMIN_PASSWORD=.. npx tsx scripts/client-flow-test.ts
// This test deletes the data it creates.
import 'dotenv/config';

const BASE = process.env.BASE || `http://localhost:${process.env.PORT || 3000}`;
const jar: Record<string, string> = {};
const realFetch = globalThis.fetch;
(globalThis as any).fetch = async (url: any, init: any = {}) => {
  const res = await realFetch(String(url).startsWith('/') ? BASE + url : url, {
    ...init,
    headers: { ...(init.headers || {}), Cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ') },
  });
  for (const c of (res.headers as any).getSetCookie?.() || []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    const k = pair.slice(0, i), v = pair.slice(i + 1);
    if (/Max-Age=0/i.test(c) || !v) delete jar[k]; else jar[k] = v;
  }
  return res;
};

const be = await import('../src/lib/backend');
const db = await import('../src/services/centralStudentDatabase');
const mt = await import('../src/services/mentorshipTrackerService');

let pass = 0, fail = 0;
const check = (n: string, c: any, extra = '') => { if (c) { pass++; console.log('  ✅', n); } else { fail++; console.log('  ❌', n, extra); } };
const stamp = Date.now().toString().slice(-6);
const email = `clienttest${stamp}@example.com`;
const phone = `98${stamp}00`.slice(0, 10);
let freeId = '', code = '';

try {
  console.log('\n[public forms]');
  const b = await be.saveCounsellingBooking({ name: 'Client Test', email, phone, examLevel: 'CS Executive', date: 'Monday at 5:00 PM', notes: 'client flow' });
  check('saveCounsellingBooking -> DB', b.success && b.booking?.id, b.message); freeId = b.booking?.id || '';
  const bad = await be.saveCounsellingBooking({ name: 'X', phone: '1', examLevel: 'a', date: 'b' });
  check('invalid booking gives error message', !bad.success && bad.message.length > 3);
  const e = await be.saveEnrollment({ name: 'Lead Test', phone, program: 'Inquiry: CS Executive', productId: 'inquiry-lead' });
  check('saveEnrollment (contact form) -> DB', e.success && e.id, e.message);
  const c1 = await db.validateDiscountCode('HK5');
  check('validateDiscountCode HK5', c1.valid && c1.discountPercent === 5);

  console.log('\n[admin session]');
  check('admin data blocked before login', !(await db.refreshAdminData()));
  const bad2 = await be.loginMasterAdmin(process.env.ADMIN_EMAIL!, 'wrongwrong');
  check('wrong admin password rejected', !bad2.success);
  const lg = await be.loginMasterAdmin(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
  check('admin login', lg.success && be.getActiveAdminSession()?.adminEmail === process.env.ADMIN_EMAIL!.toLowerCase());
  await be.restoreAdminSession(true);
  check('session restored from cookie', Boolean(be.getActiveAdminSession()));
  check('refreshAdminData loads DB', await db.refreshAdminData());
  check('public booking visible to admin', db.getAllFreeSlotBookings().some((x) => x.id === freeId));
  check('inquiry visible to admin', db.getAllInquiries().some((x) => x.id === e.id));
  check('promo codes seeded (>=30)', db.getDiscountCodes().length >= 30);

  console.log('\n[students]');
  const add = await db.addStudentManually({ fullName: 'Client Test Student', email, phone, program: 'CS Executive', level: 'Level 2', group: 'Group 1', initialPaymentStatus: 'approved', courseName: 'CS Executive (Group 1) Mentorship', amount: 2999 }, {});
  check('addStudentManually (approved)', add.success && add.student?.mentorshipAccess === true, add.message);
  check('set-password link returned to admin', Boolean(add.setPasswordUrl?.includes('resetToken=')));
  code = add.student?.studentId || '';
  const dup = await db.addStudentManually({ fullName: 'Dup', email, phone: '9000012345', program: 'CS Executive', level: 'Level 2', group: 'Group 1' });
  check('duplicate email rejected', !dup.success);
  check('student in cache', db.getStudentByEmail(email)?.studentId === code);
  const prof = mt.getAllStudentMentorshipProfiles().find((p) => p.studentId === code)!;
  check('mentorship profile built from DB student', prof && prof.trackerRows.length > 10 && prof.isApproved);

  console.log('\n[tracker saves -> DB]');
  const rows = prof.trackerRows.map((r, i) => (i === 0 ? { ...r, lectures: 'Completed', remarks: 'db-saved' } : r));
  const ok = await mt.saveStudentMentorshipProfile({ ...prof, trackerRows: rows, adminOverallRemarks: 'Great progress' });
  check('saveStudentMentorshipProfile ok', ok);
  await db.refreshAdminData();
  const after = db.getStudentById(code)!;
  check('tracker row persisted in DB', after.trackerRows[0].remarks === 'db-saved' && after.trackerRows[0].lectures === 'Completed');
  check('mentor remarks persisted', after.mentorRemarks === 'Great progress');
  const re = mt.reassignStudentGroup(prof, 'CS Professional', 'Level 3', 'Group 2');
  check('reassign returns new profile instantly', re.assignedIndexId === 'prof-g2');
  await new Promise((r) => setTimeout(r, 800));
  await db.refreshAdminData();
  check('reassign persisted in DB', db.getStudentById(code)?.program === 'CS Professional' && db.getStudentById(code)?.assignedIndexId === 'prof-g2');
  const noAccess = await db.updateStudentStudyIndexRows(code, []);
  check('index save blocked without access', !noAccess.success);
  check('toggle index access', await db.toggleStudentStudyIndexAccess(code, true));
  const idxSave = await db.updateStudentStudyIndexRows(code, [{ id: 'x', chapterNo: '1', topic: 'note' } as any]);
  check('admin saves study index rows', idxSave.success, idxSave.message);
  await db.refreshAdminData();
  check('index rows persisted', db.getStudentById(code)?.studyIndexRows?.[0]?.id === 'x');
  const rp = await db.createPasswordResetLinkForStudent(code);
  check('admin reset link', rp.success && Boolean(rp.resetUrl));

  console.log('\n[student side: set password link -> login -> payment -> index save]');
  const { apiPost } = await import('../src/lib/api');
  const token = new URL(rp.resetUrl!).searchParams.get('resetToken')!;
  await be.logoutMasterAdmin();
  db.clearLocalCache();
  check('admin logged out', !be.getActiveAdminSession() && !(await db.refreshAdminData()));
  const rs = await apiPost('/api/auth/reset-password', { token, newPassword: 'studentpass1' });
  check('student sets password via link', rs.ok, rs.message);
  const li = await apiPost('/api/auth/login', { emailOrPhone: email, password: 'studentpass1' });
  check('student login', li.ok && li.data.student?.studentId === code);
  check('student record has no admin-only notes', li.data.student && !('adminNotes' in li.data.student && li.data.student.adminNotes));
  db.setCurrentStudent(li.data.student);
  check('student cache populated', db.getStudentByEmail(email)?.studentId === code);
  const pay = await db.submitCoursePayment({ courseId: 'hk-studytrack-prof-g2', courseName: 'HK StudyTrack Pro (Professional G2)', amount: 999, utrNumber: `5${stamp}${stamp}`.slice(0, 12).padEnd(12, '3'), items: [{ productId: 'hk-studytrack-prof-g2', name: 'HK StudyTrack Pro', price: 999, quantity: 1 }] });
  check('student submitCoursePayment -> DB', pay.success && pay.order?.status === 'PENDING_APPROVAL', pay.message);
  const sv = await db.updateStudentStudyIndexRows(code, [{ id: 'stu', chapterNo: '2', topic: 'student edit' } as any]);
  check('student saves own index (access granted earlier)', sv.success, sv.message);
  const me = await apiPost('/api/auth/login', { emailOrPhone: email, password: 'studentpass1' });
  check('student index persisted in DB', me.data.student?.studyIndexRows?.[0]?.id === 'stu');
  const lo = await apiPost('/api/auth/logout', {});
  check('student logout', lo.ok);
  await be.loginMasterAdmin(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
  await db.refreshAdminData();
  check('admin sees student payment', db.getAllPayments().some((x) => x.studentId === code && x.status === 'pending'));
  const pid = db.getAllPayments().find((x) => x.studentId === code && x.status === 'pending')!.id;
  const ap = await db.approvePaymentById(pid);
  check('approvePaymentById', ap.success, ap.message);
  check('study index access ON after approval', db.getStudentById(code)?.studyIndexAccess === true && db.getStudentById(code)?.paymentStatus === 'approved');

  console.log('\n[bookings + promo admin]');
  check('update free booking status', await db.updateFreeSlotBookingStatus(freeId, 'completed', 'done'));
  check('status in cache', db.getAllFreeSlotBookings().find((x) => x.id === freeId)?.status === 'completed');
  const nc = await db.addCustomDiscountCode('CLIENT' + stamp, 20, false, 2);
  check('create promo code', nc.success, nc.message);
  check('toggle promo', await db.toggleDiscountCodeStatus('CLIENT' + stamp));
  check('promo inactive -> invalid', !(await db.validateDiscountCode('CLIENT' + stamp)).valid);
  check('delete promo', await db.resetOrDeleteDiscountCode('CLIENT' + stamp, true));
} catch (err) {
  fail++; console.log('  ❌ unexpected:', err);
} finally {
  console.log('\n[cleanup]');
  if (code) await db.deleteStudentFromCentralDb(code);
  if (freeId) await db.deleteFreeSlotBooking(freeId);
  await db.refreshAdminData();
  for (const i of db.getAllInquiries().filter((x) => x.phone === phone)) await db.deleteInquiryFromDb(i.id);
  await be.logoutMasterAdmin();
  console.log(`\nResult: ${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
}
