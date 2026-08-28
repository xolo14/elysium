import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { Reveal } from "@/components/Reveal";

/** Bloom “Blooming across…” property grid — Elysium houses. */
export function HotelSelector() {
  const { hotels, selectHotel } = useHotel();

  return (
    <section id="properties" className="relative overflow-hidden bg-background py-12 sm:py-14 lg:py-16">
      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-10">
        <Reveal>
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.02em] text-forest">
            Living across Hyderabad
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-foreground/65 sm:text-base">
            In top locations including — Madhapur &amp; Hitec City.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {hotels.map((h) => (
              <a
                key={h.id}
                href={`#hotel-${h.id}`}
                className="text-sm font-semibold text-forest underline decoration-forest/20 underline-offset-4 transition-colors hover:decoration-forest"
              >
                {h.place}
              </a>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:gap-10">
          {hotels.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.08}>
              <article id={`hotel-${h.id}`} className="group scroll-mt-28">
                <Link
                  to="/hotels/$slug"
                  params={{ slug: h.slug }}
                  onClick={() => selectHotel(h.id)}
                  className="block overflow-hidden"
                >
                  <div className="aspect-[16/11] overflow-hidden bg-secondary">
                    <img
                      src={h.hero}
                      alt={`${h.name}, ${h.region}`}
                      loading="lazy"
                      width={1920}
                      height={1200}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl leading-snug sm:text-2xl">
                      {h.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{h.place}</p>
                    <p className="mt-2 text-sm font-medium text-forest">
                      From {h.fromRate}
                      <span className="font-normal text-muted-foreground"> / night</span>
                    </p>
                  </div>
                  <Link
                    to="/hotels/$slug"
                    params={{ slug: h.slug }}
                    onClick={() => selectHotel(h.id)}
                    className="eyebrow shrink-0 bg-forest px-4 py-2.5 text-ivory transition-colors hover:bg-forest/90"
                  >
                    Book Now
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
