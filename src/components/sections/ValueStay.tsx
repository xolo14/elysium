import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";
import { BrandStar } from "@/lib/brand";

/** Bloom membership / value band — Elysium long-stay offer. */
export function ValueStay() {
  return (
    <section id="value" className="relative overflow-hidden bg-secondary py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 sm:px-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,3.85rem)] leading-[0.95] tracking-[-0.02em] text-forest">
            The more you stay,
            <br />
            the less you pay.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/75">
            Weekly and monthly tariffs, kitchenettes, laundry and a front desk that knows your name —
            built for project teams, relocators and anyone making Hyderabad home for a while.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden bg-forest p-8 text-ivory sm:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow text-ivory/55">Elysium Value Stay</p>
                <p className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
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
              className="eyebrow mt-8 inline-flex items-center gap-2 bg-ivory px-5 py-3 text-forest transition-opacity hover:opacity-90"
            >
              Enquire now
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
