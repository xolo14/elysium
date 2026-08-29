import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/Reveal";
import { Partnerships } from "@/components/sections/Partnerships";
import { hotels } from "@/data/hotels";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const values = [
  {
    title: "Honesty",
    copy: "Every great stay starts with trust. Rates with taxes in. Nothing hiding in the bill.",
  },
  {
    title: "Simplicity",
    copy: "Two houses. One 4B standard. Book, arrive, rest — without a franchise script.",
  },
  {
    title: "Community",
    copy: "Think of us as a desk you already know in Hyderabad, whatever hour you land.",
  },
  {
    title: "Generosity",
    copy: "Breakfast at O Sorriso is included. We run the other way from hidden extras.",
  },
  {
    title: "Affordability",
    copy: "Direct rates that hold for a night or a month. Value packed into every stay.",
  },
  {
    title: "Consistency",
    copy: "The same house on night one and night thirty. Otherwise, where is the rest?",
  },
];

const quotes = hotels.flatMap((h) =>
  h.testimonials.map((t) => ({
    ...t,
    image: h.id === "madhapur" ? "/images/image-12.png" : "/images/image-14.png",
    house: h.place,
  })),
);

const houses = [
  {
    title: "Studio Suites",
    copy: "Madhapur. Kitchenettes, quiet floors, a desk that knows the lane.",
    image: "/images/image-6.png",
  },
  {
    title: "Premier Suites",
    copy: "Hitec City. Larger living, full kitchens, minutes from Cyber Towers.",
    image: "/images/image-13.png",
  },
  {
    title: "Breakfast",
    copy: "A real buffet at O Sorriso. Included when you book direct.",
    image: "/images/amenities/amenity-breakfast.png",
  },
  {
    title: "The Desk",
    copy: "Someone answers. Airport cabs, extra towels, the 2 am call.",
    image: "/images/amenities/amenity-frontdesk.png",
  },
];

/** Why Elysium — forest brand theme, values, quotes, houses. */
export function WhyPage() {
  const [quote, setQuote] = useState(0);
  const [house, setHouse] = useState(0);
  const [filmOpen, setFilmOpen] = useState(false);
  const current = quotes[quote] ?? quotes[0]!;
  const visibleHouses = [houses[house % 4]!, houses[(house + 1) % 4]!, houses[(house + 2) % 4]!, houses[(house + 3) % 4]!];

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-ivory">
        <div className="page-wrap relative grid min-h-[min(100svh,40rem)] items-center gap-8 page-top pb-10 sm:min-h-[36rem] lg:grid-cols-2 lg:min-h-[88svh] lg:gap-10 lg:pb-14">
          <div className="relative z-10 max-w-xl">
            <h1 className="display-nav text-[clamp(2.4rem,6vw,3.85rem)] text-ivory">
              Putting the trust
              <br />
              back into travel.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ivory/95 sm:mt-6 sm:text-[16px]">
              Two houses in Hyderabad. One 4B standard. Direct rates, breakfast included, a desk that answers.
            </p>
            <p className="mt-5 text-[15px] font-semibold text-ivory/90">Come stay with us.</p>
          </div>
          <WhyLineScene />
        </div>
      </section>

      <section className="relative">
        <button
          type="button"
          onClick={() => setFilmOpen(true)}
          className="group relative block w-full overflow-hidden"
        >
          <img
            src="/images/hitec-city/dining-area/dining-01.png"
            alt="A moment at Elysium"
            className="h-[min(58vw,22rem)] w-full object-cover sm:h-[26rem] lg:h-[30rem]"
          />
          <span className="absolute inset-0 bg-forest/25" />
          <span className="absolute inset-0 flex flex-col items-center justify-center text-ivory">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ivory transition-transform duration-500 group-hover:scale-105">
              <span className="ml-1 border-y-[10px] border-l-[16px] border-y-transparent border-l-ivory" />
            </span>
            <span className="mt-4 font-nav text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
              Click to stay
            </span>
          </span>
        </button>
      </section>

      <section className="bg-white section-pad">
        <div className="page-wrap">
          <Reveal>
            <h2 className="display-nav max-w-2xl text-[clamp(1.85rem,4vw,2.75rem)] text-bronze">
              Our values make us trusted by guests.
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-10">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <li>
                  <h3 className="font-nav text-xl font-extrabold text-forest sm:text-[1.35rem]">{v.title}</h3>
                  <p className="mt-3 max-w-xs prose-quiet">{v.copy}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white pb-8 sm:pb-10">
        <div className="page-wrap">
          <Reveal>
            <div className="grid overflow-hidden rounded-[10px] bg-neutral-100 sm:grid-cols-2">
              <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[22rem]">
                <img src={current.image} alt="" className="h-full w-full object-cover" />
                <SparkLines />
              </div>
              <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="font-nav text-5xl leading-none text-bronze">“</p>
                <p className="mt-2 text-[1.15rem] leading-snug text-neutral-500 sm:text-xl">
                  {current.quote}
                </p>
                <p className="mt-6 font-nav text-sm font-extrabold text-forest">
                  {current.name}, {current.origin}
                </p>
                <button
                  type="button"
                  onClick={() => setQuote((n) => (n + 1) % quotes.length)}
                  className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-forest text-ivory"
                  aria-label="Next guest note"
                >
                  <Chevron />
                </button>
              </div>
            </div>
            <div className="mt-5 flex gap-1.5">
              {quotes.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-[3px] flex-1 rounded-full", i <= quote ? "bg-bronze" : "bg-neutral-200")}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest text-ivory section-pad">
        <div className="page-wrap relative">
          <h2 className="display-nav text-[clamp(1.85rem,4vw,2.75rem)]">
            Elysium Houses
          </h2>
          <p className="mt-2 text-[15px] text-ivory/90">Two addresses. One 4B standard.</p>
          <div className="relative mt-7 sm:mt-8">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {visibleHouses.map((item) => (
                <li key={item.title}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[3/4] w-full rounded-[10px] object-cover"
                  />
                  <h3 className="mt-4 font-nav text-lg font-extrabold">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ivory/85">{item.copy}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setHouse((n) => n + 1)}
              className="absolute top-[28%] right-0 hidden h-11 w-11 translate-x-1/2 items-center justify-center rounded-full bg-bronze text-ivory ring-2 ring-ivory lg:flex"
              aria-label="Next house"
            >
              <Chevron />
            </button>
          </div>
        </div>
      </section>

      <Partnerships />

      <AnimatePresence>
        {filmOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest/80 p-5 backdrop-blur-[2px]"
            onClick={() => setFilmOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="relative w-full max-w-3xl overflow-hidden rounded-[10px]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/images/hitec-city/dining-area/dining-01.png"
                alt="Elysium dining"
                className="ken-burns w-full object-cover"
              />
              <Link
                to="/book"
                className="auth-continue absolute bottom-5 left-5 right-5 max-w-xs"
              >
                Book a stay
              </Link>
              <button
                type="button"
                onClick={() => setFilmOpen(false)}
                className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-500 text-ivory"
                aria-label="Close"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
      <path
        d="M6 3 L12 8 L6 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkLines() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="pointer-events-none absolute top-8 left-4 h-20 w-20 text-bronze"
      aria-hidden="true"
    >
      <path d="M8 40 H36 M40 8 V36 M44 44 L62 62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 18 L70 10 M18 52 L10 70" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function WhyLineScene() {
  return (
    <div className="relative mx-auto h-[min(52vw,22rem)] w-full max-w-lg lg:h-[26rem]">
      <svg viewBox="0 0 480 360" className="h-full w-full overflow-visible" fill="none" aria-hidden="true">
        <g className="origin-center animate-why-sun" style={{ transformOrigin: "400px 48px" }}>
          <circle cx="400" cy="48" r="18" stroke="white" strokeWidth="1.6" />
          <path
            d="M400 18 V10 M400 86 V78 M370 48 H362 M438 48 H430 M378 26 L372 20 M422 70 L428 76 M422 26 L428 20 M378 70 L372 76"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </g>

        <g className="animate-why-float">
          <path
            d="M40 72 C52 60 72 60 84 72 C92 58 112 58 120 72"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M300 96 C314 84 336 84 348 96 C358 82 378 84 388 96"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <g className="animate-why-plane">
          <path
            d="M210 118 L268 132 L248 142 L268 148 L200 138 Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M248 142 L232 158" stroke="white" strokeWidth="1.5" />
          <path d="M268 132 C300 118 340 112 372 118" stroke="white" strokeWidth="1.4" strokeDasharray="5 5" />
          <text
            x="278"
            y="114"
            fill="white"
            fontSize="13"
            fontFamily="Nunito, sans-serif"
            fontWeight="800"
            letterSpacing="1.4"
          >
            STAY ELYSIUM
          </text>
        </g>

        <g transform="translate(40 168)">
          <path d="M20 170 V70 H90 V170" stroke="white" strokeWidth="1.5" />
          <path d="M90 100 H160 V170" stroke="white" strokeWidth="1.5" />
          <path d="M160 50 H230 V170" stroke="white" strokeWidth="1.6" />
          <path d="M230 88 H300 V170" stroke="white" strokeWidth="1.5" />
          <path d="M300 64 H370 V170" stroke="white" strokeWidth="1.5" />
          <path d="M36 92 H52 M36 110 H52 M36 128 H52" stroke="white" strokeWidth="1.3" />
          <path d="M176 78 H206 M176 98 H206 M176 118 H206" stroke="white" strokeWidth="1.3" />
          <path d="M248 112 H280 M248 130 H280" stroke="white" strokeWidth="1.3" />
          <rect x="178" y="132" width="22" height="38" className="animate-why-door fill-ivory" />
          <path d="M12 170 H390" stroke="white" strokeWidth="1.5" />
          <path d="M78 170 C84 150 96 150 102 170" stroke="white" strokeWidth="1.4" />
          <path d="M318 170 C326 146 344 146 352 170" stroke="white" strokeWidth="1.4" />
        </g>
      </svg>
    </div>
  );
}
