import { useHotel } from "@/context/hotel";
import type { Hotel } from "@/data/hotels";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type IconKind =
  | "breakfast"
  | "kitchen"
  | "wifi"
  | "meeting"
  | "laundry"
  | "housekeeping"
  | "desk"
  | "building"
  | "parking"
  | "transfer"
  | "default";

function amenityKind(label: string): IconKind {
  const key = label.toLowerCase();
  if (key.includes("breakfast") || key.includes("dining")) return "breakfast";
  if (key.includes("kitchen")) return "kitchen";
  if (key.includes("wi-fi") || key.includes("wifi")) return "wifi";
  if (key.includes("meeting")) return "meeting";
  if (key.includes("laundry") || key.includes("washer")) return "laundry";
  if (key.includes("housekeeping")) return "housekeeping";
  if (key.includes("front desk") || key.includes("reception")) return "desk";
  if (key.includes("lift") || key.includes("power")) return "building";
  if (key.includes("parking") || key.includes("valet")) return "parking";
  if (key.includes("airport") || key.includes("transfer")) return "transfer";
  return "default";
}

/** Thin line-art icons in sand/bronze — Elysium amenity marks. */
function AmenityIcon({ kind, className }: { kind: IconKind; className?: string }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.35,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn("h-full w-full", className)}>
      {/* Outer frame */}
      <rect x="6" y="6" width="52" height="52" {...stroke} />

      {kind === "breakfast" && (
        <>
          <ellipse cx="32" cy="38" rx="14" ry="5" {...stroke} />
          <path d="M22 38 V28 C22 22 42 22 42 28 V38" {...stroke} />
          <path d="M26 24 C28 18 36 18 38 24" {...stroke} />
          <circle cx="32" cy="30" r="2" className="fill-current" />
        </>
      )}

      {kind === "kitchen" && (
        <>
          <rect x="16" y="22" width="32" height="22" {...stroke} />
          <path d="M16 34 H48" {...stroke} />
          <circle cx="24" cy="28" r="2.5" {...stroke} />
          <circle cx="34" cy="28" r="2.5" {...stroke} />
          <rect x="40" y="40" width="6" height="4" {...stroke} />
        </>
      )}

      {kind === "wifi" && (
        <>
          <path d="M18 34 C24 26 40 26 46 34" {...stroke} />
          <path d="M23 39 C27 34 37 34 41 39" {...stroke} />
          <path d="M28 44 C30 41 34 41 36 44" {...stroke} />
          <circle cx="32" cy="48" r="1.8" className="fill-current" />
        </>
      )}

      {kind === "meeting" && (
        <>
          <rect x="14" y="28" width="36" height="16" {...stroke} />
          <path d="M20 28 V24 H44 V28" {...stroke} />
          <path d="M22 44 V48 M42 44 V48" {...stroke} />
          <path d="M18 34 H46" {...stroke} />
        </>
      )}

      {kind === "laundry" && (
        <>
          <rect x="20" y="16" width="24" height="32" rx="2" {...stroke} />
          <circle cx="32" cy="36" r="8" {...stroke} />
          <circle cx="32" cy="36" r="3.5" {...stroke} />
          <path d="M26 22 H38" {...stroke} />
        </>
      )}

      {kind === "housekeeping" && (
        <>
          <path d="M16 42 H48 V46 H16 Z" {...stroke} />
          <path d="M20 42 V28 C20 22 44 22 44 28 V42" {...stroke} />
          <path d="M28 28 V42 M36 28 V42" {...stroke} />
          <path
            d="M32 14 L33 17.5 L36.5 17.5 L33.7 19.7 L34.7 23.2 L32 21 L29.3 23.2 L30.3 19.7 L27.5 17.5 L31 17.5 Z"
            {...stroke}
          />
        </>
      )}

      {kind === "desk" && (
        <>
          <path d="M14 40 H50" {...stroke} />
          <path d="M18 40 V48 M46 40 V48" {...stroke} />
          <rect x="22" y="24" width="20" height="16" {...stroke} />
          <path d="M28 24 V20 H36 V24" {...stroke} />
        </>
      )}

      {kind === "building" && (
        <>
          <path d="M20 48 V18 H32 V48" {...stroke} />
          <path d="M32 28 H44 V48" {...stroke} />
          <path d="M24 24 H28 M24 30 H28 M24 36 H28 M36 34 H40 M36 40 H40" {...stroke} />
          <path d="M26 48 V40 H30 V48" {...stroke} />
        </>
      )}

      {kind === "parking" && (
        <>
          <path d="M14 42 H50" {...stroke} />
          <path d="M18 42 L22 30 H42 L46 42" {...stroke} />
          <circle cx="24" cy="42" r="3.5" {...stroke} />
          <circle cx="40" cy="42" r="3.5" {...stroke} />
          <path d="M26 34 H38" {...stroke} />
        </>
      )}

      {kind === "transfer" && (
        <>
          <path d="M12 40 H52" {...stroke} />
          <path d="M16 40 L20 28 H36 L44 34 H48 V40" {...stroke} />
          <circle cx="24" cy="40" r="3.5" {...stroke} />
          <circle cx="42" cy="40" r="3.5" {...stroke} />
          <path d="M22 28 V24 H34 V30" {...stroke} />
        </>
      )}

      {kind === "default" && (
        <>
          <path
            d="M32 18 L34.5 27.5 L44 28 L36.5 34 L39 44 L32 38.5 L25 44 L27.5 34 L20 28 L29.5 27.5 Z"
            {...stroke}
          />
        </>
      )}
    </svg>
  );
}

export function AmenitiesGrid({
  hotel,
  className,
}: {
  hotel: Hotel;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8",
        className,
      )}
    >
      {hotel.amenities.map((a, i) => (
        <Reveal key={`${hotel.id}-${a.label}`} delay={i * 0.04}>
          <li className="flex flex-col items-center text-center">
            <div className="h-14 w-14 text-forest sm:h-16 sm:w-16">
              <AmenityIcon kind={amenityKind(a.label)} />
            </div>
            <h3 className="mt-3 font-display text-[0.95rem] leading-snug tracking-[0.04em] text-forest uppercase sm:mt-3.5 sm:text-base">
              {a.label}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-foreground/55 sm:text-base">{a.note}</p>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

/** Homepage / shared amenities — line icons in logo forest. */
export function Amenities() {
  const { hotel } = useHotel();

  return (
    <section id="amenities" className="relative overflow-hidden bg-background section-pad">
      <div className="page-wrap relative">
        <Reveal>
          <h2 className="display-nav text-[clamp(2rem,4vw,3rem)] text-forest">
            Amenities
          </h2>
          <p className="mt-2 text-sm text-foreground/65">Both houses. Same standard.</p>
        </Reveal>
        <div className="mt-8 sm:mt-10">
          <AmenitiesGrid hotel={hotel} />
        </div>
      </div>
    </section>
  );
}
