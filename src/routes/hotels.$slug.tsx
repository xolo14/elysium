import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { hotels, type Hotel, type Suite } from "@/data/hotels";
import { hotelFaqs } from "@/data/faqs";
import { getHotelCarouselImages } from "@/data/hotel-images";
import { HotelProvider } from "@/context/hotel";
import {
  HotelGalleryBar,
  HotelImageCarousel,
  useHotelCarousel,
} from "@/components/HotelImageCarousel";
import { Suite360Experience, View360HeroControl } from "@/components/Suite360Experience";
import { submitBooking } from "@/lib/submit-booking";
import { DateRangePicker } from "@/components/booking/DateRangePicker";
import { BookingDetailsFields, BookingStepBar } from "@/components/booking/BookingDetailsFields";
import { formatNice, nightsBetween, toInputDate } from "@/lib/booking-dates";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { SocialProof } from "@/components/sections/SocialProof";
import { AmenitiesGrid } from "@/components/sections/Amenities";
import { FourBHighlight } from "@/components/sections/FourBHighlight";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";

export const Route = createFileRoute("/hotels/$slug")({
  loader: ({ params }) => {
    const hotel = hotels.find((h) => h.slug === params.slug);
    if (!hotel) throw notFound();
    return { hotel };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Hotel unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const h = loaderData.hotel;
    const title = `${h.name}, ${h.place} — Rooms & Booking`;
    const description = `${h.summary} Rooms from ${h.fromRate} per night in ${h.region}. Book direct with Elysium Hotels.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:image", content: h.hero },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: h.hero },
      ],
    };
  },
  component: HotelPage,
});

function HotelPage() {
  const { hotel } = Route.useLoaderData();
  const pageTabs = [
    { label: "Photos", href: "#photos" },
    { label: "Rooms", href: "#rooms" },
    { label: "Amenities", href: "#amenities" },
    { label: "Reviews", href: "#reviews" },
    { label: "Location", href: "#location" },
    { label: "FAQs", href: "#faqs" },
  ];

  return (
    <HotelProvider initialId={hotel.id}>
      <main className="bg-background">
        <Nav />
        <HotelIntro hotel={hotel} tabs={pageTabs} />
        <Rooms hotel={hotel} />
        <Amenities hotel={hotel} />
        <FourBHighlight />
        <Reviews hotel={hotel} />
        <LocationBlock hotel={hotel} />
        <FaqBlock />
        <DiscoverOther currentId={hotel.id} />
        <SocialProof hotel={hotel} />
        <Footer />
      </main>
    </HotelProvider>
  );
}

function HotelIntro({
  hotel,
  tabs: navTabs,
}: {
  hotel: Hotel;
  tabs: { label: string; href: string }[];
}) {
  const carouselImages = useMemo(() => getHotelCarouselImages(hotel), [hotel]);
  const { slides, index, currentSlide, progress, goPrev, goNext } = useHotelCarousel(carouselImages);
  const [tourOpen, setTourOpen] = useState(false);
  const tours = hotel.virtualTours;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return toInputDate(d);
  }, []);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toInputDate(d);
  });
  const [guests, setGuests] = useState(2);

  return (
    <section id="photos" className="relative">
      <div className="relative z-20 h-[70svh] min-h-[480px] w-full overflow-hidden bg-forest sm:h-[78svh] sm:min-h-[560px]">
        <HotelImageCarousel
          key={hotel.id}
          images={carouselImages}
          hotelSlug={hotel.slug}
          hotelName={hotel.name}
          place={hotel.place}
          layout="hero"
          index={index}
          progress={progress}
          className="h-full w-full"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-forest/20" />
      </div>

      {tours && tours.length > 0 ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[70svh] min-h-[480px] sm:h-[78svh] sm:min-h-[560px]">
          <View360HeroControl
            imageSrc={tours[0]!.thumbnail}
            onClick={() => setTourOpen(true)}
            className="pointer-events-auto absolute bottom-36 left-4 sm:bottom-40 sm:left-8 lg:left-12"
          />
        </div>
      ) : null}

      <div className="relative z-30 mx-auto -mt-24 max-w-[1400px] px-4 sm:-mt-28 sm:px-10">
        <HotelGalleryBar
          caption={currentSlide?.caption}
          hotelSlug={hotel.slug}
          slideCount={slides.length}
          onPrev={goPrev}
          onNext={goNext}
          className="mb-3 border border-ivory/15 bg-forest/55 backdrop-blur-md sm:mb-4"
        />

        {/* Bloom-style booking strip */}
        <div className="border border-forest/10 bg-forest text-ivory shadow-[0_24px_60px_rgba(8,20,17,0.25)]">
          <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr_1fr_0.7fr_auto]">
            <div className="border-b border-ivory/15 px-5 py-4 lg:border-r lg:border-b-0">
              <p className="eyebrow text-ivory/60">Property</p>
              <p className="mt-1 font-display text-xl leading-tight sm:text-2xl">
                {hotel.name}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-ivory/70">
                <BrandStar className="h-2 w-2" />
                {hotel.rating}/5 · {hotel.place}
              </p>
            </div>
            <label className="border-b border-ivory/15 px-5 py-4 lg:border-r lg:border-b-0">
              <span className="eyebrow text-ivory/60">Check-in</span>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm text-ivory outline-none [color-scheme:dark]"
              />
            </label>
            <label className="border-b border-ivory/15 px-5 py-4 lg:border-r lg:border-b-0">
              <span className="eyebrow text-ivory/60">Check-out</span>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm text-ivory outline-none [color-scheme:dark]"
              />
            </label>
            <label className="border-b border-ivory/15 px-5 py-4 lg:border-r lg:border-b-0">
              <span className="eyebrow text-ivory/60">Guests</span>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-sm text-ivory outline-none [color-scheme:dark]"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n} className="bg-forest text-ivory">
                    {n} guest{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-stretch p-2">
              <a
                href="#rooms"
                className="flex min-h-12 w-full items-center justify-center bg-ivory px-8 text-forest transition-opacity hover:opacity-90"
              >
                <span className="eyebrow">Search</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-background px-5 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <h1 className="font-display text-[1.85rem] leading-tight sm:text-5xl">
                {hotel.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-foreground/70">
                <BrandStar className="h-2.5 w-2.5 text-forest" />
                {hotel.rating}/5 · {hotel.place}, Hyderabad
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/75 sm:text-base">
                {hotel.summary}
              </p>
            </div>
            <div className="shrink-0 lg:text-right">
              <p className="font-display text-3xl sm:text-4xl">{hotel.fromRate}</p>
              <p className="mt-1 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                / night onwards · Incl. taxes
              </p>
              <ul className="mt-5 flex flex-col gap-2 lg:items-end">
                {hotel.offers.slice(0, 3).map((o) => (
                  <li key={o} className="flex items-center gap-2 text-sm text-foreground/70">
                    <BrandStar className="h-2 w-2 text-forest" />
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-7 gap-y-3 border-b border-border py-5">
          <Link to="/" className="eyebrow font-semibold text-muted-foreground hover:text-foreground">
            All hotels
          </Link>
          {navTabs.map((t) => (
            <a key={t.href} href={t.href} className="eyebrow font-semibold hover:text-muted-foreground">
              {t.label}
            </a>
          ))}
        </nav>
      </div>

      {tours?.length ? (
        <Suite360Experience views={tours} open={tourOpen} onClose={() => setTourOpen(false)} />
      ) : null}
    </section>
  );
}

function Rooms({ hotel }: { hotel: Hotel }) {
  const [selected, setSelected] = useState<Suite | null>(null);

  return (
    <section id="rooms" data-anchor="booking" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-10">
      <span id="booking" className="block" />
      <Reveal>
        <h2 className="font-display text-4xl text-forest sm:text-5xl">Rooms</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Book directly to request Early Check-in / Late Check-out, as per availability.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {hotel.suites.map((s, idx) => (
          <Reveal key={s.name} delay={idx * 0.05}>
            <article className="flex h-full flex-col border border-border bg-background">
              <img
                src={s.image}
                alt={`${s.name} at ${hotel.name}, ${hotel.place}`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {s.capacity}
                </p>
                <h3 className="mt-1 font-display text-xl">{s.name}</h3>
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  {s.size} · {s.view} view
                </p>
                <p className="mt-auto pt-5 font-display text-lg">
                  {s.rate.replace(" / night", "")}
                  <span className="ml-1 text-xs font-sans font-normal tracking-wide text-muted-foreground uppercase">
                    onwards
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Incl. taxes</p>
                <button
                  type="button"
                  onClick={() => setSelected(s)}
                  className="eyebrow mt-4 w-full bg-forest py-3 text-ivory transition-colors hover:bg-forest/90"
                >
                  Book
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {selected && (
        <BookingPanel hotel={hotel} suite={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}

function BookingPanel({
  hotel,
  suite,
  onClose,
}: {
  hotel: Hotel;
  suite: Suite;
  onClose: () => void;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [step, setStep] = useState<"dates" | "details">("dates");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

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
      setError(err instanceof Error ? err.message : "Could not save your request.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-forest/60 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Book ${suite.name}`}
      onClick={onClose}
    >
      <div
        className="max-h-[92svh] w-full max-w-5xl overflow-y-auto bg-background p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-muted-foreground">
              {hotel.name} — {hotel.place}
            </p>
            <h3 className="mt-3 font-display text-3xl">{suite.name}</h3>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{suite.rate}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="eyebrow inline-flex items-center gap-2 text-forest transition-opacity hover:opacity-70"
            aria-label="Close booking"
          >
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Close
          </button>
        </div>

        {sent ? (
          <div className="mt-10 border border-border p-6">
            <p className="font-display text-2xl">Request received</p>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">
              Thank you, {form.name || "guest"}. Our front desk will confirm {rooms} room
              {rooms === 1 ? "" : "s"} ({suite.name}) for {nights} night{nights === 1 ? "" : "s"},{" "}
              {guests} guest{guests === 1 ? "" : "s"}, at {hotel.name}, {hotel.place} on{" "}
              {hotel.contact.phone}.
            </p>
            {bookingId && (
              <p className="mt-3 text-sm text-muted-foreground">
                Reference: <span className="font-mono">{bookingId.slice(0, 8)}</span>
              </p>
            )}
            <a
              href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`}
              className="eyebrow mt-6 inline-block border border-foreground/25 px-6 py-3"
            >
              Call the hotel
            </a>
          </div>
        ) : (
          <div className="mt-8">
            <BookingStepBar step={step} />

            {step === "dates" ? (
              <div className="mt-6">
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  minDate={today}
                  onRangeChange={(inDate, outDate) => {
                    setCheckIn(inDate);
                    setCheckOut(outDate);
                  }}
                  onConfirm={() => setStep("details")}
                />
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                  <div>
                    <p className="eyebrow text-muted-foreground">Selected dates</p>
                    <p className="mt-2 text-sm">
                      {formatNice(checkIn)} → {formatNice(checkOut)} · {nights} night
                      {nights === 1 ? "" : "s"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("dates")}
                    className="eyebrow text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Change dates
                  </button>
                </div>

                <div className="mt-8">
                  <p className="eyebrow text-muted-foreground">Guest details</p>
                  <div className="mt-6">
                    <BookingDetailsFields
                      guests={guests}
                      rooms={rooms}
                      form={form}
                      onGuestsChange={setGuests}
                      onRoomsChange={setRooms}
                      onFormChange={(key, value) => setForm((f) => ({ ...f, [key]: value }))}
                    />
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                  <p className="text-sm text-muted-foreground">
                    {rooms} room{rooms === 1 ? "" : "s"} · {guests} guest{guests === 1 ? "" : "s"}
                  </p>
                  {error && (
                    <p className="w-full text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="eyebrow border border-foreground/25 px-8 py-3 transition-colors hover:bg-forest hover:text-ivory disabled:opacity-60"
                  >
                    {submitting ? "Saving…" : "Confirm request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Amenities({ hotel }: { hotel: Hotel }) {
  return (
    <section id="amenities" className="border-y border-border bg-background py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-10">
        <Reveal>
          <p className="eyebrow tracking-[0.28em] text-forest/55">Amenities</p>
        </Reveal>
        <div className="mt-7 sm:mt-8">
          <AmenitiesGrid hotel={hotel} />
        </div>
      </div>
    </section>
  );
}

function Reviews({ hotel }: { hotel: Hotel }) {
  return (
    <section id="reviews" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-4xl text-forest sm:text-5xl">Reviews</h2>
          <p className="eyebrow flex items-center gap-2 text-muted-foreground">
            <BrandStar className="h-2.5 w-2.5 text-forest" />
            {hotel.rating}/5 guest rating
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hotel.testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <blockquote className="flex h-full flex-col border border-border p-6">
              <div className="flex gap-1 text-forest">
                {Array.from({ length: 5 }).map((_, s) => (
                  <BrandStar key={s} className="h-2.5 w-2.5" />
                ))}
              </div>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-foreground/80">“{t.quote}”</p>
              <footer className="mt-6 border-t border-border pt-4">
                <cite className="not-italic font-display text-lg">{t.name}</cite>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.origin} · {t.stay}
                </p>
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function LocationBlock({ hotel }: { hotel: Hotel }) {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(hotel.mapQuery)}&output=embed`;

  return (
    <section id="location" className="border-y border-border bg-background py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <Reveal>
          <h2 className="font-display text-4xl text-forest sm:text-5xl">Location</h2>
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <address className="not-italic">
              <div className="space-y-1 text-sm leading-relaxed text-foreground/80">
                {hotel.contact.address.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <div className="mt-8 space-y-3 text-sm text-foreground/70">
                <p>Near Hitec City & Madhapur business corridor</p>
                <p>Airport transfer available on request</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                <a
                  href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`}
                  className="link-luxe text-sm"
                >
                  {hotel.contact.phone}
                </a>
                <a href={`mailto:${hotel.contact.email}`} className="link-luxe text-sm">
                  {hotel.contact.email}
                </a>
              </div>
              <p className="mt-8 text-sm text-muted-foreground">
                Check-in from 2:00 pm · Check-out by 11:00 am
              </p>
            </address>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="aspect-[4/3] overflow-hidden border border-border bg-secondary">
              <iframe
                title={`Map — ${hotel.name}`}
                src={mapSrc}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FaqBlock() {
  return (
    <section id="faqs" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-10">
      <Reveal>
        <h2 className="font-display text-4xl text-forest sm:text-5xl">Frequently asked questions</h2>
      </Reveal>
      <dl className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {hotelFaqs.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.04}>
            <div>
              <dt className="font-display text-xl leading-snug">{item.q}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-foreground/75">{item.a}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

function DiscoverOther({ currentId }: { currentId: Hotel["id"] }) {
  const others = hotels.filter((h) => h.id !== currentId);

  return (
    <section className="border-t border-border bg-secondary py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <Reveal>
          <h2 className="font-display text-4xl text-forest sm:text-5xl">Living across Hyderabad</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {others.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.06}>
              <article className="group overflow-hidden border border-border bg-background">
                <Link to="/hotels/$slug" params={{ slug: h.slug }} className="block">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={h.hero}
                      alt={`${h.name}, ${h.place}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-1000 ease-luxe group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-4 p-5">
                    <div>
                      <p className="eyebrow text-muted-foreground">{h.place}</p>
                      <h3 className="mt-1 font-display text-2xl">{h.name}</h3>
                    </div>
                    <span className="eyebrow border border-foreground/20 px-4 py-2 transition-colors group-hover:bg-forest group-hover:text-ivory">
                      View
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
