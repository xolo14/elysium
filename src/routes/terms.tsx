import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMeta, SITE_EMAIL } from "@/lib/site";

const title = "Terms of Stay — Elysium Hotels";
const description =
  "Terms for booking and staying at Elysium Studio Suites, Madhapur and Elysium Premier Suites, Hitec City.";

export const Route = createFileRoute("/terms")({
  head: () => pageMeta({ title, description, path: "/terms" }),
  component: TermsRoute,
});

function TermsRoute() {
  return (
    <HotelProvider>
      <Nav />
      <main className="relative bg-background">
        <LegalPage
          title="Terms of Stay"
          updated="28 August 2026"
          intro="These terms apply when you request or confirm a stay at Elysium Studio Suites (Madhapur) or Elysium Premier Suites (Hitec City). Submitting a booking request does not guarantee a room until the front desk confirms availability and rates."
          sections={[
            {
              heading: "Booking requests",
              body: [
                "Online forms send an enquiry to our desk. Confirmation, final rates and payment instructions are provided by phone, WhatsApp or email after we check availability.",
                "Quoted website rates are indicative “from” prices and may vary by dates, suite type and length of stay. Taxes are included where stated.",
              ],
            },
            {
              heading: "Check-in and check-out",
              body: [
                "Standard check-in is from 2:00 pm and check-out by 11:00 am, unless otherwise agreed. Early check-in or late check-out depends on availability and may carry a fee.",
                "A valid government photo ID is required at check-in for all guests.",
              ],
            },
            {
              heading: "Cancellation",
              body: [
                "Direct bookings can usually be cancelled free of charge up to 24 hours before arrival. Specific terms for long stays or special rates will be stated in your confirmation.",
              ],
            },
            {
              heading: "House rules",
              body: [
                "Guests are responsible for reasonable care of the suite and furnishings. Damages beyond normal wear may be charged.",
                "Quiet hours and building policies apply. Smoking policies follow house rules shared at check-in.",
              ],
            },
            {
              heading: "Liability",
              body: [
                "We take care to keep the houses safe and well maintained. To the extent permitted by law, we are not liable for loss of personal belongings left unattended. Use the in-suite safe and front desk lockers where available.",
              ],
            },
            {
              heading: "Contact",
              body: [
                `For booking or stay questions, email ${SITE_EMAIL} or call the number listed for your house on the contact page.`,
              ],
            },
          ]}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </HotelProvider>
  );
}
