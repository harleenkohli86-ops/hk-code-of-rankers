Bilkul! Maine aapke client ke HK Code of Rankers project documentation ko professional English mein rewrite kar diya hai. Is version mein proper headings, clean tables, technical details, setup instructions, deployment steps, aur security guidelines hain. Aap ise directly apne project ki `README.md` file mein use kar sakte hain.

Writing

# HK Code of Rankers

### Full-Stack Website, Student Portal & Admin Dashboard

A full-stack web application built with **React, Vite, Node.js, Express, and PostgreSQL** to manage student registrations, mentorship bookings, payments, course access, academic trackers, study materials, inquiries, and administrative operations.

The platform is designed with a centralized database architecture, secure authentication, role-based access, and server-side validation.

---

## 1\. Project Overview

**HK Code of Rankers** provides a centralized platform for students and administrators, combining a public-facing website, a dedicated student portal, and a secure admin dashboard.

### Core Features

- **Public Website:** Course information, free one-on-one booking, contact forms, mentorship applications, and newsletter subscriptions.
- **Student Portal:** Registration, login, password recovery, payment submission, and access to approved courses and study resources.
- **Admin Dashboard:** Student management, booking management, payment verification, inquiries, academic trackers, monthly calls, study index management, and promotional codes.
- **Database Management:** Persistent storage of application data in PostgreSQL.
- **Security:** Hashed passwords, secure session cookies, server-side authorization, password-reset tokens, and administrative audit logs.
- **Email Notifications:** Optional email integration for account management, booking updates, payment notifications, and password recovery.

### Technology Stack

| Component | Technology |
| --- | --- |
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Database Hosting | Supabase or any compatible PostgreSQL provider |
| Authentication | Secure cookie-based sessions |
| Password Security | Scrypt password hashing |
| Email Integration | Resend or SMTP |
| Production Build | Vite + bundled Node.js server |

---

## 2\. Application Modules & Database Integration

All primary application records are stored in PostgreSQL and managed through the backend API.

| Module | Functionality | Database Table(s) |
| --- | --- | --- |
| Free One-on-One Booking | Saves submitted booking requests and makes them available in the admin dashboard | `free_bookings` |
| Contact & Lead Management | Stores contact forms, mentorship applications, and newsletter submissions | `inquiries` |
| Student Registration & Authentication | Handles registration, login, and account credentials | `students` |
| Password Recovery | Manages password-reset requests and tokens | `password_resets` |
| UPI Payment Verification | Stores payment submissions and UTR references for admin review | `payments` |
| Payment Approval | Records payment status and triggers eligible course or study-index access | `payments`, `students` |
| Student Management | Manages student profiles and administrative updates | `students` |
| Academic Tracker | Stores student progress and tracker-related data | Relevant application tables |
| Monthly Calls | Manages monthly student call information | Relevant application tables |
| Study Index | Manages study-index access and related information | Relevant application tables |
| Promotional Codes | Validates and manages discount codes on the server | `discount_codes` |
| Administrative Audit Trail | Records administrative actions for accountability | `audit_logs` |

_Note: The exact tables used for academic trackers, monthly calls, and study-index records should be confirmed against the implemented database schema._

---

## 3\. Data Storage & Application Architecture

The application uses PostgreSQL as its primary persistent data store.

### Data Storage Policy

- Student accounts, admin credentials, bookings, payments, inquiries, promotional codes, and other persistent records are stored in the database.
- Authentication and authorization are handled by the backend.
- The browser does not use `localStorage` or JSON files as the primary persistent data store.
- Cookies are used for session authentication.
- The shopping cart may use temporary client-side state where required.
- Server-side validation is used for sensitive operations, including authentication, payment status changes, and promotional-code verification.
- Any in-memory cache used by the frontend or backend is not a replacement for database persistence.

**Important:** The actual implementation should be reviewed to confirm that all persistent data is loaded from and saved to the database as intended.

---

## 4\. Local Development Setup

### Prerequisites

Install the following before running the project:

- Node.js 18 or later; Node.js 20 or 22 is recommended.
- npm.
- A PostgreSQL database, either through Supabase or a local PostgreSQL installation.
- Git, if you are cloning the project repository.

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```
npm install
```

### Step 2: Configure Environment Variables

Create your local environment file from the example:

```
cp .env.example .env
```

On Windows Command Prompt, use:

```
copy .env.example .env
```

Open `.env` and configure the required values:

```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_admin_password
APP_URL=http://localhost:3000
```

Configure optional email variables if email delivery is required.

**Security requirements:**

- Use a unique, strong `SESSION_SECRET`.
- Use a strong administrator password.
- Never commit `.env` or production credentials to Git.
- Keep `.env.example` free of real credentials.

### Step 3: Set Up the Database

The application is designed to initialize its database schema and administrator account during startup, according to its configured initialization logic.

You can also apply the database schema explicitly:

```
npm run db:setup
```

If the application does not automatically initialize the schema or administrator account, run the appropriate setup command before starting the server.

### Step 4: Start the Development Server

```
npm run dev
```

### Local Application URLs

| Application | URL |
| --- | --- |
| Main Website | `http://localhost:3000` |
| Admin Dashboard | `http://localhost:3000/admin` |
| Student Portal | `http://localhost:3000/student-portal` |

The actual routes and startup port should match the project configuration.

---

## 5\. PostgreSQL Database Configuration

The application supports Supabase PostgreSQL and other compatible PostgreSQL providers.

### Option A: Supabase (Recommended)

1. Visit [Supabase](<https://supabase.com/>) and create a new project.
2. Set and securely store the database password.
3. Open **Project Settings → Database**.
4. Copy the appropriate PostgreSQL connection string. Use the Session Pooler connection string when appropriate for your hosting environment.
5. Replace the password placeholder with your actual database password.
6. Add the completed connection string to `DATABASE_URL` in your `.env` file.
7. Run the database setup command if required.

Example:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

If your password contains reserved URL characters, encode them correctly before inserting the password into the connection string.

**Database security:** Keep the database connection string private. Do not expose database credentials or privileged service-role keys in frontend code.

### Option B: Local PostgreSQL

Create a local database:

```
createdb hkrankers
```

Configure the connection string:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/hkrankers
```

Replace `USER` and `PASSWORD` with your local PostgreSQL credentials.

Then apply the schema:

```
npm run db:setup
```

---

## 6\. Admin Dashboard & Account Management

### Initial Administrator Setup

The initial administrator account is configured through:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

The project configuration requires an administrator password of at least eight characters. A longer, unique password is recommended for production.

### Create or Reset an Administrator Account

Use the provided CLI script:

```
npm run create-admin -- "admin@example.com" "NewStrongPassword" "Harkiran Kaur" "9284084523"
```

The supported arguments depend on the script implementation. Confirm the expected argument order before running it.

### Administrator Security

- Administrator authentication is handled on the server.
- The account is locked for 15 minutes after six consecutive incorrect login attempts, according to the documented configuration.
- Administrative actions can be recorded in `audit_logs`.
- Sensitive account changes should be authorized and validated by the backend.

---

## 7\. Student Registration & Password Management

### Student Registration and Login

Students can create an account and sign in to the student portal.

The authentication system uses:

- Scrypt-based password hashing.
- Secure, cookie-based sessions.
- Server-side authentication checks.
- Password-reset tokens for account recovery.

### Administrator-Created Student Accounts

Administrators can add students through the dashboard.

When a student is created without a password, the application can generate a password-setup link. The documented link validity period is seven days.

Where email delivery is configured, the setup link can also be sent to the student automatically.

### Forgot Password

Students can request a password-reset link through the student portal.

- Reset links are sent by email when email delivery is configured.
- Reset links are valid for 60 minutes.
- A reset token can be used only once.
- If email delivery is unavailable, the administrator may retrieve a supported reset link through the admin dashboard, if that functionality is implemented.

Password-reset tokens should be securely generated, expire as configured, and be invalidated after successful use.

---

## 8\. Student Payments & Course Access

The platform supports UPI payments with administrator verification.

### Payment Workflow

1. The student submits a payment and the required UTR reference.
2. The backend creates a payment record in PostgreSQL.
3. The payment remains pending until an administrator reviews it.
4. The administrator approves or rejects the submission.
5. On approval, the application updates the relevant payment status and unlocks the eligible course or study-index access.
6. The student can view the resulting access through the student portal.

### Payment Database

The `payments` table stores payment records and their verification status. Student access information is maintained through the relevant application records.

### Important Payment Security Considerations

- Validate payment submissions on the server.
- Restrict approval and rejection actions to authorized administrators.
- Do not grant access merely because a student submits a UTR.
- Prevent unauthorized changes to payment status.
- Record relevant administrative payment decisions.
- Use transactions where necessary to keep payment and access updates consistent.

---

## 9\. Bookings, Inquiries & Lead Management

The public website provides several lead-generation features.

### Free One-on-One Booking

Booking submissions are stored in `free_bookings` and can be reviewed through the admin dashboard.

### Contact Form

Contact requests are stored in `inquiries` for administrative follow-up.

### Join Mentorship

Mentorship applications are stored as inquiries so the team can review prospective students.

### Newsletter Subscription

Newsletter submissions are stored in the database through the inquiry-management workflow.

Email notifications may be sent when the relevant email integration is configured.

---

## 10\. Promo Codes & Academic Management

### Promotional Codes

Administrators can create and manage discount codes through the dashboard.

The backend validates promotional codes to prevent unauthorized or invalid discounts.

Promotional-code rules should be enforced server-side, including expiry dates, eligibility, and any usage restrictions supported by the implementation.

### Student Tracker

Student academic progress and tracker-related updates are managed through the application and persisted using the relevant database records.

### Monthly Calls

Administrators can manage monthly call information for students.

### Study Index

Study-index information and eligible student access are managed through the application. Access should follow the configured authorization and payment-approval rules.

---

## 11\. Email Notifications

Email integration is optional.

The application supports configuration through either a Resend API key or SMTP settings, depending on the implemented mailer configuration.

### Supported Configuration

- Resend API integration.
- SMTP-based email delivery.
- Environment-based email credentials.

### Notification Types

Depending on the implemented notification handlers, emails may cover:

- Student registration.
- Payment submission.
- Payment approval or rejection.
- Free booking requests.
- Contact and mentorship inquiries.
- Password-reset requests.
- Student password-setup links.

Without a configured email provider, the application may continue to support its other features, but email notifications will not be delivered.

Configure email credentials in the hosting environment rather than hardcoding them in the source code.

---

## 12\. Production Deployment on Hostinger

The application requires hosting that supports a running Node.js server and a persistent PostgreSQL connection.

A static-only hosting plan or PHP-only hosting environment is not sufficient for the backend unless the backend is deployed separately.

### Step 1: Prepare the Project

Before deployment, verify that the project builds successfully:

```
npm install
npm run build
```

Confirm that the production output matches the configured build process. The documented build outputs are:

- `dist/client` — frontend assets.
- `dist/server.cjs` — bundled server entry point.

### Step 2: Configure Node.js Hosting

1. Open the Hostinger control panel.
2. Select a hosting environment that supports Node.js applications.
3. Upload the project or connect the repository.
4. Select a compatible Node.js version, preferably Node.js 20 or 22.
5. Configure the installation and startup commands according to the hosting interface.

Recommended commands, if supported by the project configuration:

```
npm install
npm run build
npm start
```

If the platform manages builds separately, configure the build command in its build settings and use `npm start` as the application startup command.

### Step 3: Configure Production Environment Variables

Set the required variables in the hosting environment:

```
DATABASE_URL=your_production_postgresql_connection_string
SESSION_SECRET=your_production_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_admin_password
APP_URL=https://your-domain.com
```

Add the optional email configuration if required.

Use the actual environment-variable names expected by the project.

### Step 4: Configure the Domain and HTTPS

- Connect the production domain to the Node.js application.
- Enable HTTPS with a valid TLS certificate.
- Configure the application URL correctly.
- Ensure secure session cookies work behind the hosting platform's proxy configuration.
- Confirm that the database is reachable from the application server.

### Step 5: Verify the Deployment

After deployment, test the following:

- Public website loads correctly.
- Booking and inquiry forms save data.
- Administrator login works.
- Student registration and login work.
- Password-reset behavior matches the email configuration.
- Payments remain pending until approval.
- Approved payments grant the correct access.
- Academic tracker and study-index updates persist after refreshing.
- Production logs do not expose credentials or sensitive tokens.

---

## 13\. Environment Variables Reference

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret used for session security |
| `ADMIN_EMAIL` | Yes for initial admin setup | Initial administrator email |
| `ADMIN_PASSWORD` | Yes for initial admin setup | Initial administrator password |
| `APP_URL` | Yes for production configuration | Public application URL |
| `RESEND_API_KEY` | Optional | Resend email integration |
| `SMTP_*` | Optional | SMTP email configuration |

_The exact SMTP variable names and any additional environment variables must match__`.env.example`__and the application's configuration code._

---

## 14\. Available NPM Commands

| Command | Description |
| --- | --- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the frontend and production server |
| `npm start` | Starts the production server |
| `npm run db:setup` | Applies the database schema |
| `npm run create-admin -- "email" "password"` | Creates or resets an administrator account |
| `npm run lint` | Runs the configured lint or type-check process |
| `npm test` | Runs the API smoke-test suite against a running server |

### Running API Smoke Tests

Start the application in one terminal. In a separate terminal, run:

```
BASE=http://localhost:3000 \
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD='your_test_password' \
npm test
```

Use a dedicated test or staging database only.

The documented smoke test automatically deletes its own test data. Verify the test implementation before running it, and never run destructive tests against a production database.

---

## 15\. Project Structure

```
project-root/
├── db/
│   └── schema.sql
├── server.ts
├── server/
│   ├── config/
│   ├── db/
│   ├── security/
│   ├── mailer/
│   └── routes/
│       ├── public/
│       ├── student/
│       └── admin/
├── scripts/
│   ├── db-setup
│   ├── create-admin
│   └── smoke-test
├── src/
│   ├── lib/
│   │   ├── api.ts
│   │   └── backend.ts
│   ├── services/
│   │   └── centralStudentDatabase.ts
│   └── shared/
│       └── tracker.ts
├── dist/
├── .env.example
├── package.json
└── README.md
```

_This is a logical representation of the documented project structure. Actual filenames, directories, and generated build files should be verified against the repository._

### Key Files

- `db/schema.sql` — Database schema definition.
- `server.ts` — Express application entry point.
- `server/` — Backend configuration, database access, security, email, and API routes.
- `scripts/` — Database setup, administrator management, and smoke testing.
- `src/` — React frontend, API clients, application services, and shared tracker logic.
- `dist/` — Generated production build output.
- `.env.example` — Environment-variable template without production secrets.

---

## 16\. Security & Data Protection

Security is a core requirement for an application that handles student accounts, payment references, and administrative access.

### Authentication & Authorization

- Hash passwords using the configured scrypt implementation.
- Use secure session cookies with appropriate production settings.
- Validate authorization on the server for all protected endpoints.
- Apply rate limits and account-lockout protections to authentication routes.
- Keep password-reset links time-limited and single-use.

### Database Security

- Access the database through the trusted backend.
- Do not expose `DATABASE_URL` or privileged database credentials in frontend code.
- Keep database credentials out of Git repositories and public documentation.
- Apply least-privilege database permissions wherever practical.
- Back up production data and periodically test restoration.

### Supabase Security

If Supabase is used:

- Enable Row Level Security (RLS) on applicable tables.
- Define policies according to the application's actual access requirements.
- Do not expose privileged service-role credentials to the browser.
- Confirm that unauthorized users cannot read or modify protected records through the Supabase API.

RLS being enabled without public policies is not, by itself, proof that the entire application is secure. Verify the policies, grants, database roles, and backend access paths before launch.

### Payment & Administrative Security

- Validate all payment and promo-code operations on the server.
- Restrict payment approval and rejection to authorized administrators.
- Record sensitive administrative actions in `audit_logs`.
- Protect student data and prevent unauthorized access across student accounts.
- Avoid logging passwords, session secrets, reset tokens, or database credentials.

### Secret Rotation

If database passwords, API keys, or other credentials were previously committed to a repository or shared publicly, revoke or rotate them before production deployment.

---

## 17\. Pre-Launch Checklist

Use this checklist before handing the application over to the client.

- [ ]PostgreSQL connection verified.
- [ ]Database schema applied successfully.
- [ ]Initial administrator account configured.
- [ ]Administrator authentication and account lockout tested.
- [ ]Student registration and login tested.
- [ ]Password reset and password-setup flows tested.
- [ ]Booking and inquiry submissions verified in PostgreSQL.
- [ ]Payment approval and rejection tested.
- [ ]Course and study-index access permissions verified.
- [ ]Academic tracker and monthly call updates verified.
- [ ]Promotional-code validation tested.
- [ ]Email delivery tested, if configured.
- [ ]Production environment variables secured.
- [ ]HTTPS and secure session cookies verified.
- [ ]Database backup and recovery plan prepared.
- [ ]API smoke tests passed against a non-production database.
- [ ]Production build and startup commands verified.
- [ ]No real credentials committed to Git.
- [ ]Client handover documentation completed.

---

## 18\. Maintenance & Future Improvements

Recommended improvements for long-term reliability include:

- Automated PostgreSQL backups and recovery testing.
- Centralized application logging and error monitoring.
- Additional API integration and authorization tests.
- Improved administrative reporting and payment reconciliation.
- Email delivery monitoring and retry handling.
- Database migration management for future schema changes.
- Accessibility and mobile responsiveness testing.
- Documented incident-response and credential-rotation procedures.

---

## 19\. Project Summary

**HK Code of Rankers** is a full-stack educational management platform designed to bring student services, mentorship bookings, payment verification, study resources, and administrative workflows into one centralized application.

With a React and Vite frontend, a Node.js and Express backend, and PostgreSQL persistence, the platform provides a foundation for managing student operations through a dedicated website, student portal, and admin dashboard.

Production readiness depends on verifying the implemented functionality, configuring the database and hosting environment correctly, and completing the security and deployment checks described in this document.

---

**Project:** HK Code of Rankers\
**Architecture:** React + Vite / Node.js + Express / PostgreSQL\
**Database Provider:** Supabase or compatible PostgreSQL\
**Deployment Target:** Node.js-compatible hosting\
**Documentation:** Setup, features, database configuration, deployment, security, and maintenance