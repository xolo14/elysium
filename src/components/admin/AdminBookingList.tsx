import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";

import type { AdminBooking } from "@/lib/bookings-shared";
import { formatDate, formatInr, statusLabel } from "@/lib/bookings-shared";
import { cn } from "@/lib/utils";
import {
  adminCancelBooking,
  adminCheckIn,
  adminCheckOut,
  adminLogout,
} from "@/server/admin";

type AdminShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  activeTab: "reservations" | "history";
};

export function AdminShell({ title, subtitle, children, activeTab }: AdminShellProps) {
  const router = useRouter();

  const onLogout = async () => {
    await adminLogout();
    await router.navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-forest text-ivory">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-10">
          <div>
            <p className="eyebrow text-ivory/60">Elysium Admin</p>
            <h1 className="font-display text-2xl sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-ivory/70">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="eyebrow border border-ivory/30 px-4 py-2 transition-colors hover:bg-ivory hover:text-forest"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="eyebrow border border-ivory/30 px-4 py-2 transition-colors hover:bg-ivory hover:text-forest"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1400px] gap-6 px-5 pb-4 sm:px-10">
          <Link
            to="/admin"
            className={cn(
              "eyebrow border-b-2 pb-2 transition-colors",
              activeTab === "reservations"
                ? "border-accent text-accent"
                : "border-transparent text-ivory/60 hover:text-ivory",
            )}
          >
            Reservations
          </Link>
          <Link
            to="/admin/history"
            className={cn(
              "eyebrow border-b-2 pb-2 transition-colors",
              activeTab === "history"
                ? "border-accent text-accent"
                : "border-transparent text-ivory/60 hover:text-ivory",
            )}
          >
            History
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 py-10 sm:px-10">{children}</main>
    </div>
  );
}

type BookingListProps = {
  bookings: AdminBooking[];
  mode: "active" | "history";
  onUpdated: () => Promise<void>;
};

export function AdminBookingList({ bookings, mode, onUpdated }: BookingListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAction = async (bookingId: string, action: () => Promise<unknown>) => {
    setBusyId(bookingId);
    setError(null);
    try {
      await action();
      await onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  if (!bookings.length) {
    return (
      <div className="border border-border bg-secondary p-10 text-center">
        <p className="font-display text-2xl">
          {mode === "active" ? "No active reservations" : "No stay history yet"}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {mode === "active"
            ? "New booking requests from the website will appear here."
            : "Completed check-outs will be listed here."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {bookings.map((booking) => (
        <article key={booking.id} className="border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-muted-foreground">
                {booking.hotelName} · {booking.hotelPlace}
              </p>
              <h2 className="mt-2 font-display text-2xl">{booking.guestName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{booking.suiteName}</p>
            </div>
            <span className="eyebrow border border-border px-3 py-1.5">
              {statusLabel(booking.status)}
            </span>
          </div>

          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="eyebrow text-muted-foreground">Check-in</dt>
              <dd className="mt-1">{formatDate(booking.checkIn)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Check-out</dt>
              <dd className="mt-1">{formatDate(booking.checkOut)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Guests</dt>
              <dd className="mt-1">
                {booking.guests} · {booking.nights} night{booking.nights === 1 ? "" : "s"}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Total</dt>
              <dd className="mt-1 font-display text-lg">{formatInr(booking.totalPaise)}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Email</dt>
              <dd className="mt-1">{booking.guestEmail}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Phone</dt>
              <dd className="mt-1">{booking.guestPhone}</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted-foreground">Reference</dt>
              <dd className="mt-1 font-mono text-xs">{booking.id.slice(0, 8)}</dd>
            </div>
            {booking.checkedInAt && (
              <div>
                <dt className="eyebrow text-muted-foreground">Checked in</dt>
                <dd className="mt-1">{formatDate(booking.checkedInAt)}</dd>
              </div>
            )}
            {booking.checkedOutAt && (
              <div>
                <dt className="eyebrow text-muted-foreground">Checked out</dt>
                <dd className="mt-1">{formatDate(booking.checkedOutAt)}</dd>
              </div>
            )}
          </dl>

          {mode === "active" && (
            <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
              {(booking.status === "pending" || booking.status === "confirmed") && (
                <>
                  <button
                    type="button"
                    disabled={busyId === booking.id}
                    onClick={() =>
                      runAction(booking.id, () =>
                        adminCheckIn({ data: { bookingId: booking.id } }),
                      )
                    }
                    className="eyebrow bg-forest px-5 py-3 text-ivory transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    Check in
                  </button>
                  <button
                    type="button"
                    disabled={busyId === booking.id}
                    onClick={() =>
                      runAction(booking.id, () =>
                        adminCancelBooking({ data: { bookingId: booking.id } }),
                      )
                    }
                    className="eyebrow border border-border px-5 py-3 transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              {booking.status === "checked_in" && (
                <button
                  type="button"
                  disabled={busyId === booking.id}
                  onClick={() =>
                    runAction(booking.id, () =>
                      adminCheckOut({ data: { bookingId: booking.id } }),
                    )
                  }
                  className="eyebrow bg-accent px-5 py-3 text-forest transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Check out
                </button>
              )}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
