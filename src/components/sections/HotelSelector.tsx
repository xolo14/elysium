import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import type { Hotel } from "@/data/hotels";
import { cn } from "@/lib/utils";

function HotelCard({ hotel, large, onSelect }: { hotel: Hotel; large: boolean; onSelect: () => void }) {
  return (
    <Link
      to="/hotels/$slug"
      params={{ slug: hotel.slug }}
      onClick={onSelect}
      className="group view-rise block overflow-hidden rounded-[16px] bg-white ring-1 ring-neutral-100"
    >
      <span className="still block">
        <img
          src={hotel.hero}
          alt={`${hotel.name}, ${hotel.region}`}
          width={large ? 800 : 480}
          height={large ? 560 : 300}
          className={cn("w-full object-cover", large ? "aspect-[16/10] sm:aspect-[4/3]" : "aspect-[4/3]")}
        />
      </span>
      <div className={cn(large ? "px-6 py-5" : "px-4 py-3")}>
        <h3
          className={cn(
            "font-nav font-bold tracking-[-0.02em] text-forest",
            large ? "text-[22px] leading-tight sm:text-[26px]" : "truncate text-[16px]",
          )}
        >
          {hotel.name}
        </h3>
        <p className={cn("text-neutral-400", large ? "mt-1 text-[15px]" : "mt-0.5 text-[13px]")}>
          {hotel.place}
        </p>
        {large ? (
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-500">{hotel.summary}</p>
        ) : null}
        <p className={cn("font-semibold text-forest", large ? "mt-4 text-[16px]" : "mt-2 text-[13px]")}>
          From {hotel.fromRate}
        </p>
      </div>
    </Link>
  );
}

/** Two suites fill the band. A third or more switches this to a grid. */
export function HotelSelector() {
  const { hotels, selectHotel } = useHotel();
  const large = hotels.length <= 2;

  return (
    <section id="properties" className="bg-white pt-6 pb-2">
      <div className="home-frame view-rise">
        <h2 className="font-nav text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-bronze sm:text-[36px] sm:leading-[42px]">
          Where the work actually is.
        </h2>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-neutral-400 sm:text-[18px]">
          Studio Suites, ten minutes from Hitec City. Premier Suites, beside it. Breakfast included
          either way.
        </p>
      </div>

      <div
        className={cn(
          "stagger home-frame mt-8 grid gap-6",
          large ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            large={large}
            onSelect={() => selectHotel(hotel.id)}
          />
        ))}
      </div>
    </section>
  );
}
