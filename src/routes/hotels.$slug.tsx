import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { hotels, type Hotel, type Suite } from "@/data/hotels";
import { hotelFaqs } from "@/data/faqs";
import { displaySrc, getHotelCarouselImages, getSuiteCardImages } from "@/data/hotel-images";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/site";

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
    const title = `${h.name}, ${h.place}. Rooms & Booking`;
    const description = `${h.summary} Rooms from ${h.fromRate} per night in ${h.region}. Book direct with Elysium Hotels.`;
    return pageMeta({
      title,
      description,
      path: `/hotels/${h.slug}`,
      image: h.hero,
    });
  },
  component: HotelPage,
});

const tabs = [
  { id: "rooms", label: "Rooms", icon: "bed" },
  { id: "amenities", label: "Amenities", icon: "lamp" },
  { id: "reviews", label: "Reviews", icon: "chat" },
  { id: "location", label: "Location", icon: "pin" },
  { id: "highlights", label: "Highlights", icon: "star" },
  { id: "faqs", label: "FAQs", icon: "help" },
] as const;

function strikeFrom(rate: string) {
  const n = Number(rate.replace(/[^\d]/g, "")) || 0;
  return n ? `₹${Math.round(n * 1.1).toLocaleString("en-IN")}` : "";
}

function SuitePhotoReel({ suite, offset }: { suite: Suite; offset: number }) {
  const images = useMemo(() => getSuiteCardImages(suite).map(displaySrc), [suite]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let interval = 0;
    const start = window.setTimeout(() => {
      setIndex((n) => (n + 1) % images.length);
      interval = window.setInterval(() => {
        setIndex((n) => (n + 1) % images.length);
      }, 5000);
    }, offset);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [images.length, offset]);

  return (
    <div className="relative min-h-[8rem] overflow-hidden sm:min-h-[12rem]">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? suite.name : ""}
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
            className="absolute top-1/2 left-1.5 z-30 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base text-forest sm:left-2 sm:h-8 sm:w-8"
            aria-label={`Previous ${suite.name} photo`}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((n) => (n + 1) % images.length)}
            className="absolute top-1/2 right-1.5 z-30 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base text-forest sm:right-2 sm:h-8 sm:w-8"
            aria-label={`Next ${suite.name} photo`}
          >
            ›
          </button>
          <div
            className="absolute inset-x-2 bottom-2 z-20 flex items-center gap-1 sm:inset-x-3 sm:bottom-2.5 sm:gap-1.5"
            role="tablist"
            aria-label={`${suite.name} photos`}
          >
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-label={`${suite.name} photo ${i + 1}`}
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

function HotelPage() {
  const { hotel } = Route.useLoaderData();
  return (
    <HotelProvider initialId={hotel.id}>
      <main className="bg-white">
        <Nav />
        <HotelDesk hotel={hotel} />
        <Footer />
      </main>
    </HotelProvider>
  );
}

function HotelDesk({ hotel }: { hotel: Hotel }) {
  const navigate = useNavigate();
  const images = useMemo(() => {
    return getHotelCarouselImages(hotel).map((g) => g.src);
  }, [hotel]);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("rooms");

  useEffect(() => {
    if (images.length < 2 || index >= images.length - 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      setIndex((n) => (n + 1) % images.length);
    }, 5000);
    return () => window.clearTimeout(id);
  }, [images.length, index]);
  const others = hotels.filter((h) => h.id !== hotel.id);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(hotel.mapQuery)}&output=embed`;

  const goBook = (suite?: string) => {
    void navigate({
      to: "/book",
      search: { hotel: hotel.slug, suite },
    });
  };

  const scrollTo = (id: (typeof tabs)[number]["id"]) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <section className="relative">
        <div className="relative h-[calc(min(62vw,18.5rem)+4.5rem)] overflow-hidden bg-neutral-200 sm:h-[calc(28rem+4.5rem)] lg:h-[calc(32rem+4.5rem)]">
          {images.map((src, i) => (
            <img
              key={src}
              src={displaySrc(src)}
              alt={`${hotel.name} photo ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding={i === 0 ? "sync" : "async"}
              className={cn(
                "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500",
                i === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <button
            type="button"
            onClick={() => setIndex((n) => (n - 1 + images.length) % images.length)}
            className="absolute top-1/2 left-3 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-forest sm:left-5 sm:h-11 sm:w-11"
            aria-label="Previous photo"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setIndex((n) => (n + 1) % images.length)}
            className="absolute top-1/2 right-3 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg text-forest sm:right-5 sm:h-11 sm:w-11"
            aria-label="Next photo"
          >
            ›
          </button>
          {images.length > 1 && index === images.length - 1 ? (
            <div className="absolute inset-0 z-[5] flex items-center justify-center bg-black/45 px-6 pb-28 pt-16 text-center">
              <div className="max-w-[22rem]">
                <p className="font-nav text-[1.65rem] leading-tight font-extrabold text-white sm:text-[2rem]">
                  Like what you see?
                </p>
                <p className="mx-auto mt-2 max-w-[18rem] text-[15px] leading-snug text-white sm:text-[16px]">
                  Take a look at our entire gallery for more images of this Elysium
                </p>
                <Link
                  to="/hotels/$slug/gallery"
                  params={{ slug: hotel.slug }}
                  className="mt-4 inline-flex min-h-10 items-center rounded-full bg-forest px-5 py-2 font-nav text-[15px] font-extrabold text-ivory"
                >
                  View All Images
                </Link>
              </div>
            </div>
          ) : null}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-24 bg-gradient-to-b from-black/45 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
          {images.length > 1 ? (
            <div className="absolute inset-x-0 bottom-7 z-20 sm:bottom-9">
              <div className="page-wrap">
                <div className="relative">
                  <Link
                    to="/hotels/$slug/gallery"
                    params={{ slug: hotel.slug }}
                    className="pointer-events-auto absolute right-1 bottom-full mb-3 text-[12px] leading-none font-semibold text-white underline decoration-white decoration-1 underline-offset-[3px] [text-shadow:0_1px_2px_rgba(0,0,0,0.45)] sm:right-2 sm:mb-3.5 sm:text-[13px]"
                  >
                    View All Images
                  </Link>
                  <div
                    className="flex items-center gap-1.5 sm:gap-2"
                    role="tablist"
                    aria-label="Photos"
                  >
                    {images.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        role="tab"
                        aria-label={`Photo ${i + 1}`}
                        aria-selected={i === index}
                        onClick={() => setIndex(i)}
                        className={cn(
                          "h-[5px] min-w-0 flex-1 rounded-full transition-colors duration-300",
                          i === index ? "bg-forest" : "bg-white",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="page-wrap relative z-10 -mt-6 sm:-mt-8">
          <div className="rounded-t-[22px] bg-forest px-4 pt-6 pb-5 text-ivory sm:rounded-t-[28px] sm:px-8 sm:pt-8 sm:pb-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="display-nav text-[clamp(1.55rem,5vw,2.4rem)] text-ivory">
                  {hotel.name}
                </h1>
                <p className="mt-3 font-nav text-lg font-extrabold sm:text-2xl">
                  {hotel.fromRate}{" "}
                  <span className="text-sm font-bold">/ night onwards</span>
                </p>
                <p className="mt-1 text-xs text-ivory/75">Incl. taxes</p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:items-end">
                <p className="font-nav text-lg font-extrabold">★ {hotel.rating}</p>
                <ul className="space-y-1 text-sm text-ivory/85">
                  {hotel.offers.slice(0, 3).map((o) => (
                    <li key={o}>• {o}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goBook()}
              className="mt-5 flex w-full max-w-xl items-center gap-3 rounded-[999px] bg-white px-4 py-3.5 text-left text-neutral-700 sm:px-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                  <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 10h16M8 5V3M16 5V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="min-w-0 flex-1 font-nav text-[14px] font-bold sm:text-[15px]">
                Pick Check-in &amp; Check-out Dates
              </span>
              <span className="shrink-0 rounded-[999px] bg-forest px-5 py-2 font-nav text-[13px] font-extrabold text-ivory">
                Book
              </span>
            </button>
          </div>
        </div>
      </section>

      <nav className="sticky top-[4.5rem] z-30 border-b border-neutral-100 bg-white/95 backdrop-blur-md">
        <div className="page-wrap edge-scroll justify-between gap-2 py-3 sm:py-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollTo(t.id)}
              className={cn(
                "flex min-w-[4.5rem] flex-col items-center gap-1 px-2 text-[11px] font-semibold sm:min-w-[5.5rem] sm:text-xs",
                activeTab === t.id ? "text-forest" : "text-neutral-400",
              )}
            >
              <TabIcon name={t.icon} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="page-wrap space-y-12 py-8 sm:space-y-16 sm:py-12">
        <section id="rooms">
          <h2 className="display-nav text-[clamp(1.7rem,4vw,2.5rem)] text-forest">Rooms</h2>
          <ul className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-2">
            {hotel.suites.map((suite, i) => (
              <li
                key={suite.name}
                className="grid grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-[16px] bg-white ring-1 ring-neutral-100 sm:grid-cols-[1.05fr_1fr]"
              >
                <SuitePhotoReel suite={suite} offset={i * 700} />
                <div className="flex flex-col p-4 sm:p-5">
                  <p className="text-[11px] font-semibold text-neutral-400">{suite.capacity} max</p>
                  <h3 className="mt-1 font-nav text-lg font-extrabold text-neutral-800">{suite.name}</h3>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <div>
                      <p className="text-[11px] text-neutral-400 line-through">{strikeFrom(suite.rate)}</p>
                      <p className="font-nav text-base font-extrabold text-forest">
                        {suite.rate.replace(" / night", "")}{" "}
                        <span className="text-xs font-semibold">onwards</span>
                      </p>
                      <p className="text-[10px] text-neutral-400">Incl. taxes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => goBook(suite.name)}
                      className="rounded-[999px] bg-forest px-5 py-2 font-nav text-[13px] font-extrabold text-ivory"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="amenities">
          <h2 className="display-nav text-[clamp(1.7rem,4vw,2.5rem)] text-forest">Amenities</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {hotel.amenities.slice(0, 10).map((a) => (
              <li key={a.label} className="text-center">
                <p className="font-nav text-sm font-extrabold text-forest">{a.label}</p>
                <p className="mt-1 text-xs text-neutral-500">{a.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="reviews">
          <h2 className="display-nav text-[clamp(1.7rem,4vw,2.5rem)] text-forest">Reviews</h2>
          <p className="mt-2 text-sm text-neutral-500">From guest stays at {hotel.place}</p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hotel.testimonials.map((t) => (
              <li key={t.name} className="rounded-[16px] bg-neutral-50 p-5">
                <p className="text-sm leading-relaxed text-neutral-600">“{t.quote}”</p>
                <p className="mt-4 font-nav text-sm font-extrabold text-forest">{t.name}</p>
                <p className="text-xs text-neutral-400">
                  {t.origin} · {t.stay}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section id="location">
          <h2 className="display-nav text-[clamp(1.7rem,4vw,2.5rem)] text-forest">Location</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <address className="not-italic text-sm leading-relaxed text-neutral-600">
              {hotel.contact.address.map((l) => (
                <p key={l}>{l}</p>
              ))}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-nav text-sm font-extrabold text-forest"
              >
                View on Maps
              </a>
              <p className="mt-6 text-neutral-500">
                Check-in from 2:00 pm · Check-out by 11:00 am
              </p>
            </address>
            <div className="aspect-[4/3] overflow-hidden rounded-[16px] bg-neutral-100">
              <iframe
                title={`Map of ${hotel.name}`}
                src={mapSrc}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section id="highlights">
          <h2 className="display-nav text-[clamp(1.7rem,4vw,2.5rem)] text-forest">Highlights</h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-nav text-lg font-extrabold text-forest">Why Choose Elysium?</h3>
              <ul className="mt-4 space-y-4">
                {hotel.why.slice(0, 3).map((w) => (
                  <li key={w.title}>
                    <p className="font-nav font-extrabold text-neutral-800">{w.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-500">{w.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-nav text-lg font-extrabold text-forest">
                Where to hop around {hotel.name}?
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                {hotel.nearby.map((n) => (
                  <li key={n.name}>
                    {n.name}, {n.mins}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="faqs">
          <h2 className="display-nav text-[clamp(1.7rem,4vw,2.5rem)] text-forest">
            Frequently Asked Questions
          </h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2">
            {hotelFaqs.map((item) => (
              <div key={item.q}>
                <dt className="font-nav text-lg font-extrabold text-neutral-800">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-500">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {others.length ? (
          <section>
            <h2 className="display-nav text-[clamp(1.7rem,4vw,2.5rem)] text-forest">
              Living across Hyderabad
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {others.map((h) => (
                <li key={h.id}>
                  <Link
                    to="/hotels/$slug"
                    params={{ slug: h.slug }}
                    className="block overflow-hidden rounded-[16px] ring-1 ring-neutral-100"
                  >
                    <img src={h.hero} alt={h.name} className="aspect-[16/10] w-full object-cover" />
                    <div className="flex items-end justify-between gap-3 p-5">
                      <div>
                        <h3 className="font-nav text-lg font-extrabold text-neutral-800">{h.name}</h3>
                        <p className="mt-1 text-sm text-neutral-500">
                          {h.fromRate} / night onwards
                        </p>
                      </div>
                      <span className="rounded-[999px] bg-forest px-4 py-2 font-nav text-[12px] font-extrabold text-ivory">
                        View
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}

function TabIcon({ name }: { name: string }) {
  const common = "h-5 w-5";
  if (name === "bed") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M3 18V10h18v8M3 14h18M6 10V7h5v3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "lamp") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M8 14h8l-1.2-6H9.2L8 14ZM12 14v4M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "chat") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M5 6h14v10H8l-3 3V6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="11" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "star") {
    return (
      <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
        <path d="m12 4 2.2 5.3 5.8.5-4.4 3.8 1.4 5.6L12 16.4 6.9 19.2l1.5-5.6L4 9.8l5.8-.5L12 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
