import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import type { GalleryImage } from "@/data/hotel-images";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

export function useHotelCarousel(
  images: GalleryImage[],
  options: { autoplay?: boolean } = {},
) {
  const { autoplay = true } = options;
  const slides = useMemo(() => images.filter((image) => Boolean(image.src)), [images]);
  const [index, setIndex] = useState(0);
  const lastIndex = Math.max(0, slides.length - 1);
  const currentSlide = slides[index];
  const progress = slides.length > 0 ? ((index + 1) / slides.length) * 100 : 0;

  const goPrev = () => setIndex((prev) => (prev <= 0 ? lastIndex : prev - 1));
  const goNext = () => setIndex((prev) => (prev >= lastIndex ? 0 : prev + 1));

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev >= lastIndex ? 0 : prev + 1));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [autoplay, lastIndex, slides.length]);

  return { slides, index, currentSlide, progress, goPrev, goNext };
}

type HotelGalleryBarProps = {
  caption?: string;
  hotelSlug: string;
  slideCount: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  /** Optional control shown before Gallery (e.g. View 360°). */
  leadingAction?: React.ReactNode;
};

/** Caption + gallery controls — floating bar or summary strip. */
export function HotelGalleryBar({
  caption,
  hotelSlug,
  slideCount,
  onPrev,
  onNext,
  className,
  leadingAction,
}: HotelGalleryBarProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {caption ? (
          <p className="eyebrow max-w-[14rem] truncate text-ivory/90 sm:max-w-none">{caption}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {leadingAction}
        <Link
          to="/hotels/$slug/gallery"
          params={{ slug: hotelSlug }}
          preload="intent"
          className="link-luxe eyebrow relative z-30 inline-flex min-h-9 shrink-0 items-center px-1 text-ivory transition-opacity hover:opacity-80"
        >
          Gallery
        </Link>

        {slideCount > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous image"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ivory/40 bg-forest/40 text-ivory transition-colors hover:bg-ivory hover:text-forest"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next image"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-ivory/40 bg-ivory text-forest transition-opacity hover:opacity-90"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type HotelImageCarouselProps = {
  images: GalleryImage[];
  hotelSlug: string;
  hotelName: string;
  place: string;
  className?: string;
  overlay?: React.ReactNode;
  /** Hero: photo only (gallery bar lives on the summary below). */
  layout?: "hero" | "default";
  /** Controlled slide index when layout is hero and parent owns the carousel. */
  index?: number;
  progress?: number;
};

export function HotelImageCarousel({
  images,
  hotelSlug,
  hotelName,
  place,
  className,
  overlay,
  layout = "default",
  index: controlledIndex,
  progress: controlledProgress,
}: HotelImageCarouselProps) {
  const isHero = layout === "hero";
  const isControlled = isHero && controlledIndex !== undefined;
  const internal = useHotelCarousel(images, { autoplay: !isControlled });

  const slides = internal.slides;
  const index = isControlled ? controlledIndex : internal.index;
  const progress = isControlled
    ? (controlledProgress ?? internal.progress)
    : internal.progress;
  const currentSlide = slides[index];
  const goPrev = internal.goPrev;
  const goNext = internal.goNext;

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
            ? "bg-[linear-gradient(to_top,rgba(8,20,17,0.45)_0%,rgba(8,20,17,0.08)_32%,rgba(8,20,17,0.04)_100%)]"
            : "bg-[linear-gradient(to_top,rgba(8,20,17,0.65),rgba(8,20,17,0.08)_45%,rgba(8,20,17,0.25))]",
        )}
      />

      {overlay}

      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 bg-ivory/15">
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

      {/* Default (non-hero) keeps controls on the image */}
      {!isHero && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 px-5 pb-4 sm:px-8 sm:pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              {currentSlide?.caption && (
                <p className="truncate font-display text-lg text-ivory sm:text-xl">
                  {currentSlide.caption}
                </p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Link
                to="/hotels/$slug/gallery"
                params={{ slug: hotelSlug }}
                preload="intent"
                className="link-luxe eyebrow relative z-30 hidden min-h-11 items-center text-ivory transition-opacity hover:opacity-80 sm:inline-flex"
              >
                View all images
              </Link>

              {slides.length > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous image"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-ivory/40 bg-forest/35 text-ivory backdrop-blur-sm transition-colors hover:bg-ivory hover:text-forest"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next image"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-ivory/40 bg-ivory text-forest transition-opacity hover:opacity-90"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
              )}
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
      )}
    </div>
  );
}
