import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useHotel } from "@/context/hotel";
import { BrandLineBurst, BrandLineStar, BrandStar } from "@/lib/brand";
import { MaskImage, Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";


export function Gallery() {
  const { hotel } = useHotel();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative overflow-hidden bg-background py-14 lg:py-20">
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-10">
        <Reveal className="max-w-2xl">
          <h2 className="display-title mt-4 sm:mt-6">
            Fragments of {hotel.place}
          </h2>
        </Reveal>

        <div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:mt-16 sm:auto-rows-[200px] sm:gap-4 lg:auto-rows-[260px] lg:grid-cols-3 lg:gap-6">
          {hotel.gallery.map((g, i) => (
            <button
              key={`${hotel.id}-${g.caption}`}
              onClick={() => setOpen(i)}
              className={cn("group relative overflow-hidden max-lg:row-span-1", g.span)}
            >
              <MaskImage
                src={g.image}
                alt={g.caption}
                className="h-full w-full"
                imgClassName="transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.07]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/10 to-transparent transition-colors duration-700 group-hover:from-forest/80" />
              {i % 2 === 0 ? (
                <BrandLineStar className="pointer-events-none absolute top-3 right-3 h-9 w-9 text-ivory/70 transition-transform duration-700 group-hover:rotate-12 sm:top-5 sm:right-5 sm:h-12 sm:w-12" />
              ) : (
                <BrandLineBurst className="pointer-events-none absolute top-3 right-3 h-9 w-9 text-ivory/70 transition-transform duration-700 group-hover:-rotate-12 sm:top-5 sm:right-5 sm:h-12 sm:w-12" />
              )}
              <span className="absolute inset-x-3 bottom-1.5 flex translate-y-0 items-center gap-2 text-left opacity-100 transition-all duration-700 ease-luxe sm:inset-x-5 sm:bottom-2 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                <BrandStar className="h-2 w-2 shrink-0 text-ivory" />
                <span className="eyebrow text-ivory">{g.caption}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-forest/95 p-4 pt-16 sm:p-6"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="eyebrow absolute top-5 right-5 min-h-11 px-3 text-ivory/80"
              aria-label="Close gallery"
            >
              Close
            </button>
            <motion.figure
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[86vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={hotel.gallery[open]?.image}
                alt={hotel.gallery[open]?.caption ?? ""}
                className="max-h-[78vh] w-full object-contain"
              />
              <figcaption className="eyebrow mt-5 text-center text-ivory/70">
                {hotel.gallery[open]?.caption}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
