import { useState } from "react";
import { useHotel } from "@/context/hotel";
import { navItems } from "@/data/hotels";
import { BrandLockup, BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";


export function Footer() {
  const { hotel, hotels } = useHotel();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer
      id="contact"
      className="relative flex flex-col justify-between overflow-hidden bg-forest text-ivory"
    >
      <img
        src={hotel.hero}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="ken-burns absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/85 via-forest/80 to-forest" />

      {/* Brand four-point star lattice — exact motif from the brand sheet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("/images/footer-lattice.png")`,
          backgroundSize: "760px 360px",
          backgroundRepeat: "repeat",
        }}
      />


      <div className="relative mx-auto w-full max-w-[1600px] px-6 pt-20 sm:px-10">
        <Reveal>
          <p className="eyebrow text-ivory/60">Stay in touch</p>
          <h2 className="mt-5 flex w-full max-w-none flex-wrap items-center gap-x-[0.3em] gap-y-2 font-display text-[clamp(1.65rem,7vw,7rem)] font-bold leading-none sm:flex-nowrap sm:whitespace-nowrap">
            <BrandStar className="h-[0.52em] w-[0.52em] shrink-0 text-accent" />
            <span>Elysium Studio Suites</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-12">
          <div className="min-w-0 lg:col-span-3">
            <p className="eyebrow text-ivory/60">Newsletter</p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
              className="mt-6 flex flex-col gap-3 border-b border-ivory/30 pb-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="your@email.com"
                className="w-full bg-transparent text-sm placeholder:text-ivory/40 focus:outline-none"
              />
              <button type="submit" className="eyebrow min-h-11 shrink-0 self-end sm:self-auto">
                {sent ? "Thank you" : "Subscribe"}
              </button>
            </form>
            <p className="mt-4 text-xs leading-relaxed text-ivory/50">
              Occasional letters about openings, residencies and quiet seasons.
            </p>
          </div>

          <nav className="min-w-0 lg:col-span-2">
            <p className="eyebrow text-ivory/60">Navigate</p>
            <ul className="mt-6 space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="link-luxe font-display text-xl">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid min-w-0 gap-10 sm:grid-cols-2 md:col-span-2 lg:col-span-5 lg:gap-x-10">
            {hotels.map((h) => (
              <address key={h.id} className="not-italic min-w-0">
                <p className="eyebrow text-ivory/60">{h.place}</p>
                <a
                  href={`/hotels/${h.slug}`}
                  className="link-luxe mt-3 block font-display text-lg leading-snug font-semibold lg:text-xl"
                >
                  {h.name}
                </a>
                <p className="mt-2 text-sm text-ivory/55">{h.region}</p>
                <div className="mt-6 space-y-1 text-sm leading-relaxed text-ivory/75">
                  {h.contact.address.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <a
                  href={`tel:${h.contact.phone.replace(/\s/g, "")}`}
                  className="link-luxe mt-6 block text-sm"
                >
                  {h.contact.phone}
                </a>
                <a href={`mailto:${h.contact.email}`} className="link-luxe mt-2 block text-sm break-all">
                  {h.contact.email}
                </a>
              </address>
            ))}
          </div>

          <div className="min-w-0 lg:col-span-2">
            <p className="eyebrow text-ivory/60">Social</p>
            <ul className="mt-6 space-y-3">
              {["Instagram", "Journal", "LinkedIn", "Pinterest"].map((social) => (
                <li key={social}>
                  <a href="#contact" className="link-luxe text-sm">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-14 w-full max-w-[1600px] px-6 pb-8 sm:px-10">
        <div className="hairline" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
          <BrandLockup />
          <div className="flex flex-col items-end gap-2 text-right">
            <p className="eyebrow flex items-center gap-3 text-ivory/50">
              <BrandStar className="h-2 w-2 animate-slow-spin" />
              {hotel.established} — All rights reserved
            </p>
            <a
              href="https://grootdigitals.com"
              target="_blank"
              rel="noopener noreferrer"
              className="link-luxe text-xs text-ivory/45"
            >
              Created by grootdigitals.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
