-- ============================================================
-- TELC Exam Registration — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Exam levels with dynamic pricing
CREATE TABLE IF NOT EXISTS exam_levels (
  id SERIAL PRIMARY KEY,
  level VARCHAR(10) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam sessions (date, time, location, capacity)
CREATE TABLE IF NOT EXISTS exams (
  id SERIAL PRIMARY KEY,
  level_id INTEGER NOT NULL REFERENCES exam_levels(id) ON DELETE CASCADE,
  region VARCHAR(50) NOT NULL,
  address TEXT,
  exam_date TIMESTAMPTZ NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 30,
  registered_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations
CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(320) NOT NULL,
  passport_number VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  payment_verified BOOLEAN NOT NULL DEFAULT FALSE,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(passport_number, exam_id)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  registration_id INTEGER NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  transaction_id VARCHAR(100),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP verifications for email confirmation
CREATE TABLE IF NOT EXISTS otp_verifications (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users (role: admin or superadmin)
CREATE TABLE IF NOT EXISTS telc_admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  name VARCHAR(200),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin sessions (simple token-based auth)
CREATE TABLE IF NOT EXISTS telc_admin_sessions (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES telc_admins(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Seed default exam levels
-- ============================================================
INSERT INTO exam_levels (level, price) VALUES
  ('A2/B1', 250000),
  ('B1', 300000),
  ('B2', 350000),
  ('C1', 400000)
ON CONFLICT (level) DO NOTHING;

-- ============================================================
-- Seed default superadmin
-- Password: Admin1234  (SHA-256 hashed below)
-- CHANGE THIS PASSWORD after first login via the admin panel
-- ============================================================
INSERT INTO telc_admins (email, password_hash, role, name) VALUES
  ('admin@profi-deutsch.uz', '3ac4f34e4f6809c57e5616a18e7e6ba44f8c4d90b18a9219aa48c3b1cd8d6c98', 'superadmin', 'Super Admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- Row Level Security (disable for now — enable in production)
-- ============================================================
ALTER TABLE exam_levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE telc_admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE telc_admin_sessions DISABLE ROW LEVEL SECURITY;
