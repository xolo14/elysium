import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import type { Hotel, Suite } from "@/data/hotels";
import { BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { submitBooking } from "@/lib/submit-booking";
import { DateRangePicker } from "@/components/booking/DateRangePicker";
import { formatShort, nightsBetween } from "@/lib/booking-dates";

function parseRate(rate: string) {
  return Number(rate.replace(/[^\d]/g, "")) || 0;
}

function suiteFromHotel(hotel: Hotel, name?: string) {
  if (!name) return hotel.suites[0]!;
  return hotel.suites.find((s) => s.name.toLowerCase() === name.toLowerCase()) ?? hotel.suites[0]!;
}

export function Booking({
  initialHotelSlug,
  initialSuite,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: {
  initialHotelSlug?: string;
  initialSuite?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
} = {}) {
  const { hotels } = useHotel();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const startHotel =
    hotels.find((h) => h.slug === initialHotelSlug || h.id === initialHotelSlug) ?? hotels[0]!;

  const [houseId, setHouseId] = useState<Hotel["id"]>(startHotel.id);
  const hotel = hotels.find((h) => h.id === houseId) ?? hotels[0]!;

  const [suite, setSuite] = useState<Suite>(() => suiteFromHotel(startHotel, initialSuite));
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? "");
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? "");
  const [guests, setGuests] = useState(initialGuests && initialGuests >= 1 ? initialGuests : 2);
  const [rooms, setRooms] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const match = hotels.find((h) => h.slug === initialHotelSlug || h.id === initialHotelSlug);
    if (match) setHouseId(match.id);
  }, [initialHotelSlug, hotels]);

  useEffect(() => {
    setSuite(suiteFromHotel(hotel, initialSuite));
    setSent(false);
    setError(null);
    setBookingId(null);
  }, [hotel.id, hotel.suites, initialSuite]);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const total = parseRate(suite.rate) * Math.max(nights, 1) * rooms;
  const canSubmit = Boolean(checkIn && checkOut && nights > 0 && form.name && form.email && form.phone);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitBooking({
        hotelId: hotel.id,
        suiteName: suite.name,
        guestName: form.name.trim(),
        guestEmail: form.email.trim(),
        guestPhone: form.phone.trim(),
        checkIn,
        checkOut,
        guests,
        rooms,
      });
      setBookingId(result.id);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your request. Please call the desk.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ivory px-5 pt-20">
        <div className="w-full max-w-lg rounded-[10px] border border-border bg-background p-8 text-center">
          <p className="eyebrow text-muted-foreground">Request received</p>
          <h1 className="mt-3 font-display text-3xl text-forest">Thank you, {form.name}</h1>
          <p className="mt-4 text-sm leading-relaxed text-foreground/70">
            {suite.name} at {hotel.name} · {nights} night{nights === 1 ? "" : "s"} ·{" "}
            {formatShort(checkIn)} → {formatShort(checkOut)}. We will call {form.phone}.
          </p>
          {bookingId ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Ref <span className="font-mono text-foreground">{bookingId.slice(0, 8)}</span>
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`}
              className="eyebrow inline-flex min-h-11 items-center rounded-[10px] bg-forest px-5 text-ivory"
            >
              Call {hotel.contact.phone}
            </a>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setCheckIn("");
                setCheckOut("");
                setForm({ name: "", email: "", phone: "" });
                setBookingId(null);
              }}
              className="eyebrow inline-flex min-h-11 items-center rounded-[10px] border border-border px-5"
            >
              New request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      id="booking"
      onSubmit={onSubmit}
      className="flex min-h-[100svh] flex-col bg-ivory pt-[4.75rem] lg:h-[100svh] lg:overflow-hidden"
    >
      <div className="page-wrap flex min-h-0 flex-1 flex-col gap-3 py-3 sm:gap-4 sm:py-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-muted-foreground">Reservations</p>
            <h1 className="mt-1 font-display text-2xl leading-none text-forest sm:text-3xl">Book</h1>
          </div>
          <div className="flex rounded-[10px] border border-border bg-background p-1">
            {hotels.map((h) => {
              const active = h.id === houseId;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHouseId(h.id)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-[8px] px-3 py-2 text-left transition-colors sm:px-4",
                    active ? "bg-forest text-ivory" : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  <span className="block text-sm font-semibold">{h.place}</span>
                </button>
              );
            })}
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] lg:gap-4">
          <section className="flex min-h-0 flex-col rounded-[10px] border border-border bg-background p-3 sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="eyebrow text-muted-foreground">Dates</p>
              <p className="text-xs text-foreground/70 sm:text-sm">
                {checkIn && checkOut
                  ? `${formatShort(checkIn)} → ${formatShort(checkOut)} · ${nights} night${nights === 1 ? "" : "s"}`
                  : "Pick check-in, then check-out"}
              </p>
            </div>
            <DateRangePicker
              compact
              checkIn={checkIn}
              checkOut={checkOut}
              minDate={today}
              onRangeChange={(inDate, outDate) => {
                setCheckIn(inDate);
                setCheckOut(outDate);
              }}
            />
          </section>

          <section className="flex min-h-0 flex-col rounded-[10px] border border-border bg-background p-3 sm:p-4">
            <p className="eyebrow text-muted-foreground">Suites · {hotel.name}</p>
            <ul className="mt-2 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
              {hotel.suites.map((s) => {
                const active = s.name === suite.name;
                return (
                  <li key={s.name}>
                    <button
                      type="button"
                      onClick={() => setSuite(s)}
                      aria-pressed={active}
                      className={cn(
                        "grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-2.5 rounded-[10px] border px-2 py-2 text-left transition-colors",
                        active ? "border-forest bg-secondary" : "border-border hover:border-forest/35",
                      )}
                    >
                      <img
                        src={s.image}
                        alt=""
                        className="aspect-[4/3] w-full rounded-[6px] object-cover"
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate font-display text-sm leading-tight">{s.name}</span>
                          {active ? <BrandStar className="h-2 w-2 shrink-0 text-forest" /> : null}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.7rem] text-muted-foreground">
                          {s.capacity}
                        </span>
                      </span>
                      <span className="shrink-0 font-display text-xs sm:text-sm">
                        {s.rate.replace(" / night", "")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <section className="rounded-[10px] border border-border bg-background p-3 sm:p-4">
          <div className="grid items-end gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_4.5rem_4.5rem_auto]">
            <label className="block">
              <span className="eyebrow text-muted-foreground">Name</span>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded-[8px] border border-border bg-ivory px-3 py-2 text-sm outline-none focus:border-forest"
              />
            </label>
            <label className="block">
              <span className="eyebrow text-muted-foreground">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1 w-full rounded-[8px] border border-border bg-ivory px-3 py-2 text-sm outline-none focus:border-forest"
              />
            </label>
            <label className="block">
              <span className="eyebrow text-muted-foreground">Phone</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1 w-full rounded-[8px] border border-border bg-ivory px-3 py-2 text-sm outline-none focus:border-forest"
              />
            </label>
            <label className="block">
              <span className="eyebrow text-muted-foreground">Guests</span>
              <input
                required
                type="number"
                min={1}
                max={12}
                value={guests}
                onChange={(e) => setGuests(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
                className="mt-1 w-full rounded-[8px] border border-border bg-ivory px-2 py-2 text-sm outline-none focus:border-forest"
              />
            </label>
            <label className="block">
              <span className="eyebrow text-muted-foreground">Rooms</span>
              <input
                required
                type="number"
                min={1}
                max={6}
                value={rooms}
                onChange={(e) => setRooms(Math.min(6, Math.max(1, Number(e.target.value) || 1)))}
                className="mt-1 w-full rounded-[8px] border border-border bg-ivory px-2 py-2 text-sm outline-none focus:border-forest"
              />
            </label>
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="eyebrow inline-flex min-h-10 items-center justify-center rounded-[10px] bg-forest px-5 text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {submitting ? "Saving…" : "Request"}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>
              {suite.name} · ₹{total.toLocaleString("en-IN")}
              {nights ? ` · ${nights} night${nights === 1 ? "" : "s"}` : ""} · taxes & breakfast in
            </p>
            <p>
              <Link to="/terms" className="underline-offset-2 hover:underline">
                Terms
              </Link>
              {" · "}
              <a href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                {hotel.contact.phone}
              </a>
            </p>
          </div>
          {error ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </section>
      </div>
    </form>
  );
}
