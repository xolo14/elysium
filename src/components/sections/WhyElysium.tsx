import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useHotel } from "@/context/hotel";
import { BrandLineCorner } from "@/lib/brand";

const fourBs = [
  {
    title: "Bed",
    label: "Rest, properly",
    copy: "A quiet room, a considered bed, fresh linen.",
    detail: "Daily housekeeping · Fresh linen · Quiet floors",
  },
  {
    title: "Breakfast",
    label: "Start with something real",
    copy: "A real breakfast at O Sorriso — or at your own pace.",
    detail: "Complimentary buffet · 7–10:30 am · In-room service",
  },
  {
    title: "Bathroom",
    label: "The private reset",
    copy: "Hot water, fresh towels, ready after travel.",
    detail: "Hot water · Fresh towels · Daily service",
  },
  {
    title: "Balcony",
    label: "Your own open air",
    copy: "Selected suites open to private air and city views.",
    detail: "Selected suites · City views · Private outdoor space",
  },
];

function StackCard({
  item,
  index,
  image,
  hotelName,
  isLast,
}: {
  item: (typeof fourBs)[number];
  index: number;
  image?: string;
  hotelName: string;
  isLast: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.15"],
  });

  // Card underneath shrinks as the next one covers it
  const scale = useTransform(scrollYProgress, [0.45, 1], [1, isLast ? 1 : 0.92]);
  const opacity = useTransform(scrollYProgress, [0.45, 1], [1, isLast ? 1 : 0.8]);

  return (
    <article
      ref={ref}
      // Last card is relative so it scrolls away — no empty green void after Balcony
      className={
        isLast
          ? "relative min-w-0 border-t border-ivory/25 bg-forest px-1 py-6 sm:py-7"
          : "sticky min-w-0 border-t border-ivory/25 bg-forest px-1 py-6 sm:py-7"
      }
      style={{
        top: isLast ? undefined : `calc(4.75rem + ${index * 0.7}rem)`,
        zIndex: index + 1,
      }}
    >
      {/* Never put transform on the sticky node itself */}
      <motion.div style={{ scale, opacity }} className="origin-top will-change-transform">
        <div className="grid min-w-0 items-stretch gap-5 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] sm:gap-8">
          <div className="relative aspect-[16/11] min-w-0 overflow-hidden rounded-[10px] bg-forest-deep sm:aspect-[4/5]">
            {image ? (
              <img
                src={image}
                alt={`${item.title} at ${hotelName}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : null}
            <span className="absolute top-4 left-4 rounded-[8px] bg-forest px-3 py-1.5 text-xs font-semibold tracking-wide text-ivory">
              0{index + 1}
            </span>
          </div>

          <div className="flex min-w-0 flex-col justify-between rounded-sm bg-forest py-1">
            <div className="min-w-0">
              <p className="eyebrow text-accent">{item.label}</p>
              <h3 className="mt-3 break-words font-display text-[clamp(1.85rem,6vw,2.9rem)] leading-[0.95] text-ivory">
                {item.title}
              </h3>
              <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-ivory/75 sm:mt-5 sm:text-base">
                {item.copy}
              </p>
            </div>
            <div className="mt-5 border-t border-ivory/20 pt-4">
              <p className="text-sm leading-relaxed text-ivory/55">{item.detail}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </article>
  );
}

export function WhyElysium({ embedded = false }: { embedded?: boolean }) {
  const { hotel } = useHotel();

  return (
    <section
      {...(embedded ? {} : { id: "why" })}
      className={
        embedded
          ? "relative bg-forest pt-8 pb-6 text-ivory sm:pt-10 lg:pt-12 lg:pb-8"
          : "relative bg-forest pt-12 pb-6 text-ivory sm:pt-14 lg:pt-16 lg:pb-8"
      }
    >
      <BrandLineCorner className="pointer-events-none absolute top-12 right-8 hidden h-32 w-16 rotate-180 text-ivory/25 lg:right-16 lg:block" />
      <div className="page-wrap">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="min-w-0">
            <div className="lg:sticky lg:top-24 lg:pb-8">
              <p className="max-w-sm text-sm leading-relaxed text-ivory/70">
                The details that make a stay feel complete.
              </p>
              <div aria-label="Four reasons to choose Elysium" className="mt-6 select-none lg:mt-10">
                <p className="font-display text-[clamp(4.25rem,20vw,20rem)] font-bold leading-[0.72] tracking-[-0.06em] text-ivory lg:text-[clamp(8rem,16vw,20rem)]">
                  4B
                </p>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/55">
                  Bed. Breakfast. Bathroom. Balcony.
                  <br />
                  Four simple reasons the stay feels complete.
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="mb-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-ivory/20 pb-4">
              <p className="eyebrow min-w-0 text-ivory/60">The Elysium standard</p>
              <p className="eyebrow shrink-0 text-ivory/40">{hotel.region}</p>
            </div>

            {/* Sticky stack — no overflow / no extra vh padding (that caused the Balcony gap) */}
            <div className="relative min-w-0">
              {fourBs.map((item, index) => {
                const image = hotel.gallery[index]?.image;
                return (
                  <StackCard
                    key={item.title}
                    item={item}
                    index={index}
                    isLast={index === fourBs.length - 1}
                    {...(image ? { image } : {})}
                    hotelName={hotel.name}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
