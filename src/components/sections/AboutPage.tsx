import { useState } from "react";
import { hotels } from "@/data/hotels";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";

const stats = [
  { value: "2", label: "Houses" },
  { value: "4.7★", label: "Guest rating" },
  { value: "4B", label: "Bed · Breakfast · Bathroom · Balcony" },
];

const values = [
  { title: "Quality", copy: "The same 4B standard in every suite." },
  { title: "Clarity", copy: "Direct rates. No surprises at checkout." },
  { title: "Care", copy: "Housekeeping and a desk that answers." },
  { title: "Long stays", copy: "Kitchenettes, laundry, weekly rhythm." },
  { title: "Work-ready", copy: "Desks, Wi-Fi, quiet floors." },
  { title: "Return", copy: "The same house on night one and night thirty." },
];

/** Tight, editorial about — little copy, aligned grid, soft corners. */
export function AboutPage() {
  const [slide, setSlide] = useState(0);
  const showcase = hotels[slide] ?? hotels[0]!;

  return (
    <>
      <section className="bg-ivory pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="page-wrap text-center">
          <Reveal>
            <h1 className="mx-auto max-w-3xl font-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.95] tracking-[-0.02em] text-forest">
              Be one of a few,
              <br />
              not one of a thousand.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-foreground/70 sm:text-base">
              Two houses in Hyderabad. One standard.
            </p>
            <a
              href="mailto:elysium.hyd@gmail.com?subject=About%20Elysium"
              className="eyebrow mt-8 inline-flex items-center gap-2 rounded-[10px] bg-forest px-8 py-4 text-ivory transition-opacity hover:opacity-90"
            >
              <BrandStar className="h-3 w-3" />
              Get in touch
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest text-ivory">
        <div className="page-wrap grid gap-8 py-10 sm:grid-cols-3 sm:gap-6 sm:py-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="font-display text-3xl sm:text-4xl">{s.value}</p>
              <p className="mt-2 text-sm text-ivory/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background py-14 sm:py-16 lg:py-20">
        <div className="page-wrap">
          <Reveal>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-secondary sm:aspect-[21/10]">
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
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="Previous house"
                    onClick={() => setSlide((i) => (i - 1 + hotels.length) % hotels.length)}
                    className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-ivory text-forest transition-opacity hover:opacity-90"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next house"
                    onClick={() => setSlide((i) => (i + 1) % hotels.length)}
                    className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-ivory text-forest transition-opacity hover:opacity-90"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-14 sm:py-16 lg:py-20">
        <div className="page-wrap">
          <Reveal>
            <h2 className="max-w-xl font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] tracking-[-0.02em] text-forest">
              A house that stays personal.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {values.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.04}>
                <li className="border-t border-forest/15 pt-5">
                  <h3 className="font-display text-xl text-forest">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.copy}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-[1200px] lg:grid-cols-2">
          <Reveal className="flex flex-col justify-center bg-forest px-8 py-14 text-ivory sm:px-12 sm:py-16">
            <p className="eyebrow text-ivory/55">Recognition</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[0.95]">
              Built for guests who return.
            </h2>
            <p className="mt-5 max-w-sm text-sm text-ivory/75">
              4.7★ across both houses. Breakfast included.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[360px]">
              <img
                src="/images/image-12.png"
                alt="Dining at Elysium"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest text-ivory">
        <div className="page-wrap flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Ready when you are.</h2>
            <p className="mt-3 text-sm text-ivory/75">Owners, corporates, or a quiet stay.</p>
          </div>
          <a
            href="mailto:elysium.hyd@gmail.com"
            className="eyebrow inline-flex items-center gap-2 rounded-[10px] bg-ivory px-6 py-4 text-forest transition-opacity hover:opacity-90"
          >
            elysium.hyd@gmail.com
          </a>
        </div>
      </section>
    </>
  );
}
