import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Search } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { useHydrated } from "@/hooks/use-hydrated";

/** Bloom-style hero — one composition: brand, line, search. */
export function Hero() {
  const { hotel } = useHotel();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex w-full flex-col overflow-hidden bg-forest text-ivory min-h-[min(100svh,34rem)] sm:min-h-[32rem] md:aspect-[2048/841] md:min-h-0 md:max-h-[841px]"
    >
      <motion.div {...(hydrated ? { style: { y, scale } } : {})} className="absolute inset-0">
        {hydrated ? (
          <AnimatePresence mode="sync">
            <motion.img
              key={hotel.id}
              src={hotel.hero}
              alt={`${hotel.name} — ${hotel.region}`}
              width={2048}
              height={841}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="ken-burns absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <img
            src={hotel.hero}
            alt={`${hotel.name} — ${hotel.region}`}
            width={2048}
            height={841}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.15)_20%,transparent_38%),linear-gradient(to_top,rgba(6,51,44,0.9)_0%,rgba(6,51,44,0.35)_45%,rgba(6,51,44,0.12)_100%)]" />

      <motion.div
        {...(hydrated ? { style: { opacity: fade } } : {})}
        className="page-wrap relative z-10 flex flex-1 flex-col justify-end pb-6 pt-20 sm:pb-9 sm:pt-24"
      >
        <div className="max-w-3xl">
          <p className="font-hero text-[clamp(2.1rem,6.5vw,4.5rem)] leading-[0.92] tracking-[-0.02em] text-ivory/90">
            Fresh travel,
          </p>
          <h1 className="font-hero mt-1 text-[clamp(2.4rem,7.5vw,5rem)] leading-[0.9] tracking-[-0.02em]">
            Hello Elysium.
          </h1>
          <p className="mt-4 max-w-md prose-quiet text-ivory/80 sm:mt-5 sm:text-base">
            Madhapur &amp; Hitec City. Direct rates.
          </p>
        </div>

        <form
          className="mt-5 w-full max-w-xl sm:mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            void navigate({ to: "/book" });
          }}
        >
          <label className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] bg-ivory px-4 text-forest shadow-[0_16px_40px_-18px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-luxe hover:scale-[1.01] sm:min-h-14 sm:px-5">
            <button type="submit" className="shrink-0 text-forest/50 transition-colors group-hover:text-forest" aria-label="Book in Hyderabad">
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <span className="font-nav text-[15px] font-bold tracking-[-0.01em] sm:text-base">
              Book an Elysium in Hyderabad
            </span>
          </label>
        </form>
      </motion.div>
    </section>
  );
}
