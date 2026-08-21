import { Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useHotel } from "@/context/hotel";
import type { Hotel, Suite } from "@/data/hotels";
import { BrandLineBurst } from "@/lib/brand";

function SuiteCard({ suite, hotel }: { suite: Suite; hotel: Hotel }) {
  return (
    <Link
      to="/hotels/$slug"
      params={{ slug: hotel.slug }}
      hash="rooms"
      className="group relative flex h-[68svh] w-[85vw] shrink-0 snap-center flex-col overflow-hidden bg-forest text-ivory sm:w-[70vw] lg:h-[82svh] lg:w-[36vw]"
    >
      <div className="relative h-[46%] overflow-hidden lg:h-[52%]">
        <img
          src={suite.image}
          alt={`${suite.name} at ${hotel.name}, ${hotel.place}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.06]"
        />
        <span className="absolute top-5 left-5 bg-forest/85 px-3 py-1.5 text-xs font-medium tracking-wide text-ivory">
          Step {suite.index}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-7 lg:p-8">
        <h3 className="font-display text-[1.75rem] leading-tight sm:text-3xl lg:text-4xl">
          {suite.name}
        </h3>
        <p className="mt-3 text-sm font-normal text-ivory/85">
          {suite.size} · {suite.capacity} · {suite.view}
        </p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ivory/75 sm:mt-4 lg:line-clamp-none">
          {suite.detail}
        </p>

        <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5">
          {suite.amenities.slice(0, 4).map((a) => (
            <li key={a} className="border border-ivory/30 px-3 py-1 text-xs text-ivory/85">
              {a}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 border-t border-ivory/25 pt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-5">
          <p className="font-display text-2xl">{suite.rate}</p>
          <span className="inline-flex min-h-11 items-center justify-center border border-ivory/45 px-5 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-500 group-hover:bg-ivory group-hover:text-forest">
            View & book
          </span>
        </div>
      </div>
    </Link>
  );
}

function SuiteHeading() {
  const { hotel } = useHotel();
  return (
    <div className="relative mx-auto max-w-[1600px] px-5 pt-14 sm:px-10 lg:pt-20">
      <BrandLineBurst className="pointer-events-none absolute -left-[6%] top-[12%] hidden h-[55svh] w-auto text-foreground/[0.06] lg:block" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="display-title mt-4 sm:mt-6">Five ways to stay</h2>
        </div>
        <div className="max-w-sm">
          <Link
            to="/hotels/$slug"
            params={{ slug: hotel.slug }}
            hash="rooms"
            className="mt-2 inline-flex min-h-11 items-center border border-foreground/25 px-6 py-3 text-xs font-semibold tracking-wide uppercase transition-colors duration-500 hover:bg-forest hover:text-ivory"
          >
            See all rooms & rates
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Mobile / tablet: native left–right swipe */
function SuitesMobile() {
  const { hotel } = useHotel();
  return (
    <div className="mt-10 lg:hidden">
      <div className="flex gap-4 overflow-x-auto px-5 pb-8 snap-x snap-mandatory [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
        {hotel.suites.map((s) => (
          <SuiteCard key={`${hotel.id}-${s.name}-m`} suite={s} hotel={hotel} />
        ))}
      </div>
      <p className="eyebrow px-5 text-muted-foreground">Swipe to explore suites</p>
    </div>
  );
}

/** Desktop: vertical scroll drives horizontal scrub */
function SuitesDesktop() {
  const { hotel } = useHotel();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const distanceMv = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform([scrollYProgress, distanceMv], ([progress, distance]) => {
    return -Number(progress) * Number(distance);
  });

  useLayoutEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const measure = () => {
      const next = Math.max(0, track.scrollWidth - window.innerWidth);
      distanceMv.set(next);
      section.style.height = `${window.innerHeight + next}px`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    track.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", measure, { once: true });
    });
    const t1 = window.setTimeout(measure, 150);
    const t2 = window.setTimeout(measure, 600);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hotel.id, distanceMv]);

  return (
    <div ref={sectionRef} className="relative mt-8 hidden lg:block" style={{ height: "200vh" }}>
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-8 px-10 will-change-transform"
        >
          {hotel.suites.map((s) => (
            <SuiteCard key={`${hotel.id}-${s.name}`} suite={s} hotel={hotel} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function Suites() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section id="suites" className="relative bg-background">
      <SuiteHeading />
      {/* Mount only the active mode so scroll listeners don't fight on mobile */}
      {isDesktop ? <SuitesDesktop /> : <SuitesMobile />}
    </section>
  );
}
