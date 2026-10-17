const moments = [
  {
    time: "7:30",
    title: "Breakfast downstairs",
    copy: "The buffet at O Sorriso is included when you book direct. Served until 10:30.",
  },
  {
    time: "Day",
    title: "A kitchen, if you want one",
    copy: "Cook when the week runs long. Eat downstairs when you would rather not.",
  },
  {
    time: "Night",
    title: "A desk that stays open",
    copy: "The floor is quiet enough to work late. Someone in the building still has the key.",
  },
];

/** Editorial band — one photograph, then the shape of a day. */
export function StayDay() {
  return (
    <section id="day" className="bg-white">
      <div className="home-frame pt-10 pb-12 lg:pb-20">
        <div className="view-rise grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
          <div>
            <p className="font-nav text-[12px] font-bold tracking-[0.16em] text-bronze uppercase">
              Already handled
            </p>
            <h2 className="mt-3 max-w-[16ch] font-nav text-[clamp(2rem,4vw,2.75rem)] leading-[1.12] font-bold tracking-[-0.02em] text-forest">
              The morning is already handled.
            </h2>
          </div>
          <p className="max-w-sm text-[16px] leading-relaxed text-neutral-500 lg:pb-1">
            Breakfast is downstairs, and it was paid for when you booked. The rest of the day is
            yours.
          </p>
        </div>

        <figure className="mt-10 overflow-hidden rounded-[16px]">
          <img
            src="/images/hitec-city/dining-area/dining-04.png"
            alt="Breakfast buffet at O Sorriso, Premier Suites"
            width={1600}
            height={900}
            className="view-photo aspect-[4/3] w-full object-cover object-[center_40%] sm:aspect-[16/8]"
          />
          <figcaption className="mt-3 text-[13px] tracking-wide text-neutral-400">
            O Sorriso · Premier Suites, Hitec City
          </figcaption>
        </figure>

        <ol className="stagger mt-10 grid gap-8 border-t border-forest/10 pt-8 sm:grid-cols-3 sm:gap-10">
          {moments.map((item) => (
            <li key={item.title} className="view-rise">
              <p className="font-nav text-[12px] font-bold tracking-[0.14em] text-bronze uppercase">
                {item.time}
              </p>
              <h3 className="mt-3 font-nav text-[20px] leading-tight font-bold tracking-[-0.02em] text-forest">
                {item.title}
              </h3>
              <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-neutral-500">{item.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
