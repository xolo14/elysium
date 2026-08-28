import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { hotels } from "@/data/hotels";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";

const stats = [
  { value: "2", label: "Houses in Hyderabad" },
  { value: "4.7★", label: "Average guest rating" },
  { value: "4B", label: "Bed · Breakfast · Bathroom · Balcony" },
];

const teamPoints = [
  {
    title: "Quality focus",
    copy: "Every suite is kept to the same 4B standard — quiet rest, real breakfast, a ready bathroom and open air where the layout allows.",
  },
  {
    title: "Transparency",
    copy: "Direct rates, clear inclusions and a front desk that answers — no opaque extras at check-out.",
  },
  {
    title: "Rapid care",
    copy: "Housekeeping, hot water and practical fixes move quickly so the stay stays smooth from day one.",
  },
  {
    title: "Long-stay ready",
    copy: "Kitchenettes, laundry and weekly rhythms for teams and relocators making Hyderabad home for a while.",
  },
  {
    title: "Best product",
    copy: "Serviced suites designed for sleep and work — desks, Wi-Fi and quiet floors in Madhapur and Hitec City.",
  },
  {
    title: "Trusted returns",
    copy: "Guests come back because the house feels consistent — the same care on night one and night thirty.",
  },
];

const expectFromYou = [
  { title: "Ambition", copy: "Partners who want hospitality to feel personal, not anonymous." },
  { title: "Quality mindset", copy: "A shared belief that clean rooms and quiet nights are non-negotiable." },
  { title: "Honesty", copy: "Clear communication with guests, owners and our front desk teams." },
  { title: "Financial clarity", copy: "Stable operations and transparent billing for long and short stays." },
  { title: "Attitude", copy: "Warmth at the door — the detail guests remember after they leave." },
  { title: "Smart judgement", copy: "Decisions that protect the guest experience and the house standard." },
];

const expectFromUs = [
  {
    title: "Thorough review",
    copy: "We look at location, product and operations before we grow — carefully, not loudly.",
  },
  {
    title: "Fair estimation",
    copy: "Clear expectations on rates, service levels and what the 4B’s mean in practice.",
  },
  {
    title: "Quick follow-up",
    copy: "Partnership and corporate enquiries get a real reply — not a ticket void.",
  },
  {
    title: "Steady development",
    copy: "When we add a house, we keep the same standard guests already trust.",
  },
];

/** Bloom-style about / partners narrative — Elysium forest theme. */
export function AboutPage() {
  const [slide, setSlide] = useState(0);
  const showcase = hotels[slide] ?? hotels[0]!;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, var(--forest) 1px, transparent 1px), radial-gradient(circle at 80% 70%, var(--forest) 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />
        <div className="relative mx-auto max-w-[1000px] px-5 text-center sm:px-10">
          <Reveal>
            <h1 className="font-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.95] tracking-[-0.02em] text-forest">
              Be one of a few,
              <br />
              not one of a thousand.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-lg">
              Elysium is a small, deliberate hospitality house in Hyderabad — two addresses, one
              standard, and a front desk that knows your name.
            </p>
            <a
              href="mailto:elysium.hyd@gmail.com?subject=About%20Elysium%20%2F%20Partnership"
              className="eyebrow mt-8 inline-flex items-center gap-2 bg-forest px-8 py-4 text-ivory transition-opacity hover:opacity-90"
            >
              <BrandStar className="h-3 w-3" />
              Get in touch
            </a>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-forest text-ivory">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 sm:grid-cols-3 sm:gap-6 sm:px-10 sm:py-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="font-display text-3xl sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-ivory/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Property showcase */}
      <section className="bg-background py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden bg-secondary sm:aspect-[21/10]">
              <img
                src={showcase.hero}
                alt={`${showcase.name}, ${showcase.place}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/10 to-transparent" />
              <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-4 p-5 sm:p-8">
                <div className="min-w-0 text-ivory">
                  <p className="eyebrow text-ivory/60">{showcase.place}</p>
                  <h2 className="mt-2 font-display text-2xl sm:text-3xl">{showcase.name}</h2>
                  <p className="mt-2 max-w-md text-sm text-ivory/75">{showcase.tagline}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="Previous house"
                    onClick={() => setSlide((i) => (i - 1 + hotels.length) % hotels.length)}
                    className="flex h-11 w-11 items-center justify-center bg-ivory text-forest transition-opacity hover:opacity-90"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next house"
                    onClick={() => setSlide((i) => (i + 1) % hotels.length)}
                    className="flex h-11 w-11 items-center justify-center bg-ivory text-forest transition-opacity hover:opacity-90"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Join hands */}
      <section className="bg-ivory py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
          <Reveal>
            <h2 className="max-w-xl font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] tracking-[-0.02em] text-forest">
              Join hands with a house that stays personal.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {teamPoints.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <li>
                  <BrandStar className="h-4 w-4 text-forest" />
                  <h3 className="mt-4 font-display text-xl text-forest sm:text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{p.copy}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Award */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-[1200px] lg:grid-cols-2">
          <Reveal className="flex flex-col justify-center bg-forest px-8 py-14 text-ivory sm:px-12 sm:py-16">
            <p className="eyebrow text-ivory/55">Recognition</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95]">
              Built for guests who return.
            </h2>
            <p className="mt-5 max-w-md text-xs leading-relaxed text-ivory/75 sm:text-base">
              4.7★ average across both houses — quiet suites, breakfast included, and a desk that
              remembers how you like to stay.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[360px]">
              <img
                src="/images/image-12.png"
                alt="Dining and hospitality at Elysium"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What we expect */}
      <section className="bg-ivory py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
          <Reveal>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] tracking-[-0.02em] text-forest">
              What we look for in partners.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {expectFromYou.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.04}>
                <li className="border-t border-forest/15 pt-5">
                  <h3 className="font-display text-xl text-forest">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{p.copy}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Guest voice */}
      <section className="bg-secondary py-12 sm:py-14">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-10">
          <Reveal>
            <blockquote className="grid gap-8 border border-border bg-background p-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12 sm:p-10">
              <p className="font-display text-2xl tracking-wide text-forest/40 sm:text-3xl">4.7★</p>
              <div>
                <p className="font-display text-2xl leading-snug text-forest sm:text-3xl">
                  “A calm alternative for long stays near Hitec City.”
                </p>
                <p className="mt-3 text-sm text-muted-foreground">From guests across both houses</p>
                <Link
                  to="/"
                  hash="trusted"
                  className="eyebrow mt-5 inline-flex text-forest/70 underline decoration-forest/25 underline-offset-4 hover:text-forest"
                >
                  See guest moments
                </Link>
              </div>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* What you can expect */}
      <section className="bg-background py-14 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 sm:px-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] tracking-[-0.02em] text-forest">
                What you can expect from us.
              </h2>
            </Reveal>
            <ul className="mt-10 space-y-8">
              {expectFromUs.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05}>
                  <li>
                    <h3 className="font-display text-xl text-forest">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.copy}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={0.1}>
            <div className="aspect-[4/5] overflow-hidden bg-secondary sm:aspect-[5/6]">
              <img
                src="/images/hero-suite-living.png"
                alt="Suite living at Elysium"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA bar */}
      <section className="bg-forest text-ivory">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-14">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Ready to grow with Elysium?</h2>
            <p className="mt-3 max-w-md text-sm text-ivory/75">
              Owners, corporates and curious guests — write to us and we’ll take it from there.
            </p>
          </div>
          <a
            href="mailto:elysium.hyd@gmail.com"
            className="eyebrow inline-flex items-center gap-2 border border-ivory/35 bg-ivory px-6 py-4 text-forest transition-opacity hover:opacity-90"
          >
            elysium.hyd@gmail.com
          </a>
        </div>
      </section>

      {/* Why Elysium */}
      <section className="bg-secondary py-14 sm:py-16">
        <div className="mx-auto max-w-[800px] px-5 sm:px-10">
          <Reveal>
            <div className={cn("border border-forest/20 bg-background p-8 sm:p-10")}>
              <h2 className="font-display text-3xl text-forest sm:text-4xl">Why Elysium?</h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70 sm:text-base">
                We’re not chasing a thousand rooms. We’re keeping two houses — Madhapur and Hitec
                City — to a standard guests can feel: the 4B’s, daily care, and hospitality that
                stays personal.
              </p>
              <a
                href="mailto:elysium.hyd@gmail.com?subject=Get%20in%20touch%20%E2%80%94%20Elysium"
                className="eyebrow mt-8 inline-flex items-center gap-2 text-forest"
              >
                <BrandStar className="h-2.5 w-2.5" />
                Get in touch
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
