import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Guest = {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  stays: number;
};

type GuestContextValue = {
  guest: Guest | null;
  ready: boolean;
  signIn: (guest: Guest) => void;
  updateGuest: (partial: Partial<Guest>) => void;
  signOut: () => void;
};

const SESSION_KEY = "elysium-loyalty-session";
const GUESTS_KEY = "elysium-loyalty-guests";

const GuestContext = createContext<GuestContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeGuest(raw: unknown): Guest | null {
  if (!raw || typeof raw !== "object") return null;
  const g = raw as Record<string, unknown>;
  if (typeof g.email !== "string") return null;
  if (typeof g.firstName === "string" && typeof g.lastName === "string") {
    return {
      email: g.email,
      firstName: g.firstName,
      lastName: g.lastName,
      mobile: typeof g.mobile === "string" ? g.mobile : "",
      stays: typeof g.stays === "number" ? g.stays : 0,
    };
  }
  if (typeof g.name === "string") {
    const [first = g.name, ...rest] = g.name.split(" ");
    return {
      email: g.email,
      firstName: first,
      lastName: rest.join(" "),
      mobile: "",
      stays: 0,
    };
  }
  return null;
}

export function findSavedGuest(email: string): Guest | null {
  const guests = readJson<Record<string, unknown>>(GUESTS_KEY, {});
  return normalizeGuest(guests[email.toLowerCase()]);
}

export function guestFullName(guest: Guest) {
  return `${guest.firstName} ${guest.lastName}`.trim();
}

export function guestInitials(guest: Guest) {
  return `${guest.firstName.charAt(0)}${guest.lastName.charAt(0)}`.toUpperCase();
}

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const keep = Math.min(2, user.length);
  return `${user.slice(0, keep)}${"*".repeat(Math.max(6, user.length - keep))}@${domain}`;
}

export function loyaltyStatus(stays: number) {
  if (stays < 1) {
    return { label: "New Guest", staysLabel: "0 Stays", next: "1 stay to House Guest" };
  }
  if (stays < 4) {
    const left = 4 - stays;
    return {
      label: "House Guest",
      staysLabel: `${stays} Stay${stays === 1 ? "" : "s"}`,
      next: `${left} stay${left === 1 ? "" : "s"} to Return Stay`,
    };
  }
  if (stays < 10) {
    const left = 10 - stays;
    return {
      label: "Return Stay",
      staysLabel: `${stays} Stays`,
      next: `${left} stay${left === 1 ? "" : "s"} to House Regular`,
    };
  }
  return { label: "House Regular", staysLabel: `${stays} Stays`, next: "Top tier unlocked" };
}

export function GuestProvider({ children }: { children: React.ReactNode }) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setGuest(normalizeGuest(readJson(SESSION_KEY, null)));
    setReady(true);
  }, []);

  const persist = useCallback((next: Guest) => {
    const guests = readJson<Record<string, Guest>>(GUESTS_KEY, {});
    guests[next.email.toLowerCase()] = next;
    localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setGuest(next);
  }, []);

  const signIn = useCallback(
    (next: Guest) => {
      persist(next);
    },
    [persist],
  );

  const updateGuest = useCallback(
    (partial: Partial<Guest>) => {
      if (!guest) return;
      persist({ ...guest, ...partial });
    },
    [guest, persist],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setGuest(null);
  }, []);

  const value = useMemo(
    () => ({ guest, ready, signIn, updateGuest, signOut }),
    [guest, ready, signIn, updateGuest, signOut],
  );

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be used within GuestProvider");
  return ctx;
}
