import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";


export function Instagram() {
  const { hotel } = useHotel();
  const feed = [
    ...hotel.gallery,
    ...hotel.suites.map((s) => ({ image: s.image, caption: s.name })),
  ];

  return (
    <section className="relative overflow-hidden bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            
            <h2 className="mt-5 font-display text-[clamp(1.75rem,8vw,3rem)] break-all sm:break-normal lg:text-5xl">
              @elysiumstudiosuites
            </h2>
          </div>
          <Link to="/book" className="link-luxe eyebrow flex items-center gap-2">
            <BrandStar className="h-2.5 w-2.5 text-accent" /> Follow the houses
          </Link>
        </Reveal>
      </div>

      <div className="mt-14 flex overflow-hidden">
        <div className="marquee-track flex w-max gap-4 pr-4">
          {[...feed, ...feed].map((item, i) => (
            <figure
              key={`${item.caption}-${i}`}
              className="group relative h-44 w-44 shrink-0 overflow-hidden sm:h-56 sm:w-56 lg:h-72 lg:w-72"
            >
              <img
                src={item.image}
                alt={item.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.08]"
              />
              <span className="absolute inset-0 bg-forest/0 transition-colors duration-700 group-hover:bg-forest/40" />
              <figcaption className="eyebrow absolute inset-x-3 bottom-3 text-ivory opacity-100 transition-opacity duration-700 sm:inset-x-4 sm:bottom-4 sm:opacity-0 sm:group-hover:opacity-100">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
