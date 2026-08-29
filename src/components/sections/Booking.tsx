import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useHotel } from "@/context/hotel";
import type { Hotel, Suite } from "@/data/hotels";
import { getHotelCarouselImages } from "@/data/hotel-images";
import { BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { submitBooking } from "@/lib/submit-booking";
import { DateRangePicker } from "@/components/booking/DateRangePicker";
import { BookingHotelDetail } from "@/components/booking/BookingHotelDetail";
import { formatStayCompact, nightsBetween } from "@/lib/booking-dates";

function parseRate(rate: string) {
  return Number(rate.replace(/[^\d]/g, "")) || 0;
}

function suiteFromHotel(hotel: Hotel, name?: string) {
  if (!name) return hotel.suites[0]!;
  return hotel.suites.find((s) => s.name.toLowerCase() === name.toLowerCase()) ?? hotel.suites[0]!;
}

type Step = "dates" | "hotels" | "hotel" | "details";

/** Hyderabad-only booking: calendar → houses with photos → suite request. */
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

  const [step, setStep] = useState<Step>(() =>
    initialCheckIn && initialCheckOut ? (initialHotelSlug ? "hotel" : "hotels") : "dates",
  );
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
      <div className="flex min-h-[100svh] items-center justify-center bg-secondary px-5 pt-20">
        <div className="w-full max-w-lg rounded-[10px] bg-white p-8 text-center shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)]">
          <p className="text-sm font-semibold text-neutral-400">Request received</p>
          <h1 className="mt-3 font-nav text-3xl font-extrabold text-forest">Thank you, {form.name}</h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            {suite.name} at {hotel.name} · {nights} night{nights === 1 ? "" : "s"} ·{" "}
            {formatStayCompact(checkIn)} → {formatStayCompact(checkOut)}. We will call {form.phone}.
          </p>
          {bookingId ? (
            <p className="mt-3 text-sm text-neutral-400">
              Ref <span className="font-mono text-forest">{bookingId.slice(0, 8)}</span>
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`}
              className="btn-primary inline-flex min-h-11 items-center rounded-[10px] px-5"
            >
              Call {hotel.contact.phone}
            </a>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setStep("dates");
                setCheckIn("");
                setCheckOut("");
                setForm({ name: "", email: "", phone: "" });
                setBookingId(null);
              }}
              className="nav-cta inline-flex min-h-11 items-center rounded-[10px] border border-neutral-200 px-5 text-forest"
            >
              New request
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "dates") {
    return (
      <div className="min-h-[100svh] bg-sun pt-[4.75rem]">
        <div className="page-wrap py-6 sm:py-8 lg:py-10">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-5 inline-flex items-center gap-2 font-nav text-xl font-extrabold text-ivory sm:text-2xl"
          >
            <span aria-hidden="true">‹</span>
            Hyderabad
          </button>
          <DateRangePicker
            bloom
            checkIn={checkIn}
            checkOut={checkOut}
            minDate={today}
            onRangeChange={(inDate, outDate) => {
              setCheckIn(inDate);
              setCheckOut(outDate);
            }}
            onConfirm={() => setStep("hotels")}
          />
          <p className="mt-5 text-center text-sm font-medium text-ivory/85">
            Only Elysium houses in Hyderabad — Madhapur &amp; Hitec City.
          </p>
        </div>
      </div>
    );
  }

  if (step === "hotels") {
    return (
      <div className="min-h-[100svh] bg-white pt-[4.75rem]">
        <div className="relative overflow-hidden bg-forest">
          <div className="page-wrap relative z-10 py-8 sm:py-10">
            <p className="font-nav text-[2rem] font-extrabold tracking-[-0.03em] text-ivory sm:text-[2.4rem]">
              Hyderabad
            </p>
            <button
              type="button"
              onClick={() => setStep("dates")}
              className="mt-4 flex w-full max-w-xl items-center gap-3 rounded-[10px] bg-white px-4 py-3.5 text-left shadow-[0_12px_36px_-20px_rgba(0,0,0,0.35)]"
            >
              <Pencil className="h-4 w-4 shrink-0 text-neutral-400" />
              <span className="min-w-0 flex-1 font-nav text-sm font-bold text-neutral-800 sm:text-base">
                {formatStayCompact(checkIn)}
                <span className="mx-2 text-neutral-300">→</span>
                {formatStayCompact(checkOut)}
              </span>
              <span className="shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                {nights} Night{nights === 1 ? "" : "s"}
              </span>
            </button>
          </div>
          <img
            src="/images/hitec-city/facade/facade-01.png"
            alt=""
            className="pointer-events-none absolute top-0 right-0 hidden h-full w-[42%] object-cover opacity-35 grayscale lg:block"
          />
        </div>

        <div className="page-wrap space-y-6 py-8 sm:py-10">
          <p className="text-sm text-neutral-500">
            {hotels.length} house{hotels.length === 1 ? "" : "s"} in Hyderabad
          </p>
          {hotels.map((h) => (
            <HotelResultCard
              key={h.id}
              hotel={h}
              onSelect={() => {
                setHouseId(h.id);
                setSuite(suiteFromHotel(h, initialSuite));
                setStep("hotel");
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === "hotel") {
    return (
      <BookingHotelDetail
        hotel={hotel}
        checkIn={checkIn}
        checkOut={checkOut}
        onBack={() => setStep("hotels")}
        onEditDates={() => setStep("dates")}
        onBookSuite={(s) => {
          setSuite(s);
          setStep("details");
        }}
      />
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
            <button
              type="button"
              onClick={() => setStep("hotel")}
              className="text-sm font-semibold text-bronze hover:underline"
            >
              ← {hotel.name} details
            </button>
            <h1 className="mt-1 font-nav text-2xl leading-none font-extrabold text-forest sm:text-3xl">
              {hotel.name}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {formatStayCompact(checkIn)} → {formatStayCompact(checkOut)} · {nights} night
              {nights === 1 ? "" : "s"}
            </p>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.9fr)] lg:gap-4">
          <section className="flex min-h-0 flex-col rounded-[10px] border border-border bg-background p-3 sm:p-4">
            <p className="eyebrow text-muted-foreground">Suites</p>
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
                        active ? "border-forest bg-forest/5" : "border-border hover:border-forest/35",
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

          <section className="flex min-h-0 flex-col rounded-[10px] border border-border bg-background p-3 sm:p-4">
            <p className="eyebrow text-muted-foreground">Your details</p>
            <div className="mt-3 grid gap-2">
              <label className="block">
                <span className="eyebrow text-muted-foreground">Name</span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-[10px] border border-border bg-ivory px-3 py-2 text-sm outline-none focus:border-sun"
                />
              </label>
              <label className="block">
                <span className="eyebrow text-muted-foreground">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 w-full rounded-[10px] border border-border bg-ivory px-3 py-2 text-sm outline-none focus:border-sun"
                />
              </label>
              <label className="block">
                <span className="eyebrow text-muted-foreground">Phone</span>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="mt-1 w-full rounded-[10px] border border-border bg-ivory px-3 py-2 text-sm outline-none focus:border-sun"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="eyebrow text-muted-foreground">Guests</span>
                  <input
                    required
                    type="number"
                    min={1}
                    max={12}
                    value={guests}
                    onChange={(e) => setGuests(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
                    className="mt-1 w-full rounded-[10px] border border-border bg-ivory px-2 py-2 text-sm outline-none focus:border-sun"
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
                    className="mt-1 w-full rounded-[10px] border border-border bg-ivory px-2 py-2 text-sm outline-none focus:border-sun"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting || !canSubmit}
                className="btn-primary mt-2 inline-flex min-h-11 items-center justify-center rounded-[10px] px-5 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? "Saving…" : "Request stay"}
              </button>
              <p className="text-xs text-muted-foreground">
                {suite.name} · ₹{total.toLocaleString("en-IN")}
                {nights ? ` · ${nights} night${nights === 1 ? "" : "s"}` : ""} · taxes & breakfast in
              </p>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                <Link to="/terms" className="underline-offset-2 hover:underline">
                  Terms
                </Link>
                {" · "}
                <a href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {hotel.contact.phone}
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

function HotelResultCard({ hotel, onSelect }: { hotel: Hotel; onSelect: () => void }) {
  const images = useMemo(() => {
    const gallery = getHotelCarouselImages(hotel).map((g) => g.src);
    const unique = [hotel.hero, ...gallery].filter((src, i, arr) => arr.indexOf(src) === i);
    return unique.slice(0, 6);
  }, [hotel]);
  const [index, setIndex] = useState(0);
  const landmarks =
    hotel.id === "madhapur"
      ? [
          "Near Ayyappa Society & Madhapur main road",
          "Quick access to Hitec City corridor",
          "Complimentary breakfast at O Sorriso",
        ]
      : [
          "Minutes from Cyber Towers & Hitec City",
          "Walking distance to offices and metro",
          "Full kitchen in every suite",
        ];

  return (
    <article className="overflow-hidden rounded-[10px] border border-neutral-200 bg-white shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)] lg:grid lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative min-h-[14rem] overflow-hidden bg-neutral-100 sm:min-h-[18rem]">
        <img
          src={images[index] ?? hotel.hero}
          alt={`${hotel.name}, ${hotel.place}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {images.length > 1 ? (
          <>
            <div className="absolute inset-x-0 bottom-0 flex gap-1.5 px-4 pb-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i === index ? "bg-ivory" : "bg-white/45",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((n) => (n + 1) % images.length)}
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest/90 text-ivory"
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      <div className="flex flex-col p-5 sm:p-6 lg:p-7">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="font-nav text-xl font-extrabold text-neutral-800 sm:text-2xl">
            {hotel.name}
            <span className="font-semibold text-neutral-500"> — {hotel.place}</span>
          </h2>
          <p className="flex items-center gap-1 rounded-[10px] bg-forest/8 px-2 py-1 text-sm font-bold text-forest">
            ★ {hotel.rating}
          </p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          {hotel.contact.address.slice(1).join(" ")}
        </p>
        <ul className="mt-4 space-y-2">
          {landmarks.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-neutral-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
          <div>
            <p className="font-nav text-lg font-extrabold text-forest">
              {hotel.fromRate} <span className="text-sm font-semibold">/ night onwards</span>
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">Incl. taxes</p>
            <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-forest">
              <span aria-hidden="true">⚡</span>
              Lowest Price, Guaranteed!
            </p>
          </div>
          <button
            type="button"
            onClick={onSelect}
            className="btn-primary inline-flex min-h-11 items-center rounded-[10px] px-8"
          >
            Select
          </button>
        </div>
      </div>
    </article>
  );
}
