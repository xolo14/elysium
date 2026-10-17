import { useState } from "react";
import { hotelFaqs } from "@/data/faqs";
import { cn } from "@/lib/utils";

const standard = [
  {
    mark: "01",
    title: "Bed",
    copy: "Quiet floors, a considered mattress, and linen changed on a fixed cycle.",
  },
  {
    mark: "02",
    title: "Breakfast",
    copy: "Included at O Sorriso when you book direct. Served 7:00–10:30 am.",
  },
  {
    mark: "03",
    title: "Bathroom",
    copy: "Hot water, fresh towels, and the room reset before the next guest.",
  },
  {
    mark: "04",
    title: "Balcony",
    copy: "Private outdoor air where the plan allows it. The interior standard holds either way.",
  },
];

const facts = [
  { label: "Check-in", value: "From 2:00 pm" },
  { label: "Check-out", value: "By 11:00 am" },
  { label: "Desk", value: "Staffed through the night" },
  { label: "Cancel", value: "Free until 24 hours prior" },
];

/** The operating standard, stated once, without decoration. */
export function StayStandard() {
  return (
    <section id="standard" className="bg-ivory">
      <div className="home-frame py-12 lg:py-24">
        <div className="view-rise max-w-xl">
          <p className="font-nav text-[12px] font-bold tracking-[0.16em] text-bronze uppercase">
            Night twenty
          </p>
          <h2 className="mt-3 font-nav text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-forest">
            The room does not get worse on night twenty.
          </h2>
        </div>

        <ol className="stagger mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {standard.map((item) => (
            <li key={item.title} className="view-rise border-t border-forest/15 pt-5">
              <p className="font-nav text-[12px] font-bold tracking-[0.14em] text-bronze">{item.mark}</p>
              <h3 className="mt-3 font-nav text-[22px] leading-tight font-bold tracking-[-0.02em] text-forest">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-neutral-500">{item.copy}</p>
            </li>
          ))}
        </ol>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] bg-forest/10 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-white px-4 py-3.5 sm:px-5 sm:py-4">
              <dt className="font-nav text-[11px] font-extrabold tracking-[0.14em] text-neutral-400 uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1 text-[15px] font-medium text-forest">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** One guest note. No carousel, no rating theatre. */
export function GuestLine() {
  return (
    <section className="bg-white">
      <div className="page-wrap py-16 lg:py-24">
        <figure className="max-w-3xl">
          <blockquote className="font-nav text-[clamp(1.45rem,2.6vw,2rem)] leading-[1.35] font-semibold tracking-[-0.03em] text-forest">
            “I stayed six weeks on a project in Hitec City. Clean rooms, a working kitchenette, and
            the front desk sorted everything.”
          </blockquote>
          <figcaption className="mt-6 text-[14px] text-neutral-500">
            <span className="font-semibold text-forest">Rahul Menon</span>
            <span> · Bengaluru · Studio Suites, Madhapur</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Practical questions, set in the same type as the rest of the page. */
export function HomeQuestions() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faqs" className="bg-white">
      <div className="home-frame grid gap-8 py-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-20 lg:py-24">
        <div className="view-rise">
          <p className="font-nav text-[12px] font-bold tracking-[0.16em] text-bronze uppercase">
            Still deciding
          </p>
          <h2 className="mt-3 font-nav text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-forest">
            Read this before you pay.
          </h2>
        </div>

        <ul className="border-t border-forest/10">
          {hotelFaqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-forest/10">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-4 text-left"
                >
                  <span className="text-[15px] font-semibold text-forest sm:text-[16px]">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "text-lg leading-none text-forest/50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isOpen && "rotate-45",
                    )}
                  >
                    +
                  </span>
                </button>
                <div className="faq-panel" data-open={isOpen}>
                  <div>
                    <p className="max-w-xl pb-4 pr-8 text-[15px] leading-relaxed text-neutral-500">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
