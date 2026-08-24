import { BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type PartnerCard = {
  id: string;
  index: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
  illustration: "building" | "desk" | "lounge";
};

const cards: PartnerCard[] = [
  {
    id: "owners",
    index: "01",
    title: "Developers & Owners",
    copy: "We're growing carefully across Hyderabad — don't miss a partnership.",
    cta: "Partner with us",
    href: "mailto:elysium.hyd@gmail.com?subject=Developer%20%26%20Owner%20partnership",
    illustration: "building",
  },
  {
    id: "corporate",
    index: "02",
    title: "Corporate Bookings",
    copy: "With houses in Madhapur and Hitec City, we're built for project stays and relocating teams.",
    cta: "Get in touch",
    href: "mailto:elysium.hyd@gmail.com?subject=Corporate%20bookings",
    illustration: "desk",
  },
  {
    id: "careers",
    index: "03",
    title: "Careers @ Elysium",
    copy: "Work with a team that keeps hospitality personal — two houses, one standard.",
    cta: "Join the house",
    href: "mailto:elysium.hyd@gmail.com?subject=Careers%20at%20Elysium",
    illustration: "lounge",
  },
];

function BuildingArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true" className={className}>
      <path
        d="M28 108 V36 H72 V108 M72 52 H118 V108 M48 108 V78 H58 V108"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M38 48 H48 M38 60 H48 M38 72 H48 M86 64 H104 M86 76 H104 M86 88 H104" stroke="currentColor" strokeWidth="1.5" />
      <rect x="48" y="78" width="10" height="30" className="fill-accent" />
      <circle cx="128" cy="28" r="11" className="fill-accent" />
    </svg>
  );
}

function DeskArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true" className={className}>
      <path
        d="M24 88 H136 M36 88 V108 M124 88 V108 M48 88 V52 H112 V88"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="58" y="40" width="44" height="28" stroke="currentColor" strokeWidth="1.5" />
      <path d="M70 40 V34 H90 V40" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 88 C40 72 56 64 72 72" stroke="currentColor" strokeWidth="1.5" className="stroke-accent" />
      <rect x="108" y="24" width="14" height="10" className="fill-accent" />
      <rect x="126" y="18" width="10" height="10" className="fill-accent/60" />
    </svg>
  );
}

function LoungeArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" aria-hidden="true" className={className}>
      <path
        d="M30 96 H110 C122 96 128 88 128 78 V64 C128 54 120 48 108 48 H70 C58 48 50 56 50 68 V78"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M50 78 H30 V96 M110 96 V108 M40 96 V108" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="58" r="3.5" className="fill-accent" />
      <circle cx="62" cy="58" r="3.5" className="fill-accent" />
      <path d="M132 96 V72 M126 72 H138" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="132" cy="58" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="132" cy="58" r="3" className="fill-accent" />
    </svg>
  );
}

const art = {
  building: BuildingArt,
  desk: DeskArt,
  lounge: LoungeArt,
} as const;

export function Partnerships() {
  return (
    <section id="partners" className="relative overflow-hidden bg-forest py-16 text-ivory sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("/images/footer-lattice.png")`,
          backgroundSize: "720px 340px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-10">
        <Reveal>
          <p className="eyebrow text-ivory/55">Work with Elysium</p>
          <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.05] text-ivory">
            Partners, teams &amp; careers
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/65 sm:text-base">
            Two houses in Hyderabad — open to owners, corporate travel and people who want to build with us.
          </p>
        </Reveal>

        <ul className="mt-12 space-y-4 sm:mt-14 sm:space-y-5">
          {cards.map((card, index) => {
            const Art = art[card.illustration];
            return (
              <li key={card.id}>
                <Reveal delay={0.07 * index}>
                  <a
                    href={card.href}
                    className={cn(
                      "group relative flex flex-col gap-7 overflow-hidden border border-ivory/15 bg-ivory px-6 py-7 text-forest",
                      "transition-[border-color,transform,box-shadow] duration-700 ease-luxe",
                      "hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_24px_60px_rgba(8,20,17,0.28)]",
                      "sm:flex-row sm:items-center sm:justify-between sm:gap-12 sm:px-9 sm:py-9",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-accent transition-transform duration-700 ease-luxe group-hover:scale-y-100"
                    />

                    <div className="min-w-0 flex-1 sm:pl-2">
                      <p className="eyebrow text-forest/45">{card.index}</p>
                      <h3 className="mt-2 font-display text-[1.65rem] leading-tight tracking-[-0.01em] text-forest sm:text-[1.85rem]">
                        {card.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-forest/65 sm:text-[0.95rem]">
                        {card.copy}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2.5">
                        <BrandStar className="h-2.5 w-2.5 text-accent transition-transform duration-700 group-hover:rotate-90" />
                        <span className="eyebrow relative text-forest">
                          {card.cta}
                          <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-forest transition-transform duration-700 ease-luxe group-hover:scale-x-100" />
                        </span>
                      </span>
                    </div>

                    <span className="relative flex h-28 w-full shrink-0 items-center justify-center bg-secondary/80 sm:h-32 sm:w-48">
                      <Art className="h-[4.75rem] w-[7.25rem] text-forest/45 transition-transform duration-1000 ease-luxe group-hover:scale-105 sm:h-24 sm:w-36" />
                    </span>
                  </a>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
