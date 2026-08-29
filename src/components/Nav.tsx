import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { navItems, type Hotel } from "@/data/hotels";
import { useHotel } from "@/context/hotel";
import { guestInitials, loyaltyStatus, useGuest, type Guest } from "@/context/guest";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/AuthModal";

export function Nav() {
  const hydrated = useHydrated();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [active, setActive] = useState("");
  const { hotels, hotelId, selectHotel } = useHotel();
  const { guest } = useGuest();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onDarkHero =
    pathname === "/" ||
    pathname === "/why" ||
    pathname === "/book" ||
    pathname.startsWith("/hotels/");
  const solid = scrolled || !onDarkHero;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));

  useEffect(() => {
    setOpen(false);
    setHotelsOpen(false);
    if (pathname === "/why") setActive("/why");
    else setActive("");
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const headerClassName = cn(
    "fixed top-0 right-0 left-0 z-50 transition-colors duration-500",
    solid ? "bg-ivory/95 text-forest shadow-[0_8px_30px_-18px_rgba(6,51,44,0.35)] backdrop-blur-md" : "text-ivory",
  );

  const bar = (
    <NavBar
      solid={solid}
      hotels={hotels}
      hotelId={hotelId}
      selectHotel={selectHotel}
      hotelsOpen={hotelsOpen}
      setHotelsOpen={setHotelsOpen}
      active={active}
      setActive={setActive}
      setOpen={setOpen}
      setAuthOpen={setAuthOpen}
      guest={hydrated ? guest : null}
    />
  );

  return (
    <>
      {hydrated ? (
        <motion.header
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={headerClassName}
        >
          {bar}
        </motion.header>
      ) : (
        <header className={headerClassName}>{bar}</header>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col justify-between overflow-y-auto overscroll-contain bg-forest px-5 py-5 text-ivory safe-bottom sm:px-8 sm:py-6 lg:px-10"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setOpen(false)} className="nav-mark">
              elysium
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center"
              aria-label="Close menu"
            >
              <CloseMark />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-center gap-7 py-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:py-8">
            <div>
              <p className="nav-link text-ivory/45">Hotels</p>
              <ul className="mt-5 space-y-4">
                {hotels.map((h) => (
                  <li key={h.id}>
                    <Link
                      to="/hotels/$slug"
                      params={{ slug: h.slug }}
                      onClick={() => {
                        selectHotel(h.id);
                        setOpen(false);
                      }}
                      className="block text-left font-nav text-[1.55rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[1.9rem]"
                    >
                      {h.name}
                      <span className="mt-1 block font-nav text-[15px] font-semibold tracking-normal text-ivory/55">
                        {h.region}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="space-y-4 lg:pt-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                    <Link
                      to={item.href}
                      onClick={() => {
                        setActive(item.href);
                        setOpen(false);
                      }}
                      className="block font-nav text-[1.85rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.15rem]"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => {
                        setActive(item.href);
                        setOpen(false);
                      }}
                      className="block font-nav text-[1.85rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.15rem]"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="block font-nav text-[1.85rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.15rem]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="nav-cta inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-ivory/50 px-8 py-3.5 sm:w-auto"
            >
              Book
            </Link>
            {hydrated && guest ? (
              <Link
                to="/account"
                onClick={() => setOpen(false)}
                className="nav-cta inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-ivory px-8 py-3.5 text-forest sm:w-auto"
              >
                Account
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setAuthOpen(true);
                }}
                className="nav-cta inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-ivory px-8 py-3.5 text-forest sm:w-auto"
              >
                Login / Join
              </button>
            )}
          </div>
        </div>
      ) : null}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}

function NavBar({
  solid,
  hotels,
  hotelId,
  selectHotel,
  hotelsOpen,
  setHotelsOpen,
  active,
  setActive,
  setOpen,
  setAuthOpen,
  guest,
}: {
  solid: boolean;
  hotels: Hotel[];
  hotelId: Hotel["id"];
  selectHotel: (id: Hotel["id"]) => void;
  hotelsOpen: boolean;
  setHotelsOpen: (v: boolean) => void;
  active: string;
  setActive: (v: string) => void;
  setOpen: (v: boolean) => void;
  setAuthOpen: (v: boolean) => void;
  guest: Guest | null;
}) {
  return (
    <nav className="relative flex w-full items-center justify-between px-4 py-3.5 sm:px-6 sm:py-[1.05rem] lg:px-10 lg:py-4">
      <Link to="/" className="relative z-10 shrink-0">
        <span className="nav-mark">elysium</span>
        <span className="sr-only">Elysium Hotels — home</span>
      </Link>

      <div className="flex shrink-0 items-center gap-5 sm:gap-6 lg:gap-8">
        <ul className="hidden items-center gap-7 lg:flex xl:gap-9">
          <li
            className="relative"
            onMouseEnter={() => setHotelsOpen(true)}
            onMouseLeave={() => setHotelsOpen(false)}
          >
            <button type="button" className="group flex items-center gap-1.5 py-1">
              <span className="nav-link">Hotels</span>
              <ChevronDown className={cn("transition-transform duration-300", hotelsOpen && "rotate-180")} />
            </button>

            {hotelsOpen ? (
              <ul className="absolute top-full left-0 w-72 rounded-[10px] bg-ivory py-2 text-forest shadow-[0_20px_50px_-24px_rgba(6,51,44,0.45)]">
                {hotels.map((h) => (
                  <li key={h.id}>
                    <Link
                      to="/hotels/$slug"
                      params={{ slug: h.slug }}
                      onClick={() => {
                        selectHotel(h.id);
                        setHotelsOpen(false);
                      }}
                      className={cn(
                        "flex w-full flex-col items-start gap-0.5 px-5 py-3 text-left transition-colors duration-300 hover:bg-forest/5",
                        hotelId === h.id && "bg-forest/5",
                      )}
                    >
                      <span className="font-nav text-[17px] leading-none font-bold">
                        {h.name}
                      </span>
                      <span className="font-nav text-[13px] font-semibold text-muted-foreground">
                        {h.region}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>

          {navItems.map((item) => (
            <li key={item.href}>
              {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                <Link
                  to={item.href}
                  onClick={() => setActive(item.href)}
                  className={cn(
                    "relative py-1 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-500",
                    active === item.href ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                  )}
                >
                  <span className="nav-link">{item.label}</span>
                </Link>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setActive(item.href)}
                  className={cn("py-1 transition-opacity duration-300 hover:opacity-70", active === item.href && "opacity-70")}
                >
                  <span className="nav-link">{item.label}</span>
                </a>
              )}
            </li>
          ))}
        </ul>

        {guest ? (
          <Link to="/account" className="flex min-w-0 items-center gap-2.5">
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-nav text-[11px] font-extrabold",
                solid ? "border-forest/30" : "border-ivory/50",
              )}
            >
              {guestInitials(guest)}
            </span>
            <span className="hidden min-w-0 flex-col items-start leading-tight lg:flex">
              <span className="nav-cta truncate">Hello, {guest.firstName}</span>
              <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold opacity-70">
                {loyaltyStatus(guest.stays).next}
                <span aria-hidden="true">★</span>
              </span>
            </span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className={cn(
              "nav-cta inline-flex min-h-10 items-center rounded-[10px] border px-4 py-2 sm:px-6 sm:py-2.5",
              solid ? "border-forest/80 hover:bg-forest hover:text-ivory" : "border-ivory hover:bg-ivory hover:text-forest",
            )}
          >
            Login / Join
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 w-8 flex-col items-end justify-center gap-[5px]"
          aria-label="Open menu"
        >
          <HamburgerMark />
        </button>
      </div>
    </nav>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={cn("h-[11px] w-[11px]", className)}
    >
      <path
        d="M2 4.2 L6 8.2 L10 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HamburgerMark() {
  return (
    <>
      <span className="h-[2px] w-7 rounded-full bg-current" />
      <span className="h-[2px] w-[18px] rounded-full bg-current" />
      <span className="h-[2px] w-[11px] rounded-full bg-current" />
    </>
  );
}

function CloseMark() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 4 L16 16 M16 4 L4 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
