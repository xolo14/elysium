import { createFileRoute } from "@tanstack/react-router";
import { HotelProvider } from "@/context/hotel";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LegalPage } from "@/components/sections/LegalPage";
import { pageMeta, SITE_EMAIL } from "@/lib/site";

const title = "Privacy Policy — Elysium Hotels";
const description =
  "How Elysium Hotels collects and uses guest information for bookings, stay management and communication in Hyderabad.";

export const Route = createFileRoute("/privacy")({
  head: () => pageMeta({ title, description, path: "/privacy" }),
  component: PrivacyRoute,
});

function PrivacyRoute() {
  return (
    <HotelProvider>
      <Nav />
      <main className="relative bg-background">
        <LegalPage
          title="Privacy Policy"
          updated="28 August 2026"
          intro="This policy explains what personal information we collect when you browse our website, enquire about a stay, or book with Elysium Studio Suites (Madhapur) or Elysium Premier Suites (Hitec City)."
          sections={[
            {
              heading: "Who we are",
              body: [
                `Elysium Hotels operates two serviced-suite houses in Hyderabad. For privacy questions, contact ${SITE_EMAIL}.`,
              ],
            },
            {
              heading: "Information we collect",
              body: [
                "Booking and enquiry forms may collect your name, email address, phone number, preferred property, suite type, stay dates, guest count and any notes you share.",
                "Technical data such as browser type, device and approximate location may be collected automatically by our hosting provider for security and performance.",
              ],
            },
            {
              heading: "How we use your information",
              body: [
                "We use your details to respond to enquiries, confirm bookings, arrange your stay, issue invoices, and communicate about your reservation.",
                "We do not sell your personal information. We may share it with trusted service providers who help us operate email, hosting or payments, only as needed to fulfil your request.",
              ],
            },
            {
              heading: "Retention",
              body: [
                "Booking records are kept as long as required for guest service, accounting and legal obligations, then deleted or anonymised when no longer needed.",
              ],
            },
            {
              heading: "Your choices",
              body: [
                "You may request access, correction or deletion of personal data we hold about you by emailing us. We may need to retain certain records where the law requires it.",
              ],
            },
            {
              heading: "Updates",
              body: [
                "We may update this policy from time to time. The “last updated” date at the top of this page will change when we do.",
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
