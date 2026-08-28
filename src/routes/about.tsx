import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { AboutPage } from "@/components/sections/AboutPage";
import { Footer } from "@/components/sections/Footer";

const title = "About Elysium Hotels — Madhapur & Hitec City";
const description =
  "About Elysium: two serviced-suite houses in Hyderabad, one 4B standard, and hospitality kept personal for guests, corporates and partners.";

export const Route = createFileRoute("/about")({
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
    </HotelProvider>
  );
}
