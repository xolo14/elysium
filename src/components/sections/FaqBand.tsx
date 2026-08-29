import { useState } from "react";
import { hotelFaqs } from "@/data/faqs";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** Compact FAQ accordion for the homepage. */
export function FaqBand() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="relative overflow-hidden bg-background section-pad">
      <div className="page-wrap max-w-[800px]">
        <Reveal>
          <p className="eyebrow text-muted-foreground">Before you book</p>
          <h2 className="mt-3 display-nav text-[clamp(2rem,4.5vw,3rem)] text-forest">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-sm text-foreground/65">Madhapur and Hitec City.</p>
        </Reveal>

        <ul className="mt-10 divide-y divide-border border-y border-border">
          {hotelFaqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-base leading-snug text-forest sm:text-lg">
                    {item.q}
                  </span>
                  <BrandStar
                    className={cn(
                      "mt-1.5 h-3 w-3 shrink-0 text-forest/50 transition-transform duration-500",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                {isOpen ? (
                  <p className="pb-5 text-sm leading-relaxed text-foreground/70 sm:text-base">
                    {item.a}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
