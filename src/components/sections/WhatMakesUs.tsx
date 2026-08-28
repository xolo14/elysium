import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";

const pillars = [
  {
    title: "Hospitality with heart",
    copy: "Like a host you can always rely on — we’re there every step of your stay, from check-in to the quiet of your suite.",
    image: "/images/image-9.png",
    alt: "Quiet bedroom suite at Elysium",
  },
  {
    title: "Kept spotless",
    copy: "We design suites to stay easy to keep ready — daily housekeeping, fresh linen and the details guests notice first.",
    image: "/images/image-10.png",
    alt: "Serviced living space at Elysium",
  },
  {
    title: "Sleep, properly",
    copy: "Quiet floors, considered beds and the rest that makes the next day in Hyderabad better — short visit or month-long stay.",
    image: "/images/hero-suite-living.png",
    alt: "Living room suite at Elysium",
  },
];

/** Bloom “What makes us” band — Elysium forest theme. */
export function WhatMakesUs() {
  return (
    <section id="makes-us" className="relative overflow-hidden bg-forest py-14 text-ivory sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
        <Reveal>
          <h2 className="text-center font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.02em]">
            What makes us Elysium?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-ivory/70 sm:text-base">
            With so much to tell &amp; so little time, here are a few key highlights.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-3 sm:gap-6">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="flex h-full flex-col overflow-hidden bg-ivory text-forest">
                <div className="aspect-[5/4] overflow-hidden">
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
          <a
            href="#why"
            className="eyebrow mx-auto mt-10 flex w-fit items-center justify-center gap-2.5 bg-ivory px-7 py-3.5 text-[0.8rem] tracking-[0.2em] text-forest transition-opacity hover:opacity-90 sm:mt-12 sm:px-8 sm:py-4 sm:text-[0.875rem]"
          >
            Explore the 4B’s
            <BrandStar className="h-3 w-3" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
