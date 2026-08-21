import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";

const title = "Book Now — Elysium Hotels, Hyderabad";
const description =
  "Book direct at Elysium Studio Suites, Madhapur or Elysium Premier Suites, Hitec City. Pick a house, choose a suite and reserve with taxes and breakfast included.";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

function BookPage() {
  return (
    <HotelProvider>
      <Nav />
      <main className="relative bg-background">
        <Booking />
      </main>
      <Footer />
    </HotelProvider>
  );
}
