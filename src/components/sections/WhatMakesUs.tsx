import { Link } from "@tanstack/react-router";

const highlights = [
  {
    title: "A host on the floor",
    copy: "Check-in, a late key, the 2 a.m. request — answered by someone in the building.",
    image: "/images/image-9.png",
    alt: "A quiet room at Elysium",
  },
  {
    title: "Kept spotless",
    copy: "Housekeeping every day, linen on a fixed cycle, and the room inspected before the next guest.",
    image: "/images/image-10.png",
    alt: "A serviced room at Elysium",
  },
  {
    title: "Sleep that holds",
    copy: "Quiet floors and a considered bed — the same on one night as on a four-week stay.",
    image: "/images/hero-suite-living.png",
    alt: "A bed at Elysium",
  },
];

/** Bloom highlight band — title, three photos, copy under each. */
export function WhatMakesUs() {
  return (
    <section id="makes-us" className="bg-forest text-ivory">
      <div className="home-frame py-12 lg:py-20">
        <h2 className="view-rise text-center font-nav text-[28px] leading-[34px] font-bold tracking-[-0.02em] sm:text-[36px] sm:leading-[42px]">
          The things you notice at 2 a.m.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[16px] leading-relaxed text-ivory/70 sm:text-[18px]">
          Someone is still in the building. The room was checked. The bed holds for a month, not
          just a night.
        </p>

        <ul className="stagger mt-10 grid gap-6 sm:grid-cols-3">
          {highlights.map((item) => (
            <li key={item.title} className="group view-rise">
              <span className="still block rounded-[16px]">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="aspect-[3/2] w-full object-cover sm:aspect-[4/5]"
                />
              </span>
              <h3 className="mt-5 font-nav text-[22px] leading-tight font-bold">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ivory/75">{item.copy}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link to="/why" className="font-nav text-[16px] font-bold text-ivory underline underline-offset-4">
            See the full standard
          </Link>
        </div>
      </div>
    </section>
  );
}
