import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { WhyPage } from "@/components/sections/WhyPage";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { pageMeta } from "@/lib/site";

const title = "Why Elysium — The 4B Standard in Hyderabad";
const description =
  "Why guests choose Elysium: two houses, a 4.7★ rating, the 4B standard, and a front desk that answers.";

export const Route = createFileRoute("/why")({
  head: () => pageMeta({ title, description, path: "/why" }),
  component: WhyRoute,
});

function WhyRoute() {
  return (
    <HotelProvider>
      <Nav />
      <main className="relative bg-ivory">
        <WhyPage />
      </main>
      <Footer />
      <WhatsAppFloat />
    </HotelProvider>
  );
}
