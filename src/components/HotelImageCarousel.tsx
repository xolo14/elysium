import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import type { GalleryImage } from "@/data/hotel-images";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 2000;

type HotelImageCarouselProps = {
  images: GalleryImage[];
  hotelSlug: string;
  hotelName: string;
  place: string;
  className?: string;
  overlay?: React.ReactNode;
  /** Hotel detail hero: lifts controls above the overlapping summary card. */
  layout?: "hero" | "default";
};

export function HotelImageCarousel({
  images,
  hotelSlug,
  hotelName,
  place,
  className,
  overlay,
  layout = "default",
}: HotelImageCarouselProps) {
  const slides = useMemo(() => images.filter((image) => Boolean(image.src)), [images]);
  const [index, setIndex] = useState(0);
  const lastIndex = Math.max(0, slides.length - 1);
  const currentSlide = slides[index];
  const progress = slides.length > 0 ? ((index + 1) / slides.length) * 100 : 0;
  const isHero = layout === "hero";

  const goPrev = () => setIndex((prev) => (prev <= 0 ? lastIndex : prev - 1));
  const goNext = () => setIndex((prev) => (prev >= lastIndex ? 0 : prev + 1));

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev >= lastIndex ? 0 : prev + 1));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [lastIndex, slides.length]);

  if (!slides.length) return null;

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-forest", className)}>
      {slides.map((slide, slideIndex) => (
        <img
          key={`${slide.src}-${slideIndex}`}
          src={slide.src}
          alt={`${hotelName}, ${place} — ${slide.caption}`}
          loading={slideIndex === 0 ? "eager" : "lazy"}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            slideIndex === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          isHero
            ? "bg-[linear-gradient(to_top,rgba(8,20,17,0.72)_0%,rgba(8,20,17,0.15)_38%,rgba(8,20,17,0.05)_100%)]"
            : "bg-[linear-gradient(to_top,rgba(8,20,17,0.65),rgba(8,20,17,0.08)_45%,rgba(8,20,17,0.25))]",
        )}
      />

      {overlay}

      {/* Top progress — subtle, out of the way */}
      {slides.length > 1 && (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 bg-ivory/15",
            isHero && "top-auto bottom-0",
          )}
        >
          <div
            className="h-full bg-ivory/80 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={index + 1}
            aria-valuemin={1}
            aria-valuemax={slides.length}
            aria-label={`Image ${index + 1} of ${slides.length}`}
          />
        </div>
      )}

      <div
        className={cn(
          "pointer-events-auto absolute inset-x-0 z-30",
          isHero ? "bottom-24 px-4 sm:bottom-28 sm:px-10" : "bottom-0 px-5 pb-6 sm:px-8 sm:pb-8",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-4",
            isHero &&
              "border border-ivory/15 bg-forest/55 px-4 py-3 backdrop-blur-md sm:px-5 sm:py-4",
          )}
        >
          <div className="min-w-0 flex-1">
            {currentSlide?.caption && (
              <p
                className={cn(
                  "truncate text-ivory",
                  isHero
                    ? "eyebrow text-ivory/85"
                    : "font-display text-lg sm:text-xl",
                )}
              >
                {currentSlide.caption}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              to="/hotels/$slug/gallery"
              params={{ slug: hotelSlug }}
              preload="intent"
              className={cn(
                "link-luxe eyebrow relative z-30 inline-flex items-center text-ivory transition-opacity hover:opacity-80",
                isHero ? "min-h-9 shrink-0 px-1" : "hidden min-h-11 sm:inline-flex",
              )}
            >
              {isHero ? "Gallery" : "View all images"}
            </Link>

            {slides.length > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className={cn(
                    "inline-flex items-center justify-center rounded-full border border-ivory/40 text-ivory transition-colors hover:bg-ivory hover:text-forest",
                    isHero ? "h-9 w-9 bg-forest/40" : "h-11 w-11 bg-forest/35 backdrop-blur-sm",
                  )}
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className={cn(
                    "inline-flex items-center justify-center rounded-full border border-ivory/40 bg-ivory text-forest transition-opacity hover:opacity-90",
                    isHero ? "h-9 w-9" : "h-11 w-11",
                  )}
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {!isHero && (
          <div className="mt-4 flex justify-end sm:hidden">
            <Link
              to="/hotels/$slug/gallery"
              params={{ slug: hotelSlug }}
              preload="intent"
              className="link-luxe eyebrow relative z-30 inline-flex min-h-11 items-center text-ivory"
            >
              View all images
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
