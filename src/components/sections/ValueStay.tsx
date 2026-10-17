import { Link } from "@tanstack/react-router";

/** Bloom loyalty band — headline, one line, membership card. */
export function ValueStay() {
  return (
    <section id="value" className="bg-[#f4f4f2]">
      <div className="home-frame grid items-center gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-10 lg:py-20">
        <div className="view-rise max-w-[34rem]">
          <h2 className="font-nav text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-bronze">
            Week two should
            <br />
            cost less.
          </h2>
          <p className="mt-5 flex items-center gap-2 text-[16px] font-bold text-forest">
            <span aria-hidden="true">⚡</span>
            It does, from the seventh night.
          </p>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-neutral-500">
            Weekly and monthly rates are written once. Breakfast, Wi-Fi, and taxes do not show up
            on a second bill.
          </p>
        </div>

        <div className="view-rise" style={{ animationRange: "entry 8% entry 36%" }}>
        <Link
          to="/book"
          className="lift block overflow-hidden rounded-[12px] bg-white shadow-[0_8px_30px_-18px_rgba(6,51,44,0.35)]"
        >
          <div className="flex h-[148px] items-end justify-between px-6 pt-5 pb-4 text-forest/70">
            <p className="font-nav text-[18px] font-extrabold tracking-[-0.03em] text-forest">Elysium</p>
            <svg viewBox="0 0 180 72" className="h-16 w-40" aria-hidden="true">
              <path
                d="M8 58 V34 H28 V58 M22 58 V22 H48 V58 M42 58 V14 H78 V58 M70 58 V28 H104 V58 M98 58 V18 H132 V58 M126 58 V36 H160 V58"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <circle cx="154" cy="16" r="6" className="fill-bronze stroke-none" />
            </svg>
          </div>
          <div className="flex items-center justify-between bg-forest px-6 py-4 text-ivory">
            <span className="font-nav text-[16px] font-extrabold">See long-stay rates</span>
            <span aria-hidden="true">›</span>
          </div>
        </Link>
        </div>
      </div>
    </section>
  );
}
