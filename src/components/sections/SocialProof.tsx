import { Trophy } from "lucide-react";
import { socialProofTiles, type SocialProofTile } from "@/data/social-proof";
import { BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

function Tile({ tile }: { tile: SocialProofTile }) {
  const base =
    "relative h-full overflow-hidden rounded-2xl transition-transform duration-700 ease-luxe hover:scale-[1.015]";

  if (tile.kind === "image") {
    return (
      <figure className={cn(base, "min-h-[9rem] sm:min-h-[11rem]")}>
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
          "flex min-h-[14rem] flex-col justify-between bg-accent p-5 text-accent-foreground sm:p-6 lg:min-h-0",
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
          "flex min-h-[7rem] flex-col justify-center bg-forest px-5 py-4 text-ivory sm:px-6",
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
      className={cn(
        base,
        "flex min-h-[10rem] flex-col justify-between p-5 sm:min-h-[11rem] sm:p-6",
        toneClass,
      )}
    >
      <BrandStar
        className={cn(
          "h-3 w-3 shrink-0",
          tile.tone === "forest" ? "text-accent" : "text-accent",
        )}
        aria-hidden="true"
      />
      <p className="mt-4 font-display text-lg leading-snug sm:text-xl">&ldquo;{tile.quote}&rdquo;</p>
      <footer className="eyebrow mt-5 text-xs opacity-75">{tile.source}</footer>
    </blockquote>
  );
}

export function SocialProof() {
  return (
    <section className="relative overflow-hidden bg-secondary py-10 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-10">
        <Reveal className="max-w-xl">
          <p className="eyebrow text-muted-foreground">Trusted by guests</p>
          <h2 className="display-title mt-2 sm:mt-5">Awards, reviews & moments</h2>
        </Reveal>

        <div className="mt-8 grid auto-rows-[minmax(7rem,auto)] grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[minmax(120px,1fr)]">
          {socialProofTiles.map((tile, i) => (
            <Reveal key={`${tile.kind}-${i}`} delay={i * 0.04} className={cn("h-full", tile.layout)}>
              <Tile tile={tile} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
