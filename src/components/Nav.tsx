import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { navItems, type Hotel } from "@/data/hotels";
import { BrandLockup, BrandStar } from "@/lib/brand";
import { useHotel } from "@/context/hotel";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function Nav() {
  const hydrated = useHydrated();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const { hotels, hotelId, selectHotel } = useHotel();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onDarkHero = pathname === "/";
  const solid = scrolled || !onDarkHero;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  useEffect(() => {
    setOpen(false);
    setHotelsOpen(false);
    if (pathname === "/about") setActive("/about");
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const headerClassName = "fixed top-0 right-0 left-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6";
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
    />
  );

  return (
    <>
      {hydrated ? (
        <motion.header
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={headerClassName}
        >
          {bar}
        </motion.header>
      ) : (
        <header className={headerClassName}>{bar}</header>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex flex-col justify-between overflow-y-auto overscroll-contain bg-forest px-5 py-7 text-ivory sm:px-6 sm:py-8 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex items-start justify-between">
            <BrandLockup className="text-ivory" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="eyebrow min-h-11 px-2"
              aria-label="Close menu"
            >
              Close
            </button>
          </div>
          <div className="space-y-8">
            <div>
              <p className="eyebrow text-ivory/50">Hotels</p>
              <ul className="mt-4 space-y-3">
                {hotels.map((h) => (
                  <li key={h.id}>
                    <Link
                      to="/hotels/$slug"
                      params={{ slug: h.slug }}
                      onClick={() => {
                        selectHotel(h.id);
                        setOpen(false);
                      }}
                      className="block text-left font-display text-[1.85rem] leading-tight sm:text-3xl"
                    >
                      {h.name}
                      <span className="eyebrow mt-2 block text-ivory/60">{h.region}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                    <Link
                      to={item.href}
                      onClick={() => {
                        setActive(item.href);
                        setOpen(false);
                      }}
                      className="block text-left font-display text-[1.85rem] leading-tight sm:text-3xl"
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
                      className="font-display text-[1.85rem] leading-tight sm:text-3xl"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/book"
            onClick={() => setOpen(false)}
            className="eyebrow relative z-10 mt-6 flex min-h-14 shrink-0 items-center justify-between border border-ivory/35 px-5 py-4"
          >
            Reserve a stay <BrandStar className="h-3 w-3" />
          </Link>
        </div>
      ) : null}
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
}) {
  return (
    <nav
      className={cn(
        "relative flex w-full items-center justify-between gap-4 px-4 py-3.5 transition-all duration-700 ease-luxe sm:px-6 sm:py-4 lg:px-8",
        solid
          ? "glass text-foreground shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)]"
          : "border border-transparent text-ivory",
      )}
    >
      <Link to="/" className="relative z-10 flex shrink-0 items-center">
        <BrandLockup className={cn(solid ? "text-foreground" : "text-ivory")} />
        <span className="sr-only">Elysium Hotels — home</span>
      </Link>

      <ul className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-10">
        <li
          className="relative"
          onMouseEnter={() => setHotelsOpen(true)}
          onMouseLeave={() => setHotelsOpen(false)}
        >
          <button type="button" className="group relative flex items-center gap-2 px-1 py-2">
            <span className="nav-link">Hotels</span>
            <BrandStar
              className={cn("h-2.5 w-2.5 transition-transform duration-500", hotelsOpen && "rotate-45")}
            />
            <span
              className={cn(
                "absolute bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-700 ease-luxe",
                hotelsOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
              )}
            />
          </button>

          {hotelsOpen ? (
            <ul className="glass absolute top-full left-0 w-72 py-2 text-foreground">
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
                      "flex w-full flex-col items-start gap-1 px-5 py-3 text-left transition-colors duration-500 hover:bg-foreground/5",
                      hotelId === h.id && "bg-foreground/5",
                    )}
                  >
                    <span className="font-display text-lg leading-none font-semibold">{h.name}</span>
                    <span className="eyebrow font-medium text-muted-foreground">{h.region}</span>
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
                className="group relative overflow-hidden px-1 py-2"
              >
                <span className="nav-link relative z-10">{item.label}</span>
                <span
                  className={cn(
                    "absolute bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-700 ease-luxe",
                    active === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            ) : (
              <a
                href={item.href}
                onClick={() => setActive(item.href)}
                className="group relative overflow-hidden px-1 py-2"
              >
                <span className="nav-link relative z-10">{item.label}</span>
                <span
                  className={cn(
                    "absolute bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-700 ease-luxe",
                    active === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </a>
            )}
          </li>
        ))}
      </ul>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <Link
          to="/book"
          className={cn(
            "group flex min-h-12 items-center gap-2 border px-5 py-3 transition-colors duration-700 sm:gap-3 sm:px-7 sm:py-3.5",
            solid
              ? "border-foreground/25 hover:bg-foreground hover:text-ivory"
              : "border-ivory/40 hover:bg-ivory hover:text-forest",
          )}
        >
          <BrandStar className="h-3 w-3 transition-transform duration-700 group-hover:rotate-90" />
          <span className="eyebrow font-semibold">Book</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="eyebrow flex min-h-12 min-w-12 items-center justify-center font-semibold lg:hidden"
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>
    </nav>
  );
}
