import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { Reveal } from "@/components/Reveal";

/** Bloom “Blooming across…” property grid — Elysium houses. */
export function HotelSelector() {
  const { hotels, selectHotel } = useHotel();

  return (
    <section id="properties" className="relative overflow-hidden bg-background section-pad">
      <div className="page-wrap relative">
        <Reveal>
          <h2 className="display-nav text-[clamp(2.25rem,5vw,3.75rem)] text-forest">
            Living across Hyderabad
          </h2>
          <p className="mt-3 prose-quiet sm:text-base">
            Madhapur &amp; Hitec City.
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

        <div className="mt-7 grid gap-7 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {hotels.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.08}>
              <article id={`hotel-${h.id}`} className="group scroll-mt-24">
                <Link
                  to="/hotels/$slug"
                  params={{ slug: h.slug }}
                  onClick={() => selectHotel(h.id)}
                  className="block overflow-hidden rounded-[10px]"
                >
                  <div className="aspect-[16/11] overflow-hidden rounded-[10px] bg-secondary">
                    <picture>
                      <source srcSet={h.hero.replace(/\.(png|jpe?g)$/i, ".webp")} type="image/webp" />
                      <img
                        src={h.hero}
                        alt={`${h.name}, ${h.region}`}
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={825}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </picture>
                  </div>
                </Link>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
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
                    to="/book"
                    search={{ hotel: h.slug }}
                    onClick={() => selectHotel(h.id)}
                    className="btn-primary w-full shrink-0 px-4 py-2.5 text-[13px] sm:w-auto"
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
