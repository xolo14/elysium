import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";



export function Hero() {
  const { hotel } = useHotel();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative h-[100svh] w-full overflow-hidden bg-forest text-ivory"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.img
            key={hotel.id}
            src={hotel.hero}
            alt={`${hotel.name} — ${hotel.region}`}
            width={1920}
            height={1088}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="ken-burns absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,20,17,0.72),rgba(8,20,17,0.32)_48%,rgba(8,20,17,0.4))]" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 flex h-full flex-col items-center justify-end px-5 pb-14 pt-28 text-center sm:justify-center sm:px-6 sm:pb-10 sm:pt-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow text-ivory/70"
        >
          {hotel.badge} — {hotel.established}
        </motion.p>

        <h1 className="mt-6 overflow-hidden sm:mt-8">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.3, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="block font-display text-[clamp(2.55rem,11vw,7.4vw)] leading-[0.9] tracking-[-0.02em] sm:text-[9vw] lg:text-[7.4vw]"
          >
            Elysium Studio Suites
          </motion.span>
        </h1>

        <div className="mt-4 overflow-hidden sm:mt-5">
          <motion.p
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ delay: 0.45, duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md font-display text-xl text-ivory/80 sm:text-2xl lg:text-3xl"
          >
            Luxury Reimagined
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-14 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
        >
          <Link
            to="/book"
            className="group relative z-10 overflow-hidden border border-ivory/50 px-8 py-4 sm:px-10"
          >
            <span className="eyebrow relative z-10 transition-colors duration-700 group-hover:text-forest">
              Reserve Stay
            </span>
            <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-ivory transition-transform duration-700 ease-luxe group-hover:scale-y-100" />
          </Link>
          <a
            href="#suites"
            className="link-luxe eyebrow flex min-h-11 items-center justify-center px-4 py-3 text-ivory/80"
          >
            Explore Suites
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
