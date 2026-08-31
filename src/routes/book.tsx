import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { Booking } from "@/components/sections/Booking";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { pageMeta } from "@/lib/site";

const title = "Book Now — Elysium Hotels, Hyderabad";
const description =
  "Book direct at Elysium Studio Suites, Madhapur or Elysium Premier Suites, Hitec City. Pick a house, choose a suite and reserve with taxes and breakfast included.";

type BookSearch = {
  hotel?: string;
  suite?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
};

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => {
    const guestsRaw = search.guests;
    const guests =
      typeof guestsRaw === "number"
        ? guestsRaw
        : typeof guestsRaw === "string"
          ? Number(guestsRaw)
          : undefined;
    return {
      hotel: typeof search.hotel === "string" ? search.hotel : undefined,
      suite: typeof search.suite === "string" ? search.suite : undefined,
      checkIn: typeof search.checkIn === "string" ? search.checkIn : undefined,
      checkOut: typeof search.checkOut === "string" ? search.checkOut : undefined,
      guests: Number.isFinite(guests) ? guests : undefined,
    };
  },
  head: () => pageMeta({ title, description, path: "/book" }),
  component: BookPage,
});

function BookPage() {
  const search = Route.useSearch();
  return (
    <HotelProvider>
      <Nav />
      <main className="relative bg-ivory">
        <Booking
          initialHotelSlug={search.hotel}
          initialSuite={search.suite}
          initialCheckIn={search.checkIn}
          initialCheckOut={search.checkOut}
          initialGuests={search.guests}
        />
      </main>
      <WhatsAppFloat raised />
    </HotelProvider>
  );
}
