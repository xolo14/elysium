import { ArrowLeft, ArrowRight, Rotate3D, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Suite360View } from "@/data/hotels";
import { BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Step = "select" | "view";

/** Round arrow + 360° label (proper arrows, not &lt; &gt;). */
function View360ArrowsCluster({
  className,
  tone = "ivory",
}: {
  className?: string;
  tone?: "ivory" | "glass";
}) {
  const onIvory = tone === "ivory";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-2 sm:gap-2.5 sm:px-3.5",
        onIvory ? "bg-ivory text-forest" : "border border-ivory/50 bg-forest/50 text-ivory backdrop-blur-md",
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8",
          onIvory ? "border border-forest/30 bg-forest/5" : "border border-ivory/45 bg-ivory/10",
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
      </span>
      <span className="flex min-w-[2.75rem] flex-col items-center gap-0.5">
        <Rotate3D className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase sm:text-[11px]">360°</span>
      </span>
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full sm:h-8 sm:w-8",
          onIvory ? "border border-forest/30 bg-forest/5" : "border border-ivory/45 bg-ivory/10",
        )}
      >
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
      </span>
    </span>
  );
}

/** Hero control: large preview with VIEW 360° watermark centered on the image. */
export function View360HeroControl({
  imageSrc,
  onClick,
  className,
}: {
  imageSrc: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group z-40 flex w-[12.5rem] flex-col overflow-hidden border border-ivory/30 bg-forest/40 text-left shadow-[0_16px_48px_rgba(8,20,17,0.45)] transition-opacity hover:opacity-95 sm:w-[15.5rem]",
        className,
      )}
      aria-label="Open 360 degree suite preview"
    >
      <span className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={imageSrc}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-forest/25" />
        {/* Watermark centered on the preview image — no solid background */}
        <span className="absolute inset-0 flex items-center justify-center p-3">
          <span className="eyebrow inline-flex items-center gap-2 font-bold text-ivory drop-shadow-[0_2px_8px_rgba(8,20,17,0.85)] sm:gap-2.5">
            <Rotate3D className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2.25} aria-hidden="true" />
            View 360°
          </span>
        </span>
      </span>
    </button>
  );
}

/** Compact mark for overlays (selection cards, etc.). */
export function View360ArrowsMark({
  className,
  tone = "ivory",
}: {
  className?: string;
  tone?: "ivory" | "glass";
}) {
  return <View360ArrowsCluster className={className} tone={tone} />;
}

/**
 * Lightweight equirectangular drag viewer — used when `panorama` is set.
 * Replace/remove once you standardize on a dedicated 360 library if needed.
 */
function EquirectangularViewer({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const [yaw, setYaw] = useState(50);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setYaw((y) => {
      const next = y - dx * 0.08;
      if (next < 0) return next + 100;
      if (next > 100) return next - 100;
      return next;
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="img"
      aria-label={alt}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: `${yaw}% 50%`,
      }}
    />
  );
}

function EmbedViewer({ url, title }: { url: string; title: string }) {
  return (
    <iframe
      title={`${title} — 360° tour`}
      src={url}
      className="absolute inset-0 h-full w-full border-0 bg-forest"
      allow="fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function ViewerStage({ view }: { view: Suite360View }) {
  if (view.panorama) {
    return <EquirectangularViewer src={view.panorama} alt={`${view.name} 360° panorama`} />;
  }
  if (view.embedUrl) {
    return <EmbedViewer url={view.embedUrl} title={view.name} />;
  }
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-forest px-6 text-center">
      {view.thumbnail ? (
        <img
          src={view.thumbnail}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      ) : null}
      <div className="relative z-[1] max-w-md">
        <Rotate3D className="mx-auto h-8 w-8 text-ivory/70" strokeWidth={1.25} />
        <p className="mt-4 font-display text-2xl text-ivory">{view.name}</p>
        <p className="mt-2 text-sm text-ivory/70">
          This 360° tour is being prepared. Please check back shortly, or call the front desk to arrange a walkthrough.
        </p>
      </div>
    </div>
  );
}

export function Suite360Experience({
  views,
  open,
  onClose,
}: {
  views: Suite360View[];
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("select");
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = views.find((v) => v.id === activeId) ?? null;

  const reset = useCallback(() => {
    setStep("select");
    setActiveId(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (step === "view") {
          setStep("select");
          setActiveId(null);
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step, handleClose, reset]);

  if (!open || !views.length) return null;

  const openView = (id: string) => {
    setActiveId(id);
    setStep("view");
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-forest/80 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suite-360-title"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[96svh] w-full max-w-5xl flex-col overflow-hidden border border-ivory/15 bg-forest text-ivory shadow-[0_24px_60px_rgba(8,20,17,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ivory/15 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            {step === "view" && active ? (
              <button
                type="button"
                onClick={() => {
                  setStep("select");
                  setActiveId(null);
                }}
                className="eyebrow inline-flex items-center gap-2 text-ivory/80 transition-opacity hover:text-ivory"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Back
              </button>
            ) : (
              <p className="eyebrow text-ivory/60">Explore the suite</p>
            )}
            <h2 id="suite-360-title" className="sr-only">
              {step === "view" && active ? `${active.name} 360° experience` : "Explore the suite in 360°"}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            className="eyebrow inline-flex shrink-0 items-center gap-2 text-ivory transition-opacity hover:opacity-70"
            aria-label="Close 360 experience"
          >
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Close
          </button>
        </div>

        {step === "select" ? (
          <div className="overflow-y-auto px-4 py-8 sm:px-8 sm:py-10">
            <h2 className="text-center font-display text-3xl sm:text-4xl">Explore the suite</h2>
            <p className="mx-auto mt-3 max-w-md text-center text-sm text-ivory/70">
              Choose a space to walk through in immersive 360°.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
              {views.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => openView(view.id)}
                  className="group relative flex aspect-[4/5] flex-col overflow-hidden border border-ivory/20 text-left transition-colors hover:border-ivory/50 sm:aspect-[5/6]"
                >
                  <img
                    src={view.thumbnail}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,20,17,0.88),rgba(8,20,17,0.2)_48%,rgba(8,20,17,0.3))]" />

                  {/* Same transparent View 360° watermark as hero preview */}
                  <span className="absolute inset-0 flex items-center justify-center p-4">
                    <span className="eyebrow inline-flex items-center gap-2 font-bold text-ivory drop-shadow-[0_2px_8px_rgba(8,20,17,0.85)] transition-transform duration-700 ease-luxe group-hover:scale-105 sm:gap-2.5">
                      <Rotate3D className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" strokeWidth={2.25} aria-hidden="true" />
                      View 360°
                    </span>
                  </span>

                  <span className="relative mt-auto flex flex-col gap-2 p-5 sm:p-6">
                    <span className="eyebrow flex items-center gap-2 text-ivory/70">
                      <BrandStar className="h-2 w-2" /> Explore in 360°
                    </span>
                    <span className="font-display text-2xl leading-tight sm:text-3xl">{view.name}</span>
                    <span className="text-sm text-ivory/75">{view.description}</span>
                    <span className="eyebrow mt-3 inline-flex w-fit border border-ivory/40 px-4 py-2">
                      Explore 360°
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : active ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative mx-4 mb-3 mt-4 min-h-[min(62svh,520px)] flex-1 overflow-hidden border border-ivory/15 bg-forest sm:mx-6 sm:mb-4 sm:mt-5">
              {active.thumbnail && !active.panorama ? (
                <img
                  src={active.thumbnail}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
              ) : null}
              <ViewerStage view={active} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ivory/15 px-4 py-3 sm:px-6">
              <p className="eyebrow text-ivory/70">
                {active.name} · 360° experience
              </p>
              <p className="text-xs text-ivory/55">
                {active.panorama
                  ? "Drag to look around"
                  : active.embedUrl
                    ? "Use the controls inside the tour to look around"
                    : "Tour coming soon"}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function View360GalleryButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("relative z-30 inline-flex shrink-0", className)}
      aria-label="View 360 degree suite experience"
    >
      <View360ArrowsMark tone="ivory" />
    </button>
  );
}
