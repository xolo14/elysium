import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type PartnerCard = {
  id: string;
  title: string;
  copy: string;
  cta: string;
  href: string;
  illustration: "building" | "desk" | "lounge";
};

const cards: PartnerCard[] = [
  {
    id: "owners",
    title: "Developers & Owners",
    copy: "Growing carefully across Hyderabad.",
    cta: "Partner with us",
    href: "/about",
    illustration: "building",
  },
  {
    id: "corporate",
    title: "Corporate Bookings",
    copy: "Project stays and relocating teams — two houses, one desk.",
    cta: "Get in touch",
    href: "mailto:elysium.hyd@gmail.com?subject=Corporate%20bookings",
    illustration: "desk",
  },
  {
    id: "careers",
    title: "Careers @ Elysium",
    copy: "Hospitality kept personal. Two houses, one standard.",
    cta: "Write to us",
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
      <rect x="48" y="78" width="10" height="30" className="fill-bronze" />
      <circle cx="128" cy="28" r="11" className="fill-bronze" />
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
      <path d="M40 88 C40 72 56 64 72 72" stroke="currentColor" strokeWidth="1.5" className="stroke-bronze" />
      <rect x="108" y="24" width="14" height="10" className="fill-bronze" />
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
      <circle cx="50" cy="58" r="3.5" className="fill-bronze" />
      <circle cx="62" cy="58" r="3.5" className="fill-bronze" />
      <circle cx="132" cy="58" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="132" cy="58" r="3" className="fill-bronze" />
    </svg>
  );
}

const art = {
  building: BuildingArt,
  desk: DeskArt,
  lounge: LoungeArt,
} as const;

/** Partner row — open layout, bronze accents, no dashboard cards. */
export function Partnerships() {
  return (
    <section id="partners" className="relative overflow-hidden bg-secondary section-pad">
      <div className="page-wrap relative">
        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-10">
          {cards.map((card, index) => {
            const Art = art[card.illustration];
            return (
              <li key={card.id}>
                <Reveal delay={0.06 * index}>
                  <a
                    href={card.href}
                    className={cn(
                      "group flex h-full flex-col border-t border-forest/15 pt-6 transition-opacity duration-500",
                      "hover:opacity-90",
                    )}
                  >
                    <h3 className="font-display text-xl leading-tight text-forest sm:text-2xl">{card.title}</h3>
                    <p className="mt-3 flex-1 prose-quiet">{card.copy}</p>
                    <div className="mt-8 flex items-end justify-between gap-4">
                      <span className="text-[14px] font-semibold text-bronze underline decoration-bronze/30 underline-offset-4 transition-colors group-hover:decoration-bronze">
                        {card.cta}
                      </span>
                      <Art className="h-14 w-20 text-foreground/25" />
                    </div>
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
