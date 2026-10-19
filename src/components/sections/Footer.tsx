import { Link } from "@tanstack/react-router";
import { useHotel } from "@/context/hotel";
import { navItems } from "@/data/hotels";
import { SITE_EMAIL } from "@/lib/site";

/** Bloom-structure footer, Elysium forest + logo. */
export function Footer() {
  const { hotels } = useHotel();

  return (
    <footer id="contact" className="relative overflow-hidden bg-forest text-ivory">
      <div className="page-wrap grid gap-10 py-12 sm:py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to="/" className="inline-block">
            <img src="/logo-light.svg" alt="Elysium Hotels" className="h-8 w-auto sm:h-9" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/70">
            Serviced suites in Madhapur and Hitec City. Direct rates, one operating desk.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/elysiumstudiosuites/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-nav text-sm font-extrabold text-ivory"
            >
              Instagram
            </a>
            <a href={`mailto:${SITE_EMAIL}`} className="font-nav text-sm font-extrabold text-ivory">
              Email
            </a>
            <a
              href="https://wa.me/919888765776"
              target="_blank"
              rel="noopener noreferrer"
              className="font-nav text-sm font-extrabold text-ivory"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:contents">
        <nav className="lg:col-span-2">
          <p className="font-nav text-sm font-extrabold text-ivory">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/book" className="hover:text-ivory">
                Book
              </Link>
            </li>
            <li>
              <a href="/#contact" className="hover:text-ivory">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <nav className="lg:col-span-3">
          <p className="font-nav text-sm font-extrabold text-ivory">Partner</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
            <li>
              <Link to="/owners" className="hover:text-ivory">
                Developers &amp; Owners
              </Link>
            </li>
            <li>
              <a href={`mailto:${SITE_EMAIL}?subject=Corporate%20bookings`} className="hover:text-ivory">
                Corporate Bookings
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE_EMAIL}?subject=Careers%20at%20Elysium`} className="hover:text-ivory">
                Careers
              </a>
            </li>
            <li>
              <Link to="/account" className="hover:text-ivory">
                Loyalty
              </Link>
            </li>
          </ul>
        </nav>
        </div>

        <div className="lg:col-span-3">
          <p className="font-nav text-sm font-extrabold text-ivory">Suites</p>
          <ul className="mt-4 space-y-4">
            {hotels.map((h) => (
              <li key={h.id}>
                <Link
                  to="/hotels/$slug"
                  params={{ slug: h.slug }}
                  className="font-nav text-sm font-extrabold text-ivory hover:opacity-80"
                >
                  {h.name}
                </Link>
                <p className="mt-1 text-xs leading-relaxed text-ivory/60">{h.place}, Hyderabad</p>
                <a href={`tel:${h.contact.phone.replace(/\s/g, "")}`} className="mt-1 block text-xs text-ivory/60 hover:text-ivory">
                  {h.contact.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/15">
        <div className="page-wrap flex flex-col gap-3 py-5 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Elysium Hotels. All rights reserved</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-ivory/70">
              Privacy &amp; Cookie Policy
            </Link>
            <Link to="/terms" className="hover:text-ivory/70">
              Terms &amp; Conditions
            </Link>
            <a href="https://grootdigitals.com" target="_blank" rel="noopener noreferrer" className="hover:text-ivory/70">
              Created by grootdigitals.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
