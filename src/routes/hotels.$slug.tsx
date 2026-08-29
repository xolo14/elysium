import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { hotels, type Hotel } from "@/data/hotels";
import { hotelFaqs } from "@/data/faqs";
import { getHotelCarouselImages } from "@/data/hotel-images";
import { HotelProvider } from "@/context/hotel";
import {
  HotelGalleryBar,
  HotelImageCarousel,
  useHotelCarousel,
} from "@/components/HotelImageCarousel";
import { Suite360Experience, View360HeroControl } from "@/components/Suite360Experience";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { SocialProof } from "@/components/sections/SocialProof";
import { AmenitiesGrid } from "@/components/sections/Amenities";
import { FourBHighlight } from "@/components/sections/FourBHighlight";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";
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
    const title = `${h.name}, ${h.place} — Rooms & Booking`;
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
        <WhatsAppFloat />
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
  const navigate = useNavigate();
  const carouselImages = useMemo(() => getHotelCarouselImages(hotel), [hotel]);
  const { slides, index, currentSlide, progress, goPrev, goNext } = useHotelCarousel(carouselImages);
  const [tourOpen, setTourOpen] = useState(false);
  const tours = hotel.virtualTours;

  const onBookNow = () => {
    void navigate({
      to: "/book",
      search: { hotel: hotel.slug },
    });
  };

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

      <div className="page-wrap relative z-30 -mt-16 sm:-mt-20">
        <HotelGalleryBar
          caption={currentSlide?.caption}
          hotelSlug={hotel.slug}
          slideCount={slides.length}
          onPrev={goPrev}
          onNext={goNext}
          className="mb-3 rounded-[10px] border border-ivory/15 bg-forest/55 backdrop-blur-md sm:mb-4"
        />

        {/* Book Now — opens animated calendar → rooms flow */}
        <div className="overflow-hidden rounded-[10px] border border-forest/10 bg-forest text-ivory shadow-[0_24px_60px_rgba(8,20,17,0.25)]">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
            <div className="min-w-0">
              <p className="eyebrow text-ivory/60">Book direct</p>
              <p className="mt-1 font-display text-xl leading-tight sm:text-2xl">{hotel.name}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-ivory/70">
                <BrandStar className="h-2 w-2" />
                {hotel.rating}/5 · {hotel.place} · From {hotel.fromRate}/night
              </p>
            </div>
            <button
              type="button"
              onClick={onBookNow}
              className="btn-primary min-h-12 w-full shrink-0 bg-ivory px-10 !text-forest sm:w-auto"
            >
              Book Now
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-[10px] bg-background px-4 py-6 sm:mt-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <h1 className="display-nav text-[clamp(1.85rem,4vw,3rem)] text-forest">
                {hotel.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-foreground/70">
                <BrandStar className="h-2.5 w-2.5 text-forest" />
                {hotel.rating}/5 · {hotel.place}
              </p>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-foreground/75">
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

        <nav className="edge-scroll gap-x-5 border-b border-border py-3.5 sm:flex-wrap sm:gap-x-7 sm:overflow-visible">
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
  return (
    <section id="rooms" data-anchor="booking" className="page-wrap section-pad">
      <span id="booking" className="block" />
      <Reveal>
        <h2 className="font-display text-4xl text-forest sm:text-5xl">Rooms</h2>
        <p className="mt-3 text-sm text-muted-foreground">Early check-in on request.</p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {hotel.suites.map((s, idx) => (
          <Reveal key={s.name} delay={idx * 0.05}>
            <article className="flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-background">
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
                <Link
                  to="/book"
                  search={{ hotel: hotel.slug, suite: s.name }}
                  className="eyebrow mt-4 block w-full rounded-[10px] bg-forest py-3 text-center text-ivory transition-colors hover:bg-forest/90"
                >
                  Book
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function Amenities({ hotel }: { hotel: Hotel }) {
  return (
    <section id="amenities" className="border-y border-border bg-background py-10 sm:py-12">
      <div className="page-wrap">
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
    <section id="reviews" className="page-wrap section-pad">
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
            <blockquote className="flex h-full flex-col rounded-[10px] border border-border p-6">
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
    <section id="location" className="border-y border-border bg-background section-pad">
      <div className="page-wrap">
        <Reveal>
          <h2 className="font-display text-4xl text-forest sm:text-5xl">Location</h2>
        </Reveal>
        <div className="mt-7 grid gap-7 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <address className="not-italic">
              <div className="space-y-1 text-sm leading-relaxed text-foreground/80">
                {hotel.contact.address.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <div className="mt-8 space-y-3 text-sm text-foreground/70">
                <p>Near Hitec City. Airport transfer on request.</p>
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
            <div className="aspect-[4/3] overflow-hidden rounded-[10px] border border-border bg-secondary">
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
    <section id="faqs" className="page-wrap section-pad">
      <Reveal>
        <h2 className="font-display text-4xl text-forest sm:text-5xl">Questions</h2>
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
    <section className="border-t border-border bg-secondary section-pad">
      <div className="page-wrap">
        <Reveal>
          <h2 className="font-display text-4xl text-forest sm:text-5xl">Living across Hyderabad</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {others.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.06}>
              <article className="group overflow-hidden rounded-[10px] border border-border bg-background">
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
