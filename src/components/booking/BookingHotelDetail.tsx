import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import type { Hotel, Suite } from "@/data/hotels";
import { getHotelCarouselImages } from "@/data/hotel-images";
import { hotelFaqs } from "@/data/faqs";
import { formatStayCompact, nightsBetween } from "@/lib/booking-dates";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "rooms", label: "Rooms" },
  { id: "amenities", label: "Amenities" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
  { id: "highlights", label: "Highlights" },
  { id: "faqs", label: "FAQs" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const amenityIcons: { label: string; note?: string; art: "wifi" | "shower" | "bed" | "desk" | "desk24" | "tv" | "kitchen" | "smoke" | "ac" | "towel" }[] = [
  { label: "Free Wi-Fi", art: "wifi" },
  { label: "Hot showers", art: "shower" },
  { label: "Quiet beds", art: "bed" },
  { label: "Desk & chair", art: "desk" },
  { label: "24×7 desk", art: "desk24" },
  { label: "Smart TV", art: "tv" },
  { label: "Kitchenette", art: "kitchen" },
  { label: "Non-smoking", art: "smoke" },
  { label: "Air conditioning", art: "ac" },
  { label: "Fresh towels", art: "towel" },
];

function transportFor(hotel: Hotel) {
  if (hotel.id === "madhapur") {
    return [
      { kind: "Bus", name: "Madhapur Bus Stop", meta: "1.2 km · ~8 mins" },
      { kind: "Metro", name: "Hitec City Metro", meta: "3.5 km · ~15 mins" },
      { kind: "Airport", name: "Rajiv Gandhi Intl Airport", meta: "32 km · ~45 mins" },
    ];
  }
  return [
    { kind: "Bus", name: "Hitec City Bus Terminal", meta: "1 km · ~6 mins" },
    { kind: "Metro", name: "Hitec City Metro", meta: "1.8 km · ~10 mins" },
    { kind: "Airport", name: "Rajiv Gandhi Intl Airport", meta: "30 km · ~40 mins" },
  ];
}

function parseRate(rate: string) {
  return Number(rate.replace(/[^\d]/g, "")) || 0;
}

function strikeRate(rate: string) {
  const n = parseRate(rate);
  if (!n) return "";
  return `₹ ${(Math.round(n * 1.1)).toLocaleString("en-IN")}`;
}

export function BookingHotelDetail({
  hotel,
  checkIn,
  checkOut,
  onEditDates,
  onBookSuite,
  onBack,
}: {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  onEditDates: () => void;
  onBookSuite: (suite: Suite) => void;
  onBack: () => void;
}) {
  const images = useMemo(() => {
    const gallery = getHotelCarouselImages(hotel).map((g) => g.src);
    return [hotel.hero, ...gallery].filter((src, i, arr) => arr.indexOf(src) === i);
  }, [hotel]);

  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("rooms");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [selectedSuite, setSelectedSuite] = useState<Suite | null>(null);
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const mapQuery = encodeURIComponent(hotel.mapQuery);
  const transport = transportFor(hotel);
  const reviews = hotel.testimonials;

  useEffect(() => {
    setIndex(0);
    setSelectedSuite(null);
    setActiveTab("rooms");
  }, [hotel.id]);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => setIndex((n) => (n + 1) % images.length), 5500);
    return () => window.clearInterval(id);
  }, [images.length, hotel.id]);

  const scrollTo = (id: TabId) => {
    setActiveTab(id);
    document.getElementById(`book-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-[100svh] bg-white pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[4.5rem]">
      {/* Gallery */}
      <section className="relative">
        <div className="relative h-[min(56vw,22rem)] overflow-hidden bg-neutral-200 sm:h-[28rem] lg:h-[32rem]">
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${hotel.name} photo ${i + 1}`}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => setIndex((n) => (n - 1 + images.length) % images.length)}
            className="absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest/90 text-ivory backdrop-blur-sm"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((n) => (n + 1) % images.length)}
            className="absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest/90 text-ivory backdrop-blur-sm"
            aria-label="Next photo"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-4 flex items-end justify-between gap-4 px-5 sm:px-8">
            <div className="flex min-w-0 flex-1 gap-1.5">
              {images.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn("h-1 flex-1 rounded-full", i === index ? "bg-ivory" : "bg-white/50")}
                />
              ))}
            </div>
            <Link
              to="/hotels/$slug/gallery"
              params={{ slug: hotel.slug }}
              className="shrink-0 text-sm font-semibold text-ivory underline underline-offset-4"
            >
              View All Images
            </Link>
          </div>
        </div>

        {/* Property info card */}
        <div className="page-wrap relative z-10 -mt-10 sm:-mt-14">
          <div className="rounded-t-[10px] bg-forest px-5 pt-6 pb-5 text-ivory sm:px-8 sm:pt-8">
            <button
              type="button"
              onClick={onBack}
              className="mb-3 text-sm font-semibold text-ivory/80 hover:text-ivory"
            >
              ← Hyderabad houses
            </button>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="display-nav text-[clamp(1.75rem,4vw,2.25rem)] text-ivory">
                  {hotel.name} — {hotel.place}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className="font-nav text-xl font-extrabold text-ivory sm:text-2xl">
                    {hotel.fromRate} <span className="text-base font-bold">/ night</span>
                  </p>
                  <p className="text-xs text-ivory/80">Incl. taxes</p>
                  <p className="rounded-[8px] bg-white/20 px-2 py-1 text-sm font-bold text-ivory">
                    ★ {hotel.rating}
                  </p>
                </div>
              </div>
              <ul className="space-y-1 text-sm text-ivory/80">
                {hotel.offers.slice(0, 2).map((o) => (
                  <li key={o}>• {o}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={onEditDates}
              className="mt-5 flex w-full max-w-xl items-center gap-3 rounded-[10px] bg-white px-4 py-3.5 text-left"
            >
              <Pencil className="h-4 w-4 shrink-0 text-neutral-400" />
              <span className="min-w-0 flex-1 font-nav text-sm font-bold text-neutral-800">
                {formatStayCompact(checkIn)}
                <span className="mx-2 text-bronze">→</span>
                {formatStayCompact(checkOut)}
              </span>
              <span className="shrink-0 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                {nights} Night{nights === 1 ? "" : "s"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Subnav */}
      <nav className="sticky top-[4.5rem] z-30 border-b border-neutral-100 bg-white/95 backdrop-blur-md">
        <div className="page-wrap edge-scroll py-2.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollTo(t.id)}
              className={cn(
                "shrink-0 rounded-[10px] px-3.5 py-2 text-sm font-semibold transition-colors",
                activeTab === t.id ? "bg-forest/10 text-forest" : "text-neutral-400 hover:text-neutral-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="page-wrap space-y-10 py-8 sm:space-y-12 sm:py-10">
        {/* Rooms */}
        <section id="book-rooms">
          <h2 className="display-nav text-[clamp(1.85rem,3.5vw,2.4rem)] text-forest">
            Rooms
          </h2>
          <ul className="mt-8 grid gap-5 lg:grid-cols-2">
            {hotel.suites.map((suite, i) => {
              const left = Math.max(1, 5 - (i % 4));
              const active = selectedSuite?.name === suite.name;
              return (
                <li
                  key={suite.name}
                  className={cn(
                    "overflow-hidden rounded-[10px] border bg-white sm:grid sm:grid-cols-[1.05fr_1fr]",
                    active ? "border-forest shadow-[0_12px_40px_-24px_rgba(6,51,44,0.35)]" : "border-neutral-200",
                  )}
                >
                  <div className="relative aspect-[16/11] sm:aspect-auto sm:min-h-[12rem]">
                    <img src={suite.image} alt={suite.name} className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute top-3 left-3 rounded-[8px] bg-forest/90 px-2 py-1 text-[11px] font-bold text-ivory">
                      {left} Left
                    </span>
                  </div>
                  <div className="flex flex-col p-4 sm:p-5">
                    <h3 className="font-nav text-lg font-extrabold text-neutral-800">{suite.name}</h3>
                    <p className="mt-2 text-sm text-neutral-500">{suite.capacity} max.</p>
                    <p className="mt-1 text-sm text-neutral-500">{suite.size} area</p>
                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="text-xs text-neutral-400 line-through">{strikeRate(suite.rate)}</p>
                        <p className="font-nav text-lg font-extrabold text-forest">
                          {suite.rate.replace(" / night", "")}{" "}
                          <span className="text-sm font-semibold">/ night</span>
                        </p>
                        <p className="text-[11px] text-neutral-400">Incl. taxes</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSuite(suite);
                          onBookSuite(suite);
                        }}
                        className="btn-primary rounded-[10px] px-5 py-2.5"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="relative mt-10 flex flex-col gap-4 border-t border-neutral-100 pt-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[15px] text-neutral-600">
                Check-in <span className="font-bold text-neutral-800">2:00pm</span>
                <span className="mx-2 text-neutral-300">·</span>
                Check-out <span className="font-bold text-neutral-800">11:00am</span>
              </p>
              <p className="mt-2 max-w-md text-sm text-neutral-400">
                Book directly to request Early Check-in / Late Check-out, as per availability.
              </p>
            </div>
            <LuggageArt />
          </div>
        </section>

        {/* Amenities */}
        <section id="book-amenities">
          <h2 className="display-nav text-[clamp(1.85rem,3.5vw,2.4rem)] text-forest">
            Amenities
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {(hotel.amenities.length
              ? hotel.amenities.slice(0, 10).map((a, i) => ({
                  label: a.label,
                  art: amenityIcons[i % amenityIcons.length]!.art,
                }))
              : amenityIcons
            ).map((a) => (
              <li key={a.label} className="text-center">
                <AmenityIcon kind={a.art} />
                <p className="mt-3 text-sm text-neutral-500">{a.label}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Reviews */}
        <section id="book-reviews">
          <div className="flex flex-wrap items-end gap-3">
            <p className="font-nav text-4xl font-extrabold text-forest">{hotel.rating}</p>
            <div>
              <p className="text-forest">★★★★★</p>
              <p className="text-sm text-neutral-400">From guests at {hotel.place}</p>
            </div>
          </div>
          <div className="relative mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((offset) => {
                const r = reviews[(reviewIndex + offset) % reviews.length];
                if (!r) return null;
                return (
                  <article key={`${r.name}-${offset}`} className="rounded-[10px] bg-neutral-50 p-5">
                    <p className="text-sm font-semibold text-forest">★★★★★</p>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">{r.quote}</p>
                    <p className="mt-4 text-sm font-bold text-neutral-700">
                      {r.name}
                      <span className="font-normal text-neutral-400"> · {r.origin}</span>
                    </p>
                  </article>
                );
              })}
            </div>
            {reviews.length > 1 ? (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReviewIndex((n) => (n - 1 + reviews.length) % reviews.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-ivory"
                  aria-label="Previous review"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setReviewIndex((n) => (n + 1) % reviews.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-ivory"
                  aria-label="Next review"
                >
                  ›
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* Location */}
        <section id="book-location">
          <h2 className="display-nav text-[clamp(1.85rem,3.5vw,2.4rem)] text-forest">
            Location
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="max-w-md text-[15px] leading-relaxed text-neutral-600">
                {hotel.contact.address.slice(1).join(" ")}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 underline underline-offset-4"
              >
                View on Maps ↗
              </a>
              <ul className="mt-8 grid gap-5 sm:grid-cols-3">
                {transport.map((t) => (
                  <li key={t.kind}>
                    <p className="text-xs font-bold tracking-wide text-bronze uppercase">{t.kind}</p>
                    <p className="mt-1 text-sm font-semibold text-neutral-700">{t.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{t.meta}</p>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
              className="relative flex min-h-[14rem] items-center justify-center overflow-hidden rounded-[10px] border border-neutral-200 bg-neutral-100"
            >
              <img
                src={hotel.hero}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30 blur-[2px]"
              />
              <span className="relative z-10 text-center font-nav text-lg font-extrabold text-neutral-700">
                Click to view Map.
                <span className="mt-2 block text-2xl text-bronze">●</span>
              </span>
            </a>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Attractions", copy: "Nearby", href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`attractions near ${hotel.mapQuery}`)}` },
              { title: "Restaurants", copy: "Nearby", href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`restaurants near ${hotel.mapQuery}`)}` },
              { title: "Activities", copy: "Nearby", href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`activities near ${hotel.mapQuery}`)}` },
            ].map((c) => (
              <li key={c.title}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-[10px] border border-neutral-200 px-5 py-4 transition-colors hover:border-forest/40"
                >
                  <span>
                    <span className="block font-nav font-extrabold text-bronze">{c.title}</span>
                    <span className="mt-1 block text-sm text-neutral-400">{c.copy}</span>
                    <span className="mt-2 block text-sm text-neutral-500">View</span>
                  </span>
                  <span className="text-2xl text-bronze/40" aria-hidden="true">
                    ○
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Highlights / About */}
        <section id="book-highlights">
          <h2 className="display-nav text-[clamp(1.85rem,3.5vw,2.4rem)] text-forest">
            About {hotel.name}
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-relaxed text-neutral-600">
            <p>{hotel.summary}</p>
            {hotel.about.lines.slice(0, 2).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hotel.why.slice(0, 6).map((w) => (
              <li key={w.title} className="rounded-[10px] border border-neutral-100 p-5">
                <p className="font-nav text-lg font-extrabold text-bronze">{w.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{w.copy}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section id="book-faqs">
          <h2 className="display-nav text-[clamp(1.85rem,3.5vw,2.4rem)] text-forest">
            FAQs
          </h2>
          <ul className="mt-6 divide-y divide-neutral-100 border-t border-neutral-100">
            {hotelFaqs.map((f) => (
              <li key={f.q} className="py-5">
                <p className="font-nav text-base font-extrabold text-neutral-800">{f.q}</p>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">{f.a}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-md safe-bottom">
        <div className="page-wrap flex items-center justify-between gap-3 py-2.5">
          <p className="font-nav text-sm font-extrabold text-neutral-700">
            {selectedSuite ? `1 Room · ${selectedSuite.name}` : "0 Room"}
          </p>
          <div className="flex items-center gap-3">
            <p className="hidden items-center gap-1 text-xs font-semibold text-forest sm:flex">
              <span aria-hidden="true">⚡</span>
              Lowest Price, Guaranteed!
            </p>
            <button
              type="button"
              onClick={() => {
                if (selectedSuite) onBookSuite(selectedSuite);
                else scrollTo("rooms");
              }}
              className="btn-primary rounded-[10px] px-6 py-3"
            >
              {selectedSuite ? "Continue" : "Select Rooms"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LuggageArt() {
  return (
    <svg viewBox="0 0 160 90" className="h-16 w-36 text-neutral-300" fill="none" aria-hidden="true">
      <rect x="18" y="38" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="52" y="28" width="34" height="46" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="94" y="42" width="24" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="132" cy="28" r="14" stroke="currentColor" strokeWidth="1.5" />
      <path d="M132 20 v8 l6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M64 28 v-8 h10 v8" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="70" cy="48" r="3" className="fill-bronze" />
      <path d="M28 38 v-6 h8 v6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function AmenityIcon({ kind }: { kind: (typeof amenityIcons)[number]["art"] }) {
  const common = "mx-auto h-12 w-12 text-neutral-400";
  if (kind === "wifi") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <path d="M10 22 C18 14 30 14 38 22" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16 28 C21 23 27 23 32 28" className="stroke-bronze" strokeWidth="1.6" />
        <circle cx="24" cy="34" r="2.5" className="fill-bronze" />
      </svg>
    );
  }
  if (kind === "shower") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <path d="M14 18 H34 V24 H14 Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="M18 24 v10 M24 24 v12 M30 24 v10" className="stroke-bronze" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "bed") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <path d="M8 32 V22 H40 V32" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 32 H40 M12 22 V18 H22 V22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M28 14 h4 M34 12 h4 M40 14 h3" className="stroke-bronze" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "desk") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <path d="M10 30 H38 M14 30 V38 M34 30 V38" stroke="currentColor" strokeWidth="1.6" />
        <rect x="16" y="16" width="16" height="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 16 V12 H28 V16" className="stroke-bronze" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "desk24") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <rect x="12" y="18" width="24" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="24" cy="25" r="3" className="fill-bronze" />
        <path d="M18 32 v4 H30 v-4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "tv") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <rect x="10" y="14" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M20 32 H28" className="stroke-bronze" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "kitchen") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <rect x="14" y="12" width="20" height="26" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M18 20 H30 M18 26 H26" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="30" cy="32" r="2" className="fill-bronze" />
      </svg>
    );
  }
  if (kind === "smoke") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <circle cx="24" cy="24" r="12" className="stroke-bronze" strokeWidth="1.6" />
        <path d="M14 14 L34 34" className="stroke-bronze" strokeWidth="1.6" />
        <path d="M16 28 H28" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  if (kind === "ac") {
    return (
      <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
        <rect x="10" y="16" width="28" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16 32 v4 M24 32 v6 M32 32 v4" className="stroke-bronze" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className={common} fill="none" aria-hidden="true">
      <path d="M14 30 H34 V34 H14 Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 30 V20 H32 V30" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20 V16" className="stroke-bronze" strokeWidth="1.4" />
    </svg>
  );
}
