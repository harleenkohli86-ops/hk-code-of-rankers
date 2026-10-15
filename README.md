# HK Code of Rankers — Website + Student Portal + Admin Portal

React (Vite) frontend + Node/Express backend + **PostgreSQL** database (Supabase or koi bhi Postgres).

All data (students, admin, bookings, payments, inquiries, promo codes, tracker/index) is saved **in the database**.
There is no data storage in the browser (localStorage/JSON) is not set — only the cart and login cookie.

---

## 1. What works

| Jagah | What happens | Database table |
|---|---|---|
| Website → **Free 1-on-1 booking** | Saved to the DB when the form is submitted and immediately shown in the admin panel | `free_bookings` |
| Website → Contact / Join Mentorship / Newsletter | Lead saved in the DB; admin **Inquiries** can see it in | `inquiries` |
| Student **Register / Login / Forgot password** | Password hashed (scrypt), secure cookie session, reset link sirf email par | `students`, `password_resets` |
| Student → **UPI payment (UTR)** | An order is created and remains pending for admin approval | `payments` |
| Admin → **Payment approve/reject** | Approve par course/index access automatically unlock | `payments`, `students` |
| Admin → Students, tracker, monthly calls, Study Index | Everything comes from the DB and is saved to the DB | `students` |
| Admin → Promo codes | Validated on the server | `discount_codes` |
| Record of admin actions | Who did what | `audit_logs` |

---

## 2. Local par chalana (testing)

```bash
npm install
cp .env.example .env        # then fill DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD in .env
npm run dev                 # http://localhost:3000
```

Pehli baar start par tables aur admin **automatically ban jaate hain**.

* Website: `http://localhost:3000`
* Admin: `http://localhost:3000/admin`  (ADMIN_EMAIL / ADMIN_PASSWORD se login)
* Student portal: `http://localhost:3000/student-portal`

### How to get the database (2 methods)

**A) Supabase (recommended)**
1. supabase.com → New project (DB password orad rakhein).
2. Project Settings → **Database** → Connection string → **Session pooler** → URI copy karein.
3. `[YOUR-PASSWORD]` replace it with your DB password and `.env` mein `DATABASE_URL=` ke aage paste karein.
   (If the password contains special characters such as `@ # / :`, URL-encode them — or reset the password to a simple password in Supabase.)
4. (Optional) SQL Editor mein `db/schema.sql` paste karke Run — or app automatically kar dega.

**B) Local PostgreSQL**
`createdb hkrankers` → `DATABASE_URL=postgres://user:password@localhost:5432/hkrankers`

---

## 3. Production / Hostinger par deploy

You need **Node.js hosting** on Hostinger (Business/Cloud plan → *Websites → Node.js Apps*). The login/database backend does not run on static/PHP-only hosting.

1. Upload this folder's ZIP to the Node.js App (or connect it from GitHub). `dist/` already contains a build.
2. Node version **18+** (20/22 best).
3. **Environment variables** panel mein `.env.example` ki values (at minimum: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `APP_URL`).
4. Install command: `npm install` — Start command: `npm start` (or startup file `server.js`).
5. Agar host build bhi chalata hai to build command: `npm run build`.
6. Domain par HTTPS ON rakhein (cookies secure hoti hain).

Code change karke again build karna ho: `npm run build` (frontend `dist/client` + server `dist/server.cjs`).

---

## 4. Admin ka password / naor admin

* Pehla admin `.env` ke `ADMIN_EMAIL` + `ADMIN_PASSWORD` se banta hai (min 8 characters).
* Password bhool gaye / badalna hai:
  `npm run create-admin -- "admin@email.com" "NewStrongPassword" "Harkiran Kaur" "9284084523"`
* Password mein `#` ho to `.env` mein quotes lagayein: `ADMIN_PASSWORD="Abc#1234"`.
* After 6 incorrect login attempts, the account is locked for 15 minutes.

## 5. Student ka password

* A student can register automatically, or an admin can use **Add Student**.
* When an admin adds a student (without a password) → the admin receives **"Set Password" link** milta hai (WhatsApp/email par bhej sakte hain, 7 din valid). If email is configured, it is also sent automatically to the student.
* Student selects "Forgot password" → the reset link is sent by **email** (60 min, ek baar). If email is not configured: Admin → Students → the student's portal → *Password reset link* se link nikal kar bhej sakta hai.

## 6. Email (optional)

`RESEND_API_KEY` **or** `SMTP_*` set karein. Without this, everything works except email notifications are not sent (server log mein "skipped" dikhta hai). Emails: registration, payment submit/approve/reject, free booking, inquiry, password reset.

---

## 7. Commands

| Command | Kaam |
|---|---|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Production build |
| `npm start` | Production server |
| `npm run db:setup` | Apply the tables/schema to the DB |
| `npm run create-admin -- "email" "password"` | Admin banao / password reset |
| `npm run lint` | TypeScript check |
| `npm test` | API smoke test (running server par; apna test data automatically delete karta hai) |

Test chalane ke liye: server keep running, phir
`BASE=http://localhost:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=... npm test`.
(Sirf test/staging DB par run.)

## 8. Project structure

```
db/schema.sql        fresh database schema (idempotent)
server.ts            Express entry
server/              config, db, security, mailer, routes (public / student / admin)
scripts/             db-setup, create-admin, smoke-test
src/                 React app
  lib/api.ts, lib/backend.ts          server se baat karne wala code
  services/centralStudentDatabase.ts  DB se aaor data (in-memory cache) + admin/student actions
  shared/tracker.ts                   default syllabus/tracker (server + browser dono use karte hain)
dist/                built app (npm run build se banta hai)
```

## 9. Security notes

* RLS is enabled on every table and there is no public policy — data is not exposed through Supabase's public API. Only the server (`DATABASE_URL`) accesses the DB.
* `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_PASSWORD` kabhi GitHub par push na karein.
* If old Supabase project keys/passwords were present in code/notes, **rotate/reset** them from the Supabase dashboard.
