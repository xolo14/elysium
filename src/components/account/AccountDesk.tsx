import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  guestFullName,
  guestInitials,
  loyaltyStatus,
  maskEmail,
  useGuest,
} from "@/context/guest";
import { SITE_EMAIL, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

type Tab = "loyalty" | "bookings" | "profile";

export function AccountDesk() {
  const { guest, signOut } = useGuest();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("loyalty");

  if (!guest) return null;

  const status = loyaltyStatus(guest.stays);
  const name = guestFullName(guest);

  return (
    <div className="page-wrap page-top grid gap-6 pb-12 lg:grid-cols-[16rem_1fr] lg:gap-8 lg:pb-16">
      <aside>
        <div className="rounded-[10px] border border-bronze/45 p-5 sm:p-6">
          <AccountSkyline />
          <p className="mt-3 font-nav text-lg font-extrabold text-forest">Account Details</p>
          <p className="mt-1 text-[13px] text-neutral-500">{maskEmail(guest.email)}</p>

          <nav className="mt-6 space-y-2.5">
            <SideLink active={tab === "loyalty"} onClick={() => setTab("loyalty")} icon="star">
              Loyalty
            </SideLink>
            <SideLink active={tab === "bookings"} onClick={() => setTab("bookings")} icon="cal">
              Bookings
            </SideLink>
            <SideLink active={tab === "profile"} onClick={() => setTab("profile")} icon="user">
              Profile
            </SideLink>
          </nav>
        </div>

        <div className="mt-8 px-1">
          <p className="font-nav text-sm font-bold text-forest">Need Help?</p>
          <a href={`mailto:${SITE_EMAIL}`} className="mt-2 block text-[14px] font-semibold text-bronze">
            {SITE_EMAIL}
          </a>
          <a href="tel:+919888765776" className="mt-1 block text-[14px] font-semibold text-bronze">
            +91 98887 65776
          </a>
          <ul className="mt-4 space-y-2 text-[13px] text-neutral-500">
            <li>
              <a href={whatsappUrl("Hello Elysium desk")} className="hover:text-forest">
                Chat With Us
              </a>
            </li>
            <li>
              <Link to="/terms" className="hover:text-forest">
                Cancellation Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-forest">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <section className="min-w-0">
        {tab === "loyalty" ? (
          <>
            <h1 className="display-nav text-[clamp(2rem,4vw,2.85rem)] text-bronze">
              Loyalty
            </h1>
            <p className="mt-2 prose-quiet">The more you stay, the less you pay.</p>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <div className="flex flex-col rounded-[10px] border border-bronze/35 bg-white p-6">
                <p className="flex items-center gap-2 font-nav text-lg font-bold text-forest">
                  <BoltIcon />
                  Book direct &amp; pay less.
                </p>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-neutral-600">
                  Complete a stay and get 5% extra off on your next booking.
                </p>
                <Link
                  to="/book"
                  className="nav-cta mt-6 inline-flex w-fit items-center rounded-[10px] border border-bronze px-5 py-2.5 text-bronze"
                >
                  Book Now
                </Link>
              </div>

              <div className="overflow-hidden rounded-[10px] border border-bronze/35 bg-white">
                <div className="relative p-6">
                  <StatusArt />
                  <p className="relative font-nav text-xl font-extrabold tracking-[-0.02em] text-bronze sm:text-2xl">
                    {name}
                  </p>
                  <p className="relative mt-1 text-[14px] text-neutral-500">{status.label}</p>
                </div>
                <div className="flex items-center justify-between bg-bronze px-6 py-3.5 text-ivory">
                  <p className="font-nav text-sm font-bold">{status.staysLabel}</p>
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                    {status.next}
                    <span aria-hidden="true">★</span>
                  </p>
                </div>
              </div>
            </div>

            <h2 className="mt-10 font-nav text-xl font-extrabold text-forest">Your Recent Stays</h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-neutral-500">
              Stays appear here after check-out at Madhapur or Hitec City.
            </p>
            <div className="mt-5 flex flex-col items-center rounded-[10px] border border-neutral-200 bg-neutral-50 px-5 py-10 text-center">
              <p className="prose-quiet">You don&apos;t have any recent stays.</p>
              <button type="button" onClick={() => setTab("bookings")} className="auth-continue mt-6 max-w-xs">
                View All Bookings
              </button>
            </div>
            <p className="mt-5 text-center text-[13px] text-neutral-400">
              Don&apos;t see a recent stay here?{" "}
              <a href={`mailto:${SITE_EMAIL}`} className="underline">
                Contact Support
              </a>
            </p>
          </>
        ) : null}

        {tab === "bookings" ? (
          <>
            <h1 className="display-nav text-[clamp(2rem,4vw,2.85rem)] text-bronze">
              Bookings
            </h1>
            <p className="mt-2 prose-quiet">Requests and confirmed stays, in one place.</p>
            <div className="mt-8 flex flex-col items-center rounded-[10px] border border-neutral-200 bg-neutral-50 px-5 py-12 text-center">
              <p className="prose-quiet">No bookings yet.</p>
              <Link to="/book" className="auth-continue mt-6 max-w-xs inline-flex items-center justify-center">
                Book a stay
              </Link>
            </div>
          </>
        ) : null}

        {tab === "profile" ? (
          <>
            <h1 className="display-nav text-[clamp(2rem,4vw,2.85rem)] text-bronze">
              Profile
            </h1>
            <p className="mt-2 prose-quiet">Your membership details on this device.</p>
            <div className="mt-8 max-w-lg space-y-4 rounded-[10px] border border-bronze/30 bg-white p-6">
              <p className="flex h-11 w-11 items-center justify-center rounded-full bg-bronze font-nav text-sm font-bold text-ivory">
                {guestInitials(guest)}
              </p>
              <p className="font-nav text-xl font-bold text-forest">{name}</p>
              <p className="text-[14px] text-neutral-500">{guest.email}</p>
              <p className="text-[14px] text-neutral-500">{guest.mobile}</p>
              <button
                type="button"
                className="text-[13px] text-neutral-500 underline"
                onClick={() => {
                  signOut();
                  void navigate({ to: "/" });
                }}
              >
                Sign out
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}

function SideLink({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: "star" | "cal" | "user";
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[10px] border px-4 py-3 text-left font-nav text-[15px] font-bold",
        active
          ? "border-bronze bg-bronze text-ivory"
          : "border-bronze/40 bg-white text-forest hover:border-bronze",
      )}
    >
      {icon === "star" ? <span aria-hidden="true">★</span> : null}
      {icon === "cal" ? (
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
          <rect x="2" y="3.5" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2 7 h12 M5.5 2 v3 M10.5 2 v3" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ) : null}
      {icon === "user" ? (
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
          <circle cx="8" cy="5.5" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M3.2 13.2 C4.4 10.8 6 9.8 8 9.8 S11.6 10.8 12.8 13.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 text-forest" aria-hidden="true">
      <path d="M9 1.5 L4 9 h4 L7 14.5 L12 7 H8 Z" fill="currentColor" />
    </svg>
  );
}

function AccountSkyline() {
  return (
    <svg viewBox="0 0 200 56" className="h-10 w-full text-neutral-300" fill="none" aria-hidden="true">
      <path d="M8 48 V22 h22 V48 M30 30 h28 V48 M58 18 h24 V48 M96 26 h20 V48 M128 14 h36 V48" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function StatusArt() {
  return (
    <svg
      viewBox="0 0 240 90"
      className="pointer-events-none absolute top-2 right-2 h-24 w-40 text-bronze/25"
      fill="none"
      aria-hidden="true"
    >
      <path d="M20 78 V36 h28 V78 M48 48 h40 V78 M100 28 h32 V78" stroke="currentColor" strokeWidth="1.4" />
      <rect x="150" y="50" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M156 50 v-8 h24 v8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
