import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";

/** Bloom membership / value band — Elysium long-stay offer. */
export function ValueStay() {
  return (
    <section id="value" className="relative overflow-hidden bg-secondary section-pad">
      <div className="page-wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="display-nav text-[clamp(2.4rem,5.5vw,3.85rem)] text-bronze">
            The more you stay,
            <br />
            the less you pay.
          </h2>
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-forest">
            <BrandStar className="h-2.5 w-2.5" />
            Extra off on weekly &amp; monthly stays.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/75">
            Weekly and monthly rates, kitchenettes, and a desk that knows your name.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[10px] border border-bronze/50 bg-forest p-8 text-ivory sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow text-ivory/55">Elysium Value Stay</p>
                <p className="mt-3 display-nav text-3xl text-ivory sm:text-4xl">
                  Stay longer.
                  <br />
                  Pay less.
                </p>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75">
                  From 7 nights — discounted rates, kitchenettes &amp; GST invoices.
                </p>
              </div>
              <BrandStar className="mt-1 h-10 w-10 shrink-0 text-ivory/25" />
            </div>
            <Link
              to="/book"
              className="eyebrow mt-8 inline-flex items-center gap-2 rounded-[10px] bg-ivory px-5 py-3 text-forest transition-opacity hover:opacity-90"
            >
              Enquire now
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
