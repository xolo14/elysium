import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { Reveal } from "@/components/Reveal";
import { BrandLineBurst, BrandLineStar } from "@/lib/brand";

export function HotelSelector() {
  const { hotels, selectHotel } = useHotel();

  return (
    <section id="properties" className="relative overflow-hidden bg-background py-10 sm:py-16 lg:py-20">
      <BrandLineStar className="pointer-events-none absolute -right-[8%] top-1/2 hidden h-[70svh] w-auto -translate-y-1/2 text-foreground/[0.07] lg:block" />
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-10">
        <Reveal>
          <h2 className="display-title mt-2 max-w-xl sm:mt-5">Choose where the stay begins</h2>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:mt-14 sm:gap-8 lg:grid-cols-2 lg:gap-10">
          {hotels.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.08}>
              <Link
                to="/hotels/$slug"
                params={{ slug: h.slug }}
                onClick={() => selectHotel(h.id)}
                className="group relative flex h-full flex-col overflow-hidden border border-border transition-colors duration-500 hover:border-foreground/40"
              >
                <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[16/10]">
                  <img
                    src={h.hero}
                    alt={`${h.name}, ${h.region}`}
                    loading="lazy"
                    width={1920}
                    height={1200}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.05]"
                  />
                  <span className="absolute top-3 left-3 bg-forest px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-ivory uppercase sm:top-5 sm:left-5 sm:px-3 sm:py-1.5 sm:text-xs">
                    {h.badge}
                  </span>
                </div>

                <div className="relative flex flex-1 flex-col px-4 py-4 sm:p-8">
                  {i % 2 === 0 ? (
                    <BrandLineStar className="pointer-events-none absolute right-4 bottom-4 hidden h-14 w-14 text-accent/65 transition-transform duration-700 group-hover:rotate-12 sm:block" />
                  ) : (
                    <BrandLineBurst className="pointer-events-none absolute right-4 bottom-4 hidden h-14 w-14 text-accent/65 transition-transform duration-700 group-hover:-rotate-12 sm:block" />
                  )}

                  <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase sm:text-sm sm:tracking-wide">
                    {h.region}
                  </p>
                  <h3 className="mt-1.5 font-display text-[1.35rem] leading-tight sm:mt-3 sm:text-3xl lg:text-4xl">
                    {h.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[0.85rem] leading-snug text-foreground/70 sm:mt-4 sm:line-clamp-none sm:text-base sm:leading-relaxed sm:text-foreground/75">
                    {h.summary}
                  </p>

                  <dl className="mt-3 grid grid-cols-3 gap-1 border-y border-border py-3 sm:mt-6 sm:gap-4 sm:py-5">
                    <div>
                      <dt className="text-[0.6rem] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
                        From
                      </dt>
                      <dd className="mt-1 font-display text-base sm:mt-2 sm:text-xl">{h.fromRate}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.6rem] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
                        Rooms
                      </dt>
                      <dd className="mt-1 font-display text-base sm:mt-2 sm:text-xl">{h.suites.length}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.6rem] font-medium tracking-wide text-muted-foreground uppercase sm:text-xs">
                        Rating
                      </dt>
                      <dd className="mt-1 font-display text-base sm:mt-2 sm:text-xl">{h.rating}</dd>
                    </div>
                  </dl>

                  <ul className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-5 sm:flex-wrap sm:overflow-visible">
                    {h.offers.map((o) => (
                      <li
                        key={o}
                        className="shrink-0 border border-border px-2 py-1 text-[0.65rem] text-foreground/75 sm:px-3 sm:py-1.5 sm:text-xs sm:text-foreground/80"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between gap-3 pt-0 sm:mt-auto sm:flex-row sm:flex-wrap sm:justify-start sm:gap-3 sm:pt-7">
                    <span className="inline-flex min-h-9 items-center justify-center border border-foreground/25 px-3.5 py-2 text-[0.65rem] font-semibold tracking-wide uppercase transition-colors duration-500 group-hover:bg-forest group-hover:text-ivory sm:min-h-11 sm:px-6 sm:py-3 sm:text-xs">
                      View hotel & rooms
                    </span>
                    <span className="text-[0.75rem] text-muted-foreground sm:text-sm">{h.contact.phone}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
