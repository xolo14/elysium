import { BrandBurst, BrandChevron, BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * Signature section marker built only from brand elements:
 * numeral index, burst/star motif, eyebrow label and a hairline that
 * terminates in a chevron. Repeated across every section so the identity
 * reads as deliberately designed rather than generic.
 */
export function SectionMark({
  label,
  index,
  className,
  tone = "dark",
  motif = "burst",
}: {
  label: string;
  index?: string;
  className?: string;
  tone?: "dark" | "light";
  motif?: "burst" | "star";
}) {
  const Motif = motif === "star" ? BrandStar : BrandBurst;
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        tone === "light" ? "text-ivory" : "text-foreground",
        className,
      )}
    >
      <Motif className="h-3 w-3 shrink-0 animate-slow-spin text-accent" />
      {index ? (
        <span className={cn("eyebrow", tone === "light" ? "text-ivory/45" : "text-accent")}>
          {index}
        </span>
      ) : null}
      <p className={cn("eyebrow", tone === "light" ? "text-ivory/60" : "text-muted-foreground")}>
        {label}
      </p>
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-10 shrink-0 sm:w-16",
          tone === "light" ? "bg-ivory/30" : "bg-border",
        )}
      />
      <BrandChevron
        className={cn("h-2.5 w-2.5 shrink-0", tone === "light" ? "text-ivory/50" : "text-accent")}
      />
    </div>
  );
}
