import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { AboutPage } from "@/components/sections/AboutPage";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { pageMeta } from "@/lib/site";

const title = "About Elysium Hotels — Madhapur & Hitec City";
const description =
  "About Elysium: two serviced-suite houses in Hyderabad, one 4B standard, and hospitality kept personal for guests, corporates and partners.";

export const Route = createFileRoute("/about")({
  head: () => pageMeta({ title, description, path: "/about" }),
  component: AboutRoute,
});

function AboutRoute() {
  return (
    <HotelProvider>
      <Nav />
      <main className="relative bg-ivory">
        <AboutPage />
      </main>
      <Footer />
      <WhatsAppFloat />
    </HotelProvider>
  );
}
