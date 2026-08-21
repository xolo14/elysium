import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { hotels, type Hotel, type Suite } from "@/data/hotels";
import { getHotelCarouselImages } from "@/data/hotel-images";
import { HotelProvider } from "@/context/hotel";
import { HotelImageCarousel } from "@/components/HotelImageCarousel";
import { createBooking } from "@/fns/bookings";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/Reveal";
import { BrandLineCorner, BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";

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

const tabs = [
  { label: "Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Why Elysium", href: "#why" },
  { label: "Contact", href: "#contact" },
];

function HotelPage() {
  const { hotel } = Route.useLoaderData();
  return (
    <HotelProvider initialId={hotel.id}>
      <main className="bg-background">
        <Nav />
        <HotelHero hotel={hotel} />
        <HotelSummary hotel={hotel} />
        <Rooms hotel={hotel} />
        <Amenities hotel={hotel} />
        <WhyBlock hotel={hotel} />
        <ContactBlock hotel={hotel} />
        <Footer />
      </main>
    </HotelProvider>
  );
}

function HotelHero({ hotel }: { hotel: Hotel }) {
  const carouselImages = useMemo(() => getHotelCarouselImages(hotel), [hotel]);

  return (
    <section className="relative z-20 h-[70svh] min-h-[520px] w-full overflow-hidden bg-forest">
      <BrandLineCorner className="pointer-events-none absolute top-32 left-8 z-10 h-40 w-20 text-ivory/65 sm:left-12 lg:left-20 lg:h-52 lg:w-28" />
      <HotelImageCarousel
        key={hotel.id}
        images={carouselImages}
        hotelSlug={hotel.slug}
        hotelName={hotel.name}
        place={hotel.place}
        className="h-full"
      />
    </section>
  );
}

function HotelSummary({ hotel }: { hotel: Hotel }) {
  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-[1400px] px-4 sm:px-10">
      <div className="bg-forest px-6 py-10 text-ivory sm:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-ivory/60">{hotel.badge}</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              {hotel.name}, {hotel.place}
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/75">{hotel.summary}</p>
            <div className="mt-8 flex flex-wrap items-baseline gap-6">
              <p className="font-display text-3xl">
                {hotel.fromRate}
                <span className="ml-2 text-xs tracking-widest text-ivory/60 uppercase">
                  / night incl. taxes
                </span>
              </p>
              <p className="eyebrow flex items-center gap-2 text-ivory/70">
                <BrandStar className="h-2 w-2" /> {hotel.rating} guest rating
              </p>
            </div>
          </div>
          <ul className="space-y-3 border-ivory/20 lg:col-span-5 lg:border-l lg:pl-10">
            {hotel.offers.map((o) => (
              <li key={o} className="flex items-start gap-3 text-sm text-ivory/80">
                <BrandStar className="mt-1.5 h-2 w-2 shrink-0" />
                {o}
              </li>
            ))}
            <li className="pt-4">
              <a
                href="#rooms"
                className="eyebrow inline-flex items-center gap-3 border border-ivory/40 px-6 py-3 transition-colors hover:bg-ivory hover:text-forest"
              >
                View rooms & book
              </a>
            </li>
          </ul>
        </div>
      </div>

      <nav className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border py-5">
        <Link to="/" className="eyebrow font-semibold text-muted-foreground hover:text-foreground">
          All hotels
        </Link>
        {tabs.map((t) => (
          <a key={t.href} href={t.href} className="eyebrow font-semibold hover:text-muted-foreground">
            {t.label}
          </a>
        ))}
      </nav>
    </section>
  );
}

function Rooms({ hotel }: { hotel: Hotel }) {
  const [selected, setSelected] = useState<Suite | null>(null);

  return (
    <section id="rooms" data-anchor="booking" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-10">
      <span id="booking" className="block" />
      <Reveal>
        <p className="eyebrow text-muted-foreground">Rooms</p>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl">Choose your suite</h2>
      </Reveal>

      <div className="mt-14 space-y-6">
        {hotel.suites.map((s, idx) => (
          <Reveal key={s.name} delay={idx * 0.06}>
            <article className="grid gap-8 border border-border p-5 sm:grid-cols-12 sm:p-6">
              <div className="sm:col-span-5">
                <img
                  src={s.image}
                  alt={`${s.name} at ${hotel.name}, ${hotel.place}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="sm:col-span-7 sm:flex sm:flex-col">
                <h3 className="font-display text-2xl">{s.name}</h3>
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  {s.size} · {s.capacity} · {s.view}
                </p>
                <p className="mt-4 text-base leading-relaxed text-foreground/80">{s.detail}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {s.amenities.map((a) => (
                    <li key={a} className="border border-border px-3 py-1.5 text-xs">
                      {a}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5 sm:mt-8">
                  <p className="font-display text-xl">{s.rate}</p>
                  <button
                    onClick={() => setSelected(s)}
                    className="eyebrow border border-foreground/25 px-6 py-3 transition-colors hover:bg-forest hover:text-ivory"
                  >
                    Book this room
                  </button>
                </div>
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
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  }, []);
  const defaultOut = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: tomorrow,
    checkOut: defaultOut,
    guests: "2",
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const nights = useMemo(() => {
    const a = new Date(form.checkIn).getTime();
    const b = new Date(form.checkOut).getTime();
    if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 1;
    return Math.max(1, Math.round((b - a) / 86_400_000));
  }, [form.checkIn, form.checkOut]);

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
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: Number(form.guests) || 1,
        },
      });
      setBookingId(result.id);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-forest/60 p-0 sm:items-center sm:p-6">
      <div className="max-h-[92svh] w-full max-w-2xl overflow-y-auto bg-background p-6 sm:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="eyebrow text-muted-foreground">
              {hotel.name} — {hotel.place}
            </p>
            <h3 className="mt-3 font-display text-3xl">{suite.name}</h3>
            <p className="mt-3 text-sm font-medium text-muted-foreground">{suite.rate}</p>
          </div>
          <button onClick={onClose} className="eyebrow" aria-label="Close booking">
            Close
          </button>
        </div>

        {sent ? (
          <div className="mt-10 border border-border p-6">
            <p className="font-display text-2xl">Request received</p>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              Thank you, {form.name || "guest"}. Our front desk will confirm {suite.name} for{" "}
              {nights} night{nights === 1 ? "" : "s"} at {hotel.name}, {hotel.place} on{" "}
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
          <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
            {(
              [
                ["name", "Full name", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "tel"],
                ["guests", "Guests", "number"],
                ["checkIn", "Check in", "date"],
                ["checkOut", "Check out", "date"],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="block">
                <span className="eyebrow text-muted-foreground">{label}</span>
                <input
                  required
                  type={type}
                  min={type === "number" ? 1 : undefined}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="mt-3 w-full border-b border-border bg-transparent pb-2 text-sm focus:border-foreground focus:outline-none"
                />
              </label>
            ))}
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">
                {nights} night{nights === 1 ? "" : "s"} · {form.guests} guests
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
    </div>
  );
}

function Amenities({ hotel }: { hotel: Hotel }) {
  return (
    <section id="amenities" className="border-y border-border bg-background py-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <Reveal>
          <p className="eyebrow text-muted-foreground">Amenities</p>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">Included in every stay</h2>
        </Reveal>
        <ul className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {hotel.amenities.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.04}>
              <li className="border-t border-border pt-5">
                <p className="font-display text-xl">{a.label}</p>
                <p className="mt-3 text-sm font-medium text-muted-foreground">{a.note}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhyBlock({ hotel }: { hotel: Hotel }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="why" className="bg-forest py-16 text-ivory">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-10">
        <Reveal>
          <p className="eyebrow text-ivory/60">Why Elysium</p>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl">
            What we promise at {hotel.place}
          </h2>
        </Reveal>

        <ul className="mt-14">
          {hotel.why.map((p, i) => (
            <motion.li
              key={p.index}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.95, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setOpen(i)}
              className="border-t border-ivory/15 last:border-b"
            >
              <button
                type="button"
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                aria-expanded={open === i}
                className="flex w-full items-baseline gap-6 py-7 text-left sm:gap-10"
              >
                <span
                  className={cn(
                    "eyebrow shrink-0 transition-colors duration-700",
                    open === i ? "text-accent" : "text-ivory/40",
                  )}
                >
                  {p.index}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-4">
                    <span className="font-display text-2xl sm:text-3xl">{p.title}</span>
                    <span className="text-right">
                      <span className="block font-display text-xl">{p.metric}</span>
                      <span className="eyebrow block text-ivory/50">{p.metricLabel}</span>
                    </span>
                  </span>
                  <motion.span
                    initial={false}
                    animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="block overflow-hidden"
                  >
                    <span className="mt-4 block max-w-2xl text-base leading-relaxed text-ivory/75">
                      {p.copy}
                    </span>
                  </motion.span>
                </span>
                <BrandStar
                  className={cn(
                    "mt-2 h-2.5 w-2.5 shrink-0 transition-transform duration-700",
                    open === i ? "rotate-90 text-accent" : "text-ivory/40",
                  )}
                />
              </button>
            </motion.li>
          ))}
        </ul>

        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {hotel.trust.map((t) => (
            <div key={t.label} className="border-t border-ivory/20 pt-5">
              <p className="font-display text-3xl">{t.value}</p>
              <p className="mt-3 text-sm text-ivory/70">{t.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ hotel }: { hotel: Hotel }) {
  return (
    <section id="contact" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-10">
      <Reveal>
        <p className="eyebrow text-muted-foreground">Contact</p>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl">Reach the front desk</h2>
      </Reveal>
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <address className="not-italic lg:col-span-6">
          <div className="space-y-1 text-base leading-relaxed text-foreground/80">
            {hotel.contact.address.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-8">
            <a href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`} className="link-luxe text-base">
              {hotel.contact.phone}
            </a>
            <a href={`mailto:${hotel.contact.email}`} className="link-luxe text-base">
              {hotel.contact.email}
            </a>
          </div>
        </address>
        <div className="lg:col-span-6">
          <a
            href="#rooms"
            className="eyebrow inline-flex items-center gap-3 border border-foreground/25 px-7 py-4 transition-colors hover:bg-forest hover:text-ivory"
          >
            <BrandStar className="h-2.5 w-2.5" /> Book a suite
          </a>
        </div>
      </div>
    </section>
  );
}
