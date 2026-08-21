ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'checked_in';
ALTER TYPE booking_status ADD VALUE IF NOT EXISTS 'checked_out';

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_bookings_checked_in_at ON bookings (checked_in_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_checked_out_at ON bookings (checked_out_at DESC);
