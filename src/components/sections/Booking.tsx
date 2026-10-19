import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useHotel } from "@/context/hotel";
import { guestFullName, useGuest } from "@/context/guest";
import { displaySrc, getHotelCarouselImages } from "@/data/hotel-images";
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
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function HotelCardPhotos({ hotel }: { hotel: Hotel }) {
  const images = useMemo(
    () => getHotelCarouselImages(hotel).map((image) => displaySrc(image.src)),
    [hotel],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % images.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative aspect-[16/11] overflow-hidden bg-neutral-100 sm:aspect-auto sm:min-h-[17rem]">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {images.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => setIndex((n) => (n - 1 + images.length) % images.length)}
            className="absolute top-1/2 left-3 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-forest sm:left-4 sm:h-11 sm:w-11"
            aria-label={`Previous ${hotel.name} photo`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((n) => (n + 1) % images.length)}
            className="absolute top-1/2 right-3 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-forest sm:right-4 sm:h-11 sm:w-11"
            aria-label={`Next ${hotel.name} photo`}
          >
            ›
          </button>
          <div
            className="absolute inset-x-3 bottom-3 z-20 flex items-center gap-1.5 sm:inset-x-4 sm:bottom-4 sm:gap-2"
            role="tablist"
            aria-label={`${hotel.name} photos`}
          >
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-label={`${hotel.name} photo ${i + 1}`}
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-[5px] min-w-0 flex-1 rounded-full transition-colors duration-300",
                  i === index ? "bg-forest" : "bg-white",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

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
  const [dateReturn, setDateReturn] = useState<"pick" | "hotel">(
    initialHotelSlug ? "hotel" : "pick",
  );

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
    setStep(dateReturn === "pick" && !hotelLocked ? "pick" : "hotel");
  };

  const openCityDates = () => {
    setDateReturn("pick");
    setStep("dates");
  };

  const pickHouse = (h: Hotel) => {
    setHouseId(h.id);
    setSuite(suiteFromHotel(h, initialSuite));
    if (checkIn && checkOut && checkOut > checkIn) {
      setStep("hotel");
      return;
    }
    setDateReturn("hotel");
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
    <div className="relative min-h-[100svh] bg-white">
      <AnimatePresence mode="popLayout">
        {step === "pick" ? (
          <motion.div
            key="pick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
            className="bg-white pb-16"
          >
            <section className="relative overflow-hidden bg-forest lg:min-h-[22.5rem]">
              <img
                src="/images/charminar.webp"
                alt=""
                className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_center]"
              />
              <div className="pointer-events-none absolute inset-0 bg-forest/45 mix-blend-multiply" />
              <div className="page-wrap relative z-10 flex items-center pt-[5.25rem] pb-8 sm:pt-24 lg:min-h-[22.5rem] lg:py-8 lg:pt-[5.75rem]">
                <div className="w-full max-w-[34rem] rounded-[28px] bg-forest px-5 py-6 sm:px-8 sm:py-8">
                  <img src="/logo-light.svg" alt="Elysium" className="h-8 w-auto sm:h-9" />
                  <h1 className="mt-8 font-nav text-[clamp(2.5rem,6vw,3.6rem)] leading-none font-extrabold tracking-[-0.04em] text-white sm:mt-10">
                    Hyderabad
                  </h1>
                  <button
                    type="button"
                    onClick={openCityDates}
                    className="mt-6 flex w-full items-center gap-3 rounded-[18px] bg-white px-4 py-3 text-left text-neutral-900 sm:mt-8"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-neutral-700" fill="none" aria-hidden>
                      <path
                        d="M4 16.5V19h2.5L16.8 8.7l-2.5-2.5L4 16.5Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                      <path d="M13.6 6.9l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                    <span className="min-w-0 flex-1 truncate font-nav text-[14px] font-bold sm:text-[15px]">
                      {checkIn && checkOut
                        ? `${formatStayCompact(checkIn)} → ${formatStayCompact(checkOut)}`
                        : "Pick Check-in & Check-out Dates"}
                    </span>
                    {checkIn && checkOut ? (
                      <span className="shrink-0 rounded-full border border-neutral-300 px-3 py-1 font-nav text-[12px] font-semibold text-neutral-700 sm:text-[13px]">
                        {nightsBetween(checkIn, checkOut)}{" "}
                        {nightsBetween(checkIn, checkOut) === 1 ? "Night" : "Nights"}
                      </span>
                    ) : null}
                  </button>
                </div>
              </div>
            </section>

            <div className="page-wrap mt-5 space-y-5 sm:mt-7 sm:space-y-6">
              {hotels.map((h, i) => (
                <motion.article
                  key={h.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + i * 0.04, duration: 0.28, ease }}
                  className="overflow-hidden rounded-[22px] bg-white ring-1 ring-neutral-100 sm:grid sm:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
                >
                  <HotelCardPhotos hotel={h} />
                  <div className="flex flex-col p-5 sm:p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-nav text-[1.35rem] leading-tight font-extrabold sm:text-[1.7rem]">
                        <Link
                          to="/hotels/$slug"
                          params={{ slug: h.slug }}
                          className="text-neutral-800 transition-colors hover:text-forest"
                        >
                          {h.name}
                        </Link>
                      </h2>
                      <span className="shrink-0 font-nav text-sm font-extrabold text-forest">
                        ★ {h.rating}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                      {h.contact.address.slice(1).join(" ")}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-[13px] text-neutral-600 sm:text-sm">
                      {h.sellingPoints.map((point) => (
                        <li key={point} className="flex gap-2">
                          <span className="text-forest">*</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                      <div>
                        <p className="font-nav text-xl font-extrabold text-forest">
                          {h.fromRate}{" "}
                          <span className="text-sm font-semibold">/ night</span>
                        </p>
                        <p className="text-[11px] text-neutral-400">Incl. taxes</p>
                        <p className="mt-1 text-[11px] font-semibold text-forest">
                          ⚡ Lowest Price, Guaranteed!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => pickHouse(h)}
                        className="inline-flex min-h-11 items-center rounded-[999px] bg-forest px-6 font-nav text-[13px] font-extrabold text-ivory"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        ) : null}

        {step === "dates" ? (
          <motion.div
            key="dates"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.28, ease }}
            className="flex min-h-[100svh] flex-col bg-forest pt-[4.5rem]"
          >
            <div className="page-wrap py-4 sm:py-5">
              <button
                type="button"
                onClick={() => (hotelLocked ? window.history.back() : setStep("pick"))}
                className="inline-flex items-center gap-2 font-nav text-[clamp(1.35rem,3.2vw,1.85rem)] font-extrabold text-ivory"
              >
                <span aria-hidden="true">‹</span>
                {dateReturn === "pick" ? "Hyderabad" : hotel.name}
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[22px] bg-white sm:rounded-t-[28px]">
              <DateRangePicker
                bloom
                className="min-h-0 flex-1 rounded-none"
                checkIn={checkIn}
                checkOut={checkOut}
                minDate={today}
                onRangeChange={(inDate, outDate) => {
                  setCheckIn(inDate);
                  setCheckOut(outDate);
                }}
                onConfirm={afterDates}
              />
            </div>
          </motion.div>
        ) : null}

        {step === "hotel" ? (
          <motion.div
            key="hotel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease }}
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
