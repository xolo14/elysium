import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useHotel } from "@/context/hotel";
import { BrandStar } from "@/lib/brand";
import { MaskImage, Reveal, RevealLines } from "@/components/Reveal";

const promises = [
  { title: "Verified addresses", copy: "Both houses are owned and operated by us — no sub-let inventory, no surprise property." },
  { title: "Rate you see is the rate you pay", copy: "Taxes and breakfast included. No resort fee, no card surcharge." },
  { title: "Free cancellation", copy: "Cancel up to 24 hours before arrival on every direct booking." },
  { title: "Safety first", copy: "CCTV on all common floors, secure entry, fire equipment serviced annually." },
  { title: "GST invoices", copy: "Proper tax invoices for corporate travel and reimbursement, issued at checkout." },
  { title: "Real people, real phone", copy: "One number, answered by the front desk in the building — 24 hours a day." },
];

/** About the house — written to be read and to be trusted. */
export function Story() {
  const { hotel } = useHotel();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section ref={ref} id="about" className="relative overflow-hidden bg-secondary py-16 lg:py-20">
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-4 lg:col-start-1 lg:pt-16">
            <motion.div style={{ y: imgY }}>
              <MaskImage
                src={hotel.about.image}
                alt={`${hotel.name}, ${hotel.place} — interior`}
                ratio="4 / 5"
                className="w-full"
              />
              <div className="mt-5 flex items-center gap-3">
                <BrandStar className="h-2.5 w-2.5 text-accent" />
                <span className="eyebrow text-muted-foreground">
                  {hotel.place} · Since {hotel.established}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal>
              <p className="eyebrow text-muted-foreground">About Elysium</p>
              <h2 className="display-title mt-8 max-w-3xl lg:text-[4.8rem]">
                {hotel.tagline}
              </h2>
            </Reveal>

            <RevealLines
              lines={hotel.about.lines}
              className="mt-12 max-w-2xl space-y-5"
              lineClassName="text-sm leading-relaxed text-foreground/75 lg:text-lg"
            />

            {/* Trust numbers — counting into place */}
            <Reveal delay={0.15} className="mt-14 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
              {hotel.trust.map((t, i) => (
                <motion.div
                  key={t.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="border-t border-border pt-5"
                >
                  <p className="font-display text-3xl lg:text-4xl">{t.value}</p>
                  <p className="mt-3 text-sm font-medium text-muted-foreground">{t.label}</p>
                </motion.div>
              ))}
            </Reveal>

            {/* Written promises */}
            <ul className="mt-16 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {promises.map((p, i) => (
                <motion.li
                  key={p.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4"
                >
                  <BrandStar className="mt-1.5 h-2.5 w-2.5 shrink-0 text-accent" />
                  <div>
                    <p className="font-display text-xl">{p.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">{p.copy}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <Reveal delay={0.1} className="mt-14 border-t border-border pt-8">
              <address className="not-italic">
                <p className="eyebrow text-muted-foreground">Registered address</p>
                <div className="mt-4 space-y-1 text-sm text-foreground/75">
                  {hotel.contact.address.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-6">
                  <a href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`} className="link-luxe text-sm">
                    {hotel.contact.phone}
                  </a>
                  <a href={`mailto:${hotel.contact.email}`} className="link-luxe text-sm">
                    {hotel.contact.email}
                  </a>
                </div>
              </address>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
