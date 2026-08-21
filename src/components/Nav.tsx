import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { navItems } from "@/data/hotels";
import { BrandStar } from "@/lib/brand";
import { useHotel } from "@/context/hotel";
import { cn } from "@/lib/utils";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hotelsOpen, setHotelsOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const { hotel, hotels, hotelId, selectHotel } = useHotel();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Home has a dark full-bleed hero; other routes need a solid/readable nav on mobile.
  const onDarkHero = pathname === "/";
  const solid = scrolled || !onDarkHero;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  useEffect(() => {
    setOpen(false);
    setHotelsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 sm:px-8 sm:pt-6"
      >
        <nav
          className={cn(
            "relative mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 transition-all duration-700 ease-luxe sm:px-8",
            solid
              ? "glass text-foreground shadow-[0_20px_60px_-40px_rgba(0,0,0,0.4)]"
              : "border border-transparent text-ivory",
          )}
        >
          <Link to="/" className="relative z-10 flex items-center">
            <img
              src={solid ? "/logo-dark.svg" : "/logo-light.svg"}
              alt="Elysium Studio Suites"
              width={144}
              height={40}
              className="h-8 w-auto"
            />
            <span className="sr-only">Elysium Studio Suites — home</span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            <li
              className="relative"
              onMouseEnter={() => setHotelsOpen(true)}
              onMouseLeave={() => setHotelsOpen(false)}
            >
              <button className="group relative flex items-center gap-2 px-1 py-2">
                <span className="eyebrow font-semibold">Hotels</span>
                <BrandStar
                  className={cn(
                    "h-2 w-2 transition-transform duration-500",
                    hotelsOpen && "rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-700 ease-luxe",
                    hotelsOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </button>

              {hotelsOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="glass absolute top-full left-0 w-72 py-2 text-foreground"
                >
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
                        <span className="font-display text-lg leading-none">{h.name}</span>
                        <span className="eyebrow font-medium text-muted-foreground">{h.region}</span>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>

            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setActive(item.href)}
                  className="group relative overflow-hidden px-1 py-2"
                >
                  <span className="eyebrow relative z-10 font-semibold">{item.label}</span>
                  <motion.span
                    layout
                    className={cn(
                      "absolute bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-700 ease-luxe",
                      active === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/book"
              className={cn(
                "group flex min-h-11 items-center gap-2 border px-4 py-2.5 transition-colors duration-700 sm:gap-3 sm:px-6 sm:py-3",
                solid
                  ? "border-foreground/25 hover:bg-foreground hover:text-ivory"
                  : "border-ivory/40 hover:bg-ivory hover:text-forest",
              )}
            >
              <BrandStar className="h-2.5 w-2.5 transition-transform duration-700 group-hover:rotate-90" />
              <span className="eyebrow font-semibold">Book</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="eyebrow flex min-h-11 min-w-11 items-center justify-center font-semibold lg:hidden"
              aria-label="Open menu"
            >
              Menu
            </button>
          </div>
        </nav>
      </motion.header>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: "-8%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[70] flex flex-col justify-between overflow-y-auto overscroll-contain bg-forest px-5 py-7 text-ivory sm:px-6 sm:py-8 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex items-start justify-between">
            <img
              src="/logo-light.svg"
              alt="Elysium Studio Suites"
              width={144}
              height={40}
              className="h-8 w-auto"
            />
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
              {navItems.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.8 }}
                >
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
                </motion.li>
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
        </motion.div>
      )}
    </>
  );
}
