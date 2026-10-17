import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/Reveal";

const standard = [
  {
    mark: "01",
    title: "Bed",
    copy: "Quiet floors, considered mattresses, and linen changed on a fixed cycle — not when someone remembers.",
  },
  {
    mark: "02",
    title: "Breakfast",
    copy: "A complimentary buffet at O Sorriso, included in the rate you see. No voucher, no surcharge.",
  },
  {
    mark: "03",
    title: "Bathroom",
    copy: "Hot water, fresh towels, and a room that is reset before the next guest arrives.",
  },
  {
    mark: "04",
    title: "Balcony",
    copy: "Selected suites open to private outdoor air. The rest keep the same interior standard.",
  },
];

/** Elysium’s own operating standard — not a competitor value list. */
export function HouseStandard() {
  return (
    <section id="standard" className="relative overflow-hidden bg-ivory section-pad">
      <div className="page-wrap">
        <Reveal>
          <p className="eyebrow text-bronze">The 4B standard</p>
          <h2 className="mt-3 max-w-2xl font-nav text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.15] font-extrabold tracking-[-0.02em] text-forest">
            What every suite is held to.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/65">
            Studio Suites and Premier Suites, one checklist. Bed, breakfast, bathroom and balcony —
            inspected before handover, and the same on night thirty as night one.
          </p>
        </Reveal>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-[10px] bg-forest/10 sm:grid-cols-2 lg:grid-cols-4">
          {standard.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <li className="flex h-full flex-col bg-white p-6 sm:p-7">
                <p className="font-nav text-xs font-extrabold tracking-[0.16em] text-bronze">{item.mark}</p>
                <h3 className="mt-4 font-nav text-xl font-extrabold text-forest">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">{item.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.12}>
          <Link
            to="/why"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest underline decoration-forest/25 underline-offset-4 hover:decoration-forest"
          >
            Read how the standard is kept
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
