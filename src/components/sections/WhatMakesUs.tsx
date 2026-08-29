import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";

const pillars = [
  {
    title: "Hospitality with heart",
    copy: "A host at every step — from check-in to the quiet of your suite.",
    image: "/images/image-9.png",
    alt: "Quiet bedroom suite at Elysium",
  },
  {
    title: "Kept spotless",
    copy: "Daily housekeeping, fresh linen, and the details guests notice first.",
    image: "/images/image-10.png",
    alt: "Serviced living space at Elysium",
  },
  {
    title: "Sleep, properly",
    copy: "Quiet floors and considered beds — for a night or a month.",
    image: "/images/hero-suite-living.png",
    alt: "Living room suite at Elysium",
  },
];

/** Bloom “What makes us” band — Elysium forest theme. */
export function WhatMakesUs() {
  return (
    <section id="makes-us" className="relative overflow-hidden bg-forest text-ivory section-pad">
      <div className="page-wrap">
        <Reveal>
          <h2 className="text-center display-nav text-[clamp(2.25rem,5vw,3.5rem)]">
            What makes us Elysium?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-center text-sm text-ivory/70">
            Three things we never compromise.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-3 sm:gap-6">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="flex h-full flex-col overflow-hidden rounded-[10px] bg-ivory text-forest">
                <div className="aspect-[5/4] overflow-hidden rounded-t-[10px]">
                  <img
                    src={p.image}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-display text-xl leading-tight sm:text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{p.copy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <Link
            to="/why"
            className="eyebrow mx-auto mt-10 flex w-fit items-center justify-center gap-2.5 rounded-[10px] bg-ivory px-7 py-3.5 text-[0.8rem] tracking-[0.2em] text-forest transition-opacity hover:opacity-90 sm:mt-12 sm:px-8 sm:py-4 sm:text-[0.875rem]"
          >
            Why Elysium
            <BrandStar className="h-3 w-3" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
