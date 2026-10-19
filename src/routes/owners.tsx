import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { OwnersPage } from "@/components/sections/OwnersPage";
import { Partnerships } from "@/components/sections/Partnerships";
import { Footer } from "@/components/sections/Footer";
import { pageMeta } from "@/lib/site";

const title = "Developers & Owners: Partner with Elysium Hotels";
const description =
  "Partner with Elysium to operate Studio Suites and Premier Suites in Hyderabad. One 4B standard, a named desk, and a long operating relationship.";

export const Route = createFileRoute("/owners")({
  head: () => pageMeta({ title, description, path: "/owners" }),
  component: OwnersRoute,
});

function OwnersRoute() {
  return (
    <HotelProvider>
      <Nav />
      <main className="relative bg-ivory">
        <OwnersPage />
        <Partnerships />
      </main>
      <Footer />
    </HotelProvider>
  );
}
