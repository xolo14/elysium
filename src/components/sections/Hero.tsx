import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;

function asWebp(src: string) {
  return src.replace(/\.(png|jpe?g)$/i, ".webp");
}

/** Hero — brand, line, Book Now (opens house pick → calendar). */
export function Hero() {
  const { hotel } = useHotel();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const [opening, setOpening] = useState(false);
  const desktop = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const openBook = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => {
      void navigate({ to: "/book" });
    }, 280);
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex w-full flex-col overflow-hidden bg-forest text-ivory min-h-[min(100svh,34rem)] sm:min-h-[32rem] md:aspect-[2048/841] md:min-h-0 md:max-h-[841px]"
    >
      <motion.div
        {...(hydrated && desktop ? { style: { y, scale } } : {})}
        className="absolute inset-0"
      >
        {hydrated ? (
          <AnimatePresence mode="sync">
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="absolute inset-0"
            >
              <picture>
                <source srcSet={asWebp(hotel.hero)} type="image/webp" />
                <img
                  src={hotel.hero}
                  alt={`${hotel.name} — ${hotel.region}`}
                  width={1600}
                  height={900}
                  fetchPriority="high"
                  decoding="async"
                  className="ken-burns absolute inset-0 h-full w-full object-cover"
                />
              </picture>
            </motion.div>
          </AnimatePresence>
        ) : (
          <picture>
            <source srcSet={asWebp(hotel.hero)} type="image/webp" />
            <img
              src={hotel.hero}
              alt={`${hotel.name} — ${hotel.region}`}
              width={1600}
              height={900}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        )}
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.15)_20%,transparent_38%),linear-gradient(to_top,rgba(6,51,44,0.9)_0%,rgba(6,51,44,0.35)_45%,rgba(6,51,44,0.12)_100%)]" />

      <AnimatePresence>
        {opening ? (
          <motion.div
            key="book-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
            className="pointer-events-none absolute inset-0 z-20 bg-forest"
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        {...(hydrated && desktop ? { style: { opacity: fade } } : {})}
        className="page-wrap relative z-10 flex flex-1 flex-col justify-end pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-20 sm:pb-9 sm:pt-24"
      >
        <div className="max-w-3xl">
          <p className="font-hero text-[clamp(2rem,7vw,4.5rem)] leading-[0.92] tracking-[-0.02em] text-ivory/90">
            Fresh travel,
          </p>
          <h1 className="font-hero mt-1 text-[clamp(2.25rem,8vw,5rem)] leading-[0.9] tracking-[-0.02em]">
            Hello Elysium.
          </h1>
          <p className="mt-3 max-w-md prose-quiet text-[0.9rem] text-ivory/80 sm:mt-5 sm:text-base">
            Direct rates.
          </p>
        </div>

        <motion.button
          type="button"
          onClick={openBook}
          disabled={opening}
          whileTap={{ scale: 0.98 }}
          animate={
            opening
              ? { scale: 1.03, y: -6, opacity: 0.9 }
              : { scale: 1, y: 0, opacity: 1 }
          }
          transition={{ duration: 0.25, ease }}
          className={cn(
            "group mt-5 flex min-h-12 w-full max-w-xl items-center justify-between gap-2.5 rounded-[10px] bg-ivory px-3.5 text-left text-forest shadow-[0_16px_40px_-18px_rgba(0,0,0,0.5)] sm:mt-6 sm:min-h-14 sm:gap-3 sm:px-5",
            opening && "pointer-events-none",
          )}
        >
          <span className="min-w-0 truncate font-nav text-[14px] font-bold tracking-[-0.01em] sm:text-base">
            {opening ? "Opening houses…" : "Book an Elysium in Hyderabad"}
          </span>
          <span className="btn-primary shrink-0 !min-h-9 px-4 text-[12px] sm:!min-h-11 sm:px-5 sm:text-[13px]">
            Book Now
          </span>
        </motion.button>
      </motion.div>
    </section>
  );
}
