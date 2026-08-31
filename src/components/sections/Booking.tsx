import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useHotel } from "@/context/hotel";
import { guestFullName, useGuest } from "@/context/guest";
import type { Hotel, Suite } from "@/data/hotels";
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

type Step = "pick" | "dates" | "hotel" | "checkout" | "contact";

/** Hyderabad booking: pick house → calendar → rooms → checkout. */
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
  const { guest, ready: guestReady, updateGuest } = useGuest();
  const hotelLocked = Boolean(initialHotelSlug);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const startHotel =
    hotels.find((h) => h.slug === initialHotelSlug || h.id === initialHotelSlug) ?? hotels[0]!;

  const [step, setStep] = useState<Step>(() => {
    if (initialCheckIn && initialCheckOut) {
      return initialHotelSlug ? "hotel" : "pick";
    }
    if (initialHotelSlug) return "dates";
    return "pick";
  });
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

  useEffect(() => {
    const toTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    toTop();
    const t = window.setTimeout(toTop, 40);
    return () => window.clearTimeout(t);
  }, [step, sent]);

  /** Prefill checkout from Login / Join session — don’t overwrite edits already typed. */
  useEffect(() => {
    if (!guestReady || !guest) return;
    setForm((f) => ({
      email: f.email.trim() ? f.email : guest.email,
      phone: f.phone.trim() ? f.phone : guest.mobile,
      firstName: f.firstName.trim() ? f.firstName : guest.firstName,
      lastName: f.lastName.trim() ? f.lastName : guest.lastName,
    }));
  }, [guestReady, guest]);

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
    setStep("hotel");
  };

  const pickHouse = (h: Hotel) => {
    setHouseId(h.id);
    setSuite(suiteFromHotel(h, initialSuite));
    setStep("dates");
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
      if (guest) {
        updateGuest({
          mobile: form.phone.trim() || guest.mobile,
          firstName: form.firstName.trim() || guest.firstName,
          lastName: form.lastName.trim() || guest.lastName,
          stays: guest.stays + 1,
        });
      }
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
                setStep("pick");
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
        {step === "pick" ? (
          <motion.div
            key="pick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.5, ease }}
            className="min-h-[100svh] bg-forest pt-[4.5rem]"
          >
            <div className="page-wrap py-6 sm:py-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease }}
              >
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="mb-5 inline-flex items-center gap-2 font-nav text-lg font-extrabold text-ivory/85 sm:text-xl"
                >
                  <span aria-hidden="true">‹</span>
                  Hyderabad
                </button>
                <h1 className="display-nav text-[clamp(2rem,6vw,3rem)] text-ivory">
                  Choose your Elysium
                </h1>
                <p className="mt-2 max-w-lg text-sm text-ivory/75 sm:text-base">
                  Studio Suites or Premier Suites — then lock your dates.
                </p>
              </motion.div>

              <div className="mt-8 grid gap-5 sm:mt-10 lg:grid-cols-2 lg:gap-7">
                {hotels.map((h, i) => {
                  const kind = h.id === "madhapur" ? "Studio Suites" : "Premier Suites";
                  return (
                    <motion.button
                      key={h.id}
                      type="button"
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.1, duration: 0.55, ease }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => pickHouse(h)}
                      className="group overflow-hidden rounded-[14px] bg-white text-left shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]"
                    >
                      <div className="relative aspect-[16/11] overflow-hidden bg-neutral-200">
                        <picture>
                          <source
                            srcSet={h.hero.replace(/\.(png|jpe?g)$/i, ".webp")}
                            type="image/webp"
                          />
                          <img
                            src={h.hero}
                            alt=""
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        </picture>
                        <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 rounded-[8px] bg-forest/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-ivory uppercase">
                          {kind}
                        </span>
                      </div>
                      <div className="p-5 sm:p-6">
                        <h2 className="font-nav text-xl font-extrabold text-neutral-800 sm:text-2xl">
                          {h.name}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500">{h.place}, Hyderabad</p>
                        <div className="mt-5 flex items-end justify-between gap-3">
                          <div>
                            <p className="font-nav text-lg font-extrabold text-forest">
                              {h.fromRate}{" "}
                              <span className="text-sm font-semibold">/ night</span>
                            </p>
                            <p className="text-[11px] text-neutral-400">Incl. taxes</p>
                          </div>
                          <span className="btn-primary !min-h-10 px-5 text-[13px]">
                            Select
                          </span>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}

        {step === "dates" ? (
          <motion.div
            key="dates"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.5, ease }}
            className="min-h-[100svh] bg-forest pt-[4.5rem]"
          >
            <div className="page-wrap py-4 sm:py-6 lg:py-8">
              <button
                type="button"
                onClick={() => (hotelLocked ? window.history.back() : setStep("pick"))}
                className="mb-5 inline-flex items-center gap-2 font-nav text-xl font-extrabold text-ivory sm:text-2xl"
              >
                <span aria-hidden="true">‹</span>
                {hotel.name}
              </button>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="mb-4 font-nav text-sm font-semibold text-ivory/80"
              >
                Choose check-in &amp; check-out for {hotel.place}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14, duration: 0.5, ease }}
              >
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
              </motion.div>
              <p className="mt-5 text-center text-sm font-medium text-ivory/85">
                {hotel.name} · {hotel.place}
              </p>
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
              onBack={() => setStep(hotelLocked ? "dates" : "pick")}
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
              signedInAs={guest ? guestFullName(guest) : null}
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
