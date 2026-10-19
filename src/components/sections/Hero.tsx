import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Search } from "lucide-react";
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

/** Bloom homepage hero — 700px band, 48px title, 475×64 search. */
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
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

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
      className="relative flex h-[min(28rem,82svh)] w-full flex-col overflow-hidden bg-forest text-ivory sm:h-[700px]"
    >
      <motion.div
        {...(hydrated && desktop ? { style: { y, scale } } : {})}
        className="absolute inset-0 z-0"
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
                  alt={`${hotel.name}, ${hotel.region}`}
                  width={1600}
                  height={900}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
                />
              </picture>
            </motion.div>
          </AnimatePresence>
        ) : (
          <picture>
            <source srcSet={asWebp(hotel.hero)} type="image/webp" />
            <img
              src={hotel.hero}
              alt={`${hotel.name}, ${hotel.region}`}
              width={1600}
              height={900}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
            />
          </picture>
        )}
      </motion.div>

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.08)_12%,rgba(0,0,0,0)_24%),linear-gradient(90deg,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.12)_24%,rgba(0,0,0,0)_48%)]" />

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

      <div className="home-frame relative z-10 flex h-full flex-col justify-center">
        <h1 className="max-w-[570px] font-nav text-[32px] leading-[38px] font-bold tracking-normal text-white sm:text-[48px] sm:leading-[56px]">
          <span className="block overflow-hidden">
            <span className="load-clip block" style={{ animationDelay: "0.05s" }}>
              Discover Your
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="load-clip block" style={{ animationDelay: "0.16s" }}>
              Next Stay.
            </span>
          </span>
        </h1>
        <p
          className="load-rise mt-[5px] max-w-[570px] text-[17px] leading-[24px] font-light text-white sm:text-[28px] sm:leading-[39px]"
          style={{ animationDelay: "0.32s" }}
        >
          Beautiful hotels, remarkable destinations, and smarter rates - all in one place.
        </p>

        <motion.button
          type="button"
          onClick={openBook}
          disabled={opening}
          className={cn(
            "search-pill load-rise mt-5 flex h-14 w-full max-w-[475px] items-center gap-3 rounded-[8px] bg-white px-4 text-left sm:h-[64px] sm:px-[18px]",
            opening && "pointer-events-none opacity-90",
          )}
          style={{ animationDelay: "0.46s" }}
        >
          <Search className="h-5 w-5 shrink-0 text-neutral-400" strokeWidth={2} />
          <span className="min-w-0 flex-1 truncate text-[16px] leading-none font-normal text-neutral-500 sm:text-[20px]">
            Book a stay in <span className="font-bold text-bronze">Hyderabad</span>
          </span>
        </motion.button>

        <p
          className="load-rise mt-5 flex items-center gap-2 text-[16px] leading-[22px] font-bold text-white"
          style={{ animationDelay: "0.58s" }}
        >
          <span aria-hidden="true">⚡</span>
          Book direct. Nothing gets added later.
        </p>
      </div>
    </section>
  );
}
