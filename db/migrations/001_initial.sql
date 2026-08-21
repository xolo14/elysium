CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE hotels (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  place TEXT NOT NULL,
  region TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  rating NUMERIC(2, 1),
  from_rate_paise INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE suites (
  id SERIAL PRIMARY KEY,
  hotel_id TEXT NOT NULL REFERENCES hotels (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_index TEXT NOT NULL,
  size_label TEXT NOT NULL,
  capacity_label TEXT NOT NULL,
  view_label TEXT NOT NULL,
  rate_paise INTEGER NOT NULL,
  UNIQUE (hotel_id, name)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id TEXT NOT NULL REFERENCES hotels (id),
  suite_id INTEGER NOT NULL REFERENCES suites (id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests SMALLINT NOT NULL CHECK (guests BETWEEN 1 AND 6),
  nights SMALLINT NOT NULL CHECK (nights >= 1),
  nightly_rate_paise INTEGER NOT NULL,
  total_paise INTEGER NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT bookings_dates_valid CHECK (check_out > check_in)
);

CREATE INDEX idx_bookings_hotel_id ON bookings (hotel_id);
CREATE INDEX idx_bookings_suite_id ON bookings (suite_id);
CREATE INDEX idx_bookings_check_in ON bookings (check_in);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_created_at ON bookings (created_at DESC);
