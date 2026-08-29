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
        className={cn(base, "justify-between gap-3 bg-forest p-4 text-ivory sm:gap-4 sm:p-5", className)}
      >
        <Trophy className="h-5 w-5 shrink-0 opacity-80 sm:h-6 sm:w-6" strokeWidth={1.5} aria-hidden="true" />
        <div className="min-h-0 flex-1">
          <p className="font-display text-sm leading-snug font-semibold sm:text-lg lg:text-xl">
            {tile.title}
          </p>
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ivory/75 sm:text-base">
            {tile.subtitle}
          </p>
        </div>
        <p className="eyebrow shrink-0 pt-1 text-[0.65rem] text-ivory/55">{tile.source}</p>
      </article>
    );
  }

  if (tile.kind === "stat") {
    return (
      <article
        className={cn(base, "justify-center gap-2 bg-forest px-4 py-4 text-ivory sm:px-5", className)}
      >
        <p className="font-display text-3xl leading-none font-semibold sm:text-4xl">{tile.value}</p>
        <p className="text-sm leading-snug text-ivory/75 sm:text-base">{tile.label}</p>
      </article>
    );
  }

  const toneClass =
    tile.tone === "accent" || tile.tone === "forest"
      ? "bg-forest text-ivory"
      : "bg-background text-foreground ring-1 ring-border";

  return (
    <blockquote className={cn(base, "justify-between gap-3 p-4 sm:p-5", toneClass, className)}>
      <BrandStar
        className={cn("h-3 w-3 shrink-0", tile.tone === "light" ? "text-forest/40" : "text-ivory/50")}
        aria-hidden="true"
      />
      <p className="min-h-0 flex-1 font-display text-sm leading-snug font-semibold sm:text-base lg:text-lg">
        &ldquo;{tile.quote}&rdquo;
      </p>
      <footer className="eyebrow shrink-0 text-[0.65rem] opacity-70">{tile.source}</footer>
    </blockquote>
  );
}

type MasonryColumn =
  | { type: "tall"; tile: SocialProofTile; width: string }
  | { type: "stack"; top: SocialProofTile; bottom: SocialProofTile; width: string };

function isHeavy(tile: SocialProofTile) {
  return tile.kind === "award" || (tile.kind === "quote" && tile.quote.length > 70);
}

/**
 * Bloom-style columns: heavy text cards stay tall so copy isn’t clipped;
 * images/stats can stack.
 */
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
            ? "w-[15rem] sm:w-[17rem]"
            : a.kind === "image"
              ? "w-[12rem] sm:w-[15rem]"
              : "w-[13rem] sm:w-[16rem]",
      });
      continue;
    }

    const b = queue[0]!;
    // Stack only when both fit a half-height slot (image/stat/short quote)
    if (!isHeavy(b) && (a.kind === "image" || a.kind === "stat" || b.kind === "image" || b.kind === "stat")) {
      queue.shift();
      cols.push({
        type: "stack",
        top: a,
        bottom: b,
        width: "w-[12rem] sm:w-[14rem]",
      });
    } else {
      cols.push({
        type: "tall",
        tile: a,
        width: a.kind === "award" ? "w-[15rem] sm:w-[17rem]" : "w-[13rem] sm:w-[16rem]",
      });
    }
  }

  return cols;
}

function MasonryMarquee({ tiles }: { tiles: SocialProofTile[] }) {
  const columns = buildMasonryColumns(tiles);
  const loop = [...columns, ...columns];

  return (
    <div
      className="mt-6 overflow-hidden sm:mt-8"
      aria-label="Awards, reviews and moments, scrolling right to left"
    >
      <div className="marquee-track marquee-rtl flex w-max items-stretch gap-3 pr-3 sm:gap-4 sm:pr-4">
        {loop.map((col, i) => (
          <div
            key={`col-${i}`}
            className={cn(
              "flex h-[24rem] shrink-0 flex-col gap-3 sm:h-[28rem] sm:gap-3.5 lg:h-[30rem]",
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

  const subtitle = hotel
    ? `${hotel.name}, ${hotel.place}.`
    : "From both houses in Hyderabad.";

  return (
    <section id="trusted" className="relative overflow-hidden bg-secondary py-10 sm:py-12 lg:py-14">
      <div className="page-wrap relative">
        <Reveal className="max-w-2xl">
          <p className="eyebrow text-muted-foreground">Trusted by guests</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:mt-3 sm:text-4xl">
            Awards, reviews & moments
          </h2>
          <p className="mt-3 max-w-xl text-sm text-foreground/70">{subtitle}</p>
        </Reveal>

        <Reveal delay={0.05}>
          <ul className="mt-6 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] sm:mt-8 [&::-webkit-scrollbar]:hidden">
            {features.map((feature) => {
              const body = (
                <>
                  <p className="text-[0.7rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                    {feature.label}
                  </p>
                  <p className="mt-1.5 text-sm leading-snug text-foreground/80">{feature.note}</p>
                </>
              );
              return (
                <li
                  key={`${feature.label}-${feature.note}`}
                  className="min-w-[10.5rem] shrink-0 overflow-hidden rounded-[10px] border border-border bg-background"
                >
                  {"href" in feature && feature.href ? (
                    <a
                      href={feature.href}
                      className="block px-4 py-3 transition-colors hover:bg-ivory"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="px-4 py-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      <MasonryMarquee tiles={socialProofTiles} />
    </section>
  );
}
