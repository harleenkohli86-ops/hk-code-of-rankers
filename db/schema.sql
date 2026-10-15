-- =====================================================================
--  HK Code of Rankers — FRESH DATABASE SCHEMA (PostgreSQL 13+ / Supabase)
--  Safe to run multiple times (idempotent). Contains NO fake/demo data.
--
--  How to run (choose one method):
--    1) Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
--    2) Terminal:  npm run db:setup      (DATABASE_URL must be set in .env)
--    3) It is also applied automatically when the app starts (AUTO_MIGRATE=true)
--
--  Security: Row Level Security is enabled on every table and there is no public policy
--  is configured. This means no data can be read or written through Supabase's public (anon) API
--  by clients. Only our Node server (using DATABASE_URL) can access the database.
-- =====================================================================

-- ---------- Sequences (human-friendly IDs) ----------
CREATE SEQUENCE IF NOT EXISTS student_code_seq START 1;
CREATE SEQUENCE IF NOT EXISTS order_no_seq     START 1001;
CREATE SEQUENCE IF NOT EXISTS free_booking_seq START 1;
CREATE SEQUENCE IF NOT EXISTS slot_booking_seq START 1;
CREATE SEQUENCE IF NOT EXISTS inquiry_seq      START 1;

-- ---------- 1. Admins ----------
CREATE TABLE IF NOT EXISTS public.admins (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'master_admin',
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS admins_email_uq ON public.admins (lower(email));

-- ---------- 2. Students ----------
CREATE TABLE IF NOT EXISTS public.students (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_code                  TEXT NOT NULL UNIQUE,               -- STU-2026-001
  full_name                     TEXT NOT NULL,
  email                         TEXT NOT NULL,
  phone                         TEXT NOT NULL DEFAULT '',
  program                       TEXT NOT NULL DEFAULT 'CS Executive',
  level                         TEXT NOT NULL DEFAULT 'Level 2',
  group_name                    TEXT NOT NULL DEFAULT 'Group 1',
  target_exam                   TEXT NOT NULL DEFAULT '',
  avatar                        TEXT,
  password_hash                 TEXT,                                -- NULL = password has not been set yet
  registration_status           TEXT NOT NULL DEFAULT 'approved'
                                CHECK (registration_status IN ('approved','rejected','pending_approval')),
  registered_at                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  registration_approved_at      TIMESTAMPTZ,
  registration_rejected_at      TIMESTAMPTZ,
  registration_rejection_reason TEXT,
  payment_status                TEXT NOT NULL DEFAULT 'unpaid'
                                CHECK (payment_status IN ('unpaid','pending_approval','approved','rejected')),
  payment_approved_at           TIMESTAMPTZ,
  payment_rejected_at           TIMESTAMPTZ,
  payment_rejection_reason      TEXT,
  mentorship_access             BOOLEAN NOT NULL DEFAULT false,
  study_index_access            BOOLEAN NOT NULL DEFAULT false,
  assigned_index_id             TEXT NOT NULL DEFAULT 'exec-g1',
  tracker_rows                  JSONB NOT NULL DEFAULT '[]'::jsonb,
  study_index_rows              JSONB NOT NULL DEFAULT '[]'::jsonb,
  monthly_calls                 JSONB NOT NULL DEFAULT '[]'::jsonb,
  admin_notes                   TEXT,                                -- private (visible only to the admin)
  mentor_remarks                TEXT,                                -- also visible to the student (overall mentor remark)
  is_active                     BOOLEAN NOT NULL DEFAULT true,
  last_login_at                 TIMESTAMPTZ,
  login_count                   INTEGER NOT NULL DEFAULT 0,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS students_email_uq ON public.students (lower(email));
-- Two accounts cannot be created with the same phone number (last 10 digits)
CREATE UNIQUE INDEX IF NOT EXISTS students_phone10_uq
  ON public.students (right(regexp_replace(phone, '\D', '', 'g'), 10))
  WHERE length(regexp_replace(phone, '\D', '', 'g')) >= 10;
CREATE INDEX IF NOT EXISTS students_created_idx ON public.students (created_at DESC);
CREATE INDEX IF NOT EXISTS students_payment_idx ON public.students (payment_status);

-- ---------- 3. Payments / Orders (UPI UTR submissions) ----------
CREATE TABLE IF NOT EXISTS public.payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         TEXT NOT NULL UNIQUE,                            -- ORD-2026-1001
  student_id       UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id        TEXT NOT NULL,
  course_name      TEXT NOT NULL,
  items            JSONB NOT NULL DEFAULT '[]'::jsonb,
  amount           NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_code    TEXT,
  discount_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
  final_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method   TEXT NOT NULL DEFAULT 'UPI',
  utr_number       TEXT,
  status           TEXT NOT NULL DEFAULT 'pending_approval'
                   CHECK (status IN ('pending_approval','approved','rejected')),
  proof_notes      TEXT,
  rejection_reason TEXT,
  reviewed_by      TEXT,
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- The same UTR cannot be submitted twice (except after rejection)
CREATE UNIQUE INDEX IF NOT EXISTS payments_utr_uq
  ON public.payments (utr_number) WHERE utr_number IS NOT NULL AND status <> 'rejected';
CREATE INDEX IF NOT EXISTS payments_student_idx ON public.payments (student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payments_status_idx  ON public.payments (status);

-- ---------- 4. Free one-to-one bookings (public website form) ----------
CREATE TABLE IF NOT EXISTS public.free_bookings (
  id             TEXT PRIMARY KEY,                                  -- FREE-2026-001
  name           TEXT NOT NULL,
  email          TEXT NOT NULL DEFAULT '',
  phone          TEXT NOT NULL,
  program        TEXT NOT NULL DEFAULT '',
  target_exam    TEXT NOT NULL DEFAULT '',
  preferred_slot TEXT NOT NULL DEFAULT '',
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'booked'
                 CHECK (status IN ('pending','booked','confirmed','rescheduled','completed','cancelled')),
  admin_remarks  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS free_bookings_created_idx ON public.free_bookings (created_at DESC);

-- ---------- 5. Paid-student mentorship call slot bookings ----------
CREATE TABLE IF NOT EXISTS public.slot_bookings (
  id            TEXT PRIMARY KEY,                                   -- SLOT-2026-001
  student_id    UUID REFERENCES public.students(id) ON DELETE SET NULL,
  student_name  TEXT NOT NULL,
  email         TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL DEFAULT '',
  program       TEXT NOT NULL DEFAULT '',
  group_name    TEXT NOT NULL DEFAULT '',
  booking_date  TEXT NOT NULL,
  booking_time  TEXT NOT NULL,
  call_type     TEXT NOT NULL DEFAULT '',
  notes         TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','confirmed','completed','cancelled')),
  admin_remarks TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS slot_bookings_created_idx ON public.slot_bookings (created_at DESC);

-- ---------- 6. Inquiries / leads (contact form, join-mentorship form, newsletter) ----------
CREATE TABLE IF NOT EXISTS public.inquiries (
  id                TEXT PRIMARY KEY,                               -- INQ-2026-0001
  kind              TEXT NOT NULL DEFAULT 'inquiry',                -- inquiry | mentorship_enquiry | contact | newsletter
  name              TEXT NOT NULL,
  email             TEXT NOT NULL DEFAULT '',
  phone             TEXT NOT NULL DEFAULT '',
  program           TEXT NOT NULL DEFAULT '',
  attempt           TEXT NOT NULL DEFAULT '',
  subject_mode      TEXT,
  selected_subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  product_id        TEXT,
  message           TEXT,
  status            TEXT NOT NULL DEFAULT 'new',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS inquiries_created_idx ON public.inquiries (created_at DESC);

-- ---------- 7. Discount / promo codes ----------
CREATE TABLE IF NOT EXISTS public.discount_codes (
  code                 TEXT PRIMARY KEY,
  discount_percent     INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  is_active            BOOLEAN NOT NULL DEFAULT true,
  is_multi_use         BOOLEAN NOT NULL DEFAULT false,
  usage_limit          INTEGER,
  usage_count          INTEGER NOT NULL DEFAULT 0,
  is_used              BOOLEAN NOT NULL DEFAULT false,
  used_by_student_code TEXT,
  used_by_name         TEXT,
  used_by_email        TEXT,
  used_with_order_id   TEXT,
  used_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- 8. Password reset tokens (only the hash is stored) ----------
CREATE TABLE IF NOT EXISTS public.password_resets (
  token_hash TEXT PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_resets_student_idx ON public.password_resets (student_id);

-- ---------- 9. Admin audit log ----------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           BIGSERIAL PRIMARY KEY,
  action       TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  details      JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip           TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON public.audit_logs (created_at DESC);

-- ---------- Row Level Security: ON, no public policies ----------
ALTER TABLE public.admins          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.free_bookings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_bookings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs      ENABLE ROW LEVEL SECURITY;

-- ---------- Seed: promo codes (business config, no student data) ----------
-- 5% reusable codes (website par were already being advertised)
INSERT INTO public.discount_codes (code, discount_percent, is_multi_use) VALUES
  ('HK5',5,true),('NEXT5',5,true),('MENTOR5',5,true),('NEXTOFFER',5,true),('CS5',5,true),
  ('FEB2027',5,true),('FEB5',5,true),('FEB27',5,true),('JUNE2027',5,true),('JUNE5',5,true),
  ('JUNE27',5,true),('DISCOUNT5',5,true)
ON CONFLICT (code) DO NOTHING;

-- 15% single-use ranker codes

INSERT INTO public.discount_codes (code, discount_percent) VALUES
  ('AIR1',15),('RANKER15',15),('CSVICTORY',15),('HARSHITA15',15),('TOPPER15',15),
  ('EXCEL15',15),('SUCCESS15',15),('ICSI15',15),('FUTURECS',15),('GOLDEN15',15),
  ('CSDEC15',15),('HK15-A7K9P',15),('HK15-B4M8Q',15),('HK15-C6R2X',15),('HK15-D9L5N',15),
  ('HK15-E3T7V',15),('HK15-F8P4K',15),('HK15-G2W6M',15),('HK15-H5Q9R',15),('HK15-J7N3X',15),
  ('HK15-K4V8T',15),('HK15-L6M2P',15)
ON CONFLICT (code) DO NOTHING;
