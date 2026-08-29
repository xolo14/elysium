import { Trophy } from "lucide-react";
import type { Hotel } from "@/data/hotels";
import {
  socialProofFeatures,
  socialProofTiles,
  type SocialProofFeature,
  type SocialProofTile,
} from "@/data/social-proof";
import { BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

function Tile({ tile, className }: { tile: SocialProofTile; className?: string }) {
  const base = "relative flex h-full min-h-0 flex-col overflow-hidden rounded-[10px]";

  if (tile.kind === "image") {
    return (
      <figure className={cn(base, className)}>
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
        className={cn(base, "justify-between gap-4 bg-forest p-5 text-ivory sm:p-6 lg:p-7", className)}
      >
        <Trophy className="h-7 w-7 shrink-0 opacity-85 sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden="true" />
        <div className="min-h-0 flex-1">
          <p className="font-display text-lg leading-snug font-semibold sm:text-xl lg:text-2xl">
            {tile.title}
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ivory/75 sm:text-base">
            {tile.subtitle}
          </p>
        </div>
        <p className="eyebrow shrink-0 pt-1 text-ivory/50">{tile.source}</p>
      </article>
    );
  }

  if (tile.kind === "stat") {
    return (
      <article
        className={cn(base, "justify-center gap-3 bg-forest px-5 py-6 text-ivory sm:px-6", className)}
      >
        <p className="font-display text-4xl leading-none font-semibold sm:text-5xl">{tile.value}</p>
        <p className="text-sm leading-snug text-ivory/75 sm:text-base">{tile.label}</p>
      </article>
    );
  }

  const toneClass =
    tile.tone === "accent" || tile.tone === "forest"
      ? "bg-forest text-ivory"
      : "bg-background text-foreground ring-1 ring-border";

  return (
    <blockquote className={cn(base, "justify-between gap-4 p-5 sm:p-6", toneClass, className)}>
      <BrandStar
        className={cn("h-3.5 w-3.5 shrink-0", tile.tone === "light" ? "text-forest/40" : "text-ivory/50")}
        aria-hidden="true"
      />
      <p className="min-h-0 flex-1 font-display text-base leading-snug font-semibold sm:text-lg lg:text-xl">
        &ldquo;{tile.quote}&rdquo;
      </p>
      <footer className="eyebrow shrink-0 opacity-70">{tile.source}</footer>
    </blockquote>
  );
}

type MasonryColumn =
  | { type: "tall"; tile: SocialProofTile; width: string }
  | { type: "stack"; top: SocialProofTile; bottom: SocialProofTile; width: string };

function isHeavy(tile: SocialProofTile) {
  return tile.kind === "award" || (tile.kind === "quote" && tile.quote.length > 70);
}

function buildMasonryColumns(tiles: SocialProofTile[]): MasonryColumn[] {
  const cols: MasonryColumn[] = [];
  const queue = [...tiles];

  while (queue.length > 0) {
    const a = queue.shift()!;

    if (isHeavy(a) || queue.length === 0) {
      cols.push({
        type: "tall",
        tile: a,
        width:
          a.kind === "award"
            ? "w-[17rem] sm:w-[20rem] lg:w-[22rem]"
            : a.kind === "image"
              ? "w-[15rem] sm:w-[18rem] lg:w-[20rem]"
              : "w-[16rem] sm:w-[19rem] lg:w-[21rem]",
      });
      continue;
    }

    const b = queue[0]!;
    if (!isHeavy(b) && (a.kind === "image" || a.kind === "stat" || b.kind === "image" || b.kind === "stat")) {
      queue.shift();
      cols.push({
        type: "stack",
        top: a,
        bottom: b,
        width: "w-[15rem] sm:w-[17rem] lg:w-[19rem]",
      });
    } else {
      cols.push({
        type: "tall",
        tile: a,
        width: a.kind === "award" ? "w-[17rem] sm:w-[20rem] lg:w-[22rem]" : "w-[16rem] sm:w-[19rem] lg:w-[21rem]",
      });
    }
  }

  return cols;
}

function FeatureMarquee({ features }: { features: SocialProofFeature[] }) {
  const loop = [...features, ...features];

  return (
    <div className="overflow-hidden" aria-label="Stay highlights, scrolling">
      <ul className="marquee-track marquee-chips flex w-max items-stretch gap-3 pr-3 sm:gap-4 sm:pr-4">
        {loop.map((feature, i) => {
          const body = (
            <>
              <p className="text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                {feature.label}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-foreground/80">{feature.note}</p>
            </>
          );
          return (
            <li
              key={`${feature.label}-${feature.note}-${i}`}
              className="min-w-[12.5rem] shrink-0 overflow-hidden rounded-[10px] border border-border bg-background sm:min-w-[14rem]"
            >
              {"href" in feature && feature.href ? (
                <a href={feature.href} className="block px-5 py-3.5 transition-colors hover:bg-ivory">
                  {body}
                </a>
              ) : (
                <div className="px-5 py-3.5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MasonryMarquee({ tiles }: { tiles: SocialProofTile[] }) {
  const columns = buildMasonryColumns(tiles);
  const loop = [...columns, ...columns];

  return (
    <div className="overflow-hidden" aria-label="Awards, reviews and moments, scrolling">
      <div className="marquee-track marquee-rtl flex w-max items-stretch gap-3.5 pr-3.5 sm:gap-4 sm:pr-4 lg:gap-5 lg:pr-5">
        {loop.map((col, i) => (
          <div
            key={`col-${i}`}
            className={cn(
              "flex h-[32rem] shrink-0 flex-col gap-3.5 sm:h-[38rem] sm:gap-4 lg:h-[44rem] lg:gap-5",
              col.width,
            )}
          >
            {col.type === "tall" ? (
              <Tile tile={col.tile} className="min-h-0 flex-1" />
            ) : (
              <>
                <Tile tile={col.top} className="min-h-0 flex-1" />
                <Tile tile={col.bottom} className="min-h-0 flex-1" />
              </>
            )}
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
        { label: "24h desk", note: "Always staffed" },
        { label: "GST ready", note: "Invoices at checkout" },
        { label: "The 4B’s", note: "Bed · Breakfast · Bathroom · Balcony", href: "#why" },
      ]
    : socialProofFeatures;

  const subtitle = hotel ? `${hotel.name}, ${hotel.place}.` : "From both houses in Hyderabad.";

  return (
    <section id="trusted" className="relative overflow-hidden bg-secondary section-pad">
      <div className="page-wrap">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-muted-foreground">Trusted by guests</p>
          <h2 className="mt-2 display-nav text-3xl text-forest sm:mt-3 sm:text-4xl lg:text-5xl">
            Awards, reviews & moments
          </h2>
          <p className="mt-3 text-sm text-foreground/70">{subtitle}</p>
        </Reveal>
      </div>

      <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
        <FeatureMarquee features={features} />
        <MasonryMarquee tiles={socialProofTiles} />
      </div>
    </section>
  );
}
