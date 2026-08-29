import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { useHydrated } from "@/hooks/use-hydrated";
import { BrandStar } from "@/lib/brand";
import type { Hotel } from "@/data/hotels";

/** Bloom-style hero — full-bleed image, display headline, destination booking bar. */
export function Hero() {
  const { hotel, hotels, hotelId, selectHotel } = useHotel();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const [pick, setPick] = useState<Hotel["id"]>(hotelId);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    setPick(hotelId);
  }, [hotelId]);

  const onSearch = () => {
    const chosen = hotels.find((h) => h.id === pick) ?? hotels[0];
    if (!chosen) return;
    selectHotel(chosen.id);
    void navigate({
      to: "/book",
      search: { hotel: chosen.slug },
    });
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex w-full flex-col overflow-hidden bg-forest text-ivory aspect-[2048/841] min-h-[34rem] md:min-h-0 md:max-h-[841px]"
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

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,51,44,0.88)_0%,rgba(6,51,44,0.45)_42%,rgba(6,51,44,0.35)_100%)]" />

      <motion.div
        {...(hydrated ? { style: { opacity: fade } } : {})}
        className="page-wrap relative z-10 flex flex-1 flex-col justify-end pb-8 pt-24 sm:pb-10 sm:pt-28"
      >
        <div className="max-w-3xl">
          <p className="font-hero text-[clamp(2.1rem,6.5vw,4.5rem)] leading-[0.92] tracking-[-0.02em] text-ivory/90">
            Fresh travel,
          </p>
          <h1 className="font-hero mt-1 text-[clamp(2.4rem,7.5vw,5rem)] leading-[0.9] tracking-[-0.02em]">
            Hello Elysium.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/75 sm:mt-5 sm:text-base">
            Serviced suites in Madhapur &amp; Hitec City. Direct rates.
          </p>
        </div>

        <form
          className="mt-6 w-full max-w-xl sm:mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-[10px] bg-ivory px-4 text-forest shadow-[0_12px_36px_-16px_rgba(0,0,0,0.45)] sm:px-5">
            <button type="submit" className="shrink-0 text-forest/55" aria-label="Search stays">
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <span className="shrink-0 text-[0.8rem] sm:text-sm">Book an Elysium in</span>
            <span className="sr-only">Choose a house</span>
            <span className="relative min-w-0 flex-1">
              <select
                value={pick}
                onChange={(e) => setPick(e.target.value as typeof hotelId)}
                className="w-full cursor-pointer appearance-none bg-transparent py-4 pr-6 text-sm font-semibold text-bronze outline-none sm:text-base"
              >
                {hotels.map((h) => (
                  <option key={h.id} value={h.id} className="bg-ivory text-forest">
                    {h.place}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-0 h-0 w-0 -translate-y-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-bronze"
              />
            </span>
          </label>
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ivory/80">
            <BrandStar className="h-2.5 w-2.5 text-ivory/50" />
            Book Direct for Lowest Prices!
          </p>
        </form>

        <Link
          to="/book"
          className="link-luxe mt-6 inline-flex text-sm font-bold tracking-[0.16em] text-ivory/70 uppercase hover:text-ivory sm:mt-8"
        >
          Reserve a stay →
        </Link>
      </motion.div>
    </section>
  );
}
