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
};

export function HotelImageCarousel({
  images,
  hotelSlug,
  hotelName,
  place,
  className,
  overlay,
}: HotelImageCarouselProps) {
  const slides = useMemo(() => images.filter((image) => Boolean(image.src)), [images]);
  const [index, setIndex] = useState(0);
  const lastIndex = Math.max(0, slides.length - 1);
  const goPrev = () => setIndex((prev) => (prev <= 0 ? lastIndex : prev - 1));
  const goNext = () => setIndex((prev) => (prev >= lastIndex ? 0 : prev + 1));

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

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(8,20,17,0.55),rgba(8,20,17,0.08)_45%,rgba(8,20,17,0.25))]" />

      {overlay}

      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="flex items-end justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            {slides.map((slide, slideIndex) => (
              <button
                key={`${slide.src}-${slideIndex}-indicator`}
                type="button"
                aria-label={`Show image ${slideIndex + 1} of ${slides.length}`}
                aria-current={slideIndex === index ? "true" : undefined}
                onClick={() => setIndex(slideIndex)}
                className={cn(
                  "h-1 max-w-12 flex-1 transition-all duration-500",
                  slideIndex === index ? "bg-ivory" : "bg-ivory/35 hover:bg-ivory/55",
                )}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              to="/hotels/$slug/gallery"
              params={{ slug: hotelSlug }}
              preload="intent"
              className="link-luxe eyebrow relative z-30 hidden min-h-11 items-center text-ivory sm:inline-flex"
            >
              View all images
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/45 bg-forest/35 text-ivory backdrop-blur-sm transition-colors hover:bg-ivory hover:text-forest"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/45 bg-ivory text-forest transition-opacity hover:opacity-90"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
}
