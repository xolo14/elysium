import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { BrandLineCorner, BrandLineStar, BrandStar } from "@/lib/brand";
import { MaskImage, Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";


export function Experiences() {
  const { hotel } = useHotel();

  return (
    <section
      id="experiences"
      className="relative overflow-hidden bg-forest py-16 text-ivory lg:py-20"
    >
      <BrandLineCorner className="pointer-events-none absolute right-8 bottom-12 h-36 w-20 rotate-180 text-ivory/25 lg:right-16" />
      <BrandLineStar className="pointer-events-none absolute -left-[7%] top-[8%] h-[60svh] w-auto text-ivory/[0.08]" />
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            
            <h2 className="display-title mt-6 max-w-2xl">
              Curated hours, not activities
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 space-y-16 lg:space-y-20">
          {hotel.experiences.map((exp, i) => (
            <div
              key={`${hotel.id}-${exp.title}`}
              className={cn(
                "grid items-center gap-10 lg:grid-cols-12 lg:gap-16",
                i % 2 === 1 && "lg:[direction:rtl]",
              )}
            >
              <div className="lg:col-span-7 lg:[direction:ltr]">
                <MaskImage
                  src={exp.image}
                  alt={exp.title}
                  ratio="4 / 3"
                  className="w-full"
                  imgClassName="brightness-[0.95]"
                />
              </div>
              <div className="lg:col-span-5 lg:[direction:ltr]">
                <Reveal>
                  <p className="eyebrow flex items-center gap-3 text-ivory/60">
                    <BrandStar className="h-2 w-2 text-accent" />
                    {exp.kicker}
                  </p>
                  <h3 className="mt-6 font-display text-3xl sm:text-4xl lg:text-6xl">{exp.title}</h3>
                  <p className="mt-6 max-w-md text-sm leading-relaxed text-ivory/70">{exp.copy}</p>
                  <Link to="/book" className="link-luxe eyebrow mt-8 inline-block">
                    Arrange this
                  </Link>
                </Reveal>
              </div>
            </div>
          ))}
        </div>

        <Reveal className="mt-24 grid gap-6 border-t border-ivory/20 pt-10 sm:grid-cols-2">
          {[
            {
              t: "Family Stay",
              c: "Adjoining suites, a private chef for small appetites, and a nanny on call.",
            },
            {
              t: "Romantic Escape",
              c: "A turned-down suite, floating candles, and no schedule at all.",
            },
          ].map((x) => (
            <div key={x.t} className="border-l border-ivory/20 pl-6">
              <h4 className="font-display text-3xl">{x.t}</h4>
              <p className="mt-3 max-w-sm text-sm text-ivory/65">{x.c}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
