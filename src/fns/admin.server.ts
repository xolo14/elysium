import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";

import {
  ADMIN_COOKIE,
  createAdminToken,
  isValidAdminToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import type { AdminBooking, BookingStatus } from "@/lib/bookings-shared";
import { sql } from "@/lib/db";

type BookingRow = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  total_paise: number;
  status: BookingStatus;
  created_at: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  hotel_name: string;
  hotel_place: string;
  suite_name: string;
};

function mapBooking(row: BookingRow): AdminBooking {
  return {
    id: row.id,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    guestPhone: row.guest_phone,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: Number(row.guests),
    nights: Number(row.nights),
    totalPaise: Number(row.total_paise),
    status: row.status,
    createdAt: row.created_at,
    checkedInAt: row.checked_in_at,
    checkedOutAt: row.checked_out_at,
    hotelName: row.hotel_name,
    hotelPlace: row.hotel_place,
    suiteName: row.suite_name,
  };
}

function requireAdmin() {
  if (!isValidAdminToken(getCookie(ADMIN_COOKIE))) {
    throw new Error("Unauthorized");
  }
}

async function fetchBookings(view: "active" | "history") {
  const rows =
    view === "active"
      ? await sql`
          SELECT
            b.id,
            b.guest_name,
            b.guest_email,
            b.guest_phone,
            b.check_in,
            b.check_out,
            b.guests,
            b.nights,
            b.total_paise,
            b.status,
            b.created_at,
            b.checked_in_at,
            b.checked_out_at,
            h.name AS hotel_name,
            h.place AS hotel_place,
            s.name AS suite_name
          FROM bookings b
          JOIN hotels h ON h.id = b.hotel_id
          JOIN suites s ON s.id = b.suite_id
          WHERE b.status IN ('pending', 'confirmed', 'checked_in')
          ORDER BY b.check_in ASC, b.created_at DESC
        `
      : await sql`
          SELECT
            b.id,
            b.guest_name,
            b.guest_email,
            b.guest_phone,
            b.check_in,
            b.check_out,
            b.guests,
            b.nights,
            b.total_paise,
            b.status,
            b.created_at,
            b.checked_in_at,
            b.checked_out_at,
            h.name AS hotel_name,
            h.place AS hotel_place,
            s.name AS suite_name
          FROM bookings b
          JOIN hotels h ON h.id = b.hotel_id
          JOIN suites s ON s.id = b.suite_id
          WHERE b.status IN ('checked_out', 'cancelled', 'completed')
          ORDER BY b.checked_out_at DESC NULLS LAST, b.created_at DESC
        `;

  return (rows as BookingRow[]).map(mapBooking);
}

export async function adminLoginImpl(data: { password: string }) {
  if (!verifyAdminPassword(data.password)) {
    throw new Error("Invalid password");
  }

  setCookie(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return { ok: true as const };
}

export async function adminLogoutImpl() {
  deleteCookie(ADMIN_COOKIE, { path: "/" });
  return { ok: true as const };
}

export async function getAdminSessionImpl() {
  return { authenticated: isValidAdminToken(getCookie(ADMIN_COOKIE)) };
}

export async function getAdminBookingsImpl(data: { view: "active" | "history" }) {
  requireAdmin();
  return fetchBookings(data.view);
}

export async function adminCheckInImpl(data: { bookingId: string }) {
  requireAdmin();

  const rows = await sql`
    UPDATE bookings
    SET
      status = 'checked_in',
      checked_in_at = NOW(),
      updated_at = NOW()
    WHERE id = ${data.bookingId}
      AND status IN ('pending', 'confirmed')
    RETURNING id
  `;

  if (!rows[0]) {
    throw new Error("Booking not found or already checked in");
  }

  return { ok: true as const };
}

export async function adminCheckOutImpl(data: { bookingId: string }) {
  requireAdmin();

  const rows = await sql`
    UPDATE bookings
    SET
      status = 'checked_out',
      checked_out_at = NOW(),
      updated_at = NOW()
    WHERE id = ${data.bookingId}
      AND status = 'checked_in'
    RETURNING id
  `;

  if (!rows[0]) {
    throw new Error("Booking not found or not checked in");
  }

  return { ok: true as const };
}

export async function adminCancelBookingImpl(data: { bookingId: string }) {
  requireAdmin();

  const rows = await sql`
    UPDATE bookings
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = ${data.bookingId}
      AND status IN ('pending', 'confirmed')
    RETURNING id
  `;

  if (!rows[0]) {
    throw new Error("Booking cannot be cancelled");
  }

  return { ok: true as const };
}
