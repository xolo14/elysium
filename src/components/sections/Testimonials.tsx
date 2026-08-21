import { useHotel } from "@/context/hotel";
import { BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";


export function Testimonials() {
  const { hotel } = useHotel();

  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-20">
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10">
        <Reveal className="max-w-xl">
          
          <h2 className="display-title mt-6">
            Words left behind
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {hotel.testimonials.map((t, i) => (
            <Reveal key={`${hotel.id}-${t.name}`} delay={i * 0.08}>
              <figure
                className="glass relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-8 lg:animate-drift"
                style={{ animationDelay: `${i * 1.2}s` }}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-6xl leading-none text-accent/60 transition-transform duration-1000 ease-luxe group-hover:scale-110"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-4 text-base leading-relaxed text-foreground/75">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-border pt-5">
                  <p className="eyebrow">{t.name}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t.origin} — {t.stay}
                  </p>
                  <div className="mt-4 flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <BrandStar key={s} className="h-2 w-2 text-accent" />
                    ))}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
