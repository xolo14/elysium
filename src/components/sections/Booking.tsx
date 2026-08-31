import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Pencil } from "lucide-react";
import { useHotel } from "@/context/hotel";
import type { Hotel, Suite } from "@/data/hotels";
import { getHotelCarouselImages } from "@/data/hotel-images";
import { cn } from "@/lib/utils";
import { submitBooking } from "@/lib/submit-booking";
import { DateRangePicker } from "@/components/booking/DateRangePicker";
import { BookingHotelDetail } from "@/components/booking/BookingHotelDetail";
import {
  BookingCheckout,
  type CheckoutDraft,
} from "@/components/booking/BookingCheckout";
import {
  BookingContact,
  type ContactForm,
} from "@/components/booking/BookingContact";
import { formatStayCompact, nightsBetween } from "@/lib/booking-dates";
import { formatInr, parseRate, computePricing } from "@/lib/booking-pricing";

const ease = [0.16, 1, 0.3, 1] as const;

function suiteFromHotel(hotel: Hotel, name?: string) {
  if (!name) return hotel.suites[0]!;
  return hotel.suites.find((s) => s.name.toLowerCase() === name.toLowerCase()) ?? hotel.suites[0]!;
}

type Step = "dates" | "hotels" | "hotel" | "checkout" | "contact";

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
  const hotelLocked = Boolean(initialHotelSlug);

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
  const [checkout, setCheckout] = useState<CheckoutDraft>({
    guests: initialGuests && initialGuests >= 1 ? initialGuests : 2,
    rooms: 1,
    planId: "breakfast",
    offerCode: "",
    payNow: true,
  });
  const [form, setForm] = useState<ContactForm>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });
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
  const pricing = useMemo(
    () =>
      computePricing({
        nightlyRate: parseRate(suite.rate),
        nights,
        rooms: checkout.rooms,
        guests: checkout.guests,
        planId: checkout.planId,
        offerCode: checkout.offerCode,
        payNow: checkout.payNow,
      }),
    [suite.rate, nights, checkout],
  );
  const guestName = `${form.firstName} ${form.lastName}`.trim();
  const canSubmit = Boolean(
    checkIn && checkOut && nights > 0 && form.firstName && form.lastName && form.email && form.phone,
  );

  const afterDates = () => {
    setStep(hotelLocked ? "hotel" : "hotels");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await submitBooking({
        hotelId: hotel.id,
        suiteName: `${suite.name} · ${pricing.plan.shortLabel}${checkout.offerCode ? ` · ${checkout.offerCode}` : ""}`,
        guestName,
        guestEmail: form.email.trim(),
        guestPhone: form.phone.trim(),
        checkIn,
        checkOut,
        guests: checkout.guests,
        rooms: checkout.rooms,
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
          <h1 className="mt-3 font-nav text-3xl font-extrabold text-forest">
            Thank you, {form.firstName}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            {suite.name} at {hotel.name} · {nights} night{nights === 1 ? "" : "s"} ·{" "}
            {formatStayCompact(checkIn)} → {formatStayCompact(checkOut)}. Payable{" "}
            {formatInr(pricing.payable)}. We will call {form.phone}.
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
                setForm({ email: "", phone: "", firstName: "", lastName: "" });
                setCheckout({
                  guests: 2,
                  rooms: 1,
                  planId: "breakfast",
                  offerCode: "",
                  payNow: true,
                });
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


  return (
    <div className="relative min-h-[100svh] overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "dates" ? (
          <motion.div
            key="dates"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease }}
            className="min-h-[100svh] bg-forest pt-[4.5rem]"
          >
            <div className="page-wrap py-4 sm:py-6 lg:py-8">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="mb-5 inline-flex items-center gap-2 font-nav text-xl font-extrabold text-ivory sm:text-2xl"
              >
                <span aria-hidden="true">‹</span>
                Hyderabad
              </button>
              <p className="mb-4 font-nav text-sm font-semibold text-ivory/80">
                {hotelLocked
                  ? `Choose dates for ${hotel.name}`
                  : "Choose your dates — then Studio or Premier suites"}
              </p>
              <DateRangePicker
                bloom
                checkIn={checkIn}
                checkOut={checkOut}
                minDate={today}
                onRangeChange={(inDate, outDate) => {
                  setCheckIn(inDate);
                  setCheckOut(outDate);
                }}
                onConfirm={afterDates}
              />
              <p className="mt-5 text-center text-sm font-medium text-ivory/85">
                Elysium Studio Suites, Madhapur · Elysium Premier Suites, Hitec City
              </p>
            </div>
          </motion.div>
        ) : null}

        {step === "hotels" ? (
          <motion.div
            key="hotels"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease }}
            className="min-h-[100svh] bg-white pt-[4.5rem]"
          >
            <div className="relative overflow-hidden bg-forest">
              <div className="page-wrap relative z-10 py-6 sm:py-8">
                <p className="font-nav text-[2rem] font-extrabold tracking-[-0.03em] text-ivory sm:text-[2.4rem]">
                  Hyderabad houses
                </p>
                <p className="mt-1 text-sm text-ivory/80">Studio Suites &amp; Premier Suites</p>
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

            <div className="page-wrap space-y-5 py-6 sm:py-8">
              <p className="text-sm text-neutral-500">
                {hotels.length} houses · pick one to see rooms available
              </p>
              {hotels.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.4, ease }}
                >
                  <HotelResultCard
                    hotel={h}
                    onSelect={() => {
                      setHouseId(h.id);
                      setSuite(suiteFromHotel(h, initialSuite));
                      setStep("hotel");
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {step === "hotel" ? (
          <motion.div
            key="hotel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
          >
            <BookingHotelDetail
              hotel={hotel}
              checkIn={checkIn}
              checkOut={checkOut}
              onBack={() => setStep(hotelLocked ? "dates" : "hotels")}
              onEditDates={() => setStep("dates")}
              onBookSuite={(s) => {
                setSuite(s);
                setStep("checkout");
              }}
            />
          </motion.div>
        ) : null}

        {step === "checkout" ? (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
          >
            <BookingCheckout
              hotel={hotel}
              suite={suite}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              draft={checkout}
              onChange={(next) => setCheckout((c) => ({ ...c, ...next }))}
              onModify={() => setStep("hotel")}
              onProceed={() => setStep("contact")}
            />
          </motion.div>
        ) : null}

        {step === "contact" ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
          >
            <BookingContact
              hotel={hotel}
              suite={suite}
              checkIn={checkIn}
              checkOut={checkOut}
              nights={nights}
              draft={checkout}
              form={form}
              onFormChange={(next) => setForm((f) => ({ ...f, ...next }))}
              onEditRooms={() => setStep("hotel")}
              onBack={() => setStep("checkout")}
              submitting={submitting}
              error={error}
              onSubmit={onSubmit}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function HotelResultCard({ hotel, onSelect }: { hotel: Hotel; onSelect: () => void }) {
  const images = useMemo(() => {
    const gallery = getHotelCarouselImages(hotel).map((g) => g.src);
    const unique = [hotel.hero, ...gallery].filter((src, i, arr) => arr.indexOf(src) === i);
    return unique.slice(0, 6);
  }, [hotel]);
  const [index, setIndex] = useState(0);
  const roomCount = hotel.suites.length;
  const kind = hotel.id === "madhapur" ? "Studio Suites" : "Premier Suites";
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
      <div className="relative min-h-[12rem] overflow-hidden bg-neutral-100 sm:min-h-[16rem] lg:min-h-[18rem]">
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
        <p className="eyebrow text-bronze">{kind}</p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-2">
          <h2 className="font-nav text-xl font-extrabold text-neutral-800 sm:text-2xl">
            {hotel.name}
            <span className="font-semibold text-neutral-500"> — {hotel.place}</span>
          </h2>
          <p className="flex items-center gap-1 rounded-[10px] bg-forest/8 px-2 py-1 text-sm font-bold text-forest">
            ★ {hotel.rating}
          </p>
        </div>
        <p className="mt-2 text-sm font-semibold text-forest">
          {roomCount} room type{roomCount === 1 ? "" : "s"} available
        </p>
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
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSelect}
            className="btn-primary inline-flex min-h-11 items-center rounded-[10px] px-8"
          >
            View rooms
          </motion.button>
        </div>
      </div>
    </article>
  );
}
