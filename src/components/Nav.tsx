import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { navItems, type Hotel } from "@/data/hotels";
import { useHotel } from "@/context/hotel";
import { guestInitials, loyaltyStatus, useGuest, type Guest } from "@/context/guest";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/AuthModal";

const ease = [0.16, 1, 0.3, 1] as const;

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
  const onBookFlow = pathname === "/book";
  const onDarkHero =
    pathname === "/" ||
    pathname === "/why" ||
    onBookFlow ||
    pathname.startsWith("/hotels/");
  /** Ivory chrome when scrolled — except booking desk stays forest like the dates step */
  const solid = !onBookFlow && (scrolled || !onDarkHero);
  const bookForestChrome = onBookFlow && (scrolled || open);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));

  useEffect(() => {
    setOpen(false);
    setHotelsOpen(false);
    if (pathname === "/why") setActive("/why");
    else setActive("");
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
    };
    const scrollbar = window.innerWidth - html.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = "";
      body.style.right = "";
      body.style.width = prev.bodyWidth;
      body.style.paddingRight = prev.bodyPaddingRight;
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const headerClassName = cn(
    "fixed top-0 right-0 left-0 z-[80] transition-[background-color,box-shadow,color] duration-500 ease-luxe",
    open || bookForestChrome
      ? "bg-forest text-ivory shadow-[0_8px_30px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md"
      : solid
        ? "bg-ivory/95 text-forest shadow-[0_8px_30px_-18px_rgba(6,51,44,0.35)] backdrop-blur-md"
        : "bg-transparent text-ivory",
  );

  const bar = (
    <NavBar
      solid={solid && !open && !onBookFlow}
      menuOpen={open}
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

  const closeMenu = () => setOpen(false);

  return (
    <>
      {hydrated ? (
        <motion.header
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.8, ease }}
          className={headerClassName}
        >
          {bar}
        </motion.header>
      ) : (
        <header className={headerClassName}>{bar}</header>
      )}

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              key="menu-scrim"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="fixed inset-0 z-[70] touch-none bg-forest/40 backdrop-blur-[2px]"
              onClick={closeMenu}
              onWheel={(e) => e.preventDefault()}
              onTouchMove={(e) => e.preventDefault()}
            />
            <motion.aside
              key="menu-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.55, ease }}
              className="fixed inset-y-0 left-0 z-[75] flex w-[min(100%,22rem)] flex-col overflow-y-auto overscroll-contain bg-forest px-6 pt-24 pb-8 text-ivory safe-bottom sm:w-[min(100%,26rem)] sm:px-8"
            >
              <nav className="flex flex-1 flex-col gap-8">
                <div>
                  <motion.p
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12, duration: 0.4, ease }}
                    className="nav-link text-ivory/45"
                  >
                    Hotels
                  </motion.p>
                  <ul className="mt-4 space-y-3.5">
                    {hotels.map((h, i) => (
                      <motion.li
                        key={h.id}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.16 + i * 0.06, duration: 0.45, ease }}
                      >
                        <Link
                          to="/hotels/$slug"
                          params={{ slug: h.slug }}
                          onClick={() => {
                            selectHotel(h.id);
                            closeMenu();
                          }}
                          className="block text-left font-nav text-[1.45rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[1.7rem]"
                        >
                          {h.name}
                          <span className="mt-1 block font-nav text-[14px] font-semibold tracking-normal text-ivory/55">
                            {h.region}
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <ul className="space-y-3.5 border-t border-ivory/15 pt-7">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.28 + i * 0.06, duration: 0.45, ease }}
                    >
                      {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                        <Link
                          to={item.href}
                          onClick={() => {
                            setActive(item.href);
                            closeMenu();
                          }}
                          className="block font-nav text-[1.45rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[1.7rem]"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          onClick={() => {
                            setActive(item.href);
                            closeMenu();
                          }}
                          className="block font-nav text-[1.45rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[1.7rem]"
                        >
                          {item.label}
                        </a>
                      )}
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.45, ease }}
                  >
                    <a
                      href="/#contact"
                      onClick={closeMenu}
                      className="block font-nav text-[1.45rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[1.7rem]"
                    >
                      Contact
                    </a>
                  </motion.li>
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.45, ease }}
                className="mt-10 flex flex-col gap-3"
              >
                <Link
                  to="/book"
                  onClick={closeMenu}
                  className="nav-cta inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-ivory/50 px-8 py-3.5"
                >
                  Book
                </Link>
                {hydrated && guest ? (
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="nav-cta inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-ivory px-8 py-3.5 text-forest"
                  >
                    Account
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      setAuthOpen(true);
                    }}
                    className="nav-cta inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-ivory px-8 py-3.5 text-forest"
                  >
                    Login / Join
                  </button>
                )}
              </motion.div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}

function NavBar({
  solid,
  menuOpen,
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
  menuOpen: boolean;
  hotels: Hotel[];
  hotelId: Hotel["id"];
  selectHotel: (id: Hotel["id"]) => void;
  hotelsOpen: boolean;
  setHotelsOpen: (v: boolean) => void;
  active: string;
  setActive: (v: string) => void;
  setOpen: (v: boolean | ((o: boolean) => boolean)) => void;
  setAuthOpen: (v: boolean) => void;
  guest: Guest | null;
}) {
  return (
    <nav className="safe-top relative flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-[1.05rem] lg:px-10 lg:py-4">
      <Link to="/" className="relative z-10 shrink-0">
        <img
          src={solid && !menuOpen ? "/logo-dark.svg" : "/logo-light.svg"}
          alt="Elysium Hotels"
          className="h-7 w-auto sm:h-9"
        />
      </Link>

      <div className="flex shrink-0 items-center gap-3.5 sm:gap-6 lg:gap-8">
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
                  className={cn(
                    "py-1 transition-opacity duration-300 hover:opacity-70",
                    active === item.href && "opacity-70",
                  )}
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
                solid && !menuOpen ? "border-forest/30" : "border-ivory/50",
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
              "nav-cta inline-flex min-h-9 items-center rounded-[10px] border px-3 py-1.5 text-[13px] sm:min-h-10 sm:px-6 sm:py-2.5 sm:text-[15px]",
              solid && !menuOpen
                ? "border-forest/80 hover:bg-forest hover:text-ivory"
                : "border-ivory hover:bg-ivory hover:text-forest",
            )}
          >
            Login / Join
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-10 w-10 items-center justify-center"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <MenuToggleIcon open={menuOpen} />
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

/** Three lines morph into an X. */
function MenuToggleIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-7" aria-hidden="true">
      <motion.span
        className="absolute left-0 h-[2px] w-7 origin-center rounded-full bg-current"
        initial={false}
        animate={open ? { top: 7, rotate: 45, width: 28 } : { top: 0, rotate: 0, width: 28 }}
        transition={{ duration: 0.4, ease }}
      />
      <motion.span
        className="absolute left-0 h-[2px] origin-center rounded-full bg-current"
        style={{ width: 18 }}
        initial={false}
        animate={open ? { top: 7, opacity: 0, scaleX: 0 } : { top: 7, opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.28, ease }}
      />
      <motion.span
        className="absolute left-0 h-[2px] origin-center rounded-full bg-current"
        initial={false}
        animate={
          open ? { top: 7, rotate: -45, width: 28 } : { top: 14, rotate: 0, width: 11 }
        }
        transition={{ duration: 0.4, ease }}
      />
    </span>
  );
}
