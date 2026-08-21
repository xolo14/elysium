import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createBookingInput = z.object({
  hotelId: z.enum(["madhapur", "hitec"]),
  suiteName: z.string().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(6),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  guests: z.number().int().min(1).max(6),
});

function nightsBetween(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
    throw new Error("Check-out must be after check-in");
  }
  return Math.max(1, Math.round((end - start) / 86_400_000));
}

export const createBooking = createServerFn({ method: "POST" })
  .validator(createBookingInput)
  .handler(async ({ data }) => {
    const { sql } = await import("@/lib/db");
    const nights = nightsBetween(data.checkIn, data.checkOut);

    const suites = await sql`
      SELECT id, rate_paise
      FROM suites
      WHERE hotel_id = ${data.hotelId}
        AND name = ${data.suiteName}
      LIMIT 1
    `;

    const suite = suites[0];
    if (!suite) {
      throw new Error("Suite not found for this hotel");
    }

    const nightlyRatePaise = Number(suite.rate_paise);
    const totalPaise = nightlyRatePaise * nights;

    const rows = await sql`
      INSERT INTO bookings (
        hotel_id,
        suite_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        guests,
        nights,
        nightly_rate_paise,
        total_paise
      )
      VALUES (
        ${data.hotelId},
        ${suite.id},
        ${data.guestName},
        ${data.guestEmail},
        ${data.guestPhone},
        ${data.checkIn},
        ${data.checkOut},
        ${data.guests},
        ${nights},
        ${nightlyRatePaise},
        ${totalPaise}
      )
      RETURNING id, status, nights, total_paise
    `;

    const booking = rows[0];
    if (!booking) {
      throw new Error("Failed to create booking");
    }

    return {
      id: String(booking.id),
      status: String(booking.status),
      nights: Number(booking.nights),
      totalPaise: Number(booking.total_paise),
    };
  });
