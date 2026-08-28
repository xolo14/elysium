import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
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
    void navigate({ to: "/hotels/$slug", params: { slug: chosen.slug } });
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-forest text-ivory"
    >
      <motion.div {...(hydrated ? { style: { y, scale } } : {})} className="absolute inset-0">
        {hydrated ? (
          <AnimatePresence mode="sync">
            <motion.img
              key={hotel.id}
              src={hotel.hero}
              alt={`${hotel.name} — ${hotel.region}`}
              width={1920}
              height={1088}
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
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,51,44,0.88)_0%,rgba(6,51,44,0.45)_42%,rgba(6,51,44,0.35)_100%)]" />

      <motion.div
        {...(hydrated ? { style: { opacity: fade } } : {})}
        className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-end px-5 pb-10 pt-28 sm:justify-center sm:px-10 sm:pb-14 sm:pt-32"
      >
        <div className="max-w-3xl">
          <p className="font-hero text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.92] tracking-[-0.02em] text-ivory/90">
            Fresh travel,
          </p>
          <h1 className="font-hero mt-1 text-[clamp(2.75rem,9vw,6rem)] leading-[0.9] tracking-[-0.02em]">
            Hello Elysium.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/75 sm:mt-6 sm:text-lg">
            Serviced suites for intelligent travellers — Madhapur &amp; Hitec City, at direct rates.
          </p>
        </div>

        <div className="mt-8 w-full max-w-2xl sm:mt-10">
          <p className="eyebrow text-ivory/55">Book an Elysium in</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <label className="flex min-h-14 flex-1 items-center border border-ivory/30 bg-forest/60 px-4 backdrop-blur-sm">
              <span className="sr-only">Choose a house</span>
              <select
                value={pick}
                onChange={(e) => setPick(e.target.value as typeof hotelId)}
                className="w-full bg-transparent text-sm text-ivory outline-none [color-scheme:dark]"
              >
                {hotels.map((h) => (
                  <option key={h.id} value={h.id} className="bg-forest text-ivory">
                    {h.place} — {h.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={onSearch}
              className="eyebrow inline-flex min-h-14 items-center justify-center gap-2 bg-ivory px-8 text-forest transition-opacity hover:opacity-90"
            >
              <BrandStar className="h-2.5 w-2.5" />
              Search
            </button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-ivory/80">
            <BrandStar className="h-2.5 w-2.5 text-ivory/50" />
            Book Direct for Lowest Prices!
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 sm:mt-10">
          <Link
            to="/book"
            className="link-luxe text-sm font-bold tracking-[0.16em] text-ivory/70 uppercase hover:text-ivory"
          >
            Or reserve a stay →
          </Link>
          <a
            href="#properties"
            className="link-luxe text-sm font-bold tracking-[0.16em] text-ivory/70 uppercase hover:text-ivory"
          >
            Browse houses →
          </a>
        </div>
      </motion.div>
    </section>
  );
}
