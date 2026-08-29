import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { useGuest } from "@/context/guest";
import { Nav } from "@/components/Nav";
import { AccountDesk } from "@/components/account/AccountDesk";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { pageMeta } from "@/lib/site";

const title = "Your Elysium — Loyalty & Bookings";
const description = "Manage Elysium loyalty, bookings and profile for Madhapur and Hitec City.";

export const Route = createFileRoute("/account")({
  head: () => ({
    ...pageMeta({ title, description, path: "/account" }),
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountRoute,
});

function AccountRoute() {
  return (
    <HotelProvider>
      <Nav />
      <AccountGate />
      <WhatsAppFloat />
    </HotelProvider>
  );
}

function AccountGate() {
  const { guest, ready } = useGuest();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    if (!guest) void navigate({ to: "/" });
  }, [ready, guest, navigate]);

  if (!ready || !guest) {
    return <main className="min-h-[60svh] bg-ivory" />;
  }

  return (
    <main className="relative min-h-[100svh] bg-ivory">
      <AccountDesk />
    </main>
  );
}
