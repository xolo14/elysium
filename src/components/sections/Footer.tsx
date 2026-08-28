import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { navItems } from "@/data/hotels";
import { BrandLockup, BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";
import { SITE_EMAIL } from "@/lib/site";

/** Footer in logo forest — matches brand mark #06332C. */
export function Footer() {
  const { hotel, hotels } = useHotel();

  return (
    <footer id="contact" className="relative overflow-hidden bg-forest text-ivory">
      <div className="relative mx-auto w-full max-w-[1200px] px-5 pt-12 sm:px-10 sm:pt-14">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <BrandLockup className="text-ivory" />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
                Serviced suites in Madhapur &amp; Hitec City — quiet rooms, breakfast, and a front desk
                that answers.
              </p>
            </div>

            <nav className="lg:col-span-2">
              <p className="eyebrow text-ivory/50">Explore</p>
              <ul className="mt-4 space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                      <Link
                        to={item.href}
                        className="text-sm font-medium text-ivory/80 hover:text-ivory"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className="text-sm font-medium text-ivory/80 hover:text-ivory">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
                <li>
                  <Link to="/book" className="text-sm font-medium text-ivory/80 hover:text-ivory">
                    Book
                  </Link>
                </li>
                <li>
                  <a href="/#faqs" className="text-sm font-medium text-ivory/80 hover:text-ivory">
                    FAQs
                  </a>
                </li>
              </ul>
            </nav>

            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-4">
              {hotels.map((h) => (
                <address key={h.id} className="not-italic">
                  <p className="eyebrow text-ivory/50">{h.place}</p>
                  <Link
                    to="/hotels/$slug"
                    params={{ slug: h.slug }}
                    className="mt-2 block font-display text-lg leading-snug hover:opacity-80"
                  >
                    {h.name}
                  </Link>
                  <a
                    href={`tel:${h.contact.phone.replace(/\s/g, "")}`}
                    className="mt-3 block text-sm text-ivory/70 hover:text-ivory"
                  >
                    {h.contact.phone}
                  </a>
                </address>
              ))}
            </div>

            <div className="lg:col-span-2">
              <p className="eyebrow text-ivory/50">Connect</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="https://www.instagram.com/elysiumstudiosuites/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-ivory/80 hover:text-ivory"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE_EMAIL}`}
                    className="text-sm font-medium text-ivory/80 hover:text-ivory"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-8 w-full max-w-[1200px] border-t border-ivory/15 px-5 py-5 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="eyebrow flex items-center gap-2 text-ivory/50">
            <BrandStar className="h-2 w-2" />
            © {hotel.established} Elysium Hotels — All rights reserved
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ivory/45">
            <Link to="/privacy" className="hover:text-ivory/70">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-ivory/70">
              Terms
            </Link>
            <a
              href="https://grootdigitals.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ivory/70"
            >
              Created by grootdigitals.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
