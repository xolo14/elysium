import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import { BrandBurst, BrandLineCorner, BrandStar, BrandWatermark } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  { to: 2, decimals: 0, suffix: "", label: "Houses in Hyderabad" },
  { to: 4.7, decimals: 1, suffix: "★", label: "Guest rating" },
  { to: 4, decimals: 0, suffix: "B", label: "Bed · Breakfast · Bathroom · Balcony" },
  { to: 24, decimals: 0, suffix: "h", label: "Front desk, every hour" },
];

const values = [
  {
    n: "01",
    title: "Bed",
    copy: "Quiet rooms, considered beds, fresh linen — rest that makes the next day better.",
  },
  {
    n: "02",
    title: "Breakfast",
    copy: "A real buffet at O Sorriso. Included on every direct booking.",
  },
  {
    n: "03",
    title: "Bathroom",
    copy: "Hot water, fresh towels, ready after travel. Daily service.",
  },
  {
    n: "04",
    title: "Balcony",
    copy: "Selected suites open to private air and city views.",
  },
  {
    n: "05",
    title: "Clarity",
    copy: "Direct rates. Taxes in. No surprises at checkout.",
  },
  {
    n: "06",
    title: "Consistency",
    copy: "The same house on night one and night thirty.",
  },
];

function CountUp({
  to,
  decimals = 0,
  suffix = "",
  className,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const hydrated = useHydrated();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!hydrated || !inView) return;
    let frame = 0;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setVal(to * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hydrated, inView, to]);

  const shown = decimals ? val.toFixed(decimals) : String(Math.round(val));

  return (
    <span ref={ref} className={className}>
      {shown}
      {suffix}
    </span>
  );
}

/** Dedicated Why Elysium page — numbered, count-up, staged motion. */
export function WhyPage() {
  const hydrated = useHydrated();

  return (
    <>
      <section className="relative overflow-hidden bg-forest pt-28 pb-16 text-ivory sm:pt-32 sm:pb-24">
        <BrandWatermark className="-right-24 -bottom-24 text-ivory" />
        <BrandLineCorner className="pointer-events-none absolute top-24 right-6 hidden h-36 w-16 rotate-180 text-ivory/20 sm:right-12 lg:block" />
        <BrandBurst className="pointer-events-none absolute top-36 left-[8%] hidden h-10 w-10 text-ivory/15 lg:block" />

        <div className="page-wrap relative">
          {hydrated ? (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
            >
              <p className="eyebrow text-ivory/55">Why Elysium</p>
              <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.94] tracking-[-0.02em]">
                Putting the trust
                <br />
                back into travel.
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/75 sm:text-base">
                Two houses. One 4B standard. A desk that answers.
              </p>
            </motion.div>
          ) : (
            <div>
              <p className="eyebrow text-ivory/55">Why Elysium</p>
              <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.94] tracking-[-0.02em]">
                Putting the trust
                <br />
                back into travel.
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/75 sm:text-base">
                Two houses. One 4B standard. A desk that answers.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-ivory">
        <div className="page-wrap grid gap-8 py-12 sm:grid-cols-2 sm:gap-10 sm:py-16 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <p className="font-display text-[clamp(2.75rem,6vw,4rem)] leading-none tracking-[-0.03em] text-forest">
                <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm text-foreground/65">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-background py-14 sm:py-16 lg:py-20">
        <div className="page-wrap">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[0.95] tracking-[-0.02em] text-bronze">
              Our values make us trusted by guests.
            </h2>
          </Reveal>

          <ul className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.n} delay={i * 0.06}>
                <li>
                  <p className="font-display text-sm tracking-[0.18em] text-forest/40">{v.n}</p>
                  <h3 className="mt-3 font-display text-2xl text-forest sm:text-3xl">{v.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/70">{v.copy}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-secondary py-14 sm:py-16">
        <div className="page-wrap">
          <Reveal>
            <blockquote className="grid overflow-hidden rounded-[10px] border border-border bg-background sm:grid-cols-2">
              <div className="aspect-[4/5] overflow-hidden sm:aspect-auto sm:min-h-[22rem]">
                <img
                  src="/images/image-12.png"
                  alt="A guest moment at Elysium"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
                <BrandStar className="h-4 w-4 text-forest/35" />
                <p className="mt-5 font-display text-2xl leading-snug text-forest sm:text-3xl">
                  “A calm alternative for long stays near Hitec City.”
                </p>
                <footer className="mt-5 text-sm text-muted-foreground">From guests across both houses</footer>
              </div>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest py-14 text-ivory sm:py-16">
        <div className="page-wrap flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl">Stay with the 4B’s.</h2>
            <p className="mt-3 text-sm text-ivory/75">Madhapur or Hitec City. Direct rates.</p>
          </div>
          <Link
            to="/book"
            className={cn(
              "eyebrow inline-flex items-center gap-2 rounded-[10px] bg-ivory px-7 py-4 text-forest",
              "transition-opacity hover:opacity-90",
            )}
          >
            <BrandStar className="h-3 w-3" />
            Book a stay
          </Link>
        </div>
      </section>
    </>
  );
}
