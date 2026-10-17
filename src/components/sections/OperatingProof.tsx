import { Reveal } from "@/components/Reveal";

const marks = [
  { value: "4.7★", label: "Average guest rating across Studio & Premier" },
  { value: "2", label: "Studio Suites & Premier Suites" },
  { value: "24/7", label: "Front desk staffed in the building" },
  { value: "0%", label: "Booking fee when you reserve direct" },
];

/** Quiet facts — trust without slogans. */
export function OperatingProof() {
  return (
    <section id="proof" className="relative bg-forest text-ivory">
      <div className="page-wrap grid gap-8 py-10 sm:grid-cols-2 sm:gap-6 sm:py-12 lg:grid-cols-4">
        {marks.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.04}>
            <p className="font-nav text-[2rem] leading-none font-extrabold tracking-[-0.03em] sm:text-[2.25rem]">
              {item.value}
            </p>
            <p className="mt-3 max-w-[14rem] text-sm leading-relaxed text-ivory/70">{item.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
