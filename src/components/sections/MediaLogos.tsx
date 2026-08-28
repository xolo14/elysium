import { Reveal } from "@/components/Reveal";

const logos = [
  "Traveler",
  "GQ",
  "Condé Nast",
  "CNN Travel",
  "Lonely Planet",
  "Forbes",
];

/** Quiet press strip — Bloom media bar, Elysium tone. */
export function MediaLogos() {
  return (
    <section aria-label="As featured in" className="border-y border-border bg-background py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-10">
        <Reveal>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
            {logos.map((name) => (
              <li
                key={name}
                className="font-display text-lg tracking-wide text-foreground/25 sm:text-xl"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
