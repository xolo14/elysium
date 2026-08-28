import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { HotelProvider, useHotel } from "@/context/hotel";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { ValueStay } from "@/components/sections/ValueStay";
import { HotelSelector } from "@/components/sections/HotelSelector";
import { WhatMakesUs } from "@/components/sections/WhatMakesUs";
import { FourBHighlight } from "@/components/sections/FourBHighlight";
import { Amenities } from "@/components/sections/Amenities";
import { SocialProof } from "@/components/sections/SocialProof";
import { MediaLogos } from "@/components/sections/MediaLogos";
import { FaqBand } from "@/components/sections/FaqBand";
import { Partnerships } from "@/components/sections/Partnerships";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { pageMeta, SITE_EMAIL } from "@/lib/site";

const title = "Elysium Hotels Hyderabad — Studio & Premier Suites";
const description =
  "Serviced suites in Hyderabad: Elysium Studio Suites, Madhapur and Elysium Premier Suites, Hitec City. Kitchenettes, complimentary breakfast and direct booking.";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageMeta({ title, description, path: "/" }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: "Elysium Hotels",
          description,
          telephone: "+91 98887 65776",
          email: SITE_EMAIL,
          url: "https://elysiumhotel.grootdigitals.com/",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Plot no. 744, Road No. 40, Ayyappa Society, Madhapur",
            addressLocality: "Hyderabad",
            addressRegion: "Telangana",
            postalCode: "500081",
            addressCountry: "IN",
          },
          amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
            { "@type": "LocationFeatureSpecification", name: "Complimentary breakfast" },
            { "@type": "LocationFeatureSpecification", name: "Kitchenette" },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function SwitchVeil() {
  const { switching } = useHotel();
  return (
    <AnimatePresence>
      {switching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[75] bg-forest"
        />
      )}
    </AnimatePresence>
  );
}

function Index() {
  return (
    <HotelProvider>
      <SwitchVeil />
      <Nav />
      <main className="relative">
        <Hero />
        <HotelSelector />
        <WhatMakesUs />
        <FourBHighlight />
        <ValueStay />
        <Amenities />
        <SocialProof />
        <MediaLogos />
        <FaqBand />
        <Partnerships />
      </main>
      <Footer />
      <WhatsAppFloat />
    </HotelProvider>
  );
}
