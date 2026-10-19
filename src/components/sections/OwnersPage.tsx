import { useState } from "react";
import { hotels } from "@/data/hotels";
import { Reveal } from "@/components/Reveal";
import { SITE_EMAIL } from "@/lib/site";
import { cn } from "@/lib/utils";

const properties = hotels.map((h) => ({
  name: h.name,
  year: `Opened in ${h.established}`,
  copy: h.story.lines[0] ?? h.summary,
  image: h.hero,
}));

const pipeline = [
  { value: "2", label: "Studio & Premier open", icon: "clip" as const },
  { value: "Selective", label: "More declined than taken", icon: "reject" as const },
  { value: "4.7★", label: "Guest rating, Studio & Premier", icon: "check" as const },
];

const winning = [
  {
    title: "Quality Focus",
    copy: "We take on fewer buildings so the 4B standard holds. The right owner matters more than a longer list.",
  },
  {
    title: "Transparency",
    copy: "Operating terms, guest rates and daily service are written plainly. Owners read the same numbers we do.",
  },
  {
    title: "Rapid Execution",
    copy: "When a building can be held to the standard, we fit suites, breakfast and the desk, then open. Not a two-year flag ceremony.",
  },
  {
    title: "Optimal Expenditure",
    copy: "Capital goes into the guest room, the kitchen and the arrival, not a national brand tax on every key.",
  },
  {
    title: "Best Product",
    copy: "Studio Suites in Madhapur and Premier Suites in Hitec City are the proof. Guests already book them.",
  },
  {
    title: "Top Returns",
    copy: "Direct booking, corporate terms and weekly–monthly stays. Occupancy earned on a clear rate, not on discounting the suites.",
  },
];

const expectYou = [
  {
    title: "Ambition",
    copy: "Owners who want the building run as Studio or Premier suites guests return to, not listed and left.",
    icon: "medal" as const,
  },
  {
    title: "Quality Mindset",
    copy: "The 4B checklist is not optional. Shortcuts in linen, breakfast or handover do not stay hidden.",
    icon: "shield" as const,
  },
  {
    title: "Honesty",
    copy: "Condition, inventory and numbers on the table before work starts. The relationship is built on that.",
    icon: "scales" as const,
  },
  {
    title: "Financial Stability",
    copy: "We put time into every property. Owners need to be prepared for a proper fit-out and a long operating term.",
    icon: "coin" as const,
  },
  {
    title: "Attitude",
    copy: "Markets move. The joint commitment to the standard should not.",
    icon: "case" as const,
  },
  {
    title: "Smart Judgement",
    copy: "We build for the stay that comes back in year two, not a quarter of discounted keys.",
    icon: "stairs" as const,
  },
];

const expectUs = [
  {
    title: "Thorough Review",
    copy: "Location, inventory and whether the building can be run as serviced suites. Each note is read.",
  },
  {
    title: "Fair Selection",
    copy: "Approval is about whether the building can hold the standard, not about filling a pipeline slide.",
  },
  {
    title: "Quick Follow-up",
    copy: "If we proceed, you hear from the same desk guests use. If we decline, you hear that too.",
  },
  {
    title: "Rapid Development",
    copy: "Once terms are signed, suites, breakfast and the front desk are fitted the way Studio and Premier already run.",
  },
];

const notes = hotels.flatMap((h) =>
  h.testimonials.slice(0, 2).map((t) => ({
    quote: t.quote,
    source: `${t.name}, ${t.origin}`,
    house: h.name,
  })),
);

export function OwnersPage() {
  const [property, setProperty] = useState(0);
  const [note, setNote] = useState(0);
  const current = properties[property] ?? properties[0]!;
  const currentNote = notes[note] ?? notes[0]!;

  return (
    <>
      <section className="relative overflow-hidden bg-ivory page-top">
        <div className="page-wrap grid items-center gap-10 pb-12 pt-6 lg:grid-cols-12 lg:pb-14 lg:pt-8">
          <div className="relative z-10 lg:col-span-7">
            <h1 className="display-nav text-[clamp(2.35rem,5.4vw,3.85rem)] text-bronze">
              Be one of a few,
              <br />
              not one of a thousand.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-foreground/65 sm:text-base">
              Work with a Hyderabad operator of serviced suites: Studio Suites
              and Premier Suites already open, and a standard that does not drift.
            </p>
            <a
              href="#enquiry"
              className="mt-8 inline-flex min-h-12 items-center rounded-full bg-forest px-7 font-nav text-[15px] font-extrabold text-ivory"
            >
              Apply here
            </a>
          </div>
          <div className="hidden lg:col-span-5 lg:block">
            <CityscapeArt className="ml-auto w-full max-w-md text-foreground/20" />
          </div>
        </div>
      </section>

      <section className="bg-forest text-ivory">
        <div className="page-wrap grid gap-8 py-8 sm:grid-cols-3 sm:py-10">
          {pipeline.map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <StatIcon kind={item.icon} className="h-9 w-9 shrink-0 text-ivory/80" />
              <div>
                <p className="font-nav text-[1.85rem] leading-none font-extrabold tracking-[-0.03em] sm:text-[2.15rem]">
                  {item.value}
                </p>
                <p className="mt-1.5 text-sm text-ivory/70">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="relative">
          <div className="relative aspect-[16/9] overflow-hidden bg-secondary sm:aspect-[21/9] lg:h-[28rem] lg:aspect-auto">
            <img src={current.image} alt={current.name} className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Previous property"
              onClick={() => setProperty((i) => (i - 1 + properties.length) % properties.length)}
              className="absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-forest shadow-md sm:left-8"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next property"
              onClick={() => setProperty((i) => (i + 1) % properties.length)}
              className="absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-forest shadow-md sm:right-8"
            >
              ›
            </button>
          </div>
          <div className="page-wrap py-7 sm:py-8">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 className="font-nav text-xl font-extrabold text-bronze sm:text-2xl">{current.name}</h2>
              <p className="text-sm font-semibold text-foreground/45">{current.year}</p>
            </div>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-foreground/60">{current.copy}</p>
            <div className="mt-5 flex gap-1.5">
              {properties.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show ${properties[i]!.name}`}
                  onClick={() => setProperty(i)}
                  className={cn("h-[3px] flex-1 rounded-full", i === property ? "bg-bronze" : "bg-neutral-200")}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad">
        <div className="page-wrap">
          <Reveal>
            <h2 className="display-nav text-[clamp(1.85rem,4vw,2.75rem)] text-bronze">
              Join hands with a winning team.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {winning.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <li>
                  <h3 className="font-nav text-xl font-extrabold text-bronze">{item.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">{item.copy}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-forest text-ivory">
        <div className="mx-auto grid max-w-[1200px] lg:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 sm:py-14">
            <h2 className="display-nav text-[clamp(1.85rem,4vw,2.75rem)]">
              4.7★ across Studio and Premier.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/75">
              Guest rating for Studio Suites, Madhapur and Premier Suites, Hitec City.
              Breakfast included in the published rate.
            </p>
          </div>
          <div className="aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[20rem]">
            <img
              src="/images/image-12.webp"
              alt="Dining at Elysium"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad">
        <div className="page-wrap">
          <Reveal>
            <h2 className="display-nav text-[clamp(1.85rem,4vw,2.75rem)] text-bronze">
              What we expect from you.
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {expectYou.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <li>
                  <LineIcon kind={item.icon} className="h-10 w-10 text-foreground/30" />
                  <h3 className="mt-4 font-nav text-xl font-extrabold text-bronze">{item.title}</h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">{item.copy}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-neutral-100">
        <div className="page-wrap py-10 sm:py-12">
          <div className="grid overflow-hidden rounded-[10px] bg-white sm:grid-cols-2">
            <div className="flex min-h-[14rem] flex-col justify-center p-6 sm:p-8">
              <p className="font-nav text-lg font-extrabold text-forest sm:text-xl">
                “{currentNote.quote}”
              </p>
              <p className="mt-4 text-sm text-foreground/50">
                {currentNote.source} · {currentNote.house}
              </p>
            </div>
            <div className="flex flex-col justify-center bg-neutral-50 p-6 sm:p-8">
              <p className="text-sm text-foreground/55">From guests already staying at Studio and Premier.</p>
              <div className="mt-6 flex gap-1.5">
                {notes.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Guest note ${i + 1}`}
                    onClick={() => setNote(i)}
                    className={cn("h-[3px] flex-1 rounded-full", i === note ? "bg-bronze" : "bg-neutral-200")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory section-pad">
        <div className="page-wrap grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="display-nav text-[clamp(1.85rem,4vw,2.75rem)] text-bronze">
                What you can expect from us.
              </h2>
            </Reveal>
            <ul className="mt-10 grid gap-8">
              {expectUs.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.04}>
                  <li>
                    <h3 className="font-nav text-xl font-extrabold text-bronze">{item.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/60">{item.copy}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[10px]">
              <img
                src="/images/image-14.png"
                alt="Premier suite living at Elysium"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-24 bg-forest text-ivory">
        <div className="page-wrap flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:py-12">
          <div>
            <h2 className="display-nav text-[clamp(1.85rem,4vw,2.75rem)]">Ready to open with Elysium?</h2>
            <p className="mt-3 max-w-md text-sm text-ivory/75">
              Email your name, organisation and the property: location and
              inventory. We take it from there.
            </p>
          </div>
          <a
            href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent("Developers & Owners property enquiry")}`}
            className="inline-flex min-h-12 items-center rounded-[10px] bg-ivory px-6 font-nav text-sm font-extrabold text-forest"
          >
            {SITE_EMAIL}
          </a>
        </div>
      </section>
    </>
  );
}

function StatIcon({ kind, className }: { kind: "clip" | "reject" | "check"; className?: string }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect x="8" y="6" width="16" height="20" rx="1.5" {...stroke} />
      <path d="M12 6 V4 H20 V6" {...stroke} />
      {kind === "clip" && <path d="M12 14 H20 M12 18 H18" {...stroke} />}
      {kind === "reject" && <path d="M13 14 L19 20 M19 14 L13 20" {...stroke} />}
      {kind === "check" && <path d="M12 17 L15 20 L21 13" {...stroke} />}
    </svg>
  );
}

function LineIcon({
  kind,
  className,
}: {
  kind: "medal" | "shield" | "scales" | "coin" | "case" | "stairs";
  className?: string;
}) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {kind === "medal" && (
        <>
          <circle cx="20" cy="16" r="7" {...s} />
          <path d="M20 13 V16 L22 17 M15 22 L12 32 L20 28 L28 32 L25 22" {...s} />
        </>
      )}
      {kind === "shield" && (
        <>
          <path d="M20 6 L32 11 V20 C32 27 26 32 20 34 C14 32 8 27 8 20 V11 Z" {...s} />
          <path d="M15 20 L18.5 23.5 L26 16" {...s} />
        </>
      )}
      {kind === "scales" && (
        <>
          <path d="M20 8 V32 M12 32 H28" {...s} />
          <path d="M8 18 H16 L12 24 H8 Z M24 18 H32 L28 24 H24 Z" {...s} />
          <path d="M8 18 H32" {...s} />
        </>
      )}
      {kind === "coin" && (
        <>
          <circle cx="20" cy="20" r="10" {...s} />
          <circle cx="20" cy="20" r="4" {...s} />
        </>
      )}
      {kind === "case" && (
        <>
          <rect x="7" y="16" width="26" height="14" rx="1.5" {...s} />
          <path d="M14 16 V13 H26 V16" {...s} />
        </>
      )}
      {kind === "stairs" && (
        <>
          <path d="M8 30 H16 V24 H22 V18 H28 V12 H34" {...s} />
          <path d="M30 8 H36 V14" {...s} />
          <path d="M32 8 L36 8 L36 4" {...s} />
        </>
      )}
    </svg>
  );
}

function CityscapeArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 240" fill="none" className={className} aria-hidden="true">
      <path d="M20 200 H400" stroke="currentColor" strokeWidth="1.4" />
      <path d="M40 200 V110 H110 V200" stroke="currentColor" strokeWidth="1.4" />
      <path d="M110 140 H170 V200" stroke="currentColor" strokeWidth="1.4" />
      <path d="M170 88 H250 V200" stroke="currentColor" strokeWidth="1.4" />
      <path d="M250 120 H330 V200" stroke="currentColor" strokeWidth="1.4" />
      <path d="M54 128 H70 M54 146 H70 M54 164 H70" stroke="currentColor" strokeWidth="1.3" />
      <path d="M188 110 H230 M188 128 H230 M188 146 H230" stroke="currentColor" strokeWidth="1.3" />
      <path d="M266 140 H314 M266 158 H314" stroke="currentColor" strokeWidth="1.3" />
      <rect x="78" y="168" width="16" height="32" className="fill-bronze" />
      <circle cx="348" cy="52" r="14" stroke="currentColor" strokeWidth="1.4" />
      <path d="M348 42 V38 M338 52 H334 M348 62 V66 M358 52 H362" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M368 78 C368 70 380 70 380 78 V96 H368 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        className="stroke-bronze"
      />
      <circle cx="374" cy="72" r="3" className="fill-bronze" />
    </svg>
  );
}
