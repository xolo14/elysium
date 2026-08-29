import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";

const promises = [
  "Direct rates",
  "Breakfast included",
  "GST invoices",
  "Long-stay ready",
  "24-hour front desk",
  "Two Hyderabad houses",
];

/** Honest trust strip — no fake press brands. */
export function MediaLogos() {
  return (
    <section aria-label="Why book direct" className="border-y border-border bg-background py-5 sm:py-6">
      <div className="page-wrap">
        <Reveal>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-10">
            {promises.map((name) => (
              <li
                key={name}
                className="flex items-center gap-2 font-display text-base tracking-wide text-foreground/40 sm:text-lg"
              >
                <BrandStar className="h-2.5 w-2.5 text-forest/35" />
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
