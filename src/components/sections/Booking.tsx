import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import type { Suite } from "@/data/hotels";
import { BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { createBooking } from "@/server/bookings";

const ease = [0.16, 1, 0.3, 1] as const;

function toInputDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseRate(rate: string) {
  return Number(rate.replace(/[^\d]/g, "")) || 0;
}

function nightsBetween(checkIn: string, checkOut: string) {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 1;
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

function formatNice(iso: string) {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function Booking() {
  const { hotel, hotels, hotelId, selectHotel } = useHotel();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const tomorrow = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);
  const defaultOut = useMemo(() => {
    const d = new Date(tomorrow);
    d.setDate(d.getDate() + 2);
    return d;
  }, [tomorrow]);

  const [suite, setSuite] = useState<Suite>(hotel.suites[0]!);
  const [checkIn, setCheckIn] = useState(toInputDate(tomorrow));
  const [checkOut, setCheckOut] = useState(toInputDate(defaultOut));
  const [guests, setGuests] = useState(2);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    setSuite(hotel.suites[0]!);
    setSent(false);
    setError(null);
    setBookingId(null);
  }, [hotel.id, hotel.suites]);

  const nights = nightsBetween(checkIn, checkOut);
  const total = parseRate(suite.rate) * nights;
  const minOut = useMemo(() => {
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return toInputDate(d);
  }, [checkIn]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await createBooking({
        data: {
          hotelId: hotel.id,
          suiteName: suite.name,
          guestName: form.name.trim(),
          guestEmail: form.email.trim(),
          guestPhone: form.phone.trim(),
          checkIn,
          checkOut,
          guests,
        },
      });
      setBookingId(result.id);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your request. Please call the desk.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="booking" className="relative">
      {/* Quiet hero strip */}
      <section className="relative overflow-hidden bg-forest text-ivory">
        <img
          src={hotel.hero}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/75 to-forest" />
        <div className="relative mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-10 sm:pt-40 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <p className="eyebrow text-ivory/60">Reservations</p>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.92] tracking-[-0.02em]">
              Book your stay
            </h1>
            <p className="mt-5 max-w-md text-base text-ivory/70">
              Direct rates include taxes, breakfast and Wi‑Fi. Free cancellation up to 24 hours
              before arrival.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-10 sm:py-16 lg:py-20">
        {/* House */}
        <div>
          <p className="eyebrow text-muted-foreground">House</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {hotels.map((h) => {
              const active = h.id === hotelId;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => selectHotel(h.id)}
                  aria-pressed={active}
                  className={cn(
                    "group relative overflow-hidden text-left transition-colors duration-500",
                    active ? "bg-forest text-ivory" : "bg-secondary text-foreground hover:bg-forest/5",
                  )}
                >
                  <div className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[10rem_1fr]">
                    <div className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[9.5rem]">
                      <img
                        src={h.hero}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-col justify-center px-4 py-4 sm:px-6">
                      <span
                        className={cn(
                          "eyebrow",
                          active ? "text-ivory/55" : "text-muted-foreground",
                        )}
                      >
                        {h.place}
                      </span>
                      <span className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                        {h.name}
                      </span>
                      <span
                        className={cn(
                          "mt-2 text-sm",
                          active ? "text-ivory/65" : "text-foreground/65",
                        )}
                      >
                        From {h.fromRate} · {h.rating} rating
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="mt-14 border border-border bg-secondary p-8 sm:p-12"
            >
              <p className="eyebrow text-muted-foreground">Confirmed request</p>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl">Thank you, {form.name}</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/75">
                We have your request for {suite.name} at {hotel.name} — {nights} night
                {nights === 1 ? "" : "s"}, {formatNice(checkIn)} to {formatNice(checkOut)}. Our
                desk will call {form.phone || hotel.contact.phone} within two hours.
              </p>
              {bookingId && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Reference: <span className="font-mono text-foreground">{bookingId.slice(0, 8)}</span>
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`}
                  className="eyebrow inline-flex min-h-12 items-center bg-forest px-6 py-3 text-ivory"
                >
                  Call {hotel.contact.phone}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", phone: "" });
                    setBookingId(null);
                    setError(null);
                  }}
                  className="eyebrow inline-flex min-h-12 items-center border border-foreground/20 px-6 py-3"
                >
                  New request
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key={`${hotel.id}-form`}
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease }}
              className="mt-14"
            >
              {/* Suite */}
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <p className="eyebrow text-muted-foreground">Suite</p>
                  <Link
                    to="/hotels/$slug"
                    params={{ slug: hotel.slug }}
                    hash="rooms"
                    className="link-luxe eyebrow text-muted-foreground"
                  >
                    See room details
                  </Link>
                </div>

                <div className="mt-6 grid gap-3">
                  {hotel.suites.map((s) => {
                    const active = s.name === suite.name;
                    return (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setSuite(s)}
                        aria-pressed={active}
                        className={cn(
                          "grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 border px-3 py-3 text-left transition-colors duration-500 sm:grid-cols-[8rem_1fr_auto] sm:gap-6 sm:px-4 sm:py-4",
                          active
                            ? "border-forest bg-secondary"
                            : "border-border hover:border-foreground/35",
                        )}
                      >
                        <img
                          src={s.image}
                          alt=""
                          loading="lazy"
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="font-display text-lg sm:text-xl">{s.name}</span>
                            {active && <BrandStar className="h-2.5 w-2.5 text-accent" />}
                          </span>
                          <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">
                            {s.size} · {s.capacity} · {s.view}
                          </span>
                        </span>
                        <span className="shrink-0 self-start font-display text-base sm:self-center sm:text-lg">
                          {s.rate}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates + details */}
              <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                  <p className="eyebrow text-muted-foreground">Stay details</p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-3">
                    <label className="block">
                      <span className="eyebrow text-muted-foreground">Check-in</span>
                      <input
                        required
                        type="date"
                        min={toInputDate(today)}
                        value={checkIn}
                        onChange={(e) => {
                          const next = e.target.value;
                          setCheckIn(next);
                          if (checkOut <= next) {
                            const d = new Date(next);
                            d.setDate(d.getDate() + 1);
                            setCheckOut(toInputDate(d));
                          }
                        }}
                        className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="eyebrow text-muted-foreground">Check-out</span>
                      <input
                        required
                        type="date"
                        min={minOut}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="eyebrow text-muted-foreground">Guests</span>
                      <input
                        required
                        type="number"
                        min={1}
                        max={6}
                        value={guests}
                        onChange={(e) =>
                          setGuests(Math.min(6, Math.max(1, Number(e.target.value) || 1)))
                        }
                        className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
                      />
                    </label>
                  </div>

                  <div className="mt-10 grid gap-6 sm:grid-cols-3">
                    {(
                      [
                        ["name", "Full name", "text"],
                        ["email", "Email", "email"],
                        ["phone", "Phone", "tel"],
                      ] as const
                    ).map(([key, label, type]) => (
                      <label key={key} className="block sm:col-span-1">
                        <span className="eyebrow text-muted-foreground">{label}</span>
                        <input
                          required
                          type={type}
                          value={form[key]}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="mt-3 w-full border-b border-border bg-transparent pb-3 text-sm focus:border-foreground focus:outline-none"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <aside className="lg:col-span-5">
                  <div className="border border-border bg-secondary p-6 sm:p-8 lg:sticky lg:top-28">
                    <p className="eyebrow text-muted-foreground">Summary</p>
                    <h3 className="mt-4 font-display text-2xl">{suite.name}</h3>
                    <p className="mt-2 text-sm text-foreground/70">
                      {hotel.name} · {hotel.place}
                    </p>

                    <dl className="mt-8 space-y-4 text-sm">
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-muted-foreground">Check-in</dt>
                        <dd className="text-right">{formatNice(checkIn)}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-muted-foreground">Check-out</dt>
                        <dd className="text-right">{formatNice(checkOut)}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-muted-foreground">Nights</dt>
                        <dd>{nights}</dd>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-border pb-3">
                        <dt className="text-muted-foreground">Guests</dt>
                        <dd>{guests}</dd>
                      </div>
                    </dl>

                    <p className="mt-6 font-display text-3xl tracking-tight">
                      ₹{total.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">Taxes & breakfast included</p>

                    {error && (
                      <p className="mt-4 text-sm text-destructive" role="alert">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-8 flex w-full min-h-14 items-center justify-center gap-3 bg-forest px-6 py-4 text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <BrandStar className="h-2.5 w-2.5 text-accent" />
                      <span className="eyebrow">
                        {submitting ? "Saving request…" : "Request reservation"}
                      </span>
                    </button>

                    <a
                      href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`}
                      className="mt-4 block text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Or call {hotel.contact.phone}
                    </a>
                  </div>
                </aside>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
