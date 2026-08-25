import { Trophy } from "lucide-react";
import type { Hotel } from "@/data/hotels";
import {
  socialProofFeatures,
  socialProofTiles,
  type SocialProofTile,
} from "@/data/social-proof";
import { BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

function Tile({ tile, className }: { tile: SocialProofTile; className?: string }) {
  const base =
    "relative h-full overflow-hidden transition-transform duration-700 ease-luxe hover:scale-[1.015]";

  if (tile.kind === "image") {
    return (
      <figure className={cn(base, "min-h-[11rem]", className)}>
        <img
          src={tile.src}
          alt={tile.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </figure>
    );
  }

  if (tile.kind === "award") {
    return (
      <article
        className={cn(
          base,
          "flex flex-col justify-between bg-accent p-5 text-accent-foreground sm:p-6",
          className,
        )}
      >
        <Trophy className="h-7 w-7 shrink-0 opacity-90" strokeWidth={1.5} aria-hidden="true" />
        <div>
          <p className="font-display text-xl leading-snug sm:text-2xl">{tile.title}</p>
          <p className="mt-3 text-sm leading-relaxed opacity-85">{tile.subtitle}</p>
        </div>
        <p className="eyebrow mt-6 text-xs opacity-75">{tile.source}</p>
      </article>
    );
  }

  if (tile.kind === "stat") {
    return (
      <article
        className={cn(
          base,
          "flex flex-col justify-center bg-forest px-5 py-4 text-ivory sm:px-6",
          className,
        )}
      >
        <p className="font-display text-4xl leading-none sm:text-5xl">{tile.value}</p>
        <p className="mt-2 text-sm text-ivory/75">{tile.label}</p>
      </article>
    );
  }

  const toneClass =
    tile.tone === "accent"
      ? "bg-accent text-accent-foreground"
      : tile.tone === "forest"
        ? "bg-forest text-ivory"
        : "bg-background text-foreground ring-1 ring-border";

  return (
    <blockquote
      className={cn(base, "flex flex-col justify-between p-5 sm:p-6", toneClass, className)}
    >
      <BrandStar
        className={cn(
          "h-3 w-3 shrink-0",
          tile.tone === "accent" ? "text-forest" : "text-accent",
        )}
        aria-hidden="true"
      />
      <p className="mt-4 font-display text-lg leading-snug sm:text-xl">&ldquo;{tile.quote}&rdquo;</p>
      <footer className="eyebrow mt-5 text-xs opacity-75">{tile.source}</footer>
    </blockquote>
  );
}

function tileWidth(tile: SocialProofTile) {
  if (tile.kind === "award") return "w-[18rem] sm:w-[22rem]";
  if (tile.kind === "stat") return "w-[12rem] sm:w-[14rem]";
  if (tile.kind === "quote") return "w-[16rem] sm:w-[20rem]";
  return "w-[14rem] sm:w-[18rem]";
}

function AwardsMarquee({ tiles }: { tiles: SocialProofTile[] }) {
  const loop = [...tiles, ...tiles];

  return (
    <div
      className="mt-8 overflow-hidden sm:mt-12"
      aria-label="Awards, reviews and moments, scrolling"
    >
      <div className="marquee-track marquee-rtl flex w-max items-stretch gap-3 pr-3 sm:gap-4 sm:pr-4">
        {loop.map((tile, i) => (
          <div
            key={`${tile.kind}-${i}`}
            className={cn("h-56 shrink-0 sm:h-64 lg:h-72", tileWidth(tile))}
          >
            <Tile tile={tile} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SocialProof({ hotel }: { hotel?: Hotel }) {
  const features = hotel
    ? [
        { label: `${hotel.rating}★`, note: "Guest rating for this house" },
        { label: hotel.fromRate, note: "From / night incl. taxes" },
        ...hotel.offers.slice(0, 2).map((o) => ({ label: "Included", note: o })),
        { label: "Direct book", note: "Reserve this suite on-site" },
        { label: hotel.place, note: hotel.region },
      ]
    : socialProofFeatures;

  const subtitle = hotel
    ? `Moments and guest trust from ${hotel.name}, ${hotel.place}.`
    : "Awards, reviews and house moments from both Elysium properties.";

  return (
    <section id="trusted" className="relative overflow-hidden bg-secondary py-10 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-10">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-muted-foreground">Trusted by guests</p>
          <h2 className="display-title mt-2 sm:mt-5">Awards, reviews & moments</h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
            {subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <ul className="mt-8 flex gap-3 overflow-x-auto pb-1 sm:mt-10 sm:flex-wrap sm:overflow-visible">
            {features.map((feature) => (
              <li
                key={`${feature.label}-${feature.note}`}
                className="min-w-[10.5rem] shrink-0 border border-border bg-background px-4 py-3 sm:min-w-0"
              >
                <p className="eyebrow text-muted-foreground">{feature.label}</p>
                <p className="mt-1.5 text-sm leading-snug text-foreground/80">{feature.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <AwardsMarquee tiles={socialProofTiles} />
    </section>
  );
}
