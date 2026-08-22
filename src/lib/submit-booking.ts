import { createBooking } from "@/fns/bookings";

export type BookingSubmitInput = {
  hotelId: "madhapur" | "hitec";
  suiteName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export type BookingSubmitResult = {
  id: string;
  status?: string;
  nights?: number;
  totalPaise?: number;
};

/** Node hosting uses server fn; shared hosting posts to PHP mail endpoint. */
export async function submitBooking(data: BookingSubmitInput): Promise<BookingSubmitResult> {
  if (import.meta.env.VITE_STATIC_HOSTING === "true") {
    const base = import.meta.env.BASE_URL || "/";
    const res = await fetch(`${base}api/book.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const payload = (await res.json().catch(() => null)) as
      | { id?: string; error?: string }
      | null;

    if (!res.ok) {
      throw new Error(payload?.error || "Could not save your request. Please call the desk.");
    }

    return { id: payload?.id || `req_${Date.now()}`, status: "pending" };
  }

  return createBooking({ data });
}
