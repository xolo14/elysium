import { Link } from "@tanstack/react-router";
import { BrandStar } from "@/lib/brand";
import { SITE_EMAIL } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

type Section = { heading: string; body: string[] };

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <article className="page-wrap max-w-[45rem] pt-28 pb-20 sm:pt-36 sm:pb-28">
      <Reveal>
        <p className="eyebrow text-muted-foreground">Elysium Hotels</p>
        <h1 className="mt-4 display-nav text-[clamp(2.25rem,5vw,3.5rem)] text-forest">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>
        <p className="mt-8 prose-quiet text-base">{intro}</p>

        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl text-forest sm:text-2xl">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 48)} className="mt-3 prose-quiet">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="flex items-start gap-2 text-sm text-foreground/70">
            <BrandStar className="mt-1.5 h-2.5 w-2.5 shrink-0 text-forest" />
            Questions? Write to{" "}
            <a href={`mailto:${SITE_EMAIL}`} className="font-medium text-forest underline-offset-4 hover:underline">
              {SITE_EMAIL}
            </a>{" "}
            or{" "}
            <Link to="/" hash="contact" className="font-medium text-forest underline-offset-4 hover:underline">
              contact either house
            </Link>
            .
          </p>
        </div>
      </Reveal>
    </article>
  );
}
