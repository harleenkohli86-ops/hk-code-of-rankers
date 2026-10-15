// End-to-end API smoke test.  Usage:
//   1) server keep running (npm run dev  or  npm start)
//   2) BASE=http://localhost:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=... npm test
// This test deletes all data it creates (test student/booking/inquiry) at the end.
import 'dotenv/config';

const BASE = process.env.BASE || `http://localhost:${process.env.PORT || 3000}`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required.');
  process.exit(1);
}

class Client {
  jar = {};
  async call(method, path, body) {
    const res = await fetch(BASE + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: Object.entries(this.jar).map(([k, v]) => `${k}=${v}`).join('; '),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    for (const c of res.headers.getSetCookie?.() || []) {
      const [pair] = c.split(';');
      const i = pair.indexOf('=');
      const k = pair.slice(0, i), v = pair.slice(i + 1);
      if (/Max-Age=0/i.test(c) || !v) delete this.jar[k]; else this.jar[k] = v;
    }
    let json = null;
    try { json = await res.json(); } catch {}
    return { status: res.status, json };
  }
}

let pass = 0, fail = 0;
const check = (name, cond, extra = '') => {
  if (cond) { pass++; console.log('  ✅', name); }
  else { fail++; console.log('  ❌', name, extra); }
};

const stamp = Date.now().toString().slice(-7);
const email = `smoke${stamp}@example.com`;
const phone = `9${stamp}0`.padEnd(10, '1').slice(0, 10);
const utr = `4${stamp}${stamp}`.slice(0, 12).padEnd(12, '7');
const admin = new Client(), student = new Client(), guest = new Client();
const created = { free: [], inq: [] };

try {
  console.log('\n[1] Health');
  let r = await guest.call('GET', '/api/health');
  check('health ok + db connected', r.status === 200 && r.json.db === 'connected');

  console.log('\n[2] Public: one-to-one booking + inquiry');
  r = await guest.call('POST', '/api/bookings/free', { name: 'Smoke Test', email, phone: '12', examLevel: 'CS Executive', date: 'Tomorrow at 4:00 PM' });
  check('booking with invalid phone rejected', r.status === 400);
  r = await guest.call('POST', '/api/bookings/free', { name: 'Smoke Test', email, phone, examLevel: 'CS Executive', date: 'Tomorrow at 4:00 PM', notes: 'smoke' });
  check('booking saved in DB', r.status === 200 && r.json.booking?.id?.startsWith('FREE-'), JSON.stringify(r.json));
  const freeId = r.json.booking?.id; created.free.push(freeId);
  r = await guest.call('POST', '/api/inquiries', { name: 'Smoke Lead', phone, program: 'Inquiry: CS Executive', message: 'hello', kind: 'contact' });
  check('inquiry saved', r.status === 200 && r.json.id, JSON.stringify(r.json)); created.inq.push(r.json.id);

  console.log('\n[3] Security: admin/student APIs locked for guests');
  for (const p of ['/api/admin/overview', '/api/admin/students', '/api/admin/free-bookings', '/api/student/me', '/api/student/orders']) {
    r = await guest.call('GET', p);
    check(`guest blocked: ${p}`, r.status === 401);
  }

  console.log('\n[4] Admin login');
  r = await admin.call('POST', '/api/admin/login', { emailOrPhone: ADMIN_EMAIL, password: 'wrong-password' });
  check('wrong admin password rejected', r.status === 401);
  r = await admin.call('POST', '/api/admin/login', { emailOrPhone: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  check('admin login ok', r.status === 200 && r.json.success);
  r = await admin.call('GET', '/api/admin/overview');
  check('admin sees public booking from DB', r.json.freeBookings?.some((b) => b.id === freeId));
  check('admin sees inquiry from DB', r.json.inquiries?.some((i) => i.id === created.inq[0]));

  console.log('\n[5] Student register / login');
  r = await student.call('POST', '/api/auth/register', { fullName: 'Smoke Student', email, phone, password: 'secret123', program: 'CS Executive', group: 'Group 1', level: 'Level 2' });
  check('register ok', r.status === 200 && r.json.student?.studentId?.startsWith('STU-'), JSON.stringify(r.json));
  const code = r.json.student?.studentId;
  check('password hash never returned', !JSON.stringify(r.json).includes('password_hash') && !('password' in (r.json.student || {})));
  check('default tracker rows created', (r.json.student?.trackerRows || []).length > 10);
  r = await guest.call('POST', '/api/auth/register', { fullName: 'Dup', email, phone: '9000000001', password: 'secret123' });
  check('duplicate email rejected (409)', r.status === 409);
  r = await student.call('GET', '/api/auth/me');
  check('session cookie -> /auth/me', r.json.student?.email === email);
  const s2 = new Client();
  r = await s2.call('POST', '/api/auth/login', { emailOrPhone: email, password: 'nope' });
  check('wrong student password rejected', r.status === 401);
  r = await s2.call('POST', '/api/auth/login', { emailOrPhone: phone, password: 'secret123' });
  check('login by phone works', r.status === 200);
  r = await student.call('GET', '/api/admin/students');
  check('student cannot call admin API', r.status === 401);

  console.log('\n[6] Promo code + UPI payment');
  r = await guest.call('POST', '/api/discounts/validate', { code: 'hk5' });
  check('HK5 valid 5%', r.json.valid === true && r.json.discountPercent === 5);
  r = await guest.call('POST', '/api/discounts/validate', { code: 'NOPE' });
  check('bad code invalid', r.json.valid === false);
  r = await guest.call('POST', '/api/student/payments', { utrNumber: utr, courseId: 'x', courseName: 'x', amount: 1000 });
  check('guest cannot submit payment', r.status === 401);
  r = await student.call('POST', '/api/student/payments', { utrNumber: '123', courseId: 'x', courseName: 'x', amount: 1000 });
  check('short UTR rejected', r.status === 400);
  r = await student.call('POST', '/api/student/payments', {
    utrNumber: utr, courseId: 'exec-g1-mentorship', courseName: 'CS Executive Group 1 Mentorship', amount: 3000, discountCode: 'HK5',
    items: [{ productId: 'exec-g1-mentorship', name: 'CS Executive Group 1 Mentorship', price: 3000, quantity: 1 }],
  });
  check('payment saved, discount computed server-side (3000-5% = 2850)', r.status === 200 && r.json.order?.totalAmount === 2850 && r.json.order?.status === 'PENDING_APPROVAL', JSON.stringify(r.json));
  const orderNo = r.json.order?.orderNumber;
  r = await student.call('POST', '/api/student/payments', { utrNumber: utr, courseId: 'x', courseName: 'x', amount: 1000 });
  check('duplicate UTR rejected (409)', r.status === 409);
  r = await student.call('GET', '/api/student/orders');
  check('student sees own order', r.json.orders?.some((o) => o.orderNumber === orderNo));

  console.log('\n[7] Admin approves payment');
  r = await admin.call('GET', '/api/admin/payments');
  const pay = r.json.data?.find((p) => p.utrNumber === utr);
  check('admin sees pending UTR', pay && pay.status === 'pending');
  r = await student.call('GET', '/api/student/me');
  check('student not yet unlocked', r.json.student.mentorshipAccess === false && r.json.student.paymentStatus === 'pending_approval');
  r = await admin.call('POST', `/api/admin/payments/${pay.id}/approve`, {});
  check('approve ok', r.status === 200 && r.json.success);
  r = await student.call('GET', '/api/student/me');
  check('student unlocked after approval', r.json.student.mentorshipAccess === true && r.json.student.paymentStatus === 'approved' && r.json.student.purchasedCourse?.utrNumber === utr);

  console.log('\n[8] Study index access rules');
  r = await student.call('PUT', '/api/student/study-index', { rows: [{ id: 'a' }] });
  check('student edit blocked before admin grants access (403)', r.status === 403);
  r = await admin.call('POST', `/api/admin/students/${code}/study-index-access`, { grant: true });
  check('admin grants index access', r.status === 200 && r.json.studyIndexAccess === true);
  r = await student.call('PUT', '/api/student/study-index', { rows: [{ id: 'a', topic: 'saved' }] });
  check('student can save index now', r.status === 200);
  r = await student.call('GET', '/api/student/me');
  check('index rows persisted in DB', r.json.student.studyIndexRows?.[0]?.topic === 'saved');

  console.log('\n[9] Admin edits student');
  r = await admin.call('PATCH', `/api/admin/students/${code}`, { program: 'CS Professional', level: 'Level 3', group: 'Group 2' });
  check('program change regenerates syllabus + index id', r.json.student?.assignedIndexId === 'prof-g2' && r.json.student.trackerRows.length > 5, JSON.stringify(r.json).slice(0, 200));

  console.log('\n[10] Password reset (no token leak)');
  r = await guest.call('POST', '/api/auth/forgot-password', { email });
  check('forgot-password does NOT return token/link', r.status === 200 && !('token' in r.json) && !('resetUrl' in r.json));
  r = await admin.call('POST', `/api/admin/students/${code}/reset-link`, {});
  const token = new URL(r.json.resetUrl).searchParams.get('resetToken');
  check('admin can generate reset link', Boolean(token));
  r = await guest.call('POST', '/api/auth/reset-password', { token, newPassword: 'newsecret456' });
  check('reset with token ok', r.status === 200);
  r = await guest.call('POST', '/api/auth/reset-password', { token, newPassword: 'another789' });
  check('token is single-use', r.status === 400);
  r = await student.call('GET', '/api/auth/me');
  check('old session invalid after password change', r.json.student === null);
  r = await s2.call('POST', '/api/auth/login', { emailOrPhone: email, password: 'newsecret456' });
  check('login with new password', r.status === 200);

  console.log('\n[11] Admin manages bookings');
  r = await admin.call('PATCH', `/api/admin/free-bookings/${freeId}`, { status: 'confirmed', adminRemarks: 'called' });
  check('booking status updated in DB', r.json.booking?.status === 'confirmed' && r.json.booking?.adminRemarks === 'called');
  r = await admin.call('GET', '/api/admin/students');
  check('admin lists real students from DB', r.json.data?.some((s) => s.studentId === code));

  console.log('\n[12] CSRF guard');
  const res = await fetch(BASE + '/api/bookings/free', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://evil.example' }, body: '{}' });
  check('cross-site POST blocked (403)', res.status === 403);
} catch (e) {
  fail++; console.log('  ❌ Unexpected error:', e);
} finally {
  console.log('\n[cleanup]');
  try {
    const code = (await admin.call('GET', '/api/admin/students')).json?.data?.find((s) => s.email === email)?.studentId;
    if (code) await admin.call('DELETE', `/api/admin/students/${code}`);
    for (const id of created.free) await admin.call('DELETE', `/api/admin/free-bookings/${id}`);
    for (const id of created.inq) await admin.call('DELETE', `/api/admin/inquiries/${id}`);
    console.log('  test data removed');
  } catch {}
  console.log(`\nResult: ${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
}
